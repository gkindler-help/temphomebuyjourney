#!/usr/bin/env python3
"""Build the site search: the Pagefind index in /pagefind and the keyword
recommendations in /assets/search-recs.json.

Run from the repo root before every PR that changes page content:
    python3 scripts/build-search.py

Pages are copied to a temp folder and marked up there (anchors on question
headings, section filters, ignored chrome), so the live HTML never changes.
Needs Node (npx) for Pagefind.
"""
import html, json, os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGEFIND = 'pagefind@1.3.0'

# Pages that should never show up in results.
SKIP = {'404.html', 'site-index.html', 'pinterest-10a52.html', 'home-cost-demo.html', 'search.html', 'scan/index.html', 'tools/seller-net-calculator.html'}
SKIP_DIRS = ('.git/', 'docs/', 'pagefind/', 'node_modules/', 'scripts/', '.vscode/')

# Site chrome that shouldn't be searchable.
IGNORE = ['header', 'footer', '.nbhd-hdr', '.art-hdr', '.breadcrumb', '.nbhd-breadcrumb', '.george-card',
          '[data-ask-me]', '.jump-panel', '.jump-fab', '.related-journey', '.icon-card-grid', '.mtc-mount',
          '.stlhj-offer']

SECTIONS = [('articles/lessons-from-a-sale', 'Lessons From a Sale'), ('articles/', 'Guides'),
            ('neighborhoods/', 'Neighborhoods'), ('school-districts/', 'School districts'),
            ('zip-codes/', 'ZIP codes'), ('listings/', 'Listings'), ('tools/', 'Tools'),
            ('0', 'Buyer journey')]

