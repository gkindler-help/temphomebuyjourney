/* St. Louis County housing-by-school-district interactive.
 * Reads aggregate results only (window.STLHJ_SD_AGG + /assets/data/sd-house/{beds}-{baths}.json).
 * No individual sale records are shipped to the browser.
 * Budgets and price caps are evaluated in $25,000 steps; square footage centers in 100 sq. ft. steps.
 * Percentiles were precomputed with linear interpolation (Excel PERCENTILE.INC).
 * Progressive enhancement: every published answer also exists as static HTML on the page. */
(function () {
  'use strict';

  var STUDY_DAYS = 278; // Jan 1 – Oct 5, 2026 inclusive
  var GUIDES = {
    'Affton 101': 'affton-school-district', 'Clayton': 'clayton-school-district',
    'Ferguson-Florissant': 'ferguson-florissant-school-district', 'Hazelwood': 'hazelwood-school-district',
    'Kirkwood R-VII': 'kirkwood-school-district', 'Ladue': 'ladue-school-district', 'Lindbergh': 'lindbergh-schools',
    'Mehlville R-IX': 'mehlville-school-district', 'Normandy': 'normandy-school-district',
    'Parkway': 'parkway-school-district', 'Pattonville': 'pattonville-school-district',
    'Ritenour': 'ritenour-school-district', 'Riverview Gardens': 'riverview-gardens-school-district',
    'Rockwood R-VI': 'rockwood-school-district', 'University City': 'university-city-school-district',
    'Webster Groves': 'webster-groves-school-district'
  };
  var F = { n: 0, median: 1, p25: 2, p75: 3, sqft: 4, year: 5, cdom: 6, ratio: 7, aboveN: 8, origN: 9, low: 10, high: 11, hist: 12 };

  // ── Engine (pure functions over aggregates, exposed for testing) ──
  function budgetStats(agg, district, budget) {
    var B = agg.budget, d = B.districts[district], k = Math.floor(budget / B.step);
    if (k < 1) return { district: district, total: d.total, count: 0, share: 0, median: d.median, sqft: null, beds: null, baths: null };
    if (k > d.count.length) k = d.count.length;
    var i = k - 1, c = d.count[i];
    return { district: district, total: d.total, count: c, share: d.total ? c / d.total : 0, median: d.median,
      sqft: d.sqft[i], beds: d.beds[i], baths: d.baths[i] };
  }
  function snapBudget(agg, v) { var s = agg.budget.step; return Math.min(Math.floor(v / s) * s, agg.budget.max); }
  function snapSqft(agg, v) { var c = agg.house.centers; return Math.min(Math.max(Math.round(v / 100) * 100, c[0]), c[1]); }
  function cohort(file, district, style, center, tol) {
    var d = file && file[district]; if (!d) return null;
    var s = d[style || '*']; if (!s) return null;
    var a = s[center + '_' + tol]; if (!a) return null;
    return {
      count: a[F.n], median: a[F.median], p25: a[F.p25], p75: a[F.p75], sqft: a[F.sqft], year: a[F.year],
      cdom: a[F.cdom], ratio: a[F.ratio], above: a[F.origN] ? a[F.aboveN] / a[F.origN] : null,
      low: a[F.low], high: a[F.high], hist: a[F.hist]
    };
  }
  function withinBudget(c, max, step) {
    if (!c) return 0;
    var k = Math.floor(max / step), n = 0;
    c.hist.forEach(function (h) { if (h[0] <= k) n += h[1]; });
    return n;
  }
  window.STLHJ_SD = { budgetStats: budgetStats, cohort: cohort, withinBudget: withinBudget, snapBudget: snapBudget, snapSqft: snapSqft };

  // ── Formatting ──
  function money(v) { return v == null ? '—' : '$' + Math.round(v).toLocaleString('en-US'); }
  function pct1(x) {
    if (x == null) return '—';
    if (x === 0) return '0%';
    if (x === 1) return '100%';
    return (Math.round(x * 1000) / 10).toFixed(1) + '%';
  }
  function num(v) { return v == null ? '—' : Math.round(v).toLocaleString('en-US'); }
  function yearTxt(v) { if (v == null) return '—'; return v % 1 ? Math.floor(v) + '–' + Math.ceil(v) : String(v); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function parseMoney(s) { var d = String(s || '').replace(/[^0-9.kKmM]/g, ''); if (!d) return null; var mult = /m/i.test(d) ? 1e6 : /k/i.test(d) ? 1e3 : 1; var v = parseFloat(d.replace(/[kKmM]/g, '')); if (isNaN(v)) return null; return Math.round(v * mult); }
  function parseNum(s) { var d = String(s || '').replace(/[^0-9]/g, ''); return d ? parseInt(d, 10) : null; }
  function signed(n) { return (n >= 0 ? '+' : '') + n; }
  function guideLink(d) { return GUIDES[d] ? '<a class="guide" href="/school-districts/' + GUIDES[d] + '">' + esc(d) + ' buyer guide →</a>' : ''; }

  function coverageText(share) {
    if (share === 0) return 'No qualifying sales in this dataset closed at or below your budget.';
    if (share < 0.10) return 'Possible—but historically uncommon at this budget.';
    if (share < 0.25) return 'Your budget reached a limited slice of this district’s market.';
    if (share < 0.50) return 'You had real options, but you were still shopping below the middle of this district’s market.';
    if (share < 0.75) return 'Your budget reached at least half of the district’s closed-sale market.';
    return 'Your budget reached most of the district’s closed-sale market.';
  }
  function sampleText(n) {
    if (n <= 2) return 'Very few matching sales. Treat the price as an example, not a stable market estimate.';
    if (n <= 4) return 'Matching homes were scarce in this dataset. The count is useful; the median price is only directional.';
    if (n <= 9) return 'A small but useful comparison group. Read the price together with the sale count.';
    return 'A broader comparison group for this specific house type.';
  }
  var INVENTORY_NOTE = 'This describes closed sales during the study period. It does not guarantee current or future inventory.';

  function layoutText(s) {
    if (s.count < 5 || !s.beds || !s.baths) return 'Too few sales to summarize';
    if (s.beds[1] < 0.4 || s.baths[1] < 0.4) return 'Mixed—no single typical layout';
    return 'Most often ' + s.beds[0] + ' bed / ' + s.baths[0] + ' bath';
  }

  function init() {
    var agg = window.STLHJ_SD_AGG;
    if (!agg) return;
    var districts = agg.districts.slice(), STEP = agg.budget.step;
    document.querySelectorAll('.sd-form').forEach(function (f) { f.hidden = false; });

    // ── Mode switching ──
    var modeBtns = document.querySelectorAll('.mode-btn');
    var panels = document.querySelectorAll('[data-panel]');
    function setMode(m, focus) {
      modeBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === m ? 'true' : 'false'); });
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== m; });
      if (focus) { var t = document.getElementById(m + '-tool'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    modeBtns.forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); setMode(b.getAttribute('data-mode'), false); }); });
    document.querySelectorAll('[data-mode-link]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); setMode(a.getAttribute('data-mode-link'), true); });
    });
    setMode(location.hash === '#house-tool' ? 'house' : 'budget', false);

    // ── Mode 1: budget ──
    var bMax = document.getElementById('b-max'), bDist = document.getElementById('b-dist'), bOut = document.getElementById('budget-out');
    var bHint = document.getElementById('b-max-hint');
    var bSort = 'share';
    districts.forEach(function (d) { var o = document.createElement('option'); o.value = d; o.textContent = d; bDist.appendChild(o); });
    var chips = document.querySelectorAll('[data-budget]');

    function budgetCard(s) {
      var w = Math.max(s.share * 100, s.share > 0 ? 1.5 : 0);
      return '<article class="rcard"><h4>' + esc(s.district) + '</h4>' +
        '<div class="bar" aria-hidden="true"><span style="width:' + w.toFixed(1) + '%"></span></div>' +
        '<dl><dt>Sales within your budget</dt><dd>' + s.count + ' of ' + s.total + '</dd>' +
        '<dt>Share of district sales</dt><dd>' + pct1(s.share) + '</dd>' +
        '<dt>District median sale</dt><dd>' + money(s.median) + '</dd>' +
        '<dt>Typical size within your budget</dt><dd>' + (s.sqft ? num(s.sqft) + ' sq. ft.' : (s.count ? 'Too few sales to summarize' : '—')) + '</dd>' +
        '<dt>Typical bedrooms / bathrooms</dt><dd>' + esc(layoutText(s)) + '</dd></dl>' +
        '<p class="means"><strong>What this means</strong>' + esc(coverageText(s.share)) + '</p>' +
        guideLink(s.district) + '</article>';
    }

    function renderBudget() {
      var entered = parseMoney(bMax.value);
      if (!entered || entered < STEP) {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        bHint.textContent = '';
        bOut.innerHTML = '<div class="result-head"><p>Enter a maximum purchase price of $25,000 or more to see results.</p></div>';
        return;
      }
      var budget = snapBudget(agg, entered);
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(+c.getAttribute('data-budget') === budget)); });
      bHint.textContent = budget !== entered ? 'Calculated at ' + money(budget) + '. Results use $25,000 steps' + (entered > agg.budget.max ? ' up to ' + money(agg.budget.max) : '') + '.' : '';
      var d = bDist.value;
      if (d) {
        var s = budgetStats(agg, d, budget), head;
        var up25 = budgetStats(agg, d, budget + STEP), up50 = budgetStats(agg, d, budget + 2 * STEP);
        if (s.count === 0) {
          head = '<h3>' + esc(coverageText(0)) + '</h3><p>0 of ' + s.total + ' qualifying sales in ' + esc(d) + ' closed at or below ' + money(budget) + ' during the study period.</p>';
        } else if (s.share < 0.5) {
          head = '<h3>Your budget works here—but you’re shopping a narrow part of the market.</h3>' +
            '<p>' + s.count + ' of ' + s.total + ' qualifying sales in ' + esc(d) + ' closed at or below ' + money(budget) + ' during the study period. That’s ' + pct1(s.share) + ' of the district’s closed-sale market.</p>' +
            '<p>You weren’t priced out.</p><p>But you had fewer chances to find a house you actually wanted than a buyer whose budget reached the middle of the market.</p>';
        } else {
          head = '<h3>Your budget reached a meaningful share of this district’s market.</h3>' +
            '<p>' + s.count + ' of ' + s.total + ' qualifying sales in ' + esc(d) + ' closed at or below ' + money(budget) + '—' + pct1(s.share) + ' of the market we analyzed.</p>' +
            '<p>That doesn’t mean every house would have fit your needs.</p><p>It means your price ceiling gave you access to a much broader part of the district’s historical sales.</p>';
        }
        var deltas = '';
        if (budget + STEP <= agg.budget.max) {
          deltas = '<div class="delta-row">' +
            '<div class="delta">At ' + money(budget + STEP) + '<b>' + up25.count + ' sales · ' + pct1(up25.share) + '</b>' + signed(up25.count - s.count) + ' vs. your budget</div>' +
            (budget + 2 * STEP <= agg.budget.max ? '<div class="delta">At ' + money(budget + 2 * STEP) + '<b>' + up50.count + ' sales · ' + pct1(up50.share) + '</b>' + signed(up50.count - s.count) + ' vs. your budget</div>' : '') +
            '</div>';
        }
        bOut.innerHTML = '<div class="result-head">' + head + '<p class="fine">' + INVENTORY_NOTE + '</p></div>' + deltas +
          '<div class="rcards" style="margin-top:16px;">' + budgetCard(s) + '</div>';
        return;
      }
      var list = districts.map(function (x) { return budgetStats(agg, x, budget); });
      list.sort(function (a, b) {
        if (bSort === 'name') return a.district.localeCompare(b.district);
        if (bSort === 'median') return a.median - b.median;
        return (b.share - a.share) || (b.count - a.count) || a.district.localeCompare(b.district);
      });
      var reach = list.filter(function (s) { return s.share >= 0.5; }).length;
      bOut.innerHTML = '<div class="result-head"><h3>At ' + money(budget) + ', your budget reached at least half of the closed-sale market in ' + reach + ' of 22 districts.</h3>' +
        '<p class="fine">' + INVENTORY_NOTE + '</p></div>' +
        '<div class="results-bar"><span class="count">22 districts · share of each district’s 2026 closed sales at or below ' + money(budget) + '</span>' +
        '<label style="font-size:13px;color:var(--text-muted);">Sort by <select id="b-sort">' +
        '<option value="share"' + (bSort === 'share' ? ' selected' : '') + '>Share within budget</option>' +
        '<option value="median"' + (bSort === 'median' ? ' selected' : '') + '>District median</option>' +
        '<option value="name"' + (bSort === 'name' ? ' selected' : '') + '>District name</option></select></label></div>' +
        '<div class="rcards">' + list.map(budgetCard).join('') + '</div>';
      document.getElementById('b-sort').addEventListener('change', function (e) { bSort = e.target.value; renderBudget(); });
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { bMax.value = money(+c.getAttribute('data-budget')); renderBudget(); }); });
    bMax.addEventListener('input', renderBudget);
    bMax.addEventListener('blur', function () { var v = parseMoney(bMax.value); if (v) bMax.value = money(v); });
    bDist.addEventListener('change', renderBudget);
    renderBudget();

    // ── Mode 2: house ──
    var hBeds = document.getElementById('h-beds'), hBaths = document.getElementById('h-baths'), hStyle = document.getElementById('h-style');
    var hSqft = document.getElementById('h-sqft'), hTol = document.getElementById('h-tol'), hMax = document.getElementById('h-max');
    var hBand = document.getElementById('h-band'), hMaxHint = document.getElementById('h-max-hint'), hOut = document.getElementById('house-out');
    var hChecks = document.getElementById('h-dist-checks'), hSum = document.getElementById('h-dist-sum');
    var cache = {}, reqId = 0;

    function fillSelect(sel, vals, def, anyLabel) {
      sel.innerHTML = (anyLabel ? '<option value="">' + anyLabel + '</option>' : '') + vals.map(function (v) {
        return '<option value="' + esc(v) + '"' + (String(v) === String(def) ? ' selected' : '') + '>' + esc(v) + '</option>';
      }).join('');
    }
    var beds = {}, baths = {};
    agg.house.combos.forEach(function (c) { var p = c.split('-'); if (+p[0] <= 6) beds[p[0]] = 1; if (+p[1] <= 6) baths[p[1]] = 1; });
    function keys(o) { return Object.keys(o).map(Number).sort(function (a, b) { return a - b; }); }
    fillSelect(hBeds, keys(beds), 3);
    fillSelect(hBaths, keys(baths), 2);
    fillSelect(hStyle, agg.house.styles, 'Ranch', 'Any style');
    districts.forEach(function (d) {
      var l = document.createElement('label');
      l.innerHTML = '<input type="checkbox" value="' + esc(d) + '" checked> ' + esc(d);
      hChecks.appendChild(l);
    });
    function chosen() { return Array.prototype.map.call(hChecks.querySelectorAll('input:checked'), function (i) { return i.value; }); }

    function load(key) {
      if (cache[key]) return Promise.resolve(cache[key]);
      if (agg.house.combos.indexOf(key) < 0) return Promise.resolve({});
      return fetch('/assets/data/sd-house/' + key + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) { cache[key] = j; return j; });
    }

    function readQuery() {
      var raw = parseNum(hSqft.value), maxIn = parseMoney(hMax.value);
      return {
        beds: +hBeds.value, baths: +hBaths.value, style: hStyle.value || null,
        sqftIn: raw, sqft: raw && raw >= 300 ? snapSqft(agg, raw) : null, tol: +hTol.value,
        maxIn: maxIn, max: maxIn && maxIn >= STEP ? snapBudget(agg, maxIn) : null,
        districts: chosen()
      };
    }
    function describe(q) {
      return [q.beds + ' bed', q.baths + ' bath', q.style ? q.style : 'any style', num(q.sqft - q.tol) + '–' + num(q.sqft + q.tol) + ' sq. ft.'].join(' · ');
    }

    function houseCard(d, s, q) {
      var wb = q.max != null ? withinBudget(s, q.max, STEP) : null;
      return '<article class="rcard"><h4>' + esc(d) + '</h4>' +
        '<dl><dt>Matching closed sales</dt><dd>' + s.count + '</dd>' +
        '<dt>Median sold price</dt><dd>' + money(s.median) + '</dd>' +
        '<dt>Middle 50% of sale prices</dt><dd>' + (s.count >= 2 ? money(s.p25) + '–' + money(s.p75) : '—') + '</dd>' +
        '<dt>Median days on market</dt><dd>' + (s.cdom == null ? '—' : s.cdom) + '</dd>' +
        '<dt>Sold above original asking</dt><dd>' + pct1(s.above) + '</dd>' +
        '<dt>Lowest / highest matching sale</dt><dd>' + money(s.low) + ' / ' + money(s.high) + '</dd>' +
        (wb != null ? '<dt>Within your budget</dt><dd>' + wb + ' of ' + s.count + '</dd>' : '') +
        '</dl>' +
        '<p class="extra">Median ' + num(s.sqft) + ' sq. ft. · built ' + yearTxt(s.year) + ' · median sale at ' + (s.ratio == null ? '—' : (s.ratio * 100).toFixed(1) + '%') + ' of original list</p>' +
        '<p class="means"><strong>What this means</strong>' + esc(sampleText(s.count)) + '</p>' +
        guideLink(d) + '</article>';
    }

    function total(file, ds, style, center, tol, max) {
      var n = 0;
      ds.forEach(function (d) { var c = cohort(file, d, style, center, tol); if (c) n += max != null ? withinBudget(c, max, STEP) : c.count; });
      return n;
    }

    function giveSection(file, q, sel, fc) {
      var cards = [];
      if (q.max != null) {
        var a = total(file, sel, q.style, q.sqft, q.tol, q.max + STEP), b = total(file, sel, q.style, q.sqft, q.tol, q.max + 2 * STEP);
        cards.push('<div class="give-card"><h4>Spend More</h4><ul><li>' + money(q.max + STEP) + ': <span class="big">' + a + '</span> matching sales (' + signed(a - fc) + ')</li><li>' + money(q.max + 2 * STEP) + ': <span class="big">' + b + '</span> matching sales (' + signed(b - fc) + ')</li></ul></div>');
      } else {
        cards.push('<div class="give-card"><h4>Spend More</h4><p>No maximum price is set, so budget isn’t what’s limiting these results. Add a maximum price above to see what +$25,000 or +$50,000 changes.</p></div>');
      }
      if (q.tol === 100) {
        var w = total(file, sel, q.style, q.sqft, 200, q.max);
        cards.push('<div class="give-card"><h4>Give Yourself More Room on Size</h4><p>' + num(q.sqft - 100) + '–' + num(q.sqft + 100) + ' becomes ' + num(q.sqft - 200) + '–' + num(q.sqft + 200) + ' sq. ft.</p><p><span class="big">' + w + '</span> matching sales (' + signed(w - fc) + ')</p></div>');
      }
      if (q.style) {
        var f = total(file, sel, null, q.sqft, q.tol, q.max);
        cards.push('<div class="give-card"><h4>Be Flexible on Style</h4><p>Same bedrooms, bathrooms, size, district and budget—any architectural style.</p><p><span class="big">' + f + '</span> matching sales (' + signed(f - fc) + ')</p></div>');
      }
      if (sel.length < districts.length) {
        var others = districts.filter(function (d) { return sel.indexOf(d) < 0; }).map(function (d) {
          return { d: d, n: total(file, [d], q.style, q.sqft, q.tol, q.max) };
        }).filter(function (x) { return x.n > 0; }).sort(function (x, y) { return y.n - x.n; }).slice(0, 3);
        cards.push('<div class="give-card"><h4>Look One District Over</h4><p>Same house criteria and budget. The other districts with the most matching sales:</p>' +
          (others.length ? '<ul>' + others.map(function (x) { return '<li>' + esc(x.d) + ': <span class="big">' + x.n + '</span></li>'; }).join('') + '</ul>' : '<p>No other district had a matching sale.</p>') + '</div>');
      }
      cards.push('<div class="give-card"><h4>Wait</h4><p>Only ' + fc + ' matching home' + (fc === 1 ? '' : 's') + ' closed during the ' + STUDY_DAYS + '-day study period.</p><p>That tells you this house type appeared infrequently in the historical sales data. It does not predict when the next one will be listed.</p></div>');
      return '<div class="give"><h3>Something Has to Give. Which Change Creates the Most Options?</h3><p class="fine" style="font-size:13px;color:var(--text-muted);">Each card changes one thing from your current search and keeps everything else the same.</p><div class="give-grid">' + cards.join('') + '</div></div>';
    }

    function renderHouse() {
      var q = readQuery(), sel = q.districts, my = ++reqId;
      hSum.textContent = sel.length === districts.length ? 'All districts' : sel.length === 0 ? 'No districts selected' : sel.length === 1 ? sel[0] : sel.length + ' districts selected';
      hBand.textContent = q.sqft != null ? 'About ' + num(q.sqft) + ' sq. ft. = ' + num(q.sqft - q.tol) + '–' + num(q.sqft + q.tol) + ' sq. ft. in this comparison' + (q.sqftIn !== q.sqft ? ' (rounded to the nearest 100)' : '') : 'Enter an approximate size.';
      hMaxHint.textContent = q.max != null && q.max !== q.maxIn ? 'Calculated at ' + money(q.max) + ' ($25,000 steps).' : '';
      if (q.sqft == null) { hOut.innerHTML = '<div class="result-head"><p>Enter an approximate square footage to compare.</p></div>'; return; }
      if (!sel.length) { hOut.innerHTML = '<div class="result-head"><p>Select at least one district to compare.</p></div>'; return; }
      load(q.beds + '-' + q.baths).then(function (file) {
        if (my !== reqId) return;
        var rows = sel.map(function (d) { return { d: d, s: cohort(file, d, q.style, q.sqft, q.tol) }; });
        var withM = rows.filter(function (x) { return x.s; }), zero = rows.filter(function (x) { return !x.s; }).map(function (x) { return x.d; });
        withM.sort(function (a, b) { return (b.s.count - a.s.count) || (a.s.median - b.s.median); });
        var all = withM.reduce(function (n, x) { return n + x.s.count; }, 0);
        var inBudget = q.max != null ? withM.reduce(function (n, x) { return n + withinBudget(x.s, q.max, STEP); }, 0) : null;
        var budgetLine = q.max != null ? '<p>' + inBudget + ' of ' + (all === 1 ? 'that sale' : 'those ' + all + ' sales') + ' closed at or below ' + money(q.max) + '.</p>' : '';
        var head;
        if (sel.length === 2 && withM.length === 2) {
          var A = withM[0], B = withM[1];
          head = '<h3>Same basic house. Different housing decision.</h3>' +
            '<p>In ' + esc(A.d) + ', ' + A.s.count + ' matching homes sold at a median of ' + money(A.s.median) + '.</p>' +
            '<p>In ' + esc(B.d) + ', ' + B.s.count + ' matching homes sold at a median of ' + money(B.s.median) + '.</p>' +
            '<p>The difference isn’t just ' + money(Math.abs(A.s.median - B.s.median)) + '.</p>' +
            '<p>It’s also ' + A.s.count + ' historical opportunities versus ' + B.s.count + '.</p>';
        } else if (sel.length === 1 && withM.length === 1) {
          var S = withM[0].s, D = withM[0].d;
          head = S.count < 5
            ? '<h3>Your budget might not be the problem. The house itself was hard to find.</h3><p>Only ' + S.count + ' home' + (S.count === 1 ? '' : 's') + ' matching your criteria closed in ' + esc(D) + ' during the study period.</p><p>The median matching sale was ' + money(S.median) + ', but with this few sales, the count may be more useful than the median.</p><p>You could have enough money to buy one and still have very few opportunities to act.</p>'
            : '<h3>This house showed up here more often.</h3><p>' + S.count + ' homes matching your criteria closed in ' + esc(D) + ' during the study period.</p><p>The median matching sale was ' + money(S.median) + ', with the middle half of matching sales between ' + money(S.p25) + ' and ' + money(S.p75) + '.</p><p>That gives you both sides of the decision: what similar homes cost and how often buyers actually had a chance to purchase one.</p>';
        } else if (!withM.length) {
          head = '<h3>No matching closed sales.</h3><p>No homes matching ' + esc(describe(q)) + ' closed in the selected district' + (sel.length === 1 ? '' : 's') + ' during the study period.</p>';
        } else {
          head = '<h3>' + all + ' matching closed sale' + (all === 1 ? '' : 's') + ' across ' + withM.length + ' of ' + sel.length + ' districts.</h3><p>' + esc(describe(q)) + '</p>';
        }
        var html = '<div class="result-head">' + head + (withM.length ? budgetLine : '') + '<p class="fine">' + INVENTORY_NOTE + '</p></div>';
        if (withM.length) html += '<div class="results-bar"><span class="count">' + esc(describe(q)) + '</span></div><div class="rcards">' + withM.map(function (x) { return houseCard(x.d, x.s, q); }).join('') + '</div>';
        if (zero.length && zero.length < sel.length) html += '<p class="zero-list"><strong style="color:var(--text-sub);">No matching sales in the study period:</strong> ' + zero.map(esc).join(', ') + '</p>';
        var focus = inBudget != null ? inBudget : all;
        if (focus < 10) html += giveSection(file, q, sel, focus);
        hOut.innerHTML = html;
      }).catch(function () {
        if (my === reqId) hOut.innerHTML = '<div class="result-head"><p>The comparison data didn’t load. Refresh the page to try again—the tables below have the same 2026 data.</p></div>';
      });
    }
    [hBeds, hBaths, hStyle, hTol].forEach(function (el) { el.addEventListener('change', renderHouse); });
    [hSqft, hMax].forEach(function (el) { el.addEventListener('input', renderHouse); });
    hMax.addEventListener('blur', function () { var v = parseMoney(hMax.value); hMax.value = v ? money(v) : ''; });
    hChecks.addEventListener('change', renderHouse);
    document.getElementById('h-dist-all').addEventListener('click', function () { hChecks.querySelectorAll('input').forEach(function (i) { i.checked = true; }); renderHouse(); });
    document.getElementById('h-dist-none').addEventListener('click', function () { hChecks.querySelectorAll('input').forEach(function (i) { i.checked = false; }); renderHouse(); });
    renderHouse();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
