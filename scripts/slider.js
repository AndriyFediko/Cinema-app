const sliderImage = document.getElementById("hero-slider__image");
const title = document.getElementById("hero-slider__title");

export function changeImage(film) {
    sliderImage.src = film.url;
    sliderImage.alt = `Постер фільму ${film.title}`;
    title.textContent = film.title;
}