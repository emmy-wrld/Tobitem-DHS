/* ============================================================
   TOBITEM DOWNHOLE SOLUTIONS — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     STICKY NAVBAR
  ============================================================ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* ============================================================
     ACTIVE NAV LINK
  ============================================================ */
  (function setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav a').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (
        href === path ||
        (path === '' && href === 'index.html') ||
        (path === 'index.html' && href === 'index.html')
      ) {
        link.classList.add('active');
      }
    });
  })();

  /* ============================================================
     MOBILE MENU
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================================
     SEARCH BAR TOGGLE
  ============================================================ */
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      searchInput.classList.toggle('open');
      if (searchInput.classList.contains('open')) {
        searchInput.focus();
      }
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.classList.remove('open');
        searchInput.blur();
      }
    });
  }

  /* ============================================================
     DARK / LIGHT THEME TOGGLE
  ============================================================ */
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  const stored = localStorage.getItem('tds-theme') || 'light';
  htmlEl.setAttribute('data-theme', stored);
  updateThemeIcon(stored);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('tds-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
      themeToggle.title = 'Switch to Light Mode';
    } else {
      icon.className = 'fas fa-moon';
      themeToggle.title = 'Switch to Dark Mode';
    }
  }

  /* ============================================================
     HERO SLIDER
  ============================================================ */
  const slider = document.getElementById('hero-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');
    let current = 0;
    let autoTimer = null;
    let isPaused = false;

    function goTo(index) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (!isPaused) goTo(current + 1);
      }, 5000);
    }

    if (slides.length > 0) {
      slides[0].classList.add('active');
      if (dots[0]) dots[0].classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

    slider.addEventListener('mouseenter', () => { isPaused = true; });
    slider.addEventListener('mouseleave', () => { isPaused = false; });

    // Touch swipe support
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        goTo(dx < 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });

    startAuto();
  }

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const staggerParents = document.querySelectorAll('.stagger');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll(':scope > *');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 100);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerParents.forEach(el => staggerObserver.observe(el));

  /* ============================================================
     COUNTER ANIMATION (Stats)
  ============================================================ */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  /* ============================================================
     BACK TO TOP
  ============================================================ */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     CONTACT FORM VALIDATION
  ============================================================ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'field-name', msg: 'Please enter your full name.' },
        { id: 'field-email', msg: 'Please enter a valid email address.', type: 'email' },
        { id: 'field-phone', msg: 'Please enter a phone number.' },
        { id: 'field-company', msg: 'Please enter your company name.' },
        { id: 'field-message', msg: 'Please enter your message.' },
      ];

      fields.forEach(({ id, msg, type }) => {
        const input = document.getElementById(id);
        const group = input?.closest('.form-group');
        if (!input || !group) return;
        const errEl = group.querySelector('.error-msg');

        let error = false;
        const val = input.value.trim();

        if (!val) {
          error = true;
        } else if (type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) error = true;
        }

        if (error) {
          group.classList.add('has-error');
          if (errEl) errEl.textContent = msg;
          valid = false;
        } else {
          group.classList.remove('has-error');
        }
      });

      if (valid) {
        // Show success state
        contactForm.style.display = 'none';
        const success = document.getElementById('form-success');
        if (success) success.style.display = 'block';
      }
    });

    // Clear errors on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });
  }

  /* ============================================================
     SMOOTH SCROLL for anchor links
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     NEWSLETTER FORM
  ============================================================ */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (input && input.value.includes('@')) {
        btn.textContent = 'Subscribed!';
        btn.disabled = true;
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.disabled = false;
        }, 4000);
      }
    });
  });

})();
