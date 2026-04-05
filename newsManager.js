/**
 * newsManager.js
 * 
 * Este módulo gestiona el carrusel de noticias, el panel administrativo dinámico
 * y todo el flujo de autenticación por burbuja para nutrición deportiva.
 */

import { newsService } from './newsService.js';

export function initNewsManager() {
  // Elementos de la interfaz del carrusel público
  const carousel = document.getElementById('news-carousel');
  const dotsContainer = document.getElementById('news-dots');
  const prevBtn = document.getElementById('news-prev');
  const nextBtn = document.getElementById('news-next');
  
  // Elementos del Dashboard Administrativo
  const adminModal = document.getElementById('admin-modal');
  const adminClose = document.getElementById('admin-close');
  const newsForm = document.getElementById('news-form');
  const adminNewsList = document.getElementById('admin-news-list');

  // Elementos de la Burbuja de Login Seguro (Acceso por Clave)
  const loginOverlay = document.getElementById('login-bubble-overlay');
  const loginPasswordInput = document.getElementById('login-password');
  const btnLoginSubmit = document.getElementById('login-bubble-submit');
  const btnLoginCancel = document.getElementById('login-bubble-close');

  // Clave secreta obtenida de las variables de entorno de Vite (.env)
  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET_KEY || 'NUTRI_ENZO_2024';

  // ─── LÓGICA DE AUTENTICACIÓN ADMIN ───────────────────────────

  /**
   * Abre la burbuja central de login para el administrador.
   * Se activa mediante el atajo de teclado Shift + N.
   */
  function openLoginBubble() {
    loginOverlay.classList.add('active');
    loginPasswordInput.value = '';
    loginPasswordInput.focus();
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra la burbuja de login y restaura el scroll del sitio.
   */
  function closeLoginBubble() {
    loginOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Validación de la clave ingresada en la burbuja
  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener('click', async () => {
      if (loginPasswordInput.value === ADMIN_SECRET) {
        // Almacenamos el estado en sessionStorage para no pedir la clave en cada edición
        sessionStorage.setItem('admin_authenticated', 'true');
        await window.showCustomAlert('Clave Correcta', 'alert');
        closeLoginBubble();
        toggleAdminModal(true); // Una vez validado, abrimos el Dashboard
      } else {
        await window.showCustomAlert('Credencial Incorrecta', 'alert');
      }
    });

    // Accesibilidad: Permitir validación al presionar la tecla Enter
    loginPasswordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnLoginSubmit.click();
    });
  }

  if (btnLoginCancel) {
    btnLoginCancel.addEventListener('click', closeLoginBubble);
  }

  // ─── SISTEMA DE ALERTAS PERSONALIZADAS (BURBUJA MODAL) ───────
  /**
   * Reemplaza los alerts nativos del navegador por burbujas 
   * integradas en el diseño del sitio.
   */
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
  
  // Variables de control del estado del carrusel
  let currentIndex = 0;
  let autoPlayInterval;
  const AUTO_PLAY_TIME = 60000; // Cambio automático cada 60 segundos

  // ─── LÓGICA DEL CARRUSEL DE NOTICIAS ──────────────────────────
  
  /**
   * Obtiene las noticias de Supabase y las dibuja en el HTML.
   * Maneja el renderizado de tarjetas y los puntos de navegación (dots).
   */
  async function renderCarousel() {
    const news = await newsService.getAll();
    if (!carousel) return;

    // Estado vacío: Si no hay noticias, mostramos un mensaje amigable
    if (news.length === 0) {
      carousel.innerHTML = '<p style="text-align:center; width:100%;">No hay noticias disponibles.</p>';
      return;
    }

    // Renderizamos las tarjetas dinámicamente con sus fotos en ratio 3:4 (según CSS)
    carousel.innerHTML = news.map(item => `
      <div class="news-card">
        <img src="${item.image_url || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061'}" alt="${item.title}" class="news-card__image">
        <div class="news-card__content">
          <span class="news-card__category">${item.category}</span>
          <h3 class="news-card__title">${item.title}</h3>
          <p class="news-card__text">${item.content}</p>
          <div class="news-card__footer">
            <i class="far fa-calendar-alt"></i>
            <span>${new Date(item.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Generamos los puntos de navegación inferiores
    dotsContainer.innerHTML = news.map((_, i) => `
      <div class="dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></div>
    `).join('');

    updateCarousel(news.length);
  }

  /**
   * Aplica el desplazamiento físico (transform) al carrusel 
   * según el índice actual de la noticia.
   */
  function updateCarousel(count) {
    if (!count) return;
    if (currentIndex >= count) currentIndex = 0;
    if (currentIndex < 0) currentIndex = count - 1;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Navegación Manual (Siguiente / Anterior)
  async function nextSlide() {
    const news = await newsService.getAll();
    currentIndex++;
    updateCarousel(news.length);
    resetAutoPlay();
  }

  async function prevSlide() {
    const news = await newsService.getAll();
    currentIndex--;
    updateCarousel(news.length);
    resetAutoPlay();
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_TIME);
  }

  // ─── LÓGICA DEL DASHBOARD ADMINISTRATIVO ────────────────────

  // Referencias para la previsualización de imágenes al subir contenido
  const fileInput = document.getElementById('news-file');
  const urlInput = document.getElementById('news-image');
  const previewImg = document.getElementById('news-preview');

  function updatePreview(src) {
    if (previewImg) {
      previewImg.src = src || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061';
    }
  }

  // Manejo de carga de archivos locales (Subida a Supabase Storage)
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updatePreview(event.target.result); // Muestra la foto antes de subirla
          if (urlInput) urlInput.value = ''; // Limpiamos URL externa si se usa archivo
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Manejo de enlaces externos de imagen
  if (urlInput) {
    urlInput.addEventListener('input', (e) => {
      updatePreview(e.target.value);
      if (fileInput) fileInput.value = '';
    });
  }

  /**
   * Muestra u oculta el modal principal del Dashboard.
   * Se encarga de resetear formularios y cargar la lista fresca de noticias.
   */
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

  /**
   * Genera la lista de gestión de noticias (con botones de borrar y editar)
   * que se ve dentro del Dashboard administrativo.
   */
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

    // Eventos para editar y borrar cada elemento de la lista
    adminNewsList.querySelectorAll('.action-btn--edit').forEach(btn => {
      btn.addEventListener('click', () => editNews(btn.dataset.id));
    });
    adminNewsList.querySelectorAll('.action-btn--delete').forEach(btn => {
      btn.addEventListener('click', () => deleteNews(btn.dataset.id));
    });
  }

  /**
   * Carga los datos de una noticia en el formulario para su edición.
   */
  async function editNews(id) {
    const news = await newsService.getAll();
    const item = news.find(n => n.id === id);
    if (!item) return;

    // Cambiamos a la pestaña de "Nueva Noticia" para cargar el formulario
    document.querySelector('[data-tab="tab-new"]').click();

    document.getElementById('news-id').value = item.id;
    document.getElementById('news-title').value = item.title;
    document.getElementById('news-category').value = item.category;
    document.getElementById('news-image').value = item.image_url;
    document.getElementById('news-content').value = item.content;
    
    updatePreview(item.image_url);
    document.getElementById('save-news').textContent = 'ACTUALIZAR PUBLICACIÓN';
  }

  /**
   * Elimina una noticia tras la confirmación exitosa por parte del usuario.
   */
  async function deleteNews(id) {
    const confirmed = await window.showCustomAlert('¿Estás seguro de eliminar esta publicación?', 'confirm');
    if (confirmed) {
      await newsService.delete(id);
      await renderAdminList();
      await renderCarousel(); // Refrescamos el carrusel público
    }
  }

  // ─── GESTION DE EVENTOS GLOBALES ─────────────────────────────

  // Atajo Secreto: Shift + N para abrir el Admin Panel (Pedirá clave)
  window.addEventListener('keydown', (e) => {
    const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (!isTyping && e.shiftKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
      if (isAuth) {
        toggleAdminModal(true); // Si ya se autenticó antes, abre el Dashboard directamente
      } else {
        openLoginBubble(); // Si no, abre la burbuja de clave
      }
    }
  });

  if (adminClose) adminClose.addEventListener('click', () => toggleAdminModal(false));
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Navegación por puntos (dots)
  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('dot')) {
        currentIndex = parseInt(e.target.dataset.index);
        updateCarousel();
        resetAutoPlay();
      }
    });
  }

  /**
   * Captura el envío del formulario de noticias.
   * Envía los datos y la imagen (si la hay) al servicio de Supabase.
   */
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

  // Gestión de pestañas (Tabs) dentro del modal administrativo
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.remove('hidden');
    });
  });

  // Inicialización del carrusel y el autoplay automático
  renderCarousel();
  resetAutoPlay();
}
