const supabaseUrl = "https://ylervnsmjrtdfkbcmjky.supabase.co";
const supabaseKey = "sb_publishable_qiZNJW-3OkIfWbT7VuSjoQ_sZBziFzP";
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const addMovieBtn = document.getElementById("add-movie-btn");
const tabButtons = document.querySelectorAll(".tab-btn");
const moviesListContainer = document.getElementById("movies-list");

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab");

        document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));

        button.classList.add("active");
        document.getElementById("tab-" + tabId).classList.add("active");
    });
});

async function loadUsers() {
    const { data: users, error } = await supabaseClient
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Помилка завантаження користувачів:", error);
        return;
    }

    const countDisplay = document.getElementById("users-count");
    if (countDisplay) {
        countDisplay.textContent = users.length;
    }

    const usersListContainer = document.getElementById("users-list-container");
    usersListContainer.innerHTML = "";

    users.forEach((user) => {
        const date = new Date(user.created_at).toLocaleDateString("uk-UA");
        const userName = user.full_name || "Без імені";

        const userCard = `
            <div class="user-card">
                <div class="user-info">
                    <span class="user-name">${userName}</span>
                    <span class="user-email">${user.email}</span>
                </div>
                <span class="user-date">Зареєстровано: ${date}</span>
            </div>
        `;
        usersListContainer.insertAdjacentHTML("beforeend", userCard);
    });
}

async function loadMovies() {
    const { data: movies, error } = await supabaseClient.from("movies").select("*").order("id", { ascending: true });

    if (error) {
        console.error("Помилка завантаження фільмів:", error);
        return;
    }

    moviesListContainer.innerHTML = "";

    if (movies.length === 0) {
        moviesListContainer.innerHTML = '<p style="color: #ccc;">У базі поки немає жодного фільму.</p>';
        return;
    }

    movies.forEach((movie) => {
        const movieCard = `
            <div class="user-card" style="display: flex; justify-content: space-between; align-items: center; padding: 15px;">
                <div class="user-info">
                    <span class="user-name" style="font-size: 18px; color: #fff;">${movie.title}</span>
                    <span class="user-email" style="color: #bbb;">Ціна: ${movie.price} грн | Жанр: ${movie.genre}</span>
                </div>
                <button class="button delete-movie-btn" data-id="${movie.id}" style="padding: 8px 15px; border-radius: 5px;">Видалити</button>
            </div>
        `;
        moviesListContainer.insertAdjacentHTML("beforeend", movieCard);
    });
}

if (addMovieBtn) {
    addMovieBtn.addEventListener("click", async () => {
        const title = document.getElementById("movie-title").value.trim();
        const genre = document.getElementById("movie-genre").value.trim();
        const price = document.getElementById("movie-price").value.trim();
        const desc = document.getElementById("movie-desc").value.trim();
        const thumbnailUrl = document.getElementById("movie-thumbnail").value.trim();
        const mainImageUrl = document.getElementById("movie-main-img").value.trim();
        const trailerUrl = document.getElementById("movie-trailer").value.trim();
        const timesInput = document.getElementById("movie-times").value.trim();

        if (!title || !genre || !price || !desc || !thumbnailUrl || !mainImageUrl|| !trailerUrl) {
            alert("Заповніть усі поля!");
            return;
        }

        const timeArray = timesInput.split(",").map(time => time.trim()).filter(time => time !== "");

        const { error } = await supabaseClient.from("movies").insert([{ 
            title, 
            genre, 
            price: Number(price), 
            description: desc || "Опис відсутній",
            thumbnailUrl: thumbnailUrl || "./images/defaultThumbnail.webp", 
            mainImageUrl: mainImageUrl || "./images/defaultMain.webp",
            trailerUrl: trailerUrl || "",
            time: timeArray,
        }]);

        if (error) alert("Помилка додавання");
        else {
            alert("Успішно!");
            document.getElementById("movie-title").value = "";
            document.getElementById("movie-genre").value = "";
            document.getElementById("movie-price").value = "";
            document.getElementById("movie-desc").value = "";
            document.getElementById("movie-thumbnail").value = "";
            document.getElementById("movie-main-img").value = "";
            document.getElementById("movie-trailer").value = "";
            document.getElementById("movie-times").value = "";
            loadMovies();
        }
    });
}

moviesListContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-movie-btn")) {
        const movieId = e.target.getAttribute("data-id");
        if (!confirm("Видалити цей фільм?")) return;

        const { error } = await supabaseClient.from("movies").delete().eq("id", movieId);
        if (error) alert("Помилка видалення");
        else loadMovies();
    }
});

function checkPassword() {
    const passwordInput = document.getElementById("admin-password");
    const errorMsg = document.getElementById("error-msg");
    const loginSection = document.getElementById("login-section");
    const dashboardSection = document.getElementById("dashboard-section");

    if (passwordInput.value === "admin") {
        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
        errorMsg.style.display = "none";
        passwordInput.value = "";
        loadUsers();
        loadMovies();
    } else {
        errorMsg.style.display = "block";
        passwordInput.style.borderColor = "#ff4b4b";
    }
}

if (loginBtn) loginBtn.addEventListener("click", checkPassword);

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}