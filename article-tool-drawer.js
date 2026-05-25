/**
 * article-tool-drawer.js
 * STL Home Journey — Article Tool Drawer System
 *
 * Loads tools via fetch() injection — no iframe.
 * Links stay contained, scroll works, no cross-origin issues.
 *
 * Usage:
 *   1. Add <script src="../article-tool-drawer.js"></script> to any article
 *   2. Add config div:
 *      <div class="atd-config"
 *           data-tool="fixer-upper"
 *           data-income="80000">
 *      </div>
 */

(function () {
  'use strict';

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

  var _drawerEl = null;
  var _bodyEl = null;
  var _triggerEl = null;
  var _isOpen = false;
  var _loaded = false;
  var _toolUrl = '';
  var _scrollListenerAdded = false;
  var _scrollThreshold = 300;

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    var configs = document.querySelectorAll('.atd-config');
    if (!configs.length) return;

    var cfg = configs[0];
    var toolId = cfg.getAttribute('data-tool') || 'fixer-upper';
    var toolCfg = TOOL_CONFIGS[toolId];
    if (!toolCfg) return;

    var params = {};
    toolCfg.params.forEach(function (p) {
      var val = cfg.getAttribute('data-' + p);
      if (val) params[p] = val;
    });

    _toolUrl = toolCfg.url;
    var qs = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    if (qs) _toolUrl += '?' + qs;

    var label = cfg.getAttribute('data-label') || toolCfg.defaultLabel;

    buildTrigger(label);
    buildDrawer(toolCfg);
    addScrollListener();
  }

  /* ============================================================
     BUILD TRIGGER
  ============================================================ */
  function buildTrigger(label) {
    _triggerEl = document.createElement('div');
    _triggerEl.className = 'atd-trigger';
    _triggerEl.setAttribute('role', 'button');
    _triggerEl.innerHTML =
      '<span class="atd-trigger-icon">🔢</span>' +
      '<span class="atd-trigger-label">' + label + '</span>';
    _triggerEl.addEventListener('click', openDrawer);
    document.body.appendChild(_triggerEl);
  }

  /* ============================================================
     BUILD DRAWER SHELL
  ============================================================ */
  function buildDrawer(toolCfg) {
    _drawerEl = document.createElement('div');
    _drawerEl.className = 'atd-drawer';
    _drawerEl.setAttribute('aria-modal', 'true');
    _drawerEl.setAttribute('role', 'dialog');

    _drawerEl.innerHTML =
      '<div class="atd-handle-bar"><div class="atd-handle"></div></div>' +
      '<div class="atd-drawer-header">' +
        '<div>' +
          '<div class="atd-drawer-title">' + toolCfg.title + '</div>' +
          '<div class="atd-drawer-subtitle">' + toolCfg.subtitle + '</div>' +
        '</div>' +
        '<button class="atd-close" aria-label="Close">' +
          '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">' +
            '<path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="atd-body">' +
        '<div class="atd-loading"><div class="atd-spinner"></div><span>Loading…</span></div>' +
      '</div>';

    _bodyEl = _drawerEl.querySelector('.atd-body');
    _drawerEl.querySelector('.atd-close').addEventListener('click', closeDrawer);
    addDragToClose(_drawerEl.querySelector('.atd-handle-bar'));
    document.body.appendChild(_drawerEl);
  }

  /* ============================================================
     FETCH AND INJECT TOOL CONTENT
  ============================================================ */
  function loadTool() {
    if (_loaded) return;
    _loaded = true;

    fetch(_toolUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        injectTool(html);
      })
      .catch(function (err) {
        showFallback();
      });
  }

  function injectTool(html) {
    // Extract <body> content only
    var bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) { showFallback(); return; }
    var bodyHTML = bodyMatch[1];

    // Extract <style> blocks from <head> to bring in tool-specific styles
    var headStyles = '';
    var styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
    styleMatches.forEach(function (s) {
      // Scope tool styles to .atd-tool-scope to avoid bleeding into article
      var inner = s.replace(/<\/?style[^>]*>/gi, '');
      // Skip shared.css-style rules that would conflict (html, body overrides)
      inner = inner.replace(/^(html|body)\s*\{[^}]*\}/gm, '');
      headStyles += inner + '\n';
    });

    // Inject scoped styles
    if (headStyles.trim()) {
      var styleEl = document.createElement('style');
      styleEl.setAttribute('data-atd-tool', '1');
      styleEl.textContent = headStyles;
      document.head.appendChild(styleEl);
    }

    // Build the tool wrapper
    var wrapper = document.createElement('div');
    wrapper.className = 'atd-tool-scope';
    wrapper.style.cssText = 'height:100%;overflow-y:auto;-webkit-overflow-scrolling:touch;';
    wrapper.innerHTML = bodyHTML;

    // Remove the loading indicator
    var loading = _bodyEl.querySelector('.atd-loading');
    if (loading) loading.remove();

    // Append tool content
    _bodyEl.appendChild(wrapper);

    // Re-execute inline scripts (they don't run via innerHTML)
    var scripts = wrapper.querySelectorAll('script');
    scripts.forEach(function (oldScript) {
      var newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    // Fix internal links — strip the shared.js header/nav that would navigate away
    var artHdr = wrapper.querySelector('.art-hdr');
    if (artHdr) artHdr.style.display = 'none';

    // Fix any relative links to be absolute so they don't 404
    wrapper.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href.startsWith('/') || href.startsWith('http')) return;
      if (href && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
        a.setAttribute('href', '/' + href);
      }
    });
  }

  function showFallback() {
    if (_bodyEl) {
      _bodyEl.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;' +
        'height:100%;padding:32px 24px;text-align:center;">' +
          '<div style="font-size:13px;color:rgba(255,255,255,.6);margin-bottom:20px;line-height:1.6">' +
            'Tap below to open the full tool.' +
          '</div>' +
          '<a href="' + _toolUrl + '" target="_blank" ' +
             'style="display:inline-flex;align-items:center;gap:8px;background:#ffcc4d;color:#050505;' +
             'font-weight:800;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;' +
             'letter-spacing:.04em;text-transform:uppercase;">' +
            'Open Tool →' +
          '</a>' +
        '</div>';
    }
  }

  /* ============================================================
     DRAG TO CLOSE
  ============================================================ */
  function addDragToClose(handleEl) {
    var startY = 0;
    var dragging = false;

    handleEl.addEventListener('touchstart', function (e) {
      startY = e.touches[0].clientY;
      dragging = true;
    }, {passive: true});

    handleEl.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var dy = e.touches[0].clientY - startY;
      if (dy > 0) _drawerEl.style.transform = 'translateY(' + dy + 'px)';
    }, {passive: true});

    handleEl.addEventListener('touchend', function (e) {
      dragging = false;
      var dy = e.changedTouches[0].clientY - startY;
      if (dy > 80) closeDrawer();
      else _drawerEl.style.transform = '';
    });
  }

  /* ============================================================
     OPEN / CLOSE
  ============================================================ */
  function openDrawer() {
    if (_isOpen) return;
    _isOpen = true;
    _drawerEl.style.transform = '';
    _drawerEl.classList.add('atd-open');
    document.body.style.overflow = 'hidden';
    if (_triggerEl) { _triggerEl.style.opacity = '0'; _triggerEl.style.pointerEvents = 'none'; }
    loadTool();
  }

  function closeDrawer() {
    if (!_isOpen) return;
    _isOpen = false;
    _drawerEl.classList.remove('atd-open');
    _drawerEl.style.transform = '';
    document.body.style.overflow = '';
    if (_triggerEl) { _triggerEl.style.opacity = '1'; _triggerEl.style.pointerEvents = ''; }
  }

  /* ============================================================
     SCROLL LISTENER
  ============================================================ */
  function addScrollListener() {
    if (_scrollListenerAdded) return;
    _scrollListenerAdded = true;
    function onScroll() {
      if (!_triggerEl) return;
      if ((window.scrollY || document.documentElement.scrollTop) > _scrollThreshold) {
        _triggerEl.classList.add('atd-trigger-visible');
      }
    }
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
  }

  /* ============================================================
     KEYBOARD
  ============================================================ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && _isOpen) closeDrawer();
  });

  /* ============================================================
     STYLES
  ============================================================ */
  function injectStyles() {
    var s = document.createElement('style');
    s.textContent =
      '.atd-trigger{position:fixed;bottom:calc(20px + env(safe-area-inset-bottom,0px));left:50%;' +
      'transform:translateX(-50%) translateY(80px);z-index:200;background:#ffcc4d;color:#050505;' +
      'display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:100px;' +
      'font-family:"Inter",sans-serif;font-size:13px;font-weight:800;letter-spacing:.03em;' +
      'white-space:nowrap;cursor:pointer;box-shadow:0 4px 24px rgba(0,0,0,.5);opacity:0;' +
      'transition:transform .35s cubic-bezier(.32,.72,0,1),opacity .25s ease;user-select:none;}' +
      '.atd-trigger.atd-trigger-visible{opacity:1;transform:translateX(-50%) translateY(0);}' +
      '.atd-trigger:active{opacity:.85;}' +
      '.atd-trigger-icon{font-size:16px;line-height:1}' +

      '.atd-drawer{position:fixed;inset:0;z-index:400;display:flex;flex-direction:column;' +
      'background:#050505;transform:translateY(100%);' +
      'transition:transform .4s cubic-bezier(.32,.72,0,1);border-radius:16px 16px 0 0;overflow:hidden;}' +
      '.atd-drawer.atd-open{transform:translateY(0);}' +

      '.atd-handle-bar{display:flex;justify-content:center;align-items:center;padding:10px 0 6px;' +
      'flex-shrink:0;cursor:grab;}' +
      '.atd-handle{width:36px;height:4px;background:rgba(255,255,255,.15);border-radius:2px;}' +

      '.atd-drawer-header{display:flex;align-items:center;justify-content:space-between;' +
      'padding:0 16px 12px;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0;}' +
      '.atd-drawer-title{font-family:"Playfair Display",serif;font-size:17px;font-weight:700;' +
      'color:#fff;line-height:1.2;}' +
      '.atd-drawer-subtitle{font-size:11px;color:rgba(255,255,255,.45);margin-top:2px;}' +
      '.atd-close{width:32px;height:32px;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:50%;' +
      'color:rgba(255,255,255,.7);cursor:pointer;font-family:inherit;flex-shrink:0;}' +
      '.atd-close:hover{background:rgba(255,255,255,.14);}' +

      '.atd-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;min-height:0;}' +

      '.atd-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'height:100%;gap:12px;color:rgba(255,255,255,.4);font-size:13px;font-family:"Inter",sans-serif;}' +
      '.atd-spinner{width:24px;height:24px;border:2px solid rgba(255,204,77,.2);' +
      'border-top-color:rgba(255,204,77,.8);border-radius:50%;animation:atd-spin .7s linear infinite;}' +
      '@keyframes atd-spin{to{transform:rotate(360deg)}}' +

      '.atd-tool-scope{padding-bottom:40px;}' +
      '.atd-tool-scope .art-hdr{display:none!important;}' +
      '.atd-tool-scope .compliance-footer{font-size:10px;}';

    document.head.appendChild(s);
  }

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
