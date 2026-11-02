(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Footer date.
  const yearNode = $('#current-year');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  // Theme selection: the inline head script applies the first-visit system theme
  // before the page paints. A visitor's explicit choice is persisted here.
  const themeToggle = $('[data-theme-toggle]');
  const themeColorMeta = $('#theme-color-meta');

  function applyTheme(theme, persist = false) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;

    if (themeToggle) {
      const nextLabel = nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      themeToggle.setAttribute('aria-label', nextLabel);
      themeToggle.setAttribute('title', nextLabel);
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', nextTheme === 'dark' ? '#090f17' : '#f5f8f5');
    }

    if (persist) {
      try {
        localStorage.setItem('aw-portfolio-theme', nextTheme);
      } catch (error) {
        // The page remains usable when browser storage is disabled.
      }
    }
  }

  applyTheme(root.dataset.theme || 'dark');
  themeToggle?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  // Follow OS theme changes only until a visitor has made a saved selection.
  const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeQuery.addEventListener?.('change', (event) => {
    let hasSavedChoice = false;
    try {
      hasSavedChoice = Boolean(localStorage.getItem('aw-portfolio-theme'));
    } catch (error) {
      hasSavedChoice = false;
    }
    if (!hasSavedChoice) applyTheme(event.matches ? 'dark' : 'light');
  });

  // Mobile navigation.
  const menuToggle = $('[data-menu-toggle]');
  const mobileMenu = $('#mobile-menu');

  function closeMobileMenu() {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function toggleMobileMenu() {
    if (!menuToggle || !mobileMenu) return;
    const isOpening = mobileMenu.hidden;
    mobileMenu.hidden = !isOpening;
    menuToggle.setAttribute('aria-expanded', String(isOpening));
    menuToggle.setAttribute('aria-label', isOpening ? 'Close navigation menu' : 'Open navigation menu');
  }

  menuToggle?.addEventListener('click', toggleMobileMenu);
  $$('#mobile-menu a').forEach((link) => link.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });
  document.addEventListener('click', (event) => {
    if (!mobileMenu || mobileMenu.hidden || !menuToggle) return;
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMobileMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) closeMobileMenu();
  }, { passive: true });

  // Reveal sections and project cards as they enter the viewport.
  const revealTargets = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }

  // Active navigation state.
  const sections = $$('main section[id]');
  const desktopLinks = $$('.desktop-nav .nav-link');
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const sectionId = entry.target.id;
        desktopLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${sectionId}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-36% 0px -54% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Add a quiet header treatment after the first screen.
  const header = $('#site-header');
  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle('has-scrolled', window.scrollY > 12);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  // Project filters use category tokens, so one project can belong to more than one filter.
  const filterButtons = $$('.filter-button');
  const projectCards = $$('.project-card[data-categories]');
  const filterStatus = $('#project-filter-status');
  const filters = {
    all: () => true,
    odoo: (categories) => categories.includes('odoo'),
    website: (categories) => categories.includes('website'),
    private: (categories) => categories.includes('private')
  };

  function applyProjectFilter(filterName) {
    const matcher = filters[filterName] || filters.all;
    let visibleCount = 0;

    filterButtons.forEach((button) => {
      const selected = button.dataset.filter === filterName;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    projectCards.forEach((card) => {
      const categories = (card.dataset.categories || '').split(/\s+/).filter(Boolean);
      const shouldShow = matcher(categories);
      card.classList.remove('is-filtering-out');
      card.hidden = !shouldShow;
      if (shouldShow) {
        visibleCount += 1;
        if (!reducedMotion.matches) {
          card.animate?.([
            { opacity: 0, transform: 'translateY(9px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], { duration: 260, easing: 'cubic-bezier(.2,.75,.25,1)' });
        }
      }
    });

    const label = filterName === 'all' ? 'all' : filterName === 'odoo' ? 'Odoo' : filterName === 'website' ? 'website' : 'private';
    if (filterStatus) {
      filterStatus.textContent = `Showing ${visibleCount} ${label} ${visibleCount === 1 ? 'project' : 'projects'}.`;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyProjectFilter(button.dataset.filter || 'all'));
  });

  // Static-site contact form: validate locally, then prepare a mailto draft.
  // It never claims to send or store messages on a server.
  const contactForm = $('#contact-form');
  const formStatus = $('#form-status');
  const emailDraftLink = $('#email-draft-link');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(field, hasError) {
    if (!field) return;
    if (hasError) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  contactForm?.addEventListener('input', (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
    setFieldError(field, false);
    if (formStatus?.classList.contains('is-error')) {
      formStatus.classList.remove('is-error');
      formStatus.textContent = 'Complete the fields to prepare an email draft.';
    }
  });

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameField = $('#contact-name');
    const emailField = $('#contact-email');
    const messageField = $('#contact-message');
    const name = nameField?.value.trim() || '';
    const email = emailField?.value.trim() || '';
    const message = messageField?.value.trim() || '';
    const errors = [
      [nameField, !name],
      [emailField, !emailPattern.test(email)],
      [messageField, !message]
    ];

    errors.forEach(([field, hasError]) => setFieldError(field, hasError));
    const firstInvalid = errors.find(([, hasError]) => hasError)?.[0];
    if (firstInvalid) {
      if (formStatus) {
        formStatus.classList.add('is-error');
        formStatus.classList.remove('is-ready');
        formStatus.textContent = 'Please enter your name, a valid email address and a message.';
      }
      firstInvalid.focus();
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:abdul404wahab@gmail.com?subject=${subject}&body=${body}`;

    if (emailDraftLink) {
      emailDraftLink.href = mailto;
      emailDraftLink.hidden = false;
    }
    if (formStatus) {
      formStatus.classList.remove('is-error');
      formStatus.classList.add('is-ready');
      formStatus.textContent = 'Your message is ready. Select “Open prepared email” to launch your email application.';
    }
  });

  // Guard portrait loading so a missing asset is easy to identify during testing.
  $$('img').forEach((image) => {
    image.addEventListener('error', () => image.classList.add('asset-error'), { once: true });
  });
})();
