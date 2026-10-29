#!/usr/bin/env python3
"""Put one quiet "From George's own transactions" line right after each page's Quick Answers.

The answer stays first. The strip points to the Lessons From a Sale story that fits the page,
or to how George works with buyers or sellers when no story fits yet, plus the Lessons hub.
No contact ask: each page's Ask Me box further down handles that.

To point a page at a new lesson, add the lesson to LESSONS and change the page's entry in PAGES.
Run:  python3 scripts/build-lesson-strip.py   (then build-search.py)
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HUB = '/articles/lessons-from-a-sale'
CSS = '<link rel="stylesheet" href="/assets/lesson-strip.css">'
START, END = '<!-- lesson-strip:start -->', '<!-- lesson-strip:end -->'

# Each lesson: (url, link text). Link text says what the reader will see happen.
LESSONS = {
    'fenton':    ('/articles/lessons-from-a-sale-fenton-san-luis', 'How Roy and Karen stayed $27,000 under budget in Fenton'),
    'galena':    ('/articles/lessons-from-a-sale-galena-appraisal', 'Four offers, a low appraisal, and a close at $271,000'),
    'lindbergh': ('/articles/lessons-from-a-sale-lindbergh-split-level', 'Pricing a Lindbergh split-level when the only comps sold in spring'),
    'septic':    ('/articles/lessons-from-a-sale-ste-genevieve-septic', 'The septic that changed who could buy the house'),
    'autumn':    ('/articles/lessons-from-a-sale-imperial-autumn-ridge', '$15,000 over asking with no competing offer'),
    'countryglen': ('/articles/lessons-from-a-sale-imperial-country-glen', 'The buyers said no repairs, then asked for $4,000'),
    'winterpark': ('/articles/lessons-from-a-sale-fenton-winter-park', 'Three $300,000 offers, sold for $302,000'),
    'maple':     ('/articles/lessons-from-a-sale-maplewood-maple-avenue', 'When the seller\'s repairs failed the final walk-through'),
    'blackforest': ('/articles/lessons-from-a-sale-blackforest-cash-condo', 'The "cash" buyer whose money depended on another sale'),
    'creekside': ('/articles/lessons-from-a-sale-cedar-hill-creek-side', 'Buying the next house before selling the first'),
    'covington': ('/articles/lessons-from-a-sale-north-county-covington-gardens', 'Relisted with no new work: $20,000 more than it expired at'),
    'willow':    ('/articles/lessons-from-a-sale-northwoods-va-purchase', 'Appraised $15,100 over the price, with six repairs still open'),
    'thirtyk':   ('/articles/st-louis-home-price-reduction-negotiation', 'How my buyer got $30,000 off before inspections'),
}
# No story fits yet: how George works.
DEFAULTS = {
    'buyer':  ('/articles/how-george-works-with-buyers', 'What I check before you write an offer'),
    'seller': ('/articles/how-george-works-with-sellers', 'How I price and sell a St. Louis home'),
}

# page -> lesson key, or 'buyer' / 'seller' for the how-George-works default.
# Pages that already carry a Real Deal box (septic) get a different story here.
PAGES = {
    'articles/appraisal-comes-in-low-st-louis.html': 'galena',
    'articles/ballwin-vs-manchester-mo.html': 'buyer',
    'articles/best-time-to-buy-sell-move-st-louis.html': 'lindbergh',
    'articles/best-st-louis-neighborhoods-for-buyers.html': 'buyer',
    'articles/can-you-buy-fixer-upper-va-loan-st-louis.html': 'buyer',
    'articles/chesterfield-vs-wildwood-mo.html': 'buyer',
    'articles/conventional-vs-fha-loan-st-louis.html': 'buyer',
    'articles/cost-to-sell-home-stl.html': 'galena',
    'articles/credit-score-buy-home-st-louis.html': 'buyer',
    'articles/do-i-need-a-buyers-agent-stl.html': 'fenton',
    'articles/lessons-from-a-sale-earnest-money-releases.html': 'blackforest',
    'articles/self-employed-mortgage-st-louis.html': 'fenton',
    'articles/moving-to-st-louis.html': 'thirtyk',
    'articles/federal-pacific-panel-va-loan-st-louis.html': 'buyer',
    'articles/fenton-mo-city-vs-unincorporated.html': 'fenton',
    'articles/first-time-buyer-programs-stl.html': 'buyer',
    'articles/fixer-upper-vs-move-in-ready-st-louis.html': 'thirtyk',
    'articles/florissant-vs-hazelwood-mo.html': 'buyer',
    'articles/how-cash-buyers-calculate-offers-stl.html': 'seller',
    'articles/how-long-to-buy-house-st-louis.html': 'fenton',
    'articles/how-much-down-payment-st-louis.html': 'buyer',
    'articles/how-much-house-afford-making-100k-st-louis.html': 'buyer',
    'articles/how-much-house-afford-making-120k-st-louis.html': 'buyer',
    'articles/how-much-house-afford-making-150k-st-louis.html': 'buyer',
    'articles/how-much-house-afford-making-200k-st-louis.html': 'buyer',
    'articles/how-much-house-afford-making-50k-st-louis.html': 'buyer',
    'articles/how-much-house-afford-making-60k-st-louis.html': 'buyer',
    'articles/how-much-house-afford-making-70k-st-louis.html': 'buyer',
    'articles/how-much-house-afford-making-80k-st-louis.html': 'buyer',
    'articles/how-much-income-to-buy-home-stl.html': 'buyer',
    'articles/how-much-to-offer-on-a-house-st-louis.html': 'fenton',
    'articles/how-to-screen-stl-homes-before-va-offer.html': 'willow',
    'articles/kirkwood-vs-webster-groves-st-louis.html': 'buyer',
    'articles/lindbergh-vs-mehlville-school-district-stl.html': 'lindbergh',
    'articles/multiple-offers-on-my-house-st-louis.html': 'winterpark',
    'articles/no-showings-st-louis-home.html': 'seller',
    'articles/oakville-vs-arnold-mo.html': 'buyer',
    'articles/parkway-vs-rockwood-st-louis.html': 'buyer',
    'articles/relist-house-st-louis-30-day-rule.html': 'covington',
    'articles/repair-costs-affect-offer-price-stl.html': 'autumn',
    'articles/sell-first-or-buy-first-st-louis.html': 'creekside',
    'articles/sell-house-fall-winter-st-louis.html': 'winterpark',
    'articles/selling-home-south-st-louis-county.html': 'lindbergh',
    'articles/should-i-accept-this-offer-st-louis.html': 'autumn',
    'articles/should-i-downsize-my-house-st-louis.html': 'fenton',
    'articles/showings-but-no-offers-st-louis.html': 'seller',
    'articles/st-louis-buyers-bigger-problem-than-rates.html': 'buyer',
    'articles/st-louis-home-buying-for-physicians.html': 'creekside',
    'articles/stl-affordability-by-zip-code.html': 'buyer',
    'articles/stl-home-repair-cost-guide.html': 'countryglen',
    'articles/town-and-country-vs-frontenac-vs-ladue.html': 'buyer',
    'articles/va-appraisal-failed-st-louis-what-happens-next.html': 'willow',
    'articles/va-home-loan-st-louis-what-kills-deals.html': 'willow',
    'articles/west-county-st-louis-neighborhoods.html': 'buyer',
    'articles/what-300k-450k-600k-buys-st-louis.html': 'buyer',
    'articles/what-buyers-regret-cheap-house-st-louis.html': 'thirtyk',
    'articles/what-happens-when-you-click-zillow.html': 'buyer',
    'articles/what-not-to-repair-before-selling-stl-pricing-strategy.html': 'maple',
    'articles/what-to-look-for-buying-house-stl.html': 'thirtyk',
    'articles/what-will-i-net-selling-stl.html': 'autumn',
    'articles/what-you-lose-with-cash-offer-stl.html': 'blackforest',
    'articles/when-can-i-move-in-after-closing-st-louis.html': 'buyer',
    'articles/when-to-lower-house-price-st-louis.html': 'lindbergh',
    'articles/where-should-i-move-when-downsizing-st-louis.html': 'fenton',
    'articles/which-contingencies-to-keep-st-louis.html': 'galena',
    'articles/who-pays-buyer-agent-commission-stl.html': 'fenton',
    'articles/why-your-st-louis-home-didnt-sell.html': 'covington',
    'articles/zillow-zestimate-accurate-stl.html': 'thirtyk',
    'sellers/assignment-contract-real-estate-missouri/index.html': 'seller',
    'sellers/cash-offers-st-louis.html': 'blackforest',
    'sellers/proof-of-funds-cash-buyer-st-louis/index.html': 'blackforest',
    'sellers/retrading-cash-offer-st-louis/index.html': 'seller',
}

QA_OPEN = re.compile(r'<(section|div)\b[^>]*\bid="quick-answers?"[^>]*>')


def strip_html(key):
    if key in DEFAULTS:
        url, text = DEFAULTS[key]
        label = 'How George works'
    else:
        url, text = LESSONS[key]
        label = 'From George&rsquo;s own transactions'
    text = text.replace("'", '&rsquo;')
    return (f'{START}\n<aside class="lesson-strip" aria-label="{label.replace("&rsquo;", "’")}">'
            f'<p><span class="ls-k">{label}</span><a href="{url}">{text} &rarr;</a>'
            f'<span class="ls-sep" aria-hidden="true">&middot;</span>'
            f'<a class="ls-hub" href="{HUB}">All Lessons From a Sale</a></p></aside>\n{END}')


def close_of(s, start, tag):
    """Index just past the tag that closes the element opening at start."""
    pat = re.compile(rf'<(/?){tag}\b[^>]*>')
    depth = 0
    for m in pat.finditer(s, start):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return m.end()
    raise ValueError('unclosed ' + tag)


def apply(rel, key):
    p = os.path.join(ROOT, rel)
    s = open(p, encoding='utf-8').read()
    s = re.sub(rf'\n?{re.escape(START)}.*?{re.escape(END)}', '', s, flags=re.S)
    m = QA_OPEN.search(s)
    if not m:
        raise SystemExit(f'{rel}: no Quick Answers block')
    end = close_of(s, m.start(), m.group(1))
    s = s[:end] + '\n' + strip_html(key) + s[end:]
    if CSS not in s:
        s = s.replace('</head>', CSS + '\n</head>', 1)
    open(p, 'w', encoding='utf-8').write(s)


if __name__ == '__main__':
    for rel, key in PAGES.items():
        apply(rel, key)
    print(f'strip on {len(PAGES)} pages')
