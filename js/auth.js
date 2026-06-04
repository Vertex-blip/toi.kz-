/* ===================================================
   auth.js — Логика авторизации на фронтенде
   
   POST /api/auth/register  — регистрация (только user)
   POST /api/auth/login     — вход
   GET  /api/auth/me        — профиль
   =================================================== */

const API_URL = window.location.origin;


/* === ВХОД === */
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showAuthError('Заполните все поля');
    return;
  }

  setLoading('login', true);

  try {
    const response = await fetch(API_URL + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showAuthError(data.detail || 'Ошибка входа');
      return;
    }

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'index.html';

  } catch (error) {
    showAuthError('Ошибка сервера. Попробуйте позже.');
    console.error('Login error:', error);
  } finally {
    setLoading('login', false);
  }
}


/* === РЕГИСТРАЦИЯ === */
async function handleRegister() {
  const fullName = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;
  const password2 = document.getElementById('reg-password2').value;

  if (!fullName || !email || !password) {
    showAuthError('Заполните обязательные поля');
    return;
  }

  if (password.length < 6) {
    showAuthError('Пароль должен быть минимум 6 символов');
    return;
  }

  if (password !== password2) {
    showAuthError('Пароли не совпадают');
    return;
  }

  setLoading('reg', true);

  try {
    const response = await fetch(API_URL + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        phone: phone || null
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showAuthError(data.detail || 'Ошибка регистрации');
      return;
    }

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'index.html';

  } catch (error) {
    showAuthError('Ошибка сервера. Попробуйте позже.');
    console.error('Register error:', error);
  } finally {
    setLoading('reg', false);
  }
}


/* === Показать/скрыть пароль === */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.style.color = 'var(--blue-light)';
  } else {
    input.type = 'password';
    btn.style.color = 'rgba(255,255,255,0.35)';
  }
}


/* === Показать ошибку === */
function showAuthError(message) {
  const el = document.getElementById('auth-error');
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  }
}


/* === Загрузка кнопки === */
function setLoading(prefix, isLoading) {
  const text = document.getElementById(prefix + '-btn-text');
  const loading = document.getElementById(prefix + '-btn-loading');
  const btn = document.getElementById(prefix + '-btn');
  if (text) text.style.display = isLoading ? 'none' : 'inline';
  if (loading) loading.style.display = isLoading ? 'inline' : 'none';
  if (btn) btn.disabled = isLoading;
}


/* === Выход === */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}


/* === Проверка авторизации === */
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    const userData = JSON.parse(user);
    updateNavbarForUser(userData);
    return userData;
  }
  return null;
}


/* === Обновить навбар === */
function updateNavbarForUser(user) {
  const actions = document.querySelector('.navbar-actions');
  if (!actions) return;

  const initials = user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  actions.innerHTML = `
    <div class="navbar-user">
      <span class="navbar-user-name">${user.full_name.split(' ')[0]}</span>
      <div class="navbar-user-avatar" onclick="toggleUserMenu()" title="${user.full_name}">${initials}</div>
    </div>
    <div class="user-dropdown" id="user-dropdown" style="display:none;position:absolute;top:56px;right:24px;background:rgba(13,13,13,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:8px;min-width:200px;backdrop-filter:blur(16px);z-index:1001;">
      <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:4px;">
        <div style="font-size:0.85rem;font-weight:600;color:#fff;">${user.full_name}</div>
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:2px;">${user.email}</div>
        <div style="margin-top:6px;"><span style="font-size:0.7rem;padding:2px 8px;border-radius:4px;background:rgba(0,87,168,0.2);color:var(--blue-light);">${user.role === 'admin' ? 'Админ' : user.role === 'business' ? 'Ресторан' : 'Гость'}</span></div>
      </div>
      <a href="profile.html" style="display:block;padding:10px 16px;font-size:0.85rem;color:rgba(255,255,255,0.6);border-radius:8px;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='none'">Мой профиль</a>
      <a href="my-bookings.html" style="display:block;padding:10px 16px;font-size:0.85rem;color:rgba(255,255,255,0.6);border-radius:8px;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='none'">Мои бронирования</a>
      ${user.role === 'admin' ? `<a href="admin.html" style="display:block;padding:10px 16px;font-size:0.85rem;color:rgba(200,150,42,0.9);border-radius:8px;" onmouseover="this.style.background='rgba(200,150,42,0.08)'" onmouseout="this.style.background='none'">Админ-панель</a>` : ''}
      <div style="border-top:1px solid rgba(255,255,255,0.06);margin-top:4px;padding-top:4px;">
        <a href="#" onclick="logout()" style="display:block;padding:10px 16px;font-size:0.85rem;color:#FCA5A5;border-radius:8px;" onmouseover="this.style.background='rgba(220,38,38,0.1)'" onmouseout="this.style.background='none'">Выйти</a>
      </div>
    </div>
  `;
}


function toggleUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  }
}

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown && !e.target.closest('.navbar-user')) {
    dropdown.style.display = 'none';
  }
});


/* === Утилита: заголовки с токеном === */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}


document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
