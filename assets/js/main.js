/* ============================================================
   main.js — Veterans Bàsquet Sitges
   Navegació sticky · Hamburger · Scroll suau · Lightbox · i18n UI
   ============================================================ */

/* ──────────────────────────────────────────────────────────
   1. NAVEGACIÓ STICKY
────────────────────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const SCROLL_THRESHOLD = 60;

  function updateNav() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

/* ──────────────────────────────────────────────────────────
   2. HAMBURGER MENU (mòbil)
────────────────────────────────────────────────────────── */
(function initHamburger() {
  const burger = document.getElementById('nav-burger');
  const menu = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');

  if (!burger || !menu) return;

  function openMenu() {
    burger.classList.add('is-active');
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  if (overlay) overlay.addEventListener('click', closeMenu);

  // Tanca en fer clic a un link del menú
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Tanca amb ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });
})();

/* ──────────────────────────────────────────────────────────
   3. SCROLL SUAU AMB OFFSET (per la nav sticky)
────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_HEIGHT = 72; // px — ha de coincidir amb l'alçada de la nav

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   4. TIMELINE — activació de la card corresponent
────────────────────────────────────────────────────────── */
(function initTimeline() {
  const nodes = document.querySelectorAll('.timeline-node');

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const year = node.dataset.year;
      const target = document.getElementById('edition-' + year);
      if (!target) return;

      // Scroll a la card
      const NAV_HEIGHT = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 16;
      window.scrollTo({ top, behavior: 'smooth' });

      // Highlight transitori
      target.classList.add('edition--highlighted');
      setTimeout(() => target.classList.remove('edition--highlighted'), 1500);
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   5. LIGHTBOX
────────────────────────────────────────────────────────── */
(function initLightbox() {
  // Crea el DOM del lightbox si no existeix
  if (!document.getElementById('lightbox')) {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galeria de fotos');
    lb.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <button class="lightbox-close" aria-label="Tancar">&times;</button>
      <button class="lightbox-prev" aria-label="Anterior">&#8592;</button>
      <button class="lightbox-next" aria-label="Següent">&#8594;</button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="" />
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(lb);
  }

  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('.lightbox-img');
  const lbCaption = lb.querySelector('.lightbox-caption');
  const lbClose = lb.querySelector('.lightbox-close');
  const lbPrev = lb.querySelector('.lightbox-prev');
  const lbNext = lb.querySelector('.lightbox-next');
  const lbBackdrop = lb.querySelector('.lightbox-backdrop');

  let currentGallery = [];
  let currentIndex = 0;

  function openLightbox(gallery, index) {
    currentGallery = gallery;
    currentIndex = index;
    showImage(currentIndex);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lb.focus();
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showImage(index) {
    const item = currentGallery[index];
    lbImg.src = item.src;
    lbImg.alt = item.caption || '';
    lbCaption.textContent = item.caption || '';
    lbPrev.style.display = currentGallery.length > 1 ? '' : 'none';
    lbNext.style.display = currentGallery.length > 1 ? '' : 'none';
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showImage(currentIndex);
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showImage(currentIndex);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImage);
  lbNext.addEventListener('click', nextImage);

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Delega els clics als elements de la galeria
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-lightbox]');
    if (!trigger) return;

    const galleryId = trigger.dataset.lightbox;
    const allItems = document.querySelectorAll(`[data-lightbox="${galleryId}"]`);
    const gallery = Array.from(allItems).map(el => ({
      src: el.querySelector('img') ? el.querySelector('img').src : el.dataset.src || '',
      caption: el.dataset.caption || (el.querySelector('img') ? el.querySelector('img').alt : ''),
    }));

    const index = Array.from(allItems).indexOf(trigger);
    openLightbox(gallery, Math.max(0, index));
  });

  // Exposa la funció per cridar-la des d'HTML si cal
  window.openLightbox = openLightbox;
})();

/* ──────────────────────────────────────────────────────────
   6. SELECTOR D'IDIOMA
────────────────────────────────────────────────────────── */
(function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang && typeof setLanguage === 'function') {
        setLanguage(lang);
      }
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   7. INTERSECTION OBSERVER — animació d'entrada
────────────────────────────────────────────────────────── */
(function initAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
})();

/* ──────────────────────────────────────────────────────────
   8. CONTADOR TOTAL RECAPTAT — count-up animation
────────────────────────────────────────────────────────── */
(function initCounter() {
  const el = document.querySelector('.raised-counter__number');
  if (!el) return;

  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  let started = false;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function formatNumber(n) {
    return n.toLocaleString('ca-ES');
  }

  function runCounter() {
    if (started) return;
    started = true;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = formatNumber(Math.round(easeOutQuart(progress) * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
  } else {
    runCounter();
  }
})();

/* ──────────────────────────────────────────────────────────
   9. ANY ACTUAL AL FOOTER
────────────────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();
