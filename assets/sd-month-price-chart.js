/* Monthly median sale price by school district, 2026.
   Reads every value from the crawlable #mp-table so the chart and table
   can never disagree. One district at a time, drawn over the county-wide
   median. Months with too few sales have no data-v and leave a gap. */
(function () {
  'use strict';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
  var NS = 'http://www.w3.org/2000/svg';
  var GOLD = '#FFCC4D', GRAY = '#9AA4B2';

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function money(v) { return '$' + Math.round(v).toLocaleString('en-US'); }
  function short(v) {
    if (v === 0) return '$0';
    if (v >= 1000000) return '$' + (v / 1000000).toFixed(v % 1000000 ? 2 : 0).replace(/0$/, '') + 'M';
    return '$' + Math.round(v / 1000) + 'K';
  }
  function sales(n) { return n + (n === 1 ? ' sale' : ' sales'); }

  function rowData(tr) {
    return Array.prototype.map.call(tr.querySelectorAll('td'), function (td) {
      var v = td.getAttribute('data-v');
      return { v: v == null || v === '' ? null : parseFloat(v), n: parseInt(td.getAttribute('data-n'), 10) || 0 };
    });
  }

  function init() {
    var table = document.getElementById('mp-table');
    var box = document.getElementById('mp-chart');
    var select = document.getElementById('mp-select');
    var readout = document.getElementById('mp-readout');
    if (!table || !box || !select || !readout) return;
    var countyRow = table.querySelector('tr[data-county]');
    if (!countyRow) return;
    var county = { name: countyRow.getAttribute('data-name'), pts: rowData(countyRow) };
    var dists = [];
    Array.prototype.forEach.call(table.querySelectorAll('tbody tr[data-name]:not([data-county])'), function (tr) {
      var pts = rowData(tr);
      if (pts.filter(function (p) { return p.v != null; }).length >= 3) dists.push({ name: tr.getAttribute('data-name'), pts: pts });
    });
    if (!dists.length) return;
    dists.forEach(function (d, i) {
      var o = document.createElement('option');
      o.value = i; o.textContent = d.name;
      select.appendChild(o);
    });
    var def = select.getAttribute('data-default');
    dists.forEach(function (d, i) { if (d.name === def) select.value = i; });

    function draw(d) {
      var W = Math.round(Math.max(300, Math.min(760, box.clientWidth || 520))), H = W < 500 ? 240 : 280, l = 58, r = 16, t = 22, b = 30, iw = W - l - r, ih = H - t - b;
      var vals = [];
      d.pts.concat(county.pts).forEach(function (p) { if (p.v != null) vals.push(p.v); });
      var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
      var step = [10000, 25000, 50000, 100000, 250000, 500000].filter(function (s) { return (hi - lo) / s <= 4; })[0] || 500000;
      var ymin = Math.floor(lo / step) * step, ymax = Math.ceil(hi / step) * step;
      if (ymax === ymin) ymax += step;
      var X = function (i) { return l + iw * i / 8; };
      var Y = function (v) { return t + ih * (1 - (v - ymin) / (ymax - ymin)); };
      var title = d.name + ' median sale price by closing month, January–September 2026, with the ' + county.name + ' median';
      var svg = el('svg', { 'class': 'pm-chart', viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': title, preserveAspectRatio: 'xMidYMid meet' });
      el('title', {}, svg).textContent = title;
      for (var v = ymin; v <= ymax + 1; v += step) {
        el('line', { 'class': 'pm-grid', x1: l, x2: W - r, y1: Y(v), y2: Y(v) }, svg);
        el('text', { 'class': 'pm-tick', x: l - 8, y: Y(v) + 4, 'text-anchor': 'end' }, svg).textContent = short(v);
      }
      MONTHS.forEach(function (m, i) {
        el('text', { 'class': 'pm-tick', x: X(i), y: H - 8, 'text-anchor': i === 0 ? 'start' : (i === 8 ? 'end' : 'middle') }, svg).textContent = W < 440 ? m.charAt(0) : m;
      });
      function line(pts, color, width, dash) {
        var seg = [];
        function flush() {
          if (seg.length > 1) el('polyline', { fill: 'none', stroke: color, 'stroke-width': width, 'stroke-dasharray': dash, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', points: seg.join(' ') }, svg);
          seg = [];
        }
        pts.forEach(function (p, i) { if (p.v == null) flush(); else seg.push(X(i).toFixed(1) + ',' + Y(p.v).toFixed(1)); });
        flush();
      }
      line(county.pts, GRAY, 2, '6 4');
      line(d.pts, GOLD, 3, '');
      county.pts.forEach(function (p, i) {
        if (p.v == null) return;
        var c = el('circle', { cx: X(i), cy: Y(p.v), r: 2.5, fill: GRAY }, svg);
        el('title', {}, c).textContent = county.name + ', ' + MONTHS_LONG[i] + ' 2026: ' + money(p.v) + ' (' + sales(p.n) + ')';
      });
      d.pts.forEach(function (p, i) {
        if (p.v == null) return;
        var c = el('circle', { 'class': 'pm-dot', cx: X(i), cy: Y(p.v), r: 4.5, fill: GOLD }, svg);
        el('title', {}, c).textContent = d.name + ', ' + MONTHS_LONG[i] + ' 2026: ' + money(p.v) + ' (' + sales(p.n) + ')';
      });
      var key = document.getElementById('mp-k-sel');
      if (key) key.textContent = d.name;
      box.innerHTML = '';
      box.appendChild(svg);

      var have = [], gaps = [];
      d.pts.forEach(function (p, i) { if (p.v == null) gaps.push(MONTHS_LONG[i]); else have.push({ p: p, i: i }); });
      var mn = have.reduce(function (a, x) { return x.p.v < a.p.v ? x : a; });
      var mx = have.reduce(function (a, x) { return x.p.v > a.p.v ? x : a; });
      var txt = d.name + ': the monthly median ran from ' + money(mn.p.v) + ' in ' + MONTHS_LONG[mn.i] + ' (' + sales(mn.p.n) + ') to ' +
        money(mx.p.v) + ' in ' + MONTHS_LONG[mx.i] + ' (' + sales(mx.p.n) + ').';
      if (gaps.length) txt += ' Left out for too few sales: ' + gaps.join(', ') + '.';
      readout.textContent = txt;
    }
    var fig = document.getElementById('mp-fig');
    if (fig) fig.hidden = false;
    select.addEventListener('change', function () { draw(dists[+select.value]); });
    draw(dists[+select.value || 0]);
    var lastW = box.clientWidth, timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (box.clientWidth !== lastW) { lastW = box.clientWidth; draw(dists[+select.value || 0]); }
      }, 150);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
