#!/usr/bin/env python3
"""Add a "Compare Nearby Areas" block to every indexed neighborhood page.

Each page links to the 3-5 bordering areas that have their own neighborhood pages (NEIGHBORS below),
plus the full neighborhoods list. Same facts for every area, no "who it's for" wording (fair housing).
The block sits just before the Ask Me box (or before </main>) and is rebuilt in place on every run.

Run after adding a neighborhood page or changing who borders whom:  python3 scripts/build-nearby-areas.py
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
START, END = '<!-- nearby-areas:start -->', '<!-- nearby-areas:end -->'

NEIGHBORS = {
    # St. Louis City
    'benton-park': ['soulard', 'mckinley-heights', 'fox-park', 'gravois-park', 'tower-grove-east'],
    'bevo': ['princeton-heights', 'southampton', 'dutchtown', 'tower-grove-south'],
    'boulevard-heights': ['princeton-heights', 'carondelet', 'bevo', 'affton'],
    'carondelet': ['patch', 'boulevard-heights', 'dutchtown', 'mt-pleasant'],
    'central-west-end': ['forest-park-southeast', 'dogtown', 'clayton', 'university-city'],
    'dogtown': ['forest-park-southeast', 'the-hill', 'lindenwood-park', 'maplewood'],
    'dutchtown': ['gravois-park', 'bevo', 'mt-pleasant', 'carondelet', 'tower-grove-south'],
    'forest-park-southeast': ['central-west-end', 'dogtown', 'shaw', 'the-hill'],
    'fox-park': ['benton-park', 'mckinley-heights', 'tower-grove-east', 'soulard'],
    'gravois-park': ['dutchtown', 'tower-grove-south', 'benton-park', 'mt-pleasant'],
    'lafayette-square': ['soulard', 'mckinley-heights', 'benton-park', 'fox-park'],
    'lindenwood-park': ['st-louis-hills', 'dogtown', 'maplewood', 'southampton'],
    'mckinley-heights': ['soulard', 'lafayette-square', 'fox-park', 'benton-park'],
    'mt-pleasant': ['dutchtown', 'carondelet', 'gravois-park', 'patch'],
    'northampton': ['st-louis-hills', 'southampton', 'tower-grove-south', 'southwest-garden'],
    'patch': ['carondelet', 'mt-pleasant', 'lemay', 'dutchtown'],
    'princeton-heights': ['st-louis-hills', 'bevo', 'southampton', 'boulevard-heights'],
    'shaw': ['tower-grove-east', 'tower-grove-south', 'southwest-garden', 'forest-park-southeast'],
    'soulard': ['benton-park', 'lafayette-square', 'mckinley-heights', 'fox-park'],
    'southampton': ['st-louis-hills', 'princeton-heights', 'bevo', 'northampton'],
    'southwest-garden': ['the-hill', 'shaw', 'tower-grove-south', 'northampton'],
    'st-louis-hills': ['southampton', 'princeton-heights', 'lindenwood-park', 'northampton'],
    'the-hill': ['southwest-garden', 'dogtown', 'forest-park-southeast', 'northampton'],
    'tower-grove-east': ['tower-grove-south', 'shaw', 'fox-park', 'benton-park'],
    'tower-grove-south': ['tower-grove-east', 'shaw', 'bevo', 'gravois-park', 'dutchtown'],
    # South St. Louis County
    'affton': ['lemay', 'crestwood', 'green-park', 'mehlville'],
    'concord': ['sappington', 'crestwood', 'green-park', 'mehlville', 'sunset-hills'],
    'crestwood': ['sunset-hills', 'sappington', 'concord', 'affton'],
    'green-park': ['affton', 'concord', 'mehlville', 'lemay'],
    'lemay': ['affton', 'mehlville', 'patch', 'carondelet'],
    'mehlville': ['oakville', 'concord', 'lemay', 'green-park'],
    'oakville': ['mehlville', 'concord', 'lemay', 'arnold'],
    'sappington': ['concord', 'crestwood', 'sunset-hills', 'affton'],
    'sunset-hills': ['crestwood', 'sappington', 'kirkwood', 'concord'],
    'webster-groves': ['kirkwood', 'maplewood', 'crestwood', 'affton'],
    'south-county-small-towns': ['affton', 'crestwood', 'sunset-hills', 'webster-groves'],
    # Central and West County
    'ballwin': ['chesterfield', 'kirkwood', 'crystal-lake-park'],
    'chesterfield': ['ballwin', 'maryland-heights', 'crystal-lake-park'],
    'clayton': ['university-city', 'central-west-end', 'maplewood', 'dogtown'],
    'crystal-lake-park': ['clayton', 'kirkwood', 'chesterfield', 'ballwin'],
    'kirkwood': ['webster-groves', 'sunset-hills', 'crestwood', 'ballwin'],
    'maplewood': ['webster-groves', 'dogtown', 'clayton', 'lindenwood-park'],
    'university-city': ['clayton', 'central-west-end', 'maplewood', 'north-county-small-towns'],
    # North County
    'bellefontaine-neighbors': ['spanish-lake', 'moline-acres', 'jennings', 'dellwood'],
    'berkeley': ['ferguson', 'woodson-terrace', 'hazelwood', 'north-county-small-towns'],
    'black-jack': ['florissant', 'spanish-lake', 'dellwood', 'ferguson'],
    'bridgeton': ['maryland-heights', 'st-ann', 'hazelwood', 'woodson-terrace', 'champ'],
    'champ': ['maryland-heights', 'bridgeton', 'hazelwood'],
    'dellwood': ['ferguson', 'black-jack', 'florissant', 'bellefontaine-neighbors'],
    'ferguson': ['florissant', 'dellwood', 'berkeley', 'jennings'],
    'florissant': ['hazelwood', 'black-jack', 'ferguson', 'dellwood'],
    'hazelwood': ['florissant', 'bridgeton', 'berkeley', 'ferguson'],
    'jennings': ['ferguson', 'moline-acres', 'bellefontaine-neighbors', 'north-county-small-towns'],
    'maryland-heights': ['bridgeton', 'champ', 'st-ann', 'chesterfield'],
    'moline-acres': ['bellefontaine-neighbors', 'jennings', 'dellwood', 'spanish-lake'],
    'spanish-lake': ['bellefontaine-neighbors', 'black-jack', 'florissant', 'moline-acres'],
    'st-ann': ['st-john', 'bridgeton', 'woodson-terrace', 'maryland-heights'],
    'st-john': ['st-ann', 'woodson-terrace', 'berkeley', 'north-county-small-towns'],
    'woodson-terrace': ['berkeley', 'st-john', 'st-ann', 'bridgeton'],
    'north-county-small-towns': ['jennings', 'st-john', 'university-city', 'ferguson'],
    # Jefferson County
    'arnold': ['imperial', 'barnhart', 'oakville', 'fenton-jefferson-county'],
    'barnhart': ['imperial', 'arnold', 'pevely', 'herculaneum'],
    'byrnes-mill': ['house-springs', 'high-ridge', 'cedar-hill', 'eureka-jefferson-county', 'scotsdale'],
    'cedar-hill': ['house-springs', 'hillsboro', 'byrnes-mill', 'de-soto', 'parkdale'],
    'crystal-city': ['festus', 'herculaneum', 'pevely', 'hillsboro'],
    'de-soto': ['hillsboro', 'festus', 'cedar-hill', 'crystal-city'],
    'eureka-jefferson-county': ['byrnes-mill', 'house-springs', 'high-ridge', 'fenton-jefferson-county'],
    'fenton-jefferson-county': ['high-ridge', 'arnold', 'imperial', 'south-county-small-towns'],
    'festus': ['crystal-city', 'herculaneum', 'pevely', 'de-soto'],
    'herculaneum': ['pevely', 'festus', 'crystal-city', 'barnhart', 'olympian-village'],
    'high-ridge': ['house-springs', 'byrnes-mill', 'fenton-jefferson-county', 'eureka-jefferson-county', 'peaceful-village'],
    'hillsboro': ['de-soto', 'cedar-hill', 'festus', 'house-springs'],
    'house-springs': ['high-ridge', 'byrnes-mill', 'cedar-hill', 'hillsboro', 'parkdale'],
    'imperial': ['arnold', 'barnhart', 'fenton-jefferson-county', 'pevely'],
    'olympian-village': ['pevely', 'herculaneum', 'barnhart', 'festus'],
    'parkdale': ['byrnes-mill', 'house-springs', 'high-ridge', 'cedar-hill', 'peaceful-village', 'scotsdale'],
    'peaceful-village': ['byrnes-mill', 'house-springs', 'high-ridge', 'parkdale', 'scotsdale'],
    'pevely': ['herculaneum', 'barnhart', 'festus', 'imperial', 'olympian-village'],
    'scotsdale': ['byrnes-mill', 'house-springs', 'high-ridge', 'parkdale', 'peaceful-village'],
}

NAMES = {'central-west-end': 'Central West End', 'eureka-jefferson-county': 'Eureka (Jefferson County side)',
         'fenton-jefferson-county': 'Fenton (Jefferson County side)', 'south-county-small-towns': 'South County small towns',
         'north-county-small-towns': 'North County small towns', 'st-louis-hills': 'St.&nbsp;Louis Hills', 'st-ann': 'St.&nbsp;Ann',
         'st-john': 'St.&nbsp;John', 'mt-pleasant': 'Mt. Pleasant', 'mckinley-heights': 'McKinley Heights', 'de-soto': 'De Soto',
         'the-hill': 'The Hill', 'patch': 'Patch', 'university-city': 'University City'}


def name(slug):
    return NAMES.get(slug) or ' '.join(w.capitalize() for w in slug.split('-'))


def block(slug):
    links = ''.join('<li><a href="/neighborhoods/%s" style="display:inline-block;padding:7px 12px;border:1px solid rgba(255,204,77,.35);'
                    'border-radius:999px;color:#ffcc4d;text-decoration:none;font-size:14px;font-weight:600;">%s &rarr;</a></li>' % (n, name(n))
                    for n in NEIGHBORS[slug])
    return ('%s\n<section class="nearby-areas" id="nearby-areas" aria-labelledby="nearby-areas-h" style="max-width:760px;margin:36px auto 8px;'
            'padding:18px 20px;border:1px solid rgba(255,255,255,.12);border-radius:12px;">\n'
            '  <h2 id="nearby-areas-h" style="font-size:20px;margin:0 0 6px;">Compare Nearby Areas</h2>\n'
            '  <p style="margin:0 0 12px;font-size:14px;color:rgba(255,255,255,.7);">Areas that border %s, each with its own sales, prices and taxes.</p>\n'
            '  <ul style="list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px;">%s</ul>\n'
            '  <p style="margin:12px 0 0;font-size:14px;"><a href="/neighborhoods/" style="color:#ffcc4d;">All St.&nbsp;Louis neighborhoods &rarr;</a></p>\n'
            '</section>\n%s\n') % (START, name(slug), links, END)


def main():
    pages = {f[:-5] for f in os.listdir(os.path.join(ROOT, 'neighborhoods')) if f.endswith('.html') and f != 'index.html'}
    done, missing = 0, []
    for slug, nbs in NEIGHBORS.items():
        bad = [n for n in nbs if n not in pages]
        assert not bad, (slug, bad)
        p = os.path.join(ROOT, 'neighborhoods', slug + '.html')
        s = open(p, encoding='utf-8').read()
        s = re.sub(r'%s.*?%s\n?' % (re.escape(START), re.escape(END)), '', s, flags=re.S)
        i = s.find('<!-- ASK ME')
        if i < 0:
            i = s.rfind('</main>')
        assert i > 0, slug
        s = s[:i] + block(slug) + s[i:]
        open(p, 'w', encoding='utf-8').write(s)
        done += 1
    for slug in sorted(pages - set(NEIGHBORS)):
        s = open(os.path.join(ROOT, 'neighborhoods', slug + '.html'), encoding='utf-8').read()
        if not re.search(r'<meta name="robots" content="[^"]*noindex', s):
            missing.append(slug)
    print('nearby blocks: %d pages; indexed pages without an entry: %s' % (done, missing or 'none'))


if __name__ == '__main__':
    main()
