import { supabase } from "./supabase.js";
import { addCards } from "./addFilmCards.js";
import { showTicketsMenu } from "./buyTicketsMenu.js";
import { changeImage } from "./slider.js";
import { renderSeats } from "./renderSeats.js";
import { renderMyTicketsCards } from "./myTicketsMenu.js";

const userProfileSection = document.getElementById('user-profile-section');
const loginLink = document.getElementById('loginLink');
const userNameDisplay = document.getElementById('userNameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const burgerUserProfileSection = document.getElementById('burger-user-profile-section');
const burgerLoginLink = document.getElementById('burgerLoginLink');
const burgerUserNameDisplay = document.getElementById('burgerUserNameDisplay');
const burgerLogoutBtn = document.getElementById('burgerLogoutBtn');
const burgerMenuMainPage = document.getElementById("burger-menu-main-page");
const burgerMenuFilmsSection = document.getElementById("burger-menu-films-section");
const burgerMenuFooter = document.getElementById("burger-menu-footer");

function updateUserUI(user) {
    if (user) {
        const name = user.user_metadata?.full_name || 'Користувач';
        
        if (loginLink) loginLink.style.display = 'none';
        if (userProfileSection) {
            userProfileSection.style.display = 'block';
            if (userNameDisplay) userNameDisplay.textContent = name;
        }

        if (burgerLoginLink) burgerLoginLink.style.display = 'none';
        if (burgerUserProfileSection) {
            burgerUserProfileSection.style.display = 'block';
            if (burgerUserNameDisplay) burgerUserNameDisplay.textContent = name;
        }
    } else {
        if (loginLink) loginLink.style.display = 'flex';
        if (userProfileSection) userProfileSection.style.display = 'none';
        
        if (burgerLoginLink) burgerLoginLink.style.display = 'flex';
        if (burgerUserProfileSection) burgerUserProfileSection.style.display = 'none';
    }
}

async function checkCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
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

if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (burgerLogoutBtn) burgerLogoutBtn.addEventListener('click', handleLogout);

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
let ticketsPrice = 0;

let moviesArr = [
    {
        id: 1,
        title: "Interstellar",
        genre: "Науково-фантастичний фільм",
        time: ["15:00"],
        price: 170,
        thumbnailUrl: "./images/interstellarThumbnail.webp",
        mainImageUrl: "./images/interstellarMain.webp",
        description: "Коли ресурси Землі вичерпуються, група дослідників вирушає у найважливішу місію в історії людства: подорож за межі нашої галактики, щоб дізнатися, чи є у людства майбутнє серед зірок. Візуальний шедевр про час, любов та виживання.",
        trailerUrl: `<iframe loading="lazy" width="560" height="315" src="https://www.youtube-nocookie.com/embed/I9fucTH5xWw?si=epsJJ7FMoh3btDAr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
        occupiedSeats: [
            {
                time: "15:00",
                seats: [1, 2, 3, 8, 10, 12, 13],
            },
        ],
        selectedSeats: [
            {
                time: "15:00",
                seats: [],
                selectedSeatsLog: [],
            },
        ],
    },
    {
        id: 2,
        title: "Засновник",
        genre: "біографічна драма",
        time: ["18:00", "19:30"],
        price: 200,
        thumbnailUrl: "./images/theFounderThumbnail.webp",
        mainImageUrl: "./images/theFounderMain.webp",
        description: "Вражаюча історія Рея Крока, невдачливого комівояжера, який зустрів братів МакДональдів і побачив у їхній інноваційній системі приготування бургерів потенціал для створення величезної імперії. Шлях від маленької закусочної до світового лідера фастфуду.",
        trailerUrl: `<iframe loading="lazy" width="560" height="315" src="https://www.youtube-nocookie.com/embed/AX2uz2XYkbo?si=fLmOyvraoME05ndz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
        occupiedSeats: [
            {
                time: "18:00",
                seats: [1, 2, 3, 8, 10, 12, 13, 21],
            },
            {
                time: "19:30",
                seats: [1, 2, 3, 12, 13],
            },
        ],
        selectedSeats: [
            {
                time: "18:00",
                seats: [],
                selectedSeatsLog: [],
            },
            {
                time: "19:30",
                seats: [],
                selectedSeatsLog: [],
            },
        ],
    },
    {
        id: 3,
        title: "Зоотрополіс 2",
        genre: "Пригодницький мультфільм",
        time: ["11:00", "13:00"],
        price: 160,
        thumbnailUrl: "./images/zooTopiaThumbnail.webp",
        mainImageUrl: "./images/zooTopiaMain.webp",
        description: "Хоробрі поліцейські Джуді Лаввіл та Нік Вайлд повертаються! Цього разу їм доведеться розплутати найскладнішу справу в історії міста, яка загрожує зруйнувати крихкий мир між хижаками та травоїдними. Нові герої, ще більше гумору та детективних загадок.",
        trailerUrl: `<iframe loading="lazy" width="560" height="315" src="https://www.youtube-nocookie.com/embed/y985bpg3h7U?si=dwtWhAGPJOECLM2O" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
        occupiedSeats: [
            {
                time: "11:00",
                seats: [1, 3, 4, 6, 8, 9, 12, 13],
            },
            {
                time: "13:00",
                seats: [1, 2, 3, 11, 12, 13],
            },
        ],
        selectedSeats: [
            {
                time: "11:00",
                seats: [],
                selectedSeatsLog: [],
            },
            {
                time: "13:00",
                seats: [],
                selectedSeatsLog: [],
            },
        ],
        selectedSeatsLog: [],
    },
    {
        id: 4,
        title: "Як приборкати дракона",
        genre: "Пригодницький мультфільм",
        time: ["14:00", "18:00"],
        price: 180,
        thumbnailUrl: "./images/howToTameADreagonThumbnail.webp",
        mainImageUrl: "./images/howToTameADragonAMain.webp",
        description: "Історія дружби молодого вікінга Гикавки, який не хоче бути вбивцею драконів, та пораненого дракона Нічної Люті. Разом вони змінять уявлення свого племені про ворогів та доведуть, що мир можливий, якщо відкрити своє серце невідомому.",
        trailerUrl: `<iframe loading="lazy" width="560" height="315" src="https://www.youtube-nocookie.com/embed/2AKsAxrhqgM?si=srOv_o7CddNYnD-m" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
        occupiedSeats: [
            {
                time: "14:00",
                seats: [2, 3, 4, 6, 8, 9, 10, 11],
            },
            {
                time: "18:00",
                seats: [2, 3, 4, 11],
            },
        ],
        selectedSeats: [
            {
                time: "14:00",
                seats: [],
                selectedSeatsLog: [],
            },
            {
                time: "18:00",
                seats: [],
                selectedSeatsLog: [],
            },
        ],
        selectedSeatsLog: [],
    },
];

addCards(moviesArr);

filmCardsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("button")) {
        cardID = Number(e.target.closest(".film-card").id.slice(1)) - 1;
        showTicketsMenu(moviesArr[cardID]);
        renderSeats(moviesArr[cardID]);
    }
});

