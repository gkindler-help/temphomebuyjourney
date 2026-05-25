/**
 * article-tool-drawer.js
 * STL Home Journey — Article Tool Drawer System
 *
 * Adds a floating drawer to article pages that loads tools
 * in a full-height bottom panel without touching shared.js.
 *
 * Usage:
 *   1. Add <script src="../article-tool-drawer.js"></script> to any article
 *   2. Add a trigger config anywhere in the page:
 *      <div class="atd-config"
 *           data-tool="fixer-upper"
 *           data-income="80000"
 *           data-sqft=""
 *           data-label="Compare Fixer Upper vs. Move-In Ready">
 *      </div>
 *
 * Supported tools:
 *   fixer-upper  → /fixer-upper-vs-move-in
 *   cash-decoder → /tools/cash-offer-decoder
 *   affordability → /afford
 *   matcher      → /neighborhood-matcher
 *
 * URL params auto-injected by tool:
 *   fixer-upper: ?income=&sqft=&loantype=
 *   (future tools can define their own params in TOOL_CONFIGS)
 */

(function () {
  'use strict';

  /* ============================================================
     TOOL CONFIGS
     ============================================================ */
  var TOOL_CONFIGS = {
    'fixer-upper': {
      url: '/fixer-upper-vs-move-in-stl',
      title: 'Fixer Upper vs. Move-In Ready',
      subtitle: 'True cost comparison by neighborhood',
      params: ['income', 'sqft', 'loantype'],
      defaultLabel: 'Compare Fixer Upper vs. Move-In Ready →',
    },
    'cash-decoder': {
      url: '/tools/cash-offer-decoder',
      title: 'Cash Offer Decoder',
      subtitle: 'Is your cash offer fair?',
      params: [],
      defaultLabel: 'Decode Your Cash Offer →',
    },
    'affordability': {
      url: '/afford',
      title: 'Affordability Map',
      subtitle: 'St. Louis by zip code',
      params: ['income'],
      defaultLabel: 'See What Your Budget Buys →',
    },
    'matcher': {
      url: '/neighborhood-matcher',
      title: 'Neighborhood Matcher',
      subtitle: 'Find your fit',
      params: [],
      defaultLabel: 'Find Your Neighborhood →',
    },
  };

  /* ============================================================
     STATE
  ============================================================ */
  var _drawerEl = null;
  var _iframeEl = null;
  var _triggerEl = null;
  var _isOpen = false;
  var _scrollThreshold = 300;
  var _scrollListenerAdded = false;
  var _scrollY = 0;

  /* ============================================================
     INIT — runs after DOM ready
  ============================================================ */
  function init() {
    var configs = document.querySelectorAll('.atd-config');
    if (!configs.length) return;

    // Use first config found
    var cfg = configs[0];
    var toolId = cfg.getAttribute('data-tool') || 'fixer-upper';
    var toolCfg = TOOL_CONFIGS[toolId];
    if (!toolCfg) return;

    // Build URL with params
    var params = {};
    toolCfg.params.forEach(function (p) {
      var val = cfg.getAttribute('data-' + p);
      if (val) params[p] = val;
    });

    var url = toolCfg.url;
    var qs = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    if (qs) url += '?' + qs;

    var label = cfg.getAttribute('data-label') || toolCfg.defaultLabel;

    buildTrigger(label, toolId);
    buildDrawer(url, toolCfg);
    addScrollListener();
  }

  function showFallback() {
    var loading = _drawerEl.querySelector('.atd-loading');
    if (loading) {
      loading.innerHTML =
        '<div style="text-align:center;padding:32px 24px">' +
          '<div style="font-size:13px;color:rgba(255,255,255,.6);margin-bottom:16px;line-height:1.6">' +
            'Open the tool in a new tab to use it.' +
          '</div>' +
          '<a href="' + (_iframeEl.getAttribute('data-src') || '/fixer-upper-vs-move-in-stl') + '" ' +
             'target="_blank" ' +
             'style="display:inline-flex;align-items:center;gap:8px;background:#ffcc4d;color:#050505;' +
             'font-weight:800;font-size:13px;padding:13px 24px;border-radius:9px;text-decoration:none;' +
             'letter-spacing:.04em;text-transform:uppercase">' +
            'Open Tool →' +
          '</a>' +
        '</div>';
      loading.style.display = 'flex';
    }
    _iframeEl.style.display = 'none';
  }

  /* ============================================================
     BUILD TRIGGER PILL
  ============================================================ */
  function buildTrigger(label, toolId) {
    _triggerEl = document.createElement('div');
    _triggerEl.className = 'atd-trigger';
    _triggerEl.setAttribute('role', 'button');
    _triggerEl.setAttribute('aria-label', 'Open ' + label);
    _triggerEl.innerHTML =
      '<span class="atd-trigger-icon">🔢</span>' +
      '<span class="atd-trigger-label">' + label + '</span>';

    _triggerEl.addEventListener('click', openDrawer);
    document.body.appendChild(_triggerEl);
  }

  /* ============================================================
     BUILD DRAWER
  ============================================================ */
  function buildDrawer(url, toolCfg) {
    _drawerEl = document.createElement('div');
    _drawerEl.className = 'atd-drawer';
    _drawerEl.setAttribute('aria-modal', 'true');
    _drawerEl.setAttribute('role', 'dialog');

    _drawerEl.innerHTML =
      '<div class="atd-drawer-handle-bar"><div class="atd-handle"></div></div>' +
      '<div class="atd-drawer-header">' +
        '<div class="atd-drawer-titles">' +
          '<div class="atd-drawer-title">' + toolCfg.title + '</div>' +
          '<div class="atd-drawer-subtitle">' + toolCfg.subtitle + '</div>' +
        '</div>' +
        '<button class="atd-drawer-close" aria-label="Close tool">' +
          '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">' +
            '<path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="atd-drawer-body">' +
        '<div class="atd-loading">' +
          '<div class="atd-spinner"></div>' +
          '<span>Loading tool…</span>' +
        '</div>' +
        '<iframe class="atd-iframe" src="" frameborder="0" scrolling="yes" allowtransparency="true"></iframe>' +
      '</div>';

    _drawerEl.querySelector('.atd-drawer-close').addEventListener('click', closeDrawer);

    // Drag to close on handle
    addDragToClose(_drawerEl.querySelector('.atd-drawer-handle-bar'));

    // Backdrop tap closes
    _drawerEl.addEventListener('click', function (e) {
      if (e.target === _drawerEl) closeDrawer();
    });

    _iframeEl = _drawerEl.querySelector('.atd-iframe');
    _iframeEl.setAttribute('data-src', url);

    // When iframe loads, hide the loading spinner
    _iframeEl.addEventListener('load', function () {
      var loading = _drawerEl.querySelector('.atd-loading');
      if (loading) loading.style.display = 'none';
      _iframeEl.style.opacity = '1';

      // Check if iframe actually rendered content (black screen detection)
      // If contentDocument is blocked, show fallback link instead
      try {
        var doc = _iframeEl.contentDocument || _iframeEl.contentWindow.document;
        if (!doc || !doc.body || doc.body.innerHTML === '') {
          showFallback();
        }
      } catch(e) {
        // Cross-origin access blocked — iframe may still work visually
        // Show fallback after a delay if still black
        setTimeout(function() {
          if (_iframeEl.style.opacity === '1') return; // loaded fine
          showFallback();
        }, 3000);
      }
    });

    // Fallback if iframe fails to load at all
    _iframeEl.addEventListener('error', showFallback);

    document.body.appendChild(_drawerEl);
  }

  /* ============================================================
     DRAG TO CLOSE
  ============================================================ */
  function addDragToClose(handleEl) {
    var startY = 0;
    var isDragging = false;

    handleEl.addEventListener('touchstart', function (e) {
      startY = e.touches[0].clientY;
      isDragging = true;
    }, {passive: true});

    handleEl.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      var dy = e.touches[0].clientY - startY;
      if (dy > 0) {
        _drawerEl.style.transform = 'translateY(' + dy + 'px)';
      }
    }, {passive: true});

    handleEl.addEventListener('touchend', function (e) {
      isDragging = false;
      var dy = e.changedTouches[0].clientY - startY;
      if (dy > 80) {
        closeDrawer();
      } else {
        _drawerEl.style.transform = '';
      }
    });
  }

  /* ============================================================
     OPEN / CLOSE
  ============================================================ */
  function openDrawer() {
    if (_isOpen) return;
    _isOpen = true;

    // Lazy load the iframe on first open
    if (_iframeEl && !_iframeEl.src && _iframeEl.getAttribute('data-src')) {
      _iframeEl.src = _iframeEl.getAttribute('data-src');
    }

    _drawerEl.style.transform = '';
    _drawerEl.classList.add('atd-open');

    // Prevent background scroll using pointer-events only — doesn't affect iframe
    document.body.style.pointerEvents = 'none';
    _drawerEl.style.pointerEvents = 'all';

    // Hide trigger while drawer is open
    if (_triggerEl) _triggerEl.style.opacity = '0';
    if (_triggerEl) _triggerEl.style.pointerEvents = 'none';

    // Trap focus
    setTimeout(function () {
      var close = _drawerEl.querySelector('.atd-drawer-close');
      if (close) close.focus();
    }, 400);
  }

  function closeDrawer() {
    if (!_isOpen) return;
    _isOpen = false;

    _drawerEl.classList.remove('atd-open');
    _drawerEl.style.transform = '';

    // Restore pointer events
    document.body.style.pointerEvents = '';
    _drawerEl.style.pointerEvents = '';

    if (_triggerEl) {
      _triggerEl.style.opacity = '1';
      _triggerEl.style.pointerEvents = '';
    }
  }

  /* ============================================================
     SCROLL LISTENER — show trigger after threshold
  ============================================================ */
  function addScrollListener() {
    if (_scrollListenerAdded) return;
    _scrollListenerAdded = true;

    function onScroll() {
      if (!_triggerEl) return;
      var scrolled = window.scrollY || document.documentElement.scrollTop;
      if (scrolled > _scrollThreshold) {
        _triggerEl.classList.add('atd-trigger-visible');
      }
    }

    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll(); // check on load in case page is already scrolled
  }

  /* ============================================================
     INJECT STYLES
  ============================================================ */
  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      /* TRIGGER PILL */
      '.atd-trigger{',
        'position:fixed;',
        'bottom:calc(20px + env(safe-area-inset-bottom, 0px));',
        'left:50%;',
        'transform:translateX(-50%) translateY(80px);',
        'z-index:200;',
        'background:var(--gold,#ffcc4d);',
        'color:#050505;',
        'display:flex;align-items:center;gap:8px;',
        'padding:12px 20px;',
        'border-radius:100px;',
        'font-family:var(--font-sans,"Inter",sans-serif);',
        'font-size:13px;font-weight:800;',
        'letter-spacing:.03em;',
        'white-space:nowrap;',
        'cursor:pointer;',
        'box-shadow:0 4px 24px rgba(0,0,0,.5);',
        'opacity:0;',
        'transition:transform .35s cubic-bezier(.32,.72,0,1), opacity .25s ease;',
        'user-select:none;',
      '}',
      '.atd-trigger.atd-trigger-visible{',
        'opacity:1;',
        'transform:translateX(-50%) translateY(0);',
      '}',
      '.atd-trigger:hover{',
        'background:rgba(255,204,77,.88);',
      '}',
      '.atd-trigger-icon{font-size:16px;line-height:1}',
      '.atd-trigger-label{font-size:13px}',

      /* DRAWER */
      '.atd-drawer{',
        'position:fixed;',
        'inset:0;',
        'z-index:400;',
        'display:flex;flex-direction:column;',
        'background:var(--bg,#050505);',
        'transform:translateY(100%);',
        'transition:transform .4s cubic-bezier(.32,.72,0,1);',
        'border-radius:16px 16px 0 0;',
        'overflow:hidden;',
      '}',
      '.atd-drawer.atd-open{transform:translateY(0)}',

      /* HANDLE BAR */
      '.atd-drawer-handle-bar{',
        'display:flex;justify-content:center;align-items:center;',
        'padding:10px 0 6px;',
        'flex-shrink:0;',
        'cursor:grab;',
        'background:var(--bg,#050505);',
      '}',
      '.atd-handle{',
        'width:36px;height:4px;',
        'background:rgba(255,255,255,.15);',
        'border-radius:2px;',
      '}',

      /* HEADER */
      '.atd-drawer-header{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:0 16px 12px;',
        'border-bottom:1px solid rgba(255,255,255,.08);',
        'flex-shrink:0;',
        'background:var(--bg,#050505);',
      '}',
      '.atd-drawer-titles{}',
      '.atd-drawer-title{',
        'font-family:var(--font-serif,"Playfair Display",serif);',
        'font-size:17px;font-weight:700;',
        'color:var(--white,#fff);',
        'line-height:1.2;',
      '}',
      '.atd-drawer-subtitle{',
        'font-size:11px;',
        'color:rgba(255,255,255,.45);',
        'margin-top:2px;',
      '}',
      '.atd-drawer-close{',
        'width:32px;height:32px;',
        'display:flex;align-items:center;justify-content:center;',
        'background:rgba(255,255,255,.08);',
        'border:1px solid rgba(255,255,255,.1);',
        'border-radius:50%;',
        'color:rgba(255,255,255,.7);',
        'cursor:pointer;',
        'font-family:inherit;',
        'flex-shrink:0;',
        'transition:background .15s;',
      '}',
      '.atd-drawer-close:hover{background:rgba(255,255,255,.14)}',

      /* BODY + IFRAME */
      '.atd-drawer-body{',
        'flex:1;',
        'display:flex;',
        'flex-direction:column;',
        'min-height:0;',
        'overflow:hidden;',
      '}',
      '.atd-loading{',
        'flex:1;',
        'display:flex;flex-direction:column;',
        'align-items:center;justify-content:center;',
        'gap:12px;',
        'color:rgba(255,255,255,.4);',
        'font-size:13px;',
        'font-family:var(--font-sans,"Inter",sans-serif);',
      '}',
      '.atd-spinner{',
        'width:24px;height:24px;',
        'border:2px solid rgba(255,204,77,.2);',
        'border-top-color:rgba(255,204,77,.8);',
        'border-radius:50%;',
        'animation:atd-spin .7s linear infinite;',
      '}',
      '@keyframes atd-spin{to{transform:rotate(360deg)}}',
      '.atd-iframe{',
        'flex:1;',
        'min-height:0;',
        'width:100%;',
        'height:100%;',
        'border:none;',
        'display:block;',
        'background:var(--bg,#050505);',
        'overflow:auto;',
        '-webkit-overflow-scrolling:touch;',
        'opacity:0;',
        'transition:opacity .3s ease;',
      '}',
    ].join('');

    document.head.appendChild(style);
  }

  /* ============================================================
     KEYBOARD — ESC closes
  ============================================================ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && _isOpen) closeDrawer();
  });

  /* ============================================================
     BOOT
  ============================================================ */
  injectStyles();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
