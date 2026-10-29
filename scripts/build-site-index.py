#!/usr/bin/env python3
"""Build /site-index: a crawlable directory of every indexable page, grouped by area and topic.

Run after adding, removing or retitling pages:  python3 scripts/build-site-index.py
"""
import glob, html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
TEMPLATE = 'articles/lessons-from-a-sale-earnest-money-releases.html'
OUT = 'site-index.html'
URL = 'https://stlhomejourney.com/site-index'
SKIP_DIRS = ('.git/', 'docs/', 'pagefind/', 'node_modules/', 'scripts/', '.vscode/', 'assets/')
SKIP = {'404.html', 'search.html', OUT}

# Neighborhood pages by region. Pages not listed fall back to the regional hub that links to them.
REGION = {
    'St. Louis City': ['benton-park', 'bevo', 'boulevard-heights', 'carondelet', 'central-west-end', 'dogtown', 'dutchtown',
                       'forest-park-southeast', 'fox-park', 'gravois-park', 'lafayette-square', 'lindenwood-park',
                       'mckinley-heights', 'mt-pleasant', 'northampton', 'patch', 'princeton-heights', 'shaw', 'soulard',
                       'southampton', 'southwest-garden', 'st-louis-hills', 'the-hill', 'tower-grove-east', 'tower-grove-south'],
    'South County': ['affton', 'concord', 'crestwood', 'green-park', 'lemay', 'mehlville', 'oakville', 'sappington', 'scotsdale',
                     'sunset-hills', 'webster-groves', 'south-county-small-towns'],
    'Central and West County': ['ballwin', 'chesterfield', 'clayton', 'crystal-lake-park', 'kirkwood', 'maplewood', 'university-city'],
    'North County': ['bellefontaine-neighbors', 'berkeley', 'black-jack', 'bridgeton', 'champ', 'dellwood', 'ferguson', 'florissant',
                     'hazelwood', 'jennings', 'maryland-heights', 'moline-acres', 'parkdale', 'spanish-lake', 'st-ann', 'st-john',
                     'woodson-terrace', 'north-county-small-towns'],
    'Jefferson County': ['arnold', 'barnhart', 'byrnes-mill', 'cedar-hill', 'crystal-city', 'de-soto', 'eureka-jefferson-county',
                         'fenton-jefferson-county', 'festus', 'herculaneum', 'high-ridge', 'hillsboro', 'house-springs', 'imperial',
                         'olympian-village', 'peaceful-village', 'pevely'],
    'St. Charles County': ['cottleville', 'dardenne-prairie', 'josephville', 'lake-st-louis', 'o-fallon', 'st-charles', 'st-paul',
                           'st-peters', 'weldon-spring', 'weldon-spring-heights', 'wentzville', 'west-alton'],
}
AREA_HUBS = ['south-city-st-louis', 'south-county-st-louis', 'north-county-st-louis', 'jefferson-county-mo', 'neighborhoods/',
             'articles/west-county-st-louis-neighborhoods', 'articles/south-county-stl-neighborhood-guide', 'school-districts',
             'school-district-map', 'afford', 'neighborhood-matcher', 'compare']
START = ['', 'complete-guide', 'journey/', 'articles/', 'articles/lessons-from-a-sale', 'about', 'experience', 'ask', 'george-kindler']


def redirected():
    out = set()
    for line in open('_redirects'):
        line = line.split('#', 1)[0].split()
        if len(line) >= 2:
            out.add(line[0].strip('/'))
    return out


def label(title, path):
    t = html.unescape(re.sub(r'<[^>]+>', '', title)).strip()
    t = re.split(r'\s+[|·]\s+', t)[0]
    t = re.sub(r'\s*[—–]\s*STL Home Journey$', '', t)
    if path.startswith(('neighborhoods/', 'school-districts/', 'zip-codes/')):
        t = re.split(r':\s|\s[—–]\s|\s-\s', t)[0]
        t = re.sub(r'^(Homes for Sale in|Buying a House in|Buying a Home in)\s+', '', t)
        t = re.sub(r'\s+(Homes|Real Estate)$', '', t)
    return html.escape(t, quote=False).replace('St. Louis', 'St.&nbsp;Louis')


def pages():
    red = redirected()
    found = {}
    for f in sorted(glob.glob('**/*.html', recursive=True)):
        if f in SKIP or f.startswith(SKIP_DIRS):
            continue
        s = open(f, encoding='utf-8', errors='ignore').read()
        if re.search(r'<meta name="robots" content="[^"]*noindex', s):
            continue
        m = re.search(r'<link rel="canonical" href="https://stlhomejourney\.com/([^"]*)"', s)
        if not m:
            continue
        path = m.group(1)
        if path.strip('/') in red and path:
            continue
        t = re.search(r'<title>(.*?)</title>', s, re.S)
        h = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
        found[path] = label(t.group(1) if t else path, path)
    return found


