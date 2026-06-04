/* ===================================================
   main.js — Основная логика toi.kz
   Навигация, анимации, общие функции
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBurger();
  initScrollAnimations();
  initActiveNav();
  initSinglePageLinks();
});

/* === Навбар: тень при скролле === */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* === Бургер-меню === */
function initBurger() {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  /* Закрываем при клике по ссылке */
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* === Анимации при скролле (Intersection Observer) === */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        /* Задержка для каскадного эффекта */
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* === Активный пункт навигации === */
function initActiveNav() {
  const navLinks = document.querySelectorAll('.navbar-links a, .mobile-menu a');

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#home');
  });
}

function scrollToSection(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initSinglePageLinks() {
  const routeMap = {
    'index.html': '#home',
    'restaurants.html': '#restaurants',
    'restaurant-detail.html': '#restaurants',
    'services.html': '#services',
    'about.html': '#about',
    'booking.html': '#register',
    'login.html': '#login',
    'register.html': '#register',
    'profile.html': '#login',
    'my-bookings.html': '#login',
    'admin.html': '#login',
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    if (href.startsWith('#')) {
      const action = href.slice(1);
      if (action === 'login' || action === 'register') {
        event.preventDefault();
        if (typeof openAuthModal === 'function') openAuthModal(action);
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        scrollToSection(href);
      }
      return;
    }

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;

    const page = url.pathname.split('/').pop();
    const targetHash = routeMap[page];
    if (!targetHash) return;

    event.preventDefault();
    if (targetHash === '#login' || targetHash === '#register') {
      if (typeof openAuthModal === 'function') openAuthModal(targetHash.slice(1));
    } else {
      scrollToSection(targetHash);
    }
  });
}

/* === Поиск с главной страницы === */
function handleHeroSearch(event) {
  event.preventDefault();

  const city = document.getElementById('hero-city')?.value || '';
  const type = document.getElementById('hero-type')?.value || '';
  const date = document.getElementById('hero-date')?.value || '';
  const guests = document.getElementById('hero-guests')?.value || '';

  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (type) params.set('type', type);
  if (date) params.set('date', date);
  if (guests) params.set('guests', guests);

  scrollToSection('#restaurants');
}

/* === Утилита: форматирование цены === */
function formatPrice(price) {
  return price.toLocaleString('ru-RU') + ' ₸';
}

/* === Утилита: получение инициалов === */
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* === Утилита: SVG иконка звезды === */
function starSVG(size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#00AEEF" stroke="#00AEEF" stroke-width="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
}

function starsHTML(rating, size = 14) {
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      html += starSVG(size);
    } else {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
    }
  }
  return html;
}

/* === SVG иконки === */
const icons = {
  mapPin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  users: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  star: `<svg width="12" height="12" viewBox="0 0 24 24" fill="#00AEEF" stroke="#00AEEF" stroke-width="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 1v2M11 1v2M1 6h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  chevronDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  grid: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  list: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>`,
  phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>`,
  parking: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`,
  wifi: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>`,
  music: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  projector: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="8" cy="12" r="2"/><line x1="14" y1="10" x2="18" y2="10"/><line x1="14" y1="14" x2="18" y2="14"/></svg>`,
  halal: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10l4-4 4 4"/></svg>`,
};

/* === Рендер карточки ресторана === */
function renderRestaurantCard(r) {
  return `
    <div class="restaurant-card animate-on-scroll" onclick="scrollToSection('#restaurants')">
      <div class="restaurant-card-image">
        <img src="${r.images[0]}" alt="${r.name}" loading="lazy">
        <div class="restaurant-card-overlay"></div>
        ${r.badge ? `<div class="restaurant-card-badge">${r.badge}</div>` : ''}
        <div class="restaurant-card-rating">
          ${icons.star}
          <span class="score">${r.rating}</span>
          <span class="count">(${r.reviewCount})</span>
        </div>
      </div>
      <div class="restaurant-card-body">
        <div class="restaurant-card-name">${r.name}</div>
        <div class="restaurant-card-name-kz">${r.nameKz}</div>
        <div class="restaurant-card-location">
          ${icons.mapPin}
          <span>${r.city}, ${r.district}</span>
        </div>
        <div class="restaurant-card-details">
          <div class="restaurant-card-capacity">
            ${icons.users}
            до ${r.capacity} гостей
          </div>
          <div class="restaurant-card-price">
            от ${formatPrice(r.priceFrom)}<small>/чел</small>
          </div>
        </div>
        <div class="restaurant-card-tags">
          ${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <button class="restaurant-card-btn">Забронировать</button>
      </div>
    </div>
  `;
}

/* === Рендер карточки услуги === */
function renderServiceCard(s, category) {
  const priceUnit = s.unit ? ` ${s.unit}` : '';
  const pkgInfo = s.package ? `<div class="service-card-desc" style="font-size:0.78rem;margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,0,0,0.06);">${s.package}</div>` : '';

  return `
    <div class="service-card animate-on-scroll">
      <div class="service-card-header">
        <img class="service-card-avatar" src="${s.avatar}" alt="${s.name}" loading="lazy">
        <div>
          <div class="service-card-name">${s.name}</div>
          <div class="service-card-sub">${s.specialist || ''} ${s.experience ? '• ' + s.experience + ' лет опыта' : ''}</div>
        </div>
      </div>
      <div class="service-card-rating">
        ${starSVG(14)}
        <span class="score">${s.rating}</span>
        <span class="count">(${s.reviewCount} отзывов)</span>
      </div>
      <div class="service-card-desc">${s.description}</div>
      ${s.specialization ? `
        <div class="service-card-meta">
          ${s.specialization.map(sp => `<span class="tag">${sp}</span>`).join('')}
        </div>
      ` : ''}
      ${s.languages ? `
        <div class="service-card-meta">
          ${s.languages.map(l => `<span class="tag">${l}</span>`).join('')}
        </div>
      ` : ''}
      ${pkgInfo}
      <div class="service-card-footer">
        <div class="service-card-price">от ${formatPrice(s.priceFrom)}<small>${priceUnit}</small></div>
        <button class="btn-secondary" style="padding:8px 16px;font-size:0.8rem;">Подробнее</button>
      </div>
    </div>
  `;
}
