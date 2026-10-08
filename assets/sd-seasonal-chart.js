/* Seasonal buyer-demand chart for /school-districts/st-louis-county.
   Reads every value from the crawlable #season-table so the chart and table
   can never disagree. Color = comparison group, dash = district within group. */
(function () {
  'use strict';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
  var COLORS = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9'];
  var DASHES = ['', '7 4', '2 3', '10 3 2 3'];
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, cls, parent, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function fmt(v) { return v == null ? '—' : v.toFixed(1); }

  function init() {
    var table = document.getElementById('season-table');
    var chartBox = document.getElementById('season-chart');
    var legendBox = document.getElementById('season-legend');
    var readout = document.getElementById('season-readout');
    if (!table || !chartBox || !legendBox || !readout) return;

    var series = [];
    Array.prototype.forEach.call(table.querySelectorAll('tbody tr[data-g]'), function (tr) {
      var vals = Array.prototype.map.call(tr.querySelectorAll('td'), function (td) {
        var v = td.getAttribute('data-v');
        return v == null || v === '' ? null : parseFloat(v);
      });
      var g = +tr.getAttribute('data-g'), i = +tr.getAttribute('data-i');
      series.push({ name: tr.querySelector('th').textContent, group: tr.getAttribute('data-group'),
        color: COLORS[g % COLORS.length], dash: DASHES[i % DASHES.length], vals: vals });
    });
    if (!series.length) return;

    var maxV = 0;
    series.forEach(function (s) { s.vals.forEach(function (v) { if (v != null && v > maxV) maxV = v; }); });
    var yMax = Math.ceil(maxV / 5) * 5;

    var state = { pinned: -1, month: -1, near: -1 };

    /* ---------- legend ---------- */
    legendBox.setAttribute('role', 'group');
    legendBox.setAttribute('aria-label', 'Districts. Select one to highlight its line.');
    var legendBtns = [];
    var groupsSeen = {};
    var groupWrap = null;
    series.forEach(function (s, idx) {
      if (!groupsSeen[s.group]) {
        groupsSeen[s.group] = 1;
        groupWrap = h('div', 'season-lg-group', legendBox);
        h('div', 'season-lg-title', groupWrap, s.group);
      }
      var b = h('button', 'season-lg-btn', groupWrap);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      var sw = el('svg', { width: 22, height: 10, viewBox: '0 0 22 10', 'aria-hidden': 'true', focusable: 'false' }, b);
      el('line', { x1: 1, y1: 5, x2: 21, y2: 5, stroke: s.color, 'stroke-width': 2.5, 'stroke-dasharray': s.dash, 'stroke-linecap': 'round' }, sw);
      h('span', '', b, s.name);
      b.addEventListener('click', function () { pin(state.pinned === idx ? -1 : idx); });
      legendBtns.push(b);
    });
    var resetBtn = h('button', 'season-reset', legendBox, 'Show all 22 districts');
    resetBtn.type = 'button';
    resetBtn.disabled = true;
    resetBtn.addEventListener('click', function () { pin(-1); chartBox.focus(); });

    /* ---------- chart ---------- */
    var svg, paths = [], cross, dot, tag, tagText, tagBg, geo;
    chartBox.setAttribute('role', 'group');
    chartBox.setAttribute('aria-label', 'Line chart of showings per listing by month for 22 school districts. Use the left and right arrow keys to move between months and the up and down arrow keys to move between districts. Press Escape to clear.');

    function render() {
      var W = Math.max(280, chartBox.clientWidth);
      var H = W < 560 ? 300 : 380;
      var m = { l: 34, r: W < 560 ? 14 : 22, t: 14, b: 30 };
      var iw = W - m.l - m.r, ih = H - m.t - m.b;
      geo = { W: W, H: H, m: m, iw: iw, ih: ih,
        x: function (i) { return m.l + iw * i / (MONTHS.length - 1); },
        y: function (v) { return m.t + ih * (1 - v / yMax); } };
      chartBox.textContent = '';
      svg = el('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true', focusable: 'false' }, chartBox);
      var grid = el('g', { 'class': 'season-grid' }, svg);
      for (var t = 0; t <= yMax; t += 5) {
        el('line', { x1: m.l, x2: W - m.r, y1: geo.y(t), y2: geo.y(t) }, grid);
        el('text', { x: m.l - 8, y: geo.y(t) + 4, 'text-anchor': 'end', 'class': 'season-tick' }, grid).textContent = t;
      }
      MONTHS.forEach(function (mo, i) {
        var tx = el('text', { x: geo.x(i), y: H - 8, 'text-anchor': i === 0 ? 'start' : (i === MONTHS.length - 1 ? 'end' : 'middle'), 'class': 'season-tick' }, grid);
        tx.textContent = (W < 420 && i % 2) ? '' : mo;
      });
      cross = el('line', { y1: m.t, y2: m.t + ih, 'class': 'season-cross', visibility: 'hidden' }, svg);
      var lines = el('g', { 'class': 'season-lines' }, svg);
      paths = series.map(function (s) {
        var d = '', pen = false;
        s.vals.forEach(function (v, i) {
          if (v == null) { pen = false; return; }          // missing stays missing: break the line
          d += (pen ? 'L' : 'M') + geo.x(i).toFixed(1) + ' ' + geo.y(v).toFixed(1);
          pen = true;
        });
        return el('path', { d: d, fill: 'none', stroke: s.color, 'stroke-width': 1.75, 'stroke-dasharray': s.dash,
          'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'class': 'season-line' }, lines);
      });
      dot = el('circle', { r: 5, 'class': 'season-dot', visibility: 'hidden' }, svg);
      tag = el('g', { visibility: 'hidden', 'class': 'season-tag' }, svg);
      tagBg = el('rect', { rx: 4, ry: 4, height: 22 }, tag);
      tagText = el('text', { y: 15 }, tag);
      var hit = el('rect', { x: m.l - 12, y: 0, width: iw + 24, height: H, fill: 'transparent', 'class': 'season-hit' }, svg);
      hit.addEventListener('pointermove', onPointer);
      hit.addEventListener('pointerdown', onPointer);
      hit.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') clearHover(); });
      paint();
    }

    function nearestSeries(mi, py) {
      var best = -1, bd = Infinity;
      series.forEach(function (s, i) {
        var v = s.vals[mi];
        if (v == null) return;
        var dd = Math.abs(geo.y(v) - py);
        if (dd < bd) { bd = dd; best = i; }
      });
      return best;
    }
    function onPointer(e) {
      var r = svg.getBoundingClientRect();
      var px = e.clientX - r.left, py = e.clientY - r.top;
      var mi = Math.round((px - geo.m.l) / geo.iw * (MONTHS.length - 1));
      mi = Math.max(0, Math.min(MONTHS.length - 1, mi));
      state.month = mi;
      state.near = state.pinned >= 0 && series[state.pinned].vals[mi] != null ? state.pinned : nearestSeries(mi, py);
      paint();
    }
    function clearHover() { state.month = -1; state.near = -1; paint(); }

    function pin(i) {
      state.pinned = i;
      if (i >= 0 && state.month >= 0) state.near = i;
      legendBtns.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      resetBtn.disabled = i < 0;
      paint();
    }

    function paint() {
      var focus = state.pinned >= 0 ? state.pinned : (state.near >= 0 ? state.near : -1);
      paths.forEach(function (p, i) {
        var on = focus < 0 || i === focus;
        p.setAttribute('stroke-opacity', on ? (focus < 0 ? 0.9 : 1) : (state.pinned >= 0 ? 0.12 : 0.25));
        p.setAttribute('stroke-width', i === focus ? 3.5 : 1.75);
      });
      if (focus >= 0) paths[focus].parentNode.appendChild(paths[focus]);   // bring to front
      var mi = state.month;
      if (mi < 0) {
        cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); tag.setAttribute('visibility', 'hidden');
        renderReadout(-1);
        return;
      }
      var x = geo.x(mi);
      cross.setAttribute('x1', x); cross.setAttribute('x2', x); cross.setAttribute('visibility', 'visible');
      var n = state.near;
      if (n >= 0 && series[n].vals[mi] != null) {
        var y = geo.y(series[n].vals[mi]);
        dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('fill', series[n].color); dot.setAttribute('visibility', 'visible');
        tagText.textContent = series[n].name + ' · ' + fmt(series[n].vals[mi]);
        var tw = tagText.getComputedTextLength() + 16;
        var tx = x + 10 + tw > geo.W - 4 ? x - 10 - tw : x + 10;
        var ty = Math.max(2, Math.min(geo.H - geo.m.b - 24, y - 11));
        tag.setAttribute('transform', 'translate(' + tx.toFixed(1) + ',' + ty.toFixed(1) + ')');
        tagBg.setAttribute('width', tw); tagText.setAttribute('x', 8);
        tag.setAttribute('visibility', 'visible');
      } else { dot.setAttribute('visibility', 'hidden'); tag.setAttribute('visibility', 'hidden'); }
      renderReadout(mi);
    }

    function renderReadout(mi) {
      readout.textContent = '';
      if (mi < 0) {
        h('p', 'season-hint', readout, state.pinned >= 0
          ? series[state.pinned].name + ' highlighted. Hover, tap or use the arrow keys to see each month’s values.'
          : 'Hover, tap or use the arrow keys on the chart to see every district’s value for a month. Select a district in the legend above to highlight it.');
        return;
      }
      h('p', 'season-ro-hd', readout, MONTHS_LONG[mi] + ' 2026 · showings per listing');
      var list = h('ol', 'season-ro-list', readout);
      series.map(function (s, i) { return { s: s, i: i, v: s.vals[mi] }; })
        .sort(function (a, b) { return (b.v == null ? -1 : b.v) - (a.v == null ? -1 : a.v); })
        .forEach(function (o) {
          var li = h('li', o.i === state.near || o.i === state.pinned ? 'is-on' : '', list);
          var sw = el('svg', { width: 16, height: 8, viewBox: '0 0 16 8', 'aria-hidden': 'true', focusable: 'false' }, li);
          el('line', { x1: 1, y1: 4, x2: 15, y2: 4, stroke: o.s.color, 'stroke-width': 2.5, 'stroke-dasharray': o.s.dash }, sw);
          h('strong', '', li, fmt(o.v));
          h('span', '', li, o.s.name);
        });
    }

    chartBox.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowLeft') {
        state.month = state.month < 0 ? (k === 'ArrowRight' ? 0 : MONTHS.length - 1)
          : Math.max(0, Math.min(MONTHS.length - 1, state.month + (k === 'ArrowRight' ? 1 : -1)));
        if (state.near < 0) state.near = state.pinned >= 0 ? state.pinned : 0;
      } else if (k === 'ArrowUp' || k === 'ArrowDown') {
        if (state.month < 0) state.month = 0;
        var mi = state.month;
        var ranked = series.map(function (s, i) { return i; }).filter(function (i) { return series[i].vals[mi] != null; })
          .sort(function (a, b) { return series[b].vals[mi] - series[a].vals[mi]; });
        var pos = ranked.indexOf(state.near);
        pos = pos < 0 ? 0 : Math.max(0, Math.min(ranked.length - 1, pos + (k === 'ArrowDown' ? 1 : -1)));
        state.near = ranked[pos];
      } else if (k === 'Escape') {
        clearHover(); pin(-1); return;
      } else if ((k === 'Enter' || k === ' ') && state.near >= 0) {
        pin(state.pinned === state.near ? -1 : state.near);
      } else { return; }
      e.preventDefault();
      paint();
    });

    render();
    var lastW = chartBox.clientWidth;
    window.addEventListener('resize', function () {
      if (Math.abs(chartBox.clientWidth - lastW) < 4) return;
      lastW = chartBox.clientWidth; render();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
