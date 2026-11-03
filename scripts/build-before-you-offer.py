#!/usr/bin/env python3
"""Build the data file for the Before You Offer check on the walkthrough page.

Reads George's QA-clean MLS workbook for St. Louis County (kept in his private Google Drive, never
in this repo), the Jefferson County group figures already published for the Jefferson County
district hub (assets/data/sd-house-jeffco/, 5+ sale groups only; no year built, so Jefferson County
comps match on district, beds/baths, style and size),
the occupancy table on articles/st-louis-occupancy-permits-by-city and the property-tax
tables on school-districts/st-louis-county, and writes ONE file of group figures:

    assets/data/before-you-offer-2026.json

No sale lists: every price figure comes from a group of at least 5 sales. Smaller groups are
written as 0 (shown as "fewer than 5") and never carry a price, size or year. No single sale,
address, MLS number or date is written.

Run:  python3 scripts/build-before-you-offer.py /path/to/STLHJ_School_District_Page_Build_QA_Clean_2026.xlsx
Then: python3 scripts/build-search.py
"""
import collections, html, json, math, os, re, statistics, sys, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'data', 'before-you-offer-2026.json')
THROUGH = 'Jan 1 – Oct 5, 2026'
MIN_PRICE_N = 5      # smallest group that may show a price
TARGET_N = 8         # widen the comp search until a step has this many
SIZE_BANDS = [0, 1000, 1500, 2000, 2500, 3000, 10 ** 9]   # match the dropdown and the tax table
ERAS = [(0, 1949), (1950, 1969), (1970, 1979), (1980, 1999), (2000, 2100)]


def read_sheet(path, name):
    """Minimal .xlsx reader (no openpyxl): returns rows of the named sheet as lists of strings."""
    z = zipfile.ZipFile(path)
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        x = z.read('xl/sharedStrings.xml').decode()
        for si in re.findall(r'<(?:x:)?si>(.*?)</(?:x:)?si>', x, re.S):
            ss.append(html.unescape(''.join(re.findall(r'<(?:x:)?t[^>]*>(.*?)</(?:x:)?t>', si, re.S))))
    names = re.findall(r'<(?:x:)?sheet [^>]*?name="([^"]+)"', z.read('xl/workbook.xml').decode())
    sheets = sorted([n for n in z.namelist() if re.match(r'xl/worksheets/sheet\d+\.xml', n)],
                    key=lambda n: int(re.findall(r'\d+', n)[-1]))
    x = z.read(sheets[names.index(name)]).decode()

    def col(c):
        n = 0
        for ch in c:
            n = n * 26 + ord(ch) - 64
        return n - 1
    rows = []
    for row in re.findall(r'<(?:x:)?row[^>]*>(.*?)</(?:x:)?row>', x, re.S):
        vals = {}
        for m in re.finditer(r'<(?:x:)?c r="([A-Z]+)\d+"([^>]*?)(?:/>|>(.*?)</(?:x:)?c>)', row, re.S):
            ref, attrs, inner = m.groups()
            inner = inner or ''
            v = re.search(r'<(?:x:)?v>(.*?)</(?:x:)?v>', inner, re.S)
            t = re.search(r't="(\w+)"', attrs)
            if t and t.group(1) == 's' and v:
                val = ss[int(v.group(1))]
            elif t and t.group(1) == 'inlineStr':
                val = html.unescape(''.join(re.findall(r'<(?:x:)?t[^>]*>(.*?)</(?:x:)?t>', inner, re.S)))
            else:
                val = html.unescape(v.group(1)) if v else ''
            vals[col(ref)] = val
        if vals:
            rows.append([vals.get(i, '') for i in range(max(vals) + 1)])
    return rows


def num(x):
    try:
        return float(str(x).replace(',', '').replace('$', ''))
    except ValueError:
        return None


def style_group(s):
    if 'Split' in s:
        return 'S'
    if 'Bungalow' in s or 'Cape' in s:
        return 'B'
    if 'Ranch' in s:
        return 'R'
    return 'T'


def band(x, edges):
    return next(i for i in range(len(edges) - 1) if edges[i] <= x < edges[i + 1])


def era(y):
    return next(i for i, (a, b) in enumerate(ERAS) if a <= y <= b)


