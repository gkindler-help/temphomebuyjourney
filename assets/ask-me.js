/* ==========================================================================
   ASK ME — reusable contextual CTA for STL Home Journey
   --------------------------------------------------------------------------
   Use on a page:
     <div data-ask-me="CONTEXT_KEY" [data-ask-name="Affton"]><p><a href="/ask?about=CONTEXT_KEY">…</a></p></div>
     <script src="/assets/ask-me.js?v=1" defer></script>
   The placeholder's link is the no-JS fallback; this script replaces it with
   the styled component. All CTA copy lives in CONTEXTS below (source of truth,
   mirrored in /docs/ask-me-conversion-map.md). /ask reads the same registry.

   Source title and URL are taken from the page itself at click time, so they
   never need to be configured per page.

   Floating "Ask George" (opt-in): <div data-ask-float="KEY" hidden></div>, prompts in FLOATS.
   Plain links: <a href="/ask?about=KEY…" data-ask-link="KEY"> get context hand-off + tracking.

   Live chat: CHAT config below (Tawk.to, loaded only on tap). One shared loader
   (ensureChat, below CHAT) lazy-loads the Tawk script and tracks its ready
   state; the floating "Chat with George" bubble (renderChat) and /ask's own
   primary button both open chat through it rather than loading Tawk twice.
   window.AskMe.openChat({context, intent, sourceUrl, onOpen, onTimeout}) is
   the public entry point for a page's own chat button (used by /ask).
   GA4: chat_open, chat_started { page_path }

   GA4: ask_me_click { page_path, page_title, ask_context, ask_intent, ask_button }
        ask_george_open / ask_george_dismiss { page_path, ask_context }
   No personal information is ever sent to analytics.
   ========================================================================== */
