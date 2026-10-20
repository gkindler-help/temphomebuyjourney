/* Site search page: keyword recommendations, title matches, then Pagefind
   full-text results. The index (/pagefind) and /assets/search-recs.json are
   built by scripts/build-search.py. */
(function () {
  'use strict';
  var PAGE = 8, RERANK = 30;
  /* Index pages repeat every article's blurb, so they rank below the articles themselves. */
  var INDEXES = /^\/(?:articles\/|neighborhoods\/|listings\/|articles\/lessons-from-a-sale|school-districts|)$/;
  var STOP = {};
  'a an and are at be by can do does for from get how i if in is it me my of on or should so the than that this to vs was what when where which who why will with you your st louis stl mo missouri'
    .split(' ').forEach(function (w) { STOP[w] = 1; });
  var form = document.getElementById('ss-form');
  var input = document.getElementById('ss-q');
  var recsBox = document.getElementById('ss-recs');
  var recsList = document.getElementById('ss-recs-list');
  var status = document.getElementById('ss-status');
  var results = document.getElementById('ss-results');
  var more = document.getElementById('ss-more');
  var pagefind = null, site = { pages: {}, topics: [] }, queue = [], shownUrls = {}, seq = 0, timer = null, lastLogged = '';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function cleanUrl(u) {
    return u.replace(/\/index\.html(?=$|#)/, '/').replace(/\.html(?=$|#)/, '');
  }
  function norm(s) {
    return ' ' + s.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9'$ -]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  }
  function words(s) {
    return s.toLowerCase().replace(/[‘’']/g, '').replace(/[^a-z0-9]+/g, ' ').split(' ').filter(function (w) { return w && !STOP[w]; })
      .map(function (w) { return w.length > 4 ? w.replace(/(ies|es|s|ing|ed)$/, '') : w; });
  }
  /* Share of the query's words that appear in a title. */
  function titleScore(qw, title) {
    if (!qw.length) return 0;
    var tw = words(title);
    return qw.filter(function (w) { return tw.some(function (t) { return t === w || t.indexOf(w) === 0; }); }).length / qw.length;
  }

  /* Recommended reading: topics whose keywords appear in the query, longest match first. */
  function recommend(q) {
    var nq = norm(q), scored = [], seen = {}, out = [];
    site.topics.forEach(function (t) {
      var best = 0;
      t.keys.forEach(function (k) {
        var nk = norm(k);
        if (nq.indexOf(nk) !== -1 || nq.indexOf(nk.replace(/s $/, ' ')) !== -1) best = Math.max(best, nk.length + (t.exact ? 4 : 0));
      });
      if (best) scored.push({ s: best, t: t });
    });
    scored.sort(function (a, b) { return b.s - a.s; });
    scored.forEach(function (x) {
      x.t.urls.forEach(function (u) {
        var path = u.split('#')[0];
        if (!seen[path] && site.pages[path] && out.length < 4) { seen[path] = 1; out.push(u); }
      });
    });
    return out;
  }

  function showRecs(urls) {
    recsBox.hidden = !urls.length;
    recsList.innerHTML = urls.map(function (u) {
      var p = site.pages[u.split('#')[0]];
      return '<a class="rec" href="' + esc(u) + '"><div class="rec-t">' + esc(p[0]) + '</div>' +
        (p[1] ? '<div class="rec-d">' + esc(p[1]) + '</div>' : '') + '</a>';
    }).join('');
  }

  /* Pages whose own title holds every search word, even if full-text ranks them low. */
  function titleMatches(q, skip) {
    var qw = words(q);
    if (!qw.length) return [];
    return Object.keys(site.pages).filter(function (u) { return !skip[u] && titleScore(qw, site.pages[u][0]) === 1; })
      .sort(function (a, b) { return site.pages[a][0].length - site.pages[b][0].length; }).slice(0, 3);
  }

  function card(url, title, section, excerpt, subs) {
    return '<article class="res">' +
      (section ? '<div class="res-sec">' + esc(section) + '</div>' : '') +
      '<a class="res-t" href="' + esc(url) + '">' + esc(title) + '</a>' +
      '<p class="res-x">' + excerpt + '</p>' +
      (subs && subs.length ? '<div class="subs">' + subs.map(function (s) {
        return '<a class="sub" href="' + esc(cleanUrl(s.url)) + '"><div class="sub-t">' + esc(s.title) + '</div><div class="sub-x">' + tidy(s.excerpt) + '</div></a>';
      }).join('') + '</div>' : '') +
      '</article>';
  }
  /* Excerpts come from the middle of a page: drop link arrows and show where they were cut. */
  var qStems = [];
  function stem(w) { return w.replace(/(ies|es|s|ing|ed)$/, ''); }
  /* Pagefind also matches word beginnings ("pays" -> "payoff"); keep highlights only on real matches. */
  function realMarks(x) {
    return x.replace(/<mark>([^<]*)<\/mark>/g, function (m, w) {
      var n = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      return qStems.some(function (q) { return n === q || stem(n) === q || (n.length > 4 && stem(n) === q); }) ? m : w;
    });
  }
  function tidy(x) {
    x = realMarks(x).replace(/\s*(?:\u2192|&rarr;|\u2190|\u2193|&darr;)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (/^(?:<mark>)?[a-z0-9(]/.test(x)) x = '\u2026' + x;
    return /[.!?]$/.test(x.replace(/<[^>]+>/g, '')) ? x : x + '\u2026';
  }
  function renderData(d) {
    var subs = (d.sub_results || []).filter(function (s) {
      return s.url.indexOf('#') !== -1 && !/hero|quick-h|quick-answer|method/.test(s.url.split('#')[1]) && s.title !== d.meta.title &&
        realMarks(s.excerpt).indexOf('<mark>') !== -1;
    }).slice(0, 3);
    /* Nothing left after dropping partial-word matches: not a real result. */
    if (realMarks(d.excerpt).indexOf('<mark>') === -1 && !subs.length && titleScore(words(input.value), d.meta.title || '') < 1) return '';
    return card(cleanUrl(d.url), d.meta.title || cleanUrl(d.url), d.filters && d.filters.section ? d.filters.section[0] : '', tidy(d.excerpt), subs);
  }

  /* Queue items are loaded data objects (re-ranked head) or Pagefind hits (lazy tail). */
  function showMore(id) {
    var slice = queue.splice(0, PAGE);
    return Promise.all(slice.map(function (x) { return x.data ? x.data() : x; })).then(function (data) {
      if (id !== seq) return;
      var html = data.filter(function (d) {
        var u = cleanUrl(d.url).split('#')[0];
        if (shownUrls[u]) return false;
        shownUrls[u] = 1;
        return true;
      }).map(renderData).join('');
      if (!results.innerHTML && !html && !queue.length && !recsList.innerHTML) {
        status.classList.add('empty');
        status.textContent = 'Nothing matches \u201c' + input.value.trim() + '\u201d. Try fewer words, or ask George below.';
      }
      results.insertAdjacentHTML('beforeend', html);
      more.hidden = !queue.length;
      if (!html && queue.length) return showMore(id);
    });
  }

  function run(q) {
    var id = ++seq;
    q = q.trim();
    var url = q ? '/search?q=' + encodeURIComponent(q) : '/search';
    if (location.pathname + location.search !== url) history.replaceState(null, '', url);
    results.innerHTML = '';
    more.hidden = true;
    shownUrls = {};
    var recUrls = q ? recommend(q) : [];
    showRecs(recUrls);
    recUrls.forEach(function (u) { shownUrls[u.split('#')[0]] = 1; });
    if (!q) { status.hidden = true; return; }
    var top = titleMatches(q, shownUrls);
    results.innerHTML = top.map(function (u) {
      shownUrls[u] = 1;
      var p = site.pages[u];
      return card(u, p[0], p[2], esc(p[1]));
    }).join('');
    if (!pagefind) { status.hidden = false; status.textContent = 'Loading search…'; return; }
    /* Filler words match every page and clutter the highlights, so the full-text search skips them. */
    var core = q.split(/\s+/).filter(function (w) { return !STOP[w.toLowerCase().replace(/[^a-z0-9]/g, '')]; }).join(' ') || q;
    pagefind.debouncedSearch(core, {}, 200).then(function (r) {
      if (!r || id !== seq) return;
      var hits = r.results, qw = words(q);
      qStems = core.toLowerCase().split(/\s+/).map(function (w) { return stem(w.replace(/[^a-z0-9]/g, '')); }).filter(Boolean);
      status.hidden = false;
      var any = hits.length || top.length || recUrls.length;
      status.classList.toggle('empty', !any);
      status.textContent = !any ? 'Nothing matches “' + q + '”. Try fewer words, or ask George below.' :
        (top.length || recUrls.length) ? 'More results' : 'Results for “' + q + '”';
      if (q !== lastLogged && typeof gtag === 'function') { lastLogged = q; gtag('event', 'search', { search_term: q, results: hits.length }); }
      var head = hits.slice(0, RERANK);
      return Promise.all(head.map(function (h) { return h.data(); })).then(function (data) {
        if (id !== seq) return;
        var n = data.length;
        data = data.map(function (d, i) {
          var listing = INDEXES.test(cleanUrl(d.url)) ? 0.8 : 0;
          return { d: d, s: titleScore(qw, d.meta.title || '') * 1.5 + (1 - i / n) - listing };
        })
          .sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.d; });
        queue = data.concat(hits.slice(RERANK));
        return showMore(id);
      });
    });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); run(input.value); input.blur(); });
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { run(input.value); }, 120); });
  more.addEventListener('click', function () { showMore(seq); });
  document.getElementById('ss-chips').addEventListener('click', function (e) {
    if (e.target.classList.contains('chip')) { input.value = e.target.textContent; run(input.value); }
  });

  var initial = new URLSearchParams(location.search).get('q') || '';
  input.value = initial;
  if (!initial) input.focus();

  var loadSite = fetch('/assets/search-recs.json').then(function (r) { return r.json(); }).then(function (d) { site = d; }).catch(function () {});
  var loadIndex = import('/pagefind/pagefind.js').then(function (pf) { pagefind = pf; return pf.options({ excerptLength: 24 }); })
    .catch(function () { status.hidden = false; status.textContent = 'Search is unavailable right now.'; });
  Promise.all([loadSite, loadIndex]).then(function () { if (input.value) run(input.value); });
})();
