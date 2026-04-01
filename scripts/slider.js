const slider = document.getElementById("hero-slider");
const title = document.getElementById("hero-slider__title")

export function changeImage(film){
    slider.style.backgroundImage = `url('${film.url}')`;
    title.textContent = film.title;
}