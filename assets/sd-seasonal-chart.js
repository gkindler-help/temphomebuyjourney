/* Seasonal buyer-demand chart for /school-districts/st-louis-county.
   Reads every value from the crawlable #season-table so the chart and table
   can never disagree. Default view: the average of all 22 districts in front,
   the 22 districts lighter behind. Readers can highlight one area (comparison group) or one district.
   District color = comparison group, dash = district within group. */
(function () {
  'use strict';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
  var COLORS = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9'];
  var DASHES = ['', '7 4', '2 3', '10 3 2 3'];
  var MARKET = {
    avg: { name: 'Average of all 22 districts', color: '#FFCC4D', dash: '', width: 4 }
  };
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
  function swatch(parent, s, w) {
    var sv = el('svg', { width: w, height: 10, viewBox: '0 0 ' + w + ' 10', 'aria-hidden': 'true', focusable: 'false' }, parent);
    el('line', { x1: 1, y1: 5, x2: w - 1, y2: 5, stroke: s.color, 'stroke-width': s.market ? 3 : 2.5, 'stroke-dasharray': s.dash, 'stroke-linecap': 'round' }, sv);
    return sv;
  }

  function init() {
    var table = document.getElementById('season-table');
    var chartBox = document.getElementById('season-chart');
    var legendBox = document.getElementById('season-legend');
    var readout = document.getElementById('season-readout');
    if (!table || !chartBox || !legendBox || !readout) return;

    function rowVals(tr) {
      return Array.prototype.map.call(tr.querySelectorAll('td'), function (td) {
        var v = td.getAttribute('data-v');
        return v == null || v === '' ? null : parseFloat(v);
      });
    }
    /* all[] holds the 22 districts first, then the market lines */
    var all = [];
    Array.prototype.forEach.call(table.querySelectorAll('tbody tr[data-g]'), function (tr) {
      var g = +tr.getAttribute('data-g'), i = +tr.getAttribute('data-i');
      all.push({ name: tr.querySelector('th').textContent, group: tr.getAttribute('data-group'),
        color: COLORS[g % COLORS.length], dash: DASHES[i % DASHES.length], vals: rowVals(tr) });
    });
    var nDist = all.length;
    if (!nDist) return;
    ['avg'].forEach(function (kind) {
      var tr = table.querySelector('tbody tr[data-market="' + kind + '"]');
      if (!tr) return;
      var m = MARKET[kind];
      all.push({ name: m.name, market: kind, color: m.color, dash: m.dash, width: m.width, vals: rowVals(tr) });
    });
    function isMarket(i) { return !!all[i].market; }

    var maxV = 0;
    all.forEach(function (s) { s.vals.forEach(function (v) { if (v != null && v > maxV) maxV = v; }); });
    var yMax = Math.ceil(maxV / 5) * 5;

    var state = { pinned: -1, area: null, month: -1, near: -1 };
    function hasSel() { return state.pinned >= 0 || !!state.area; }
    /* is district i part of the current selection? */
    function inSel(i) {
      if (isMarket(i)) return false;
      return state.pinned >= 0 ? i === state.pinned : (state.area ? all[i].group === state.area : false);
    }
    /* series the pointer / keyboard can land on */
    function targetable(i) { return hasSel() ? inSel(i) : true; }

    /* ---------- area buttons ---------- */
    var areas = [];
    all.forEach(function (s) { if (s.group && areas.indexOf(s.group) < 0) areas.push(s.group); });
    var areaRow = h('div', 'season-areas');
    areaRow.setAttribute('role', 'group');
    areaRow.setAttribute('aria-label', 'Highlight an area');
    h('span', 'season-areas-label', areaRow, 'Highlight an area:');
    var areaBtns = [];
    function areaColor(a) { for (var i = 0; i < nDist; i++) if (all[i].group === a) return all[i].color; }
    [null].concat(areas).forEach(function (a) {
      var b = h('button', 'season-lg-btn season-area-btn', areaRow);
      b.type = 'button';
      if (a !== null) swatch(b, { color: areaColor(a), dash: '' }, 22);
      h('span', '', b, a === null ? 'All areas (market average)' : a);
      b.addEventListener('click', function () { selectArea(a === null || state.area === a ? null : a); });
      b._area = a;
      areaBtns.push(b);
    });
    legendBox.parentNode.insertBefore(areaRow, legendBox);

    /* ---------- legend ---------- */
    legendBox.setAttribute('role', 'group');
    legendBox.setAttribute('aria-label', 'Districts. Select an area heading or a district to highlight it.');
    var mk = h('div', 'season-lg-group season-lg-market', legendBox);
    h('div', 'season-lg-title', mk, 'All 22 districts');
    for (var j = nDist; j < all.length; j++) {
      var key = h('span', 'season-lg-key', mk);
      swatch(key, all[j], 26);
      h('span', '', key, all[j].name);
    }
    var legendBtns = [];
    var groupWrap = null, seen = {};
    for (var idx = 0; idx < nDist; idx++) (function (idx) {
      var s = all[idx];
      if (!seen[s.group]) {
        seen[s.group] = 1;
        groupWrap = h('div', 'season-lg-group', legendBox);
        var t = h('button', 'season-lg-title season-lg-title-btn', groupWrap, s.group);
        t.type = 'button';
        t.setAttribute('aria-label', 'Highlight ' + s.group);
        t._area = s.group;
        t.addEventListener('click', function () { selectArea(state.area === s.group && state.pinned < 0 ? null : s.group); });
        areaBtns.push(t);
      }
      var b = h('button', 'season-lg-btn', groupWrap);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      swatch(b, s, 22);
      h('span', '', b, s.name);
      b.addEventListener('click', function () { pin(state.pinned === idx ? -1 : idx); });
      legendBtns.push(b);
    })(idx);
    var resetBtn = h('button', 'season-reset', legendBox, 'Back to the market average');
    resetBtn.type = 'button';
    resetBtn.addEventListener('click', function () { state.area = null; pin(-1); chartBox.focus(); });

    /* ---------- chart ---------- */
    var svg, paths = [], cross, dot, tag, tagText, tagBg, endLbl, geo;
    chartBox.setAttribute('role', 'group');
    chartBox.setAttribute('aria-label', 'Line chart of showings per listing by month. The gold line is the average of all 22 districts. Highlight an area or a district with the buttons above. Use the left and right arrow keys to move between months and the up and down arrow keys to move between lines. Press Escape to clear.');

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
      paths = all.map(function (s) {
        var d = '', pen = false;
        s.vals.forEach(function (v, i) {
          if (v == null) { pen = false; return; }          // missing stays missing: break the line
          d += (pen ? 'L' : 'M') + geo.x(i).toFixed(1) + ' ' + geo.y(v).toFixed(1);
          pen = true;
        });
        return el('path', { d: d, fill: 'none', stroke: s.color, 'stroke-width': s.width || 1.75, 'stroke-dasharray': s.dash,
          'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'class': 'season-line' + (s.market ? ' season-market-line' : ''),
          'data-district': s.name }, lines);
      });
      /* direct label for the market average at its last point */
      endLbl = null;
      var avgIdx = all.length - 1;
      if (all[avgIdx] && all[avgIdx].market === 'avg') {
        var rv = all[avgIdx].vals, li = rv.length - 1;
        while (li >= 0 && rv[li] == null) li--;
        if (li >= 0) {
          endLbl = el('text', { x: geo.x(li) - 4, y: geo.y(rv[li]) - 10, 'text-anchor': 'end', 'class': 'season-end-lbl' }, svg);
          endLbl.textContent = 'Market average ' + fmt(rv[li]);
        }
      }
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
      all.forEach(function (s, i) {
        var v = s.vals[mi];
        if (v == null || !targetable(i)) return;
        var dd = Math.abs(geo.y(v) - py) - (s.market ? 6 : 0);   // small preference for the market lines
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
      state.near = state.pinned >= 0 && all[state.pinned].vals[mi] != null ? state.pinned : nearestSeries(mi, py);
      paint();
    }
    function clearHover() { state.month = -1; state.near = -1; paint(); }

    function syncButtons() {
      legendBtns.forEach(function (b, j) { b.setAttribute('aria-pressed', j === state.pinned ? 'true' : 'false'); });
      areaBtns.forEach(function (b) { b.setAttribute('aria-pressed', b._area === state.area && state.pinned < 0 ? 'true' : 'false'); });
      resetBtn.disabled = !hasSel();
    }
    function pin(i) {
      state.pinned = i;
      if (i >= 0) state.area = null;
      if (i >= 0 && state.month >= 0) state.near = i;
      else if (state.near >= 0 && !targetable(state.near)) state.near = -1;
      syncButtons();
      paint();
    }
    function selectArea(a) {
      state.area = a;
      state.pinned = -1;
      if (state.near >= 0 && !targetable(state.near)) state.near = -1;
      syncButtons();
      paint();
    }

    function paint() {
      var sel = hasSel();
      var focus = state.pinned >= 0 ? state.pinned : state.near;
      paths.forEach(function (p, i) {
        var s = all[i], op, wd;
        if (s.market) {
          op = sel ? 0.6 : 1;
          wd = (s.width || 2) + (i === state.near ? 1 : 0);
        } else if (sel) {
          op = inSel(i) ? 1 : 0.08;
          wd = inSel(i) ? (i === focus ? 3.5 : 2.5) : 1.25;
        } else {
          op = i === state.near ? 1 : 0.32;
          wd = i === state.near ? 3 : 1.25;
        }
        p.setAttribute('stroke-opacity', op);
        p.setAttribute('stroke-width', wd);
      });
      var front = paths[0].parentNode;
      paths.forEach(function (p, i) { if (inSel(i) && i !== focus) front.appendChild(p); });
      for (var k = nDist; k < paths.length; k++) front.appendChild(paths[k]);   // market lines stay readable
      if (focus >= 0 && !isMarket(focus)) front.appendChild(paths[focus]);
      if (endLbl) endLbl.setAttribute('opacity', sel ? 0.6 : 1);

      var mi = state.month;
      if (mi < 0) {
        cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); tag.setAttribute('visibility', 'hidden');
        renderReadout(-1);
        return;
      }
      var x = geo.x(mi);
      cross.setAttribute('x1', x); cross.setAttribute('x2', x); cross.setAttribute('visibility', 'visible');
      var n = state.near;
      if (n >= 0 && all[n].vals[mi] != null) {
        var y = geo.y(all[n].vals[mi]);
        dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('fill', all[n].color); dot.setAttribute('visibility', 'visible');
        tagText.textContent = all[n].name + ' · ' + fmt(all[n].vals[mi]);
        var tw = tagText.getComputedTextLength() + 16;
        var tx = x + 10 + tw > geo.W - 4 ? x - 10 - tw : x + 10;
        var ty = Math.max(2, Math.min(geo.H - geo.m.b - 24, y - 11));
        if (tx < 2) {                                    // too wide for either side: sit above or below the point, inside the chart
          tx = Math.max(2, Math.min(geo.W - tw - 2, x - tw / 2));
          ty = y - 34 >= 2 ? y - 34 : y + 12;
        }
        tag.setAttribute('transform', 'translate(' + tx.toFixed(1) + ',' + ty.toFixed(1) + ')');
        tagBg.setAttribute('width', tw); tagText.setAttribute('x', 8);
        tag.setAttribute('visibility', 'visible');
      } else { dot.setAttribute('visibility', 'hidden'); tag.setAttribute('visibility', 'hidden'); }
      renderReadout(mi);
    }

    function readoutRow(list, s, i, v) {
      var li = h('li', (i === state.near || i === state.pinned ? 'is-on' : '') + (s.market ? ' is-market' : ''), list);
      swatch(li, s, 16);
      h('strong', '', li, fmt(v));
      h('span', '', li, s.name);
    }
    function renderReadout(mi) {
      readout.textContent = '';
      var areaOn = state.area && state.pinned < 0;
      if (mi < 0) {
        var msg;
        if (state.pinned >= 0) msg = all[state.pinned].name + ' highlighted against the market average. Hover, tap or use the arrow keys to see each month’s values.';
        else if (areaOn) msg = state.area + ' highlighted (' + all.slice(0, nDist).filter(function (s) { return s.group === state.area; }).map(function (s) { return s.name; }).join(', ') + ') against the market average. Hover, tap or use the arrow keys to see each month’s values.';
        else msg = 'The gold line is the average of all 22 districts. Hover, tap or use the arrow keys to see each month’s values, or select an area or district above to highlight it.';
        h('p', 'season-hint', readout, msg);
        return;
      }
      h('p', 'season-ro-hd', readout, (areaOn ? state.area + ' · ' : '') + MONTHS_LONG[mi] + ' 2026 · showings per listing');
      var mkList = h('ul', 'season-ro-list season-ro-market', readout);
      for (var k = nDist; k < all.length; k++) readoutRow(mkList, all[k], k, all[k].vals[mi]);
      var list = h('ol', 'season-ro-list', readout);
      all.slice(0, nDist).map(function (s, i) { return { s: s, i: i, v: s.vals[mi] }; })
        .filter(function (o) { return state.pinned >= 0 ? true : (!areaOn || o.s.group === state.area); })
        .sort(function (a, b) { return (b.v == null ? -1 : b.v) - (a.v == null ? -1 : a.v); })
        .forEach(function (o) { readoutRow(list, o.s, o.i, o.v); });
    }

    chartBox.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowLeft') {
        state.month = state.month < 0 ? (k === 'ArrowRight' ? 0 : MONTHS.length - 1)
          : Math.max(0, Math.min(MONTHS.length - 1, state.month + (k === 'ArrowRight' ? 1 : -1)));
        if (state.near < 0 || all[state.near].vals[state.month] == null) {
          var first = all.map(function (s, i) { return i; }).filter(function (i) { return targetable(i) && all[i].vals[state.month] != null; });
          state.near = state.pinned >= 0 ? state.pinned : (first.length ? first[0] : -1);
        }
      } else if (k === 'ArrowUp' || k === 'ArrowDown') {
        if (state.month < 0) state.month = 0;
        var mi = state.month;
        var ranked = all.map(function (s, i) { return i; }).filter(function (i) { return all[i].vals[mi] != null && (state.pinned >= 0 || targetable(i)); })
          .sort(function (a, b) { return all[b].vals[mi] - all[a].vals[mi]; });
        var pos = ranked.indexOf(state.near);
        pos = pos < 0 ? 0 : Math.max(0, Math.min(ranked.length - 1, pos + (k === 'ArrowDown' ? 1 : -1)));
        state.near = ranked[pos];
      } else if (k === 'Escape') {
        clearHover(); state.area = null; pin(-1); return;
      } else if ((k === 'Enter' || k === ' ') && state.near >= 0 && !isMarket(state.near)) {
        pin(state.pinned === state.near ? -1 : state.near);
      } else { return; }
      e.preventDefault();
      paint();
    });

    syncButtons();
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
