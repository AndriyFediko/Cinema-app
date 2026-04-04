const supabaseUrl = 'https://ylervnsmjrtdfkbcmjky.supabase.co';
const supabaseKey = 'sb_publishable_qiZNJW-3OkIfWbT7VuSjoQ_sZBziFzP';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const form = document.querySelector(".auth-form");
const nameInput = document.getElementById("reg-name");
const emailInput = document.getElementById("reg-email");
const passwordInput = document.getElementById("reg-password");
const passwordConfirmInput = document.getElementById("reg-password-confirm");

const nameGroup = document.getElementById("name-group");
const confirmPasswordGroup = document.getElementById("confirm-password-group");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const submitBtn = document.getElementById("auth-submit-btn");
const togglePrompt = document.getElementById("toggle-prompt");
const toggleLink = document.getElementById("toggle-link");

const nameRegex = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\d\s-]{2,50}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^.{8,}$/;

let isLoginMode = false;

toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;

    nameInput.style.borderColor = "transparent";
    emailInput.style.borderColor = "transparent";
    passwordInput.style.borderColor = "transparent";
    passwordConfirmInput.style.borderColor = "transparent";
    form.reset();

    if (isLoginMode) {
        nameGroup.style.display = "none";
        confirmPasswordGroup.style.display = "none";
        authTitle.textContent = "Вхід в акаунт";
        authSubtitle.textContent = "З поверненням! Введіть свої дані для входу.";
        submitBtn.textContent = "Увійти";
        togglePrompt.textContent = "Немає акаунта?";
        toggleLink.textContent = "Зареєструватися";
    } else {
        nameGroup.style.display = "flex";
        confirmPasswordGroup.style.display = "flex";
        authTitle.textContent = "Створити акаунт";
        authSubtitle.textContent = "Приєднуйся, щоб купувати квитки та отримувати бонуси";
        submitBtn.textContent = "Зареєструватися";
        togglePrompt.textContent = "У вас вже є акаунт?";
        toggleLink.textContent = "Увійти";
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let isValid = true;
    
    const showError = (input, message) => {
        input.style.borderColor = "#ff4d4f";
        isValid = false;
        console.error(`Помилка: ${message}`);
    };
    
    const showSuccess = (input) => {
        input.style.borderColor = "#52c41a";
    };
    
    if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, "Введіть правильну адресу електронної пошти.");
    } else {
        showSuccess(emailInput);
    }
    
    if (!passwordRegex.test(passwordInput.value)) {
        showError(passwordInput, "Пароль має містити щонайменше 8 символів.");
    } else {
        showSuccess(passwordInput);
    }

    if (!isLoginMode) {
        if (!nameRegex.test(nameInput.value.trim())) {
            showError(nameInput, "Введіть коректне ім'я (мінімум 2 літери).");
        } else {
            showSuccess(nameInput);
        }
        
        if (passwordInput.value !== passwordConfirmInput.value || passwordConfirmInput.value === "") {
            showError(passwordConfirmInput, "Паролі не збігаються.");
        } else {
            showSuccess(passwordConfirmInput);
        }
    }
    
    if (isValid) {
        try {
            if (isLoginMode) {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                });

                if (error) {
                    alert(`Помилка входу: Невірний email або пароль.`);
                    return;
                }
                
                alert("Вхід успішний!");
                window.location.href = "../index.html";
                
            } else {
                const { data, error } = await supabaseClient.auth.signUp({
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                    options: {
                        data: {
                            full_name: nameInput.value.trim() 
                        }
                    }
                });

                if (error) {
                    alert(`Помилка реєстрації: ${error.message}`);
                    return;
                }

                alert("Реєстрація успішна!");
                window.location.href = "../index.html";
            }
            
        } catch (err) {
            console.error("Неочікувана помилка:", err);
            alert("Сталася неочікувана помилка. Спробуйте пізніше.");
        }
    } else {
        alert("Будь ласка, виправте помилки у формі.");
    }
});