# Winter listing offer (1% + $395) — archived 2026-11-06

Pulled from the live site on 2026-11-06 at George's request (PR #186). Saved here so it can be restored. `docs/*` is blocked from the public site by `_redirects`.

## Files
- `winter-listing-offer.html` — the full page that lived at `/sellers/winter-listing-offer`
- `og-sellers--winter-listing-offer.jpg` — its link-preview image (was `assets/og/sellers--winter-listing-offer.jpg`)

## To restore
1. Copy `winter-listing-offer.html` back to `sellers/winter-listing-offer.html` and the image back to `assets/og/`.
2. Remove the two `/sellers/winter-listing-offer` lines from `_redirects`.
3. Add the URL back to `sitemap.xml`.
4. Put the banner back on the pages below (CSS in the page `<style>`, the div after the article header), then run `build-site-index.py` and `build-search.py`.

The whole change can also be reverted with `git revert` of the PR #186 commit (b0db50c).

## Banner HTML
```html
<div class="stlhj-offer"><a href="/sellers/winter-listing-offer" class="stlhj-offer-inner"><span class="stlhj-offer-badge">LIMITED OFFER</span><span class="stlhj-offer-text"><strong>Because you read STL Home Journey</strong> — see George's 1% + $395 listing fee for St. Louis sellers.</span><span class="stlhj-offer-arrow">&rarr;</span></a></div>
```

## Banner CSS
```css
.stlhj-offer{max-width:720px;margin:0 auto;padding:12px 20px;}
.stlhj-offer-inner{background:rgba(255,204,77,.05);border:1px solid rgba(255,204,77,.16);border-radius:10px;padding:14px 20px;display:flex;align-items:center;gap:16px;text-decoration:none;transition:border-color .2s;}
.stlhj-offer-inner:hover{border-color:rgba(255,204,77,.35);}
.stlhj-offer-badge{background:#ffcc4d;color:#080808;font-size:10px;font-weight:800;letter-spacing:.08em;padding:4px 10px;border-radius:4px;white-space:nowrap;flex-shrink:0;}
.stlhj-offer-text{font-size:13px;color:rgba(255,255,255,.72);line-height:1.4;flex:1;}
.stlhj-offer-text strong{color:#fff;}
.stlhj-offer-arrow{color:#ffcc4d;font-size:16px;flex-shrink:0;}
@media(max-width:500px){.stlhj-offer-inner{flex-wrap:wrap;gap:10px;}}
```

## Pages that showed the banner
- articles/cost-to-sell-home-stl.html
- articles/how-cash-buyers-calculate-offers-stl.html
- articles/how-george-works-with-sellers.html
- articles/no-showings-st-louis-home.html
- articles/relist-house-st-louis-30-day-rule.html
- articles/sell-first-or-buy-first-st-louis.html
- articles/sell-house-fall-winter-st-louis.html
- articles/selling-home-south-st-louis-county.html
- articles/should-i-accept-this-offer-st-louis.html
- articles/showings-but-no-offers-st-louis.html
- articles/what-not-to-repair-before-selling-stl-pricing-strategy.html
- articles/what-will-i-net-selling-stl.html
- articles/what-you-lose-with-cash-offer-stl.html
- articles/when-to-lower-house-price-st-louis.html
- articles/why-your-st-louis-home-didnt-sell.html
