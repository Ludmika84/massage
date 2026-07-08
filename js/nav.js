(function () {
  'use strict';

  var DESKTOP_MIN = 992;
  var resizeTimer;

  function closeMenu(menu) {
    menu.classList.remove('open');
    document.body.classList.remove('u-offcanvas-opened');
    document.documentElement.style.overflow = '';

    var collapse = menu.querySelector('.u-nav-container-collapse');
    if (collapse) collapse.style.width = '';
  }

  function openMenu(menu) {
    menu.classList.add('open');
    document.body.classList.add('u-offcanvas-opened');
    document.documentElement.style.overflow = 'hidden';

    var collapse = menu.querySelector('.u-nav-container-collapse');
    if (collapse) collapse.style.width = '100%';
  }

  function toggleMenu(menu) {
    if (menu.classList.contains('open')) closeMenu(menu);
    else openMenu(menu);
  }

  function closeAllMenus() {
    document.querySelectorAll('.u-menu.open').forEach(closeMenu);
  }

  function isDesktop() {
    return window.innerWidth >= DESKTOP_MIN;
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (isDesktop()) closeAllMenus();
    }, 120);
  }

  document.querySelectorAll('.u-menu').forEach(function (menu) {
    var toggle = menu.querySelector('.menu-collapse .u-nav-link');
    var overlay = menu.querySelector('.u-menu-overlay');
    var closeBtn = menu.querySelector('.u-menu-close');

    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        toggleMenu(menu);
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        closeMenu(menu);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeMenu(menu);
      });
    }

    menu.querySelectorAll('.u-sidenav .u-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu(menu);
      });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllMenus();
  });

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });
})();