def quant(a, p):
    a = sorted(a)
    i = (len(a) - 1) * p
    lo, hi = math.floor(i), math.ceil(i)
    return a[lo] + (a[hi] - a[lo]) * (i - lo)


def load_sales(xlsx):
    rows = read_sheet(xlsx, 'Master Data')
    h, rows = rows[0], rows[1:]
    g = lambda r, k: r[h.index(k)] if h.index(k) < len(r) else ''
    out = []
    for r in rows:
        if g(r, 'Core Valid') != '1':
            continue
        lat, lon, p, o, fl, d, sf, yr = [num(g(r, k)) for k in ('Latitude', 'Longitude', 'Close Price', 'Original List Price',
                                                                 'Final List Price', 'CDOM', 'Living Area', 'Year Built')]
        if not (lat and lon and p and o and sf and yr):
            continue
        out.append(dict(d=g(r, 'District'), lat=lat, lon=lon, e=era(int(yr)), s=band(sf, SIZE_BANDS),
                        st=style_group(g(r, 'Architectural Style')), p=p, o=o, fl=fl or o, dom=d or 0))
    return out


def summarize(group):
    prices = [x['p'] for x in group]
    return [len(group), round(quant(prices, .25)), round(statistics.median(prices)), round(quant(prices, .75)),
            round(statistics.median([x['p'] / x['o'] * 100 for x in group]), 1),
            int(statistics.median([x['dom'] for x in group])), sum(1 for x in group if x['fl'] < x['o'])]


def build_comps(sales):
    count = collections.Counter(x['d'] for x in sales)
    dists = sorted(count)
    center = {d: (statistics.median([x['lat'] for x in sales if x['d'] == d]),
                  statistics.median([x['lon'] for x in sales if x['d'] == d])) for d in dists}

    def miles(a, b):
        x = (b[1] - a[1]) * math.cos(math.radians((a[0] + b[0]) / 2)) * 69.17
        return math.hypot(x, (b[0] - a[0]) * 69.17)
    near = {d: [e for e in sorted(dists, key=lambda e: miles(center[d], center[e])) if e != d][:2] for d in dists}
    ns, ne = len(SIZE_BANDS) - 1, len(ERAS)
    comps = {}
    for d in dists:
        area = set([d] + near[d])
        for e in range(ne):
            ew = set(range(max(0, e - 1), min(ne - 1, e + 1) + 1))
            for s in range(ns):
                sw = set(range(max(0, s - 1), min(ns - 1, s + 1) + 1))
                for st in 'RTBS':
                    steps = [
                        [x for x in sales if x['d'] == d and x['st'] == st and x['s'] == s and x['e'] == e],
                        [x for x in sales if x['d'] == d and x['s'] == s and x['e'] == e],
                        [x for x in sales if x['d'] == d and x['st'] == st and x['s'] == s and x['e'] in ew],
                        [x for x in sales if x['d'] == d and x['s'] in sw and x['e'] in ew],
                        [x for x in sales if x['d'] in area and x['st'] == st and x['s'] == s and x['e'] == e],
                    ]
                    counts = [len(L) if len(L) >= MIN_PRICE_N else 0 for L in steps]
                    pick = next((i for i, L in enumerate(steps) if len(L) >= TARGET_N), None)
                    thin = 0
                    if pick is None:
                        pick = next((i for i in range(len(steps) - 1, -1, -1) if len(steps[i]) >= MIN_PRICE_N), None)
                        thin = 1
                    if pick is None:
                        continue
                    group = steps[pick]
                    assert len(group) >= MIN_PRICE_N
                    comps[f'{d}|{e}|{s}|{st}'] = [counts, pick, summarize(group), thin]
    return dists, dict(count), near, comps


def page_text(rel):
    return open(os.path.join(ROOT, rel), encoding='utf-8').read()


def cells(row):
    return re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>', row, re.S)


def clean(c):
    return html.unescape(re.sub(r'<[^>]+>', '', re.split(r'<br\s*/?>', c)[0])).strip()


def build_occupancy():
    """Occupancy page tables (St. Louis County, then Jefferson County): city -> 'yes' | 'no' | 'depends'."""
    tables = re.findall(r'<table.*?</table>', page_text('articles/st-louis-occupancy-permits-by-city.html'), re.S)[:2]
    occ = {}
    for county, tb in zip(('stl', 'jeff'), tables):
        for r in re.findall(r'<tr.*?</tr>', tb, re.S)[1:]:
            c = cells(r)
            if len(c) >= 2:
                v = clean(c[1]).lower()
                occ[clean(c[0])] = {'county': county, 'rule': 'yes' if v.startswith('yes') else 'no' if v.startswith('no') else 'depends'}
    return occ


