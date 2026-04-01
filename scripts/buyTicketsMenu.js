const buyTicketsPopUp = document.getElementById("bookingModal");
const bookingModalTrailer = document.getElementById("booking-modal__trailer");
const bookingModalTitle = document.getElementById("booking-modal__title");
const bookingModalDesc = document.getElementById("booking-modal__desc");
const bookingModalTimes = document.getElementById("booking-modal__times");
const body = document.getElementById("body");

export function showTicketsMenu(film) {
    const timesHTML = film.time.map((t) => `<button class="time-pill">${t}</button>`).join("");
    buyTicketsPopUp.style.display = "flex";
    bookingModalTrailer.innerHTML = film.trailerUrl;
    bookingModalTitle.textContent = film.title;
    bookingModalDesc.textContent = film.description;
    bookingModalTimes.innerHTML = timesHTML;
    body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const timeBtn = document.querySelector(".time-pill");
    timeBtn.classList.add("time-pill--active");
}