# Recommended reading by keyword. Titles and blurbs are read from each page.
TOPICS = [
    (['self-employed', 'self employed', 'business owner', '1099', 'schedule c', 'k-1', 'bank statement loan', 'write-offs', 'tax returns'],
     ['articles/self-employed-mortgage-st-louis', 'articles/self-employed-mortgage-st-louis#write-offs', 'articles/mortgage-pre-approval-st-louis']),
    (['commission', 'buyer agent fee', 'buyers agent', "buyer's agent", 'compensation', 'nar settlement', 'buyer agreement', 'agency agreement', 'realtor fee'],
     ['articles/who-pays-buyer-agent-commission-stl', 'articles/do-i-need-a-buyers-agent-stl', 'articles/how-george-works-with-buyers#commission', 'articles/lessons-from-a-sale-fenton-san-luis#commission']),
    (['move in', 'move-in', 'possession', 'get the keys', 'keys', 'rent-back', 'rent back', 'holdover', 'seller stay after closing', 'walk-through', 'walkthrough', 'final walk through'],
     ['articles/when-can-i-move-in-after-closing-st-louis', 'articles/should-i-accept-this-offer-st-louis#rent-back', 'articles/lessons-from-a-sale-fenton-san-luis#fixtures']),
    (['multiple offers on my house', 'multiple offers', 'highest and best', 'bidding war', 'two offers', 'several offers', 'backup offer', 'competing offers'],
     ['articles/multiple-offers-on-my-house-st-louis', 'articles/should-i-accept-this-offer-st-louis#compare', 'articles/how-much-to-offer-on-a-house-st-louis', 'articles/lessons-from-a-sale-fenton-san-luis#highest-and-best']),
    (['appraisal', 'appraise', 'appraised', 'appraiser', 'low appraisal', 'appraisal gap', 'appraised low', 'reconsideration of value'],
     ['articles/appraisal-comes-in-low-st-louis', 'articles/lessons-from-a-sale-galena-appraisal', 'articles/how-much-to-offer-on-a-house-st-louis#appraisal-gap', 'articles/va-appraisal-failed-st-louis-what-happens-next']),
    (['contingency', 'contingencies', 'waive', 'waiving', 'waive inspection', 'waive the inspection', 'financing contingency', 'appraisal contingency', 'back out', 'backing out', 'earnest money back'],
     ['articles/which-contingencies-to-keep-st-louis', 'articles/how-much-to-offer-on-a-house-st-louis', 'articles/sell-first-or-buy-first-st-louis']),
    (['offer', 'offers', 'multiple offers', 'highest and best', 'escalation', 'bidding', 'over asking', 'appraisal gap', 'earnest money'],
     ['articles/how-much-to-offer-on-a-house-st-louis', 'articles/lessons-from-a-sale-fenton-san-luis#highest-and-best', 'articles/should-i-accept-this-offer-st-louis']),
    (['inspection', 'inspector', 'repair', 'repairs', 'credit', 'furnace', 'hvac', 'roof', 'foundation', 'sewer', 'sewer scope', 'radon', 'termite'],
     ['articles/home-inspection-st-louis', 'articles/repair-costs-affect-offer-price-stl', 'articles/stl-home-repair-cost-guide', 'articles/what-to-look-for-buying-house-stl']),
    (['home warranty', 'warranty'],
     ['articles/lessons-from-a-sale-fenton-san-luis#inspection', 'articles/repair-costs-affect-offer-price-stl']),
    (['fixture', 'fixtures', 'doorbell', 'walk-through', 'walkthrough', 'final walk'],
     ['articles/lessons-from-a-sale-fenton-san-luis#fixtures', '08-walkthrough']),
    (['septic', 'wastewater', 'well water', 'lake house', 'cabin'],
     ['articles/lessons-from-a-sale-ste-genevieve-septic']),
    (['list price', 'pricing', 'price my home', 'price my house', 'worth', 'home value', 'comps', 'comparable', 'listing agent'],
     ['articles/how-george-works-with-sellers', 'articles/lessons-from-a-sale-lindbergh-split-level', 'articles/what-not-to-repair-before-selling-stl-pricing-strategy']),
    (['price reduction', 'lower the price', 'lower my price', 'no offers', 'no showings', "didn't sell", 'didnt sell', 'expired', 'relist'],
     ['articles/when-to-lower-house-price-st-louis', 'articles/showings-but-no-offers-st-louis', 'articles/no-showings-st-louis-home', 'articles/why-your-st-louis-home-didnt-sell']),
    (['cash offer', 'cash buyer', 'we buy houses', 'investor', 'wholesale', 'wholesaler', 'as is', 'as-is'],
     ['articles/what-you-lose-with-cash-offer-stl', 'articles/how-cash-buyers-calculate-offers-stl', 'tools/cash-offer-decoder']),
    (['net', 'proceeds', 'cost to sell', 'selling costs', 'seller closing costs'],
     ['articles/what-will-i-net-selling-stl', 'articles/cost-to-sell-home-stl']),
    (['closing costs', 'closing cost'],
     ['articles/buyer-closing-costs-st-louis', 'articles/what-will-i-net-selling-stl']),
    (['afford', 'affordability', 'income', 'salary', 'how much house', 'dti', 'budget', 'monthly payment'],
     ['articles/how-much-income-to-buy-home-stl', 'stl-home-buying-power-calculator', 'articles/stl-affordability-by-zip-code']),
    (['down payment', 'first time', 'first-time', 'mhdc', 'first place', 'next step', 'assistance', 'dpa'],
     ['articles/mhdc-first-place-next-step-missouri-guide', 'articles/first-time-buyer-programs-stl', 'articles/how-much-down-payment-st-louis']),
    (['fha', 'conventional', 'loan', 'mortgage', 'pre-approval', 'preapproval', 'pre approval', 'credit score', 'rate', 'rates', 'lender'],
     ['articles/mortgage-pre-approval-st-louis', 'articles/conventional-vs-fha-loan-st-louis', 'articles/credit-score-buy-home-st-louis']),
    (['va', 'va loan', 'veteran', 'veterans', 'military'],
     ['articles/va-home-loan-st-louis-what-kills-deals', 'articles/how-to-screen-stl-homes-before-va-offer', 'articles/va-appraisal-failed-st-louis-what-happens-next']),
    (['federal pacific', 'fpe', 'zinsco', 'electrical panel', 'panel'],
     ['articles/federal-pacific-panel-va-loan-st-louis']),
    (['downsize', 'downsizing', 'right-size', 'right size', 'right-sizing', 'retire', 'retirement', 'empty nest', 'grandkids', 'grandchildren'],
     ['longtime-homeowners', 'articles/should-i-downsize-my-house-st-louis', 'articles/where-should-i-move-when-downsizing-st-louis', 'articles/lessons-from-a-sale-fenton-san-luis']),
    (['sell first', 'buy first', 'contingency', 'bridge loan', 'home sale contingency'],
     ['articles/sell-first-or-buy-first-st-louis']),
    (['best time', 'when to sell', 'when to buy', 'winter', 'fall', 'season', 'how long'],
     ['articles/sell-house-fall-winter-st-louis', 'articles/how-long-to-buy-house-st-louis']),
    (['school', 'schools', 'school district', 'school districts', 'district'],
     ['school-districts', 'school-districts/st-louis-county', 'school-districts/jefferson-county', 'school-district-map']),
    (['tax', 'taxes', 'property tax', 'property taxes'],
     ['school-districts/st-louis-county#property-taxes', 'school-districts/jefferson-county#property-taxes']),
    (['where to live', 'neighborhood', 'neighborhoods', 'best neighborhoods', 'best area', 'areas'],
     ['articles/where-to-live-in-st-louis', 'articles/best-st-louis-neighborhoods-for-buyers', 'neighborhood-matcher']),
    (['south county'], ['south-county-st-louis', 'articles/south-county-stl-neighborhood-guide', 'articles/south-county-stl-neighborhoods-by-price']),
    (['west county'], ['articles/west-county-st-louis-neighborhoods']),
    (['north county'], ['north-county-st-louis']),
    (['jefferson county', 'jeffco'], ['jefferson-county-mo', 'school-districts/jefferson-county']),
    (['south city', 'st louis city', 'city of st louis'], ['south-city-st-louis']),
    (['fenton'], ['articles/fenton-mo-city-vs-unincorporated', 'neighborhoods/fenton-jefferson-county', 'neighborhoods/south-county-small-towns#fenton', 'articles/lessons-from-a-sale-fenton-san-luis']),
    (['occupancy', 'occupancy permit', 'occupancy inspection'], ['neighborhoods/maryland-heights#mh-q-occupancy', 'jefferson-county-mo']),
    (['zillow', 'zestimate'], ['articles/what-happens-when-you-click-zillow', 'articles/zillow-zestimate-accurate-stl']),
    (['rent', 'renting', 'rent vs buy'], ['articles/renting-vs-buying-stl']),
    (['203k', '203(k)', '203 k', 'fha 203k', 'rehab loan'], ['articles/fixer-upper-vs-move-in-ready-st-louis#fha-203k-limited']),
    (['homestyle', 'homestyle loan'], ['articles/fixer-upper-vs-move-in-ready-st-louis#homestyle']),
    (['renovation loan', 'renovation loans'], ['articles/fixer-upper-vs-move-in-ready-st-louis#financing']),
    (['fixer', 'fixer upper', 'fixer-upper', 'renovate', 'renovation', 'move-in ready', 'flip'],
     ['articles/fixer-upper-vs-move-in-ready-st-louis', 'fixer-upper-vs-move-in-stl']),
    (['fsbo', 'for sale by owner', 'flat fee', 'mls'], ['fsbo-st-louis', 'articles/flat-fee-mls-st-louis']),
    (['clayton', 'ladue'], ['articles/clayton-vs-ladue-under-1-million']),
    (['lindbergh', 'mehlville'], ['articles/lindbergh-vs-mehlville-school-district-stl']),
    (['town and country', 'frontenac'], ['articles/town-and-country-vs-frontenac-vs-ladue', 'articles/west-county-st-louis-neighborhoods']),
    (['ballwin', 'manchester'], ['articles/ballwin-vs-manchester-mo', 'neighborhoods/ballwin']),
    (['chesterfield', 'wildwood'], ['articles/chesterfield-vs-wildwood-mo', 'neighborhoods/chesterfield']),
    (['florissant', 'hazelwood'], ['articles/florissant-vs-hazelwood-mo', 'neighborhoods/florissant', 'neighborhoods/hazelwood']),
    (['arnold', 'oakville vs'], ['articles/oakville-vs-arnold-mo', 'neighborhoods/arnold', 'neighborhoods/oakville']),
    (['parkway', 'rockwood'], ['articles/parkway-vs-rockwood-st-louis', 'school-districts/parkway-school-district', 'school-districts/rockwood-school-district']),
    (['kirkwood', 'webster groves'], ['articles/kirkwood-vs-webster-groves-st-louis', 'neighborhoods/kirkwood', 'neighborhoods/webster-groves']),
    (['cheap house', 'regret', 'regrets'], ['articles/what-buyers-regret-cheap-house-st-louis']),
    (['300k', '450k', '600k', 'what can i buy'], ['articles/what-300k-450k-600k-buys-st-louis']),
    (['lesson', 'lessons', 'case study', 'real sale', 'story'], ['articles/lessons-from-a-sale']),
    (['george', 'kindler', 'about', 'experience', 'reviews', 'review', 'sold'], ['about', 'experience', 'articles/how-george-works-with-buyers', 'articles/how-george-works-with-sellers']),
    (['sell', 'selling', 'seller', 'list my house', 'list my home'], ['articles/how-george-works-with-sellers', 'articles/what-will-i-net-selling-stl', 'articles/should-i-accept-this-offer-st-louis']),
    (['buy', 'buying', 'buyer', 'first home'], ['articles/how-george-works-with-buyers', 'complete-guide', 'articles/mortgage-pre-approval-st-louis']),
]


