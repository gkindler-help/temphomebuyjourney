#!/usr/bin/env python3
"""Write assets/data/district-tax-2026.json for the mortgage payment calculator's
"Don't know the taxes?" picker.

Reads the property-tax table (district, sales, median tax, middle half) from the two district hubs:
school-districts/st-louis-county.html and school-districts/jefferson-county.html. Those tables are
the sellers' most recent bills as listed in MLS for 2026 sales. Group figures only, nothing per house.

Run after either hub's property-tax table changes:  python3 scripts/build-district-tax.py
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HUBS = [('school-districts/st-louis-county.html', 'St. Louis County'),
        ('school-districts/jefferson-county.html', 'Jefferson County')]
OUT = 'assets/data/district-tax-2026.json'


def clean(x):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', x)).split())


def dollars(x):
    return int(re.sub(r'[^\d]', '', x))


def main():
    rows, period = [], None
    for hub, county in HUBS:
        s = open(os.path.join(ROOT, hub), encoding='utf-8').read()
        seg = s[s.index('id="property-taxes"'):]
        m = re.search(r'closed (January 1[^.<]*?20\d\d)', clean(seg[:6000]))
        period = period or (m and m.group(1))
        table = re.findall(r'<table.*?</table>', seg, re.S)[0]
        for r in re.findall(r'<tr.*?</tr>', table, re.S)[1:]:
            c = [clean(x) for x in re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>', r, re.S)]
            lo, hi = [dollars(v) for v in re.split(r'[–-]', c[3])]
            rows.append({'district': c[0], 'county': county, 'sales': int(c[1].replace(',', '')),
                         'median': dollars(c[2]), 'low': lo, 'high': hi})
    out = {'source': 'Sellers’ most recent annual tax bills as listed in MLS, single-family homes closed %s' % period,
           'districts': rows}
    with open(os.path.join(ROOT, OUT), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    print('districts: %d (%s)' % (len(rows), period))


if __name__ == '__main__':
    main()
