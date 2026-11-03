/* Before You Offer: the house check on /articles/what-to-look-for-buying-house-stl.
   Data: /assets/data/before-you-offer-2026.json, group figures only (5+ sales), built by
   scripts/build-before-you-offer.py. No sale lists live in this file or the data file. */
(function () {
  'use strict';
  var root = document.getElementById('offer-check');
  if (!root) return;
  var DATA = null, sample = true;
  var $ = function (id) { return document.getElementById(id); };
  var val = function (id) { return $(id).value; };
  var fm = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var r5 = function (n) { return Math.round(n / 5000) * 5000; };
  var ev = function (name, p) { if (typeof window.gtag === 'function') window.gtag('event', name, p || {}); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var SFL = ['Under 1,000', '1,000–1,499', '1,500–1,999', '2,000–2,499', '2,500–2,999', '3,000 or more'];
  var ERA = { pre50: 0, '50s': 1, '70s': 2, '80s': 3, '00s': 4 };
  var YR = { pre50: 'before 1950', '50s': '1950–1969', '70s': 'the 1970s', '80s': '1980–1999', '00s': '2000 or newer' };
  var STYLE = { R: 'Ranch', T: 'Two-story / other', B: 'Bungalow / 1.5-story', S: 'Split level' };
  var LOAN = { conv: 'Conventional', fha: 'FHA', va: 'VA', cash: 'Cash' };
  var STEPS = ['Same school district, same style, size range and era', 'Same district, same size range and era, any style',
    'Same district, same style and size range, nearby eras', 'Same district, nearby sizes and eras, any style',
    'This district and its two nearest, same style, size range and era'];
  // Days-on-market study: 2,865 St. Louis County sales, 2026 (owner: when-to-lower page).
  var DOM = { '0': [104.0, 990, 78.7], '5': [102.0, 319, 61.1], '8': [100.0, 277, 31.4], '15': [97.6, 378, 26.5],
    '31': [97.4, 508, 24.8], '61': [93.4, 186, 11.8], '91': [88.0, 204, 5.4] };
  var DOML = { '0': '0–4 days', '5': '5–7 days', '8': '8–14 days', '15': '15–30 days', '31': '31–60 days', '61': '61–90 days', '91': '91+ days' };
  var COND = { work: 0, orig: 0.28, upd: 0.55, reno: 1 };
  var CONDL = { work: 'needs work', orig: 'original, kept up', upd: 'partly updated', reno: 'recently renovated' };
  var FIELDS = ['sd', 'city', 'away', 'sqft', 'style', 'beds', 'baths', 'cond', 'list', 'yr', 'found', 'sewer', 'loan', 'dom', 'cut'];
  var L = {
    inspect: ['Home inspections in St. Louis', '/articles/home-inspection-st-louis'],
    repair: ['Repair cost guide', '/articles/stl-home-repair-cost-guide'],
    fpe: ['Federal Pacific panels and VA loans', '/articles/federal-pacific-panel-va-loan-st-louis'],
    occ: ['Occupancy permits by city', '/articles/st-louis-occupancy-permits-by-city'],
    nw: ['A Northwoods purchase where the lists didn’t match', '/articles/lessons-from-a-sale-northwoods-va-purchase'],
    septic: ['A septic lesson from a sale', '/articles/lessons-from-a-sale-ste-genevieve-septic'],
    va: ['How to screen a house before a VA offer', '/articles/how-to-screen-stl-homes-before-va-offer']
  };
  var link = function (l) { return '<a href="' + l[1] + '">' + l[0] + ' &rarr;</a>'; };

  function answers() {
    var a = {};
    FIELDS.forEach(function (f) { a[f] = val('bo-' + f); });
    a.sqft = +a.sqft; a.list = +a.list; a.beds = +a.beds; a.baths = +a.baths;
    a.jeff = DATA.jeffco.districts.indexOf(a.sd) >= 0;
    return a;
  }

  // ---------- value ----------
  var JSTEPS = ['Same district, same beds and baths, same style, within 200 sq ft', 'Same district, same beds and baths, any style, within 200 sq ft'];
  function jeffValue(a) {
    var base = a.sd + '|' + Math.min(a.beds, 8) + '-' + a.baths + '|' + a.sqft + '|', sk = a.style === 'R' ? 'R' : a.style === 'T' ? 'T' : null;
    var tries = [sk ? DATA.jeffco.comps[base + sk] : null, DATA.jeffco.comps[base + '*']];
    var step = tries[0] && tries[0][0] >= 8 ? 0 : tries[1] && tries[1][0] >= 8 ? 1 : tries[0] ? 0 : tries[1] ? 1 : -1;
    if (step < 0) return { html: '<p>Fewer than 5 like-kind 2026 sales in ' + esc(a.sd) + ' for this many beds and baths at this size. Jefferson County has fewer sales, so this happens more often here: exactly when you want me to pull comps by hand.</p>' };
    var g = tries[step], thin = g[0] < 8;
    // g: n, p25, median, p75, sale/list %, median days on market, median year built
    return { g: [g[0], g[1], g[2], g[3], g[4], g[5]], year: g[6], counts: tries.map(function (t) { return t ? t[0] : 0; }), step: step, thin: thin, steps: JSTEPS };
  }
  function value(a) {
    var J = a.jeff ? jeffValue(a) : null;
    if (J && J.html) return J;
    var A = J ? [J.counts, J.step, J.g, J.thin ? 1 : 0] : DATA.comps[a.sd + '|' + ERA[a.yr] + '|' + a.sqft + '|' + a.style];
    var STEPSU = J ? J.steps : STEPS;
    if (!A) return { html: '<p>Fewer than 5 like-kind 2026 sales, even after widening the search. That usually means an unusual house: exactly when you want me to pull comps by hand.</p>' };
    var counts = A[0], step = A[1], g = A[2], thin = A[3];
    var lo = g[1], mid = g[2], hi = g[3], est = lo + (hi - lo) * COND[a.cond];
    var pct = function (x) { return Math.max(0, Math.min(100, (x - lo) / (hi - lo || 1) * 100)); };
    var h = '<p>Like-kind sales are where I start to identify value. From here, we narrow it down by condition. If the house is older and original, the value moves toward the bottom of this range. If it was recently renovated, we’re looking at the top of these comparable homes. Either way, it’s a strong starting point for positioning your offer.</p>';
    h += '<details class="bo-sub"><summary>How I pulled the comps: ' + g[0] + ' like-kind sales</summary><div class="bo-ring">' + STEPSU.map(function (t, i) {
      var used = i === step;
      return '<div class="bo-step' + (used ? ' used' : i > step ? ' later' : '') + '"><span>' + (used ? '✓ ' : i < step ? '↓ ' : '') + t + '</span><span>' + (i > step ? '' : counts[i] ? counts[i] + ' sales' : 'fewer than 5') + '</span></div>';
    }).join('') + (thin ? '<div class="bo-thin">Thin sample: read this one as directional.</div>' : '') + (J ? '<div class="bo-thin">Jefferson County comps don’t match on year built yet. These sales had a median build year of ' + Math.round(J.year) + '.</div>' : '') + '</div></details>';
    h += '<div class="bo-big">' + fm(r5(lo)) + ' – ' + fm(r5(hi)) + '</div><div class="bo-mut">Middle of ' + g[0] + ' like-kind sales: ' + fm(r5(mid)) + ' · ' + SFL[a.sqft] + ' sq ft above ground</div>';
    if (a.away === 'oos' && a.found === 'bsmt') h += '<p class="bo-mut">Coming from a state where houses sit on slabs? The basement here is a whole extra level, but it isn’t in the square footage these comps count. <a href="/articles/moving-to-st-louis#house">Basements and square footage &rarr;</a></p>';
    h += '<div class="bo-bar"><div class="bo-track"><span class="bo-dot" style="left:calc(' + pct(est) + '% - 9px)"></span>' + (a.list ? '<span class="bo-list" style="left:calc(' + pct(a.list) + '% - 1px)"></span>' : '') + '</div><div class="bo-ends"><span>Original or needs work</span><span>Renovated</span></div></div>';
    h += '<p class="bo-vs">For a <b>' + CONDL[a.cond] + '</b> house, I’d start around <b>' + fm(r5(est)) + '</b>.' + (a.list ? ' The thin line is the list price' + (a.list > hi ? ', above the top of the range' : a.list < lo ? ', below the bottom of the range' : '') + '.' : '') + '</p>';
    var gap = null;
    if (a.list) {
      gap = (a.list - est) / est * 100;
      h += '<p class="bo-vs">At ' + fm(a.list) + ', it’s listed <b>' + Math.abs(gap).toFixed(0) + '% ' + (gap >= 0 ? 'above' : 'below') + '</b> that starting point.' + (gap > 5 ? ' That gap is your room to negotiate, especially if it’s been sitting.' : gap < -5 ? ' Priced under the comps: expect competition.' : ' Close to the comps.') + '</p>';
    }
    h += '<details class="bo-sub"><summary>How these comps sold: ' + g[4].toFixed(1) + '% of list, ' + g[5] + ' days</summary><div class="bo-stats"><div class="bo-stat"><b>' + g[4].toFixed(1) + '%</b><span>median sale vs. original list</span></div><div class="bo-stat"><b>' + g[5] + '</b><span>median days on market</span></div>' + (J ? '<div class="bo-stat"><b>' + Math.round(J.year) + '</b><span>median year built</span></div>' : '<div class="bo-stat"><b>' + g[6] + ' of ' + g[0] + '</b><span>had cut their price</span></div>') + '</div>' +
      '<p class="bo-mut">The middle half of like-kind 2026 sale prices. Group figures only; no individual sales are shown or stored here. Text me the address and I’ll narrow it with the actual comps and the condition I see.</p></details>';
    return { html: h, est: est, lo: lo, hi: hi, gap: gap };
  }

  function taxOf(a) {
    var T = DATA.tax[a.sd];
    if (!T) return null;
    var z = T.size && T.size[a.sqft];
    return z ? { med: z.med, n: z.n, label: SFL[a.sqft] + ' sq ft homes' } : { med: T.med, n: T.n, label: 'all homes', all: true };
  }

  function taxHtml(a) {
    var t = taxOf(a);
    if (!t) return '<p>No 2026 tax figures for this district yet.</p>';
    return '<div class="bo-stats"><div class="bo-stat"><b>' + fm(t.med) + '</b><span>median 2026 tax bill, ' + t.label + ' in ' + esc(a.sd) + ' (' + t.n + ' sales)</span></div></div>' +
      (t.all ? '<p class="bo-mut">There’s no size-specific figure for this size range yet, so this is the district median for all sizes.</p>' : '') +
      '<p>Two houses at the same price can carry different bills. Get this house’s actual bill from the listing or the St.&nbsp;Louis County Collector before you write. <a href="/school-districts/st-louis-county#property-taxes">Property taxes by school district &rarr;</a></p>';
  }

  function priceHtml(a) {
    var h;
    if (a.cut === 'yes') {
      h = '<div class="bo-stats"><div class="bo-stat"><b>91.6%</b><span>median sale vs. original list, sellers who cut</span></div><div class="bo-stat"><b>97.8%</b><span>median sale vs. the reduced price</span></div><div class="bo-stat"><b>−$23,900</b><span>typical seller vs. their own original list</span></div></div>' +
        '<p>Sellers who already cut their price are in a different group. In 2026, 630 of them sold for a median 91.6% of their original list, in a median 56 days, and the typical one finished $23,900 under where they started. Only 15 of the 630 got back to their first price.</p><p class="bo-mut">That’s what similar sales did, not what this seller will take.</p>';
    } else {
      var d = DOM[a.dom];
      h = '<div class="bo-stats"><div class="bo-stat"><b>' + d[0].toFixed(1) + '%</b><span>median sale vs. original list at ' + DOML[a.dom] + '</span></div><div class="bo-stat"><b>' + d[2] + '%</b><span>sold above original list</span></div><div class="bo-stat"><b>' + d[1] + '</b><span>sales in this group</span></div></div>' +
        '<p>' + (+a.dom <= 7 ? 'In the first week, homes often sold above list: price close to the comps and keep your terms clean.' : +a.dom <= 14 ? 'By two weeks, the median sale was right at list.' : 'Past 30 days, the bidding-war window has usually passed. Days on market sets your leverage, not your opening number.') + '</p>' +
        '<p class="bo-mut">Grouped by when homes finally sold, from 2,865 St.&nbsp;Louis County sales in 2026. A house at day 40 today may sell later, or not at all.' + (a.cut === 'unk' ? ' Ask whether the price has been cut: it changes this picture.' : '') + '</p>';
    }
    if (a.jeff) h += '<p class="bo-mut">These days-on-market figures come from St.&nbsp;Louis County sales; Jefferson County doesn’t have its own study yet.</p>';
    return h + '<div class="bo-ring"><b>Before we write, I call the listing agent</b><div>How much activity they’ve had, whether there are offers in hand, whether the seller is flexible on timing or terms, what issues I should know about, and whether the seller is open to repairs if the offer makes sense. Sometimes the answer changes the whole offer. <a href="/articles/how-george-works-with-buyers#listing-agent">What I ask &rarr;</a></div></div>' +
      '<p class="bo-mut"><a href="/articles/when-to-lower-house-price-st-louis">What 2026 price cuts show &rarr;</a> · <a href="/articles/how-much-to-offer-on-a-house-st-louis">How much to offer &rarr;</a></p>';
  }

  function showHtml(a) {
    var pipe = { pre50: 'Built before about 1968, the drain lines started out as cast iron. Look at what’s still original and what’s been replaced.',
      '50s': 'Built before about 1968, the drain lines started out as cast iron. Look at what’s still original and what’s been replaced.',
      '70s': 'Builders phased cast iron drain pipe out for black plastic between about 1968 and 1972, so some 1970s homes still have cast iron. Look at which one you have.',
      '80s': 'Built after the switch from cast iron to plastic, so the drain pipe itself is less of a risk. Still get the sewer inspection.',
      '00s': 'Built with plastic drain pipe, so the pipe itself is less of a risk. Still get the sewer inspection.' };
    var mine = [
      ['Electrical panel', 'I open the panel and look for a permit sticker. It tells me when the electrical system was updated: a new panel gets an electrical inspection. Then the brand and the breakers: Federal Pacific, “Stab-Lok,” double-tapped breakers, any scorch marks.', true],
      ['Furnace and A/C', 'I check the serial number on the furnace and the A/C. The serial number tells me how old they are, and age tells you what you’ll be budgeting for.', true],
      ['Water heater', 'I look at the water heater, and the color tells me about how old it is. Newer models have a sticker with the date. The olive green tops are from the ’70s and ’80s.', true],
      ['What the drain pipe is made of', pipe[a.yr], a.sewer === 'public'],
      ['The floor drain', 'In the basement, I check the drain itself to see if the line has been replaced. An easy way to tell is a broken-out and new section of concrete around it. Sometimes the stack is replaced and tied into the original cast iron. It’s good to know, and it adds context once the sewer inspection is done.', a.sewer === 'public' && a.found === 'bsmt']
    ].filter(function (x) { return x[2]; });
    var also = [['Basement water signs', '#wt-water', a.found === 'bsmt'], ['Foundation cracks', '#wt-cracks', a.found !== 'slab'], ['Grading', '#wt-grading', a.found !== 'slab'],
      ['Roof', '#wt-roof', true], ['Knob-and-tube wiring', '#wt-knob', a.yr === 'pre50'], ['Fresh paint everywhere', '#wt-paint', true], ['Radon', '#wt-radon', true]].filter(function (x) { return x[2]; });
    return (a.away === 'oos' ? '<div class="bo-ring"><b>Not in St.&nbsp;Louis yet?</b><div>I walk the house on live video and capture it in 360, so you can look again whenever you want. Everything on this list, I check on camera while you watch. <a href="/articles/buy-house-st-louis-from-out-of-state#video">How a video showing works &rarr;</a></div></div>' : '') +
      '<p>I look for what costs money, not paint. What I look for changes the moment I know what kind of house we’re walking. <a href="/articles/how-george-works-with-buyers#showing">How I walk a house &rarr;</a></p>' +
      '<ul class="bo-list-items">' + mine.map(function (x) { return '<li class="bo-card"><h4>' + x[0] + '</h4><p>' + x[1] + '</p></li>'; }).join('') + '</ul>' +
      '<div class="bo-ring"><b>Also on every walk-through</b><div class="bo-also">' + also.map(function (x) { return '<a href="' + x[1] + '">' + x[0] + ' &rarr;</a>'; }).join('') + '</div><div class="bo-mut">From the checklist below.</div></div>';
  }

  function checks(a) {
    var R = [], old = a.yr === 'pre50' || a.yr === '50s', occ = DATA.occupancy[a.city], rule = occ ? occ.rule : null;
    if (a.sewer === 'public') R.push({ w: old ? 90 : 60, t: 'Sewer lateral', why: (old ? 'In a house this age the drain lines started out as cast iron, and the line to the street is often clay tile, where roots get in at the joints. ' : a.yr === '70s' ? 'Cast iron drain pipe was phased out between about 1968 and 1972, so some 1970s homes still have it. ' : 'A newer house has plastic drain pipe, which lowers the risk, but the line to the street still needs a scope. ') + 'Replacement typically runs $4,000 to $12,000 and can pass $15,000, and you won’t see it on a walk-through.',
      insp: 'Camera-scope the lateral all the way to the main, not just a visual. About $150–$300.' + (a.found === 'bsmt' ? ' Tell the inspector what you saw at the floor drain: a new section of concrete, or a newer stack tied into the original cast iron, means part of the line was replaced.' : ''), links: [L.inspect, L.repair] });
    if (a.yr === '50s' || a.yr === '70s') R.push({ w: a.loan === 'va' ? 95 : 80, t: 'Electrical panel (Federal Pacific)', why: 'Homes built about 1950–1980 are the ones most likely to have one. Many insurers won’t write a new policy on it' + (a.loan === 'va' ? ', and a VA appraiser who notes it can condition the loan on replacement.' : '.'),
      insp: 'Identify the panel brand in the report. If it’s Federal Pacific, get an electrician’s replacement quote ($2,000–$4,000 in 2026) before you write the offer.', links: [L.fpe] });
    if (rule === 'yes') R.push({ w: 85, t: 'Occupancy inspection: ' + a.city + ' requires one', why: a.city + ' requires an occupancy inspection when a house changes hands. Plan on weeks, not days. That failure list isn’t the same as your inspection report.',
      insp: 'Nothing extra: this is the local government’s inspection, not yours. Ask for the failure list in writing and compare it with your report.', links: [L.occ, L.nw] });
    else if (rule === 'no') R.push({ w: 30, t: 'Occupancy: ' + a.city + ' doesn’t require one to sell', why: a.city + ' doesn’t require an occupancy inspection to sell an existing owner-occupied home. Confirm with the city; rules change.', insp: '', links: [L.occ] });
    else if (rule === 'depends') R.push({ w: 70, t: 'Occupancy: depends where in ' + a.city, why: 'In ' + a.city + ', whether an inspection is required depends on the area, and the mailing address doesn’t tell you. Find out before you write; it can take weeks.', insp: '', links: [L.occ] });
    else R.push({ w: 70, t: 'Occupancy: check this city’s rule', why: 'Some cities require an inspection at sale and some don’t, and the mailing address doesn’t tell you which city you’re in. It can take weeks, so find out before you write.', insp: '', links: [L.occ] });
    if (a.sewer === 'septic') R.push({ w: a.loan === 'cash' ? 75 : 98, t: 'Septic system', why: 'FHA, VA and conventional loans all need the system working and sanitary at closing. A failing system can shrink the buyer pool, not just add a repair bill.' + (a.loan === 'cash' ? ' Paying cash gives you more room: you can close and fix it on your own timeline.' : ''),
      insp: 'Hire a septic inspection with pumping, separate from the home inspection, inside your inspection period.', links: [L.septic] });
    if (a.found === 'bsmt') R.push({ w: old ? 70 : 55, t: 'Basement water', why: 'White mineral deposits on the walls, staining or a waterline at the floor, patched or painted-over cracks and fresh basement paint all point to water. Find out where it came from and what was done about it.', insp: 'Ask the inspector to note moisture and any patched cracks.', links: [['Signs of water in a basement', '#wt-water']] });
    if (a.yr === 'pre50') R.push({ w: 75, t: 'Knob-and-tube wiring', why: 'Plan on replacing it if it’s active. Most insurers won’t cover a home with active knob-and-tube wiring, and many lenders require it to be removed before closing.', insp: 'Ask the inspector to note any original wiring they can see.', links: [['Knob-and-tube wiring', '#wt-knob']] });
    if (a.loan === 'va' && a.yr !== '80s' && a.yr !== '00s') R.push({ w: 65, t: 'Peeling paint on an older house', why: 'VA appraisers flag peeling paint. I point it out at the showing so we can deal with it before you spend money on inspections.', insp: 'Note any chipping or peeling paint, inside and out.', links: [L.va] });
    R.push({ w: 20, t: 'Radon', why: 'Missouri has elevated radon in many areas.', insp: 'Add a radon test ($100–$150).', links: [['Radon', '#wt-radon']] });
    return R.sort(function (x, y) { return y.w - x.w; }).slice(0, 5);
  }

  function checksHtml(R) {
    return '<p class="bo-mut">Get as many inspections as you can afford. Afterward, anything major, or anything that affects the loan, occupancy or moving in, gets repaired before closing; small items can be a credit or a home warranty. <a href="/articles/how-george-works-with-buyers#inspection">How I handle repairs &rarr;</a> · <a href="/articles/which-contingencies-to-keep-st-louis">Which contingencies to keep &rarr;</a></p>' +
      R.map(function (r, i) {
        return '<div class="bo-card"><div class="bo-rank">' + (i + 1) + '</div><div><h4>' + esc(r.t) + '</h4><p>' + r.why + '</p>' + (r.insp ? '<p class="bo-ask"><b>Ask your inspector</b>' + r.insp + '</p>' : '') + (r.links.length ? '<p class="bo-links">' + r.links.map(link).join(' · ') + '</p>' : '') + '</div></div>';
      }).join('');
  }

  function loanHtml(a) {
    var t = { va: 'VA appraisers flag condition items like Federal Pacific panels and peeling paint. Don’t count on the appraiser to catch everything for you: the appraisal isn’t an inspection. Get the electrician and other quotes inside your inspection period. ' + link(L.va),
      fha: 'An FHA appraisal looks at the house’s condition, but it isn’t an inspection, so don’t count on it to catch problems for you. <a href="/articles/how-george-works-with-buyers#showing">Why I point them out at the showing &rarr;</a>',
      conv: 'The appraisal still has to support the price, which matters on a house that has been sitting.',
      cash: 'Paying cash, you can take on a house a financed buyer can’t, like a failed septic. That’s leverage on price. ' + link(L.septic) };
    return '<p>' + t[a.loan] + '</p>';
  }

  function budgetHtml(a, est) {
    var price = a.list || (est ? r5(est) : 0);
    if (!price) return '<p>Pick a list price above to see the payment.</p>';
    var dn = +val('bo-bDown'), rt = +val('bo-bRate') / 100 / 12, ins = +val('bo-bIns'), bud = +val('bo-bBudget'), hp = val('bo-bHelp');
    var loan = price * (1 - dn / 100), pi = loan * rt / (1 - Math.pow(1 + rt, -360)), t = taxOf(a), tax = t ? t.med / 12 : 0, tot = pi + tax + ins;
    var h = '<div class="bo-stats"><div class="bo-stat"><b>' + fm(tot) + '</b><span>a month at ' + fm(price) + (a.list ? ' (list price)' : ' (starting point)') + '</span></div><div class="bo-stat"><b>' + fm(dn / 100 * price) + '</b><span>down payment, plus closing costs</span></div></div>';
    h += '<p>' + fm(pi) + ' principal and interest, ' + fm(tax) + ' property tax (the ' + esc(a.sd) + ' median for this size), ' + fm(ins) + ' insurance.</p>';
    if (bud) { var d = tot - bud; h += '<p class="bo-vs"><b>' + (d <= 0 ? 'Within your budget by ' + fm(-d) + ' a month.' : fm(d) + ' a month over your budget.') + '</b>' + (d > 0 && a.list && est && a.list > est ? ' Offering closer to where its condition puts it would bring that down.' : '') + '</p>'; }
    h += '<p class="bo-mut">Mortgage insurance, the VA funding fee and HOA dues aren’t included. Closing costs typically run 2% to 3% of the price. <a href="/articles/buyer-closing-costs-st-louis">Buyer closing costs &rarr;</a> · <a href="/articles/conventional-vs-fha-loan-st-louis">Payments by loan type &rarr;</a></p>';
    if (hp === 'mhdc') {
      var help = loan * 0.04, cap = price <= 566354 ? 'Under the First Place price cap ($566,354).' : price <= 692211 ? 'Over the First Place cap; under the Targeted / Next Step cap ($692,211).' : 'Over both MHDC price caps.';
      h += '<div class="bo-ring"><b>MHDC 4%</b><div>4% of a ' + fm(loan) + ' first mortgage is <b>' + fm(help) + '</b>, about <b>' + fm(help - loan * 0.01) + '</b> after a maximum 1% lender fee. It’s a second mortgage, not a grant. ' + cap + ' Income limits apply: $113,500 for 1–2 people on First Place. <a href="/articles/mhdc-first-place-next-step-missouri-guide">MHDC First Place and Next Step &rarr;</a></div></div>';
    }
    if (hp === 'phys') h += '<div class="bo-ring"><b>Physician loan</b><div>A physician loan doesn’t make the house cheaper; it lets you keep cash invested. Run this price through the full plan, with your training stage and student loans. <a href="/tools/physician-home-plan">Physician Home Plan &rarr;</a></div></div>';
    return { html: h, tot: tot };
  }

  var last = null;
  function run(scroll) {
    var a = answers(), V = value(a), R = checks(a), occ = DATA.occupancy[a.city];
    last = { a: a, V: V, R: R };
    var read = V.gap !== undefined && V.gap !== null && V.gap > 5 ? 'Listed above its comps, so you have room on price' : V.gap !== null && V.gap !== undefined && V.gap < -5 ? 'Priced under its comps, so expect competition' : (a.cut === 'yes' || +a.dom >= 31) ? 'Priced near its comps, and time is on your side' : +a.dom <= 7 ? 'Priced near its comps, so move quickly' : 'Priced near its comps';
    $('bo-read').textContent = read + ', and ' + R.length + ' things to check before you write.';
    $('bo-value').innerHTML = V.html; $('bo-tax').innerHTML = taxHtml(a); $('bo-price').innerHTML = priceHtml(a);
    $('bo-show').innerHTML = showHtml(a); $('bo-checks').innerHTML = checksHtml(R); $('bo-loantxt').innerHTML = loanHtml(a);
    var t = taxOf(a), sum = function (id, s) { $(id + '-sum').textContent = s; };
    sum('bo-value', V.est ? 'Start around ' + fm(r5(V.est)) + ' · range ' + fm(r5(V.lo)) + '–' + fm(r5(V.hi)) : 'Not enough like-kind sales');
    sum('bo-tax', t ? 'Median bill ' + fm(t.med) + (t.all ? '' : ' for ' + SFL[a.sqft] + ' sq ft') + ' in ' + a.sd : 'No tax figures here yet');
    sum('bo-price', a.cut === 'yes' ? 'Sellers who cut sold at 91.6% of original list' : DOM[a.dom][0].toFixed(1) + '% of original list at ' + DOML[a.dom]);
    sum('bo-show', $('bo-show').querySelectorAll('li').length + ' things I look at on a house like this, plus the checklist');
    sum('bo-checks', R.length + ' checks · first: ' + R[0].t);
    sum('bo-loantxt', LOAN[a.loan] + (a.loan === 'va' || a.loan === 'fha' ? ': what the appraiser will look for' : a.loan === 'cash' ? ': where cash gives you leverage' : ': the appraisal still has to support the price'));
    runBudget();
    var chips = [a.sd + ' district', occ === undefined ? '' : a.city, a.away === 'oos' ? 'Moving from out of state' : '', SFL[a.sqft] + ' sq ft', STYLE[a.style], a.beds + (a.beds === 5 ? '+' : '') + ' bed', a.baths + (a.baths === 4 ? '+' : '') + ' bath', 'Built ' + YR[a.yr],
      { bsmt: 'Basement', crawl: 'Crawlspace', slab: 'Slab' }[a.found], a.sewer === 'septic' ? 'Septic' : 'Public sewer', LOAN[a.loan], DOML[a.dom], a.cut === 'yes' ? 'Price cut' : a.cut === 'no' ? 'No price cut' : '', a.list ? 'Listed at ' + fm(a.list) : ''].filter(Boolean);
    $('bo-inp-sum').textContent = chips.join(' · ');
    var msg = 'Hi George, I ran Before You Offer' + (a.away === 'oos' ? ' (I’m moving from out of state)' : '') + ': ' + a.sd + ' district, ' + SFL[a.sqft] + ' sq ft ' + STYLE[a.style].toLowerCase() + ', built ' + YR[a.yr] + ', ' + LOAN[a.loan] + ', ' + DOML[a.dom] + (a.cut === 'yes' ? ', price cut' : '') + '. The address is: ';
    $('bo-sms').href = 'sms:+13144351087?&body=' + encodeURIComponent(msg);
    $('bo-inputs').open = false;
    $('bo-out').hidden = false;
    if (!sample) {
      try { history.replaceState(null, '', '#check=' + FIELDS.map(function (f) { return encodeURIComponent(val('bo-' + f)); }).join('.')); } catch (e) {}
      ev('byo_result', { district: a.sd, style: a.style, size: SFL[a.sqft] });
    }
    if (scroll) $('bo-out').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function runBudget() {
    if (!last) return;
    var B = budgetHtml(last.a, last.V.est);
    $('bo-budget').innerHTML = B.html || B;
    $('bo-budget-sum').textContent = B.tot ? fm(B.tot) + ' a month on this house' : 'Optional: see the monthly payment on this house';
  }

  function fill() {
    var sd = $('bo-sd');
    var opt = function (counts) { return function (d) { return '<option value="' + esc(d) + '"' + (d === 'Lindbergh' ? ' selected' : '') + '>' + esc(d) + ' (' + counts[d] + ' sales)</option>'; }; };
    sd.innerHTML = '<optgroup label="St. Louis County">' + DATA.districts.map(opt(DATA.districtSales)).join('') + '</optgroup><optgroup label="Jefferson County">' + DATA.jeffco.districts.map(opt(DATA.jeffco.districtSales)).join('') + '</optgroup>';
    var city = $('bo-city');
    var co = function (cty) { return Object.keys(DATA.occupancy).filter(function (c) { return DATA.occupancy[c].county === cty; }).map(function (c) { return '<option value="' + esc(c) + '"' + (c === 'Crestwood' ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join(''); };
    city.innerHTML = '<option value="">Not sure / another city</option><optgroup label="St. Louis County">' + co('stl') + '</optgroup><optgroup label="Jefferson County">' + co('jeff') + '</optgroup>';
    $('bo-through').textContent = DATA.sales.toLocaleString('en-US') + ' St. Louis County and ' + DATA.jeffco.sales + ' Jefferson County sales, ' + DATA.through;
  }

  function fromHash() {
    var m = /^#check=(.+)$/.exec(location.hash);
    if (!m) return false;
    var v = m[1].split('.').map(decodeURIComponent);
    if (v.length !== FIELDS.length) return false;
    FIELDS.forEach(function (f, i) { var el = $('bo-' + f); if ([].some.call(el.options, function (o) { return o.value === v[i]; })) el.value = v[i]; });
    return true;
  }

  function mine() { sample = false; $('bo-k').textContent = 'Your check'; $('bo-sample').hidden = true; }

  function init() {
    fill();
    if (fromHash()) mine();
    run(false);
    $('bo-go').addEventListener('click', function () { mine(); run(true); });
    ['bo-bBudget', 'bo-bDown', 'bo-bRate', 'bo-bIns', 'bo-bHelp'].forEach(function (id) { $(id).addEventListener('change', runBudget); });
    $('bo-edit').addEventListener('click', function (e) { e.preventDefault(); $('bo-inputs').open = true; $('bo-inputs').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    $('bo-xall').addEventListener('click', function () {
      var d = root.querySelectorAll('details.bo-sec'), all = [].every.call(d, function (x) { return x.open; });
      [].forEach.call(d, function (x) { x.open = !all; }); this.textContent = all ? 'Expand all' : 'Collapse all';
    });
    $('bo-sms').addEventListener('click', function () { ev('byo_text_click', { district: last && last.a.sd }); });
    $('bo-copy').addEventListener('click', function () {
      var a = last.a, txt = 'Ask your inspector (' + a.sd + ' district, built ' + YR[a.yr] + '):\n' + last.R.filter(function (r) { return r.insp; }).map(function (r, i) { return (i + 1) + '. ' + r.t + ': ' + r.insp; }).join('\n');
      var done = function (ok) { $('bo-copy').textContent = ok ? 'Copied' : 'Copy didn’t work here'; setTimeout(function () { $('bo-copy').textContent = 'Copy inspector list'; }, 1800); };
      try { navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(false); }); } catch (e) { done(false); }
      ev('byo_copy');
    });
    $('bo-share').addEventListener('click', function () {
      mine(); run(false);
      var url = location.href, done = function (ok) { $('bo-share').textContent = ok ? 'Link copied' : 'Copy the address bar'; setTimeout(function () { $('bo-share').textContent = 'Share this check'; }, 1800); };
      try { navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); }); } catch (e) { done(false); }
      ev('byo_share');
    });
  }

  fetch('/assets/data/before-you-offer-2026.json').then(function (r) { return r.json(); }).then(function (d) { DATA = d; init(); })
    .catch(function () { $('bo-k').textContent = 'The check didn’t load. Refresh the page, or text me the address: 314-435-1087.'; });
})();
