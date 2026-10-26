#!/usr/bin/env python3
"""Build the link-preview card for every public page and point the page at it.

One design for the whole site (scripts/og/card.html), centered so the middle square that
Facebook crops for comment previews still shows the whole logo and title: the gold logo, a section label,
the page's own headline, and a "Calculator included" tag on pages with a calculator.
Cards go to assets/og/<page>.jpg; each page gets og:image, its size, twitter:card and
twitter:image pointing there.

Run after changing any page title:  python3 scripts/build-og.py
Needs Node with Playwright (set CHROME to a Chromium binary if Playwright's own isn't installed).
"""
import html, importlib.util, json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://stlhomejourney.com'
OUT = 'assets/og'

spec = importlib.util.spec_from_file_location('bs', os.path.join(ROOT, 'scripts', 'build-search.py'))
bs = importlib.util.module_from_spec(spec); spec.loader.exec_module(bs)

# Tool pages that are quizzes or forms rather than calculators.
NOT_CALC = {'neighborhood-matcher.html'}
SELLER_PREFIXES = ('sellers/',)


def title_of(s):
    m = re.search(r'<meta property="og:title" content="([^"]+)"', s) or re.search(r'<title>([^<]+)</title>', s)
    t = html.unescape(m.group(1)) if m else 'STL Home Journey'
    t = re.sub(r'\s*\|\s*STL Home Journey\s*$', '', t)
    t = re.sub(r'^\s*\[[^\]]*\]\s*', '', t)          # "[Calculator Included] ..." prefixes
    return t.strip()


def has_calc(r, s):
    if r in NOT_CALC:
        return False
    if 'atd-config' in s:
        return True
    inputs = re.findall(r'<input\b(?![^>]*type="(?:hidden|search|checkbox|radio|submit|email)")', s)
    return len(inputs) >= 3


def eyebrow(r, s):
    if r.startswith('articles/lessons-from-a-sale'):
        return 'Lessons From a Sale'
    if r.startswith(SELLER_PREFIXES) or 'data-tool="seller-net"' in s:
        return 'Selling'
    if r.startswith('articles/') and '-vs-' in r:
        return 'Comparisons'
    for prefix, name in (('neighborhoods/', 'Neighborhoods'), ('school-districts/', 'School Districts'),
                         ('zip-codes/', 'ZIP Codes'), ('listings/', 'Listings'), ('tools/', 'Tools'),
                         ('articles/', 'Guides')):
        if r.startswith(prefix):
            return name
    if '/' not in r and has_calc(r, s):
        return 'Tools'
    return 'St. Louis Real Estate'


def slug(r):
    p = re.sub(r'(^|/)index\.html$', '', r)
    p = re.sub(r'\.html$', '', p).strip('/')
    return (p or 'home').replace('/', '--')


def set_meta(s, attr, key, value):
    tag = '<meta %s="%s" content="%s">' % (attr, key, value)
    pat = r'<meta %s="%s" content="[^"]*"\s*/?>' % (attr, re.escape(key))
    if re.search(pat, s):
        return re.sub(pat, lambda m: tag, s, count=1)
    anchor = re.search(r'<meta property="og:[a-z:_]+" content="[^"]*"\s*/?>(?![\s\S]*<meta property="og:)', s) \
        or re.search(r'<meta name="twitter:[a-z:_]+" content="[^"]*"\s*/?>(?![\s\S]*<meta name="twitter:)', s) \
        or re.search(r'<meta name="description" content="[^"]*"\s*/?>', s)
    if anchor:
        return s[:anchor.end()] + '\n' + tag + s[anchor.end():]
    return s.replace('</head>', tag + '\n</head>', 1)


def main():
    jobs, edits = [], []
    for r in sorted(bs.pages()):
        s = open(os.path.join(ROOT, r), encoding='utf-8').read()
        if re.search(r'<meta name="robots" content="[^"]*noindex', s):
            continue
        out = '%s/%s.jpg' % (OUT, slug(r))
        jobs.append({'title': title_of(s), 'eyebrow': eyebrow(r, s), 'calc': has_calc(r, s),
                     'out': os.path.join(ROOT, out)})
        edits.append((r, out))
    os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as f:
        json.dump(jobs, f)
    subprocess.run(['node', os.path.join(ROOT, 'scripts', 'og', 'render.js'), f.name], check=True)
    os.unlink(f.name)
    for r, out in edits:
        p = os.path.join(ROOT, r); s = open(p, encoding='utf-8').read(); o = s
        url = SITE + '/' + out
        s = set_meta(s, 'property', 'og:site_name', 'STL Home Journey')
        s = set_meta(s, 'property', 'og:image', url)
        s = set_meta(s, 'property', 'og:image:width', '1200')
        s = set_meta(s, 'property', 'og:image:height', '630')
        s = set_meta(s, 'name', 'twitter:card', 'summary_large_image')
        s = set_meta(s, 'name', 'twitter:image', url)
        if s != o:
            open(p, 'w', encoding='utf-8').write(s)
    keep = {os.path.basename(o) for _, o in edits}
    for f in os.listdir(os.path.join(ROOT, OUT)):
        if f.endswith('.jpg') and f not in keep:
            os.remove(os.path.join(ROOT, OUT, f))
    print('cards: %d, with calculator tag: %d' % (len(jobs), sum(j['calc'] for j in jobs)))


if __name__ == '__main__':
    main()
