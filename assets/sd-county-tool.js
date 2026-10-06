/* St. Louis County housing-by-school-district interactive.
 * Data: window.STLHJ_SD_DATA (assets/data/sd-county-sales-2026.js), QA-clean records only.
 * Progressive enhancement: every published answer also exists as static HTML on the page.
 * Percentiles use linear interpolation between ranked values (Excel PERCENTILE.INC). */
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

  // ── Engine (pure functions, exposed for testing) ──
  function sorted(v) { return v.slice().sort(function (a, b) { return a - b; }); }
  function pctile(v, p) {
    if (!v.length) return null;
    var s = sorted(v), h = (s.length - 1) * p, i = Math.floor(h);
    return s[i] + ((s[Math.min(i + 1, s.length - 1)] - s[i]) * (h - i));
  }
  function median(v) { return pctile(v, 0.5); }

  function build(raw) {
    var c = raw.cols, recs = [];
    for (var i = 0; i < raw.n; i++) {
      recs.push({ d: raw.districts[c.d[i]], p: c.p[i], o: c.o[i], c: c.c[i], b: c.b[i], t: c.t[i],
        s: raw.styles[c.s[i]], a: c.a[i], y: c.y[i] });
    }
    return recs;
  }

  function mode(vals) {
    var m = {}, best = null, n = 0;
    vals.forEach(function (v) { if (v == null) return; n++; m[v] = (m[v] || 0) + 1; if (best == null || m[v] > m[best]) best = v; });
    return best == null ? null : { value: +best, share: m[best] / n };
  }

  function budgetStats(recs, district, budget) {
    var all = recs.filter(function (r) { return r.d === district; });
    var hit = all.filter(function (r) { return r.p <= budget; });
    var areas = hit.filter(function (r) { return r.a > 0; }).map(function (r) { return r.a; });
    return {
      district: district, total: all.length, count: hit.length,
      share: all.length ? hit.length / all.length : 0,
      median: median(all.map(function (r) { return r.p; })),
      sqft: areas.length ? median(areas) : null,
      beds: mode(hit.map(function (r) { return r.b; })),
      baths: mode(hit.map(function (r) { return r.t; })),
      n: hit.length
    };
  }

  function houseMatch(recs, q) {
    return recs.filter(function (r) {
      if (q.districts && q.districts.indexOf(r.d) < 0) return false;
      if (q.beds != null && r.b !== q.beds) return false;
      if (q.baths != null && r.t !== q.baths) return false;
      if (q.style && (r.s || '').indexOf(q.style) < 0) return false;
      if (q.sqft != null) {
        if (!(r.a > 0)) return false;
        if (r.a < q.sqft - q.tol || r.a > q.sqft + q.tol) return false;
      }
      if (q.max != null && r.p > q.max) return false;
      return true;
    });
  }

  function houseStats(m, max) {
    var p = m.map(function (r) { return r.p; });
    var withOrig = m.filter(function (r) { return r.o > 0; });
    var cd = m.filter(function (r) { return r.c != null; }).map(function (r) { return r.c; });
    var yb = m.filter(function (r) { return r.y > 0; }).map(function (r) { return r.y; });
    return {
      count: m.length, median: median(p), p25: pctile(p, 0.25), p75: pctile(p, 0.75),
      sqft: median(m.filter(function (r) { return r.a > 0; }).map(function (r) { return r.a; })),
      year: median(yb), cdom: median(cd),
      ratio: median(withOrig.map(function (r) { return r.p / r.o; })),
      above: withOrig.length ? withOrig.filter(function (r) { return r.p > r.o; }).length / withOrig.length : null,
      low: p.length ? Math.min.apply(null, p) : null, high: p.length ? Math.max.apply(null, p) : null,
      withinBudget: max != null ? p.filter(function (x) { return x <= max; }).length : null
    };
  }

  window.STLHJ_SD = { pctile: pctile, median: median, build: build, budgetStats: budgetStats, houseMatch: houseMatch, houseStats: houseStats };

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
  function parseMoney(s) { var d = String(s || '').replace(/[^0-9.kK]/g, ''); if (!d) return null; var k = /k/i.test(d); var v = parseFloat(d.replace(/k/i, '')); if (isNaN(v)) return null; return Math.round(k ? v * 1000 : v); }
  function parseNum(s) { var d = String(s || '').replace(/[^0-9]/g, ''); return d ? parseInt(d, 10) : null; }
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
    if (s.n < 5 || !s.beds || !s.baths) return 'Too few sales to summarize';
    if (s.beds.share < 0.4 || s.baths.share < 0.4) return 'Mixed—no single typical layout';
    return 'Most often ' + s.beds.value + ' bed / ' + s.baths.value + ' bath';
  }

  function init() {
    var raw = window.STLHJ_SD_DATA;
    if (!raw) return;
    var recs = build(raw);
    var districts = raw.districts.slice();
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
    var bSort = 'share';
    districts.forEach(function (d) { var o = document.createElement('option'); o.value = d; o.textContent = d; bDist.appendChild(o); });
    var chips = document.querySelectorAll('[data-budget]');

    function budgetCard(s, budget) {
      var w = Math.max(s.share * 100, s.share > 0 ? 1.5 : 0);
      return '<article class="rcard"><h4>' + esc(s.district) + '</h4>' +
        '<div class="bar" aria-hidden="true"><span style="width:' + w.toFixed(1) + '%"></span></div>' +
        '<dl><dt>Sales within your budget</dt><dd>' + s.count + ' of ' + s.total + '</dd>' +
        '<dt>Share of district sales</dt><dd>' + pct1(s.share) + '</dd>' +
        '<dt>District median sale</dt><dd>' + money(s.median) + '</dd>' +
        '<dt>Typical size within your budget</dt><dd>' + (s.sqft ? num(s.sqft) + ' sq. ft.' : '—') + '</dd>' +
        '<dt>Typical bedrooms / bathrooms</dt><dd>' + esc(layoutText(s)) + '</dd></dl>' +
        '<p class="means"><strong>What this means</strong>' + esc(coverageText(s.share)) + '</p>' +
        guideLink(s.district) + '</article>';
    }

    function renderBudget() {
      var budget = parseMoney(bMax.value);
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(+c.getAttribute('data-budget') === budget)); });
      if (!budget || budget < 10000) { bOut.innerHTML = '<div class="result-head"><p>Enter a maximum purchase price to see results.</p></div>'; return; }
      var d = bDist.value;
      if (d) {
        var s = budgetStats(recs, d, budget), head;
        var p25 = budgetStats(recs, d, budget + 25000), p50 = budgetStats(recs, d, budget + 50000);
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
        bOut.innerHTML = '<div class="result-head">' + head + '<p class="fine">' + INVENTORY_NOTE + '</p></div>' +
          '<div class="delta-row">' +
          '<div class="delta">At ' + money(budget + 25000) + '<b>' + p25.count + ' sales · ' + pct1(p25.share) + '</b>' + (p25.count - s.count >= 0 ? '+' : '') + (p25.count - s.count) + ' vs. your budget</div>' +
          '<div class="delta">At ' + money(budget + 50000) + '<b>' + p50.count + ' sales · ' + pct1(p50.share) + '</b>' + (p50.count - s.count >= 0 ? '+' : '') + (p50.count - s.count) + ' vs. your budget</div>' +
          '</div><div class="rcards" style="margin-top:16px;">' + budgetCard(s, budget) + '</div>';
        return;
      }
      var list = districts.map(function (x) { return budgetStats(recs, x, budget); });
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
        '<div class="rcards">' + list.map(function (s) { return budgetCard(s, budget); }).join('') + '</div>';
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
    var hBand = document.getElementById('h-band'), hOut = document.getElementById('house-out');
    var hChecks = document.getElementById('h-dist-checks'), hSum = document.getElementById('h-dist-sum');

    function fillSelect(sel, vals, def, anyLabel) {
      sel.innerHTML = '<option value="">' + anyLabel + '</option>' + vals.map(function (v) {
        return '<option value="' + esc(v) + '"' + (String(v) === String(def) ? ' selected' : '') + '>' + esc(v) + '</option>';
      }).join('');
    }
    function present(key, min, max) {
      var seen = {}; recs.forEach(function (r) { if (r[key] >= min && r[key] <= max) seen[r[key]] = 1; });
      return Object.keys(seen).map(Number).sort(function (a, b) { return a - b; });
    }
    fillSelect(hBeds, present('b', 1, 7), 3, 'Any');
    fillSelect(hBaths, present('t', 1, 6), 2, 'Any');
    // Style options come from the dataset's own Architectural Style values (comma-separated tokens, 5+ sales).
    var tok = {};
    recs.forEach(function (r) { (r.s || '').split(',').forEach(function (t) { t = t.trim(); if (t) tok[t] = (tok[t] || 0) + 1; }); });
    var styleOpts = Object.keys(tok).filter(function (t) { return tok[t] >= 5; }).sort();
    fillSelect(hStyle, styleOpts, 'Ranch', 'Any style');
    districts.forEach(function (d, i) {
      var l = document.createElement('label');
      l.innerHTML = '<input type="checkbox" value="' + esc(d) + '" checked> ' + esc(d);
      hChecks.appendChild(l);
    });
    function chosen() { return Array.prototype.map.call(hChecks.querySelectorAll('input:checked'), function (i) { return i.value; }); }

    function query(over) {
      var q = {
        beds: hBeds.value === '' ? null : +hBeds.value,
        baths: hBaths.value === '' ? null : +hBaths.value,
        style: hStyle.value || null,
        sqft: parseNum(hSqft.value),
        tol: +hTol.value,
        max: parseMoney(hMax.value),
        districts: chosen()
      };
      if (q.sqft != null && q.sqft < 300) q.sqft = null;
      if (q.districts.length === districts.length) q.districts = null;
      if (over) Object.keys(over).forEach(function (k) { q[k] = over[k]; });
      return q;
    }
    function describe(q) {
      var p = [];
      p.push(q.beds == null ? 'any bedrooms' : q.beds + ' bed');
      p.push(q.baths == null ? 'any bathrooms' : q.baths + ' bath');
      p.push(q.style ? q.style : 'any style');
      if (q.sqft != null) p.push(num(q.sqft - q.tol) + '–' + num(q.sqft + q.tol) + ' sq. ft.');
      if (q.max != null) p.push('at or below ' + money(q.max));
      return p.join(' · ');
    }

    function houseCard(d, s, q) {
      return '<article class="rcard"><h4>' + esc(d) + '</h4>' +
        '<dl><dt>Matching closed sales</dt><dd>' + s.count + '</dd>' +
        '<dt>Median sold price</dt><dd>' + money(s.median) + '</dd>' +
        '<dt>Middle 50% of sale prices</dt><dd>' + (s.count >= 2 ? money(s.p25) + '–' + money(s.p75) : '—') + '</dd>' +
        '<dt>Median days on market</dt><dd>' + (s.cdom == null ? '—' : (s.cdom % 1 ? s.cdom.toFixed(1) : s.cdom)) + '</dd>' +
        '<dt>Sold above original asking</dt><dd>' + pct1(s.above) + '</dd>' +
        '<dt>Lowest / highest matching sale</dt><dd>' + money(s.low) + ' / ' + money(s.high) + '</dd>' +
        (q.max != null ? '<dt>Within your budget</dt><dd>' + s.count + ' of ' + s.anyPrice + ' at any price</dd>' : '') +
        '</dl>' +
        '<p class="extra">Median ' + num(s.sqft) + ' sq. ft. · built ' + yearTxt(s.year) + ' · median sale at ' + (s.ratio == null ? '—' : (s.ratio * 100).toFixed(1) + '%') + ' of original list</p>' +
        '<p class="means"><strong>What this means</strong>' + esc(sampleText(s.count)) + '</p>' +
        guideLink(d) + '</article>';
    }

    function giveSection(q, focusCount) {
      var cards = [];
      // Spend more
      if (q.max != null) {
        var a = houseMatch(recs, query({ max: q.max + 25000 })).length, b = houseMatch(recs, query({ max: q.max + 50000 })).length;
        cards.push('<div class="give-card"><h4>Spend More</h4><ul><li>' + money(q.max + 25000) + ': <span class="big">' + a + '</span> matching sales (' + (a - focusCount >= 0 ? '+' : '') + (a - focusCount) + ')</li><li>' + money(q.max + 50000) + ': <span class="big">' + b + '</span> matching sales (' + (b - focusCount >= 0 ? '+' : '') + (b - focusCount) + ')</li></ul></div>');
      } else {
        cards.push('<div class="give-card"><h4>Spend More</h4><p>No maximum price is set, so budget isn’t what’s limiting these results. Add a maximum price above to see what +$25,000 or +$50,000 changes.</p></div>');
      }
      // Size
      if (q.sqft != null) {
        var w = houseMatch(recs, query({ tol: q.tol + 100 })).length;
        cards.push('<div class="give-card"><h4>Give Yourself More Room on Size</h4><p>' + num(q.sqft - q.tol) + '–' + num(q.sqft + q.tol) + ' becomes ' + num(q.sqft - q.tol - 100) + '–' + num(q.sqft + q.tol + 100) + ' sq. ft.</p><p><span class="big">' + w + '</span> matching sales (' + (w - focusCount >= 0 ? '+' : '') + (w - focusCount) + ')</p></div>');
      }
      // Style
      if (q.style) {
        var f = houseMatch(recs, query({ style: null })).length;
        cards.push('<div class="give-card"><h4>Be Flexible on Style</h4><p>Same bedrooms, bathrooms, size, district and budget—any architectural style.</p><p><span class="big">' + f + '</span> matching sales (' + (f - focusCount >= 0 ? '+' : '') + (f - focusCount) + ')</p></div>');
      }
      // District
      if (q.districts) {
        var others = districts.filter(function (d) { return q.districts.indexOf(d) < 0; }).map(function (d) {
          return { d: d, n: houseMatch(recs, query({ districts: [d] })).length };
        }).filter(function (x) { return x.n > 0; }).sort(function (x, y) { return y.n - x.n; }).slice(0, 3);
        cards.push('<div class="give-card"><h4>Look One District Over</h4><p>Same house criteria and budget. The other districts with the most matching sales:</p>' +
          (others.length ? '<ul>' + others.map(function (x) { return '<li>' + esc(x.d) + ': <span class="big">' + x.n + '</span></li>'; }).join('') + '</ul>' : '<p>No other district had a matching sale.</p>') + '</div>');
      }
      // Wait
      cards.push('<div class="give-card"><h4>Wait</h4><p>Only ' + focusCount + ' matching home' + (focusCount === 1 ? '' : 's') + ' closed during the ' + STUDY_DAYS + '-day study period.</p><p>That tells you this house type appeared infrequently in the historical sales data. It does not predict when the next one will be listed.</p></div>');
      return '<div class="give"><h3>Something Has to Give. Which Change Creates the Most Options?</h3><p class="fine" style="font-size:13px;color:var(--text-muted);">Each card changes one thing from your current search and keeps everything else the same.</p><div class="give-grid">' + cards.join('') + '</div></div>';
    }

    function renderHouse() {
      var q = query();
      var sel = q.districts || districts;
      hSum.textContent = q.districts ? (sel.length === 0 ? 'No districts selected' : sel.length === 1 ? sel[0] : sel.length + ' districts selected') : 'All districts';
      hBand.textContent = q.sqft != null ? 'About ' + num(q.sqft) + ' sq. ft. = ' + num(q.sqft - q.tol) + '–' + num(q.sqft + q.tol) + ' sq. ft. in this comparison' : 'Any size';
      if (!sel.length) { hOut.innerHTML = '<div class="result-head"><p>Select at least one district to compare.</p></div>'; return; }
      var m = houseMatch(recs, q);
      var by = {}; sel.forEach(function (d) { by[d] = []; }); m.forEach(function (r) { by[r.d].push(r); });
      var anyPrice = {};
      if (q.max != null) houseMatch(recs, query({ max: null })).forEach(function (r) { anyPrice[r.d] = (anyPrice[r.d] || 0) + 1; });
      var withM = sel.filter(function (d) { return by[d].length; }).map(function (d) {
        var st = houseStats(by[d], q.max); st.anyPrice = anyPrice[d] || 0; return { d: d, s: st };
      });
      var zero = sel.filter(function (d) { return !by[d].length; });
      withM.sort(function (a, b) { return (b.s.count - a.s.count) || (a.s.median - b.s.median); });
      var head;
      if (sel.length === 2 && withM.length === 2) {
        var A = withM[0], B = withM[1], diff = Math.abs(A.s.median - B.s.median);
        head = '<h3>Same basic house. Different housing decision.</h3>' +
          '<p>In ' + esc(A.d) + ', ' + A.s.count + ' matching homes sold at a median of ' + money(A.s.median) + '.</p>' +
          '<p>In ' + esc(B.d) + ', ' + B.s.count + ' matching homes sold at a median of ' + money(B.s.median) + '.</p>' +
          '<p>The difference isn’t just ' + money(diff) + '.</p>' +
          '<p>It’s also ' + A.s.count + ' historical opportunities versus ' + B.s.count + '.</p>';
      } else if (sel.length === 1 && withM.length === 1) {
        var S = withM[0].s, D = withM[0].d;
        head = S.count < 5
          ? '<h3>Your budget might not be the problem. The house itself was hard to find.</h3><p>Only ' + S.count + ' home' + (S.count === 1 ? '' : 's') + ' matching your criteria closed in ' + esc(D) + ' during the study period.</p><p>The median matching sale was ' + money(S.median) + ', but with this few sales, the count may be more useful than the median.</p><p>You could have enough money to buy one and still have very few opportunities to act.</p>'
          : '<h3>This house showed up here more often.</h3><p>' + S.count + ' homes matching your criteria closed in ' + esc(D) + ' during the study period.</p><p>The median matching sale was ' + money(S.median) + ', with the middle half of matching sales between ' + money(S.p25) + ' and ' + money(S.p75) + '.</p><p>That gives you both sides of the decision: what similar homes cost and how often buyers actually had a chance to purchase one.</p>';
      } else if (m.length === 0) {
        head = '<h3>No matching closed sales.</h3><p>No homes matching ' + esc(describe(q)) + ' closed in the selected district' + (sel.length === 1 ? '' : 's') + ' during the study period.</p>';
      } else {
        head = '<h3>' + m.length + ' matching closed sale' + (m.length === 1 ? '' : 's') + ' across ' + withM.length + ' of ' + sel.length + ' districts.</h3><p>' + esc(describe(q)) + '</p>';
      }
      var html = '<div class="result-head">' + head + '<p class="fine">' + INVENTORY_NOTE + '</p></div>';
      if (withM.length) html += '<div class="results-bar"><span class="count">' + esc(describe(q)) + '</span></div><div class="rcards">' + withM.map(function (x) { return houseCard(x.d, x.s, q); }).join('') + '</div>';
      if (zero.length && zero.length < sel.length) html += '<p class="zero-list"><strong style="color:var(--text-sub);">No matching sales in the study period:</strong> ' + zero.map(esc).join(', ') + '</p>';
      if (m.length < 10) html += giveSection(q, m.length);
      hOut.innerHTML = html;
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
