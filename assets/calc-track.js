/* Site-wide GA4 tracking helpers, loaded on every page after site-search.js.

   1. calc_use: one event the first time a visitor changes an input in each
      calculator or tool on a page. tool = the nearest container id.

   2. outbound_click: one event each time a visitor clicks a link that leaves
      stlhomejourney.com. Replaces GA4's automatic "click" event (turn off
      Enhanced measurement > Outbound clicks so nothing counts twice).
      Parameters:
        destination  plain-English name of where they went ("City of Webster Groves")
        link_domain  the site they went to (webstergrovesmo.gov)
        link_url     the full link
        link_text    the words they clicked
        page         the page they left from
      New places get a readable name by adding a line to DESTINATIONS. */
(function () {
  'use strict';
  // The tool drawer re-runs this script when it loads a tool; listen once.
  if (window.__stlhjTrack) return;
  window.__stlhjTrack = 1;

  function send(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  /* ---------- 1. calc_use ---------- */
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
    send('calc_use', { tool: tool, page: location.pathname });
  }
  document.addEventListener('input', onUse, true);
  document.addEventListener('change', onUse, true);

  /* ---------- 2. outbound_click ---------- */
  // [host pattern, path pattern or null, readable name]. First match wins.
  var DESTINATIONS = [
    [/stlouiscountymo\.gov$/, /ordinance-guidebook/i, 'St. Louis County subdivision ordinance guidebook'],
    [/stlouiscountymo\.gov$/, /occupancy/i, 'St. Louis County occupancy permits'],
    [/stlouiscountymo\.gov$/, /permit/i, 'St. Louis County building permits'],
    [/^gis\.stlouiscountymo\.gov$/, null, 'St. Louis County parcel map (GIS)'],
    [/stlouiscountymo\.gov$/, /revenue|collector|tax/i, 'St. Louis County property tax'],
    [/stlouiscountymo\.gov$/, null, 'St. Louis County government'],
    [/accela\.com$/, /SLC/i, 'St. Louis County permit portal'],
    [/jeffcomo\.gov$/, null, 'Jefferson County government'],
    [/dese\.mo\.gov$/, null, 'Missouri DESE school data'],
    [/greatschools\.org$/, null, 'GreatSchools'],
    [/rsdmo\.org$/, null, 'Rockwood School District'],
    [/parkwayschools\.net$/, null, 'Parkway School District'],
    [/ecode360\.com$/, null, 'City ordinances (eCode360)'],
    [/webstergrovesmo\.gov$/, null, 'City of Webster Groves'],
    [/sunset-hills\.com$/, null, 'City of Sunset Hills'],
    [/cityofcrestwood\.org$/, null, 'City of Crestwood'],
    [/chesterfield\.mo\.us$/, null, 'City of Chesterfield'],
    [/shrewsburymo\.gov$/, null, 'City of Shrewsbury'],
    [/lakeshiremo\.gov$/, null, 'City of Lakeshire'],
    [/grantwoodvillage\.org$/, null, 'Grantwood Village'],
    [/cityofgreenpark\.com$/, null, 'City of Green Park'],
    [/fentonmo\.org$/, null, 'City of Fenton'],
    [/arnoldmo\.org$/, null, 'City of Arnold'],
    [/festusmo\.gov$/, null, 'City of Festus'],
    [/byrnesmill\.org$/, null, 'City of Byrnes Mill'],
    [/rockfire-rescue\.org$/, null, 'Rock Community Fire District'],
    [/developstlouis\.org$/, null, 'HomeSTL (City of St. Louis)'],
    [/msdprojectclear\.org$/, null, 'MSD Project Clear'],
    [/mhdc\.com$/, /targeted/i, 'MHDC targeted areas'],
    [/mhdc\.com$/, /lender/i, 'MHDC lender locator'],
    [/mhdc\.com$/, null, 'MHDC'],
    [/geomap\.ffiec\.gov$/, null, 'FFIEC census tract map'],
    [/beyondhousing\.org$/, null, 'Beyond Housing'],
    [/va\.gov$/, null, 'VA home loans'],
    [/hud\.gov$/, null, 'HUD / FHA'],
    [/fanniemae\.com$/, null, 'Fannie Mae'],
    [/consumerfinance\.gov$/, null, 'CFPB'],
    [/usda\.gov$/, null, 'USDA home loans'],
    [/fema\.gov$/, null, 'FEMA flood maps'],
    [/health\.mo\.gov$/, null, 'Missouri health department'],
    [/dnr\.mo\.gov$/, null, 'Missouri DNR'],
    [/data\.mo\.gov$/, null, 'Missouri open data'],
    [/^m\.me$|messenger\.com$|facebook\.com$/, null, 'Facebook / Messenger'],
    [/instagram\.com$/, null, 'Instagram'],
    [/pinterest\.com$/, null, 'Pinterest'],
    [/^maps\.app\.goo\.gl$|google\.[a-z.]+$/, /maps|^\/[A-Za-z0-9]+$/, 'Google Maps'],
    [/theclosingpros\.com$/, null, 'The Closing Pros'],
    [/github\.io$/, /affordability/i, 'Buyer affordability heat map'],
    [/zillow\.com$/, /profile\/georgeandlizk/i, 'George on Zillow (claim as agent)'],
    [/zillow\.com$/, null, 'Zillow'],
    [/realtor\.com$|nar\.realtor$/, null, 'Realtor.com / NAR'],
    [/fox2now\.com$/, null, 'FOX 2 St. Louis'],
    [/showmeinstitute\.org$/, null, 'Show-Me Institute'],
    [/stlouisrealestatesearch\.com$/, null, 'St. Louis Real Estate Search'],
  ];

  function destinationFor(host, path) {
    for (var i = 0; i < DESTINATIONS.length; i++) {
      var d = DESTINATIONS[i];
      if (d[0].test(host) && (!d[1] || d[1].test(path))) return d[2];
    }
    return host; // unnamed sites still report their domain
  }

  function onClick(e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var url;
    try { url = new URL(a.getAttribute('href'), location.href); } catch (err) { return; }
    if (!/^https?:$/.test(url.protocol)) return; // tel:, mailto:, sms: are tracked elsewhere
    var host = url.hostname.replace(/^www\./, '');
    if (host === location.hostname.replace(/^www\./, '') || /(^|\.)stlhomejourney\.com$/.test(host)) return;
    var text = (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 100);
    send('outbound_click', {
      destination: destinationFor(host, url.pathname),
      link_domain: host,
      link_url: url.href.slice(0, 300),
      link_text: text,
      page: location.pathname,
      transport_type: 'beacon'
    });
  }
  document.addEventListener('click', onClick, true);
  document.addEventListener('auxclick', function (e) { if (e.button === 1) onClick(e); }, true);
})();
