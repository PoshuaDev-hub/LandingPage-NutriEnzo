/* ══════════════════════════════════════════════════════════════
   Enzo Escobar — Main JavaScript
   Este archivo maneja todas las interacciones visuales, 
   animaciones de scroll y la lógica principal de la interfaz.
   ══════════════════════════════════════════════════════════════ */

import { initNewsManager } from './newsManager.js';

// Punto de entrada: Inicialización de todos los módulos cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();      // Manejo del menú y barra de navegación
  initScrollReveal();    // Animaciones de aparición al hacer scroll
  initCounterAnimation(); // Animación de números crecientes (Estadísticas)
  initSmoothScroll();    // Desplazamiento suave entre secciones
  initNewsManager();     // Lógica del carrusel de noticias y panel admin
  initBookingModal();    // Manejo del modal de agendamiento clínico
});

/* ─── NAVEGACIÓN ────────────────────────────────────────────── */
/**
 * Controla el comportamiento de la barra de navegación superior 
 * y el menú lateral móvil.
 */
function initNavigation() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
  const mobileClose = document.getElementById('mobile-close');

  // Evento de Scroll: Cambia el fondo del nav al bajar más de 50px
  // Esto permite que el nav sea transparente arriba y sólido al navegar.
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Gestión del Menú Móvil (Apertura/Cierre)
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      // Bloqueamos el scroll del cuerpo cuando el menú está abierto
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Cierre automático al hacer clic en cualquier enlace del menú móvil
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Botón de cerrar explícito en el menú móvil
    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }
}

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
/**
 * Utiliza el IntersectionObserver para detectar cuándo los elementos 
 * entran en pantalla y aplicarles una animación de aparición (fade up).
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Si el elemento es visible al menos en un 10%, activamos la animación
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Dejamos de observar una vez animado
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ─── ANIMACIÓN DE CONTADORES ────────────────────────────────────── */
/**
 * Anima los números desde 0 hasta su valor objetivo definido 
 * en el atributo data-target del HTML.
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 }); // Inicia cuando el 50% de la sección es visible

  counters.forEach(counter => observer.observe(counter));
}

/**
 * Función auxiliar para realizar el cálculo matemático de la animación suave
 * utiliza una función de ease-out para que el final sea más lento y natural.
 */
function animateCounter(element) {
  const target = parseInt(element.dataset.target, 10);
  const duration = 2000; // Duración total en milisegundos (2 segundos)
  const startTime = performance.now();

  // Función matemática para suavizado Quartz
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const current = Math.round(target * easedProgress);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ─── MODAL DE AGENDAMIENTO CLINICO ─────────────────────────────────── */
/**
 * Gestiona el modal donde los pacientes pueden elegir agendar presencialmente 
 * u online. Incluye lógica de bloqueo de scroll y atajos de teclado.
 */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('booking-close');
  const overlay = document.getElementById('booking-overlay');
  
  // Identificamos todos los botones de CTA que activan el agendamiento
  const triggers = Array.from(document.querySelectorAll('.btn')).filter(btn => 
    btn.textContent.trim().toUpperCase().includes('AGENDAR HORA')
  );

  const openModal = (e) => {
    if (e) e.preventDefault();
    
    // Al abrir el modal, llevamos la vista suavemente arriba para centrar la atención
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Cierre intuitivo con la tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ─── SCROLL SUAVE (SMOOTH SCROLL) ────────────────────────────── */
/**
 * Reemplaza el salto brusco de los enlaces anclados (#header, #about, etc)
 * por un desplazamiento fluido calculando el offset del navbar.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();

        // Calculamos la altura del nav para que no tape el título de la sección
        const navHeight = document.getElementById('nav').offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        
        // Offset final: Posición del título - altura del nav - margen extra de aire
        const targetPos = targetTop - navHeight - 24;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}
