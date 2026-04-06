/**
 * newsManager.js
 * Manejo del carrusel de noticias, el panel administrativo y login seguro.
 */

import { newsService } from './newsService.js';

export function initNewsManager() {
  const carousel = document.getElementById('news-carousel');
  const dotsContainer = document.getElementById('news-dots');
  const prevBtn = document.getElementById('news-prev');
  const nextBtn = document.getElementById('news-next');
  
  const adminModal = document.getElementById('admin-modal');
  const adminClose = document.getElementById('admin-close');
  const newsForm = document.getElementById('news-form');
  const adminNewsList = document.getElementById('admin-news-list');

  // Elementos de la Burbuja de Login
  const loginOverlay = document.getElementById('login-bubble-overlay');
  const loginPasswordInput = document.getElementById('login-password');
  const btnLoginSubmit = document.getElementById('login-bubble-submit');
  const btnLoginCancel = document.getElementById('login-bubble-close');

  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET_KEY || 'NUTRI_ENZO_2024';

  // ─── ADMIN AUTH LOGIC ───────────────────────────────────────

  function openLoginBubble() {
    loginOverlay.classList.add('active');
    loginPasswordInput.value = '';
    loginPasswordInput.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLoginBubble() {
    loginOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener('click', async () => {
      if (loginPasswordInput.value === ADMIN_SECRET) {
        sessionStorage.setItem('admin_authenticated', 'true');
        await window.showCustomAlert('Clave Correcta', 'alert');
        closeLoginBubble();
        toggleAdminModal(true);
      } else {
        await window.showCustomAlert('Credencial Incorrecta', 'alert');
      }
    });

    // Permitir Enter en el input de password
    loginPasswordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnLoginSubmit.click();
    });
  }

  if (btnLoginCancel) {
    btnLoginCancel.addEventListener('click', closeLoginBubble);
  }

  // ─── CUSTOM ALERT SYSTEM ────────────────────────────────────
  const alertOverlay = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  const btnConfirm = document.getElementById('btn-alert-confirm');
  const btnCancel = document.getElementById('btn-alert-cancel');

  window.showCustomAlert = function(message, type = 'alert') {
    return new Promise((resolve) => {
      alertMessage.textContent = message;
      alertOverlay.classList.add('active');
      btnCancel.style.display = type === 'confirm' ? 'block' : 'none';

      const handleConfirm = () => { cleanup(); resolve(true); };
      const handleCancel = () => { cleanup(); resolve(false); };
      const cleanup = () => {
        btnConfirm.removeEventListener('click', handleConfirm);
        btnCancel.removeEventListener('click', handleCancel);
        alertOverlay.classList.remove('active');
      };

      btnConfirm.addEventListener('click', handleConfirm);
      btnCancel.addEventListener('click', handleCancel);
    });
  };
  
  let currentIndex = 0;
  let autoPlayInterval;
  let newsData = []; // Caché de datos para respuesta instantánea
  const AUTO_PLAY_TIME = 60000; 

  // ─── CAROUSEL LOGIC ─────────────────────────────────────────
  
  async function renderCarousel() {
    newsData = await newsService.getAll();
    if (!carousel) return;

    if (newsData.length === 0) {
      carousel.innerHTML = '<p style="text-align:center; width:100%;">No hay noticias disponibles.</p>';
      return;
    }

    carousel.innerHTML = newsData.map(item => `
      <div class="news-card">
        <img src="${item.image_url || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061'}" alt="${item.title}" class="news-card__image">
        <div class="news-card__content">
          <span class="news-card__category">${item.category}</span>
          <h3 class="news-card__title">${item.title}</h3>
          <p class="news-card__text">${item.content}</p>
          ${item.content.length > 100 ? `<button class="btn-read-more" onclick="this.previousElementSibling.classList.toggle('expanded'); this.textContent = this.previousElementSibling.classList.contains('expanded') ? 'Ver menos' : 'Leer más'">Leer más</button>` : ''}
          <div class="news-card__footer">
            <i class="far fa-calendar-alt"></i>
            <span>${new Date(item.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    `).join('');

    dotsContainer.innerHTML = newsData.map((_, i) => `
      <div class="dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></div>
    `).join('');

    updateCarousel();
  }

  function updateCarousel() {
    const count = newsData.length;
    if (!count) return;
    if (currentIndex >= count) currentIndex = 0;
    if (currentIndex < 0) currentIndex = count - 1;
    carousel.style.transform = `translateX(calc(-${currentIndex} * (100% + var(--space-8))))`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex++;
    updateCarousel();
    resetAutoPlay();
  }

  function prevSlide() {
    currentIndex--;
    updateCarousel();
    resetAutoPlay();
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_TIME);
  }

  // ─── ADMIN DASHBOARD LOGIC ───────────────────────────────────

  const fileInput = document.getElementById('news-file');
  const urlInput = document.getElementById('news-image');
  const previewImg = document.getElementById('news-preview');

  function updatePreview(src) {
    if (previewImg) {
      previewImg.src = src || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061';
    }
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updatePreview(event.target.result);
          if (urlInput) urlInput.value = '';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener('input', (e) => {
      updatePreview(e.target.value);
      if (fileInput) fileInput.value = '';
    });
  }

  function toggleAdminModal(show) {
    if (show) {
      adminModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderAdminList();
    } else {
      adminModal.classList.remove('active');
      document.body.style.overflow = '';
      newsForm.reset();
      updatePreview('');
      document.getElementById('news-id').value = '';
      document.getElementById('save-news').textContent = 'GUARDAR PUBLICACIÓN';
    }
  }

  async function renderAdminList() {
    const news = await newsService.getAll();
    adminNewsList.innerHTML = news.map(item => `
      <div class="admin-news-item">
        <div class="admin-news-item__info">
          <h4>${item.title}</h4>
          <p>${item.category} • ${new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <div class="admin-news-item__actions">
          <button class="action-btn action-btn--edit" data-id="${item.id}" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="action-btn action-btn--delete" data-id="${item.id}" title="Eliminar"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');

    adminNewsList.querySelectorAll('.action-btn--edit').forEach(btn => {
      btn.addEventListener('click', () => editNews(btn.dataset.id));
    });
    adminNewsList.querySelectorAll('.action-btn--delete').forEach(btn => {
      btn.addEventListener('click', () => deleteNews(btn.dataset.id));
    });
  }

  async function editNews(id) {
    const news = await newsService.getAll();
    const item = news.find(n => n.id === id);
    if (!item) return;
    document.querySelector('[data-tab="tab-new"]').click();
    document.getElementById('news-id').value = item.id;
    document.getElementById('news-title').value = item.title;
    document.getElementById('news-category').value = item.category;
    document.getElementById('news-image').value = item.image_url;
    document.getElementById('news-content').value = item.content;
    updatePreview(item.image_url);
    document.getElementById('save-news').textContent = 'ACTUALIZAR PUBLICACIÓN';
  }

  async function deleteNews(id) {
    const confirmed = await window.showCustomAlert('¿Estás seguro de eliminar esta publicación?', 'confirm');
    if (confirmed) {
      await newsService.delete(id);
      await renderAdminList();
      await renderCarousel();
    }
  }

  // ─── EVENTOS ──────────────────────────────────────────────────

  window.addEventListener('keydown', (e) => {
    const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (!isTyping && e.shiftKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
      if (isAuth) {
        toggleAdminModal(true);
      } else {
        openLoginBubble();
      }
    }
  });

  if (adminClose) adminClose.addEventListener('click', () => toggleAdminModal(false));
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('dot')) {
        currentIndex = parseInt(e.target.dataset.index);
        updateCarousel();
        resetAutoPlay();
      }
    });
  }

  if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('news-id').value;
      const file = fileInput.files[0];
      const newsItem = {
        id: id || null,
        title: document.getElementById('news-title').value,
        category: document.getElementById('news-category').value,
        image: document.getElementById('news-image').value || previewImg.src,
        content: document.getElementById('news-content').value
      };
      await newsService.save(newsItem, file);
      const successMsg = id ? 'Noticia actualizada con éxito' : 'Noticia creada con éxito';
      await window.showCustomAlert(successMsg, 'alert');
      toggleAdminModal(false);
      renderCarousel();
    });
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.remove('hidden');
    });
  });

  // Inicialización
  renderCarousel();
  resetAutoPlay();
}