bookingModalCloseBtn.addEventListener("click", () => {
    buyTicketsPopUp.style.display = "none";
    bookingModalTrailer.innerHTML = moviesArr[0].trailerUrl;
    body.style.overflow = "";
    document.documentElement.style.overflow = "";
    ticketsPrice = 0;
    buyTicketsBtn.textContent = `Придбати квитки`;
});

let slideNumber = 0;

setInterval(() => {
    if (slideNumber < moviesArr.length - 1) {
        slideNumber++;
        changeImage({
            url: moviesArr[slideNumber].mainImageUrl,
            title: moviesArr[slideNumber].title,
        });
    } else {
        slideNumber = 0;
        changeImage({
            url: moviesArr[slideNumber].mainImageUrl,
            title: moviesArr[slideNumber].title,
        });
    }
}, 10000);

sliderBtn.addEventListener("click", () => {
    showTicketsMenu(moviesArr[slideNumber]);
    renderSeats(moviesArr[slideNumber]);
    cardID = slideNumber;
});

selectTime.addEventListener("click", (e) => {
    if (!e.target.classList.contains("time-pill--active") && e.target.classList.contains("time-pill")) {
        ticketsPrice = 0;
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
            ticketsPrice -= moviesArr[cardID].price;
            buyTicketsBtn.textContent = `Придбати квитки - ${ticketsPrice / moviesArr[cardID].price}шт ${ticketsPrice} грн`;
            if (ticketsPrice == 0) {
                buyTicketsBtn.textContent = `Придбати квитки`;
            }
        } else {
            e.target.classList.add("seat--selected");
            ticketsPrice += moviesArr[cardID].price;
            buyTicketsBtn.textContent = `Придбати квитки - ${ticketsPrice / moviesArr[cardID].price}шт ${ticketsPrice} грн`;
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
        ticketsPrice = 0;

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
    if (window.location.hash === '#admin') {
        window.location.href = './pages/admin.html'; 
    }
}

checkAdminRoute();

window.addEventListener('hashchange', checkAdminRoute);

burgerMenuMainPage.addEventListener("click", () => {
    burgerMenu.classList.remove("burger-menu--active");
    burgerMenuIcon.classList.remove("burger-menu__icon--active");
});

burgerMenuFilmsSection.addEventListener("click", () => {
    burgerMenu.classList.remove("burger-menu--active");
    burgerMenuIcon.classList.remove("burger-menu__icon--active");
});

burgerMenuFooter.addEventListener("click", () => {
    burgerMenu.classList.remove("burger-menu--active");
    burgerMenuIcon.classList.remove("burger-menu__icon--active");
});