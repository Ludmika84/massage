(function () {
  'use strict';

  if (document.querySelector('.site-trust-bar')) return;

  var bar = document.createElement('div');
  bar.className = 'site-trust-bar';
  bar.setAttribute('role', 'contentinfo');
  bar.setAttribute('aria-label', 'Business contact information');
  bar.innerHTML =
    '<div class="site-trust-bar__inner">' +
      '<span class="site-trust-bar__item"><strong>Body Wisdom Sanctuary</strong></span>' +
      '<span class="site-trust-bar__item">1120 Washington Ave, 2nd Fl, Brooklyn, NY 11225</span>' +
      '<a class="site-trust-bar__item site-trust-bar__link" href="tel:+13478750819">+1 (347) 875-0819</a>' +
      '<a class="site-trust-bar__item site-trust-bar__link site-trust-bar__book" href="https://bodywisdomsanctuary.setmore.com/" rel="noopener noreferrer" target="_blank">Book Online</a>' +
    '</div>';

  var header = document.getElementById('header');
  if (header && header.parentNode) {
    header.parentNode.insertBefore(bar, header.nextSibling);
  }
})();
