/* ============================================================
   CHRYSM DIGITAL SOLUTIONS — main.js
   All interactivity: nav, hero, animations, form, sliders
   ============================================================ */

(function () {
  'use strict';

  /* ─── Navbar Scroll ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateQuickConnect();
  });

  /* ─── Mobile Menu ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ─── Scroll Reveal with IntersectionObserver ─── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = e.target.style.transitionDelay || '0s';
        e.target.style.transitionDelay = delay;
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  /* ─── Hero: Stagger children reveals ─── */
  const heroTop = document.querySelector('.hero-top');
  if (heroTop) {
    heroTop.style.opacity = '0';
    heroTop.style.transform = 'translateY(-30px)';
    heroTop.style.transition = 'opacity 1s ease 0.3s, transform 1s ease 0.3s';
    requestAnimationFrame(() => {
      setTimeout(() => {
        heroTop.style.opacity = '1';
        heroTop.style.transform = 'translateY(0)';
      }, 200);
    });
  }

  /* ─── Hero Zones: Parallax on mousemove ─── */
  const heroZones = document.querySelectorAll('.hero-zone');
  document.getElementById('hero').addEventListener('mousemove', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroZones.forEach(zone => {
      const bg = zone.querySelector('.hero-zone-bg');
      if (bg) {
        bg.style.transform = `scale(1.06) translate(${x * 12}px, ${y * 8}px)`;
      }
    });
  });

  /* ─── Magnetic Buttons ─── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ─── FAQ Accordion ─── */
  window.toggleFaq = function (btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(f => f.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  };

  /* ─── Multi-Step Discovery Form ─── */
  let currentStep = 1;
  const totalSteps = 4;

  window.nextStep = function (step) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`dot-${currentStep}`).classList.remove('active');
    document.getElementById(`dot-${currentStep}`).classList.add('done');
    currentStep = step;
    const stepEl = document.getElementById(`step-${currentStep}`);
    if (stepEl) {
      stepEl.classList.add('active');
      document.getElementById(`dot-${currentStep}`).classList.add('active');
      document.getElementById(`dot-${currentStep}`).classList.remove('done');
    }
    // Update progress bar
    const pct = (currentStep / totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${pct}%`;
    // Scroll form into view
    document.getElementById('form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.toggleService = function (card) {
    card.classList.toggle('selected');
  };

  window.toggleBudget = function (opt) {
    document.querySelectorAll('.budget-opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
  };

  window.submitForm = function () {
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
      const s = document.getElementById(`step-${i}`);
      if (s) s.classList.remove('active');
    }
    document.querySelector('.form-progress-bar').style.display = 'none';
    document.querySelector('.form-step-indicator').style.display = 'none';
    document.getElementById('progress-fill').style.width = '100%';
    const successMsg = document.getElementById('success-msg');
    successMsg.classList.add('show');
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* ─── Before/After Slider ─── */
  const baContainer = document.getElementById('ba-container');
  const baBefore = document.getElementById('ba-before');
  const baHandle = document.getElementById('ba-handle');

  if (baContainer && baBefore && baHandle) {
    let isDragging = false;

    const setPos = (x) => {
      const rect = baContainer.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      baBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      baHandle.style.left = `${pct}%`;
    };

    baHandle.addEventListener('mousedown', () => { isDragging = true; });
    baContainer.addEventListener('mousemove', (e) => { if (isDragging) setPos(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch support
    baHandle.addEventListener('touchstart', () => { isDragging = true; });
    baContainer.addEventListener('touchmove', (e) => {
      if (isDragging) setPos(e.touches[0].clientX);
    });
    window.addEventListener('touchend', () => { isDragging = false; });
  }

  /* ─── Floating Quick Connect Button ─── */
  const qcBtn = document.getElementById('qc-btn');
  const qcText = document.getElementById('qc-text');

  const sectionCtas = [
    { id: 'marketing', color: 'yellow', text: 'Start My Market Takeover' },
    { id: 'webdev', color: 'yellow', text: 'Build My Digital Flagship' },
    { id: 'social', color: 'gold', text: 'Evolve My Identity' },
    { id: 'analytics', color: 'gold', text: 'Schedule a Strategy Deep-Dive' },
    { id: 'faq', color: 'yellow', text: 'Quick Connect' },
    { id: 'discovery', color: 'gold', text: 'Let\'s Build the Future' },
  ];

  const updateQuickConnect = () => {
    const scrollY = window.scrollY + window.innerHeight / 2;
    let active = sectionCtas[0];
    sectionCtas.forEach(s => {
      const el = document.getElementById(s.id);
      if (el && el.offsetTop <= scrollY) active = s;
    });
    qcBtn.className = `qc-btn ${active.color}`;
    qcText.textContent = active.text;
  };
  updateQuickConnect();

  /* ─── Bar Chart Animation on Scroll ─── */
  const barItems = document.querySelectorAll('.bar-item');
  const barHeights = [45, 60, 40, 80, 65, 90, 75];
  barItems.forEach((bar, i) => {
    bar.style.height = '4px';
    bar.style.transition = `height 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`;
  });

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        barItems.forEach((bar, i) => {
          bar.style.height = `${barHeights[i] || 50}%`;
        });
        barObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const barChart = document.querySelector('.bar-chart');
  if (barChart) barObserver.observe(barChart);

  /* ─── Noise-to-Clarity scroll parallax ─── */
  const noiseSide = document.querySelector('.noise-side');
  const claritySide = document.querySelector('.clarity-side');
  if (noiseSide && claritySide) {
    window.addEventListener('scroll', () => {
      const rect = noiseSide.closest('.noise-clarity').getBoundingClientRect();
      const progress = 1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1);
      noiseSide.style.opacity = `${Math.max(0.15, 1 - progress * 0.85)}`;
      claritySide.style.opacity = `${Math.min(1, 0.2 + progress * 0.8)}`;
    });
  }

  /* ─── Stagger bento cards ─── */
  document.querySelectorAll('.bento-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
  });

  /* ─── Smooth scroll for all anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
