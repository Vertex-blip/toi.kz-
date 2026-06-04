function setActiveNav(page) {
  document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('active', href.includes(page));
  });
}

function renderRestaurantList() {
  const grid = document.getElementById('restaurants-list');
  const filters = document.getElementById('restaurant-filters');
  if (!grid || !filters) return;

  const params = new URLSearchParams(window.location.search);
  const initialType = params.get('type') || 'all';
  const tags = ['all', ...new Set(restaurants.flatMap(item => item.tags))];

  filters.innerHTML = tags.map(tag => `
    <button class="pill ${tag === initialType ? 'active' : ''}" data-filter="${tag}">
      ${tag === 'all' ? 'Все' : tag}
    </button>
  `).join('');

  function render(filter) {
    const items = filter === 'all'
      ? restaurants
      : restaurants.filter(item => item.tags.includes(filter));
    grid.innerHTML = items.map(renderRestaurantCard).join('');
    initScrollAnimations();
  }

  filters.addEventListener('click', event => {
    const button = event.target.closest('.pill');
    if (!button) return;
    filters.querySelectorAll('.pill').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    render(button.dataset.filter);
  });

  render(initialType);
}

function renderRestaurantDetail() {
  const root = document.getElementById('restaurant-detail');
  if (!root) return;

  const id = Number(new URLSearchParams(window.location.search).get('id') || 1);
  const restaurant = restaurants.find(item => item.id === id) || restaurants[0];

  document.title = `${restaurant.name} | toi.kz`;
  root.innerHTML = `
    <div class="detail-layout">
      <div>
        <img class="detail-image" src="${restaurant.images[0]}" alt="${restaurant.name}" onerror="this.src='img/hero-bg.jpg'">
        <div class="detail-panel">
          <div class="section-eyebrow"><div class="section-eyebrow-line"></div><span class="section-eyebrow-text">${restaurant.city}</span></div>
          <h1 class="section-title">${restaurant.name}</h1>
          <p class="page-lead" style="color:rgba(13,13,13,0.62)">${restaurant.description}</p>
          <div class="detail-list">${restaurant.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
          <h2 style="font-size:1.2rem;margin-bottom:10px;">Удобства</h2>
          <div class="detail-list">${restaurant.amenities.map(item => `<span class="tag">${item}</span>`).join('')}</div>
        </div>
      </div>
      <aside class="detail-panel">
        <h2 style="font-size:1.3rem;margin-bottom:10px;">Информация</h2>
        <p><strong>Адрес:</strong><br>${restaurant.address}</p>
        <p style="margin-top:12px;"><strong>Вместимость:</strong> до ${restaurant.capacity} гостей</p>
        <p style="margin-top:12px;"><strong>Цена:</strong> от ${formatPrice(restaurant.priceFrom)} / чел</p>
        <p style="margin-top:12px;"><strong>Рейтинг:</strong> ${restaurant.rating} (${restaurant.reviewCount} отзывов)</p>
        <a href="booking.html?restaurant=${restaurant.id}" class="btn-primary" style="width:100%;justify-content:center;margin:22px 0;">Забронировать</a>
        <h2 style="font-size:1.1rem;margin:18px 0 8px;">Пакеты</h2>
        ${restaurant.packages.map(pkg => `
          <div class="package-card">
            <h3>${pkg.name} — ${formatPrice(pkg.price)}</h3>
            <ul>${pkg.items.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </aside>
    </div>
  `;
}

function renderServicesPage() {
  const root = document.getElementById('services-list');
  const filters = document.getElementById('service-filters');
  if (!root || !filters) return;

  const groups = {
    tamada: { title: 'Тамада', items: tamada },
    photo: { title: 'Фотографы', items: photographers },
    decor: { title: 'Декор', items: decor },
    cakes: { title: 'Торты', items: cakes },
    video: { title: 'Видеографы', items: videographers },
    music: { title: 'Живая музыка', items: music },
  };

  filters.innerHTML = Object.entries(groups).map(([key, group], index) => `
    <button class="pill ${index === 0 ? 'active' : ''}" data-filter="${key}">${group.title}</button>
  `).join('');

  function render(key) {
    const group = groups[key] || groups.tamada;
    root.innerHTML = group.items.map(item => renderServiceCard(item, key)).join('');
    initScrollAnimations();
  }

  filters.addEventListener('click', event => {
    const button = event.target.closest('.pill');
    if (!button) return;
    filters.querySelectorAll('.pill').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    render(button.dataset.filter);
  });

  const hash = window.location.hash.replace('#', '');
  render(groups[hash] ? hash : 'tamada');
}

function renderBookingPage() {
  const restaurantSelect = document.getElementById('booking-restaurant');
  const form = document.getElementById('booking-form');
  if (!restaurantSelect || !form) return;

  const selectedId = new URLSearchParams(window.location.search).get('restaurant');
  restaurantSelect.innerHTML = restaurants.map(item => `
    <option value="${item.id}" ${String(item.id) === selectedId ? 'selected' : ''}>${item.name} — ${item.city}</option>
  `).join('');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = document.getElementById('booking-status');
    if (status) {
      status.textContent = 'Заявка заполнена. Для отправки нужен рабочий backend API.';
      status.style.display = 'block';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderRestaurantList();
  renderRestaurantDetail();
  renderServicesPage();
  renderBookingPage();
});
