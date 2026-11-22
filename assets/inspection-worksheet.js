/* Inspection Negotiation Worksheet (STL Home Journey)
   Mounts on <div id="iw-app" data-src="/assets/data/repair-costs-2026.json">.
   Cost ranges come from the repair cost guide via scripts/build-repair-costs.py.
   Everything stays in this browser (localStorage key below); nothing is sent anywhere. */
(function () {
  'use strict';
  var app = document.getElementById('iw-app');
  if (!app) return;
  var KEY = 'stlhj-inspection-worksheet-v1';
  var COSTS = [];
  var SRC = { source: '', url: '/articles/stl-home-repair-cost-guide', updated: '' };
  var URG = [
    ['safety', 'Safety hazard or active failure'],
    ['required', 'Required by the lender or an occupancy inspection'],
    ['aging', 'Old but still working'],
    ['cosmetic', 'Cosmetic, or visible at the showing']
  ];
  var LEV = { strong: 'Strong leverage', limited: 'Limited leverage', none: 'No real leverage' };
  var CAP = { conv: 0.03, fha: 0.06, va: 0.04 };
  var S = load() || fresh();

  function fresh() {
    return { items: [], basis: 'mid', share: 100, price: '', down: 5, rate: 7, term: 30, loan: 'conv', cc: '',
      form: 'credit', counter: '', counterForm: 'credit', checks: {} };
  }
  function load() { try { var v = JSON.parse(localStorage.getItem(KEY)); return v && v.items ? v : null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function $(sel, el) { return (el || app).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || app).querySelectorAll(sel)); }
  function money(n) { n = Math.round(n || 0); return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US'); }
  function num(v) { v = String(v == null ? '' : v).replace(/[$,\s]/g, ''); var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid() { return 'i' + Math.random().toString(36).slice(2, 9); }

  /* ---------- per-item math ---------- */
  function range(it) {
    if (it.cat >= 0 && COSTS[it.cat]) return [COSTS[it.cat].low, COSTS[it.cat].high];
    var lo = num(it.low), hi = num(it.high);
    return lo || hi ? [lo || hi, hi || lo] : null;
  }
  function value(it) {
    var q = num(it.quote);
    if (q > 0) return q;
    var r = range(it);
    if (!r) return 0;
    if (S.basis === 'low') return r[0];
    if (S.basis === 'high') return r[1];
    return (r[0] + r[1]) / 2;
  }
  function leverage(it) {
    if (it.urg === 'cosmetic') return 'none';
    if (it.urg === 'aging' || it.disclosed) return 'limited';
    return 'strong';
  }
  function totals() {
    var t = { repairs: 0, strong: 0, limited: 0, none: 0, request: 0, included: [], quotes: 0 };
    S.items.forEach(function (it) {
      var v = value(it), l = leverage(it);
      t.repairs += v; t[l] += v;
      if (num(it.quote) > 0) t.quotes++;
      if (it.include) { t.request += v * S.share / 100; t.included.push(it); }
    });
    t.request = Math.round(t.request / 100) * 100;
    return t;
  }
  function pmt(loan, ratePct, years) {
    var r = ratePct / 100 / 12, n = years * 12;
    if (loan <= 0) return 0;
    return r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
  }
  function itemName(it) { return it.cat >= 0 && COSTS[it.cat] ? COSTS[it.cat].item : (it.name || 'Other repair'); }
  function matches(it, re) { return re.test(itemName(it) + ' ' + (it.name || '')); }

  /* ---------- George (Chapter 1-2 bubble pattern) ---------- */
  function george(html) {
    return '<div class="inp-george-row iw-george" role="note"><div class="inp-g-face"><img src="/assets/george-face-144.webp" alt="George Kindler" width="52" height="52" loading="lazy"><div class="fb" aria-hidden="true">GK</div></div><div class="inp-bubble">' + html + '</div></div>';
  }
  var STORY = {
    lake: 'On a 1970s lake cabin, the septic was failing. Financed buyers need a working system at closing, so it changed who could buy the house, not just the repair budget. We asked for $20,000, built from three estimates that landed in the same range. The sellers countered at $15,000; we held, and they agreed. <a href="/articles/lessons-from-a-sale-ste-genevieve-septic">The septic that changed who could buy &rarr;</a>',
    cedar: 'A specific, documented concern can get a practical answer. Elevated radon on a 2025 Cedar Hill purchase became a $1,000 concession, with mitigation arranged after closing. <a href="/articles/lessons-from-a-sale-cedar-hill-creek-side">How that inspection was negotiated &rarr;</a>',
    imperial: 'Winning isn&rsquo;t getting everything. On one of my Imperial listings, buyers came back with a $4,000 request built on contractor bids, and it settled at $2,000. The question is whether the cost you&rsquo;re left with still makes sense for this house. <a href="/articles/lessons-from-a-sale-imperial-country-glen">How the bids changed the negotiation &rarr;</a>',
    maple: 'When the seller does the repair, you inherit the quality of that work. On a Maplewood sale the repairs failed the final walk-through, and the fix became a $16,820 price cut. The agreement has to solve the problem, not check a box: get receipts, lien waivers and a look before closing. <a href="/articles/lessons-from-a-sale-maplewood-maple-avenue">The Maple Avenue sale &rarr;</a>'
  };

  /* ---------- render ---------- */
  function render() {
    var opts = COSTS.map(function (c, i) { return '<option value="' + i + '">' + esc(c.item) + '</option>'; }).join('');
    app.innerHTML =
      '<div class="iw-step" id="iw-a"><h3><span class="iw-n">A</span> Build your repair list</h3>' +
      '<p class="iw-help">Add each finding from the report. The range fills in from the 2026 repair cost guide; a written contractor quote replaces it.</p>' +
      '<div class="iw-add"><label class="iw-lbl" for="iw-pick">Add a finding</label><div class="iw-addrow"><select id="iw-pick"><option value="">Choose an item&hellip;</option>' + opts + '<option value="-1">Something else (enter your own numbers)</option></select><button type="button" class="iw-btn" id="iw-addbtn">Add</button></div></div>' +
      '<div id="iw-list"></div><div id="iw-a-george"></div></div>' +

      '<div class="iw-step" id="iw-b"><h3><span class="iw-n">B</span> Repair cost vs. negotiating leverage</h3>' +
      '<p class="iw-help">A repair costs what it costs. Leverage comes from safety problems and active failures you couldn&rsquo;t see when you made your offer.</p>' +
      '<div id="iw-lev"></div><div id="iw-range"></div><div id="iw-b-george"></div></div>' +

      '<div class="iw-step" id="iw-c"><h3><span class="iw-n">C</span> Your proposed request</h3>' +
      '<div class="iw-grid2"><div><span class="iw-lbl">Starting point for each estimate</span><div class="iw-seg" role="radiogroup" aria-label="Estimate basis">' +
      seg('basis', 'mid', 'Midpoint') + seg('basis', 'low', 'Low end') + seg('basis', 'high', 'High end') + '</div><p class="iw-mini">A written quote always replaces the range.</p></div>' +
      '<div><label class="iw-lbl" for="iw-share">Share you ask the seller to cover</label><select id="iw-share">' +
      [100, 75, 50, 25].map(function (v) { return '<option value="' + v + '">' + v + '%</option>'; }).join('') + '</select><p class="iw-mini">Applies to the items checked &ldquo;Ask for this.&rdquo;</p></div></div>' +
      '<div id="iw-req"></div><div id="iw-c-george"></div></div>' +

      '<div class="iw-step" id="iw-d"><h3><span class="iw-n">D</span> Credit, price reduction or seller repair?</h3>' +
      '<p class="iw-help">Same dollar amount, different effect on your cash, your loan and the work itself. Enter your loan to see it.</p>' +
      '<div class="iw-grid4">' +
      field('price', 'Contract price', '$', 'e.g. 300,000') + field('down', 'Down payment %', '%', '5') +
      field('rate', 'Example rate %', '%', '7') + field('cc', 'Your closing costs (optional)', '$', 'from your Loan Estimate') +
      '</div><div class="iw-grid2"><div><label class="iw-lbl" for="iw-loan">Loan type</label><select id="iw-loan"><option value="conv">Conventional</option><option value="fha">FHA</option><option value="va">VA</option></select></div>' +
      '<div><label class="iw-lbl" for="iw-term">Term</label><select id="iw-term"><option value="30">30 years</option><option value="15">15 years</option></select></div></div>' +
      '<div class="iw-seg iw-forms" role="radiogroup" aria-label="Form of the concession">' +
      seg('form', 'credit', 'Seller credit') + seg('form', 'reduction', 'Price reduction') + seg('form', 'repair', 'Seller repairs') + seg('form', 'none', 'No agreement') + '</div>' +
      '<div id="iw-form"></div><div id="iw-d-george"></div></div>' +

      '<div class="iw-step" id="iw-e"><h3><span class="iw-n">E</span> The seller responded. Now what?</h3>' +
      '<div class="iw-grid2">' + field('counter', 'Seller&rsquo;s counteroffer', '$', 'amount they offered') +
      '<div><label class="iw-lbl" for="iw-cform">In the form of</label><select id="iw-cform"><option value="credit">Seller credit</option><option value="reduction">Price reduction</option><option value="repair">Seller repairs</option></select></div></div>' +
      '<div id="iw-counter"></div><div id="iw-e-george"></div></div>' +

      '<div class="iw-step" id="iw-f"><h3><span class="iw-n">F</span> Your negotiation summary</h3>' +
      '<p class="iw-help">Copy the summary, or print it. Nothing you enter leaves this page.</p>' +
      '<pre class="iw-sum" id="iw-sum" tabindex="0"></pre><div class="iw-row"><button type="button" class="iw-btn" id="iw-copy">Copy summary</button><button type="button" class="iw-btn ghost" id="iw-print">Print</button><button type="button" class="iw-btn ghost" id="iw-reset">Start over</button></div></div>';
    $('#iw-share').value = String(S.share);
    $('#iw-loan').value = S.loan; $('#iw-term').value = String(S.term); $('#iw-cform').value = S.counterForm;
    ['price', 'down', 'rate', 'cc', 'counter'].forEach(function (k) { var el = $('#iw-' + k); if (el) el.value = S[k]; });
    bind();
    update();
  }
  function seg(name, val, label) {
    return '<button type="button" role="radio" class="iw-segb" data-seg="' + name + '" data-val="' + val + '" aria-checked="false">' + label + '</button>';
  }
  function field(k, label, unit, ph) {
    return '<div><label class="iw-lbl" for="iw-' + k + '">' + label + '</label><div class="iw-in"><span>' + (unit === '$' ? '$' : '') + '</span><input id="iw-' + k + '" inputmode="decimal" autocomplete="off" placeholder="' + ph + '"><span>' + (unit === '%' ? '%' : '') + '</span></div></div>';
  }

  function valText(it) {
    return 'Counts as <strong>' + money(value(it)) + '</strong>' + (num(it.quote) > 0 ? ' (your quote)' : range(it) ? ' (' + ({ mid: 'midpoint', low: 'low end', high: 'high end' })[S.basis] + ' of the range)' : ' &mdash; enter an estimate');
  }
  function refreshItem(it) {
    var el = app.querySelector('.iw-item[data-id="' + it.id + '"]');
    if (!el) return;
    var l = leverage(it), tag = el.querySelector('.iw-tag');
    tag.className = 'iw-tag ' + l; tag.textContent = LEV[l];
    el.querySelector('.iw-val').innerHTML = valText(it);
    var inc = el.querySelector('input[data-f="include"]'); if (inc) inc.checked = !!it.include;
    var nm = el.querySelector('.iw-item-hd strong'); if (nm) nm.textContent = itemName(it);
  }

  function renderList() {
    var box = $('#iw-list');
    if (!S.items.length) { box.innerHTML = '<p class="iw-empty">No findings yet. Add the items from your inspection report above.</p>'; return; }
    box.innerHTML = S.items.map(function (it, i) {
      var r = range(it), l = leverage(it), custom = !(it.cat >= 0);
      return '<div class="iw-item" data-id="' + it.id + '"><div class="iw-item-hd"><strong>' + esc(itemName(it)) + '</strong>' +
        '<span class="iw-tag ' + l + '">' + LEV[l] + '</span>' +
        '<span class="iw-item-tools"><button type="button" class="iw-ic" data-act="up" aria-label="Move up"' + (i ? '' : ' disabled') + '>&uarr;</button><button type="button" class="iw-ic" data-act="down" aria-label="Move down"' + (i < S.items.length - 1 ? '' : ' disabled') + '>&darr;</button><button type="button" class="iw-ic" data-act="del" aria-label="Remove">&times;</button></span></div>' +
        (custom ? '<div class="iw-grid3"><div><label class="iw-lbl">What it is</label><input data-f="name" value="' + esc(it.name) + '" placeholder="e.g. septic system"></div><div><label class="iw-lbl">Low estimate $</label><input data-f="low" inputmode="decimal" value="' + esc(it.low) + '"></div><div><label class="iw-lbl">High estimate $</label><input data-f="high" inputmode="decimal" value="' + esc(it.high) + '"></div></div>' :
          '<p class="iw-mini">2026 expected range: ' + money(r[0]) + ' to ' + money(r[1]) + (COSTS[it.cat].open_ended ? '+' : '') + (COSTS[it.cat].note ? ' &middot; ' + esc(COSTS[it.cat].note).replace(/--/g, '&ndash;') : '') + '</p>') +
        '<div class="iw-grid2"><div><label class="iw-lbl">Urgency</label><select data-f="urg">' + URG.map(function (u) { return '<option value="' + u[0] + '"' + (it.urg === u[0] ? ' selected' : '') + '>' + u[1] + '</option>'; }).join('') + '</select></div>' +
        '<div><label class="iw-lbl">Written contractor quote $</label><input data-f="quote" inputmode="decimal" value="' + esc(it.quote) + '" placeholder="optional"></div></div>' +
        '<div class="iw-checks"><label><input type="checkbox" data-f="disclosed"' + (it.disclosed ? ' checked' : '') + '> Disclosed or visible before my offer</label>' +
        '<label><input type="checkbox" data-f="confirmed"' + (it.confirmed ? ' checked' : '') + '> Confirmed by a contractor</label>' +
        '<label class="iw-ask"><input type="checkbox" data-f="include"' + (it.include ? ' checked' : '') + '> Ask for this</label></div>' +
        '<p class="iw-val">' + valText(it) + '</p></div>';
    }).join('');
  }

  function renderLeverage(t) {
    var rows = [['strong', t.strong], ['limited', t.limited], ['none', t.none]];
    $('#iw-lev').innerHTML = '<div class="iw-kpis"><div><span>Total repair cost</span><strong>' + money(t.repairs) + '</strong></div>' +
      rows.map(function (r) { return '<div class="' + r[0] + '"><span>' + LEV[r[0]] + '</span><strong>' + money(r[1]) + '</strong></div>'; }).join('') + '</div>';
    /* range chart */
    var items = S.items.filter(function (it) { return range(it) || num(it.quote) > 0; });
    if (!items.length) { $('#iw-range').innerHTML = ''; return; }
    var max = 0; items.forEach(function (it) { var r = range(it) || [0, 0]; max = Math.max(max, r[1], num(it.quote)); });
    max = Math.ceil(max / 5000) * 5000 || 5000;
    var W = 320, rowH = 34, H = items.length * rowH + 26, x = function (v) { return 8 + (W - 16) * v / max; };
    var svg = '<svg class="iw-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Cost range for each repair on your list">';
    items.forEach(function (it, i) {
      var y = i * rowH + 18, r = range(it), q = num(it.quote), v = value(it);
      svg += '<text x="8" y="' + (y - 6) + '" class="iw-tx">' + esc(itemName(it)).slice(0, 44) + '</text>';
      svg += '<line x1="' + x(0) + '" x2="' + x(max) + '" y1="' + (y + 4) + '" y2="' + (y + 4) + '" class="iw-axis"/>';
      if (r) svg += '<rect x="' + x(r[0]) + '" y="' + y + '" width="' + Math.max(2, x(r[1]) - x(r[0])) + '" height="8" rx="4" class="iw-rng"/>';
      svg += '<circle cx="' + x(v) + '" cy="' + (y + 4) + '" r="5" class="iw-dot"/>';
      if (q > 0) svg += '<rect x="' + (x(q) - 4) + '" y="' + y + '" width="8" height="8" transform="rotate(45 ' + x(q) + ' ' + (y + 4) + ')" class="iw-q"/>';
    });
    svg += '<text x="8" y="' + (H - 2) + '" class="iw-tx dim">$0</text><text x="' + (W - 8) + '" y="' + (H - 2) + '" text-anchor="end" class="iw-tx dim">' + money(max) + '</text></svg>';
    $('#iw-range').innerHTML = '<p class="iw-lbl">Cost range per item</p>' + svg +
      '<p class="iw-mini"><span class="k rng"></span>2026 expected range <span class="k dot"></span>what the worksheet counts <span class="k q"></span>your quote. Ranges: <a href="' + SRC.url + '">' + esc(SRC.source) + '</a>' + (SRC.updated ? ', updated ' + esc(SRC.updated) : '') + '.</p>';
  }

  function renderRequest(t) {
    $('#iw-req').innerHTML = '<div class="iw-big"><span>Proposed request</span><strong>' + money(t.request) + '</strong><em>' +
      t.included.length + ' of ' + S.items.length + ' item' + (S.items.length === 1 ? '' : 's') + ' &middot; ' + S.share + '% of the ' + ({ mid: 'midpoint', low: 'low end', high: 'high end' })[S.basis] + ' or your quote</em></div>';
    var g = [];
    if (S.items.length && t.repairs >= 1000 && t.strong < t.repairs * 0.6)
      g.push('Your list adds up to ' + money(t.repairs) + ', but ' + money(t.repairs) + ' in repairs isn&rsquo;t ' + money(t.repairs) + ' in leverage. Only ' + money(t.strong) + ' of it is safety items or active failures you couldn&rsquo;t see at the offer. That&rsquo;s the part a seller has a hard time saying no to.');
    if (S.items.some(function (it) { return it.include && leverage(it) === 'none'; }))
      g.push('Take the cosmetic items off. Every one you add gives the seller a reason to counter or reject the whole request. I&rsquo;ve seen a deal fall apart over a $200 faucet that was in the listing photos.');
    if (S.basis === 'high') g.push('Asking for the top of every range looks like cherry-picking. The midpoint is defensible, and it&rsquo;s harder for a seller to reject without looking unreasonable.');
    if (S.share < 100 && t.included.length) g.push('A ' + S.share + '% share is a choice, not a formula. Pick it because the house still makes sense at that number, and know your walk-away number before you send it.');
    if (t.request > 8000 && t.quotes === 0) g.push('In my experience, credits or reductions after inspection typically run $2,000 to $8,000. Major items can justify more, but only with contractor estimates behind each line.');
    setG('#iw-c-george', g.length ? george(g[0]) + (g[1] ? george(g[1]) : '') : (S.items.length ? george('Start with the midpoint of each range and swap in written quotes as they come in. A documented request is harder to turn down than a round number.') : ''));
  }
  /* redraw George only when his message changes, and animate only his first appearance */
  function setG(sel, html) {
    var el = $(sel);
    if (!el || el._h === html) return;
    el.classList.toggle('iw-noanim', !!el._h && !!html);
    el._h = html; el.innerHTML = html;
  }

  function renderForm(t) {
    var price = num(S.price), down = num(S.down) / 100, rate = num(S.rate), req = t.request, out = '';
    if (!price) { $('#iw-form').innerHTML = '<p class="iw-empty">Enter the contract price to compare the four options.</p>'; setG('#iw-d-george', S.form === 'repair' ? george(STORY.maple) : ''); return; }
    var loan0 = price * (1 - down), p0 = pmt(loan0, rate, S.term);
    if (S.form === 'credit') {
      var cap = price * CAP[S.loan], cc = num(S.cc), usable = Math.min(req, cap, cc > 0 ? cc : Infinity), over = Math.max(0, req - usable);
      out = row('Cash needed at closing', '&minus;' + money(usable), 'The credit pays closing costs you would otherwise bring.') +
        row('Monthly payment', 'No change', money(p0) + ' principal and interest at your inputs.') +
        row('Who fixes it', 'You, after closing', 'You pick the contractor and check the work.') +
        row('Limit', money(cap), ({ conv: 'Conventional: typically 3% of the price with 5% down (more with a larger down payment; ask your lender).', fha: 'FHA allows up to 6% of the price.', va: 'VA allows up to 4% plus reasonable closing costs.' })[S.loan] + ' A credit also can&rsquo;t exceed your actual closing costs.') +
        (over > 0 ? '<p class="iw-warn">' + money(over) + ' of the request won&rsquo;t fit as a credit' + (cc > 0 ? ' under your closing costs or the limit' : ' under the limit') + '. That part would need to be a price reduction.</p>' : '');
    } else if (S.form === 'reduction') {
      var loan1 = (price - req) * (1 - down), p1 = pmt(loan1, rate, S.term);
      out = row('New price', money(price - req), 'Down from ' + money(price) + '.') +
        row('Loan amount', money(loan1), 'Down ' + money(loan0 - loan1) + ' at ' + Math.round(down * 100) + '% down.') +
        row('Monthly payment', '&minus;' + money(p0 - p1), money(p1) + ' principal and interest instead of ' + money(p0) + ', at ' + rate + '% for ' + S.term + ' years.') +
        row('Cash at closing', '&minus;' + money(req * down), 'Your down payment shrinks with the price. The repair money still comes from you.') +
        '<p class="iw-mini">A lower price helps most when the appraisal is tight or you&rsquo;re already at the credit limit.</p>';
    } else if (S.form === 'repair') {
      out = row('Cash at closing', 'No change', '') + row('Monthly payment', 'No change', '') +
        row('Who fixes it', 'The seller, before closing', 'You inherit the quality of that work.') +
        '<p class="iw-mini">Get receipts, lien waivers and a reinspection or a look at the walk-through. On FHA and VA loans, required repairs often have to be done this way.</p>';
    } else {
      out = row('What you still pay for', money(t.repairs), 'Every item on your list, after closing.') +
        '<p class="iw-mini">Within your inspection period, the contract&rsquo;s options decide whether you can still cancel. Your contract&rsquo;s dates control.</p>';
    }
    $('#iw-form').innerHTML = '<div class="iw-rows">' + out + '</div>';
    setG('#iw-d-george', S.form === 'repair' ? george(STORY.maple) :
      S.form === 'credit' ? george('A credit puts the work in your hands: you control who does it and when, and you can check the quality. On a go/no-go item, like a failing panel or active water, I want it fixed before closing instead.') : '');
  }
  function row(k, v, note) { return '<div class="iw-r"><span>' + k + '</span><strong>' + v + '</strong>' + (note ? '<em>' + note + '</em>' : '') + '</div>'; }

  function renderCounter(t) {
    var c = num(S.counter), base = c > 0 ? c : t.request, label = c > 0 ? 'Seller covers' : 'Your request covers';
    var seller = Math.min(base, t.repairs), you = Math.max(0, t.repairs - seller);
    var bar = '';
    if (t.repairs > 0) {
      var W = 320, sw = Math.round(W * seller / t.repairs);
      bar = '<svg class="iw-chart" viewBox="0 0 ' + W + ' 54" role="img" aria-label="' + label + ' ' + money(seller) + ' of ' + money(t.repairs) + ' in repairs; you cover ' + money(you) + '">' +
        '<rect x="0" y="6" width="' + W + '" height="22" rx="4" class="iw-you"/><rect x="0" y="6" width="' + sw + '" height="22" rx="4" class="iw-seller"/>' +
        '<text x="0" y="46" class="iw-tx">' + label + ' ' + money(seller) + '</text><text x="' + W + '" y="46" text-anchor="end" class="iw-tx">You cover ' + money(you) + '</text></svg>';
    }
    var html = '<p class="iw-lbl">Total repairs ' + money(t.repairs) + '</p>' + bar;
    var g = '';
    if (c > 0) {
      var gap = Math.max(0, t.request - c);
      var strong = S.items.filter(function (it) { return leverage(it) === 'strong'; }).sort(function (a, b) { return value(b) - value(a); });
      var left = c, open = [];
      strong.forEach(function (it) { var v = value(it); if (left >= v) left -= v; else open.push(itemName(it)); });
      html += '<div class="iw-rows">' + row('Below your request by', money(gap), '') + row('You still pay for', money(you), 'Repairs not covered by the counter.') +
        row('Safety or active items not fully covered', open.length ? String(open.length) : 'None', open.join(', ')) + '</div>';
      if (S.counterForm === 'repair') g = george(STORY.maple);
      else if (t.request > 0 && c <= t.request * 0.75) g = george(STORY.imperial);
    } else html += '<p class="iw-mini">Enter the seller&rsquo;s number to see what you&rsquo;d still be paying for.</p>';
    $('#iw-counter').innerHTML = html;
    setG('#iw-e-george', g);
  }

  function stories(t) {
    var a = '', b = '';
    if (S.items.some(function (it) { return matches(it, /radon/i); }) || (S.items.length && S.items.every(function (it) { return value(it) <= 2000; }) && t.repairs > 0 && t.repairs <= 2000))
      a = george(STORY.cedar);
    if (S.items.some(function (it) { return matches(it, /septic|sewer lateral|foundation repair \(major\)|waterproofing \(exterior\)/i); }) || t.repairs >= 15000)
      b = george(STORY.lake);
    setG('#iw-a-george', a);
    setG('#iw-b-george', b);
  }

  function summary(t) {
    var L = [], price = num(S.price), c = num(S.counter);
    L.push('INSPECTION NEGOTIATION SUMMARY (' + new Date().toLocaleDateString('en-US') + ')');
    if (price) L.push('Contract price: ' + money(price));
    L.push('');
    L.push('FINDINGS');
    S.items.forEach(function (it, i) {
      L.push((i + 1) + '. ' + itemName(it) + ' | ' + (URG.filter(function (u) { return u[0] === it.urg; })[0] || ['', ''])[1] + ' | ' + LEV[leverage(it)] +
        ' | counts as ' + money(value(it)) + (num(it.quote) > 0 ? ' (quote)' : '') + (it.confirmed ? ' | contractor confirmed' : '') + (it.disclosed ? ' | known before offer' : '') + (it.include ? ' | IN REQUEST' : ''));
    });
    if (!S.items.length) L.push('(none entered)');
    L.push('');
    L.push('Total repair cost: ' + money(t.repairs) + '  (strong leverage ' + money(t.strong) + ', limited ' + money(t.limited) + ', none ' + money(t.none) + ')');
    L.push('Proposed request: ' + money(t.request) + ' as a ' + ({ credit: 'seller credit', reduction: 'price reduction', repair: 'seller repair', none: '(no agreement)' })[S.form]);
    if (c > 0) L.push('Seller counter: ' + money(c) + ' as a ' + ({ credit: 'seller credit', reduction: 'price reduction', repair: 'seller repair' })[S.counterForm] + '. You would still pay about ' + money(Math.max(0, t.repairs - c)) + '.');
    L.push('');
    L.push('EVIDENCE CHECKLIST');
    $$('.iw-evid input', document).forEach(function (cb) { L.push((cb.checked ? '[x] ' : '[ ] ') + cb.getAttribute('data-label')); });
    L.push('');
    L.push('Ranges: 2026 expected costs, stlhomejourney.com repair cost guide. Planning numbers, not quotes. Your contract\'s deadlines control.');
    $('#iw-sum').textContent = L.join('\n');
  }

  function update(keepList) {
    var t = totals();
    $$('.iw-segb').forEach(function (b) { b.setAttribute('aria-checked', String(S[b.getAttribute('data-seg')] === b.getAttribute('data-val'))); });
    if (keepList) S.items.forEach(refreshItem); else renderList();
    renderLeverage(t); renderRequest(t); renderForm(t); renderCounter(t); stories(t); summary(t);
    save();
  }

  /* ---------- events ---------- */
  function bind() {
    $('#iw-addbtn').addEventListener('click', function () {
      var v = $('#iw-pick').value; if (v === '') return;
      var cat = parseInt(v, 10), name = cat >= 0 ? COSTS[cat].item : '';
      var urg = /panel|foundation repair \(major\)|rewire|radon/i.test(name) ? 'safety' : /hvac|condenser|water heater|roof/i.test(name) ? 'aging' : 'safety';
      S.items.push({ id: uid(), cat: cat, catName: name, name: '', low: '', high: '', quote: '', urg: urg, disclosed: false, confirmed: false, include: urg !== 'aging' });
      $('#iw-pick').value = ''; update();
    });
    app.addEventListener('click', function (e) {
      var b = e.target.closest('[data-seg]');
      if (b) { S[b.getAttribute('data-seg')] = b.getAttribute('data-val'); update(true); return; }
      var act = e.target.closest('[data-act]');
      if (act) {
        var id = act.closest('.iw-item').getAttribute('data-id'), i = S.items.findIndex(function (x) { return x.id === id; });
        var a = act.getAttribute('data-act');
        if (a === 'del') S.items.splice(i, 1);
        if (a === 'up' && i > 0) S.items.splice(i - 1, 0, S.items.splice(i, 1)[0]);
        if (a === 'down' && i < S.items.length - 1) S.items.splice(i + 1, 0, S.items.splice(i, 1)[0]);
        update();
      }
    });
    app.addEventListener('change', function (e) {
      var el = e.target, it = el.closest('.iw-item');
      if (it && el.getAttribute('data-f')) {
        var o = S.items.filter(function (x) { return x.id === it.getAttribute('data-id'); })[0], f = el.getAttribute('data-f');
        o[f] = el.type === 'checkbox' ? el.checked : el.value;
        if (f === 'urg') o.include = leverage(o) === 'strong';
        if (f === 'disclosed' && el.checked) o.include = false;
        update(true); return;
      }
      if (el.id === 'iw-share') S.share = parseInt(el.value, 10);
      if (el.id === 'iw-loan') S.loan = el.value;
      if (el.id === 'iw-term') S.term = parseInt(el.value, 10);
      if (el.id === 'iw-cform') S.counterForm = el.value;
      if (/^iw-(price|down|rate|cc|counter)$/.test(el.id)) S[el.id.slice(3)] = el.value;
      update(true);
    });
    app.addEventListener('input', function (e) {
      var el = e.target, it = el.closest('.iw-item');
      if (!it || !/^(quote|low|high|name)$/.test(el.getAttribute('data-f') || '')) return;
      var o = S.items.filter(function (x) { return x.id === it.getAttribute('data-id'); })[0];
      o[el.getAttribute('data-f')] = el.value; update(true);
    });
    $$('#iw-price,#iw-down,#iw-rate,#iw-cc,#iw-counter').forEach(function (el) {
      el.addEventListener('input', function () { S[el.id.slice(3)] = el.value; var t = totals(); renderForm(t); renderCounter(t); summary(t); save(); });
    });
    $('#iw-copy').addEventListener('click', function () {
      var txt = $('#iw-sum').textContent, btn = this;
      function done(ok) { btn.textContent = ok ? 'Copied' : 'Select the text to copy'; setTimeout(function () { btn.textContent = 'Copy summary'; }, 2200); }
      try { navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(false); }); } catch (x) { done(false); }
    });
    $('#iw-print').addEventListener('click', function () { document.body.classList.add('iw-printing'); window.print(); setTimeout(function () { document.body.classList.remove('iw-printing'); }, 500); });
    $('#iw-reset').addEventListener('click', function () { if (confirm('Clear your list and start over?')) { S = fresh(); render(); syncEvid(); } });
  }

  /* evidence checklist lives in the article; it feeds the summary */
  function syncEvid() {
    $$('.iw-evid input', document).forEach(function (cb) {
      var k = cb.getAttribute('data-k'); cb.checked = !!S.checks[k];
      if (!cb._iw) { cb._iw = 1; cb.addEventListener('change', function () { S.checks[k] = cb.checked; summary(totals()); save(); }); }
    });
  }
  /* case explorer + seller-response tree (article sections) */
  function tabs(root, btnSel, panelSel) {
    if (!root) return;
    var btns = Array.prototype.slice.call(root.querySelectorAll(btnSel)), panels = Array.prototype.slice.call(root.querySelectorAll(panelSel));
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        btns.forEach(function (x, j) { x.setAttribute('aria-selected', String(i === j)); x.tabIndex = i === j ? 0 : -1; });
        panels.forEach(function (p, j) { p.hidden = i !== j; });
      });
    });
  }
  tabs(document.getElementById('iw-cases'), '[role="tab"]', '[role="tabpanel"]');
  tabs(document.getElementById('iw-tree'), '[role="tab"]', '[role="tabpanel"]');

  fetch(app.getAttribute('data-src')).then(function (r) { return r.json(); }).then(function (d) {
    SRC = { source: d.source, url: d.source_url, updated: d.updated };
    COSTS = d.items.filter(function (i) { return !/inspection|scope|cleaning/i.test(i.item); });
    var names = COSTS.map(function (c) { return c.item; });
    S.items.forEach(function (it) { if (it.catName) it.cat = names.indexOf(it.catName); if (it.cat < 0 && it.catName && !it.name) it.name = it.catName; });
    render(); syncEvid();
  }).catch(function () {
    app.innerHTML = '<p class="iw-empty">The worksheet couldn&rsquo;t load its cost data. Refresh the page, or use the table below.</p>';
  });
})();