def rel(p):
    return os.path.relpath(p, ROOT).replace(os.sep, '/')


def redirected_paths():
    """Files shadowed by a redirect in _redirects are never served, so skip them."""
    out = set()
    for line in open(os.path.join(ROOT, '_redirects')):
        parts = line.split()
        if len(parts) >= 2 and parts[0].startswith('/') and '*' not in parts[0]:
            src = parts[0].lstrip('/')
            dest = parts[1].split('#')[0].lstrip('/')
            if re.sub(r'\.html$', '', src) == re.sub(r'\.html$', '', dest):
                continue  # .html -> clean URL of the same page
            out.update({src, src + '.html', src.rstrip('/') + '/index.html'})
    return out


def pages():
    skip = SKIP | redirected_paths()
    for d, _, files in os.walk(ROOT):
        for f in files:
            if not f.endswith('.html'):
                continue
            r = rel(os.path.join(d, f))
            if r in skip or r.startswith(SKIP_DIRS):
                continue
            yield r


def section(r):
    for prefix, name in SECTIONS:
        if r.startswith(prefix):
            return name
    return 'Pages'


def stage(src, r):
    s = open(src, encoding='utf-8', errors='replace').read()
    # Give question headings the anchor of their wrapper (Quick Answers put the id on the div).
    s = re.sub(r'(<(?:div|section)\b[^>]*\bid="([^"]+)"[^>]*>\s*)<h([2-4])\b(?![^>]*\bid=)',
               lambda m: '%s<h%s id="%s"' % (m.group(1), m.group(3), m.group(2)), s)
    title, desc = head_text(s)
    extra = ('<meta data-pagefind-filter="section[content]" content="%s">' % section(r) +
             '<meta data-pagefind-meta="title[content]" content="%s">' % html.escape(title, quote=True) +
             # Title and description count extra, so the page that owns a topic ranks first.
             '<div data-pagefind-weight="8">%s. %s</div>' % (html.escape(title), html.escape(desc)))
    s = re.sub(r'<body\b[^>]*>', lambda m: m.group(0) + extra, s, count=1)
    return s


