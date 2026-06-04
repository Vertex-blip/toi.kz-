function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function openAuthModal(mode = 'login') {
  const modal = document.getElementById('auth-modal');
  const loginPanel = document.getElementById('login-panel');
  const registerPanel = document.getElementById('register-panel');
  if (!modal || !loginPanel || !registerPanel) return;

  loginPanel.style.display = mode === 'register' ? 'none' : 'block';
  registerPanel.style.display = mode === 'register' ? 'block' : 'none';
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const firstInput = mode === 'register'
    ? document.getElementById('reg-name')
    : document.getElementById('login-email');
  if (firstInput) setTimeout(() => firstInput.focus(), 50);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function handleLogin(event) {
  if (event) event.preventDefault();

  const email = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;

  if (!email || !password) {
    showAuthError('Заполните email и пароль');
    return;
  }

  setLoading('login', true);

  const registeredUser = JSON.parse(localStorage.getItem('registeredUser') || 'null');
  const user = registeredUser && registeredUser.email === email
    ? registeredUser
    : { full_name: email.split('@')[0], email, role: 'user' };

  localStorage.setItem('token', 'local-demo-token');
  localStorage.setItem('user', JSON.stringify(user));
  updateNavbarForUser(user);
  setLoading('login', false);
  closeAuthModal();
}

function handleRegister(event) {
  if (event) event.preventDefault();

  const fullName = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();
  const phone = document.getElementById('reg-phone')?.value.trim();
  const password = document.getElementById('reg-password')?.value;
  const password2 = document.getElementById('reg-password2')?.value;

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

  const user = {
    full_name: fullName,
    email,
    phone: phone || '',
    role: 'user',
  };

  localStorage.setItem('registeredUser', JSON.stringify(user));
  localStorage.setItem('token', 'local-demo-token');
  localStorage.setItem('user', JSON.stringify(user));
  updateNavbarForUser(user);
  setLoading('reg', false);
  closeAuthModal();
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.type = input.type === 'password' ? 'text' : 'password';
  if (btn) btn.textContent = input.type === 'password' ? 'Показать' : 'Скрыть';
}

function showAuthError(message) {
  const activePanel = Array.from(document.querySelectorAll('.auth-panel'))
    .find(panel => panel.style.display !== 'none');
  const el = activePanel ? activePanel.querySelector('.auth-error') : null;
  if (!el) return;

  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function setLoading(prefix, isLoading) {
  const text = document.getElementById(prefix + '-btn-text');
  const loading = document.getElementById(prefix + '-btn-loading');
  const btn = document.getElementById(prefix + '-btn');
  if (text) text.style.display = isLoading ? 'none' : 'inline';
  if (loading) loading.style.display = isLoading ? 'inline' : 'none';
  if (btn) btn.disabled = isLoading;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.hash = '#home';
  window.location.reload();
}

function checkAuth() {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (token && user) {
    updateNavbarForUser(user);
    return user;
  }

  return null;
}

function updateNavbarForUser(user) {
  const actions = document.querySelector('.navbar-actions');
  if (!actions) return;

  const fullName = user.full_name || user.email || 'Пользователь';
  const firstName = fullName.split(' ')[0];
  const initials = fullName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

  actions.innerHTML = `
    <div class="navbar-user">
      <span class="navbar-user-name">${firstName}</span>
      <button class="navbar-user-avatar" type="button" onclick="toggleUserMenu()" title="${fullName}">${initials}</button>
    </div>
    <div class="user-dropdown" id="user-dropdown" style="display:none;position:absolute;top:56px;right:24px;background:rgba(13,13,13,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:8px;min-width:200px;backdrop-filter:blur(16px);z-index:1001;">
      <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:4px;">
        <div style="font-size:0.85rem;font-weight:600;color:#fff;">${fullName}</div>
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:2px;">${user.email || ''}</div>
      </div>
      <a href="#restaurants" style="display:block;padding:10px 16px;font-size:0.85rem;color:rgba(255,255,255,0.6);border-radius:8px;">Рестораны</a>
      <a href="#services" style="display:block;padding:10px 16px;font-size:0.85rem;color:rgba(255,255,255,0.6);border-radius:8px;">Услуги</a>
      <div style="border-top:1px solid rgba(255,255,255,0.06);margin-top:4px;padding-top:4px;">
        <a href="#logout" onclick="logout()" style="display:block;padding:10px 16px;font-size:0.85rem;color:#FCA5A5;border-radius:8px;">Выйти</a>
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

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: 'Bearer ' + token } : {};
}

document.addEventListener('click', (event) => {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown && !event.target.closest('.navbar-user') && !event.target.closest('#user-dropdown')) {
    dropdown.style.display = 'none';
  }

  if (event.target.id === 'auth-modal') {
    closeAuthModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeAuthModal();
});

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  if (window.location.hash === '#login') openAuthModal('login');
  if (window.location.hash === '#register') openAuthModal('register');
});
