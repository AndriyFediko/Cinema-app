const supabaseUrl = 'https://ylervnsmjrtdfkbcmjky.supabase.co';
const supabaseKey = 'sb_publishable_qiZNJW-3OkIfWbT7VuSjoQ_sZBziFzP';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

async function loadUsers() {
    const { data: users, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Помилка завантаження користувачів:", error);
        return;
    }

    console.log("Дані з бази:", users);

    const usersListContainer = document.querySelector('.users-list');
    usersListContainer.innerHTML = '';

    users.forEach(user => {
        const date = new Date(user.created_at).toLocaleDateString('uk-UA');
        
        const userName = user.full_name ? user.full_name : 'Без імені';

        const userCard = `
            <div class="user-card">
                <div class="user-info">
                    <span class="user-name">${userName}</span>
                    <span class="user-email">${user.email}</span>
                </div>
                <span class="user-date">Зареєстровано: ${date}</span>
            </div>
        `;
        
        usersListContainer.insertAdjacentHTML('beforeend', userCard);
    });
}

function checkPassword() {
    const passwordInput = document.getElementById('admin-password');
    const errorMsg = document.getElementById('error-msg');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');

    if (passwordInput.value === 'admin') {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        errorMsg.style.display = 'none';
        passwordInput.value = ''; 
        
        loadUsers(); 
    } else {
        errorMsg.style.display = 'block';
        passwordInput.style.borderColor = '#ff4b4b';
    }
}

function logout() {
    const passwordInput = document.getElementById('admin-password');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');

    if (passwordInput) passwordInput.value = '';

    dashboardSection.style.display = 'none';
    loginSection.style.display = 'flex';

    window.location.href = '../index.html';
}