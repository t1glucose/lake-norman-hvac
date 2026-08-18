/* Lake Norman HVAC - site behaviour
   Vanilla, no dependencies. Progressive enhancement only:
   every feature below degrades to working HTML if JS fails. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.getElementById('mobile-nav');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('[data-nav-label]').textContent = open ? 'Close' : 'Menu';
    });

    // Escape closes the panel and returns focus to the trigger.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('[data-nav-label]').textContent = 'Menu';
        toggle.focus();
      }
    });
  }

  /* ---------- Before / After slider ----------
     Built on a native range input so it is keyboard operable and
     single-pointer friendly by default (WCAG 2.2 "Dragging Movements").
     Arrow keys, Home/End and click-to-position all work for free. */
  document.querySelectorAll('[data-ba]').forEach(function (ba) {
    var range = ba.querySelector('.ba__range');
    if (!range) return;

    function paint() {
      ba.style.setProperty('--pos', range.value + '%');
      range.setAttribute('aria-valuetext', 'Showing ' + range.value + '% of the new install');
    }

    range.addEventListener('input', paint);
    paint();
  });

  /* ---------- Scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });

    // Safety net: if anything is still hidden after 2.5s - an observer that
    // never fires, a browser quirk - show it anyway. Nothing on this page is
    // allowed to stay invisible.
    window.setTimeout(function () {
      revealables.forEach(function (el) { el.classList.add('in'); });
    }, 2500);
  }

  /* ---------- Hero video ----------
     Autoplay is a hint, not a guarantee. If the browser blocks it, or the
     visitor asked for reduced motion, we fall back to the poster frame. */
  var hero = document.querySelector('[data-hero-video]');
  if (hero) {
    if (reduced) {
      hero.removeAttribute('autoplay');
      hero.pause();
      hero.hidden = true;
    } else {
      // A rejected play() promise is not proof of failure - a stalled range
      // request can reject the first attempt and then recover. Only fall back
      // to the poster if the video is genuinely still stopped, and undo the
      // fallback the moment it does start.
      hero.addEventListener('playing', function () { hero.hidden = false; });
      hero.addEventListener('error', function () { hero.hidden = true; });

      var tryPlay = function () {
        var attempt = hero.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            // Only fall back to the poster once the page is actually visible.
            // A page loaded in a background tab has autoplay deferred by
            // design - that is not a failure, so don't give up on it yet.
            if (hero.paused && !document.hidden) hero.hidden = true;
          });
        }
      };

      tryPlay();

      // Loaded in a background tab? Try again when the visitor switches to it.
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && hero.paused) tryPlay();
      });
    }
  }

  /* ---------- Contact form ----------
     No backend is wired up yet, so we intercept, validate, and tell the
     visitor plainly how to reach us instead of silently losing the message. */
  var form = document.querySelector('[data-quote-form]');
  if (form) {
    var status = form.querySelector('[data-form-status]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var invalid = form.querySelectorAll(':invalid');
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      status.hidden = false;
      status.textContent =
        'This form is not connected to email yet - see README-SETUP.md. ' +
        'For now, please call (704) 555-0100 and we will get you on the schedule.';
      status.focus();
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();