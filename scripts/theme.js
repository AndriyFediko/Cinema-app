const themeBtn = document.getElementById("change-theme__Btn");
const themeBtnMobile = document.getElementById("change-theme-burger-menu__Btn");
const body = document.getElementById("body");

themeBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme")
});

themeBtnMobile.addEventListener("click", () => {
    body.classList.toggle("light-theme")
});