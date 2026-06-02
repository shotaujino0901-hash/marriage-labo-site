/* ============================================================
   Hero Canvas — Particles + Rings
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  /* --- Particles --- */
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.r    = Math.random() * 2.5 + 0.5;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.2;
      const hue = Math.random() < 0.6 ? '232,116,138' : '196,149,74';
      this.color = `rgba(${hue},`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  /* --- Rings --- */
  class Ring {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.r     = initial ? Math.random() * 80 : 10;
      this.maxR  = Math.random() * 120 + 60;
      this.speed = Math.random() * 0.4 + 0.2;
      this.alpha = initial ? Math.random() * 0.12 : 0.12;
      this.width = Math.random() * 1.5 + 0.5;
      const hue = Math.random() < 0.5 ? '232,116,138' : '247,197,207';
      this.color = `rgba(${hue},`;
    }
    update() {
      this.r += this.speed;
      this.alpha = 0.12 * (1 - this.r / this.maxR);
      if (this.r > this.maxR) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = this.color + this.alpha + ')';
      ctx.lineWidth = this.width;
      ctx.stroke();
    }
  }

  let particles = [];
  let rings     = [];

  function initParticles() {
    const n = Math.min(Math.floor(canvas.width * canvas.height / 8000), 70);
    particles = Array.from({ length: n }, () => new Particle());
    rings     = Array.from({ length: 8 }, () => new Ring());
  }
  initParticles();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rings.forEach(r => { r.update(); r.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============================================================
   Typewriter Effect (segment-aware)
   ============================================================ */
(function () {
  const el = document.querySelector('.typewriter-target');
  if (!el) return;

  let lines;
  try { lines = JSON.parse(el.dataset.lines); } catch (e) { return; }

  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.appendChild(cursor);

  // lines = [[{t,p}, ...], ...]
  let lineIdx = 0;
  let segIdx  = 0;
  let charIdx = 0;
  let lineEl  = null;
  let segEl   = null;

  function nextLine() {
    lineEl = document.createElement('span');
    lineEl.style.display = 'block';
    el.insertBefore(lineEl, cursor);
    segIdx = 0;
    charIdx = 0;
    nextSegment();
  }

  function nextSegment() {
    const segs = lines[lineIdx];
    if (segIdx >= segs.length) {
      // この行完了
      lineIdx++;
      if (lineIdx < lines.length) {
        setTimeout(nextLine, 280);
      } else {
        setTimeout(() => {
          cursor.style.display = 'none';
          document.querySelectorAll('.hero-delayed').forEach((el, i) => {
            setTimeout(() => el.classList.add('is-visible'), i * 200);
          });
        }, 400);
      }
      return;
    }
    const seg = segs[segIdx];
    segEl = document.createElement('span');
    segEl.className = seg.p ? 'tw-pink' : 'tw-gray';
    lineEl.appendChild(segEl);
    charIdx = 0;
    typeChar();
  }

  function typeChar() {
    const seg = lines[lineIdx][segIdx];
    if (charIdx < seg.t.length) {
      segEl.textContent += seg.t[charIdx];
      charIdx++;
      setTimeout(typeChar, 80);
    } else {
      segIdx++;
      nextSegment();
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const hc = document.querySelector('.hero-content');
      if (hc) hc.classList.add('is-visible');
      setTimeout(nextLine, 300);
    }, 400);
  });
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
