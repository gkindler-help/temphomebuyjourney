/* ==========================================================================
   ASK ME — reusable contextual CTA for STL Home Journey
   --------------------------------------------------------------------------
   Use on a page:
     <div data-ask-me="CONTEXT_KEY"><p><a href="/ask?about=CONTEXT_KEY">…</a></p></div>
     <script src="/assets/ask-me.js?v=1" defer></script>
   The placeholder's link is the no-JS fallback; this script replaces it with
   the styled component. All CTA copy lives in CONTEXTS below (source of truth,
   mirrored in /docs/ask-me-conversion-map.md). /ask reads the same registry.

   Source title and URL are taken from the page itself at click time, so they
   never need to be configured per page.

   GA4: ask_me_click { page_path, page_title, ask_context, ask_intent, ask_button }
   No personal information is ever sent to analytics.
   ========================================================================== */
(function () {
  'use strict';

  // address: true = show the property-address field on /ask, false = hide it
  var CONTEXTS = {
    /* ---- default for direct visits to /ask ---- */
    'general': { intent: 'general', label: 'General question', address: true },

    /* ---- BUYER ---- */
    'home': {
      intent: 'buyer', label: 'A house you’re considering', address: true,
      headline: 'Found a house you’re seriously considering?',
      support: 'Send me the address and tell me what you’re wondering about. I’ll tell you what I’d want to check before deciding what to do next.',
      button: 'Ask Me About the House'
    },
    'home-inspection': {
      intent: 'buyer', label: 'Home inspection', address: true,
      headline: 'Something about the house worrying you?',
      support: 'Tell me what you’re seeing—or what showed up in the inspection—and I’ll help you think through what it could mean for the deal.',
      button: 'Ask Me What I’d Look At'
    },
    'federal-pacific-va': {
      intent: 'buyer', label: 'Federal Pacific panel / VA loan', address: true,
      headline: 'Found one of these panels in a house you’re considering?',
      support: 'Send me the address. I’ll help you think through what it could mean for the property, financing and offer before you commit.',
      button: 'Ask Me About the House'
    },
    'va-pre-offer': {
      intent: 'buyer', label: 'VA pre-offer screening', address: true,
      headline: 'Found a house you want to write on?',
      support: 'Send me the address before you offer. I’ll tell you what I’d want to look at from the real-estate side before putting the deal together.',
      button: 'Ask Me to Look at It Before You Offer'
    },
    'mhdc': {
      intent: 'buyer', label: 'MHDC assistance', address: true,
      headline: 'Planning to use MHDC on an actual house?',
      support: 'Send me the house and tell me where you are in the process. I’ll help you think through how the program interacts with the offer and transaction.',
      button: 'Ask Me About the Deal'
    },
    'price-value': {
      intent: 'buyer', label: 'Price and value', address: true,
      headline: 'Found a house and wondering if the price makes sense?',
      support: 'Send me the address and asking price. I’ll tell you what I’d want to look at before deciding what the house may be worth to you.',
      button: 'Ask Me About the Price'
    },
    'fixer-upper': {
      intent: 'buyer', label: 'Fixer-upper', address: true,
      headline: 'Looking at a fixer right now?',
      support: 'Send me the house and what you think it needs. We can look at whether the price leaves enough room for the work.',
      button: 'Ask Me If the Numbers Make Sense'
    },
    'multiple-offers': {
      intent: 'buyer', label: 'Competing offers', address: true,
      headline: 'About to compete for a house?',
      support: 'Send me the listing and tell me what you’re thinking. I’ll help you think through price, terms and where the real risk is before you chase the house.',
      button: 'Ask Me How I’d Structure the Offer'
    },
    'area-comparison': {
      intent: 'buyer', label: 'Comparing areas', address: false,
      headline: 'Down to two or three areas?',
      support: 'Tell me which ones and what matters most to you. I’ll help you compare the tradeoffs.',
      button: 'Ask Me to Compare Them'
    },
    'buyer-start': {
      intent: 'buyer', label: 'Getting started', address: false,
      headline: 'Ready to stop researching and start looking?',
      support: 'Tell me where you are in the process and what you’re trying to figure out next.',
      button: 'Ask Me to Help You Start'
    },

    /* ---- SELLER ---- */
    'expired-review': {
      intent: 'seller', label: 'Listing that didn’t sell', address: true,
      headline: 'Want me to look at what actually happened?',
      support: 'Send me the property and tell me what happened during the listing. I’ll help you work through the evidence before you decide what to change.',
      button: 'Ask Me to Review Your Listing'
    },
    'no-showings': {
      intent: 'seller', label: 'No showings', address: true,
      headline: 'Your house is listed and nobody’s coming?',
      support: 'Send me the listing. I’ll help you look at what buyers are seeing before you automatically assume the answer is another price reduction.',
      button: 'Ask Me to Look at the Listing'
    },
    'showings-no-offers': {
      intent: 'seller', label: 'Showings but no offers', address: true,
      headline: 'Getting traffic but nobody’s writing?',
      support: 'Send me the listing and tell me what feedback you’ve received. I’ll help you work through what the showing activity may be telling you.',
      button: 'Ask Me What Buyers May Be Telling You'
    },
    'price-reduction': {
      intent: 'seller', label: 'Price reduction', address: true,
      headline: 'Thinking about cutting the price?',
      support: 'Before you change it, send me the listing and what has happened so far. I’ll help you look at the evidence.',
      button: 'Ask Me Before You Reduce It'
    },
    'winter-selling': {
      intent: 'seller', label: 'Selling this winter', address: true,
      headline: 'Have to sell before spring?',
      support: 'Send me the house and your timing. I’ll tell you how I’d think about positioning it for the buyers who are actually in the market now.',
      button: 'Ask Me How I’d Approach Your House'
    },
    'cost-to-sell': {
      intent: 'seller', label: 'Cost to sell', address: true,
      headline: 'Thinking about selling and want the real number?',
      support: 'Send me the house and what you’re considering. I’ll help you work through the costs that apply to your situation.',
      button: 'Ask Me What Selling Would Cost'
    },
    'seller-net': {
      intent: 'seller', label: 'Seller net proceeds', address: true,
      headline: 'Want to know what you’d actually walk away with?',
      support: 'Send me the property and what you think it may sell for. I’ll help you work through the selling costs and the number that matters at the end.',
      button: 'Ask Me to Run Your Numbers'
    },
    'cash-offer': {
      intent: 'seller', label: 'Cash offer', address: true,
      headline: 'Have an actual cash offer in front of you?',
      support: 'Send me the offer and the property. I’ll help you understand what you’re being offered and what you’re trading for the convenience.',
      button: 'Ask Me to Look at the Offer'
    },
    'accept-cash-offer': {
      intent: 'seller', label: 'Accepting a cash offer', address: true,
      headline: 'Before you sign it, want a second set of eyes?',
      support: 'Tell me what they offered and what matters most to you about the sale.',
      button: 'Ask Me About the Offer'
    },
    'seller-start': {
      intent: 'seller', label: 'Selling your house', address: true,
      headline: 'Want to talk about your house instead of another hypothetical?',
      support: 'Tell me about the property and what you’re trying to accomplish.',
      button: 'Ask Me About Selling It'
    }
  };

  var STORE = 'stlhj_ask_ctx';

  var CSS =
    '.askme{margin:40px 0;padding:24px 24px 26px;border:0;border-left:2px solid #ffcc4d;border-radius:0 12px 12px 0;background:rgba(255,204,77,.055);max-width:720px;text-align:left;box-sizing:border-box;}' +
    '.askme p.askme-eyebrow{margin:0 0 10px;padding:0;font:600 13px/1.3 "Inter",-apple-system,sans-serif;color:#ffcc4d;letter-spacing:0;text-transform:none;}' +
    '.askme p.askme-h{margin:0 0 10px;padding:0;font:700 clamp(21px,3.2vw,26px)/1.25 "Playfair Display",Georgia,serif;color:#fff;}' +
    '.askme p.askme-p{margin:0 0 20px;padding:0;font:400 15.5px/1.7 "Inter",-apple-system,sans-serif;color:rgba(255,255,255,.76);max-width:36em;}' +
    '.askme a.askme-btn,.askme a.askme-btn:visited{display:inline-block;background:#ffcc4d;color:#080808;font:700 14px/1.2 "Inter",-apple-system,sans-serif;padding:14px 24px;border:0;border-radius:8px;text-decoration:none;box-shadow:none;}' +
    '.askme a.askme-btn:hover{background:#ffd76e;color:#080808;text-decoration:none;border:0;}' +
    '.askme a.askme-btn:focus-visible{outline:2px solid #ffcc4d;outline-offset:3px;}' +
    '@media(max-width:600px){.askme{margin:32px 0;padding:20px 18px 22px;}.askme a.askme-btn{display:block;text-align:center;}}';

  var count = 0;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }

  function track(name, params) {
    try { if (typeof gtag === 'function') gtag('event', name, params); } catch (e) {}
  }

  function sourceUrl() {
    var l = document.querySelector('link[rel="canonical"]');
    return (l && l.href) ? l.href : location.origin + location.pathname;
  }

  function injectCSS() {
    if (document.getElementById('askme-css')) return;
    var st = document.createElement('style');
    st.id = 'askme-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function render(el) {
    var key = el.getAttribute('data-ask-me');
    var c = CONTEXTS[key];
    if (!c || !c.headline) return; // unknown key: leave the fallback link in place
    injectCSS();
    var id = 'askme-h-' + key + (++count > 1 ? '-' + count : '');
    var href = '/ask?about=' + encodeURIComponent(key) + '&from=' + encodeURIComponent(location.pathname);
    var aside = document.createElement('aside');
    aside.className = 'askme';
    aside.setAttribute('aria-labelledby', id);
    aside.innerHTML =
      '<p class="askme-eyebrow">' + esc(c.eyebrow || 'Ask me') + '</p>' +
      '<p class="askme-h" id="' + id + '">' + esc(c.headline) + '</p>' +
      '<p class="askme-p">' + esc(c.support) + '</p>' +
      '<a class="askme-btn" href="' + esc(href) + '">' + esc(c.button) + '</a>';
    aside.querySelector('a').addEventListener('click', function () {
      try {
        localStorage.setItem(STORE, JSON.stringify({
          about: key, from: location.pathname, title: document.title, url: sourceUrl(), t: Date.now()
        }));
      } catch (e) {}
      track('ask_me_click', {
        page_path: location.pathname, page_title: document.title,
        ask_context: key, ask_intent: c.intent, ask_button: c.button
      });
    });
    el.parentNode.replaceChild(aside, el);
  }

  function init() {
    var els = document.querySelectorAll('[data-ask-me]');
    for (var i = 0; i < els.length; i++) render(els[i]);
  }

  window.AskMe = { contexts: CONTEXTS, store: STORE, track: track };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
