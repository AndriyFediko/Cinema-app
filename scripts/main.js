import { supabase } from "./supabase.js";
import { addCards } from "./addFilmCards.js";
import { showTicketsMenu } from "./buyTicketsMenu.js";
import { changeImage } from "./slider.js";
import { renderSeats } from "./renderSeats.js";
import { renderMyTicketsCards } from "./myTicketsMenu.js";

const userProfileSection = document.getElementById("user-profile-section");
const loginLink = document.getElementById("loginLink");
const userNameDisplay = document.getElementById("userNameDisplay");
const logoutBtn = document.getElementById("logoutBtn");
const burgerUserProfileSection = document.getElementById("burger-user-profile-section");
const burgerLoginLink = document.getElementById("burgerLoginLink");
const burgerUserNameDisplay = document.getElementById("burgerUserNameDisplay");
const burgerLogoutBtn = document.getElementById("burgerLogoutBtn");

function updateUserUI(user) {
    const authState = user && typeof user === "object" ? "logged_in" : "logged_out";

    switch (authState) {
        case "logged_in":
            const name = user.user_metadata?.full_name || "Користувач";
            if (loginLink) loginLink.style.display = "none";
            if (userProfileSection) {
                userProfileSection.style.display = "block";
                if (userNameDisplay) userNameDisplay.textContent = name;
            }
            if (burgerLoginLink) burgerLoginLink.style.display = "none";
            if (burgerUserProfileSection) {
                burgerUserProfileSection.style.display = "block";
                if (burgerUserNameDisplay) burgerUserNameDisplay.textContent = name;
            }
            break;

        case "logged_out":
            if (loginLink) loginLink.style.display = "flex";
            if (userProfileSection) userProfileSection.style.display = "none";
            if (burgerLoginLink) burgerLoginLink.style.display = "flex";
            if (burgerUserProfileSection) burgerUserProfileSection.style.display = "none";
            break;

        default:
            console.log("Помилка визначення стану авторизації.");
            break;
    }
}

async function checkCurrentSession() {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    updateUserUI(session ? session.user : null);
}
checkCurrentSession();

supabase.auth.onAuthStateChange((event, session) => {
    updateUserUI(session ? session.user : null);
});

const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    window.location.reload();
};

if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
if (burgerLogoutBtn) burgerLogoutBtn.addEventListener("click", handleLogout);

const filmCardsContainer = document.getElementById("films-section");
const bookingModalCloseBtn = document.getElementById("bookingModalCloseBtn");
const buyTicketsPopUp = document.getElementById("bookingModal");
const bookingModalTrailer = document.getElementById("booking-modal__trailer");
const body = document.getElementById("body");
const sliderBtn = document.getElementById("sliderBtn");
const selectTime = document.getElementById("booking-modal__times");
const buyTicketsBtn = document.getElementById("buyTicketsBtn");
const seatsContainer = document.getElementById("seats-container");
const myTicketsMenu = document.getElementById("myTicketsMenu");
const myTicketsBtn = document.getElementById("myTicketsBtn");
const myTicketsMenuClose = document.getElementById("myTicketsMenuClose");
const myTicketsBurgerBtn = document.getElementById("myTicketsBurgerBtn");

let cardID;
let moviesArr = [];
let slideNumber = 0;

const TicketManager = (function () {
    let _ticketsPrice = 0;

    return {
        addPrice: function (price) {
            _ticketsPrice += price;
            return _ticketsPrice;
        },
        subtractPrice: function (price) {
            _ticketsPrice -= price;
            if (_ticketsPrice < 0) _ticketsPrice = 0;
            return _ticketsPrice;
        },
        resetPrice: function () {
            _ticketsPrice = 0;
        },
        getTotal: function () {
            return _ticketsPrice;
        },
    };
})();

async function loadMoviesFromDB() {
    const { data: movies, error } = await supabase.from("movies").select("*").order("id", { ascending: true });

    if (error) {
        console.error("Помилка завантаження фільмів:", error.message);
        return;
    }

    moviesArr = movies;

    if (moviesArr.length > 0) {
        addCards(moviesArr);
        initSlider();
    }
}

function initSlider() {
    changeImage({
        url: moviesArr[slideNumber].mainImageUrl,
        title: moviesArr[slideNumber].title,
    });

    setInterval(() => {
        if (slideNumber < moviesArr.length - 1) {
            slideNumber++;
        } else {
            slideNumber = 0;
        }
        changeImage({
            url: moviesArr[slideNumber].mainImageUrl,
            title: moviesArr[slideNumber].title,
        });
    }, 10000);
}