def build():
    P = pages()
    panel = {}
    a = open('articles/index.html', encoding='utf-8').read()
    for m in re.finditer(r'id="(panel-[a-z-]*)"', a):
        j = a.find('id="panel-', m.start() + 10)
        for slug in re.findall(r'href="(?:/articles/|\.\./articles/)?([a-z0-9-]+)(?:\.html)?"', a[m.start():j if j > 0 else None]):
            panel.setdefault('articles/' + slug, m.group(1))
    used = set()
    groups = []

    def take(name, paths, intro=''):
        items = [(p, P[p]) for p in paths if p in P and p not in used]
        if items:
            used.update(p for p, _ in items)
            groups.append((name, intro, items))

    take('Start here', START)
    take('Area guides and maps', AREA_HUBS)
    for region, slugs in REGION.items():
        take(f'Neighborhoods: {region}', sorted(['neighborhoods/' + s for s in slugs], key=lambda p: P.get(p, p)))
    leftover_nb = sorted([p for p in P if p.startswith('neighborhoods/') and p not in used], key=lambda p: P[p])
    take('Neighborhoods: more', leftover_nb)
    take('School districts', sorted([p for p in P if p.startswith('school-districts/')], key=lambda p: P[p]))
    take('ZIP codes', sorted([p for p in P if p.startswith('zip-codes/')]))
    take('Lessons From a Sale', sorted([p for p in P if p.startswith('articles/lessons-from-a-sale-')], key=lambda p: P[p]))
    take('Buying guides', sorted([p for p in P if panel.get(p) == 'panel-buying'], key=lambda p: P[p]))
    take('Selling guides', sorted([p for p in P if panel.get(p) == 'panel-selling' or p.startswith('sellers/')], key=lambda p: P[p]))
    take('More guides', sorted([p for p in P if p.startswith('articles/')], key=lambda p: P[p]))
    take('Tools and calculators', sorted([p for p in P if p.startswith('tools/') or p in (
        'stl-home-buying-power-calculator', 'home-cost', 'stl-quiz')], key=lambda p: P[p]))
    take('Listings', sorted([p for p in P if p.startswith('listings/')], key=lambda p: P[p]))
    take('Everything else', sorted([p for p in P if p not in used], key=lambda p: P[p]))

    total = sum(len(i) for _, _, i in groups)
    nav = ' &middot; '.join(f'<a href="#g{n}">{html.escape(name.replace("Neighborhoods: ", ""))}</a>' for n, (name, _, _) in enumerate(groups))
    body = [f'<p class="si-jump">{nav}</p>']
    for n, (name, intro, items) in enumerate(groups):
        lis = ''.join(f'<li><a href="/{p}">{t}</a></li>' for p, t in items)
        body.append(f'<h2 id="g{n}">{html.escape(name)} <span class="si-count">{len(items)}</span></h2>\n<ul class="si-list">{lis}</ul>')

    T = open(TEMPLATE, encoding='utf-8').read()
    title = 'Site Index: Every STL Home Journey Guide, Neighborhood and Tool'
    desc = f'All {total} pages on STL Home Journey in one place: St. Louis neighborhoods by region, school districts, ZIP codes, buyer and seller guides, Lessons From a Sale and tools.'
    head = T[:T.index('<body>')]
    head = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', head, flags=re.S)
    for pat, val in [(r'(<meta name="description" content=")[^"]*(")', desc), (r'(<meta property="og:title" content=")[^"]*(")', title),
                     (r'(<meta property="og:description" content=")[^"]*(")', desc), (r'(<meta name="twitter:title" content=")[^"]*(")', title),
                     (r'(<meta property="og:url" content=")[^"]*(")', URL), (r'(<link rel="canonical" href=")[^"]*(")', URL)]:
        head = re.sub(pat, lambda m: m.group(1) + val + m.group(2), head, count=1)
    head = re.sub(r'\n?<meta (?:property="og:image[^"]*"|name="twitter:image")[^>]*>', '', head)
    head = re.sub(r'<script type="application/ld\+json">.*?</script>\s*', '', head, flags=re.S)
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "CollectionPage", "name": title, "description": html.unescape(desc), "url": URL,
         "publisher": {"@id": "https://stlhomejourney.com/#agent"}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "STL Home Journey", "item": "https://stlhomejourney.com/"},
            {"@type": "ListItem", "position": 2, "name": "Site Index", "item": URL}]}]}
    css = ('.si-jump{font-size:.82rem;line-height:2;color:var(--text-dim);margin:0 0 8px;}'
           '.si-count{font-family:var(--font-sans);font-size:.75rem;font-weight:600;color:var(--text-dim);margin-left:6px;}'
           '.si-list{list-style:none;padding:0 !important;columns:2;column-gap:28px;}'
           '.si-list li{break-inside:avoid;margin:0 0 8px !important;font-size:.92rem !important;line-height:1.45;}'
           '.si-list a{color:var(--text-soft);}.si-list a:hover{color:var(--gold);}'
           '@media(max-width:600px){.si-list{columns:1;}}')
    head = head.replace('</head>', f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n<style>{css}</style>\n</head>', 1)

    rest = T[T.index('<body>'):]
    top = rest[:rest.index('<div class="art-layout">')]
    top = re.sub(r'(<span class="art-nav-item active"[^>]*>).*?(</span>)', r'\1Site Index\2', top, count=1)
    top = re.sub(r'<button id="jumpToggle".*?</nav>\s*', '', top, count=1, flags=re.S)
    foot = rest[rest.index('<footer'):]
    layout = f'''<div class="art-layout">
  <h1 class="art-title">Site Index</h1>
  <p class="art-lede">Every guide, neighborhood, school district and tool on the site, {total} pages, grouped by area and topic.</p>
  <div class="art-body">
{chr(10).join(body)}
  </div>
</div>

'''
    out = head + top + layout + foot
    open(OUT, 'w', encoding='utf-8').write(out)
    print(f'{OUT}: {total} pages in {len(groups)} groups')


if __name__ == '__main__':
    build()
