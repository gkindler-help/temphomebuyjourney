/* /shared.js
STL Home Buyer Journey — v2
Pure behavior controller. No CSS lives here.
All visual styling is owned by shared.css.

Responsibilities:

- Shared shell rendering
- Navigation / state
- Drawer / deep-dive logic
- Interrupt logic
- About George popup card
- George image + speaking ring behavior
- Visual cue / spotlight behavior
- Global icon registry
- Journey rail behavior
- window.SharedPlatform global helpers
  */
  (function () {
  “use strict”;

/* ============================================================
CONSTANTS
============================================================ */

var STORAGE_KEY = “stl_journey_v1”;

var DEFAULT_STATE = {
amount: 280000,
loan: “conventional”,
zip: “63123”,
area: “”,
lastChapter: 1,
lastStep: 0,
chaptersVisited: [],
lessons: [],
jumpEntry: null
};

var DEFAULT_CHAPTERS = [
{ ch: 1, file: “01-preapproval.html”,    label: “What actually happens when you click \u201cContact Agent\u201d”, icon: “contact”,    iconSrc: “assets/icon-ch1.png”, iconFallback: “1” },
{ ch: 2, file: “02-affordability.html”,  label: “Where buyers accidentally overpay”,                              icon: “calculator”, iconSrc: “assets/icon-ch2.png”, iconFallback: “2” },
{ ch: 3, file: “03-interior.html”,       label: “Walk a property the way I do \u2014 pick your home type”,              icon: “house”,      iconSrc: “assets/icon-ch3.png”, iconFallback: “3” },
{ ch: 4, file: “05-pre-offer.html”,      label: “Where buyers get pushed into offers they can\u2019t take back”, icon: “target”,     iconSrc: “assets/icon-ch4.png”, iconFallback: “4” },
{ ch: 5, file: “06-under-contract.html”, label: “Offer accepted \u2014 where deals fall apart”,                  icon: “document”,   iconSrc: “assets/icon-ch5.png”, iconFallback: “5” },
{ ch: 6, file: “06b-deadlines.html”,     label: “Three deadlines running in parallel”,                           icon: “calendar”,   iconSrc: “assets/icon-ch6.png”, iconFallback: “6” },
{ ch: 7, file: “07-inspection.html”,     label: “Where buyers miss the problems they end up paying for”,         icon: “magnifier”,  iconSrc: “assets/icon-ch7.png”, iconFallback: “7” },
{ ch: 8, file: “08-walkthrough.html”,    label: “The final walk-through is not a second showing”,                icon: “route”,      iconSrc: “assets/icon-ch8.png”, iconFallback: “8” },
{ ch: 9, file: “09-closing.html”,        label: “What you\u2019re signing at closing”,                          icon: “key”,        iconSrc: “assets/icon-ch9.png”, iconFallback: “9” },
/* ── RESOURCE LIBRARY ── */
{ ch: 101, file: “home-cost-demo.html”, label: “STL Home Cost Survival Guide — How To”, icon: “house”, iconSrc: “”, iconFallback: “?” }
];

var DEFAULT_GEORGE_CARD = {
name:         “George Kindler”,
titleTop:     “Licensed Missouri Agent”,
titleBottom:  “The Closing Pros LLC”,
image:        “assets/george-proud.png”,
imageLabel:   “George Kindler”,
imageContext: “George Kindler \u2014 licensed Missouri agent with hands-on real estate and renovation experience in St. Louis.”,
phone:        “3144351087”,
phoneLabel:   “314.435.1087 \u2014 No Obligation”,
about:        “I will never sell you. My job is to consult \u2014 help you weigh the facts against my experience.”,
stats: [
{ value: “250+”, label: “Homes\nSold”       },
{ value: “13”,   label: “Years in\nSt. Louis” },
{ value: “130+”, label: “Investment\nDeals”  }
]
};

/* ============================================================
ICON REGISTRY
============================================================ */

var ICONS = {
house:      ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 10.5V20h11V10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>’,
calculator: ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 7.5h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 12h2M14 12h2M8 16h2M14 16h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>’,
target:     ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.25" fill="currentColor"/></svg>’,
document:   ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 20V5a1.5 1.5 0 0 1 1.5-1.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3.5V8h4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.5 12h5M9.5 15.5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>’,
calendar:   ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 3.5v4M16 3.5v4M4 9.5h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>’,
magnifier:  ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" stroke-width="1.8"/><path d="M15 15l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>’,
route:      ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="18" r="2" fill="currentColor"/><circle cx="18" cy="6" r="2" fill="currentColor"/><path d="M8 18c3 0 3-4 6-4s3-4 4-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>’,
key:        ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8.5" cy="12" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 12h7m-2 0v-2m-2 2v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>’,
contact:    ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 5.5h12A1.5 1.5 0 0 1 19.5 7v10A1.5 1.5 0 0 1 18 18.5H6A1.5 1.5 0 0 1 4.5 17V7A1.5 1.5 0 0 1 6 5.5Z" stroke="currentColor" stroke-width="1.8"/><path d="M5 7l7 5 7-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>’,
map:        ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 6.5 9 4l6 2.5 4.5-2v13L15 20l-6-2.5-4.5 2v-13Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 4v13.5M15 6.5V20" stroke="currentColor" stroke-width="1.8"/></svg>’,
phone:      ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 4.5h2l1 4-1.5 1.5c1.1 2.2 2.8 3.9 5 5L15.5 13l4 1v2c0 .8-.6 1.5-1.4 1.5-7 0-12.6-5.6-12.6-12.6 0-.8.7-1.4 1.5-1.4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>’,
warning:    ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4.5 20 19.5H4L12 4.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9v4.5M12 17h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>’,
water:      ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4.5c2.8 3.2 5 6 5 8.5A5 5 0 1 1 7 13c0-2.5 2.2-5.3 5-8.5Z" stroke="currentColor" stroke-width="1.8"/></svg>’,
electric:   ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 3.5 7.5 13H12l-1 7.5L16.5 11H12l1-7.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>’,
window:     ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4.5" width="14" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 4.5v15M5 12h14" stroke="currentColor" stroke-width="1.8"/></svg>’,
structure:  ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19.5h14M7 19.5V8.5h10v11M9 8.5V5.5h6v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>’,
layout:     ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="4.5" width="15" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 10h8v9.5M12.5 4.5v5.5h7" stroke="currentColor" stroke-width="1.8"/></svg>’,
check:      ‘<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>’
};

/* ============================================================
CONFIG RESOLUTION
============================================================ */

var APP_CONFIG = window.APP_CONFIG || {
title:       “Home Buyer Journey”,
subtitle:    “George Kindler · The Closing Pros”,
toolsUrl:    “index.html”,
guidesUrl:   “articles/index.html”,
footerLeft:  “George Kindler · 314.435.1087”,
georgeCard:  DEFAULT_GEORGE_CARD,
chapters:    DEFAULT_CHAPTERS
};

/* ============================================================
STATE
============================================================ */

var state               = loadState();
var currentSceneIndex   = 0;
var interruptDismissed  = false;
var interruptTimer      = null;
var _demoIframe         = null;
var _demoStepIndex      = 0;
var _demoScene          = null;
var spotlightTimeout    = null;

function loadState() {
try {
var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || “{}”);
return Object.assign({}, DEFAULT_STATE, saved);
} catch (e) {
return Object.assign({}, DEFAULT_STATE);
}
}

function saveState() {
try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

/* ============================================================
UTILITIES
============================================================ */

function track(eventName, payload) {
if (typeof window.gtag === “function”) window.gtag(“event”, eventName, payload || {});
}

function byId(id) { return document.getElementById(id); }

function getChapterNumber() {
return typeof window.CHAPTER_NUM === “number” ? window.CHAPTER_NUM : 1;
}

function getChapterLabel() {
if (typeof window.CHAPTER_LABEL === “string” && window.CHAPTER_LABEL.trim()) {
return window.CHAPTER_LABEL.trim();
}
var match = APP_CONFIG.chapters.find(function (item) { return item.ch === getChapterNumber(); });
return match ? match.label : “Chapter”;
}

function getPrevFile() {
return (typeof window.PREV_FILE === “string” && window.PREV_FILE.trim())
? window.PREV_FILE
: “index.html”;
}

function getScenes() {
return Array.isArray(window.SCENES) ? window.SCENES : [];
}

function getGeorgeCardConfig() {
return Object.assign({}, DEFAULT_GEORGE_CARD, APP_CONFIG.georgeCard || {});
}

function renderIcon(name) { return ICONS[name] || ICONS.house; }

function georgeFace(name) {
var map = {
serious:     “assets/george-serious.png”,
welcome:     “assets/george-welcome.png”,
excited:     “assets/george-excited.png”,
proud:       “assets/george-proud.png”,
papers:      “assets/george-papers.png”,
disappointed:“assets/george-disappointed.png”
};
return map[name] || map.serious;
}

function escapeAttr(v) {
return String(v || “”)
.replace(/&/g, “&”)
.replace(/”/g, “"”)
.replace(/</g, “<”)
.replace(/>/g, “>”);
}

function nl2br(text) { return String(text || “”).replace(/\n/g, “<br>”); }

function toggleClass(el, cls, active) {
if (!el) return;
if (active) el.classList.add(cls);
else        el.classList.remove(cls);
}

function setText(id, v) { var el = byId(id); if (el) el.textContent = v || “”; }
function setHTML(id, v) { var el = byId(id); if (el) el.innerHTML  = v || “”; }

function setProgress(idx, total) {
var el = byId(“prog”);
if (!el) return;
el.style.width = (total <= 1) ? “100%” : Math.round((idx / (total - 1)) * 100) + “%”;
}

function safelyBind(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

/* ============================================================
SHELL RENDERING
============================================================ */

function ensureShell() {
if (byId(“prog”) && byId(“scene-lbl”) && byId(“btn-next”)) return;

```
var mount = byId("app");
if (!mount) {
  mount = document.createElement("div");
  mount.id = "app";
  document.body.appendChild(mount);
}

var gc = getGeorgeCardConfig();

mount.innerHTML = [
  '<div class="app">',

  /* Header */
  '  <header class="hdr">',
  '    <div class="hdr-l">',
  '      <div class="hdr-ico">',
  '        <img src="assets/STLhomebuyerjourneylogo.png" alt="STL Home Buyer Journey" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">',
  '        <span style="display:none;color:var(--gold);width:100%;height:100%;align-items:center;justify-content:center;">' + renderIcon("house") + '</span>',
  '      </div>',
  '      <div>',
  '        <div class="hdr-t"><span>STL</span> Home Buyer Journey</div>',
  '        <div class="hdr-name">George Kindler</div>',
  '        <div class="hdr-tagline">13 Years Of Real Estate Experience At Your Fingertips</div>',
  '      </div>',
  '    </div>',
  '  </header>',

  /* Progress */
  '  <div class="prog-wrap"><div class="prog-fill" id="prog"></div></div>',

  /* Scene bar */
  '  <div class="scene-bar">',
  '    <div class="scene-lbl" id="scene-lbl"></div>',
  '    <div class="scene-ch">Chapter ' + getChapterNumber() + '</div>',
  '  </div>',

  /* Stage */
  '  <div class="stage" id="stage">',
  '    <div class="scene-bg"><img id="bg-img" alt=""></div>',
  '    <div class="scene-gradient"></div>',
  '    <div class="scene-svg" id="scene-svg-wrap" style="display:none;"></div>',
  '    <div class="scene-cue-layer" id="scene-cue-layer"></div>',
  '    <div class="scene-spotlight" id="scene-spotlight">',
  '      <div class="scene-spotlight-hole" id="scene-spotlight-hole"></div>',
  '    </div>',

  /* George float */
  '    <div class="george-float" id="george-float" role="button" tabindex="0" aria-label="About George">',
  '      <div class="gf-wrap" id="gf-wrap">',
  '        <div class="gf-ring"></div>',
  '        <img id="george-img" alt="George Kindler">',
  '      </div>',
  '    </div>',

  /* Caption */
  '    <div class="scene-caption" id="scene-caption">',
  '      <div class="sc-room" id="sc-room"></div>',
  '      <div class="sc-title" id="sc-title"></div>',
  '      <div class="sc-sub" id="sc-sub"></div>',
  '      <div class="scene-chip-row" id="scene-chip-row"></div>',
  '    </div>',
  '  </div>',

  /* Ask George button */
  '  <button class="ask-george" id="ask-george" type="button">Ask George</button>',

  /* Drawer */
  '  <div class="drawer" id="drawer">',
  '    <div class="drawer-label" id="drawer-label">Ask me anything</div>',
  '    <div class="choices" id="choices"></div>',
  '  </div>',

  /* Bottom nav */
  '  <div class="bnav">',
  '    <button class="btn-b" id="btn-back" type="button">Back</button>',
  '    <button class="btn-explore" id="btn-explore" type="button">Explore</button>',
  '    <button class="btn-n" id="btn-next" type="button">Next &rarr;</button>',
  '  </div>',

  /* Footer */
  '  <footer class="ftr">',
  '    <div class="ftr-compliance">',
  '      <div class="ftr-compliance-label">Compliance</div>',
  '      <div class="ftr-brokerage">The Closing Pros LLC</div>',
  '      <div class="ftr-phone">314-998-4550</div>',
  '    </div>',
  '  </footer>',

  /* Jump overlay — keyboard/escape fallback */
  '  <div class="jump-ov" id="jump-ov">',
  '    <div class="jump-sh">',
  '      <div class="jump-hnd"></div>',
  '      <div class="jump-ttl">Jump to another chapter</div>',
  '      <div class="jump-items" id="jump-items"></div>',
  '    </div>',
  '  </div>',

  /* Interrupt */
  '  <div class="interrupt-dim" id="int-dim"></div>',
  '  <div class="interrupt-card" id="int-card">',
  '    <div class="int-face" id="int-face">',
  '      <div class="int-ring"></div>',
  '      <img id="int-george-img" alt="George Kindler">',
  '    </div>',
  '    <div class="int-bubble">',
  '      <div class="int-title" id="int-title"></div>',
  '      <div class="int-text" id="int-text"></div>',
  '      <button class="int-btn" id="int-btn" type="button">Got it</button>',
  '      <button class="wire-skip" id="int-skip" type="button" style="display:none;"></button>',
  '    </div>',
  '  </div>',

  /* George card popup */
  '  <div class="george-dim" id="pop">',
  '    <div class="george-card" id="pop-sh">',
  '      <div class="gc-handle"></div>',
  '      <div class="gc-close" id="pop-close" role="button" tabindex="0">&#10005;</div>',
  '      <div class="gc-header">',
  '        <div class="gc-photo" id="gc-photo">',
  '          <div class="gc-photo-ring"></div>',
  '          <img id="gc-photo-img" alt="' + escapeAttr(gc.name) + '">',
  '        </div>',
  '        <div class="gc-name-block">',
  '          <div class="gc-name" id="gc-name">' + gc.name + '</div>',
  '          <div class="gc-title" id="gc-title">' + gc.titleTop + '<br><span>' + gc.titleBottom + '</span></div>',
  '        </div>',
  '      </div>',
  '      <div class="gc-stats" id="gc-stats"></div>',
  '      <div class="gc-about" id="gc-about"></div>',
  '      <div class="gc-context-wrap">',
  '        <button class="gc-context-btn" id="gc-context-btn" type="button">',
  '          <span class="gc-context-ico">' + renderIcon("map") + '</span>',
  '          <span id="gc-context-label"></span>',
  '        </button>',
  '        <div class="gc-context-copy" id="gc-context-copy"></div>',
  '      </div>',
  '      <a class="gc-call" id="gc-call" href="#">',
  '        <span class="gc-call-ico">' + renderIcon("phone") + '</span>',
  '        <span id="gc-call-label"></span>',
  '      </a>',
  '    </div>',
  '  </div>',

  '</div>'
].join("\n");

renderGeorgeCardStatic();
```

}

function renderGeorgeCardStatic() {
var cfg         = getGeorgeCardConfig();
var statsWrap   = byId(“gc-stats”);
var about       = byId(“gc-about”);
var call        = byId(“gc-call”);
var callLabel   = byId(“gc-call-label”);
var ctxLabel    = byId(“gc-context-label”);
var ctxCopy     = byId(“gc-context-copy”);
var img         = byId(“gc-photo-img”);

```
if (statsWrap) {
  statsWrap.innerHTML = (cfg.stats || []).map(function (s) {
    return '<div class="gc-stat">' +
      '<div class="gc-stat-num">' + nl2br(s.value) + '</div>' +
      '<div class="gc-stat-lbl">' + nl2br(s.label) + '</div>' +
      '</div>';
  }).join("");
}

if (about)     about.innerHTML      = cfg.about || "";
if (call)      call.setAttribute("href", "tel:" + String(cfg.phone || "").replace(/[^\d]/g, ""));
if (callLabel) callLabel.textContent = cfg.phoneLabel || "";
if (ctxLabel)  ctxLabel.textContent  = cfg.imageLabel || "What\u2019s in this picture?";
if (ctxCopy)   ctxCopy.textContent   = cfg.imageContext || "";
if (img)       loadGeorgeImage(img, cfg.image);
```

}

/* ============================================================
EVENTS
============================================================ */

function bindShellEvents() {
safelyBind(byId(“btn-back”),             “click”,   prevScene);
safelyBind(byId(“btn-next”),             “click”,   nextScene);
safelyBind(byId(“btn-explore”),          “click”,   function () { openDashboard(“journey”); });
safelyBind(byId(“ask-george”),           “click”,   askGeorge);
safelyBind(byId(“int-btn”),              “click”,   function () { dismissInterrupt(false); });
safelyBind(byId(“int-skip”),             “click”,   function () { dismissInterrupt(false); nextScene(); });
safelyBind(byId(“int-face”),             “click”,   openGeorgeCard);
safelyBind(byId(“pop-close”),            “click”,   closePop);
safelyBind(byId(“gc-context-btn”),       “click”,   toggleGeorgeContext);
safelyBind(byId(“george-float”),         “click”,   openGeorgeCard);
safelyBind(byId(“george-float”),         “keydown”, function (e) {
if (e.key === “Enter” || e.key === “ “) { e.preventDefault(); openGeorgeCard(); }
});
safelyBind(byId(“jump-ov”), “click”, function (e) {
if (e.target === byId(“jump-ov”)) byId(“jump-ov”).classList.remove(“open”);
});
document.addEventListener(“keydown”, function (e) {
if (e.key !== “Escape”) return;
closePop();
closeDashboard();
closeToolPanel();
if (byId(“jump-ov”)) byId(“jump-ov”).classList.remove(“open”);
dismissInterrupt(true);
});
}

/* ============================================================
GEORGE IMAGE SYSTEM
============================================================ */

function loadGeorgeImage(img, src) {
if (!img) return;
img.onload  = function () { img.style.display = “block”; };
img.onerror = function () { img.style.display = “none”; };
img.src = src || “”;
}

function setGeorgeState(faceName, speaking, imageLabel, imageContext) {
var faceSrc = georgeFace(faceName);
loadGeorgeImage(byId(“george-img”),    faceSrc);
loadGeorgeImage(byId(“int-george-img”), faceSrc);

```
toggleClass(byId("gf-wrap"),   "speaking", !!speaking);
toggleClass(byId("int-face"),  "speaking", !!speaking);
toggleClass(byId("gc-photo"),  "speaking", !!speaking);

var cfg     = getGeorgeCardConfig();
var ctxLabel = byId("gc-context-label");
var ctxCopy  = byId("gc-context-copy");
if (ctxLabel) ctxLabel.textContent = imageLabel || cfg.imageLabel || "What\u2019s in this picture?";
if (ctxCopy)  {
  ctxCopy.textContent = imageContext || cfg.imageContext || "";
  ctxCopy.classList.remove("open");
}
```

}

/* ============================================================
SCENE RENDERING
============================================================ */

function renderScene(idx) {
var scenes = getScenes();
var scene  = scenes[idx];
if (!scene) return;

```
currentSceneIndex = idx;
```

/* Allow chapter-specific photo-reveal override */
if (scene.type === “photo-reveal” && typeof window.renderPhotoReveal === “function”) {
window.renderPhotoReveal(scene, idx);
return;
}

```
/* Demo scene — iframe fills stage, Next locked until demo completes */
if (scene.demoIframe) {
  _renderDemoScene(scene, idx);
  return;
}

setProgress(idx, scenes.length);
setText("scene-lbl", scene.room  || getChapterLabel());
setText("sc-room",   scene.room  || "");
setText("sc-title",  scene.title || "");
setText("sc-sub",    scene.sub   || "");

var bgImg   = byId("bg-img");
var svgWrap = byId("scene-svg-wrap");
if (bgImg) {
  bgImg.style.display  = "block";
  bgImg.style.opacity  = "0";
  bgImg.onload  = function () { bgImg.style.transition = "opacity .6s ease"; bgImg.style.opacity = "1"; };
  bgImg.onerror = function () { bgImg.style.display = "none"; if (svgWrap) svgWrap.style.display = "flex"; };
  bgImg.src = scene.bg || "";
}

setGeorgeState(
  scene.george,
  !!scene.georgeSpeaking || !!scene.interrupt,
  scene.georgeImageLabel,
  scene.georgeImageContext
);

/* ── VIDEO BUBBLE ── */
/* If scene has a video ID, replace George image with inline YouTube bubble.
   If no video, restore George image normally. */
if (scene.video) {
  _renderVideoFloat(scene.video, scene.george);
} else {
  _destroyVideoFloat();
}

dismissInterrupt(true);
closeDrawer();
clearVisualCues();

/* Clean up demo iframe if leaving a demo scene */
var oldIframe = byId("demo-iframe");
if (oldIframe) oldIframe.remove();
_demoIframe = null;
var gf0 = byId("george-float");
if (gf0) gf0.style.opacity = "1";
var sc0 = byId("scene-caption");
if (sc0) sc0.style.opacity = "1";
renderSceneChips(_mergeRegistryChips(scene.chips || [], currentSceneIndex));
renderSceneCues(scene.cues    || []);
buildChoices(scene.choices  || []);

var btnBack = byId("btn-back");
if (btnBack) btnBack.disabled = (idx === 0);

var btnNext = byId("btn-next");
if (btnNext) {
  if (scene.isLast) {
    btnNext.textContent = scene.nextLabel || "Next \u2192";
    btnNext.classList.add("gold");
  } else {
    btnNext.textContent = "Next \u2192";
    btnNext.classList.remove("gold");
  }
 btnNext.disabled = !!scene.demoIframe;
}

if (scene.interrupt) {
  interruptDismissed = false;
  if (interruptTimer) clearTimeout(interruptTimer);
  interruptTimer = setTimeout(function () {
    if (!interruptDismissed) showInterrupt(scene.interrupt);
  }, 1000);
} else if (scene.choices && scene.choices.length) {
  setTimeout(openDrawer, 700);
}

var askBtn = byId("ask-george");
if (askBtn) { askBtn.style.display = "none"; askBtn.classList.remove("show"); }

highlightJourneyRail();

state.lastStep    = idx;
state.lastChapter = getChapterNumber();
saveState();

track("scene_view", { chapter: getChapterNumber(), scene: idx, room: scene.room || "" });

/* Hook for resource chapter demo controllers */
if (typeof window.onSceneRender === "function") {
  window.onSceneRender(idx, scene);
}
```

}
/* ============================================================
DEMO SCENE
============================================================ */

function _renderDemoScene(scene, idx) {
_demoScene     = scene;
_demoStepIndex = 0;

```
setProgress(idx, getScenes().length);
setText("scene-lbl", scene.room || "");

/* Hide George float and caption — iframe fills stage */
var gf = byId("george-float");
var sc = byId("scene-caption");
if (gf) gf.style.opacity = "0";
if (sc) sc.style.opacity = "0";

/* Clear any existing demo iframe */
var stage = byId("stage");
var existing = byId("demo-iframe");
if (existing) existing.remove();

/* Build iframe */
_demoIframe = document.createElement("iframe");
_demoIframe.id = "demo-iframe";
_demoIframe.src = scene.demoIframe;
_demoIframe.setAttribute("allow", "geolocation");
_demoIframe.style.cssText = [
  "position:absolute",
  "inset:0",
  "width:100%",
  "height:100%",
  "border:none",
  "z-index:4",
  "background:var(--bg)",
  "pointer-events:none"
].join(";");

if (stage) stage.appendChild(_demoIframe);

/* Send init message once iframe loads */
_demoIframe.addEventListener("load", function () {
  var stageEl  = byId("stage");
  var drawerEl = byId("drawer");
  var stageH   = stageEl  ? stageEl.offsetHeight  : 420;
  var drawerH  = drawerEl ? drawerEl.offsetHeight  : 200;
  _demoIframe.contentWindow.postMessage({
    hcDemo:      true,
    action:      "init",
    stageHeight: stageH,
    drawerHeight: drawerH
  }, "*");
});

/* Gate scroll-to commands on iframe readiness.
   hcDemoReady is posted by home-cost.html once #hc-repair-list has children. */
_demoIframe._hcReady = false;
(function () {
  var handler = function (e) {
    if (!e.data || !e.data.hcDemoReady) return;
    _demoIframe._hcReady = true;
    window.removeEventListener("message", handler);
  };
  window.addEventListener("message", handler);
})();

/* Keep Next locked, Skip always works via prevScene/nextScene */
var btnNext = byId("btn-next");
if (btnNext) { btnNext.disabled = true; btnNext.classList.remove("gold"); }

/* Show interrupt first — George appears on top of iframe */
dismissInterrupt(true);
closeDrawer();
buildChoices(scene.choices || []);

/* Wire choice taps to start demo step 1 */
_wireDemoChoices(scene.choices || [], 0);

if (scene.interrupt) {
  interruptDismissed = false;
  if (interruptTimer) clearTimeout(interruptTimer);
  interruptTimer = setTimeout(function () {
    if (!interruptDismissed) showInterrupt(scene.interrupt);
  }, 800);
} else {
  setTimeout(openDrawer, 700);
}

state.lastStep    = idx;
state.lastChapter = getChapterNumber();
saveState();
```

}

function _wireDemoChoices(choices, stepIdx) {
/* Rebuild choices with demo-aware click handlers */
var container = byId(“choices”);
if (!container) return;
container.innerHTML = “”;
choices.forEach(function (c) {
var btn = document.createElement(“button”);
btn.className = “choice-btn”;
btn.textContent = c.label;
btn.addEventListener(“click”, function () {
/* Show response */
var resp = byId(“drawer-response”);
if (resp) { resp.textContent = c.response || “”; resp.classList.add(“show”); }
/* If this choice triggers a demo step, run it */
if (c.demoStep != null) {
_runDemoStep(c.demoStep - 1);
}
});
container.appendChild(btn);
});
openDrawer();
}

function _runDemoStep(stepIdx) {
if (!_demoScene || !_demoScene.demoSteps) return;
var step = _demoScene.demoSteps[stepIdx];
if (!step) return;

```
_demoStepIndex = stepIdx;

/* Dismiss interrupt and close drawer during demo */
dismissInterrupt(true);
closeDrawer();

/* Hide George, show iframe fully */
var gf = byId("george-float");
if (gf) gf.style.opacity = "0";

/* Fire postMessage sequence — gate scroll-to on iframe readiness */
(step.sequence || []).forEach(function (cmd) {
  setTimeout(function () {
    if (!_demoIframe || !_demoIframe.contentWindow) return;
    /* If this is a scroll-to command, wait until iframe signals hcDemoReady */
    if (cmd.action === "scroll-to" && !_demoIframe._hcReady) {
      var pollReady = setInterval(function () {
        if (!_demoIframe || !_demoIframe._hcReady) return;
        clearInterval(pollReady);
        var msg2 = { hcDemo: true, action: cmd.action };
        if (cmd.itemId) msg2.itemId = cmd.itemId;
        _demoIframe.contentWindow.postMessage(msg2, "*");
      }, 80);
      return;
    }
    var msg = { hcDemo: true, action: cmd.action };
    if (cmd.itemId)   msg.itemId   = cmd.itemId;
    if (cmd.tab)      msg.tab      = cmd.tab;
    if (cmd.length)   msg.length   = cmd.length;
    if (cmd.width)    msg.width    = cmd.width;
    if (cmd.workType) msg.workType = cmd.workType;
    _demoIframe.contentWindow.postMessage(msg, "*");
  }, cmd.delay || 0);
});

/* After sequence completes — show George text and next step choices */
var lastDelay = 0;
(step.sequence || []).forEach(function (cmd) {
  if ((cmd.delay || 0) > lastDelay) lastDelay = cmd.delay || 0;
});

setTimeout(function () {
  /* George reappears with step text */
  var gf2 = byId("george-float");
  if (gf2) gf2.style.opacity = "1";
  setText("sc-sub", step.georgeText || "");

  var isLastStep = (stepIdx >= _demoScene.demoSteps.length - 1);

  if (isLastStep) {
    /* Demo complete — enable Next, show final choices */
    var btnNext = byId("btn-next");
    if (btnNext) {
      btnNext.disabled = false;
      btnNext.classList.add("gold");
      btnNext.textContent = _demoScene.nextLabel || "Next \u2192";
      /* Pulse to draw attention */
      btnNext.style.animation = "none";
      setTimeout(function () { btnNext.style.animation = ""; }, 50);
    }
    buildChoices([
      {label: "Open the Cost Survival Guide now",
       response: "Opening the tool now.",
       action: function () { if (window.SharedPlatform) window.SharedPlatform.openToolPanel("home-cost"); }
      },
      {label: "Continue to offer strategy \u2192",
       response: "Let\u2019s move on.",
       action: function () { nextScene(); }
      }
    ]);
  } else {
    /* Wire next step choices */
    _wireDemoChoices(step.choices || [], stepIdx + 1);
    /* Update choices to trigger next step */
    var container2 = byId("choices");
    if (container2) {
      Array.prototype.forEach.call(
        container2.querySelectorAll(".choice-btn"),
        function (btn, i) {
          var ch = (step.choices || [])[i];
          if (!ch) return;
          btn.addEventListener("click", function () {
            setTimeout(function () {
              _runDemoStep(stepIdx + 1);
            }, 600);
          });
        }
      );
    }
  }
  openDrawer();
}, lastDelay + 2000);
```

}
/* ============================================================
CHIPS
============================================================ */
function _mergeRegistryChips(sceneChips, sceneIdx) {
var chNum    = getChapterNumber ? getChapterNumber() : 0;
var registry = window.RESOURCES_REGISTRY || [];
var injected = [];

```
registry.forEach(function (entry) {
  (entry.citations || []).forEach(function (cit) {
    if (cit.chapter === chNum && cit.scene === sceneIdx) {
      injected.push({
        label:  entry.title,
        action: function () {
          if (entry.tool && entry.toolId) {
            closeDashboard();
            openToolPanel(entry.toolId);
          } else {
            window.location.href = entry.url || '#';
          }
        }
      });
    }
  });
});

return sceneChips.concat(injected);
```

}
function renderSceneChips(chips) {
var wrap = byId(“scene-chip-row”);
if (!wrap) return;
wrap.innerHTML = “”;
chips.forEach(function (chip) {
var btn = document.createElement(“button”);
btn.type      = “button”;
btn.className = “scene-chip”;
btn.innerHTML =
‘<span class="scene-chip-ico">’ + renderIcon(chip.icon || “check”) + ‘</span>’ +
‘<span>’ + (chip.label || “”) + ‘</span>’;
btn.addEventListener(“click”, function () {
if (chip.action)                       { chip.action(); return; }
if (chip.deep)                         { showDeep(chip.deep.title, chip.deep.body); return; }
if (chip.cueIndex != null)             { activateSpotlightFromCueIndex(chip.cueIndex); }
});
wrap.appendChild(btn);
});
}

/* ============================================================
VISUAL CUES + SPOTLIGHT
============================================================ */

function renderSceneCues(cues) {
var layer      = byId(“scene-cue-layer”);
var spotlight  = byId(“scene-spotlight”);
if (!layer || !spotlight) return;

```
layer.innerHTML = "";
spotlight.classList.remove("show");

cues.forEach(function (cue, idx) {
  if (cue.type === "spotlight" && cue.autoplay) {
    setTimeout(function () { activateSpotlight(cue); }, cue.delay || 700);
  }

  if (cue.type === "pulse" || cue.type === "badge") {
    var el = document.createElement("button");
    el.type      = "button";
    el.className = "scene-cue " + cueClassForTone(cue.tone);
    el.style.left = (cue.x || 50) + "%";
    el.style.top  = (cue.y || 50) + "%";
    el.innerHTML  =
      '<div class="scene-cue-dot"></div>' +
      (cue.label ? '<div class="scene-cue-label">' + cue.label + '</div>' : "");
    el.addEventListener("click", function () {
      if (cue.deep)      { showDeep(cue.deep.title, cue.deep.body); }
      else if (cue.spotlight) { activateSpotlight(cue.spotlight); }
    });
    layer.appendChild(el);
  }

  cue._index = idx;
});
```

}

function cueClassForTone(tone) {
if (tone === “green”) return “pulse-green”;
if (tone === “red”)   return “pulse-red”;
return “pulse-yellow”;
}

function activateSpotlightFromCueIndex(idx) {
var scene = getScenes()[currentSceneIndex];
if (!scene || !scene.cues || !scene.cues[idx]) return;
activateSpotlight(scene.cues[idx].spotlight || scene.cues[idx]);
}

function activateSpotlight(cue) {
var spotlight = byId(“scene-spotlight”);
var hole      = byId(“scene-spotlight-hole”);
if (!spotlight || !hole) return;

```
var size = cue.size || 84;
hole.style.left   = "calc(" + (cue.x || 50) + "% - " + (size / 2) + "px)";
hole.style.top    = "calc(" + (cue.y || 50) + "% - " + (size / 2) + "px)";
hole.style.width  = size + "px";
hole.style.height = size + "px";
spotlight.classList.add("show");

if (spotlightTimeout) clearTimeout(spotlightTimeout);
spotlightTimeout = setTimeout(function () {
  spotlight.classList.remove("show");
}, cue.duration || 1800);
```

}

function clearVisualCues() {
if (spotlightTimeout) clearTimeout(spotlightTimeout);
if (byId(“scene-cue-layer”)) byId(“scene-cue-layer”).innerHTML = “”;
if (byId(“scene-spotlight”)) byId(“scene-spotlight”).classList.remove(“show”);
}

/* ============================================================
DRAWER + CHOICES
============================================================ */

function buildChoices(choices) {
var container = byId(“choices”);
var labelEl   = byId(“drawer-label”);
if (!container) return;

```
container.innerHTML = "";
if (labelEl) {
  var scene = getScenes()[currentSceneIndex];
  labelEl.textContent = (scene && scene.drawerLabel) || "Ask me anything";
}

choices.forEach(function (choice, idx) {
  var card = document.createElement("div");
  card.className = "choice-card";
  card.id        = "card-" + idx;

  var deepBtn = "";
  if (choice.deep && choice.deep.title && choice.deep.body) {
    deepBtn =
      '<button class="card-deep" type="button" data-title="' + escapeAttr(choice.deep.title) + '" data-body="' + escapeAttr(choice.deep.body) + '">' +
      '\u24D8 ' + choice.deep.title + ' \u2192</button>';
  }

  card.innerHTML =
    '<button class="choice-card-header" type="button" data-choice-index="' + idx + '">' +
    '<span>' + (choice.label || "") + '</span>' +
    '<span class="card-chevron">\u25BC</span>' +
    '</button>' +
    '<div class="choice-card-body">' +
    '<div class="choice-card-response">' + nl2br(choice.response || "") + deepBtn + '</div>' +
    '</div>';

  container.appendChild(card);
});

Array.prototype.forEach.call(container.querySelectorAll("[data-choice-index]"), function (btn) {
  btn.addEventListener("click", function () {
    toggleCard(Number(btn.getAttribute("data-choice-index")), choices.length);
  });
});

Array.prototype.forEach.call(container.querySelectorAll(".card-deep"), function (btn) {
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    showDeep(btn.getAttribute("data-title"), btn.getAttribute("data-body"));
  });
});
```

}

function toggleCard(idx, total) {
for (var i = 0; i < total; i++) {
var card = byId(“card-” + i);
if (!card) continue;
if (i === idx) card.classList.toggle(“open”);
else           card.classList.remove(“open”);
}
track(“choice_tap”, { chapter: getChapterNumber(), card: idx });
}

function openDrawer() {
var d = byId(“drawer”);
var app = document.querySelector(”.app”);
if (d) d.classList.add(“open”);
if (app) app.classList.add(“drawer-open”);
}

function closeDrawer() {
var d = byId(“drawer”);
var app = document.querySelector(”.app”);
if (d) d.classList.remove(“open”);
if (app) app.classList.remove(“drawer-open”);
}
/* ============================================================
INTERRUPT
============================================================ */

function typeText(text, elId) {
var el = byId(elId);
if (!el) return;
el.innerHTML = “”;
var i = 0;
var t = setInterval(function () {
el.innerHTML = nl2br(String(text || “”).slice(0, i));
i++;
if (i > String(text || “”).length) clearInterval(t);
}, 14);
}

function showInterrupt(interrupt) {
setText(“int-title”, interrupt.title || “”);
typeText(interrupt.text || “”, “int-text”);

```
var btnEl = byId("int-btn");
if (btnEl) btnEl.textContent = interrupt.btnText || "Got it";

var skipEl = byId("int-skip");
if (skipEl) {
  if (interrupt.skipLabel) { skipEl.textContent = interrupt.skipLabel; skipEl.style.display = "block"; }
  else                     { skipEl.style.display = "none"; }
}

if (byId("int-dim"))  byId("int-dim").classList.add("active");
if (byId("int-card")) byId("int-card").classList.add("active");
closeDrawer();
```

}

function dismissInterrupt(silent) {
if (interruptTimer) { clearTimeout(interruptTimer); interruptTimer = null; }
interruptDismissed = true;
if (byId(“int-dim”))  byId(“int-dim”).classList.remove(“active”);
if (byId(“int-card”)) byId(“int-card”).classList.remove(“active”);

```
var scene = getScenes()[currentSceneIndex];
if (!silent && scene && scene.choices && scene.choices.length) {
  setTimeout(openDrawer, 320);
}
if (!silent) {
  var askBtn = byId("ask-george");
  if (askBtn) { askBtn.style.display = "block"; askBtn.classList.add("show"); }
}
```

}

function askGeorge() {
var scene = getScenes()[currentSceneIndex];
if (scene && scene.interrupt) { showInterrupt(scene.interrupt); return; }
openGeorgeCard();
}

/* ============================================================
DEEP DIVE / GEORGE CARD
============================================================ */

function showDeep(title, body) {
setText(“gc-context-label”, title || “What\u2019s in this picture?”);
setText(“gc-context-copy”,  body  || “”);
var ctxCopy = byId(“gc-context-copy”);
if (ctxCopy) ctxCopy.classList.add(“open”);
openGeorgeCard();
}

function openGeorgeCard() {
var pop  = byId(“pop”);
var card = byId(“pop-sh”);
if (!pop || !card) return;
pop.style.display      = “flex”;
pop.style.pointerEvents = “all”;
requestAnimationFrame(function () {
pop.style.opacity = “1”;
card.classList.add(“open”);
});
}

function closePop() {
var pop  = byId(“pop”);
var card = byId(“pop-sh”);
if (!pop || !card) return;
pop.style.opacity      = “0”;
pop.style.pointerEvents = “none”;
card.classList.remove(“open”);
setTimeout(function () { pop.style.display = “none”; }, 260);
}

function toggleGeorgeContext() {
var copy = byId(“gc-context-copy”);
if (copy) copy.classList.toggle(“open”);
}

/* ============================================================
NAVIGATION
============================================================ */

function nextScene() {
var scenes = getScenes();
var scene  = scenes[currentSceneIndex];
if (!scene) return;

```
if (scene.type === "photo-reveal" && window._prAnswered && typeof window.prContinue === "function") {
  window.prContinue();
  return;
}

if (scene.isLast) {
  if (!Array.isArray(state.chaptersVisited)) state.chaptersVisited = [];
  if (state.chaptersVisited.indexOf(getChapterNumber()) === -1) {
    state.chaptersVisited.push(getChapterNumber());
  }
  state.lastChapter = scene.nextChapter || (getChapterNumber() + 1);
  state.lastStep    = 0;
  saveState();
  window.location.href = scene.nextFile || "index.html";
  return;
}

if (currentSceneIndex < scenes.length - 1) {
  currentSceneIndex++;
  renderScene(currentSceneIndex);
}
```

}

function prevScene() {
if (currentSceneIndex > 0) {
currentSceneIndex–;
renderScene(currentSceneIndex);
return;
}
window.location.href = getPrevFile();
}

/* ============================================================
JUMP MENU
============================================================ */

function openJump() {
var visited   = Array.isArray(state.chaptersVisited) ? state.chaptersVisited : [];
var container = byId(“jump-items”);
var overlay   = byId(“jump-ov”);
if (!container || !overlay) return;

```
container.innerHTML = APP_CONFIG.chapters.map(function (ch) {
  var isCurrent = ch.ch === getChapterNumber();
  var isVisited = visited.indexOf(ch.ch) !== -1 && !isCurrent;
  return (
    '<div class="jump-item ' + (isCurrent ? "cur-ch" : "") + '" onclick="SharedPlatform.jumpTo(\'' + ch.file + "'," + ch.ch + ')">' +
      '<div class="ji-dot ' + (isCurrent ? "cur" : isVisited ? "vis" : "") + '"></div>' +
      '<div class="ji-icon">' + renderIcon(ch.icon || "house") + '</div>' +
      '<div class="ji-lbl">' + ch.label + (isCurrent ? " \u2190 here" : "") + '</div>' +
      '<div class="ji-arr">' + (isCurrent ? "" : "\u203A") + '</div>' +
    '</div>'
  );
}).join("");

overlay.classList.add("open");
```

}

function jumpTo(file, chNum) {
var overlay = byId(“jump-ov”);
if (chNum === getChapterNumber()) {
if (overlay) overlay.classList.remove(“open”);
return;
}
if (!Array.isArray(state.chaptersVisited)) state.chaptersVisited = [];
if (state.chaptersVisited.indexOf(getChapterNumber()) === -1) {
state.chaptersVisited.push(getChapterNumber());
}
state.jumpEntry = “jump_ch” + chNum;
saveState();
window.location.href = file;
}

/* ============================================================
ICON CARD GRID (used by index and chapters)
============================================================ */

function renderIconCardGrid(target, cards) {
if (!target) return;
target.innerHTML =
‘<div class="icon-card-grid">’ +
cards.map(function (card) {
return (
‘<button class=“icon-card” type=“button” data-file=”’ + escapeAttr(card.file || “”) + ‘” data-event=”’ + escapeAttr(card.event || “”) + ‘”>’ +
‘<span class="icon-card-ico">’ + renderIcon(card.icon || “house”) + ‘</span>’ +
‘<span class="icon-card-copy">’ +
‘<span class="icon-card-title">’ + (card.title || “”) + ‘</span>’ +
(card.sub ? ‘<span class="icon-card-sub">’ + card.sub + ‘</span>’ : “”) +
‘</span>’ +
‘</button>’
);
}).join(””) +
‘</div>’;

```
Array.prototype.forEach.call(target.querySelectorAll(".icon-card"), function (btn) {
  btn.addEventListener("click", function () {
    var file      = btn.getAttribute("data-file");
    var eventName = btn.getAttribute("data-event");
    if (eventName) { state.jumpEntry = eventName; saveState(); track("journey_entry", { entry_point: eventName }); }
    if (file)       window.location.href = file;
  });
});
```

}

/* ============================================================
JOURNEY CARD LIST (index post-intro 3-click system)
============================================================ */

function createJourneyCardHTML(card) {
return (
’<div class=“journey-card ’ + (card.cardClass || “”) + ‘” data-file=”’ + escapeAttr(card.file || “”) + ‘” data-event=”’ + escapeAttr(card.event || “”) + ‘”>’ +
‘<div class="journey-card-head">’ +
‘<div class="journey-card-icon">’ + renderIcon(card.icon || “house”) + ‘</div>’ +
‘<div class="journey-card-body">’ +
‘<div class="journey-card-title">’ + (card.title || “”) + ‘</div>’ +
‘</div>’ +
‘<span class="journey-card-arrow">\u203A</span>’ +
‘</div>’ +
‘<div class="journey-card-detail">’ +
‘<div class="journey-card-detail-inner">’ +
‘<div class="journey-card-desc">’  + (card.desc   || “”) + ‘</div>’ +
(card.commit ? ‘<span class="journey-card-commit">’ + card.commit + ‘</span>’ : “”) +
‘</div>’ +
‘</div>’ +
‘</div>’
);
}

function renderJourneyCardList(target, cards) {
if (!target) return;
target.innerHTML = cards.map(createJourneyCardHTML).join(””);
Array.prototype.forEach.call(target.querySelectorAll(”.journey-card”), function (card) {
card.addEventListener(“click”, function () { handleJourneyCardClick(card); });
});
}

function handleJourneyCardClick(card) {
var file      = card.getAttribute(“data-file”);
var eventName = card.getAttribute(“data-event”) || “start”;

```
if (card.classList.contains("expanded")) {
  if (eventName) { state.jumpEntry = eventName; saveState(); track("journey_entry", { entry_point: eventName }); }
  if (file) window.location.href = file;
  return;
}

collapseJourneySiblings(card);
card.classList.add("expanded");
card.dataset.manualToggle = "1";

if (card._collapseTimer) clearTimeout(card._collapseTimer);
card._collapseTimer = setTimeout(function () {
  card.classList.remove("expanded");
  delete card.dataset.manualToggle;
  card._collapseTimer = null;
}, 10000);
```

}

function collapseJourneySiblings(activeCard) {
Array.prototype.forEach.call(document.querySelectorAll(”.journey-card”), function (card) {
if (card !== activeCard) {
card.classList.remove(“expanded”);
delete card.dataset.manualToggle;
if (card._collapseTimer) { clearTimeout(card._collapseTimer); card._collapseTimer = null; }
}
});
}

/* ============================================================
JOURNEY RAIL
============================================================ */

function renderJourneyRail() {
var inner = byId(“journey-rail-inner”);
if (!inner) return;

```
inner.innerHTML = (APP_CONFIG.chapters || []).map(function (ch) {
  return (
    '<button class="journey-rail-item" type="button" ' +
      'data-file="' + escapeAttr(ch.file || "") + '" ' +
      'data-ch="' + ch.ch + '" ' +
      'aria-label="' + escapeAttr(ch.label || "") + '" ' +
      'title="' + escapeAttr(ch.label || "") + '">' +
      renderIcon(ch.icon || "house") +
    '</button>'
  );
}).join("");

Array.prototype.forEach.call(inner.querySelectorAll(".journey-rail-item"), function (btn) {
  btn.addEventListener("click", function () {
    var chNum = Number(btn.getAttribute("data-ch"));
    var file  = btn.getAttribute("data-file");
    if (!file) return;

    if (chNum === getChapterNumber()) { highlightJourneyRail(); return; }

    if (!Array.isArray(state.chaptersVisited)) state.chaptersVisited = [];
    if (state.chaptersVisited.indexOf(getChapterNumber()) === -1) {
      state.chaptersVisited.push(getChapterNumber());
    }
    state.jumpEntry = "rail_ch" + chNum;
    saveState();
    window.location.href = file;
  });
});

highlightJourneyRail();
```

}

function highlightJourneyRail(activeChapter) {
var inner   = byId(“journey-rail-inner”);
if (!inner) return;
var current = typeof activeChapter === “number” ? activeChapter : getChapterNumber();
Array.prototype.forEach.call(inner.querySelectorAll(”.journey-rail-item”), function (btn) {
toggleClass(btn, “active”, Number(btn.getAttribute(“data-ch”)) === current);
});
}

function toggleJourneyRail(forceOpen) {
var rail = byId(“journey-rail”);
if (!rail) return;
var open = typeof forceOpen === “boolean” ? forceOpen : !rail.classList.contains(“open”);
rail.classList.toggle(“open”, open);
rail.setAttribute(“aria-hidden”, open ? “false” : “true”);
}

/* ============================================================
PUBLIC API
============================================================ */

function getState() { return JSON.parse(JSON.stringify(state)); }

/* ============================================================
DASHBOARD — persistent top bar
============================================================ */

var _dashActiveTab = null;
var _dashPanelEl   = null;

function renderDashboard() {
if (byId(“dash-bar”)) return; /* already rendered */

```
var bar = document.createElement("div");
bar.className = "dash-bar";
bar.id        = "dash-bar";
bar.innerHTML =
  '<button class="dash-tab" id="dash-tab-tools"         type="button">Tools</button>'         +
  '<button class="dash-tab" id="dash-tab-resources"     type="button">Resources</button>'     +
  '<button class="dash-tab" id="dash-tab-neighborhoods" type="button">Neighborhoods</button>' +
  '<button class="dash-tab" id="dash-tab-guides"        type="button">Guides</button>'        +
  '<button class="dash-tab" id="dash-tab-journey"       type="button">Journey</button>';

/* Inject AFTER the header (.hdr) inside .app so it sits below the header in the flow */
var app = document.querySelector(".app") || document.querySelector("#app");
if (app) {
  var hdr = app.querySelector(".hdr") || app.querySelector("header");
  if (hdr && hdr.nextSibling) {
    app.insertBefore(bar, hdr.nextSibling);
  } else if (hdr) {
    app.appendChild(bar);
  } else {
    app.insertBefore(bar, app.firstChild);
  }
} else {
  document.body.insertBefore(bar, document.body.firstChild);
}

safelyBind(byId("dash-tab-tools"),         "click", function () { openDashboard("tools"); });
safelyBind(byId("dash-tab-resources"),     "click", function () { openDashboard("resources"); });
safelyBind(byId("dash-tab-neighborhoods"), "click", function () { openDashboard("neighborhoods"); });
safelyBind(byId("dash-tab-guides"),        "click", function () { openDashboard("guides"); });
safelyBind(byId("dash-tab-journey"),       "click", function () { openDashboard("journey"); });
```

}

function openDashboard(tab) {
/* If same tab tapped again — close */
if (_dashActiveTab === tab && _dashPanelEl) {
closeDashboard();
return;
}

```
_dashActiveTab = tab;

/* Update tab active state */
["tools","resources","neighborhoods","guides","journey"].forEach(function (t) {
  var el = byId("dash-tab-" + t);
  if (el) toggleClass(el, "active", t === tab);
});

/* Create or reuse panel */
if (!_dashPanelEl) {
  _dashPanelEl = document.createElement("div");
  _dashPanelEl.id        = "dash-panel";
  _dashPanelEl.className = "tool-panel";
  document.body.appendChild(_dashPanelEl);
}

_dashPanelEl.innerHTML = _buildDashPanelHTML(tab);
_bindDashPanelEvents(tab);

requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    _dashPanelEl.classList.add("open");
  });
});
```

}

function closeDashboard() {
if (_dashPanelEl) _dashPanelEl.classList.remove(“open”);
_dashActiveTab = null;
[“tools”,“resources”,“neighborhoods”,“guides”,“journey”].forEach(function (t) {
var el = byId(“dash-tab-” + t);
if (el) el.classList.remove(“active”);
});
}

function _buildDashPanelHTML(tab) {
var chNum = getChapterNumber ? getChapterNumber() : 0;

```
var hdrTitle = tab === "tools"          ? "Tools"         :
               tab === "resources"    ? "Resources"    :
               tab === "neighborhoods"? "Neighborhoods" :
               tab === "guides"       ? "St. Louis Guides" : "Journey";

var header =
  '<div class="tool-panel-header">' +
    '<div class="tool-panel-title">' + hdrTitle + '</div>' +
    '<button class="tool-panel-close" id="dash-close" type="button">&#10005;</button>' +
  '</div>';

var body = "";

if (tab === "tools") {
  body = _buildToolSelectorHTML();
} else if (tab === "resources") {
  body = _buildResourcesPanelHTML(chNum);
} else if (tab === "neighborhoods") {
  body = _buildNeighborhoodsPanelHTML();
} else if (tab === "guides") {
  body = _buildGuidesPanelHTML();
} else {
  body = _buildJourneyPanelHTML(chNum);
}

return header + '<div class="tool-panel-body">' + body + '</div>';
```

}

function _bindDashPanelEvents(tab) {
safelyBind(byId(“dash-close”), “click”, closeDashboard);

```
if (tab === "neighborhoods") {
  /* Redirects to neighborhood-matcher tool panel — no bindings needed */
  return;
  var drawerTriggers = _dashPanelEl.querySelectorAll(".res-drawer-trigger");
  Array.prototype.forEach.call(drawerTriggers, function(btn) {
    btn.addEventListener("click", function() {
      var drawer = btn.closest(".res-drawer");
      if (!drawer) return;
      var isOpen = drawer.classList.contains("open");
      Array.prototype.forEach.call(
        _dashPanelEl.querySelectorAll(".res-drawer"),
        function(d) { d.classList.remove("open"); }
      );
      if (!isOpen) drawer.classList.add("open");
    });
  });
  /* Wire neighborhood card clicks */
  var hoodCards = _dashPanelEl.querySelectorAll(".tool-card[data-hood-url]");
  Array.prototype.forEach.call(hoodCards, function(card) {
    card.addEventListener("click", function() {
      var url   = card.getAttribute("data-hood-url");
      var nameEl = card.querySelector(".tool-card-title");
      var title  = nameEl ? nameEl.textContent : "Neighborhood";
      if (url) { closeDashboard(); openNeighborhoodPanel(url, title); }
    });
  });
} else if (tab === "tools") {
  var cards = _dashPanelEl.querySelectorAll(".tool-card");
  Array.prototype.forEach.call(cards, function (card) {
    card.addEventListener("click", function () {
      var toolId = card.getAttribute("data-tool");
      closeDashboard();
      openToolPanel(toolId);
    });
  });
} else if (tab === "resources") {
  var triggers = _dashPanelEl.querySelectorAll(".res-drawer-trigger");
  Array.prototype.forEach.call(triggers, function (btn) {
    btn.addEventListener("click", function () {
      var drawer = btn.closest(".res-drawer");
      if (!drawer) return;
      var isOpen = drawer.classList.contains("open");
      /* Close all drawers */
      Array.prototype.forEach.call(
        _dashPanelEl.querySelectorAll(".res-drawer"),
        function (d) { d.classList.remove("open"); }
      );
      if (!isOpen) drawer.classList.add("open");
    });
  });
  var openBtns = _dashPanelEl.querySelectorAll(".res-open-btn");
  Array.prototype.forEach.call(openBtns, function (btn) {
    btn.addEventListener("click", function () {
      var url = btn.getAttribute("data-url");
      var section = btn.getAttribute("data-section") || "";
      if (url) {
        state.lastPage    = window.location.pathname.split("/").pop() || "index.html";
        state.lastChapter = getChapterNumber ? getChapterNumber() : 0;
        saveState();
        window.location.href = url + (section ? "#" + section : "");
      }
    });
  });
} else if (tab === "guides") {
  var guideTriggers = _dashPanelEl.querySelectorAll(".res-drawer-trigger");
  Array.prototype.forEach.call(guideTriggers, function (btn) {
    btn.addEventListener("click", function () {
      var drawer = btn.closest(".res-drawer");
      if (!drawer) return;
      var isOpen = drawer.classList.contains("open");
      Array.prototype.forEach.call(
        _dashPanelEl.querySelectorAll(".res-drawer"),
        function (d) { d.classList.remove("open"); }
      );
      if (!isOpen) drawer.classList.add("open");
    });
  });
} else {
  var items = _dashPanelEl.querySelectorAll(".journey-panel-item");
  Array.prototype.forEach.call(items, function (item) {
    item.addEventListener("click", function () {
      var file   = item.getAttribute("data-file");
      var chNum2 = parseInt(item.getAttribute("data-ch"), 10);
      var step   = item.getAttribute("data-step");
      if (file) {
        closeDashboard();
        if (step) {
          state.lastStep = parseInt(step, 10);
          saveState();
          if (chNum2 === getChapterNumber()) {
            window.SharedPlatform.renderScene(parseInt(step, 10));
          } else {
            window.location.href = file;
          }
        } else {
          jumpTo(file, chNum2);
        }
      }
    });
  });
}
```

}

function _buildToolSelectorHTML() {
var tools = [
{ id:“prep”,      ico:“🏚”, title:“STL Open House Prep”,      sub:“Competition, true monthly cost, price tiers by zip — before you walk in.” },
{ id:“afford”,    ico:“🗺”, title:“STL Affordability Map”,     sub:“79 zip codes color-coded by what your budget actually buys.” },
{ id:“home-cost”, ico:“🔧”, title:“STL Home Cost Survival Guide”,   sub:“Walk the property, flag issues, get St. Louis repair estimates.” },
{ id:“compare”,   ico:“⚖️”, title:“Compare STL Properties”,    sub:“Two homes side by side — true monthly cost, taxes, 30-year difference.” },
{ id:“fails”, ico:“⚠️”, title:“STL Common Home Failures”, sub:“Visual guide to the most expensive defects in St. Louis housing stock.” },
{ id:“neighborhood-matcher”, ico:“🗺”, title:“STL Neighborhood Matcher”, sub:“5 questions. Ranked area matches with 98 neighborhoods to explore.” }
];

```
var strip =
  '<div class="tool-data-strip" style="margin:16px 16px 0;">' +
    '<div class="tool-data-stat"><div class="tool-data-num">7,006</div><div class="tool-data-lbl">MLS Sales</div></div>' +
    '<div class="tool-data-stat"><div class="tool-data-num">79</div><div class="tool-data-lbl">ZIP Codes</div></div>' +
    '<div class="tool-data-stat"><div class="tool-data-num">2025–26</div><div class="tool-data-lbl">MARIS Data</div></div>' +
  '</div>';

var cards = tools.map(function (t) {
  return (
    '<div class="tool-card" data-tool="' + t.id + '">' +
      '<div class="tool-card-ico">' + t.ico + '</div>' +
      '<div class="tool-card-copy">' +
        '<div class="tool-card-title">' + t.title + '</div>' +
        '<div class="tool-card-sub">' + t.sub + '</div>' +
      '</div>' +
      '<div class="tool-card-arr">›</div>' +
    '</div>'
  );
}).join("");

return strip + '<div class="tool-selector">' + cards + '</div>';
```

}

function _buildResourcesPanelHTML(chNum) {
var registry = (window.RESOURCES_REGISTRY || []);
var chapterResources = registry.filter(function (r) {
return r.citations && r.citations.some(function (c) { return c.chapter === chNum; });
});
var allResources = registry;

```
var html = "";

if (chapterResources.length > 0) {
  var chLabel = "";
  APP_CONFIG.chapters.forEach(function (ch) {
    if (ch.ch === chNum) chLabel = ch.label;
  });
  html += '<div class="res-section-title">For This Chapter</div>';
  if (chLabel) html += '<div class="res-chapter-tag">Ch.' + chNum + ' — ' + chLabel + '</div>';
  html += chapterResources.map(function (r) {
    return _buildResourceDrawerHTML(r, chNum, true);
  }).join("");
}

if (allResources.length > 0) {
  html += '<div class="res-section-title" style="margin-top:' + (chapterResources.length ? '8px' : '0') + '">All Resources</div>';
  html += allResources.map(function (r) {
    return _buildResourceDrawerHTML(r, chNum, false);
  }).join("");
} else {
  html +=
    '<div class="res-empty">' +
      '<strong>Resources Coming Soon</strong>' +
      'Expert Q&amp;A with lenders, inspectors, and title professionals — launching with each chapter.' +
    '</div>';
}

return html;
```

}

function _buildResourceDrawerHTML(r, chNum, expanded) {
/* Find the citation matching this chapter for entry section */
var citation = null;
if (r.citations) {
r.citations.forEach(function (c) {
if (c.chapter === chNum) citation = c;
});
}
var entrySection = (citation && citation.entrySection) ? citation.entrySection : “”;
var context      = (citation && citation.context)      ? citation.context      : “”;

```
return (
  '<div class="res-drawer' + (expanded ? ' open' : '') + '">' +
    '<button class="res-drawer-trigger" type="button">' +
      '<div class="res-drawer-copy">' +
        '<div class="res-drawer-title">' + r.title + '</div>' +
        '<div class="res-drawer-summary">' + r.summary + '</div>' +
      '</div>' +
      '<div class="res-drawer-chevron">›</div>' +
    '</button>' +
    '<div class="res-drawer-body">' +
      '<div class="res-drawer-content">' +
        (context ? '<div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;">' + context + '</div>' : '') +
        '<button class="res-open-btn" type="button" data-url="' + r.url + '" data-section="' + entrySection + '">' +
          'Open Resource &rarr;' +
        '</button>' +
      '</div>' +
    '</div>' +
  '</div>'
);
```

}

function _buildNeighborhoodsPanelHTML() {
closeDashboard();
openToolPanel(“neighborhood-matcher”);
return “”;

```
/* Build hood lookup from registry or hardcoded fallback */
var hoods = registry.length ? registry.map(function(n) {
  return {
    id:    n.id,
    name:  n.title.replace(/, (St\.\s*Louis|Missouri)$/, ''),
    zip:   (n.zips || []).join(' \u00b7 '),
    tag:   n.tag || n.group || '',
    url:   n.url,
    group: n.group || ''
  };
}) : [
  {id:"central-west-end",name:"Central West End",zip:"63108",tag:"West End",url:"central-west-end.html",group:"St. Louis City"},
  {id:"tower-grove-south",name:"Tower Grove South",zip:"63116",tag:"South City",url:"tower-grove-south.html",group:"St. Louis City"},
  {id:"shaw",name:"Shaw",zip:"63110",tag:"Southwest City",url:"shaw.html",group:"St. Louis City"},
  {id:"dogtown",name:"Dogtown",zip:"63139",tag:"Southwest City",url:"dogtown.html",group:"St. Louis City"},
  {id:"soulard",name:"Soulard",zip:"63104",tag:"South City",url:"soulard.html",group:"St. Louis City"},
  {id:"lafayette-square",name:"Lafayette Square",zip:"63104",tag:"Midtown",url:"lafayette-square.html",group:"St. Louis City"},
  {id:"the-hill",name:"The Hill",zip:"63110",tag:"Southwest City",url:"the-hill.html",group:"St. Louis City"},
  {id:"benton-park",name:"Benton Park",zip:"63118",tag:"South City",url:"benton-park.html",group:"St. Louis City"},
  {id:"st-louis-hills",name:"St. Louis Hills",zip:"63109",tag:"South City",url:"st-louis-hills.html",group:"St. Louis City"},
  {id:"kirkwood",name:"Kirkwood",zip:"63122",tag:"Inner West",url:"kirkwood.html",group:"Central Corridor"},
  {id:"webster-groves",name:"Webster Groves",zip:"63119",tag:"Inner West",url:"webster-groves.html",group:"Central Corridor"},
  {id:"clayton",name:"Clayton",zip:"63105",tag:"Inner West",url:"clayton.html",group:"Central Corridor"},
  {id:"university-city",name:"University City",zip:"63130 \u00b7 63133",tag:"Inner West",url:"university-city.html",group:"Central Corridor"},
  {id:"maplewood",name:"Maplewood",zip:"63143",tag:"Inner West",url:"maplewood.html",group:"Central Corridor"},
  {id:"florissant",name:"Florissant",zip:"63031 \u00b7 63033 \u00b7 63034",tag:"North County",url:"florissant.html",group:"North County"},
  {id:"ferguson",name:"Ferguson",zip:"63135",tag:"North County",url:"ferguson.html",group:"North County"},
  {id:"hazelwood",name:"Hazelwood",zip:"63042",tag:"North County",url:"hazelwood.html",group:"North County"},
  {id:"jennings",name:"Jennings",zip:"63136",tag:"North County",url:"jennings.html",group:"North County"},
  {id:"spanish-lake",name:"Spanish Lake",zip:"63138",tag:"North County",url:"spanish-lake.html",group:"North County"},
  {id:"riverview",name:"Riverview",zip:"63137",tag:"North County",url:"riverview.html",group:"North County"},
  {id:"berkeley",name:"Berkeley",zip:"63134",tag:"North County",url:"berkeley.html",group:"North County"},
  {id:"bridgeton",name:"Bridgeton",zip:"63044",tag:"North County",url:"bridgeton.html",group:"North County"},
  {id:"st-ann",name:"St. Ann",zip:"63074",tag:"North County",url:"st-ann.html",group:"North County"},
  {id:"st-john",name:"St. John",zip:"63114",tag:"North County",url:"st-john.html",group:"North County"},
  {id:"normandy",name:"Normandy",zip:"63121",tag:"North County",url:"normandy.html",group:"North County"},
  {id:"black-jack",name:"Black Jack",zip:"63033",tag:"North County",url:"black-jack.html",group:"North County"},
  {id:"dellwood",name:"Dellwood",zip:"63135",tag:"North County",url:"dellwood.html",group:"North County"},
  {id:"moline-acres",name:"Moline Acres",zip:"63136",tag:"North County",url:"moline-acres.html",group:"North County"},
  {id:"cool-valley",name:"Cool Valley",zip:"63121",tag:"North County",url:"cool-valley.html",group:"North County"},
  {id:"pagedale",name:"Pagedale",zip:"63133",tag:"North County",url:"pagedale.html",group:"North County"},
  {id:"wellston",name:"Wellston",zip:"63133",tag:"North County",url:"wellston.html",group:"North County"},
  {id:"pine-lawn",name:"Pine Lawn",zip:"63120",tag:"North County",url:"pine-lawn.html",group:"North County"},
  {id:"bel-nor",name:"Bel-Nor",zip:"63121",tag:"North County",url:"bel-nor.html",group:"North County"},
  {id:"bel-ridge",name:"Bel-Ridge",zip:"63121",tag:"North County",url:"bel-ridge.html",group:"North County"},
  {id:"bellefontaine-neighbors",name:"Bellefontaine Neighbors",zip:"63137",tag:"North County",url:"bellefontaine-neighbors.html",group:"North County"},
  {id:"calverton-park",name:"Calverton Park",zip:"63033",tag:"North County",url:"calverton-park.html",group:"North County"},
  {id:"castle-point",name:"Castle Point",zip:"63136",tag:"North County",url:"castle-point.html",group:"North County"},
  {id:"country-club-hills",name:"Country Club Hills",zip:"63136",tag:"North County",url:"country-club-hills.html",group:"North County"},
  {id:"edmundson",name:"Edmundson",zip:"63134",tag:"North County",url:"edmundson.html",group:"North County"},
  {id:"flordell-hills",name:"Flordell Hills",zip:"63136",tag:"North County",url:"flordell-hills.html",group:"North County"},
  {id:"glen-echo-park",name:"Glen Echo Park",zip:"63136",tag:"North County",url:"glen-echo-park.html",group:"North County"},
  {id:"greendale",name:"Greendale",zip:"63136",tag:"North County",url:"greendale.html",group:"North County"},
  {id:"hanley-hills",name:"Hanley Hills",zip:"63133",tag:"North County",url:"hanley-hills.html",group:"North County"},
  {id:"hillsdale",name:"Hillsdale",zip:"63121",tag:"North County",url:"hillsdale.html",group:"North County"},
  {id:"norwood-court",name:"Norwood Court",zip:"63121",tag:"North County",url:"norwood-court.html",group:"North County"},
  {id:"northwoods",name:"Northwoods",zip:"63121",tag:"North County",url:"northwoods.html",group:"North County"},
  {id:"olympian-village",name:"Olympian Village",zip:"63121",tag:"North County",url:"olympian-village.html",group:"North County"},
  {id:"parkdale",name:"Parkdale",zip:"63121",tag:"North County",url:"parkdale.html",group:"North County"},
  {id:"pasadena-hills",name:"Pasadena Hills",zip:"63121",tag:"North County",url:"pasadena-hills.html",group:"North County"},
  {id:"pasadena-park",name:"Pasadena Park",zip:"63121",tag:"North County",url:"pasadena-park.html",group:"North County"},
  {id:"peaceful-village",name:"Peaceful Village",zip:"63136",tag:"North County",url:"peaceful-village.html",group:"North County"},
  {id:"scotsdale",name:"Scotsdale",zip:"63033",tag:"North County",url:"scotsdale.html",group:"North County"},
  {id:"sycamore-hills",name:"Sycamore Hills",zip:"63114",tag:"North County",url:"sycamore-hills.html",group:"North County"},
  {id:"uplands-park",name:"Uplands Park",zip:"63121",tag:"North County",url:"uplands-park.html",group:"North County"},
  {id:"velda-city",name:"Velda City",zip:"63121",tag:"North County",url:"velda-city.html",group:"North County"},
  {id:"velda-village-hills",name:"Velda Village Hills",zip:"63121",tag:"North County",url:"velda-village-hills.html",group:"North County"},
  {id:"vinita-park",name:"Vinita Park",zip:"63114",tag:"North County",url:"vinita-park.html",group:"North County"},
  {id:"vinita-terrace",name:"Vinita Terrace",zip:"63121",tag:"North County",url:"vinita-terrace.html",group:"North County"},
  {id:"woodson-terrace",name:"Woodson Terrace",zip:"63134",tag:"North County",url:"woodson-terrace.html",group:"North County"},
  {id:"charlack",name:"Charlack",zip:"63114",tag:"North County",url:"charlack.html",group:"North County"},
  {id:"champ",name:"Champ",zip:"63114",tag:"North County",url:"champ.html",group:"North County"},
  {id:"breckenridge-hills",name:"Breckenridge Hills",zip:"63114",tag:"North County",url:"breckenridge-hills.html",group:"North County"},
  {id:"bellerive-acres",name:"Bellerive Acres",zip:"63121",tag:"North County",url:"bellerive-acres.html",group:"North County"},
  {id:"beverly-hills",name:"Beverly Hills",zip:"63121",tag:"North County",url:"beverly-hills.html",group:"North County"},
  {id:"normandy-park",name:"Normandy Park",zip:"63121",tag:"North County",url:"normandy-park.html",group:"North County"},
  {id:"affton",name:"Affton",zip:"63123",tag:"South County",url:"affton.html",group:"South County"},
  {id:"concord",name:"Concord",zip:"63128 \u00b7 63123",tag:"South County",url:"concord.html",group:"South County"},
  {id:"crestwood",name:"Crestwood",zip:"63126",tag:"South County",url:"crestwood.html",group:"South County"},
  {id:"green-park",name:"Green Park",zip:"63123",tag:"South County",url:"green-park.html",group:"South County"},
  {id:"lemay",name:"Lemay",zip:"63125",tag:"South County",url:"lemay.html",group:"South County"},
  {id:"mehlville",name:"Mehlville",zip:"63125",tag:"South County",url:"mehlville.html",group:"South County"},
  {id:"oakville",name:"Oakville",zip:"63129",tag:"South County",url:"oakville.html",group:"South County"},
  {id:"sappington",name:"Sappington",zip:"63126 \u00b7 63128",tag:"South County",url:"sappington.html",group:"South County"},
  {id:"sunset-hills",name:"Sunset Hills",zip:"63127",tag:"South County",url:"sunset-hills.html",group:"South County"},
  {id:"ballwin",name:"Ballwin",zip:"63011 \u00b7 63021",tag:"West County",url:"ballwin.html",group:"West County"},
  {id:"chesterfield",name:"Chesterfield",zip:"63005 \u00b7 63017 \u00b7 63141",tag:"West County",url:"chesterfield.html",group:"West County"},
  {id:"st-charles",name:"St. Charles",zip:"63301 \u00b7 63303 \u00b7 63304",tag:"St. Charles Co.",url:"st-charles.html",group:"St. Charles County"},
  {id:"o-fallon",name:"O'Fallon",zip:"63366 \u00b7 63368",tag:"St. Charles Co.",url:"o-fallon.html",group:"St. Charles County"},
  {id:"st-peters",name:"St. Peters",zip:"63376",tag:"St. Charles Co.",url:"st-peters.html",group:"St. Charles County"},
  {id:"wentzville",name:"Wentzville",zip:"63385",tag:"St. Charles Co.",url:"wentzville.html",group:"St. Charles County"},
  {id:"lake-st-louis",name:"Lake St. Louis",zip:"63367",tag:"St. Charles Co.",url:"lake-st-louis.html",group:"St. Charles County"},
  {id:"cottleville",name:"Cottleville",zip:"63304",tag:"St. Charles Co.",url:"cottleville.html",group:"St. Charles County"},
  {id:"dardenne-prairie",name:"Dardenne Prairie",zip:"63368",tag:"St. Charles Co.",url:"dardenne-prairie.html",group:"St. Charles County"},
  {id:"weldon-spring",name:"Weldon Spring",zip:"63304",tag:"St. Charles Co.",url:"weldon-spring.html",group:"St. Charles County"},
  {id:"weldon-spring-heights",name:"Weldon Spring Heights",zip:"63304",tag:"St. Charles Co.",url:"weldon-spring-heights.html",group:"St. Charles County"},
  {id:"josephville",name:"Josephville",zip:"63301",tag:"St. Charles Co.",url:"josephville.html",group:"St. Charles County"},
  {id:"st-paul",name:"St. Paul",zip:"63366",tag:"St. Charles Co.",url:"st-paul.html",group:"St. Charles County"},
  {id:"west-alton",name:"West Alton",zip:"63386",tag:"St. Charles Co.",url:"west-alton.html",group:"St. Charles County"},
  {id:"arnold",name:"Arnold",zip:"63010",tag:"Jefferson Co.",url:"arnold.html",group:"Jefferson County"},
  {id:"festus",name:"Festus",zip:"63028",tag:"Jefferson Co.",url:"festus.html",group:"Jefferson County"},
  {id:"crystal-city",name:"Crystal City",zip:"63019",tag:"Jefferson Co.",url:"crystal-city.html",group:"Jefferson County"},
  {id:"de-soto",name:"De Soto",zip:"63020",tag:"Jefferson Co.",url:"de-soto.html",group:"Jefferson County"},
  {id:"imperial",name:"Imperial",zip:"63052",tag:"Jefferson Co.",url:"imperial.html",group:"Jefferson County"},
  {id:"high-ridge",name:"High Ridge",zip:"63049",tag:"Jefferson Co.",url:"high-ridge.html",group:"Jefferson County"},
  {id:"hillsboro",name:"Hillsboro",zip:"63050",tag:"Jefferson Co.",url:"hillsboro.html",group:"Jefferson County"},
  {id:"house-springs",name:"House Springs",zip:"63051",tag:"Jefferson Co.",url:"house-springs.html",group:"Jefferson County"},
  {id:"barnhart",name:"Barnhart",zip:"63012",tag:"Jefferson Co.",url:"barnhart.html",group:"Jefferson County"},
  {id:"cedar-hill",name:"Cedar Hill",zip:"63016",tag:"Jefferson Co.",url:"cedar-hill.html",group:"Jefferson County"}
];

var groups = [
  {label:"St. Louis City",ids:["central-west-end", "tower-grove-south", "shaw", "dogtown", "soulard", "lafayette-square", "the-hill", "benton-park", "st-louis-hills"]},
  {label:"Central Corridor",ids:["kirkwood", "webster-groves", "clayton", "university-city", "maplewood"]},
  {label:"North County",ids:["florissant", "ferguson", "hazelwood", "jennings", "spanish-lake", "riverview", "berkeley", "bridgeton", "st-ann", "st-john", "normandy", "black-jack", "dellwood", "moline-acres", "cool-valley", "pagedale", "wellston", "pine-lawn", "bel-nor", "bel-ridge", "bellefontaine-neighbors", "calverton-park", "castle-point", "country-club-hills", "edmundson", "flordell-hills", "glen-echo-park", "greendale", "hanley-hills", "hillsdale", "norwood-court", "northwoods", "olympian-village", "parkdale", "pasadena-hills", "pasadena-park", "peaceful-village", "scotsdale", "sycamore-hills", "uplands-park", "velda-city", "velda-village-hills", "vinita-park", "vinita-terrace", "woodson-terrace", "charlack", "champ", "breckenridge-hills", "bellerive-acres", "beverly-hills", "normandy-park"]},
  {label:"South County",ids:["affton", "concord", "crestwood", "green-park", "lemay", "mehlville", "oakville", "sappington", "sunset-hills"]},
  {label:"West County",ids:["ballwin", "chesterfield"]},
  {label:"St. Charles County",ids:["st-charles", "o-fallon", "st-peters", "wentzville", "lake-st-louis", "cottleville", "dardenne-prairie", "weldon-spring", "weldon-spring-heights", "josephville", "st-paul", "west-alton"]},
  {label:"Jefferson County",ids:["arnold", "festus", "crystal-city", "de-soto", "imperial", "high-ridge", "hillsboro", "house-springs", "barnhart", "cedar-hill"]}
];

var byId = {};
hoods.forEach(function(h) { byId[h.id] = h; });

var total = hoods.length;

/* Stats strip */
var html =
  '<div class="tool-data-strip" style="margin:12px 16px 0;">' +
    '<div class="tool-data-stat"><div class="tool-data-num">' + total + '</div><div class="tool-data-lbl">Neighborhoods</div></div>' +
    '<div class="tool-data-stat"><div class="tool-data-num">79</div><div class="tool-data-lbl">ZIP Codes</div></div>' +
    '<div class="tool-data-stat"><div class="tool-data-num">2025\u201326</div><div class="tool-data-lbl">MARIS Data</div></div>' +
  '</div>' +
  '<div style="padding:8px 16px 4px;font-size:9px;color:var(--text-dim);letter-spacing:.08em;">Tap a region to expand</div>';

/* Accordion groups */
groups.forEach(function(grp) {
  var members = grp.ids.filter(function(id) { return byId[id]; });
  if (!members.length) return;

  var count = members.length;
  var cards = members.map(function(id) {
    var h = byId[id];
    return (
      '<div class="tool-card" data-hood-url="' + h.url + '" style="border-radius:0;border-left:none;border-right:none;border-top:none;">' +
        '<div class="tool-card-copy">' +
          '<div class="tool-card-title">' + h.name + '</div>' +
          '<div class="tool-card-sub">' + h.tag + ' \u00b7 ' + h.zip + '</div>' +
        '</div>' +
        '<div class="tool-card-arr">\u203a</div>' +
      '</div>'
    );
  }).join('');

  html +=
    '<div class="res-drawer" id="hood-grp-' + grp.label.replace(/[^a-z]/gi,'-').toLowerCase() + '">' +
      '<button class="res-drawer-trigger" type="button" style="padding:11px 16px;">' +
        '<div class="res-drawer-copy">' +
          '<div class="res-drawer-title" style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">' +
            grp.label +
          '</div>' +
          '<div class="res-drawer-summary">' + count + ' neighborhood' + (count !== 1 ? 's' : '') + '</div>' +
        '</div>' +
        '<div class="res-drawer-chevron">\u203a</div>' +
      '</button>' +
      '<div class="res-drawer-body" style="padding:0;">' +
        '<div class="res-drawer-content" style="padding:0;">' +
          cards +
        '</div>' +
      '</div>' +
    '</div>';
});

return html;
```

}

function _buildGuidesPanelHTML() {
var series = [
{
label: “The Truth About Zillow”,
tag: “Buyers & Sellers”,
articles: [
{ title: “The Truth About Zillow in St. Louis”, url: “articles/truth-about-zillow-stl.html” },
{ title: “How Zillow’s Pay-to-Play System Works”, url: “articles/zillow-pay-to-play-system.html” },
{ title: “What Happens the Moment You Click on Zillow”, url: “articles/what-happens-when-you-click-zillow.html” },
{ title: “Is the Zillow Zestimate Accurate in St. Louis?”, url: “articles/zillow-zestimate-accurate-stl.html” },
{ title: “How to Use Zillow Without Getting Used by Zillow”, url: “articles/how-to-use-zillow-without-getting-used.html” }
]
},
{
label: “St. Louis Affordability by Zip Code”,
tag: “Buyers”,
articles: [
{ title: “St. Louis Home Affordability by Zip Code”, url: “articles/stl-affordability-by-zip-code.html” },
{ title: “How Much Income Do You Need to Buy a Home in St. Louis?”, url: “articles/how-much-income-to-buy-home-stl.html” },
{ title: “Renting vs. Buying in St. Louis: What the Numbers Show”, url: “articles/renting-vs-buying-stl.html” },
{ title: “First-Time Buyer Programs in St. Louis”, url: “articles/first-time-buyer-programs-stl.html” },
{ title: “Most Affordable Zip Codes in St. Louis (2026)”, url: “articles/most-affordable-zip-codes-stl-2026.html” }
]
},
{
label: “St. Louis Home Repair Cost Guide”,
tag: “Buyers”,
articles: [
{ title: “Home Repair Cost Guide for Buyers”, url: “articles/stl-home-repair-cost-guide.html” },
{ title: “Walkthrough Checklist: What to Look For”, url: “articles/what-to-look-for-buying-house-stl.html” },
{ title: “How Repair Costs Should Affect Your Offer”, url: “articles/repair-costs-affect-offer-price-stl.html” },
{ title: “What Happens at a Home Inspection in St. Louis”, url: “articles/home-inspection-st-louis.html” }
]
}
];

```
var html =
  '<div style="padding:14px 16px 6px;display:flex;align-items:center;justify-content:space-between;">' +
    '<div style="font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);">St. Louis Guides</div>' +
    '<a href="articles/index.html" style="font-size:10px;color:var(--text-dim);text-decoration:none;border:1px solid var(--line-2);padding:4px 10px;border-radius:999px;">View All \u203a</a>' +
  '</div>';

series.forEach(function(s) {
  var items = s.articles.map(function(a) {
    return (
      '<div class="tool-card" onclick="window.location.href=\'' + a.url + '\'" style="border-radius:0;border-left:none;border-right:none;border-top:none;cursor:pointer;">' +
        '<div class="tool-card-copy">' +
          '<div class="tool-card-title" style="font-size:13px;">' + a.title + '</div>' +
        '</div>' +
        '<div class="tool-card-arr">\u203a</div>' +
      '</div>'
    );
  }).join('');

  html +=
    '<div class="res-drawer">' +
      '<button class="res-drawer-trigger" type="button" style="padding:11px 16px;">' +
        '<div class="res-drawer-copy">' +
          '<div class="res-drawer-title" style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">' + s.label + '</div>' +
          '<div class="res-drawer-summary">' + s.tag + ' \u00b7 ' + s.articles.length + ' guides</div>' +
        '</div>' +
        '<div class="res-drawer-chevron">\u203a</div>' +
      '</button>' +
      '<div class="res-drawer-body" style="padding:0;">' +
        '<div class="res-drawer-content" style="padding:0;">' + items + '</div>' +
      '</div>' +
    '</div>';
});

return html;
```

}

function _buildJourneyPanelHTML(chNum) {
var visited = Array.isArray(state.chaptersVisited) ? state.chaptersVisited : [];

```
/* ── FEATURED: WALK WITH ME ── */
var walkCard =
  '<div class="journey-panel-item" id="walk-with-me-card" data-file="03-interior.html" data-ch="3" style="' +
    'background:rgba(255,204,77,.05);' +
    'border-bottom:1px solid var(--gold-line);' +
    'border-top:1px solid var(--gold-line);' +
    'margin-bottom:4px;' +
  '">' +
    '<div class="ji-dot" style="background:var(--gold);box-shadow:0 0 6px rgba(255,204,77,.5);"></div>' +
    '<div class="ji-icon" style="color:var(--gold);">' + renderIcon("house") + '</div>' +
    '<div class="ji-lbl" style="color:var(--text-strong);">' +
      '<span style="display:block;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:2px;">Walk With Me</span>' +
      'I don\u2019t walk homes like other agents. Pick your property type.' +
    '</div>' +
    '<div class="ji-arr" style="color:var(--gold);">\u203a</div>' +
  '</div>';

var items = APP_CONFIG.chapters.filter(function (ch) {
  return ch.ch < 100; /* exclude resource library chapters from main journey list */
}).map(function (ch) {
  var isCurrent = ch.ch === chNum;
  var isVisited = visited.indexOf(ch.ch) !== -1 && !isCurrent;
  return (
    '<div class="journey-panel-item' + (isCurrent ? ' cur-ch' : '') + '" data-file="' + ch.file + '" data-ch="' + ch.ch + '">' +
      '<div class="ji-dot' + (isCurrent ? ' cur' : isVisited ? ' vis' : '') + '"></div>' +
      '<div class="ji-icon">' + renderIcon(ch.icon || "house") + '</div>' +
      '<div class="ji-lbl">' + ch.label + (isCurrent ? ' &larr; Here' : '') + '</div>' +
      '<div class="ji-arr">' + (isCurrent ? '' : '›') + '</div>' +
    '</div>'
  );
}).join("");

return '<div class="journey-panel">' + walkCard + items +
  '<div style="border-top:1px solid var(--line);margin:8px 0 4px;padding:8px 14px 0;font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text-faint);">Tools</div>' +
  '<div class="journey-panel-item" data-file="home-cost-demo.html" data-ch="101">' +
    '<div class="ji-dot"></div>' +
    '<div class="ji-icon">' + renderIcon("house") + '</div>' +
    '<div class="ji-lbl">How to: STL Home Cost Survival Guide</div>' +
    '<div class="ji-arr">›</div>' +
  '</div>' +
'</div>';
```

}

/* ============================================================
TOOL SLIDE PANEL
============================================================ */

var _toolPanelEl    = null;
var _toolModuleActive = null;

var TOOL_CHAPTER_REENTRY = {
“prep”:      { 2: “Check zip code market data before setting your budget”,      4: “Run market data on the zip before making your offer” },
“afford”:    { 1: “See what your budget buys before preapproval”,               2: “Map your budget across all 79 St. Louis zip codes” },
“home-cost”: { 3: “Flag issues you see during the showing”,                     7: “Review repair costs against the inspection report” },
“compare”:   { 4: “Compare this property to alternatives before your offer”,    5: “Verify your choice before you pass inspection deadlines” },
“fails”:     { 3: “Know the common failure points before you walk the property”, 7: “Cross-reference inspection findings with common failures” }
};

function openToolPanel(toolId) {
/* Write origin to state */
state.toolOrigin = {
toolId:  toolId,
chapter: getChapterNumber ? getChapterNumber() : 0,
scene:   typeof currentSceneIndex !== “undefined” ? currentSceneIndex : 0,
file:    window.location.pathname.split(”/”).pop() || “index.html”
};
saveState();

```
/* Create panel if needed */
if (!_toolPanelEl) {
  _toolPanelEl = document.createElement("div");
  _toolPanelEl.id        = "tool-panel";
  _toolPanelEl.className = "tool-panel";
  document.body.appendChild(_toolPanelEl);
}

var toolTitles = {
  "prep":      "STL Open House Prep",
  "afford":    "STL Affordability Map",
  "home-cost": "STL Home Cost Survival Guide",
  "compare":   "Compare STL Properties",
  "fails":     "STL Common Home Failures",
  "neighborhood-matcher": "STL Neighborhood Matcher"
};

/* Tool URL map — each tool is a standalone HTML page loaded in an iframe */
var toolUrls = {
  "prep":      "prep.html",
  "afford":    "afford.html",
  "home-cost": "home-cost.html",
  "compare":   "compare.html",
  "fails":     "fails.html",
  "neighborhood-matcher": "neighborhood-matcher.html"
};
var toolUrl = toolUrls[toolId] || (toolId + ".html");

_toolPanelEl.innerHTML =
  '<div class="tool-panel-header">' +
    '<div class="tool-panel-title">' + (toolTitles[toolId] || "Tool") + '</div>' +
    '<button class="tool-panel-close" id="tool-panel-close" type="button">&#10005;</button>' +
  '</div>' +
  '<iframe id="tool-iframe" src="' + toolUrl + '" ' +
    'style="flex:1;width:100%;height:100%;border:none;background:#050505;display:block;overflow:auto;"' +
    'allow="geolocation" loading="lazy"></iframe>' +
  '<div class="tool-exit-card" id="tool-exit-card"></div>';

safelyBind(byId("tool-panel-close"), "click", closeToolPanel);

_toolModuleActive = toolId;

requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    _toolPanelEl.classList.add("open");
  });
});

track("tool_open", { tool: toolId });
```

}

function _showExitCard(toolId) {
var origin  = state.toolOrigin || {};
var chNum   = origin.chapter   || 0;
var reentry = (TOOL_CHAPTER_REENTRY[toolId] || {})[chNum];
var exitCard = byId(“tool-exit-card”);
if (!exitCard) { closeToolPanel(); return; }

```
var chLabel = "";
APP_CONFIG.chapters.forEach(function (ch) {
  if (ch.ch === chNum) chLabel = "Ch." + chNum + " — " + ch.label;
});

var context = reentry || (chLabel ? "You were in " + chLabel : "Ready to continue your journey?");

var optionHTML = "";
if (chNum > 0 && origin.file) {
  optionHTML +=
    '<button class="tool-exit-btn primary" id="exit-return" type="button">' +
      (chLabel ? "Return to " + chLabel : "Return to Journey") +
    '</button>';
}
optionHTML +=
  '<button class="tool-exit-btn" id="exit-stay" type="button">Keep Using This Tool</button>' +
  '<button class="tool-exit-btn" id="exit-home" type="button">Go to Journey Home</button>';

exitCard.innerHTML =
  '<div class="tool-exit-label">Where To Next?</div>' +
  '<div class="tool-exit-context">' + context + '</div>' +
  '<div class="tool-exit-options">' + optionHTML + '</div>';

safelyBind(byId("exit-return"), "click", function () {
  closeToolPanel();
  if (origin.file) window.location.href = origin.file;
});
safelyBind(byId("exit-stay"), "click", function () {
  exitCard.classList.remove("open");
});
safelyBind(byId("exit-home"), "click", function () {
  closeToolPanel();
  window.location.href = "index.html";
});

requestAnimationFrame(function () {
  requestAnimationFrame(function () { exitCard.classList.add("open"); });
});
```

}

function openNeighborhoodPanel(url, title) {
/* Reuse the exact tool panel mechanism — iframe + X + slide.
After the panel fully opens, post a message to the iframe so
neighborhoods-init.js can call map.invalidateSize(). */

```
/* Create panel element if needed (same singleton as tool panel) */
if (!_toolPanelEl) {
  _toolPanelEl = document.createElement("div");
  _toolPanelEl.id        = "tool-panel";
  _toolPanelEl.className = "tool-panel";
  document.body.appendChild(_toolPanelEl);
}

_toolPanelEl.innerHTML =
  '<div class="tool-panel-header">' +
    '<div class="tool-panel-title">' + (title || "Neighborhood") + '</div>' +
    '<button class="tool-panel-close" id="tool-panel-close" type="button">&#10005;</button>' +
  '</div>' +
  '<iframe id="tool-iframe" src="' + url + '" ' +
    'style="flex:1;width:100%;height:100%;border:none;background:#050505;display:block;overflow:auto;"' +
    'allow="geolocation" loading="lazy"></iframe>';

safelyBind(byId("tool-panel-close"), "click", closeToolPanel);

_toolModuleActive = "neighborhood";

/* Open panel with slide animation */
requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    _toolPanelEl.classList.add("open");

    /* After transition completes (~400ms), tell the iframe to refit its map.
       neighborhoods-init.js listens for { hoodPanelReady: true } */
    setTimeout(function () {
      var iframe = byId("tool-iframe");
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage({ hoodPanelReady: true }, "*");
        } catch (e) {}
      }
    }, 420);
  });
});

track("neighborhood_open", { url: url });
```

}

function closeToolPanel() {
if (_toolPanelEl) {
_toolPanelEl.classList.remove(“open”);
/* Clear iframe src to stop the page running in background */
var iframe = byId(“tool-iframe”);
if (iframe) iframe.src = “about:blank”;
}
_toolModuleActive = null;
/* Signal any injected Leaflet maps (e.g. neighborhoods-init.js) to destroy */
if (typeof window._hoodMapDestroy === “function”) {
window._hoodMapDestroy();
window._hoodMapDestroy = null;
}
}

/* ============================================================
PAGE TRACKING
============================================================ */

function trackPage(chapterId, sceneId) {
state.lastPage    = window.location.pathname.split(”/”).pop() || “index.html”;
state.lastChapter = chapterId || getChapterNumber();
if (sceneId !== undefined) state.lastStep = sceneId;
saveState();
}

/* ============================================================
INIT
============================================================ */

function init() {
/* Expose global API immediately so index.html can call it pre-scene */
window.SharedPlatform = {
icons:                   ICONS,
renderIcon:              renderIcon,
renderIconCardGrid:      renderIconCardGrid,
renderJourneyCardList:   renderJourneyCardList,
createJourneyCardHTML:   createJourneyCardHTML,
handleJourneyCardClick:  handleJourneyCardClick,
collapseJourneySiblings: collapseJourneySiblings,
jumpTo:                  jumpTo,
openGeorgeCard:          openGeorgeCard,
closePop:                closePop,
showDeep:                showDeep,
openDrawer:              openDrawer,
closeDrawer:             closeDrawer,
dismissInterrupt:        dismissInterrupt,
setGeorgeState:          setGeorgeState,
activateSpotlight:       activateSpotlight,
renderSceneChips:        renderSceneChips,
renderSceneCues:         renderSceneCues,
getState:                getState,
saveState:               saveState,
track:                   track,
georgeFace:              georgeFace,
loadGeorgeImage:         loadGeorgeImage,
renderScene:             renderScene,
/* Dashboard */
renderDashboard:         renderDashboard,
openDashboard:           openDashboard,
closeDashboard:          closeDashboard,
/* Tool panel */
openToolPanel:              openToolPanel,
closeToolPanel:             closeToolPanel,
openNeighborhoodPanel:      openNeighborhoodPanel,
/* Resources */
/* (registry read from window.RESOURCES_REGISTRY set by resources.js) */
/* Page tracking */
trackPage:               trackPage,
/* ZIP data & calculations — exposed for tool modules */
zipData:                 function () { return window.ZIP_DATA || {}; },
calcPI:                  function (loan, rate) { return window.STL_CALC ? window.STL_CALC.calcPI(loan, rate) : 0; },
calcTrueMonthly:         function (p, d, r, z)  { return window.STL_CALC ? window.STL_CALC.calcTrueMonthly(p, d, r, z) : {}; },
calcMaxPrice:            function (pmt, d, r, db){ return window.STL_CALC ? window.STL_CALC.calcMaxPrice(pmt, d, r, db) : 0; },
getTierPrice:            function (data, cond)   { return window.STL_CALC ? window.STL_CALC.getTierPrice(data, cond) : 0; },
getValueFlag:            function (data, zip)    { return window.STL_CALC ? window.STL_CALC.getValueFlag(data, zip) : {}; },
searchZips:              function (q)            { return window.STL_CALC ? window.STL_CALC.searchZips(q) : []; },
heatColor:               function (t)            { return window.STL_CALC ? window.STL_CALC.heatColor(t) : “#ffcc4d”; }
};

```
var scenes = getScenes();

/* Build shell first so .app exists before dash-bar tries to inject into it */
if (scenes.length) {
  ensureShell();
}

/* Render dashboard on every page — must run after ensureShell so .app exists */
/* Suppressed when a tool page is loaded inside a demo iframe */
if (!window.SUPPRESS_DASHBOARD) {
  renderDashboard();
}

if (!scenes.length) return;   /* index.html has no SCENES — it manages its own rendering */
bindShellEvents();
trackPage(getChapterNumber(), 0);

currentSceneIndex = Math.min(
  state.lastChapter === getChapterNumber() ? (state.lastStep || 0) : 0,
  scenes.length - 1
);

renderScene(currentSceneIndex);
```

}

/* ============================================================
VIDEO FLOAT SYSTEM
Replaces the George image with an inline YouTube bubble
when scene.video is set. Restores George image on teardown.
============================================================ */

var _ytPlayer      = null;
var _ytReady       = false;
var _ytPending     = null;   /* video ID waiting for API */
var _ytApiLoaded   = false;

/* YouTube IFrame API callback — must be on window */
window.onYouTubeIframeAPIReady = function () {
_ytReady = true;
if (_ytPending) {
_initYTPlayer(_ytPending);
_ytPending = null;
}
};

function _loadYTApi() {
if (_ytApiLoaded) return;
_ytApiLoaded = true;
var s = document.createElement(“script”);
s.src = “https://www.youtube.com/iframe_api”;
document.head.appendChild(s);
}

function _renderVideoFloat(videoId, georgeFaceName) {
var gfWrap = byId(“gf-wrap”);
var georgeImg = byId(“george-img”);
if (!gfWrap) return;

```
/* Hide existing George image — bubble takes its place */
if (georgeImg) georgeImg.style.display = "none";

/* Avoid re-rendering if same video already showing */
if (byId("gf-video-bubble") && gfWrap._currentVideoId === videoId) return;

/* Remove any existing bubble */
_destroyVideoFloat(true);

/* Build bubble container */
var bubble = document.createElement("div");
bubble.className = "gf-video-bubble";
bubble.id = "gf-video-bubble";

/* Thumbnail — uses current George face as placeholder
   until chapter author swaps it for a real thumbnail via scene.videoThumb */
var thumb = document.createElement("img");
thumb.className = "gf-video-thumb";
thumb.id = "gf-video-thumb";
thumb.src = georgeFace(georgeFaceName || "serious");
thumb.alt = "George Kindler";
bubble.appendChild(thumb);

/* iframe mount point */
var frameWrap = document.createElement("div");
frameWrap.className = "gf-video-frame";
frameWrap.id = "gf-video-frame";
bubble.appendChild(frameWrap);

gfWrap.appendChild(bubble);
gfWrap._currentVideoId = videoId;

/* Play button below george-float */
var playRow = document.createElement("div");
playRow.className = "gf-video-play";
playRow.id = "gf-video-play";
playRow.innerHTML =
  '<button type="button">' +
  '<svg viewBox="0 0 10 10" fill="none"><path d="M2 1l7 4-7 4V1Z" fill="currentColor"/></svg>' +
  'Watch' +
  '</button>';

var georgeFloat = byId("george-float");
if (georgeFloat) georgeFloat.appendChild(playRow);

/* Tap handlers — bubble or play button starts video */
function onPlayTap() {
  _loadYTApi();
  if (_ytReady) {
    _initYTPlayer(videoId);
  } else {
    _ytPending = videoId;
  }
}

bubble.addEventListener("click", onPlayTap);
var playBtn = playRow.querySelector("button");
if (playBtn) playBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  onPlayTap();
});
```

}

function _initYTPlayer(videoId) {
var frameWrap = byId(“gf-video-frame”);
var thumb = byId(“gf-video-thumb”);
if (!frameWrap || _ytPlayer) return;

```
/* Hide thumbnail */
if (thumb) thumb.classList.add("gf-thumb-hidden");

/* Create player div */
var div = document.createElement("div");
div.id = "gf-yt-player";
frameWrap.appendChild(div);

_ytPlayer = new YT.Player("gf-yt-player", {
  videoId: videoId,
  playerVars: {
    autoplay:       1,
    controls:       0,
    modestbranding: 1,
    rel:            0,
    playsinline:    1,
    mute:           0
  },
  events: {
    onStateChange: function (e) {
      if (e.data === YT.PlayerState.ENDED) {
        /* Restore thumbnail on end */
        var t = byId("gf-video-thumb");
        if (t) t.classList.remove("gf-thumb-hidden");
        _ytPlayer = null;
      }
    }
  }
});
```

}

function _destroyVideoFloat(keepGeorgeHidden) {
/* Stop and destroy player */
if (_ytPlayer) {
try { _ytPlayer.stopVideo(); } catch (e) {}
_ytPlayer = null;
}
_ytPending = null;

```
/* Remove bubble and play button */
var bubble  = byId("gf-video-bubble");
var playRow = byId("gf-video-play");
if (bubble)  bubble.remove();
if (playRow) playRow.remove();

/* Restore George image unless caller wants it hidden */
if (!keepGeorgeHidden) {
  var georgeImg = byId("george-img");
  if (georgeImg) georgeImg.style.display = "block";
}

var gfWrap = byId("gf-wrap");
if (gfWrap) gfWrap._currentVideoId = null;
```

}

if (document.readyState === “loading”) {
document.addEventListener(“DOMContentLoaded”, init);
} else {
init();
}

})();
