(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 991px)');
  var SCALE = 1.12;
  var SPEED = 0.38;
  var parallax = [];
  var scrollBound = false;
  var ticking = false;

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function revealOnLoad() {
    document.querySelectorAll('.animate--on-load').forEach(function (el) {
      el.classList.add('animate--visible');
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.animate:not(.animate--on-load)');
    if (!items.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('animate--visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('animate--visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 60px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  function shiftFor(section) {
    var rect = section.getBoundingClientRect();
    return (rect.top + rect.height * 0.5 - window.innerHeight * 0.5) * SPEED;
  }
 
  function paint() {
    for (var i = 0; i < parallax.length; i++) {
      var item = parallax[i];
      if (!item.live) continue;
      var y = reduced ? 0 : shiftFor(item.section);
      item.el.style.transform = 'translate3d(0px, ' + y + 'px, 0px) scale(' + SCALE + ')';
      if (item.hero) item.el.style.opacity = '1';
    }
    ticking = false;
  }

  function schedulePaint() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(paint);
    }
  }

  function bindScroll() {
    if (scrollBound || reduced || mobile.matches || !parallax.length) return;
    window.addEventListener('scroll', schedulePaint, { passive: true });
    window.addEventListener('resize', schedulePaint, { passive: true });
    scrollBound = true;
    schedulePaint();
  }

  function unbindScroll() {
    if (!scrollBound) return;
    window.removeEventListener('scroll', schedulePaint);
    window.removeEventListener('resize', schedulePaint);
    scrollBound = false;
  }

  function activate(item) {
    item.live = true;
    if (item.hero) item.el.classList.add('hero__bg--ready');
    schedulePaint();
    bindScroll();
  }

  function register(el, section, hero) {
    var item = { el: el, section: section, hero: hero, live: false };
    parallax.push(item);

    if (hero && !reduced) {
      var done = false;
      function go() {
        if (done) return;
        done = true;
        activate(item);
      }
      el.addEventListener('animationend', go, { once: true });
      setTimeout(go, 1400);
      return;
    }

    activate(item);
  }

  function initParallax() {
    document.querySelectorAll('.hero--parallax .hero__bg').forEach(function (bg) {
      if (bg.dataset.fx) return;
      bg.dataset.fx = '1';
      register(bg, bg.closest('.hero--parallax'), true);
    });

    document.querySelectorAll('.banner--parallax, .section--parallax').forEach(function (section) {
      var bg = section.querySelector('.banner__bg, .section__bg');
      if (!bg || bg.dataset.fx) return;
      bg.dataset.fx = '1';
      register(bg, section, false);
    });

    bindScroll();
  }

  function boot() {
    document.documentElement.classList.remove('no-js');
    revealOnLoad();
    initReveal();
    initParallax();
  }

  onReady(boot);
  window.addEventListener('load', schedulePaint);

  if (mobile.addEventListener) {
    mobile.addEventListener('change', function () {
      if (mobile.matches) unbindScroll();
      else bindScroll();
      schedulePaint();
    });
  }
})();
