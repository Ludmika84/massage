(function () {
  'use strict';

  var STORAGE_KEY = 'cookieConsent';
  var banner = null;

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* storage unavailable */
    }
  }

  function getGatedFrames() {
    return document.querySelectorAll('.cookie-gate[data-src]');
  }

  function enableGatedContent() {
    getGatedFrames().forEach(function (frame) {
      if (!frame.getAttribute('src')) {
        frame.setAttribute('src', frame.getAttribute('data-src'));
      }
    });
  }

  function disableGatedContent() {
    getGatedFrames().forEach(function (frame) {
      if (frame.getAttribute('src')) {
        frame.removeAttribute('src');
      }
    });
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('cookie-banner--visible');
    banner.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cookie-banner-open');
  }

  function showBanner() {
    if (!banner) createBanner();
    banner.classList.add('cookie-banner--visible');
    banner.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cookie-banner-open');

    var primary = banner.querySelector('[data-consent="all"]');
    if (primary) primary.focus();
  }

  function applyConsent(consent) {
    if (consent === 'all') enableGatedContent();
    else disableGatedContent();
  }

  function handleChoice(consent) {
    setConsent(consent);
    applyConsent(consent);
    hideBanner();
  }

  function createBanner() {
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.setAttribute('aria-describedby', 'cookie-banner-desc');
    banner.setAttribute('aria-hidden', 'true');

    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<div class="cookie-banner__content">' +
          '<p class="cookie-banner__title" id="cookie-banner-title">Your Privacy Choices</p>' +
          '<p class="cookie-banner__text" id="cookie-banner-desc">' +
            'We use cookies and similar technologies to operate this website, remember preferences, and load embedded content such as maps. ' +
            'By clicking <strong>Accept All</strong>, you consent to non-essential cookies as described in our ' +
            '<a href="cookie-policy.html">Cookie Policy</a> and ' +
            '<a href="privacy-policy.html">Privacy Policy</a>. ' +
            'Choose <strong>Essential Only</strong> to limit cookies to those required for basic site functionality. ' +
            'We do not sell your personal information. California residents may learn about CCPA rights in our ' +
            '<a href="privacy-policy.html#ccpa-rights">Privacy Policy</a>.' +
          '</p>' +
        '</div>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="cookie-banner__btn cookie-banner__btn--secondary" data-consent="essential">Essential Only</button>' +
          '<button type="button" class="cookie-banner__btn cookie-banner__btn--primary" data-consent="all">Accept All</button>' +
        '</div>' +
      '</div>';

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (btn) handleChoice(btn.getAttribute('data-consent'));
    });

    document.body.appendChild(banner);
  }

  function bindSettingsLink() {
    document.querySelectorAll('[data-cookie-settings]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
          /* ignore */
        }
        disableGatedContent();
        showBanner();
      });
    });
  }

  function hasGpcOptOut() {
    return navigator.globalPrivacyControl === true;
  }

  function init() {
    var consent = getConsent();

    if (!consent && hasGpcOptOut()) {
      setConsent('essential');
      consent = 'essential';
    }

    if (consent) applyConsent(consent);
    else disableGatedContent();

    bindSettingsLink();

    if (!consent) {
      createBanner();
      requestAnimationFrame(function () {
        showBanner();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
