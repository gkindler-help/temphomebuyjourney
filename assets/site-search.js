/* Adds a search entry to every page. Pages with the dashboard bar get a
   "Search" tab from shared.js; everywhere else a search button goes in the
   header if it fits, otherwise at the start of the breadcrumb row. */
(function () {
  'use strict';
  var ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

  function button(cls) {
    var a = document.createElement('a');
    a.href = '/search';
    a.className = (cls ? cls + ' ' : '') + 'ss-btn';
    a.setAttribute('aria-label', 'Search the site');
    a.title = 'Search';
    a.innerHTML = ICON;
    return a;
  }
  function overflows(el) {
    return el.scrollWidth > el.clientWidth + 1 || document.documentElement.scrollWidth > window.innerWidth + 1;
  }

  function add() {
    if (document.querySelector('.ss-btn, .dash-tab-search, script[src*="shared.js"]') || location.pathname.replace(/\.html$/, '') === '/search') return;
    var st = document.createElement('style');
    st.textContent = '.ss-btn{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;}.ss-btn svg{display:block;}' +
      '.ss-btn.ss-crumb{margin-right:10px;padding:5px 9px;border:1px solid rgba(255,204,77,.34);border-radius:999px;color:#ffcc4d;align-self:center;}';
    document.head.appendChild(st);

    var nav = document.querySelector('.nbhd-hdr-nav, .art-hdr-nav, .hp-nav');
    if (nav) {
      var first = nav.querySelector('a');
      var bar = nav.closest('header') || nav.parentElement;
      var h = bar.offsetHeight;
      var a = button(first ? first.className.replace(/\bgold\b|\bactive\b/g, '').trim() : '');
      if (nav.classList.contains('hp-nav')) nav.appendChild(a); else nav.insertBefore(a, nav.firstChild);
      if (bar.offsetHeight <= h + 1 && !overflows(bar)) return;
      a.remove();
    }
    var crumb = document.querySelector('.art-nav, nav.breadcrumb, .nbhd-breadcrumb');
    if (crumb) crumb.insertBefore(button('ss-crumb'), crumb.firstChild);
  }
  if (document.readyState === 'complete') add(); else window.addEventListener('load', add);
})();
