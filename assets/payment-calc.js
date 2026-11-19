/* STL Home Journey monthly payment calculator.
   Mounts on every <div class="pay-calc" id="..."> on the page. Settings come from data attributes:
     data-price, data-rate, data-type (conv|fha|va), data-down (percent), data-tax (yearly $),
     data-ins (yearly $), data-hoa (yearly $), data-label (house name for the summary),
     data-districts="1" (show the "Don't know the taxes?" picker), data-store="key" (remember inputs).
   Without data-tax / data-ins the tax and insurance follow the price (1.12% and 1% a year, the same
   assumptions the "How much house can I afford" guides use) until the visitor types a number.
   The <p class="pay-static"> inside the container is the crawler-readable description; it is replaced on load.
   window.STLHJPay.calc(inputs) is the pure math, used by the page's example table too. */
(function () {
  'use strict';
  var TAX_RATE = 1.12, INS_RATE = 1.0;

  function pmiRate(ltv) { if (ltv <= 80) return 0; if (ltv > 95) return 0.75; if (ltv > 90) return 0.60; if (ltv > 85) return 0.45; return 0.30; }
  function fhaMip(ltv, term) { return term > 15 ? (ltv > 95 ? 0.55 : 0.50) : (ltv > 90 ? 0.40 : 0.15); }
  function vaFee(dp, use) { if (use === 'exempt') return 0; if (dp >= 10) return 1.25; if (dp >= 5) return 1.5; return use === 'sub' ? 3.3 : 2.15; }
  function creditCap(type, dp) { return type === 'fha' ? 6 : type === 'va' ? 4 : (dp < 10 ? 3 : dp <= 25 ? 6 : 9); }

  /* i: {price, rate, term, type, down (dollars), tax, ins, hoa (yearly), pmi (%/yr or null for auto), vaUse, ccPct, credit} */
  function calc(i) {
    var price = Math.max(+i.price || 0, 0), down = Math.min(Math.max(+i.down || 0, 0), price);
    var dp = price > 0 ? down / price * 100 : 0, base = price - down, ltv = price > 0 ? base / price * 100 : 0;
    var term = +i.term || 30, rate = +i.rate || 0, loan = base, mi = 0, miRate = 0, fee = 0, minDown = 0;
    if (i.type === 'fha') { fee = base * 0.0175; loan = base + fee; miRate = fhaMip(ltv, term); mi = base * miRate / 100 / 12; minDown = 3.5; }
    else if (i.type === 'va') { var f = vaFee(dp, i.vaUse); fee = base * f / 100; loan = base + fee; miRate = f; }
    else { miRate = ltv > 80 ? (i.pmi == null ? pmiRate(ltv) : +i.pmi) : 0; mi = base * miRate / 100 / 12; minDown = 3; }
    var r = rate / 100 / 12, n = term * 12;
    var pi = loan > 0 ? (r > 0 ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n) : 0;
    var tax = (+i.tax || 0) / 12, ins = (+i.ins || 0) / 12, hoa = (+i.hoa || 0) / 12;
    var total = pi + tax + ins + mi + hoa;
    var cc = price * (+i.ccPct || 0) / 100, ins1 = +i.ins || 0, esc = tax * 3 + ins * 2, pint = loan * rate / 100 / 365 * 15;
    var costs = cc + ins1 + esc + pint, cap = price * creditCap(i.type, dp) / 100;
    var credit = Math.min(Math.max(+i.credit || 0, 0), costs, cap);
    return { price: price, down: down, dp: dp, ltv: ltv, base: base, loan: loan, fee: fee, pi: pi, tax: tax, ins: ins, hoa: hoa, mi: mi,
             miRate: miRate, total: total, cc: cc, ins1: ins1, esc: esc, pint: pint, credit: credit, creditAsked: +i.credit || 0,
             capPct: creditCap(i.type, dp), cap: cap, cash: down + costs - credit, belowMin: dp + 1e-9 < minDown, minDown: minDown };
  }

  var num = function (v) { var n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isFinite(n) ? n : 0; };
  var usd = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var TYPE = { conv: 'Conventional', fha: 'FHA', va: 'VA' };
  var districtData = null, districtWait = [];
  function loadDistricts(cb) {
    if (districtData) return cb(districtData);
    districtWait.push(cb); if (districtWait.length > 1) return;
    fetch('/assets/data/district-tax-2026.json').then(function (r) { return r.json(); }).then(function (d) {
      districtData = d; districtWait.splice(0).forEach(function (f) { f(d); });
    }).catch(function () { districtWait.splice(0).forEach(function (f) { f(null); }); });
  }

  function mount(el) {
    var d = el.dataset, id = el.id || 'pay';
    var st = {
      price: num(d.price || 250000), rate: d.rate || '7', term: '30', type: d.type || 'conv', downMode: 'pct', down: d.down || '5',
      tax: d.tax ? num(d.tax) : null, ins: d.ins ? num(d.ins) : null, hoa: num(d.hoa || 0), pmi: null, vaUse: 'first', ccPct: '2.5', credit: 0, district: ''
    };
    var DEF = JSON.parse(JSON.stringify(st));
    if (d.store) { try { var sv = JSON.parse(localStorage.getItem(d.store) || 'null'); if (sv) for (var k in sv) if (k in st) st[k] = sv[k]; } catch (e) {} }
    var p = function (s) { return id + '-' + s; };
    el.innerHTML =
      '<div class="pc-grid"><div class="pc-in">' +
      '<div class="pc-row"><div class="pc-f"><label for="' + p('price') + '">Purchase price</label><div class="pc-inp"><span>$</span><input id="' + p('price') + '" inputmode="numeric"></div></div>' +
      '<div class="pc-f"><label for="' + p('rate') + '">Interest rate</label><div class="pc-inp"><input id="' + p('rate') + '" inputmode="decimal"><span>%</span></div><span class="pc-hint">Use the rate your lender quotes you.</span></div></div>' +
      '<div class="pc-f"><span class="pc-lbl" id="' + p('tl') + '">Loan type</span><div class="pc-seg" role="group" aria-labelledby="' + p('tl') + '">' +
      ['conv', 'fha', 'va'].map(function (t) { return '<button type="button" data-t="' + t + '">' + TYPE[t] + '</button>'; }).join('') + '</div></div>' +
      '<div class="pc-row"><div class="pc-f"><div class="pc-lr"><label for="' + p('down') + '">Down payment</label><span class="pc-mode"><button type="button" class="pc-mini" data-m="pct">%</button><button type="button" class="pc-mini" data-m="amt">$</button></span></div>' +
      '<div class="pc-inp"><span class="pc-dpre">$</span><input id="' + p('down') + '" inputmode="decimal"><span class="pc-dsuf">%</span></div><span class="pc-hint pc-decho"></span></div>' +
      '<div class="pc-f"><label for="' + p('term') + '">Loan term</label><div class="pc-inp"><select id="' + p('term') + '"><option value="30">30 years</option><option value="15">15 years</option></select></div></div></div>' +
      '<div class="pc-f pc-pmibox"><div class="pc-lr"><label for="' + p('pmi') + '">PMI rate (per year)</label><button type="button" class="pc-mini pc-pmiauto">Auto</button></div><div class="pc-inp"><input id="' + p('pmi') + '" inputmode="decimal"><span>%</span></div><span class="pc-hint">Auto uses typical rates by down payment. Your credit score changes it, so type your lender&rsquo;s quote when you have one.</span></div>' +
      '<div class="pc-f pc-vabox"><label for="' + p('vause') + '">VA funding fee</label><div class="pc-inp"><select id="' + p('vause') + '"><option value="first">First use</option><option value="sub">Used a VA loan before</option><option value="exempt">Exempt (VA disability rating)</option></select></div></div>' +
      (d.districts ? '<div class="pc-f"><label for="' + p('dist') + '">Don&rsquo;t know the taxes? Pick the school district</label><div class="pc-inp"><select id="' + p('dist') + '"><option value="">Choose a district&hellip;</option></select></div><span class="pc-hint pc-dnote"></span></div>' : '') +
      '<div class="pc-row"><div class="pc-f"><label for="' + p('tax') + '">Property taxes (per year)</label><div class="pc-inp"><span>$</span><input id="' + p('tax') + '" inputmode="numeric"></div><span class="pc-hint pc-taxh"></span></div>' +
      '<div class="pc-f"><label for="' + p('ins') + '">Homeowners insurance (per year)</label><div class="pc-inp"><span>$</span><input id="' + p('ins') + '" inputmode="numeric"></div><span class="pc-hint pc-insh"></span></div></div>' +
      '<div class="pc-row"><div class="pc-f"><label for="' + p('hoa') + '">HOA dues (per year)</label><div class="pc-inp"><span>$</span><input id="' + p('hoa') + '" inputmode="numeric"></div></div>' +
      '<div class="pc-f"><label for="' + p('cc') + '">Closing costs</label><div class="pc-inp"><input id="' + p('cc') + '" inputmode="decimal"><span>% of price</span></div></div></div>' +
      '<div class="pc-f"><label for="' + p('credit') + '">Seller credit toward your costs</label><div class="pc-inp"><span>$</span><input id="' + p('credit') + '" inputmode="numeric"></div><span class="pc-hint pc-crh"></span></div>' +
      '</div><div class="pc-out" aria-live="polite">' +
      '<div class="pc-k">Monthly payment</div><div class="pc-big"></div><div class="pc-bar" aria-hidden="true"><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="b4"></i><i class="b5"></i></div>' +
      '<dl class="pc-dl"><dt><b class="s1"></b>Principal &amp; interest</dt><dd class="o-pi"></dd><dt><b class="s2"></b>Property taxes</dt><dd class="o-tax"></dd><dt><b class="s3"></b>Insurance</dt><dd class="o-ins"></dd><dt><b class="s4"></b><span class="o-mil"></span></dt><dd class="o-mi"></dd><dt class="pc-hoarow"><b class="s5"></b>HOA</dt><dd class="o-hoa pc-hoarow"></dd></dl>' +
      '<dl class="pc-dl pc-tot"><dt>Loan amount</dt><dd class="o-loan"></dd></dl><p class="pc-hint pc-lnote"></p><div class="pc-warn"></div>' +
      '<div class="pc-k pc-k2">Estimated cash to close</div><div class="pc-cash"></div>' +
      '<dl class="pc-dl"><dt>Down payment</dt><dd class="c-down"></dd><dt>Closing costs</dt><dd class="c-cc"></dd><dt>First year of insurance</dt><dd class="c-ins"></dd><dt>Escrow deposit</dt><dd class="c-esc"></dd><dt>Prepaid interest (15 days)</dt><dd class="c-int"></dd><dt>Seller credit</dt><dd class="c-cr"></dd></dl>' +
      '<p class="pc-hint">Escrow deposit is 3 months of taxes and 2 months of insurance. Earnest money you already deposited counts toward this total. <a href="/articles/buyer-closing-costs-st-louis">What&rsquo;s in closing costs &rarr;</a></p>' +
      '<div class="pc-act"><button type="button" class="pc-btn pc-copy">Copy summary</button><button type="button" class="pc-btn pc-ghost pc-reset">Start over</button></div>' +
      '<textarea class="pc-sum" readonly hidden aria-label="Payment summary"></textarea></div></div>';

    var q = function (s) { return el.querySelector(s); }, $ = function (s) { return document.getElementById(p(s)); };
    function fill() {
      $('price').value = fmt(st.price); $('rate').value = st.rate; $('term').value = st.term; $('vause').value = st.vaUse; $('cc').value = st.ccPct;
      $('hoa').value = fmt(st.hoa); $('credit').value = fmt(st.credit);
      $('down').value = st.down; if (st.district && $('dist')) $('dist').value = st.district;
      render();
    }
    function read() {
      st.price = num($('price').value); st.rate = $('rate').value; st.term = $('term').value; st.vaUse = $('vause').value; st.ccPct = $('cc').value;
      st.hoa = num($('hoa').value); st.credit = num($('credit').value); st.down = $('down').value;
    }
    function inputs() {
      var price = st.price, downD = st.downMode === 'pct' ? price * num(st.down) / 100 : num(st.down);
      return { price: price, rate: num(st.rate), term: +st.term, type: st.type, down: downD, tax: st.tax == null ? price * TAX_RATE / 100 : st.tax,
               ins: st.ins == null ? price * INS_RATE / 100 : st.ins, hoa: st.hoa, pmi: st.pmi, vaUse: st.vaUse, ccPct: num(st.ccPct), credit: st.credit };
    }
    function render() {
      var I = inputs(), R = calc(I);
      el.querySelectorAll('.pc-seg button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.t === st.type ? 'true' : 'false'); });
      el.querySelectorAll('.pc-mode button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.m === st.downMode ? 'true' : 'false'); });
      q('.pc-dpre').hidden = st.downMode !== 'amt'; q('.pc-dsuf').hidden = st.downMode !== 'pct';
      q('.pc-pmibox').hidden = st.type !== 'conv'; q('.pc-vabox').hidden = st.type !== 'va';
      q('.pc-pmiauto').setAttribute('aria-pressed', st.pmi == null ? 'true' : 'false');
      if (document.activeElement !== $('pmi')) $('pmi').value = st.type === 'conv' && R.ltv > 80 ? R.miRate.toFixed(2) : (st.pmi == null ? '0.00' : st.pmi);
      if (document.activeElement !== $('tax')) $('tax').value = fmt(I.tax);
      if (document.activeElement !== $('ins')) $('ins').value = fmt(I.ins);
      q('.pc-taxh').textContent = st.tax == null ? 'Estimated at 1.12% of the price. Use the listing’s tax bill when you have it.' : (st.district ? '' : 'From you or the listing.');
      q('.pc-insh').textContent = st.ins == null ? 'Estimated at 1% of the price. Replace it with an insurance quote.' : '';
      q('.pc-decho').textContent = st.downMode === 'pct' ? usd(R.down) + ' down' : (Math.round(R.dp * 100) / 100) + '% down';
      q('.pc-big').innerHTML = usd(R.total) + '<small> /mo</small>';
      q('.o-pi').textContent = usd(R.pi); q('.o-tax').textContent = usd(R.tax); q('.o-ins').textContent = usd(R.ins); q('.o-mi').textContent = usd(R.mi); q('.o-hoa').textContent = usd(R.hoa);
      el.querySelectorAll('.pc-hoarow').forEach(function (x) { x.hidden = !(R.hoa > 0); });
      var mil = st.type === 'fha' ? 'FHA mortgage insurance (' + R.miRate.toFixed(2) + '%/yr)' : st.type === 'va' ? 'Mortgage insurance (none on VA)' : (R.ltv > 80 ? 'PMI (' + R.miRate.toFixed(2) + '%/yr)' : 'PMI (none at 20% down)');
      q('.o-mil').textContent = mil;
      var tot = R.total || 1;
      [R.pi, R.tax, R.ins, R.mi, R.hoa].forEach(function (v, k) { q('.b' + (k + 1)).style.width = (v / tot * 100) + '%'; });
      q('.o-loan').textContent = usd(R.loan);
      q('.pc-lnote').textContent = st.type === 'fha' ? 'Includes ' + usd(R.fee) + ' upfront FHA mortgage insurance (1.75%) added to the ' + usd(R.base) + ' base loan.' :
        st.type === 'va' ? (R.fee ? 'Includes ' + usd(R.fee) + ' VA funding fee (' + R.miRate + '%) added to the ' + usd(R.base) + ' base loan.' : 'No VA funding fee (exempt).') :
        (R.ltv > 80 ? 'PMI can come off once the balance reaches 80% of the original value.' : '');
      var w = [];
      if (R.belowMin) w.push(TYPE[st.type] + ' needs at least ' + R.minDown + '% down (' + usd(R.price * R.minDown / 100) + ').');
      if (R.creditAsked > R.credit + 0.5) w.push('Seller credit capped at ' + usd(R.credit) + ': the loan limit or your total costs.');
      q('.pc-warn').innerHTML = w.map(function (x) { return '<p class="pc-note">' + esc(x) + '</p>'; }).join('');
      q('.pc-crh').textContent = TYPE[st.type] + ' limit at this down payment: ' + R.capPct + '% of the price (' + usd(R.cap) + ')' + (st.type === 'va' ? ', plus normal closing costs' : '') + '.';
      q('.pc-cash').textContent = usd(R.cash);
      q('.c-down').textContent = usd(R.down); q('.c-cc').textContent = usd(R.cc); q('.c-ins').textContent = usd(R.ins1); q('.c-esc').textContent = usd(R.esc); q('.c-int').textContent = usd(R.pint);
      q('.c-cr').textContent = R.credit ? '−' + usd(R.credit) : '$0';
      var lab = d.label ? d.label + ': ' : '';
      q('.pc-sum').value = [
        lab + usd(R.price) + ' purchase, ' + TYPE[st.type] + ', ' + (Math.round(R.dp * 100) / 100) + '% down (' + usd(R.down) + '), ' + st.rate + '% for ' + st.term + ' years',
        'Monthly payment: about ' + usd(R.total),
        '  Principal & interest ' + usd(R.pi) + ' | Taxes ' + usd(R.tax) + ' | Insurance ' + usd(R.ins) + (R.mi > 0 ? ' | Mortgage insurance ' + usd(R.mi) : '') + (R.hoa > 0 ? ' | HOA ' + usd(R.hoa) : ''),
        'Estimated cash to close: about ' + usd(R.cash),
        'Estimate only; your lender’s Loan Estimate has the exact numbers.',
        'George Kindler, 314.435.1087 · stlhomejourney.com/mortgage-payment-calculator-st-louis'
      ].join('\n');
      if (d.store) { try { localStorage.setItem(d.store, JSON.stringify(st)); } catch (e) {} }
    }

    el.addEventListener('input', function (e) {
      var t = e.target;
      if (t === $('tax')) { st.tax = num(t.value); st.district = ''; if ($('dist')) $('dist').value = ''; }
      else if (t === $('ins')) st.ins = num(t.value);
      else if (t === $('pmi')) st.pmi = num(t.value);
      read(); render();
    });
    el.addEventListener('change', function (e) {
      var t = e.target;
      if ($('dist') && t === $('dist')) {
        st.district = t.value; var row = districtData && districtData.districts.filter(function (x) { return x.district === t.value; })[0];
        if (row) { st.tax = row.median; q('.pc-dnote').textContent = row.district + ': median 2026 bill ' + usd(row.median) + ', middle half ' + usd(row.low) + '–' + usd(row.high) + ' (' + row.sales + ' sales). The bill follows the county’s assessed value, not the price, so use the listing’s bill when you have it.'; }
        else q('.pc-dnote').textContent = '';
      }
      read(); render();
    });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !el.contains(b)) return;
      if (b.dataset.t) { st.type = b.dataset.t; render(); }
      else if (b.dataset.m && b.dataset.m !== st.downMode) {
        var cur = num($('down').value), price = st.price;
        st.down = b.dataset.m === 'amt' ? fmt(price * cur / 100) : String(price > 0 ? Math.round(cur / price * 10000) / 100 : 0);
        st.downMode = b.dataset.m; $('down').value = st.down; render();
      }
      else if (b.classList.contains('pc-pmiauto')) { st.pmi = st.pmi == null ? num($('pmi').value) : null; render(); }
      else if (b.classList.contains('pc-reset')) { st = JSON.parse(JSON.stringify(DEF)); el.querySelectorAll('.pc-dnote').forEach(function (x) { x.textContent = ''; }); if ($('dist')) $('dist').value = ''; fill(); }
      else if (b.classList.contains('pc-copy')) {
        var ta = q('.pc-sum'), done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy summary'; }, 1600); };
        var fb = function () { ta.hidden = false; ta.focus(); ta.select(); b.textContent = 'Selected: copy it'; };
        try { navigator.clipboard.writeText(ta.value).then(done, fb); } catch (x) { fb(); }
      }
    });
    el.addEventListener('focusout', function (e) {
      var t = e.target; if ([$('price'), $('tax'), $('ins'), $('hoa'), $('credit')].indexOf(t) >= 0) t.value = fmt(num(t.value));
      if (t === $('tax') || t === $('ins')) render();
    });
    if ($('dist')) loadDistricts(function (dd) {
      if (!dd) { $('dist').closest('.pc-f').hidden = true; return; }
      var groups = {}; dd.districts.forEach(function (x) { (groups[x.county] = groups[x.county] || []).push(x); });
      $('dist').innerHTML = '<option value="">Choose a district&hellip;</option>' + Object.keys(groups).map(function (c) {
        return '<optgroup label="' + esc(c) + '">' + groups[c].map(function (x) { return '<option value="' + esc(x.district) + '">' + esc(x.district) + ' (median ' + usd(x.median) + ')</option>'; }).join('') + '</optgroup>';
      }).join('');
      if (st.district) $('dist').value = st.district;
    });
    fill();
  }

  window.STLHJPay = { calc: calc, pmiRate: pmiRate };
  function init() { document.querySelectorAll('.pay-calc').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