(function () {
  'use strict';

  // address: true = show the property-address field on /ask, false = hide it
  var CONTEXTS = {
    /* ---- default for direct visits to /ask ---- */
    'general': { intent: 'general', label: 'General question', address: true },

    /* ---- page-level defaults ---- */
    'general-page': {
      intent: 'general', label: 'General question', address: true,
      headline: 'Have a question about your own situation?',
      support: 'Tell me what you’re looking at and what you’re wondering about.',
      button: 'Ask Me'
    },
    'buyer-general': {
      intent: 'buyer', label: 'Buying question', address: true,
      headline: 'Reading this because of a house you’re looking at?',
      support: 'Tell me about the house and what you’re wondering. I’ll tell you what I’d want to check before you decide.',
      button: 'Ask Me About the House'
    },
    'seller-general': {
      intent: 'seller', label: 'Selling question', address: true,
      headline: 'Thinking about this for your own house?',
      support: 'Tell me about the property and what you’re trying to figure out. I’ll help you think through the options.',
      button: 'Ask Me About Your House'
    },

    /* ---- name patterns: data-ask-name fills {name} ---- */
    'neighborhood': {
      intent: 'buyer', label: 'A house in a specific neighborhood', address: true,
      headline: 'Looking at a house in {name}?',
      support: 'Send me the address and tell me what you’re wondering about. I’ll tell you what I’d want to check before deciding whether to pursue it.',
      button: 'Ask Me About the House'
    },
    'zip-code': {
      intent: 'buyer', label: 'A house in a specific ZIP code', address: true,
      headline: 'Looking at a house in {name}?',
      support: 'Send me the address and tell me what you’re wondering about. I’ll tell you what I’d want to check before deciding whether to pursue it.',
      button: 'Ask Me About the House'
    },
    'school-district': {
      intent: 'buyer', label: 'School district', address: true,
      headline: 'Found a house you think is in {name}?',
      support: 'Send me the address. I’ll help you identify what should be verified before you rely on the school assignment.',
      button: 'Ask Me About the Address'
    },
    'listing': {
      intent: 'buyer', label: 'A specific listing', address: true,
      headline: 'Interested in this house, or one like it?',
      support: 'Tell me what you’d like to know and what you’re looking for. I’ll answer what I can.',
      button: 'Ask Me About the House'
    },

    /* ---- more buyer situations ---- */
    'inspection-negotiation': {
      intent: 'buyer', label: 'Inspection report', address: true,
      headline: 'Got an inspection report and don’t know what to ask for?',
      support: 'Tell me what came back and what matters most to you. We can think through what affects the house, the price and the deal.',
      button: 'Ask Me About the Report'
    },
    'septic': {
      intent: 'buyer', label: 'Septic system', address: true,
      headline: 'Buying a house with septic?',
      support: 'Send me the property and tell me what you know so far. I’ll help you work out what questions should be answered before the deal moves forward.',
      button: 'Ask Me About the Septic'
    },
    'property-defect': {
      intent: 'buyer', label: 'Property condition', address: true,
      headline: 'Seeing something in a house that concerns you?',
      support: 'Send me the house and what you’re seeing. I’ll tell you what I’d want to learn before deciding how much weight to give it.',
      button: 'Ask Me What I’d Do Next'
    },
    'va-appraisal': {
      intent: 'buyer', label: 'VA appraisal / property condition', address: true,
      headline: 'Worried a house might have a VA appraisal problem?',
      support: 'Send me the property and what concerns you. I’ll help you identify the questions worth answering before the appraiser does.',
      button: 'Ask Me What I’d Check'
    },
    'school-boundary': {
      intent: 'buyer', label: 'School boundary', address: true,
      headline: 'Considering houses on both sides of the district line?',
      support: 'Send me the addresses you’re considering. School boundaries need to be verified by exact address.',
      button: 'Ask Me About the Addresses'
    },
    'buying-power': {
      intent: 'buyer', label: 'Budget and where to look', address: false,
      headline: 'Know your number. Not sure where to spend it?',
      support: 'Tell me your price range and the parts of St. Louis you’re considering. I’ll help you narrow down where I’d start looking.',
      button: 'Ask Me Where Your Budget Fits'
    },
    'rent-vs-buy': {
      intent: 'buyer', label: 'Rent vs. buy', address: false, note: false,
      headline: 'Still not sure buying makes sense for you?',
      support: 'Tell me what you’re comparing. You don’t need to be ready to buy to ask the question.',
      button: 'Ask Me About Your Situation'
    },
    'pre-approval': {
      intent: 'buyer', label: 'Pre-approval', address: false,
      headline: 'Pre-approved and ready to start looking?',
      support: 'Tell me what you’re approved for and where you’re considering. I’ll help you think through the next step from the real-estate side.',
      button: 'Ask Me What I’d Do Next'
    },
    'buyer-agent': {
      intent: 'buyer', label: 'Representation', address: true,
      headline: 'Want to know what I’d actually do for you?',
      support: 'Ask me about the house you’re considering, the search you’re starting, or the part of the process you’re unsure about.',
      button: 'Ask Me'
    },

    /* ---- more seller situations ---- */
    'relisting': {
      intent: 'seller', label: 'Relisting', address: true,
      headline: 'Thinking about putting the house back on the market?',
      support: 'Send me the old listing and tell me what happened. I’ll help you think through what should actually change before relisting.',
      button: 'Ask Me What I’d Change First'
    },
    'what-not-to-repair': {
      intent: 'seller', label: 'Repairs before listing', address: true,
      headline: 'Not sure what to fix before you list?',
      support: 'Send me the house and what you’re considering repairing. I’ll tell you where I’d want to spend money—and where I wouldn’t—before going to market.',
      button: 'Ask Me What I’d Leave Alone'
    },
    'south-county-selling': {
      intent: 'seller', label: 'Selling in South County', address: true,
      headline: 'Thinking about selling your South County house?',
      support: 'Tell me where it is and what you’re trying to accomplish. I’ll help you think through price, condition and timing.',
      button: 'Ask Me About Your House'
    },
    'cash-vs-listing': {
      intent: 'seller', label: 'Cash offer vs. listing', address: true,
      headline: 'Trying to decide between selling directly and listing?',
      support: 'Send me the property and the cash offer if you have one. I’ll help you compare the numbers and tradeoffs.',
      button: 'Ask Me to Compare Your Options'
    },
    'cash-buyer-math': {
      intent: 'seller', label: 'How the cash offer was calculated', address: true,
      headline: 'Have an offer and want to know how they probably got there?',
      support: 'Send me the offer and the property. I’ll help you work backward through the numbers.',
      button: 'Ask Me to Break Down the Offer'
    },
    'cash-convenience': {
      intent: 'seller', label: 'Cost of a cash offer', address: true,
      headline: 'Want to know what convenience is costing you?',
      support: 'Send me the property and the offer. I’ll help you compare it with what selling on the market could look like.',
      button: 'Ask Me to Run the Difference'
    },
    'inherited': {
      intent: 'seller', label: 'Inherited house', address: true,
      headline: 'Dealing with an inherited house right now?',
      support: 'Tell me about the property and what you’re trying to solve. I’ll help you think through the realistic selling options.',
      button: 'Ask Me About Your Options'
    },
    'vacant': {
      intent: 'seller', label: 'Vacant house', address: true,
      headline: 'Carrying a vacant house right now?',
      support: 'Tell me what condition it’s in and what you’re trying to accomplish.',
      button: 'Ask Me What I’d Do With It'
    },
    'tenants': {
      intent: 'seller', label: 'House with tenants', address: true,
      headline: 'Trying to sell a house with tenants?',
      support: 'Tell me about the property, lease situation and your goal. I’ll help you think through the transaction before creating unnecessary problems.',
      button: 'Ask Me About the Property'
    },
    'cash-retrade': {
      intent: 'seller', label: 'Lowered cash offer', address: true,
      headline: 'Did your cash buyer just lower the offer?',
      support: 'Tell me what changed and what explanation they gave you. I’ll help you think through whether the new number still makes sense.',
      button: 'Ask Me to Look at What Changed'
    },
    'cash-decoder': {
      intent: 'seller', label: 'Cash Offer Decoder', address: true,
      headline: 'You’ve decoded the offer. Want to compare it with your other options?',
      support: 'Send me the property and the offer. I’ll help you compare the actual numbers.',
      button: 'Ask Me to Compare the Numbers'
    },

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
    'expired-listing': {
      intent: 'seller', label: 'Expired listing', address: true,
      headline: 'Not sure what happened with your listing?',
      support: 'You don’t need another listing agreement yet. Ask me about it.',
      button: 'Ask Me About My Expired Listing',
      // /ask uses these instead of its generic heading and intro
      askTitle: 'Ask me about your expired listing',
      askIntro: 'No judgment on you or your previous agent. Tell me what happened—or just send me the address—and I’ll help you think through what the first listing is telling us.'
    },
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

  /* Floating "Ask George" prompts. A page opts in with <div data-ask-float="KEY" hidden></div>.
     'about' is the /ask context the button carries. Add a key here to support a new page type. */
  var FLOATS = {
    'expired-listing':    { about: 'expired-listing',    headline: 'Not sure what happened with your listing?', body: 'You don’t need another listing agreement yet. Ask me about it.' },
    'no-showings':        { about: 'no-showings',        headline: 'Listed, and nobody’s coming to see it?',    body: 'Before you cut the price, ask me what buyers may be seeing.' },
    'showings-no-offers': { about: 'showings-no-offers', headline: 'Getting showings but no offers?',           body: 'Ask me what the showing activity may be telling you.' },
    'price-reduction':    { about: 'price-reduction',    headline: 'Thinking about cutting the price?',         body: 'Ask me before you reduce it. No judgment on you or your agent.' }
  };
  var FLOAT_QUIET = 'stlhj_askfloat_quiet';

  /* Live chat (Tawk.to) behind George's face. Nothing from Tawk loads until a visitor taps the
     face, or until they return mid-conversation. Set enabled:false to turn chat off site-wide. */
  var CHAT = {
    enabled: true,
    src: 'https://embed.tawk.to/6abafa7771d13c3445fe714d/1k3l64ols',
    label: 'Chat with George',
    flag: 'stlhj_chat_active'
  };

  /* ---- shared Tawk lifecycle: the ONE lazy loader every chat entry point uses ---- */
  var chatState = 'idle', chatOpenWhenReady = false, chatReadyQueue = [];
  var chatIsIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var chatVp = null, chatVpOriginal = null, chatZoomWatch = null;

  function chatOngoing() { try { return !!(window.Tawk_API && window.Tawk_API.isChatOngoing && window.Tawk_API.isChatOngoing()); } catch (e) { return false; } }
  function chatIsActive() { try { return localStorage.getItem(CHAT.flag) === '1'; } catch (e) { return false; } }
  function chatSetActive(on) { try { if (on) localStorage.setItem(CHAT.flag, '1'); else localStorage.removeItem(CHAT.flag); } catch (e) {} }

  // Tawk rewrites the viewport tag when it opens on phones, so keep maximum-scale=1
  // on it for as long as chat is open, then put the page's own tag back.
  function chatEnsureMaxZoom() {
    var c = chatVp.getAttribute('content') || '';
    if (!/maximum-scale\s*=\s*1(\.0)?\b/.test(c)) chatVp.setAttribute('content', c.replace(/,?\s*maximum-scale\s*=\s*[\d.]+/g, '') + ', maximum-scale=1');
  }
  function chatLockZoom() {
    if (!chatIsIOS) return;
    chatVp = chatVp || document.querySelector('meta[name="viewport"]');
    if (!chatVp) return;
    if (chatVpOriginal === null) chatVpOriginal = chatVp.getAttribute('content');
    if (/maximum-scale/.test(chatVpOriginal)) return;
    chatEnsureMaxZoom();
    if (!chatZoomWatch && window.MutationObserver) {
      chatZoomWatch = new MutationObserver(chatEnsureMaxZoom);
      chatZoomWatch.observe(chatVp, { attributes: true, attributeFilter: ['content'] });
    }
  }
  function chatUnlockZoom() {
    if (chatZoomWatch) { chatZoomWatch.disconnect(); chatZoomWatch = null; }
    if (chatVp && chatVpOriginal !== null) chatVp.setAttribute('content', chatVpOriginal);
  }
  function openTawkWidget() {
    chatLockZoom();
    try { window.Tawk_API.showWidget(); window.Tawk_API.maximize(); } catch (e) {}
  }
  // Fires when chat is minimized/hidden with no conversation left open, so the
  // floating face (if this page has one) can reappear. No-op on pages without it.
  var chatOnIdle = null;
  var chatTimeoutQueue = [], chatTimeoutArmed = false;

  /* Loads Tawk at most once per page, however many entry points ask for it.
     onReady fires once the widget is ready (immediately, if it already is).
     onTimeout fires only for callers that asked to open chat, if it still
     isn't ready ~12s after the FIRST such request (blocked, slow network, ad
     blocker) -- every caller's onTimeout runs, not just the first one's, so
     a page with more than one chat entry point (/ask has both the floating
     widget and its own button) can't leave a second caller's button stuck
     showing "Connecting..." forever. Callers decide what "didn't come up"
     looks like (the floating widget sends visitors to /ask; /ask shows its
     own fallback). */
  function ensureChat(open, onReady, onTimeout) {
    if (!CHAT.enabled) { if (open && onTimeout) onTimeout(); return; }
    if (chatState === 'ready') {
      if (open) openTawkWidget();
      if (onReady) onReady();
      return;
    }
    if (onReady) chatReadyQueue.push(onReady);
    if (open) {
      chatOpenWhenReady = true;
      if (onTimeout) chatTimeoutQueue.push(onTimeout);
      if (!chatTimeoutArmed) {
        chatTimeoutArmed = true;
        setTimeout(function () {
          if (chatState !== 'ready' && chatOpenWhenReady) {
            var tq = chatTimeoutQueue; chatTimeoutQueue = [];
            tq.forEach(function (cb) { try { cb(); } catch (e) {} });
          }
        }, 12000);
      }
    }
    if (chatState === 'loading') return;
    chatState = 'loading';
    var api = window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    api.onBeforeLoad = function () { if (!chatOpenWhenReady && !chatIsActive()) api.hideWidget(); };
    api.onLoad = function () {
      chatState = 'ready';
      if (chatOpenWhenReady) openTawkWidget();
      var q = chatReadyQueue; chatReadyQueue = [];
      q.forEach(function (cb) { try { cb(); } catch (e) {} });
    };
    api.onChatMaximized = function () { chatLockZoom(); };
    api.onChatMinimized = function () { chatUnlockZoom(); if (!chatOngoing()) { api.hideWidget(); if (chatOnIdle) chatOnIdle(); } };
    api.onChatHidden = function () { chatUnlockZoom(); if (chatOnIdle) chatOnIdle(); };
    api.onChatStarted = function () { chatSetActive(true); track('chat_started', { page_path: location.pathname }); };
    api.onChatEnded = function () { chatSetActive(false); };
    var sc = document.createElement('script');
    sc.async = true; sc.charset = 'UTF-8'; sc.setAttribute('crossorigin', '*'); sc.src = CHAT.src;
    document.head.appendChild(sc);
  }

  /* Public entry point for a page's own chat button (used by /ask). Passes
     non-PII context to Tawk as visitor tags -- never name, email or phone. */
  function openChat(opts) {
    opts = opts || {};
    if (!CHAT.enabled) { if (opts.onTimeout) opts.onTimeout(); return; }
    ensureChat(true, function () {
      try {
        if (window.Tawk_API && typeof window.Tawk_API.addTags === 'function') {
          var tags = [];
          if (opts.context) tags.push('ask_context:' + opts.context);
          if (opts.intent) tags.push('ask_intent:' + opts.intent);
          if (opts.sourceUrl) tags.push('source:' + opts.sourceUrl);
          if (tags.length) window.Tawk_API.addTags(tags, function () {});
        }
      } catch (e) {}
      if (opts.onOpen) opts.onOpen();
    }, opts.onTimeout);
  }

  var AVATAR = '/assets/george-ask.webp';
  var WHO = 'George Kindler · 250+ St. Louis transactions';
  var NOTES = {
    buyer: 'You don’t need to be ready to buy. It’s just a question.',
    seller: 'You don’t need to be ready to sell. It’s just a question.',
    general: 'You don’t need to be ready to do anything. It’s just a question.'
  };

  var CSS =
    '.askme{margin:40px 0;padding:22px 24px 24px;border:0;border-left:2px solid #ffcc4d;border-radius:0 14px 14px 0;background:linear-gradient(135deg,rgba(255,204,77,.09),rgba(255,204,77,.03));max-width:720px;text-align:left;box-sizing:border-box;}' +
    'body>.askme,.askme.askme-center{margin-left:auto;margin-right:auto;width:calc(100% - 40px);}' +
    '.askme .askme-top{display:flex;align-items:center;gap:12px;margin:0 0 14px;}' +
    '.askme img.askme-av{display:block;width:46px;height:46px;border-radius:50%;border:2px solid #ffcc4d;object-fit:cover;flex:none;margin:0;box-shadow:none;max-width:none;}' +
    '.askme p.askme-eyebrow{margin:0;padding:0;font:700 14px/1.2 "Inter",-apple-system,sans-serif;color:#ffcc4d;letter-spacing:0;text-transform:none;}' +
    '.askme p.askme-who{margin:3px 0 0;padding:0;font:500 12.5px/1.3 "Inter",-apple-system,sans-serif;color:rgba(255,255,255,.62);}' +
    '.askme p.askme-h{margin:0 0 10px;padding:0;font:700 clamp(21px,3.2vw,26px)/1.25 "Playfair Display",Georgia,serif;color:#fff;}' +
    '.askme p.askme-p{margin:0 0 20px;padding:0;font:400 15.5px/1.7 "Inter",-apple-system,sans-serif;color:rgba(255,255,255,.78);max-width:36em;}' +
    '.askme a.askme-btn,.askme a.askme-btn:visited{display:inline-block;background:#ffcc4d;color:#080808;font:700 14px/1.2 "Inter",-apple-system,sans-serif;padding:14px 24px;border:0;border-radius:8px;text-decoration:none;box-shadow:none;}' +
    '.askme a.askme-btn:hover{background:#ffd76e;color:#080808;text-decoration:none;border:0;}' +
    '.askme a.askme-btn:focus-visible{outline:2px solid #ffcc4d;outline-offset:3px;}' +
    '.askme p.askme-note{margin:12px 0 0;padding:0;font:400 13px/1.5 "Inter",-apple-system,sans-serif;color:rgba(255,255,255,.6);}' +
    /* floating Ask George (bottom-left; the article "Sections" button owns bottom-right) */
    'body.has-askfloat{padding-bottom:84px;}' +
    '.askfloat{position:fixed;left:calc(16px + env(safe-area-inset-left,0px));bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:190;font-family:"Inter",-apple-system,sans-serif;}' +
    '.askfloat-toggle{touch-action:manipulation;-webkit-tap-highlight-color:transparent;display:flex;align-items:center;gap:10px;padding:4px 16px 4px 4px;background:rgba(10,10,10,.94);border:1px solid rgba(255,204,77,.45);border-radius:999px;color:#fff;font:700 13px/1 "Inter",-apple-system,sans-serif;cursor:pointer;box-shadow:0 6px 22px rgba(0,0,0,.55),0 0 14px rgba(255,204,77,.18);transition:opacity .2s ease,box-shadow .2s ease;}' +
    '.askfloat-toggle img{display:block;width:44px;height:44px;border-radius:50%;border:2px solid #ffcc4d;object-fit:cover;margin:0;max-width:none;}' +
    '.askfloat-toggle:hover{box-shadow:0 6px 22px rgba(0,0,0,.55),0 0 20px rgba(255,204,77,.32);}' +
    '.askfloat-toggle:focus-visible{outline:2px solid #ffcc4d;outline-offset:3px;}' +
    '.askfloat:not(.quiet) .askfloat-toggle{animation:askfloat-glow 2.6s ease-in-out 5s 2;}' +
    '@keyframes askfloat-glow{0%,100%{box-shadow:0 6px 22px rgba(0,0,0,.55),0 0 14px rgba(255,204,77,.18);}50%{box-shadow:0 6px 22px rgba(0,0,0,.55),0 0 26px rgba(255,204,77,.45);}}' +
    '.askfloat.quiet .askfloat-toggle{padding-right:4px;opacity:.9;box-shadow:0 6px 18px rgba(0,0,0,.5);}' +
    '.askfloat.quiet .askfloat-label{display:none;}' +
    '.askfloat-panel{position:absolute;left:0;bottom:62px;width:min(300px,calc(100vw - 32px));background:#0d0d0d;border:1px solid rgba(255,204,77,.34);border-radius:14px;padding:18px 18px 16px;box-shadow:0 12px 42px rgba(0,0,0,.6);box-sizing:border-box;}' +
    '.askfloat-panel[hidden],.askfloat[hidden]{display:none;}' +
    '.askfloat-top{display:flex;align-items:center;gap:10px;margin:0 28px 12px 0;}' +
    '.askfloat-top img{width:40px;height:40px;border-radius:50%;border:2px solid #ffcc4d;object-fit:cover;flex:none;margin:0;max-width:none;}' +
    '.askfloat-name{margin:0;font:700 14px/1.2 "Inter",-apple-system,sans-serif;color:#fff;}' +
    '.askfloat-who{margin:2px 0 0;font:500 12px/1.3 "Inter",-apple-system,sans-serif;color:rgba(255,255,255,.6);}' +
    '.askfloat-h{margin:0 0 6px;font:700 19px/1.3 "Playfair Display",Georgia,serif;color:#fff;}' +
    '.askfloat-p{margin:0 0 14px;font:400 14.5px/1.6 "Inter",-apple-system,sans-serif;color:rgba(255,255,255,.78);}' +
    '.askfloat-btn,.askfloat-btn:visited{display:block;text-align:center;background:#ffcc4d;color:#080808;font:700 14px/1.2 "Inter",-apple-system,sans-serif;padding:13px 18px;border-radius:8px;text-decoration:none;border:0;}' +
    '.askfloat-btn:hover{background:#ffd76e;color:#080808;}' +
    '.askfloat-btn:focus-visible,.askfloat-x:focus-visible{outline:2px solid #ffcc4d;outline-offset:3px;}' +
    '.askfloat-x{position:absolute;top:10px;right:10px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:rgba(255,255,255,.7);font:400 22px/1 "Inter",-apple-system,sans-serif;cursor:pointer;}' +
    '.askfloat-x:hover{color:#fff;background:rgba(255,255,255,.06);}' +
    '@media(prefers-reduced-motion:reduce){.askfloat .askfloat-toggle{animation:none !important;transition:none;}}' +
    '@media(max-width:600px){.askfloat-toggle{font-size:12.5px;}.askfloat-toggle img{width:40px;height:40px;}}' +
    '@media(max-width:600px){.askme{margin:32px 0;padding:20px 18px 22px;}body>.askme,.askme.askme-center{margin-left:auto;margin-right:auto;width:calc(100% - 32px);}.askme a.askme-btn{display:block;text-align:center;}}';

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

  function remember(key, button, intent) {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        about: key, from: location.pathname, title: document.title, url: sourceUrl(), t: Date.now()
      }));
    } catch (e) {}
    track('ask_me_click', {
      page_path: location.pathname, page_title: document.title,
      ask_context: key, ask_intent: intent, ask_button: button
    });
  }

  /* Plain in-article links: <a href="/ask?about=KEY&from=..." data-ask-link="KEY"> get the same
     context hand-off and click tracking as the component. */
  function wireLink(a) {
    var key = a.getAttribute('data-ask-link'), c = CONTEXTS[key];
    if (!c) return;
    a.addEventListener('click', function () {
      var label = a.querySelector('strong') || a;
      remember(key, (label.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80), c.intent);
    });
  }

  function isQuiet() { try { return sessionStorage.getItem(FLOAT_QUIET) === '1'; } catch (e) { return false; } }
  function setQuiet(root) { try { sessionStorage.setItem(FLOAT_QUIET, '1'); } catch (e) {} root.classList.add('quiet'); }

  function renderFloat(el) {
    var fk = el.getAttribute('data-ask-float'), f = FLOATS[fk], c = f && CONTEXTS[f.about];
    if (!f || !c || document.querySelector('.askfloat')) return;
    injectCSS();
    var href = '/ask?about=' + encodeURIComponent(f.about) + '&from=' + encodeURIComponent(location.pathname);
    var root = document.createElement('div');
    root.className = 'askfloat' + (isQuiet() ? ' quiet' : '');
    root.innerHTML =
      '<div class="askfloat-panel" id="askfloat-panel" role="dialog" aria-modal="false" aria-labelledby="askfloat-h" hidden>' +
        '<button type="button" class="askfloat-x" aria-label="Close">&times;</button>' +
        '<div class="askfloat-top"><img src="' + AVATAR + '" alt="" width="40" height="40" decoding="async">' +
        '<div><p class="askfloat-name">George Kindler</p><p class="askfloat-who">250+ St. Louis transactions</p></div></div>' +
        '<p class="askfloat-h" id="askfloat-h">' + esc(f.headline) + '</p>' +
        '<p class="askfloat-p">' + esc(f.body) + '</p>' +
        '<a class="askfloat-btn" href="' + esc(href) + '">Ask George &rarr;</a>' +
      '</div>' +
      '<button type="button" class="askfloat-toggle" aria-expanded="false" aria-controls="askfloat-panel" aria-label="Ask George a question">' +
        '<img src="' + AVATAR + '" alt="" width="44" height="44" decoding="async"><span class="askfloat-label">Ask George</span>' +
      '</button>';
    var panel = root.querySelector('.askfloat-panel'), toggle = root.querySelector('.askfloat-toggle');
    function open() {
      panel.hidden = false; toggle.setAttribute('aria-expanded', 'true');
      root.querySelector('.askfloat-btn').focus();
      setQuiet(root);
      track('ask_george_open', { page_path: location.pathname, ask_context: f.about });
    }
    function close(returnFocus) {
      if (panel.hidden) return;
      panel.hidden = true; toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
      track('ask_george_dismiss', { page_path: location.pathname, ask_context: f.about });
    }
    toggle.addEventListener('click', function () { panel.hidden ? open() : close(true); });
    root.querySelector('.askfloat-x').addEventListener('click', function () { close(true); });
    root.querySelector('.askfloat-btn').addEventListener('click', function () { remember(f.about, 'Ask George (floating)', c.intent); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(true); });
    document.addEventListener('click', function (e) { if (!root.contains(e.target)) close(false); });
    document.body.appendChild(root);
    document.body.classList.add('has-askfloat');
  }

  function renderChat() {
    if (!CHAT.enabled || window.self !== window.top) return;   // skip inside tool panels and embeds
    if (document.querySelector('.askfloat')) return;            // one corner widget per page
    injectCSS();
    var root = document.createElement('div');
    root.className = 'askfloat askchat' + (isQuiet() ? ' quiet' : '');
    root.innerHTML =
      '<button type="button" class="askfloat-toggle" aria-label="Chat with George Kindler">' +
        '<img src="' + AVATAR + '" alt="" width="44" height="44" decoding="async">' +
        '<span class="askfloat-label">' + esc(CHAT.label) + '</span>' +
      '</button>';
    var btn = root.querySelector('button'), label = root.querySelector('.askfloat-label');
    var onAskPage = /^\/ask\/?$/.test(location.pathname); // already on /ask: never redirect there

    function showFace(on) { root.hidden = !on; }
    function doneLoading() { btn.removeAttribute('aria-busy'); label.textContent = CHAT.label; }
    chatOnIdle = function () { showFace(true); };          // mid-conversation ended/hidden elsewhere on the page

    btn.addEventListener('click', function () {
      setQuiet(root);
      track('chat_open', { page_path: location.pathname });
      if (chatState !== 'ready') { btn.setAttribute('aria-busy', 'true'); label.textContent = 'Connecting…'; }
      ensureChat(true, function () { doneLoading(); showFace(false); }, function () {
        // Chat is blocked or down. On any other page, send them to /ask instead
        // of leaving them waiting; on /ask itself, just reset -- its own
        // text/call/email fallback is already on the page.
        doneLoading();
        if (onAskPage) showFace(true);
        else location.href = '/ask?about=general-page&from=' + encodeURIComponent(location.pathname);
      });
    });
    document.body.appendChild(root);
    document.body.classList.add('has-askfloat');
    // Returning mid-conversation: load quietly so George's replies can reach them
    if (chatIsActive()) {
      showFace(false);
      (window.requestIdleCallback || function (f) { setTimeout(f, 2000); })(function () {
        ensureChat(false, function () {
          doneLoading();
          if (chatOngoing()) showFace(false);            // mid-conversation: Tawk's own bubble shows new replies
          else { try { window.Tawk_API.hideWidget(); } catch (e) {} chatSetActive(false); showFace(true); }
        }, null);
      });
    }
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
    var name = (el.getAttribute('data-ask-name') || '').trim();
    var fill = function (t) { return String(t).replace(/\{name\}/g, name || 'this area'); };
    var note = c.note === false ? '' : (c.note || NOTES[c.intent] || NOTES.general);
    aside.innerHTML =
      '<div class="askme-top"><img class="askme-av" src="' + AVATAR + '" alt="" width="46" height="46" loading="lazy" decoding="async">' +
      '<div><p class="askme-eyebrow">' + esc(c.eyebrow || 'Ask me') + '</p><p class="askme-who">' + esc(WHO) + '</p></div></div>' +
      '<p class="askme-h" id="' + id + '">' + esc(fill(c.headline)) + '</p>' +
      '<p class="askme-p">' + esc(fill(c.support)) + '</p>' +
      '<a class="askme-btn" href="' + esc(href) + '">' + esc(c.button) + '</a>' +
      (note ? '<p class="askme-note">' + esc(note) + '</p>' : '');
    aside.querySelector('a').addEventListener('click', function () { remember(key, c.button, c.intent); });
    el.parentNode.replaceChild(aside, el);
    // Center it when the surrounding container is much wider than the component
    // or has no side padding (keeps it aligned on every page template).
    var r = aside.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    if (r.left < 8 || vw - r.right < 8 || aside.parentNode.clientWidth > aside.offsetWidth + 80) aside.className += ' askme-center';
  }

  function init() {
    var els = document.querySelectorAll('[data-ask-me]');
    for (var i = 0; i < els.length; i++) render(els[i]);
    var links = document.querySelectorAll('a[data-ask-link]');
    for (var j = 0; j < links.length; j++) wireLink(links[j]);
    var fl = document.querySelector('[data-ask-float]');
    if (fl) renderFloat(fl);
    renderChat();
  }

  window.AskMe = { contexts: CONTEXTS, floats: FLOATS, store: STORE, track: track, openChat: openChat };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
