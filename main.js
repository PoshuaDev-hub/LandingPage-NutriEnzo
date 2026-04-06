/* ══════════════════════════════════════════════════════════════
   Enzo Escobar — Main JavaScript
   Interacciones, animaciones y funcionalidad de la landing page.
   ══════════════════════════════════════════════════════════════ */

import { initNewsManager } from './newsManager.js';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

document.addEventListener('DOMContentLoaded', () => {
  inject(); // Inicializa Vercel Analytics
  injectSpeedInsights(); // Inicializa Vercel Speed Insights
  initNavigation();
  initScrollReveal();
  initCounterAnimation();
  initSmoothScroll();
  initNewsManager();
  initBookingModal();
});

/* ─── NAVEGACIÓN ────────────────────────────────────────────── */
function initNavigation() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
  const mobileClose = document.getElementById('mobile-close');

  // Scroll → cambiar fondo del nav
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Toggle menú móvil
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al hacer clic en un enlace
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Cerrar menú al hacer clic en el botón de cerrar
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
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ─── COUNTER ANIMATION ────────────────────────────────────── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target, 10);
  const duration = 2000;
  const startTime = performance.now();

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

/* ─── MODAL DE AGENDAMIENTO ─────────────────────────────────── */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('booking-close');
  const overlay = document.getElementById('booking-overlay');
  
  // Seleccionamos todos los botones que dicen "AGENDAR HORA"
  const triggers = Array.from(document.querySelectorAll('.btn')).filter(btn => 
    btn.textContent.trim().toUpperCase().includes('AGENDAR HORA')
  );

  const openModal = (e) => {
    if (e) e.preventDefault();
    
    // Primero hacemos scroll a la parte superior (Sobre Mí)
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Abrimos el modal
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

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ─── SMOOTH SCROLL ─────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();

        const navHeight = document.getElementById('nav').offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        
        // NUEVO SISTEMA: Solo resta navHeight + 24px de margen
        // Sin centrado complejo que desplaza demasiado
        const targetPos = targetTop - navHeight - 24;



        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}
