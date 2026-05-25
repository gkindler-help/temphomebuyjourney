# 🏠 STL Home Journey - Complete Site Documentation

**Real estate buyer education platform for St. Louis home buyers**  
**Built by:** George Kindler, Licensed Missouri Real Estate Agent  
**13 Years Experience • 250+ Transactions • The Closing Pros LLC**

---

## 📊 **TLDR - Site Overview**

- **Domain:** https://stlhomejourney.com
- **Purpose:** Consumer-first buyer education (not lead generation)
- **Content:** 54 articles, 98 neighborhood guides, 6 interactive tools
- **Tech Stack:** Vanilla HTML/CSS/JS, Phaser 3, Cloudflare Pages
- **SEO Status:** Comprehensive JSON-LD schema on 153 pages, all snippets rewritten
- **Traffic Goal:** Organic search → authority on St. Louis real estate
- **Monetization:** Direct buyer/seller representation (no ads, no affiliate links)

---

## 🎯 **STRATEGIC VISION**

### **Primary Goal:**
Position as the **authoritative** St. Louis home buying resource that protects consumers from predatory practices (Zillow pay-to-play, bad agents, cash offer scams).

### **Content Philosophy:**
- ✅ **Direct, tactical advice** (not generic fluff)
- ✅ **Real transaction examples** with actual numbers
- ✅ **Buyer-first** (what agents should tell you but don't)
- ✅ **No email gates** (content is free)
- ✅ **Visual tools** over text walls

### **Target Audience:**
"The buyer who thinks they're ready but doesn't know what they don't know"
- First-time buyers
- VA loan buyers (George specializes in these)
- Buyers comparing South County vs West County
- Buyers researching school districts
- Buyers escaping Zillow's agent-matching system

---

## 📁 **SITE STRUCTURE**

```
stlhomejourney.com/
├── index.html                    # Interactive buyer journey (Phaser 3)
├── about.html                    # George's bio + credentials
│
├── articles/                     # 54 GUIDES (SEO core)
│   ├── index.html               # All guides organized by topic
│   │
│   ├── AFFORDABILITY (8 articles - Order 66)
│   │   ├── how-much-house-afford-making-50k-st-louis.html
│   │   ├── how-much-house-afford-making-60k-st-louis.html
│   │   ├── how-much-house-afford-making-70k-st-louis.html
│   │   ├── how-much-house-afford-making-80k-st-louis.html
│   │   ├── how-much-house-afford-making-100k-st-louis.html
│   │   ├── how-much-house-afford-making-120k-st-louis.html
│   │   ├── how-much-house-afford-making-150k-st-louis.html
│   │   └── how-much-house-afford-making-200k-st-louis.html
│   │
│   ├── VA LOANS (4 articles)
│   │   ├── va-home-loan-st-louis-what-kills-deals.html
│   │   ├── va-appraisal-failed-st-louis-what-happens-next.html
│   │   ├── federal-pacific-panel-va-loan-st-louis.html
│   │   └── can-you-buy-fixer-upper-va-loan-st-louis.html
│   │
│   ├── SCHOOL DISTRICTS (2 articles)
│   │   ├── lindbergh-vs-mehlville-school-district-stl.html
│   │   └── mehlville-vs-oakville-vs-concord-stl.html
│   │
│   ├── SELLER GUIDES (3 articles)
│   │   ├── cost-to-sell-home-stl.html
│   │   ├── what-not-to-repair-before-selling-stl-pricing-strategy.html
│   │   └── selling-home-south-st-louis-county.html
│   │
│   └── [37 MORE ARTICLES covering:]
│       - Zillow truth series (6 articles)
│       - Buyer agent selection (5 articles)
│       - Financing (7 articles)
│       - Inspection/negotiation (6 articles)
│       - Transaction scenarios (5 articles)
│       - Neighborhood comparisons (5 articles)
│
├── neighborhoods/                # 98 NEIGHBORHOOD GUIDES
│   ├── index.html               # Interactive neighborhood selector
│   └── [97 neighborhood pages across:]
│       - St. Louis City (11 neighborhoods)
│       - South County (23 neighborhoods)
│       - West County (18 neighborhoods)
│       - North County (22 neighborhoods)
│       - St. Charles County (12 neighborhoods)
│       - Jefferson County (12 neighborhoods)
│
├── tools/                        # INTERACTIVE CALCULATORS
│   ├── cash-offer-decoder.html  # Wholesale cash offer calculator
│   └── [Note: Other tools load from root, not /tools/]
│
├── ROOT-LEVEL TOOLS (loaded in dashboard panel):
│   ├── prep.html                # Open house prep (competition + costs by zip)
│   ├── afford.html              # Affordability map (79 zips color-coded)
│   ├── home-cost.html           # Cost survival guide (walk property, flag issues)
│   ├── compare.html             # Property comparison (side-by-side analysis)
│   ├── fails.html               # Common home failures (FPE, cast iron, etc.)
│   └── neighborhood-matcher.html # Quiz → neighborhood recommendations
│
├── stl-quiz.html                # "Are You Actually From St. Louis?" quiz (STAGED - not linked yet)
│
├── _redirects                   # Cloudflare redirects (301s for all .html URLs)
│
├── assets/
│   ├── STLhomebuyerjourneylogo.png  # Main logo (512x512)
│   ├── george-family.jpg            # Author photo
│   ├── infographics/                # Placeholder for future infographics
│   ├── case-studies/                # Transaction screenshots/assets
│   └── [maps, graphics, etc.]
│
└── SYSTEM FILES:
    ├── shared.css               # Global design tokens + styles
    ├── shared.js                # Dashboard navigation system (DO NOT MODIFY)
    ├── resources.js             # Article/neighborhood registry
    ├── zip-data.js              # 7,006 MARIS sales + 79 zip code data
    └── neighborhoods.js         # 98 neighborhood metadata
```

---

## 🎨 **DESIGN SYSTEM**

### **Brand Identity:**
- **Colors:** Gold (#ffcc4d) on near-black (#050505)
- **Fonts:** Playfair Display (serif) + Inter (sans-serif)
- **Voice:** Direct, tactical, first-person, no jargon
- **Visual Style:** Dark mode, high contrast, data-driven

### **Content Voice Rules:**
- St. Louis City → "block by block" (accurate for city neighborhoods)
- St. Louis County → "subdivision" or "neighborhood" (never "block by block")
- Income guides → "maximum budget" not "you can afford"
- Snippet formula → "[City] homes [hook] — [geographic anchor]"
- **`articles/index.html` links** → all article links use full absolute URL: `https://stlhomejourney.com/articles/[slug]`. All other internal links across the site use relative paths.

### **Header Standards:**
**DO NOT MODIFY `shared.js`** - controls homepage dashboard navigation

**Article Header Pattern:**
```html
<header class="art-hdr">
  <a href="../index.html" class="art-hdr-l">
    <div class="art-hdr-ico"><img src="../assets/STLhomebuyerjourneylogo.png"></div>
    <div>
      <div class="art-hdr-t"><span>STL</span> Home Journey</div>
      <div class="art-hdr-name">George Kindler</div>
      <div class="art-hdr-tagline">13 Years Experience At Your Fingertips</div>
    </div>
  </a>
  <nav class="art-hdr-nav">
    <a href="index.html">Guides</a>
    <a href="../index.html" class="gold">Journey</a>
  </nav>
</header>
```

**Neighborhood Header:** Same structure, `.nbhd-hdr` class  
**About Page:** Simplified `.header` class with back button

**Reference:** See `HEADER-NAVIGATION-STANDARDS.md`

### **Footer Standards:**
All articles/neighborhoods include:
```html
<div class="compliance-footer">
  <strong>The Closing Pros LLC</strong><br>
  Licensed Missouri Real Estate Brokerage<br>
  Office: 314-998-4550 · George's Direct: 314.435.1087<br>
  [Appropriate disclaimer based on content]
</div>
```

---

## 🔗 **INTERLINKING STRATEGY**

### **Buyer Journey → Tools:**
Homepage dashboard has 4 tabs:
1. **TOOLS** - 6 calculators/analyzers
2. **RESOURCES** - Featured articles
3. **NEIGHBORHOODS** - 98 guides
4. **GUIDES** - All 54 articles organized

Each tab opens a panel (via `shared.js`) with content loaded in iframe or direct HTML.

### **Article → Article Interlinking:**
**Pattern:** Context-aware inline links + "Related Articles" sections

**Registry:** `article-registry.js` (planned - not yet implemented)

### **Tools → Articles:**
**Current State:** Tools are standalone, minimal linking back to articles  
**Not Yet Implemented** - opportunity for future session

---

## 🔍 **SEO IMPLEMENTATION**

### **Current Schema Coverage:**
**Total Pages with Schema:** 153
- ✅ Homepage: RealEstateAgent + Organization + WebSite
- ✅ Articles (54): Article + BreadcrumbList
- ✅ Neighborhoods (98): WebPage + BreadcrumbList + FAQPage

### **Snippet Framework (Applied May 2026):**
Psychology basis: Information Gap Theory (Loewenstein) + Loss Aversion (Kahneman)

**Three-layer structure:**
1. **Title = the gap** — specific thing they don't know that matters
2. **Description = the stake + the credential** — what they lose by not reading, why this source closes it
3. **Curvilinear rule** — enough to confirm they're in the right place, not enough to answer the question

**All 54 articles:** Individually written, gap-first, real numbers in title where possible  
**All 97 neighborhood pages:** Individually written, "[City] homes [hook] — [geographic anchor]" formula, real MARIS data  
**Income guides:** "Maximum budget" framing, correct price ranges, MARIS neighborhood data

### **Canonical Tags:**
All 171 pages have correct absolute canonical URLs without .html extension.

### **_redirects file (Cloudflare):**
```
/neighborhoods/:page.html   /neighborhoods/:page    301
/articles/:page.html        /articles/:page         301
/tools/:page.html           /tools/:page            301
/school-districts/:page.html /school-districts/:page 301
/stl-quiz                   /stl-quiz.html          200
```

### **Pending Schema Phases:**
- 🎯 **PHASE 3:** FAQPage schema (~40 articles) - 3-4 hours — HIGH PRIORITY
- 🎯 **PHASE 4:** HowTo schema (~15 process articles) - 2 hours
- 🎯 **PHASE 5:** VideoObject schema (~10 articles) - 1 hour

---

## 🏘️ **NEIGHBORHOOD DATA**

### **Source:** Manual curation + MARIS MLS 2025-2026
### **Stored:** `neighborhoods.js` (NEIGHBORHOODS_REGISTRY)

**Income bracket → neighborhood mapping (from zip-data.js):**
- $50K ($160K-$180K): Jennings, Berkeley, Bevo Mill, Normandy
- $60K ($200K-$220K): Hazelwood, Florissant N., Overland, St. Ann
- $70K ($230K-$260K): Mehlville, Affton, Arnold, Maplewood
- $80K ($265K-$300K): Oakville, Arnold, St. Charles, O'Fallon
- $100K ($330K-$375K): Webster Groves, Crestwood, Lake St. Louis, Brentwood
- $120K ($400K-$450K): Kirkwood, Ballwin S., Sunset Hills, Ballwin
- $150K ($500K-$575K): Chesterfield W., Des Peres, Chesterfield E., Ballwin
- $200K ($650K-$800K): Ladue, Chesterfield (only 2 neighborhoods in metro at this range)

---

## 📊 **DATA SOURCES**

### **Market Data:**
**Source:** MARIS (Mid America Regional Information Systems)  
**Coverage:** 7,006 residential sales (2025-2026)  
**Stored:** `zip-data.js`

**Data Points per Zip:**
- Median sale price
- First weekend offer rate
- Average days on market
- % sold above list price
- Property tax rate

**Condition Tiers (derived from actual behavior):**
- **As-Is:** 25th percentile price, DOM 45+
- **Move-In Ready:** Median price, DOM 14-45
- **Renovated:** 75th percentile price, DOM <14, SP/LP ≥1.0

---

## 📱 **DEPLOYMENT**

### **Platform:** Cloudflare Pages
- **Build Command:** None (static HTML)
- **Branch:** main
- **Auto-deploy:** On push to main
- **Build Time:** ~2-3 minutes
- **Monthly Limit:** 500 builds/month (FREE tier)

### **Build Management:**
**Strategy:** Batch commits, push once per session
- ✅ Multiple local commits during work
- ✅ Single push at end of session
- ✅ Keeps builds to ~30-120/month (well under 500 limit)

### **Domain:** stlhomejourney.com
- DNS managed via Cloudflare
- HTTPS enforced
- Cache purge: Automatic on deploy

---

## 🔧 **CRITICAL FILES (DO NOT DELETE)**

### **System Files:**
- `shared.css` - Global design tokens (colors, fonts, spacing)
- `shared.js` - **DO NOT MODIFY** (dashboard navigation for homepage)
- `resources.js` - Article + neighborhood registry
- `zip-data.js` - 7,006 MARIS sales data + 79 zip metadata
- `neighborhoods.js` - 98 neighborhood metadata
- `_redirects` - Cloudflare 301 redirects for .html URLs

### **Documentation:**
- `SCHEMA-DEPLOYMENT-SUMMARY.md` - SEO roadmap + schema templates
- `HEADER-NAVIGATION-STANDARDS.md` - Header patterns for all page types
- `ARTICLE-TEMPLATE.html` - Copy/paste template for new articles
- `STANDARD-HEADER-ARTICLE.html` - Article header component
- `QUICK-START.md` - Condensed context for new chat sessions

### **Asset Requirements:**
- `assets/STLhomebuyerjourneylogo.png` - Primary logo (DO NOT DELETE)
- `assets/george-family.jpg` - Author photo (used in articles + about)

---

## ✅ **COMPLETED WORK LOG**

### **May 22, 2026:**
1. ✅ Generated 8 income-based affordability guides ($50K-$200K) - "Order 66"
2. ✅ Fixed George card floating issues across 98 neighborhood pages
3. ✅ Created sitemap.xml with 165 URLs
4. ✅ Added "Income Guides" section to articles page
5. ✅ Fixed tool panel iframe rendering (black screen issue)
6. ✅ Removed George cards from tool pages (causing cutoff issues)

### **May 23, 2026:**
1. ✅ Deployed Article schema to all 54 articles (Article + BreadcrumbList)
2. ✅ Enhanced homepage schema (RealEstateAgent + Organization + WebSite)
3. ✅ Added infographic placeholders to 8 income guides
4. ✅ Fixed 6 neighborhood pages with relative schema URLs
5. ✅ Added missing meta tags to prep.html
6. ✅ Fixed broken logo link on about.html
7. ✅ Created header standards documentation
8. ✅ Site-wide validation - all schemas passing

### **May 24, 2026:**
1. ✅ Fixed canonical tags across 171 pages (removed .html extension)
2. ✅ Cleaned internal .html links in 44 articles, 18 neighborhoods, 9 school-district pages
3. ✅ Fixed neighborhood paths in neighborhoods.js registry
4. ✅ Created _redirects file (301s for .html URLs across all sections)
5. ✅ Built stl-quiz.html — "Are You Actually From St. Louis?" (staged, not linked)
6. ✅ Rewrote snippets for all 54 articles (gap/stake/credential framework)
7. ✅ Fixed income guides — correct price ranges ($50K→$160K-$180K through $200K→$650K-$800K)
8. ✅ Rewrote income guide neighborhood sections with real MARIS zip data
9. ✅ Reframed income guides as "maximum budget" not "you can afford"
10. ✅ Rewrote snippets for all 97 neighborhood pages individually
11. ✅ Homepage snippet drafted — staged for next commit
12. ✅ Updated QUICK-START.md

---

## 🎯 **KNOWN ISSUES & OPPORTUNITIES**

### **Technical Debt:**
- ⚠️ Image optimization needed (~3,900 KB flagged by PageSpeed Lighthouse)
- ⚠️ WebP conversion + responsive srcset (isometric town scene priority)
- ⚠️ Tool → Article interlinking not systematized

### **Content Gaps:**
- ⚠️ Missing 6 seller area guides (West County, North County, St. Charles County, Jefferson County, St. Louis City, Central Corridor)
- ⚠️ Missing employer commute guides (BJC, Boeing, AB, Centene, Express Scripts, etc.)
- ⚠️ Missing transaction scenario articles (appraisal fails, inspection conflicts, earnest money disputes)
- ⚠️ No South City St. Louis neighborhood page (needed for Kings Highway / Christie Park article interlinking)
- ⚠️ School district subdivision mapping needs rewrite (currently "block by block" — should be subdivision-level)

### **SEO Opportunities (Priority Order):**
1. 🎯 Submit sitemap.xml to Google Search Console (5 minutes, do this now)
2. 🎯 Request indexing on top 10 impression pages in Search Console URL Inspection tool
3. 🎯 **PHASE 3:** FAQPage schema (~40 articles) - 3-4 hours
4. 🎯 **PHASE 4:** HowTo schema (~15 process articles) - 2 hours
5. 🎯 **PHASE 5:** VideoObject schema (~10 articles) - 1 hour

### **Future Features:**
- 📸 360° property tours (Insta360 X5 owned, tech stack defined, blocked on content)
- 📊 Infographics for income guides (placeholders exist, design pending)
- 🗺️ Interactive school district map
- 📧 Google Sheets integration for chapter review widget
- 🎮 STL Quiz deployment (stl-quiz.html built, needs homepage link when ready)

---

## 🚀 **NEXT SESSION PRIORITIES**

**Do first (under 10 minutes each):**
1. Submit sitemap.xml to Google Search Console
2. Request indexing on: homepage, lindbergh-vs-mehlville, crestwood, south-county-neighborhood-guide, should-you-accept-cash-offer, cash-offer-decoder

**🔴 HIGH PRIORITY — Missing Neighborhood Pages (404 tracking active):**
These pages are linked from the Fixer Upper vs. Move-In Ready tool and will 404 until built. GA4 is tracking which ones get hit via `neighborhood_404` event — use that data to prioritize build order.

South City St. Louis (most urgent — multiple zip codes point here):
- `princeton-heights.html` (63109)
- `lindenwood-park.html` (63109)
- `willmore-park.html` (63109)
- `carondelet.html` (63111/63118)
- `holly-hills.html` (63111)
- `dutchtown.html` (63116)
- `bevo-mill.html` (63116/63118)
- `clifton-heights.html` (63139)
- `southampton.html` (63139)
- `hi-pointe.html` (63139)
- `franz-park.html` (63110/63139)

St. Louis County missing:
- `eureka.html` (63025)
- `fenton.html` (63026)
- `valley-park.html` (63088)
- `richmond-heights.html` (63117)
- `brentwood.html` (63144)
- `creve-coeur.html` (63146)
- `des-peres.html` (63131)
- `ladue.html` (63124)

Custom 404 page (`404.html`) is live — shows neighborhood description, back-to-tool button, and neighborhood matcher link. Tracks slug via GA4 `neighborhood_404` event.
Deploy the affordability map (afford.html) as a persistent side panel across all income guide articles ($50K-$200K). Goal: dwell time. Reader is already on the page thinking about their budget — the map keeps them there exploring zip codes instead of bouncing.

Implementation notes:
- May require a new system in shared.js (or a lightweight panel system scoped to articles only — don't touch homepage shared.js nav)
- Pattern: reader scrolls to neighborhood section → panel slides in from right or bottom → shows afford.html map filtered to their income bracket
- Alternative: inline iframe embed within the article below the neighborhood cards — no slide mechanic needed
- Either approach should use the existing zip-data.js data already on the page
- Article pages already have the income bracket baked in — use it to pre-filter the map on load

**🔴 HIGH PRIORITY — Condition Tier Data in Income Guides:**
Pull in the cash offer decoder's as-is / move-in ready / renovated pricing tiers for each zip code into the income guide neighborhood cards. This is the real comparison buyers need — not just median price, but what their budget actually buys by condition across neighborhoods.

Implementation notes:
- zip-data.js already has the condition tier data (25th percentile = as-is, median = move-in ready, 75th percentile = renovated)
- Each neighborhood card currently shows median only — add a three-tier breakdown: as-is floor, move-in ready median, renovated ceiling
- Example: Oakville at $80K — as-is $240K, move-in ready $285K, renovated $340K — buyer immediately understands what their budget gets by condition
- This directly answers the question every buyer has: "can I afford a move-in ready home here or am I looking at as-is?"
- Connects income guide content to the cash offer decoder tool — natural interlinking opportunity

**Short-term (1 session):**
1. Affordability side panel — income guide articles
2. FAQPage schema deployment to ~40 articles
3. Transaction scenario articles (5 needed — highest content ROI)

**Medium-term (2-3 sessions):**
1. Employer commute guides (BJC, Boeing, AB — high search volume, zero competition)
2. Seller area guides (6 needed)
3. Systematize article interlinking (article-registry.js)
4. Image optimization — WebP conversion, responsive srcset

**Longer term:**
1. HowTo schema (15 process articles)
2. VideoObject schema (10 articles with YouTube embeds)
3. South City neighborhood page
4. School district subdivision mapping rewrite
5. STL Quiz — decide deployment strategy

---

## 🔑 **CONTACT & CREDENTIALS**

**George Kindler**
- Licensed Missouri Real Estate Agent
- Marine Corps Veteran (LAV Crewman, 2007-2011)
- The Closing Pros LLC
- Office: 314-998-4550
- Direct: 314.435.1087
- Email: georgeandlizk@gmail.com

**Social:**
- YouTube: @Stlhomejourney
- Facebook: facebook.com/gksellsstl

**Experience:**
- 13 years in St. Louis real estate
- 250+ transactions
- Specialization: VA loans, first-time buyers, South County

---

## 📚 **ADDITIONAL DOCUMENTATION**

**In Repo:**
- `SCHEMA-DEPLOYMENT-SUMMARY.md` - Complete SEO roadmap
- `HEADER-NAVIGATION-STANDARDS.md` - Header patterns
- `ARTICLE-TEMPLATE.html` - New article template
- `QUICK-START.md` - Condensed context for new sessions
- `assets/infographics/README.md` - Infographic creation guide

**External:**
- Google Analytics: G-EEE14BZT9P
- Google Search Console: (sitemap.xml pending submission)
- Cloudflare Pages: Auto-deploy on push
- GitHub: github.com/gkindler-help/temphomebuyjourney

---

**Last Updated:** May 24, 2026  
**Site Status:** ✅ Production-ready — all snippets rewritten, schema deployed, canonicals clean  
**Total Pages:** 188 HTML files (153 with schema markup)