loadMoviesFromDB();

filmCardsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("button")) {
        const dbId = Number(e.target.closest(".film-card").id.slice(1));

        cardID = moviesArr.findIndex((movie) => movie.id === dbId);

        if (cardID !== -1) {
            showTicketsMenu(moviesArr[cardID]);
            renderSeats(moviesArr[cardID]);
        }
    }
});

bookingModalCloseBtn.addEventListener("click", () => {
    buyTicketsPopUp.style.display = "none";
    if (moviesArr.length > 0) {
        bookingModalTrailer.innerHTML = moviesArr[0].trailerUrl;
    }
    body.style.overflow = "";
    document.documentElement.style.overflow = "";
    TicketManager.resetPrice();
    buyTicketsBtn.textContent = `Придбати квитки`;
});

sliderBtn.addEventListener("click", () => {
    showTicketsMenu(moviesArr[slideNumber]);
    renderSeats(moviesArr[slideNumber]);
    cardID = slideNumber;
});

selectTime.addEventListener("click", (e) => {
    if (!e.target.classList.contains("time-pill--active") && e.target.classList.contains("time-pill")) {
        TicketManager.resetPrice();
        const selectTimeButtons = document.querySelectorAll(".time-pill");
        selectTimeButtons.forEach((btn) => {
            btn.classList.remove("time-pill--active");
        });
        e.target.classList.add("time-pill--active");
        renderSeats(moviesArr[cardID]);
        buyTicketsBtn.textContent = `Придбати квитки`;
    }
});

seatsContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("seat--occupied") && e.target.classList.contains("seat") && !e.target.classList.contains("seat--booked")) {
        if (e.target.classList.contains("seat--selected")) {
            e.target.classList.remove("seat--selected");
            const currentTotal = TicketManager.subtractPrice(moviesArr[cardID].price);
            buyTicketsBtn.textContent = `Придбати квитки - ${currentTotal / moviesArr[cardID].price}шт ${currentTotal} грн`;
            if (currentTotal == 0) {
                buyTicketsBtn.textContent = `Придбати квитки`;
            }
        } else {
            e.target.classList.add("seat--selected");
            const currentTotal = TicketManager.addPrice(moviesArr[cardID].price);
            buyTicketsBtn.textContent = `Придбати квитки - ${currentTotal / moviesArr[cardID].price}шт ${currentTotal} грн`;
        }
    }
});

buyTicketsBtn.addEventListener("click", async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        alert("Будь ласка, увійдіть в акаунт, щоб купити квитки!");
        return;
    }

    const seats = document.querySelectorAll(".seat");
    const selectedTickets = [];
    const timeBtnActive = document.querySelector(".time-pill--active").textContent;

    seats.forEach((seat, index) => {
        if (seat.classList.contains("seat--selected") && !seat.classList.contains("seat--example")) {
            selectedTickets.push({
                user_id: user.id,
                movie_id: moviesArr[cardID].id,
                movie_title: moviesArr[cardID].title,
                session_time: timeBtnActive,
                seat_index: index + 1,
                row_number: Number(seat.dataset.row),
                seat_number: Number(seat.dataset.seat),
            });
        }
    });

    if (selectedTickets.length === 0) return;

    const { error } = await supabase.from("tickets").insert(selectedTickets);

    if (error) {
        console.error("Помилка при купівлі:", error.message);
        alert("Сталася помилка при бронюванні.");
    } else {
        buyTicketsBtn.textContent = `Оплата успішна!`;
        document.querySelectorAll(".seat--selected").forEach((s) => {
            s.classList.remove("seat--selected");
            s.classList.add("seat--booked");
        });
        TicketManager.resetPrice();

        alert("Квитки успішно заброньовані!");
    }
});

myTicketsBtn.addEventListener("click", () => {
    myTicketsMenu.classList.add("is-open");
    renderMyTicketsCards(moviesArr);
});

myTicketsMenuClose.addEventListener("click", () => {
    myTicketsMenu.classList.remove("is-open");
});

myTicketsBurgerBtn.addEventListener("click", () => {
    myTicketsMenu.classList.add("is-open");
});

function checkAdminRoute() {
    if (window.location.hash === "#admin") {
        window.location.href = "./pages/admin.html";
    }
}

checkAdminRoute();

window.addEventListener("hashchange", checkAdminRoute);