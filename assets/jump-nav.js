/* Jump nav for every page: the floating "Sections" button and its "Jump to a section" panel,
   the same component the articles use. Built from the page's own H2 headings (plus the tool,
   Quick Answers and slides when a page has them). Pages that already have their own jump nav
   (#jumpPanel, .jump-panel or a .jumpnav) are left alone. Loaded on every page after calc-track.js. */
(function () {
  'use strict';
  if (window.__stlhjJumpNav) return;
  window.__stlhjJumpNav = 1;

  var SKIP = 'header, footer, nav, .askfloat, .atd-drawer, .atd-config, [hidden], .jump-panel, #ss-overlay, .pagefind-ui';
  var TOOL = '#decoder-tool, .hc-houses-bar, #offer-check, .bp-tool, #calculator, [id$="-calc"], .tool-wrap, .nm-wrap';

  function existing() {
    return document.getElementById('jumpPanel') || document.querySelector('.jump-panel, .jumpnav, .jump-nav, [data-jumpnav]');
  }
  function visible(el) {
    if (!el || el.closest(SKIP)) return false;
    var r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && (r.width > 0 || r.height > 0);
  }
  function slug(t) {
    return t.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'section';
  }
  function label(t) {
    t = t.replace(/\s+/g, ' ').trim();
    return t.length > 52 ? t.slice(0, 50).replace(/\s+\S*$/, '') + '…' : t;
  }
  function ensureId(el, text) {
    if (el.id) return el.id;
    var base = slug(text), id = base, n = 2;
    while (document.getElementById(id)) id = base + '-' + n++;
    el.id = id;
    return id;
  }

  // A heading with a small eyebrow line above it ("Who it's for" / "Buyer fit for Lindbergh") uses its main line.
  function headText(h) {
    var lines = (h.innerText || h.textContent || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    return lines.length > 1 ? lines[lines.length - 1] : (lines[0] || '');
  }

  function targets() {
    var out = [], seen = {};
    function add(el, text) {
      if (!el || !text || text.trim().length < 3) return;
      var id = ensureId(el, text);
      if (seen[id]) return;
      seen[id] = 1; out.push({ id: id, text: label(text), el: el });
    }
    function sorted() {
      return out.slice().sort(function (a, b) { return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
    }
    var tool = [].filter.call(document.querySelectorAll(TOOL), visible)[0];
    if (tool && tool.getBoundingClientRect().top + window.scrollY < 2600) add(tool, 'The tool');
    var qa = document.getElementById('quick-answers') || document.querySelector('.hc-about, section.tool-qa');
    if (qa && visible(qa) && !qa.querySelector('h2')) add(qa, 'Quick Answers');
    var slides = document.getElementById('slides');
    if (slides && visible(slides)) add(slides, 'The slides');
    [].filter.call(document.querySelectorAll('h2'), visible).forEach(function (h) { add(h, headText(h)); });
    if (out.length >= 2) return sorted();
    // Pages built on smaller headings, then pages built from titled sections (hubs).
    [].filter.call(document.querySelectorAll('h3'), visible).forEach(function (h) { add(h, headText(h)); });
    if (out.length >= 2) return sorted();
    [].filter.call(document.querySelectorAll('section[id]'), visible).forEach(function (sec) {
      var sels = ['h2', 'h3', 'h4', '.section-title', '[class*="title"]', '[class*="head"]'], t = null;
      for (var i = 0; i < sels.length && !t; i++) { var c = sec.querySelector(sels[i]); if (c && visible(c)) t = c; }
      if (t) add(sec, headText(t));
    });
    return sorted();
  }

  var CSS =
    '.jump-fab{position:fixed;right:16px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:200;display:inline-flex;align-items:center;gap:8px;background:#ffcc4d;color:#080808;font-weight:800;font-size:12px;letter-spacing:.05em;border:none;border-radius:999px;padding:12px 17px;cursor:pointer;box-shadow:0 6px 22px rgba(0,0,0,.55);font-family:"Inter",-apple-system,sans-serif;}' +
    '.jump-fab-ico{font-size:15px;line-height:1;}' +
    '.jump-panel{position:fixed;right:16px;bottom:calc(74px + env(safe-area-inset-bottom,0px));z-index:200;width:min(288px,calc(100vw - 32px));background:#0d0d0d;border:1px solid rgba(255,204,77,.34);border-radius:14px;padding:8px;box-shadow:0 12px 42px rgba(0,0,0,.6);opacity:0;transform:translateY(10px) scale(.98);transform-origin:bottom right;pointer-events:none;transition:opacity .18s ease,transform .18s ease;max-height:72vh;overflow-y:auto;font-family:"Inter",-apple-system,sans-serif;}' +
    '.jump-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}' +
    '.jump-panel-hd{font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#ffcc4d;padding:8px 12px 8px;}' +
    '.jump-link{display:block;padding:9px 12px;border-radius:8px;font-size:.9rem;color:rgba(255,255,255,.72);text-decoration:none;line-height:1.35;border-left:2px solid transparent;}' +
    '.jump-link:hover{background:rgba(255,204,77,.06);color:#fff;}' +
    '.jump-link.active{color:#ffcc4d;border-left-color:#ffcc4d;background:rgba(255,204,77,.05);}' +
    '@media print{.jump-fab,.jump-panel{display:none!important;}}';

  function ev(name, p) { if (typeof window.gtag === 'function') window.gtag('event', name, p); }

  function build() {
    if (existing()) return true;
    var list = targets();
    if (list.length < 2) return false;
    var st = document.createElement('style'); st.setAttribute('data-jump-nav', '1'); st.textContent = CSS; document.head.appendChild(st);
    var fab = document.createElement('button');
    fab.id = 'jumpToggle'; fab.className = 'jump-fab'; fab.type = 'button';
    fab.setAttribute('aria-label', 'Jump to a section'); fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = '<span class="jump-fab-ico" aria-hidden="true">&#9776;</span><span class="jump-fab-txt">Sections</span>';
    var panel = document.createElement('nav');
    panel.id = 'jumpPanel'; panel.className = 'jump-panel'; panel.setAttribute('aria-hidden', 'true'); panel.setAttribute('aria-label', 'Jump to a section');
    panel.innerHTML = '<div class="jump-panel-hd">Jump to a section</div>' + list.map(function (t) {
      return '<a href="#' + t.id + '" class="jump-link">' + t.text.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }) + '</a>';
    }).join('');
    document.body.appendChild(fab); document.body.appendChild(panel);

    function setOpen(o) { panel.classList.toggle('open', o); fab.setAttribute('aria-expanded', o); panel.setAttribute('aria-hidden', !o); }
    fab.addEventListener('click', function (e) { e.stopPropagation(); var o = !panel.classList.contains('open'); setOpen(o); if (o) ev('section_nav_open', { page: location.pathname }); });
    panel.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('.jump-link'); if (!a) return;
      setOpen(false);
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) {
        e.preventDefault();
        for (var d = t.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) d.open = true;
        // Land below any sticky or fixed bar at the top of the page.
        var bar = 0;
        [].forEach.call(document.elementsFromPoint(window.innerWidth / 2, 2), function (el) {
          var p = getComputedStyle(el).position;
          if ((p === 'fixed' || p === 'sticky') && el !== document.body) bar = Math.max(bar, el.getBoundingClientRect().bottom);
        });
        var before = window.scrollY;
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - Math.min(bar, 160) - 12, behavior: 'smooth' });
        // Pages that scroll inside a wrapper instead of the window.
        setTimeout(function () { if (window.scrollY === before && Math.abs(t.getBoundingClientRect().top) > 80) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
        try { history.replaceState(null, '', '#' + t.id); } catch (err) {}
      }
      ev('section_nav_jump', { section: a.textContent.trim(), target: a.getAttribute('href'), page: location.pathname });
    });
    document.addEventListener('click', function (e) { if (!panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    var links = [].slice.call(panel.querySelectorAll('.jump-link')), map = {};
    links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting && map[en.target.id]) { links.forEach(function (l) { l.classList.remove('active'); }); map[en.target.id].classList.add('active'); } });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      list.forEach(function (t) { obs.observe(t.el); });
    }
    return true;
  }

  // Some pages (neighborhood pages, tools) render their sections with JavaScript after load.
  function start() {
    if (build()) return;
    var tries = 0, iv = setInterval(function () { if (build() || ++tries > 12) clearInterval(iv); }, 500);
  }
  if (document.readyState === 'complete') setTimeout(start, 50);
  else window.addEventListener('load', function () { setTimeout(start, 50); });
})();