def build_tax(hub='school-districts/st-louis-county.html'):
    """Median tax bill by district, and by district and size, from a district hub's tax tables."""
    s = page_text(hub)
    seg = s[s.index('id="property-taxes"'):]
    tables = re.findall(r'<table.*?</table>', seg, re.S)
    tax = {}
    for r in re.findall(r'<tr.*?</tr>', tables[0], re.S)[1:]:
        c = [clean(x) for x in cells(r)]
        tax[c[0]] = {'n': int(c[1].replace(',', '')), 'med': int(re.sub(r'[^\d]', '', c[2]))}
    rows = re.findall(r'<tr.*?</tr>', tables[2], re.S)
    head = [clean(x) for x in cells(rows[0])]
    size_key = {'1,000–1,499 sq ft': 1, '1,500–1,999 sq ft': 2}
    for r in rows[1:]:
        c = [clean(x) for x in cells(r)]
        for j in range(1, len(head)):
            m = re.match(r'\$([\d,]+) \((\d+)\)', c[j])
            if m and int(m.group(2)) >= MIN_PRICE_N and head[j] in size_key:
                tax.setdefault(c[0], {}).setdefault('size', {})[size_key[head[j]]] = {'med': int(m.group(1).replace(',', '')), 'n': int(m.group(2))}
    return tax


# size band -> cohort centers to try (each cohort is +/-200 sq ft); the best-populated one inside the band is used
JEFF_CENTERS = {0: (700, 800, 900), 1: (1100, 1200, 1300, 1400), 2: (1600, 1700, 1800, 1900), 3: (2100, 2200, 2300, 2400),
                4: (2600, 2700, 2800, 2900), 5: (3000, 3100, 3200, 3300, 3400, 3500)}
JEFF_STYLE = {'R': 'Ranch', 'T': 'Traditional', '*': '*'}


def build_jeffco():
    """Jefferson County comps from the hub's published cohort files (already 5+ sale groups)."""
    agg = page_text('assets/data/sd-jeffco-agg-2026.js')
    agg = json.loads(agg[agg.index('{'):agg.rindex('}') + 1])
    dists = agg['districts']
    count = {d: agg['budget']['districts'][d]['total'] for d in dists}
    folder = os.path.join(ROOT, 'assets', 'data', 'sd-house-jeffco')
    comps = {}
    for fn in sorted(os.listdir(folder)):
        bb = fn[:-5]
        data = json.load(open(os.path.join(folder, fn), encoding='utf-8'))
        for d, styles in data.items():
            for sk, sname in JEFF_STYLE.items():
                for band, centers in JEFF_CENTERS.items():
                    found = [(styles.get(sname) or {}).get('%d_200' % c) for c in centers]
                    found = [x for x in found if x and x[0] >= MIN_PRICE_N and x[1] is not None]
                    a = max(found, key=lambda x: x[0]) if found else None
                    if a:
                        # n, p25, median, p75, sale/list %, median days on market, median year built
                        comps['%s|%s|%d|%s' % (d, bb, band, sk)] = [a[0], a[2], a[1], a[3], round(a[7] * 100, 1), a[6], a[5]]
    return {'districts': dists, 'districtSales': count, 'comps': comps, 'sales': 756}


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sales = load_sales(sys.argv[1])
    dists, count, near, comps = build_comps(sales)
    tax = build_tax()
    tax.update(build_tax('school-districts/jefferson-county.html'))
    data = {'through': THROUGH, 'sales': len(sales), 'districts': dists, 'districtSales': count, 'nearest': near,
            'comps': comps, 'jeffco': build_jeffco(), 'tax': tax, 'occupancy': build_occupancy()}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, separators=(',', ':'), ensure_ascii=False)
    print('St. Louis County sales used: %d, districts: %d, comp groups: %d; Jefferson County cohorts: %d; occupancy rows: %d -> %s'
          % (len(sales), len(dists), len(comps), len(data['jeffco']['comps']), len(data['occupancy']), os.path.relpath(OUT, ROOT)))


if __name__ == '__main__':
    main()
