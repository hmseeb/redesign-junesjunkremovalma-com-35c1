/* June's Junk Removal — site scripts (vanilla JS, no dependencies) */
(function () {
  'use strict';

  /* ---------------- Mobile drawer ---------------- */
  var toggle = document.querySelector('.navtoggle');
  var drawer = document.getElementById('drawer');
  var overlay = document.querySelector('.overlay');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    if (overlay) overlay.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setDrawer(!drawer.classList.contains('is-open'));
    });
  }
  if (overlay) overlay.addEventListener('click', function () { setDrawer(false); });
  var drawerClose = document.querySelector('.drawer__close');
  if (drawerClose) drawerClose.addEventListener('click', function () { setDrawer(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      setDrawer(false);
      closeAllDropdowns();
    }
  });

  /* ---------------- Desktop dropdowns ---------------- */
  var dropItems = Array.prototype.slice.call(document.querySelectorAll('.nav__item--has-menu'));

  function closeAllDropdowns(except) {
    dropItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var btn = item.querySelector('.nav__link');
      if (btn && btn.tagName === 'BUTTON') btn.setAttribute('aria-expanded', 'false');
    });
  }

  dropItems.forEach(function (item) {
    var btn = item.querySelector('.nav__link');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      if (btn.tagName === 'BUTTON') e.preventDefault();
      var open = !item.classList.contains('is-open');
      closeAllDropdowns(item);
      item.classList.toggle('is-open', open);
      if (btn.tagName === 'BUTTON') btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    item.addEventListener('mouseenter', function () {
      if (window.matchMedia('(min-width: 1040px)').matches) {
        closeAllDropdowns(item);
        item.classList.add('is-open');
        if (btn.tagName === 'BUTTON') btn.setAttribute('aria-expanded', 'true');
      }
    });
    item.addEventListener('mouseleave', function () {
      if (window.matchMedia('(min-width: 1040px)').matches) {
        item.classList.remove('is-open');
        if (btn.tagName === 'BUTTON') btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.nav__item--has-menu')) closeAllDropdowns();
  });

  /* ---------------- Sticky header shadow ---------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Reveal on scroll ---------------- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------------- Forms ---------------- */
  var forms = document.querySelectorAll('form[data-leadr]');
  var params = new URLSearchParams(window.location.search);
  var submitted = params.get('submitted') === '1';

  function showThanks(form) {
    var status = form.parentNode.querySelector('.form-status');
    if (!status) return;
    status.hidden = false;
    status.classList.remove('form-status--error');
    status.textContent = 'Thanks, your message was sent. We’ll get back to you shortly — or call 774-400-8888 if it’s urgent.';
  }

  Array.prototype.forEach.call(forms, function (form) {
    /* Always record the page URL so visitors return to the right place. */
    var pageField = form.querySelector('input[name="_page"]');
    if (pageField) pageField.value = window.location.href;

    if (submitted) {
      showThanks(form);
      form.reset();
      if (pageField) pageField.value = window.location.href;
    }

    form.addEventListener('submit', function (e) {
      if (!window.fetch) return; /* fall back to a normal POST */
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      data._page = window.location.href;

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        return res.json().catch(function () { return { ok: res.ok }; });
      }).then(function (json) {
        if (json && json.ok) {
          showThanks(form);
          form.reset();
          var pf = form.querySelector('input[name="_page"]');
          if (pf) pf.value = window.location.href;
          var status = form.parentNode.querySelector('.form-status');
          if (status && status.scrollIntoView) status.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Submission failed');
        }
      }).catch(function () {
        var status = form.parentNode.querySelector('.form-status');
        if (status) {
          status.hidden = false;
          status.classList.add('form-status--error');
          status.textContent = 'Sorry — something went wrong sending your request. Please call or text us at 774-400-8888.';
        }
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = original; }
      });
    });
  });

  /* ---------------- Footer year ---------------- */
  var yr = document.querySelectorAll('[data-year]');
  Array.prototype.forEach.call(yr, function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
