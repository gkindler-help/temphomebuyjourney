#!/usr/bin/env python3
"""Report how much wording sibling pages share, to catch template copy.

Usage: python3 scripts/check-overlap.py articles/moving-from-*-to-st-louis.html

Compares the article text (h1 through the sources box, tables and scripts
removed) of every pair of pages, counting identical 10-word runs. City names
from each page's slug are masked so "Dallas" vs. "Houston" doesn't hide a
copied sentence. Sibling pages should stay at about 20% or less; anything
above 25% is flagged, with the longest shared passages listed so they can be
rewritten.
"""
import html
import itertools
import os
import re
import sys

N = 10
LIMIT = 25


def words(path):
    s = open(path, encoding='utf-8').read()
    a = s.find('<h1')
    b = s.find('class="sources"')
    s = s[a:b if b > a else len(s)]
    s = re.sub(r'<script.*?</script>|<style.*?</style>|<table.*?</table>', ' ', s, flags=re.S)
    t = html.unescape(re.sub(r'<[^>]+>', ' ', s)).replace('\xa0', ' ').lower()
    slug = os.path.basename(path)[:-5]
    m = re.match(r'moving-from-(.+)-to-st-louis', slug)
    if m:
        for w in m.group(1).split('-'):
            t = re.sub(r'\b' + re.escape(w) + r'\b', 'CITY', t)
    return t.split()


def shingles(w):
    return {' '.join(w[i:i + N]) for i in range(len(w) - N + 1)}


def passages(w, other):
    out, i = [], 0
    while i <= len(w) - N:
        if ' '.join(w[i:i + N]) in other:
            j = i
            while j <= len(w) - N and ' '.join(w[j:j + N]) in other:
                j += 1
            out.append(' '.join(w[i:j + N - 1]))
            i = j + N - 1
        else:
            i += 1
    return sorted(out, key=len, reverse=True)


def main(paths):
    W = {p: words(p) for p in paths}
    S = {p: shingles(w) for p, w in W.items()}
    bad = 0
    for a, b in itertools.combinations(paths, 2):
        common = S[a] & S[b]
        pct = 100 * len(common) / max(1, min(len(S[a]), len(S[b])))
        flag = 'TOO HIGH' if pct > LIMIT else 'ok'
        print(f'{pct:5.1f}%  {flag:8}  {os.path.basename(a)}  vs  {os.path.basename(b)}')
        if pct > LIMIT:
            bad += 1
            for p in passages(W[a], S[b])[:6]:
                print('          -', len(p.split()), 'words:', p[:160])
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
