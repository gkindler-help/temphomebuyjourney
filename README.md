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
- **SEO Status:** Comprehensive JSON-LD schema on 153 pages
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
│   ├── affton.html
│   ├── arnold.html
│   ├── ballwin.html
│   └── [95 more neighborhoods across:]
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

**Example (from VA loan article):**
- Link to → Inspection article (when discussing VA appraisal requirements)
- Link to → Fixer-upper article (when VA won't finance certain homes)
- Link to → Federal Pacific panel article (common VA appraisal killer)

**Registry:** `article-registry.js` (planned - not yet implemented)

### **Seller Guides → Buyer Guides:**
**Cross-pollination strategy:**

**From Seller Articles:**
- "What Not to Repair Before Selling" → Links to "What to Look For When Buying"
- "Cost to Sell" → Links to "Buyer Closing Costs"
- "Pricing Strategy" → Links to "How Cash Buyers Calculate Offers"

**From Buyer Articles:**
- "Home Inspection Guide" → Links to "What Sellers Should Fix"
- "Negotiation Tactics" → Links to "Seller Pricing Psychology"

**Status:** Seller guides exist but interlinking not yet systematized

### **Tools → Articles:**
**Current State:** Tools are standalone, minimal linking back to articles

**Recommended Enhancement:**
- Prep Tool → Link to "Open House Strategy" article
- Affordability Map → Link to income-specific guides ($50K, $70K, etc.)
- Cost Survival Guide → Link to "Home Inspection" and "Repair Cost Guide"
- Compare Tool → Link to "How to Interview Buyer Agents"

**Not Yet Implemented** - opportunity for future session

---

## 🔍 **SEO IMPLEMENTATION**

### **Current Schema Coverage:**
**Total Pages with Schema:** 153
- ✅ Homepage: RealEstateAgent + Organization + WebSite
- ✅ Articles (54): Article + BreadcrumbList
- ✅ Neighborhoods (98): WebPage + BreadcrumbList + FAQPage

**Schema Deployment History:**
1. **Phase 1 (May 23, 2026):** Article + BreadcrumbList schema deployed to all 54 articles
2. **Phase 2 (May 23, 2026):** Enhanced homepage with @graph structure
3. **Existing:** Neighborhoods already had comprehensive schema (WebPage + FAQ)

**Schema Templates:** See `SCHEMA-DEPLOYMENT-SUMMARY.md`

### **Pending SEO Enhancements (High ROI):**
**PHASE 3 (Not Yet Done):** FAQPage schema on ~40 articles
- Impact: FAQ rich snippets, "People Also Ask" eligibility
- Effort: 3-4 hours
- Priority: **HIGH**

**PHASE 4 (Not Yet Done):** HowTo schema on ~15 process articles
- Impact: Step-by-step rich snippets
- Effort: 2 hours
- Priority: **HIGH**

**PHASE 5 (Not Yet Done):** VideoObject schema on ~10 articles with YouTube embeds
- Impact: Video thumbnails in search
- Effort: 1 hour
- Priority: **MEDIUM**

### **Technical SEO Status:**
✅ Sitemap.xml (165 URLs) - ready for Search Console submission
✅ All canonical tags present
✅ Meta descriptions on all pages
✅ Schema validation: 100% pass rate
✅ Image optimization: Pending (~3,900 KB flagged by Lighthouse)

### **Google Search Console Data (Pre-Schema):**
- 28 days: 137 impressions, 1 click (0.7% CTR)
- **Issue:** Pages ranking but titles/descriptions weak
- **Expected:** CTR increase to 2-5% after schema deployment (4-6 weeks)

---

## 📈 **CONTENT STRATEGY**

### **Authority Timeline:**
**Current:** 54 articles (45% of minimum authority target)

**To Reach Authority Status:**
- **Minimum viable:** 100 articles + 50 backlinks (6-12 months)
- **Strong authority:** 150 articles + 100 backlinks (12-18 months)
- **Dominant:** 200+ articles + 200+ backlinks (18-24+ months)

### **Content Prioritization (Next 10 Articles):**

**Category 1: Transaction Scenarios (Highest ROI - Zero Competition)**
1. What happens if home doesn't appraise St. Louis
2. Can you back out after inspection St. Louis
3. What if seller won't make repairs St. Louis
4. Buying before selling current home St. Louis
5. Can you waive inspection on VA loan St. Louis

**Category 2: Employer Commute Guides (12-15 articles)**
- BJC Healthcare headquarters → neighborhoods within 20 min
- Boeing Defense headquarters → commute analysis
- Anheuser-Busch → employee-friendly areas
- [Other major STL employers]

**Category 3: Life Event Guides**
- Buying after divorce St. Louis
- Buying after bankruptcy St. Louis
- What to do with inherited property St. Louis

### **Content Gaps (Seller Side - Need 6 More):**
**Existing Seller Guides:** 3 (Cost to Sell, Pricing Strategy, South County Selling)
**Missing:** West County, North County, St. Charles County, City selling guides

---

## 🛠️ **INTERACTIVE TOOLS**

### **Tool Architecture:**
All tools load inside a **Tool Panel** (controlled by `shared.js`):
- Opens as overlay on homepage
- Tools load in `<iframe>` to isolate styles
- Header displays tool name
- Close button returns to dashboard

### **Tool Details:**

**1. STL Open House Prep (`prep.html`)**
- **Purpose:** Research competition before showing
- **Data:** 7,006 MARIS sales across 79 zip codes
- **Features:** Days on market, first-weekend success rate, true monthly cost
- **Tech:** Vanilla JS + zip-data.js lookup

**2. STL Affordability Map (`afford.html`)**
- **Purpose:** Visual income → zip code matching
- **Features:** 79 zips color-coded by affordability, finance panel with PITI calc
- **Tech:** Leaflet.js for map rendering

**3. STL Home Cost Survival Guide (`home-cost.html`)**
- **Purpose:** Walk property, flag issues, estimate repair costs
- **Features:** Room-by-room checklist, St. Louis-specific costs (HVAC, foundation, etc.)
- **Tech:** Interactive form with cost database

**4. Compare STL Properties (`compare.html`)**
- **Purpose:** Side-by-side property analysis
- **Features:** True monthly cost, property taxes, 30-year difference calculator
- **Tech:** Dual-property input with financial modeling

**5. STL Common Home Failures (`fails.html`)**
- **Purpose:** Identify deal-killers before making offer
- **Features:** Federal Pacific panels, cast iron plumbing, foundation issues, roofing
- **Tech:** Educational checklist

**6. STL Neighborhood Matcher (`neighborhood-matcher.html`)**
- **Purpose:** Quiz-based neighborhood recommendations
- **Features:** 5 questions → 7 area archetypes → specific neighborhoods
- **Tech:** Scoring algorithm + NEIGHBORHOODS_REGISTRY integration

### **Tool + Content Integration (Opportunity):**
**Current:** Tools exist in isolation
**Recommended:** Add "Related Articles" section to each tool linking to relevant guides

---

## 🎬 **HOMEPAGE EXPERIENCE**

### **Interactive Journey (Phaser 3):**
**File:** `index.html` (1,500+ lines)

**Structure:**
1. **Intro Phase:** George character animation + hook ("They were counting on that")
2. **Journey Phase:** Isometric town scene with 9 buildings (chapters)
3. **Auto-Tour:** Gold glows guide user through chapters
4. **Dashboard:** 4-tab navigation system (Tools/Resources/Neighborhoods/Guides)

**Tech Stack:**
- Phaser 3 game engine (4000×4000 canvas scaled to viewport)
- CSS animations for character transitions
- LocalStorage for journey progress (`stl_journey_v1`)
- `shared.js` for dashboard rendering (DO NOT MODIFY)

**Chapter Structure:**
- **Chapters 0-9:** Main journey (Zillow → Pre-approval → Affordability → etc.)
- **Chapters 100+:** Resource chapters (not in main journey flow)
- **Chapters 200+:** Sub-chapters (branches like 03a-asis.html, 03b-moveinready.html)

**Critical:** Homepage uses `shared.js` for navigation - modifications should be made to articles/neighborhoods, NOT homepage nav system.

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

### **Documentation:**
- `SCHEMA-DEPLOYMENT-SUMMARY.md` - SEO roadmap + schema templates
- `HEADER-NAVIGATION-STANDARDS.md` - Header patterns for all page types
- `ARTICLE-TEMPLATE.html` - Copy/paste template for new articles
- `STANDARD-HEADER-ARTICLE.html` - Article header component

### **Asset Requirements:**
- `assets/STLhomebuyerjourneylogo.png` - Primary logo (DO NOT DELETE)
- `assets/george-family.jpg` - Author photo (used in articles + about)

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

### **Neighborhood Data:**
**Source:** Manual curation + local knowledge
**Stored:** `neighborhoods.js` (NEIGHBORHOODS_REGISTRY)

**98 Neighborhoods Organized by:**
- St. Louis City (11)
- Central Corridor (8)
- North County (22)
- South County (23)
- West County (18)
- St. Charles County (12)
- Jefferson County (12)

**Metadata per Neighborhood:**
- ID, name, county
- Typical price range
- School district
- Character description
- Best fit buyer profile

---

## ✅ **RECENT CHANGES (May 22-23, 2026)**

### **May 22, 2026:**
1. ✅ Generated 7 income-based affordability guides ($50K-$200K) - "Order 66"
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

---

## 🎯 **KNOWN ISSUES & OPPORTUNITIES**

### **Technical Debt:**
- ⚠️ Image optimization needed (~3,900 KB flagged by PageSpeed Lighthouse)
- ⚠️ WebP conversion + responsive srcset (isometric town scene)
- ⚠️ Tool → Article interlinking not systematized

### **Content Gaps:**
- ⚠️ Missing 6 seller area guides (West County, North County, etc.)
- ⚠️ Missing employer commute guides (BJC, Boeing, AB, etc.)
- ⚠️ Missing transaction scenario articles (appraisal fails, inspection conflicts)

### **SEO Opportunities (High ROI):**
- 🎯 **PHASE 3:** FAQPage schema deployment (~40 articles) - 3-4 hours
- 🎯 **PHASE 4:** HowTo schema deployment (~15 articles) - 2 hours
- 🎯 **PHASE 5:** VideoObject schema (~10 articles) - 1 hour

### **Future Features:**
- 📸 360° property tours (Insta360 X5 owned, tech stack defined, blocked on content)
- 📊 Infographics for income guides (placeholders exist, design pending)
- 🗺️ Interactive school district map
- 📧 Google Sheets integration for chapter review widget

---

## 🚀 **NEXT SESSION PRIORITIES**

**Immediate (1-2 hours):**
1. Deploy FAQPage schema to articles with Q&A sections
2. Test articles in Google Rich Results Test
3. Submit sitemap to Search Console

**Short-term (3-5 hours):**
1. Write 5 transaction scenario articles
2. Add HowTo schema to process articles
3. Create infographics for affordability guides

**Medium-term (10-15 hours):**
1. Complete remaining seller area guides
2. Systematize article interlinking
3. Add "Related Articles" sections to all tools

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
- `assets/infographics/README.md` - Infographic creation guide

**External:**
- Google Analytics: G-EEE14BZT9P
- Google Search Console: (submit sitemap.xml)
- Cloudflare Pages: Auto-deploy on push

---

**Last Updated:** May 23, 2026  
**Site Status:** ✅ Production-ready with comprehensive schema  
**Total Pages:** 188 HTML files (153 with schema markup)
