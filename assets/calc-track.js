/* Sends one GA4 "calc_use" event the first time a visitor changes an input in
   each calculator or tool on a page. tool = the nearest container id. */
(function () {
  'use strict';
  var seen = {};
  var SKIP = 'header, nav, [role="search"], #ss-form, .pagefind-ui, [id^="askfloat"]';
  function onUse(e) {
    var el = e.target;
    if (!el || !/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
    if (/^(hidden|search|submit|button)$/i.test(el.type || '')) return;
    if (el.closest && el.closest(SKIP)) return;
    var up = el.parentElement;
    var box = up && (up.closest('form[id], [data-tool], [id*="calc"], [class*="calc"][id]') || up.closest('section[id], [id]'));
    var tool = box ? (box.getAttribute('data-tool') || box.id) : 'page';
    if (seen[tool]) return;
    seen[tool] = 1;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'calc_use', { tool: tool, page: location.pathname });
    }
  }
  document.addEventListener('input', onUse, true);
  document.addEventListener('change', onUse, true);
})();
