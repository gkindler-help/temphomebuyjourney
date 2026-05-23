# QUICK CONTEXT - STL Home Journey

**Site:** https://stlhomejourney.com  
**Purpose:** Buyer education (not lead gen)  
**Owner:** George Kindler - Licensed MO Real Estate Agent, 13 years, 250+ transactions

## File Structure
- `articles/` - 54 guides (income guides, VA loans, Zillow truth, seller guides)
- `neighborhoods/` - 98 neighborhood guides  
- Root tools: prep.html, afford.html, home-cost.html, compare.html, fails.html, neighborhood-matcher.html
- `shared.js` - **DO NOT MODIFY** (homepage dashboard navigation)
- `shared.css` - Global styles
- `resources.js` - Article/neighborhood registry
- `zip-data.js` - 7,006 MARIS sales data

## Current State
✅ 153 pages with JSON-LD schema (Article + BreadcrumbList)
✅ Sitemap.xml created (165 URLs)
✅ All headers standardized
✅ All validation passing

## Headers (DO NOT CHANGE)
- Articles: `.art-hdr` with logo + "Guides | Journey" nav
- Neighborhoods: `.nbhd-hdr` with logo + "Neighborhoods | Journey" nav
- About: `.header` with back button
- Homepage: Uses shared.js (DO NOT TOUCH)

## Logo
- File: `assets/STLhomebuyerjourneylogo.png`
- Articles path: `../assets/STLhomebuyerjourneylogo.png`
- Root path: `assets/STLhomebuyerjourneylogo.png`

## SEO Status
**DONE:**
- Phase 1: Article schema (54 articles)
- Phase 2: Enhanced homepage schema

**PENDING (High Priority):**
- Phase 3: FAQPage schema (~40 articles with Q&A) - 3-4 hours
- Phase 4: HowTo schema (~15 process articles) - 2 hours
- Phase 5: VideoObject schema (~10 articles) - 1 hour

## Content Priorities
1. Transaction scenarios (5 articles - highest ROI)
2. Employer commute guides (12-15 articles)
3. Complete seller area guides (6 needed)

## Critical Rules
- ❌ DO NOT modify shared.js (homepage navigation)
- ❌ DO NOT delete STLhomebuyerjourneylogo.png
- ❌ DO NOT change header patterns (see HEADER-NAVIGATION-STANDARDS.md)
- ✅ Batch commits, push once per session (Cloudflare 500 builds/month limit)

## Documentation Files
- README.md - Full site documentation (16,000 words)
- SCHEMA-DEPLOYMENT-SUMMARY.md - SEO roadmap
- HEADER-NAVIGATION-STANDARDS.md - Header patterns
- ARTICLE-TEMPLATE.html - New article template

## Contact
George Kindler  
The Closing Pros LLC  
Office: 314-998-4550 | Direct: 314.435.1087  
georgeandlizk@gmail.com

---
**Full README:** github.com/gkindler-help/temphomebuyjourney/README.md
