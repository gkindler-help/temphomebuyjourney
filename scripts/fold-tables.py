#!/usr/bin/env python3
"""Collapse big data tables behind a "Show all N rows" toggle.

Any table with 7 or more body rows is wrapped in <details class="data-fold">.
The rows stay in the HTML, so search engines and AI crawlers still read and
cite every number; only the default view changes. Safe to rerun: tables
already inside <details>, and tables a calculator writes from <script>, are
skipped. Run after building or rebuilding a page.
"""
import glob
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIN_ROWS = 7
# Pages where the table is the tool itself (sortable/filterable records).
SKIP = {'experience.html'}

CSS = ('<style data-fold-css>'
       '.data-fold{margin:18px 0 22px;border:1px solid rgba(255,204,77,.28);border-radius:10px;background:rgba(255,204,77,.03);}'
       '.data-fold>summary{list-style:none;cursor:pointer;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px 14px;padding:13px 16px;font-size:14px;line-height:1.4;}'
       '.data-fold>summary::-webkit-details-marker{display:none;}'
       '.data-fold>summary:focus-visible{outline:2px solid #ffcc4d;outline-offset:2px;border-radius:10px;}'
       '.df-label{font-weight:600;color:inherit;flex:1 1 220px;min-width:0;}'
       '.df-hint{color:#ffcc4d;font-weight:700;font-size:13px;white-space:nowrap;}'
       '.df-hint:after{content:" \\25BE";}'
       '.data-fold[open] .df-hint:after{content:" \\25B4";}'
       '.data-fold[open] .df-show{display:none;}.df-hide{display:none;}.data-fold[open] .df-hide{display:inline;}'
       '.data-fold>:not(summary){margin:4px 8px 8px;}'
       '.data-fold[data-cap] caption{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}'
       '@media print{.data-fold>summary{display:none;}}'
       '</style>')
JS = ('<script data-fold-js>(function(){function o(){var h=location.hash.slice(1);if(!h)return;'
      'var t=document.getElementById(decodeURIComponent(h));if(!t)return;'
      'for(var d=t.closest("details.data-fold");d;d=d.parentElement&&d.parentElement.closest("details.data-fold"))d.open=true;'
      't.scrollIntoView();}'
      'window.addEventListener("hashchange",o);if(document.readyState!=="loading")o();'
      'else document.addEventListener("DOMContentLoaded",o);'
      'window.addEventListener("beforeprint",function(){document.querySelectorAll("details.data-fold").forEach(function(d){d.open=true;});});'
      '})();</script>')


def plain(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def body_rows(table):
    body = re.search(r'<tbody\b.*?</tbody>', table, re.S)
    part = body.group(0) if body else re.sub(r'<thead\b.*?</thead>', '', table, flags=re.S)
    return len(re.findall(r'<tr\b', part))


def inside(s, pos, tag):
    return s.rfind('<' + tag, 0, pos) > s.rfind('</' + tag + '>', 0, pos)


def wrapper(s, start, end):
    """Grow [start, end) to a <div> whose only child is the table (scroll wrappers)."""
    for _ in range(2):
        before = s[:start].rstrip()
        m = re.search(r'<div\b[^>]*>$', before)
        after = s[end:]
        n = re.match(r'\s*</div>', after)
        if not (m and n):
            break
        start, end = m.start(), end + n.end()
    return start, end


def label_for(s, start, table):
    """Return (label, came_from_caption)."""
    cap = re.search(r'<caption\b[^>]*>(.*?)</caption>', table, re.S)
    if cap and plain(cap.group(1)):
        return plain(cap.group(1)), True
    aria = re.match(r'<div\b[^>]*aria-label="([^"]+)"', s[start:start + 400])
    if aria:
        return plain(aria.group(1)), False
    heads = re.findall(r'<h[2-4]\b[^>]*>(.*?)</h[2-4]>', re.sub(r'<script\b.*?</script>', '', s[:start], flags=re.S), re.S)
    return (plain(heads[-1]) if heads else 'The full data'), False


def fold(s):
    out, pos, n = [], 0, 0
    for m in re.finditer(r'<table\b.*?</table>', s, re.S):
        if m.start() < pos or inside(s, m.start(), 'details') or inside(s, m.start(), 'script'):
            continue
        rows = body_rows(m.group(0))
        if rows < MIN_ROWS:
            continue
        start, end = wrapper(s, m.start(), m.end())
        if start < pos:
            continue
        label, from_cap = label_for(s, start, m.group(0))
        label = html.escape(label, quote=False)
        cap_attr = ' data-cap' if from_cap else ''
        out.append(s[pos:start])
        out.append(f'<details class="data-fold"{cap_attr}><summary><span class="df-label">{label}</span>'
                   f'<span class="df-hint"><span class="df-show">Show all {rows} rows</span>'
                   f'<span class="df-hide">Hide table</span></span></summary>\n')
        out.append(s[start:end])
        out.append('\n</details>')
        pos, n = end, n + 1
    out.append(s[pos:])
    s = ''.join(out)
    if 'class="data-fold"' in s:
        s = re.sub(r'<style data-fold-css>.*?</style>', lambda _: CSS, s, count=1, flags=re.S)
        if 'data-fold-css' not in s:
            s = s.replace('</head>', CSS + '\n</head>', 1)
        if 'data-fold-js' not in s:
            i = s.rfind('</body>')
            s = s[:i] + JS + '\n' + s[i:]
    return s, n


def main():
    total = pages = 0
    for path in sorted(glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True)):
        rel = os.path.relpath(path, ROOT)
        if rel.startswith(('pagefind', 'node_modules', '.')) or rel in SKIP:
            continue
        s = open(path, encoding='utf-8').read()
        new, n = fold(s)
        if new != s:
            open(path, 'w', encoding='utf-8').write(new)
        if n:
            total, pages = total + n, pages + 1
    print(f'folded {total} tables on {pages} pages')


if __name__ == '__main__':
    main()