def clean_title(t):
    t = html.unescape(re.sub(r'\s+', ' ', t)).strip()
    t = re.split(r'\s+\|\s+|\s+[\u2013\u2014-]\s+(?:STL Home Journey|George Kindler)', t)[0]
    # Journey chapters: "Home Buyer Journey · Chapter 8 · Final Walk-Through" -> "Buyer Journey, Chapter 8: Final Walk-Through"
    m = re.match(r'(?:STL )?Home Buyer Journey \u00b7 (Chapter \d+|Walk With Me) \u00b7 (.+)', t)
    return 'Buyer Journey, %s: %s' % m.groups() if m else t


def head_text(s):
    t = re.search(r'<title>(.*?)</title>', s, re.S)
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    title = clean_title(t.group(1)) if t else ''
    desc = html.unescape(d.group(1)).strip() if d else ''
    if not desc and title.startswith('Buyer Journey'):
        desc = 'A step in the interactive St. Louis home buyer journey, with George\u2019s take at each decision.'
    return title, desc


def page_info(path):
    f = os.path.join(ROOT, path + '.html')
    if not os.path.isfile(f):
        f = os.path.join(ROOT, path, 'index.html')
    if path == 'index':
        f = os.path.join(ROOT, 'index.html')
    if not os.path.isfile(f):
        sys.exit('search topic points at a missing page: ' + path)
    title, desc = head_text(open(f, encoding='utf-8').read())
    title = title or path
    if len(desc) > 120:
        desc = desc[:117].rsplit(' ', 1)[0].rstrip(',;:') + '\u2026'
    return title, desc


