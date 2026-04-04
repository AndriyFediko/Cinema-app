const burgerMenuIcon = document.getElementById("burger-menu__icon");
const burgerMenu = document.getElementById("burger-menu");


burgerMenuIcon.addEventListener("click", () => {
    burgerMenu.classList.toggle("burger-menu--active");
    burgerMenuIcon.classList.toggle("burger-menu__icon--active");
});