/* ============================================================
   Floating Petals Animation (Hero)
   ============================================================ */
(function () {
  const container = document.querySelector('.hero-petals');
  if (!container) return;

  const PETAL_COUNT = 18;

  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement('div');
    const size  = Math.random() * 12 + 6;
    const left  = Math.random() * 100;
    const delay = Math.random() * 10;
    const dur   = Math.random() * 8 + 10;

    petal.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      top: -${size}px;
      border-radius: 50% 0 50% 0;
      background: rgba(232,116,138,${Math.random() * 0.25 + 0.1});
      animation: petalFall ${dur}s ${delay}s ease-in-out infinite;
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(petal);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes petalFall {
      0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   Scroll Reveal
   ============================================================ */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();

/* ============================================================
   Hero content reveal on load
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const hc = document.querySelector('.hero-content');
    if (hc) hc.classList.add('is-visible');
  }, 200);
});

/* ============================================================
   Drawer Menu
   ============================================================ */
(function () {
  const toggle   = document.querySelector('.nav-toggle');
  const nav      = document.querySelector('.site-nav');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!toggle || !nav) return;

  function openNav() {
    toggle.classList.add('is-open');
    nav.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    toggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    toggle.classList.contains('is-open') ? closeNav() : openNav();
  });

  if (backdrop) backdrop.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
})();