def url_of(r):
    u = '/' + re.sub(r'(^|/)index\.html$', r'\1', r)
    return u[:-5] if u.endswith('.html') else u


def build_recs(indexed):
    """pages: every indexed page as url -> [title, blurb, section].
    topics: keyword lists pointing at pages (anchors allowed)."""
    pages = {}
    for r in indexed:
        title, desc = page_info(url_of(r).strip('/') or 'index')
        pages[url_of(r)] = [title, desc, section(r)]
    topics = []
    for keys, urls in TOPICS:
        for u in urls:
            path, _, frag = u.partition('#')
            if '/' + path not in pages:
                sys.exit('search topic points at a page that is not indexed: ' + path)
            f = os.path.join(ROOT, path + '.html')
            if frag and ('id="%s"' % frag) not in open(f, encoding='utf-8').read():
                sys.exit('missing anchor #%s on %s' % (frag, path))
        topics.append({'keys': keys, 'urls': ['/' + u for u in urls]})
    # Every neighborhood, district and ZIP page answers to its own name.
    for url in sorted(pages):
        folder, _, slug = url.strip('/').partition('/')
        if folder in ('neighborhoods', 'school-districts', 'zip-codes') and slug:
            name = slug.replace('-school-district', '').replace('-schools', '').replace('-', ' ')
            keys = [name] + ([name.replace(' jefferson county', '')] if 'jefferson county' in name else [])
            topics.append({'keys': keys, 'urls': [url], 'exact': True})
    return {'pages': pages, 'topics': topics}


def main():
    tmp = tempfile.mkdtemp(prefix='stlhj-search-')
    try:
        indexed = sorted(pages())
        for r in indexed:
            dst = os.path.join(tmp, r)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            open(dst, 'w', encoding='utf-8').write(stage(os.path.join(ROOT, r), r))
        out = os.path.join(ROOT, 'pagefind')
        shutil.rmtree(out, ignore_errors=True)
        json.dump({'site': '.', 'output_path': out, 'exclude_selectors': IGNORE, 'force_language': 'en'},
                  open(os.path.join(tmp, 'pagefind.json'), 'w'))
        subprocess.run(['npx', '-y', PAGEFIND, '--quiet'], cwd=tmp, check=True)
        print('indexed', len(indexed), 'pages')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    recs = build_recs(indexed)
    json.dump(recs, open(os.path.join(ROOT, 'assets/search-recs.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, separators=(',', ':'))
    print('wrote', len(recs['pages']), 'pages and', len(recs['topics']), 'recommendation topics')


if __name__ == '__main__':
    main()
