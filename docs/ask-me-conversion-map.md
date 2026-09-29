# Ask Me — Conversion Map

Source of truth for which pages carry the **Ask Me** CTA. **262 pages** carry it as of 2026-09-28. CTA copy lives in `/assets/ask-me.js` (`CONTEXTS`); this file tracks rollout.

**How it works:** a page gets `<div data-ask-me="CONTEXT_KEY" [data-ask-name="Affton"]>…</div>` plus `<script src="/assets/ask-me.js?v=2" defer></script>`. The component shows George’s photo, the headline, supporting line, button and a no-pressure note. The button links to `/ask?about=CONTEXT_KEY&from=/page-path`; the source title and URL are carried automatically.

**Copy tiers:** situation-specific contexts on decision pages; name-filled patterns on neighborhood, ZIP code and school district pages (“Looking at a house in Affton?”); buyer/seller defaults elsewhere.

**Placement:** first-batch pages were placed by hand. The rest use the template’s decision point: before the FAQ where one exists, otherwise before the page’s existing contact block or related links, or below the tool on app-style pages. The component centers itself when its container is wider than it is.

**Status values:** `LIVE` (on main), `IMPLEMENTED` (on branch, not merged), `EXCLUDED`.

**Delivery today:** `/ask` hands the message to the visitor’s own email or text app. Nothing is stored or sent by the site. See “Delivery” below.

## Homepage (1)

| URL | Intent | Context | CTA headline | CTA button | Address field | Status | Implemented | Placement |
|---|---|---|---|---|---|---|---|---|
| `/` | buyer | `home` | Found a house you’re seriously considering? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |

## Root pages (guides, tools, about) (17)

| URL | Intent | Context | CTA headline | CTA button | Address field | Status | Implemented | Placement |
|---|---|---|---|---|---|---|---|---|
| `/longtime-homeowners` | seller | `seller-general` | Thinking about this for your own house? | Ask Me About Your House | Yes | IMPLEMENTED | 2026-09-29 | End of page, after the closing section |
| `/about` | buyer | `buyer-agent` | Want to know what I’d actually do for you? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <footer> |
| `/afford` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='footer'> |
| `/compare` | buyer | `area-comparison` | Down to two or three areas? | Ask Me to Compare Them | No | IMPLEMENTED | 2026-09-28 | Before <div id='app'></div> (after) |
| `/complete-guide` | buyer | `buyer-start` | Ready to stop researching and start looking? | Ask Me to Help You Start | No | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/experience` | general | `general-page` | Have a question about your own situation? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <footer> |
| `/fails` | buyer | `property-defect` | Seeing something in a house that concerns you? | Ask Me What I’d Do Next | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='footer'> |
| `/fixer-upper-vs-move-in-stl` | buyer | `fixer-upper` | Looking at a fixer right now? | Ask Me If the Numbers Make Sense | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='compliance-footer'> |
| `/fsbo-st-louis` | seller | `seller-start` | Want to talk about your house instead of another hypothetical? | Ask Me About Selling It | Yes | IMPLEMENTED | 2026-09-28 | Before <section class='cta'> |
| `/george-kindler` | buyer | `buyer-agent` | Want to know what I’d actually do for you? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <footer> |
| `/home-cost` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div id='app'></div> (after) |
| `/neighborhood-matcher` | buyer | `area-comparison` | Down to two or three areas? | Ask Me to Compare Them | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/prep` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div id='app'></div> (after) |
| `/school-districts` | buyer | `school-boundary` | Considering houses on both sides of the district line? | Ask Me About the Addresses | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/south-city-st-louis` | buyer | `neighborhood` | Looking at a house in South City? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='About George Kindler'> |
| `/south-county-st-louis` | buyer | `neighborhood` | Looking at a house in South County? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='About George Kindler'> |
| `/stl-home-buying-power-calculator` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='compliance-footer'> |

## Articles (76)

| URL | Intent | Context | CTA headline | CTA button | Address field | Status | Implemented | Placement |
|---|---|---|---|---|---|---|---|---|
| `/articles/should-i-downsize-my-house-st-louis` | seller | `seller-general` | Thinking about this for your own house? | Ask Me About Your House | Yes | IMPLEMENTED | 2026-09-29 | End of the closing section, before the link back to the hub |
| `/articles/average-price-move-in-ready-home-st-louis` | buyer | `price-value` | Found a house and wondering if the price makes sense? | Ask Me About the Price | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/average-price-reduction-after-inspection-st-louis` | buyer | `inspection-negotiation` | Got an inspection report and don’t know what to ask for? | Ask Me About the Report | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/best-st-louis-neighborhoods-for-buyers` | buyer | `area-comparison` | Down to two or three areas? | Ask Me to Compare Them | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/buyer-closing-costs-st-louis` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/buying-a-home-in-oakville-mo` | buyer | `neighborhood` | Looking at a house in Oakville? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/can-you-buy-fixer-upper-va-loan-st-louis` | buyer | `fixer-upper` | Looking at a fixer right now? | Ask Me If the Numbers Make Sense | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/conventional-vs-fha-loan-st-louis` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/cost-to-sell-home-stl` | seller | `cost-to-sell` | Thinking about selling and want the real number? | Ask Me What Selling Would Cost | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/credit-score-buy-home-st-louis` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/do-i-need-a-buyers-agent-stl` | buyer | `buyer-agent` | Want to know what I’d actually do for you? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/federal-pacific-panel-va-loan-st-louis` | buyer | `federal-pacific-va` | Found one of these panels in a house you’re considering? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/first-time-buyer-programs-stl` | buyer | `buyer-start` | Ready to stop researching and start looking? | Ask Me to Help You Start | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/fixer-upper-vs-move-in-ready-st-louis` | buyer | `fixer-upper` | Looking at a fixer right now? | Ask Me If the Numbers Make Sense | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/flat-fee-mls-st-louis` | seller | `seller-start` | Want to talk about your house instead of another hypothetical? | Ask Me About Selling It | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/home-inspection-st-louis` | buyer | `home-inspection` | Something about the house worrying you? | Ask Me What I’d Look At | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/how-cash-buyers-calculate-offers-stl` | seller | `cash-buyer-math` | Have an offer and want to know how they probably got there? | Ask Me to Break Down the Offer | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/how-george-works-with-sellers` | seller | `seller-start` | Want to talk about your house instead of another hypothetical? | Ask Me About Selling It | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/how-long-to-buy-house-st-louis` | buyer | `buyer-start` | Ready to stop researching and start looking? | Ask Me to Help You Start | No | IMPLEMENTED | 2026-09-28 | Before <footer> |
| `/articles/how-much-down-payment-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/how-much-house-afford-making-100k-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/how-much-house-afford-making-120k-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/how-much-house-afford-making-150k-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/how-much-house-afford-making-200k-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/how-much-house-afford-making-50k-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/how-much-house-afford-making-60k-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/how-much-house-afford-making-70k-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/how-much-house-afford-making-80k-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/how-much-income-to-buy-home-stl` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/how-to-interview-buyers-agent-stl` | buyer | `buyer-agent` | Want to know what I’d actually do for you? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/how-to-screen-stl-homes-before-va-offer` | buyer | `va-pre-offer` | Found a house you want to write on? | Ask Me to Look at It Before You Offer | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/how-to-use-zillow-without-getting-used` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/` | general | `general-page` | Have a question about your own situation? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <footer> |
| `/articles/lessons-from-a-sale-lindbergh-split-level` | seller | `seller-general` | Thinking about this for your own house? | Ask Me About Your House | Yes | IMPLEMENTED | 2026-09-28 | Before <footer> |
| `/articles/lessons-from-a-sale-ste-genevieve-septic` | buyer | `septic` | Buying a house with septic? | Ask Me About the Septic | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/lessons-from-a-sale` | general | `general-page` | Have a question about your own situation? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <footer> |
| `/articles/lindbergh-vs-mehlville-school-district-stl` | buyer | `school-boundary` | Considering houses on both sides of the district line? | Ask Me About the Addresses | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/mehlville-vs-oakville-vs-concord-stl` | buyer | `area-comparison` | Down to two or three areas? | Ask Me to Compare Them | No | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/mhdc-first-place-next-step-missouri-guide` | buyer | `mhdc` | Planning to use MHDC on an actual house? | Ask Me About the Deal | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/mortgage-pre-approval-st-louis` | buyer | `pre-approval` | Pre-approved and ready to start looking? | Ask Me What I’d Do Next | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/most-affordable-zip-codes-stl-2026` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/multiple-offers-without-overpaying-st-louis` | buyer | `multiple-offers` | About to compete for a house? | Ask Me How I’d Structure the Offer | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/nar-settlement-buyer-representation-stl` | buyer | `buyer-agent` | Want to know what I’d actually do for you? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/no-showings-st-louis-home` | seller | `no-showings` | Your house is listed and nobody’s coming? | Ask Me to Look at the Listing | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/red-flags-bad-buyer-agent-stl` | buyer | `buyer-agent` | Want to know what I’d actually do for you? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/relist-house-st-louis-30-day-rule` | seller | `relisting` | Thinking about putting the house back on the market? | Ask Me What I’d Change First | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-section' |
| `/articles/renting-vs-buying-stl` | buyer | `rent-vs-buy` | Still not sure buying makes sense for you? | Ask Me About Your Situation | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/repair-costs-affect-offer-price-stl` | buyer | `inspection-negotiation` | Got an inspection report and don’t know what to ask for? | Ask Me About the Report | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/sell-house-fall-winter-st-louis` | seller | `winter-selling` | Have to sell before spring? | Ask Me How I’d Approach Your House | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/selling-home-south-st-louis-county` | seller | `south-county-selling` | Thinking about selling your South County house? | Ask Me About Your House | Yes | IMPLEMENTED | 2026-09-28 | Before <h2>Related Resources</h2> |
| `/articles/should-you-accept-cash-offer-stl` | seller | `accept-cash-offer` | Before you sign it, want a second set of eyes? | Ask Me About the Offer | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/showings-but-no-offers-st-louis` | seller | `showings-no-offers` | Getting traffic but nobody’s writing? | Ask Me What Buyers May Be Telling You | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/south-county-stl-neighborhood-guide` | buyer | `area-comparison` | Down to two or three areas? | Ask Me to Compare Them | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/south-county-stl-neighborhoods-by-price` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/st-louis-buyers-bigger-problem-than-rates` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/st-louis-home-price-reduction-negotiation` | buyer | `price-value` | Found a house and wondering if the price makes sense? | Ask Me About the Price | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/stl-affordability-by-zip-code` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/stl-home-repair-cost-guide` | buyer | `property-defect` | Seeing something in a house that concerns you? | Ask Me What I’d Do Next | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/truth-about-zillow-stl` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/va-appraisal-failed-st-louis-what-happens-next` | buyer | `va-appraisal` | Worried a house might have a VA appraisal problem? | Ask Me What I’d Check | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/va-home-loan-st-louis-what-kills-deals` | buyer | `va-appraisal` | Worried a house might have a VA appraisal problem? | Ask Me What I’d Check | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/west-county-st-louis-neighborhoods` | buyer | `area-comparison` | Down to two or three areas? | Ask Me to Compare Them | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/what-300k-450k-600k-buys-st-louis` | buyer | `buying-power` | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/what-buyer-agent-actually-does-stl` | buyer | `buyer-agent` | Want to know what I’d actually do for you? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/what-buyers-regret-cheap-house-st-louis` | buyer | `property-defect` | Seeing something in a house that concerns you? | Ask Me What I’d Do Next | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/what-happens-when-you-click-zillow` | buyer | `buyer-agent` | Want to know what I’d actually do for you? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/what-not-to-repair-before-selling-stl-pricing-strategy` | seller | `what-not-to-repair` | Not sure what to fix before you list? | Ask Me What I’d Leave Alone | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/articles/what-to-look-for-buying-house-stl` | buyer | `home-inspection` | Something about the house worrying you? | Ask Me What I’d Look At | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/what-will-i-net-selling-stl` | seller | `seller-net` | Want to know what you’d actually walk away with? | Ask Me to Run Your Numbers | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/what-you-lose-with-cash-offer-stl` | seller | `cash-convenience` | Want to know what convenience is costing you? | Ask Me to Run the Difference | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/when-to-lower-house-price-st-louis` | seller | `price-reduction` | Thinking about cutting the price? | Ask Me Before You Reduce It | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/where-to-live-in-st-louis` | buyer | `area-comparison` | Down to two or three areas? | Ask Me to Compare Them | No | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/who-pays-buyer-agent-commission-stl` | buyer | `buyer-agent` | Want to know what I’d actually do for you? | Ask Me | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/why-your-st-louis-home-didnt-sell` | seller | `expired-review` | Want me to look at what actually happened? | Ask Me to Review Your Listing | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/articles/zillow-pay-to-play-system` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/articles/zillow-zestimate-accurate-stl` | buyer | `price-value` | Found a house and wondering if the price makes sense? | Ask Me About the Price | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |

## Seller cash-offer pages (15)

| URL | Intent | Context | CTA headline | CTA button | Address field | Status | Implemented | Placement |
|---|---|---|---|---|---|---|---|---|
| `/sellers/assignment-contract-real-estate-missouri/` | seller | `cash-offer` | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/sellers/cash-offer-vs-listing-st-louis/` | seller | `cash-vs-listing` | Trying to decide between selling directly and listing? | Ask Me to Compare Your Options | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/sellers/cash-offers-st-louis` | seller | `cash-offer` | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | IMPLEMENTED | 2026-09-28 | Hand-placed at decision point (first batch) |
| `/sellers/how-investors-calculate-cash-offers/` | seller | `cash-buyer-math` | Have an offer and want to know how they probably got there? | Ask Me to Break Down the Offer | Yes | IMPLEMENTED | 2026-09-28 | Before <section class='related |
| `/sellers/how-wholesaling-works-missouri/` | seller | `cash-offer` | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/sellers/inherited-house-cash-offer-st-louis/` | seller | `inherited` | Dealing with an inherited house right now? | Ask Me About Your Options | Yes | IMPLEMENTED | 2026-09-28 | Before <section class='related |
| `/sellers/oakville-cash-offer-guide/` | seller | `cash-offer` | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/sellers/proof-of-funds-cash-buyer-st-louis/` | seller | `cash-offer` | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | IMPLEMENTED | 2026-09-28 | Before <section class='related |
| `/sellers/questions-to-ask-cash-buyer-st-louis/` | seller | `cash-offer` | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | IMPLEMENTED | 2026-09-28 | Before <section class='related |
| `/sellers/retrading-cash-offer-st-louis/` | seller | `cash-retrade` | Did your cash buyer just lower the offer? | Ask Me to Look at What Changed | Yes | IMPLEMENTED | 2026-09-28 | Before <section class='related |
| `/sellers/sell-house-with-tenants-st-louis/` | seller | `tenants` | Trying to sell a house with tenants? | Ask Me About the Property | Yes | IMPLEMENTED | 2026-09-28 | Before <section class='related |
| `/sellers/sell-vacant-house-st-louis/` | seller | `vacant` | Carrying a vacant house right now? | Ask Me What I’d Do With It | Yes | IMPLEMENTED | 2026-09-28 | Before <section class='related |
| `/sellers/south-county-cash-offers/` | seller | `cash-offer` | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/sellers/why-investors-ask-why-selling/` | seller | `cash-offer` | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |
| `/sellers/why-sellers-accept-lower-cash-offers/` | seller | `cash-convenience` | Want to know what convenience is costing you? | Ask Me to Run the Difference | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='faq-section'> |

## Tools (1)

| URL | Intent | Context | CTA headline | CTA button | Address field | Status | Implemented | Placement |
|---|---|---|---|---|---|---|---|---|
| `/tools/cash-offer-decoder` | seller | `cash-decoder` | You’ve decoded the offer. Want to compare it with your other options? | Ask Me to Compare the Numbers | Yes | IMPLEMENTED | 2026-09-28 | Before <footer> |

## Neighborhoods (117)

| URL | Intent | Context | CTA headline | CTA button | Address field | Status | Implemented | Placement |
|---|---|---|---|---|---|---|---|---|
| `/neighborhoods/affton` | buyer | `neighborhood` | Looking at a house in Affton? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/arnold` | buyer | `neighborhood` | Looking at a house in Arnold? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/ballwin` | buyer | `neighborhood` | Looking at a house in Ballwin? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/barnhart` | buyer | `neighborhood` | Looking at a house in Barnhart? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/bel-nor` | buyer | `neighborhood` | Looking at a house in Bel-Nor? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/bel-ridge` | buyer | `neighborhood` | Looking at a house in Bel-Ridge? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/bellefontaine-neighbors` | buyer | `neighborhood` | Looking at a house in Bellefontaine Neighbors? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/bellerive-acres` | buyer | `neighborhood` | Looking at a house in Bellerive Acres? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/benton-park` | buyer | `neighborhood` | Looking at a house in Benton Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/berkeley` | buyer | `neighborhood` | Looking at a house in Berkeley? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/beverly-hills` | buyer | `neighborhood` | Looking at a house in Beverly Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/bevo` | buyer | `neighborhood` | Looking at a house in Bevo Mill? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/black-jack` | buyer | `neighborhood` | Looking at a house in Black Jack? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/boulevard-heights` | buyer | `neighborhood` | Looking at a house in Boulevard Heights? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/breckenridge-hills` | buyer | `neighborhood` | Looking at a house in Breckenridge Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/bridgeton` | buyer | `neighborhood` | Looking at a house in Bridgeton? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/calverton-park` | buyer | `neighborhood` | Looking at a house in Calverton Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/carondelet` | buyer | `neighborhood` | Looking at a house in Carondelet? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/castle-point` | buyer | `neighborhood` | Looking at a house in Castle Point? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/cedar-hill` | buyer | `neighborhood` | Looking at a house in Cedar Hill? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/central-west-end` | buyer | `neighborhood` | Looking at a house in Central West End? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/champ` | buyer | `neighborhood` | Looking at a house in Champ? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/charlack` | buyer | `neighborhood` | Looking at a house in Charlack? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/chesterfield` | buyer | `neighborhood` | Looking at a house in Chesterfield? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/clayton` | buyer | `neighborhood` | Looking at a house in Clayton? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/concord` | buyer | `neighborhood` | Looking at a house in Concord? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='About George Kindler'> |
| `/neighborhoods/cool-valley` | buyer | `neighborhood` | Looking at a house in Cool Valley? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/cottleville` | buyer | `neighborhood` | Looking at a house in Cottleville? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/country-club-hills` | buyer | `neighborhood` | Looking at a house in Country Club Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/crestwood` | buyer | `neighborhood` | Looking at a house in Crestwood? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/crystal-city` | buyer | `neighborhood` | Looking at a house in Crystal City? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/crystal-lake-park` | buyer | `neighborhood` | Looking at a house in Crystal Lake Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/dardenne-prairie` | buyer | `neighborhood` | Looking at a house in Dardenne Prairie? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/de-soto` | buyer | `neighborhood` | Looking at a house in De Soto? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/dellwood` | buyer | `neighborhood` | Looking at a house in Dellwood? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/dogtown` | buyer | `neighborhood` | Looking at a house in Dogtown? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/dutchtown` | buyer | `neighborhood` | Looking at a house in Dutchtown? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/edmundson` | buyer | `neighborhood` | Looking at a house in Edmundson? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/ferguson` | buyer | `neighborhood` | Looking at a house in Ferguson? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/festus` | buyer | `neighborhood` | Looking at a house in Festus? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/flordell-hills` | buyer | `neighborhood` | Looking at a house in Flordell Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/florissant` | buyer | `neighborhood` | Looking at a house in Florissant? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/forest-park-southeast` | buyer | `neighborhood` | Looking at a house in Forest Park Southeast? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/fox-park` | buyer | `neighborhood` | Looking at a house in Fox Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/glen-echo-park` | buyer | `neighborhood` | Looking at a house in Glen Echo Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/gravois-park` | buyer | `neighborhood` | Looking at a house in Gravois Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/green-park` | buyer | `neighborhood` | Looking at a house in Green Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/greendale` | buyer | `neighborhood` | Looking at a house in Greendale? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/hanley-hills` | buyer | `neighborhood` | Looking at a house in Hanley Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/hazelwood` | buyer | `neighborhood` | Looking at a house in Hazelwood? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/high-ridge` | buyer | `neighborhood` | Looking at a house in High Ridge? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/hillsboro` | buyer | `neighborhood` | Looking at a house in Hillsboro? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/hillsdale` | buyer | `neighborhood` | Looking at a house in Hillsdale? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/house-springs` | buyer | `neighborhood` | Looking at a house in House Springs? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/imperial` | buyer | `neighborhood` | Looking at a house in Imperial? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/` | buyer | `area-comparison` | Down to two or three areas? | Ask Me to Compare Them | No | IMPLEMENTED | 2026-09-28 | Before <div class='george-card' |
| `/neighborhoods/jennings` | buyer | `neighborhood` | Looking at a house in Jennings? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/josephville` | buyer | `neighborhood` | Looking at a house in Josephville? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/kirkwood` | buyer | `neighborhood` | Looking at a house in Kirkwood? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/lafayette-square` | buyer | `neighborhood` | Looking at a house in Lafayette Square? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/lake-st-louis` | buyer | `neighborhood` | Looking at a house in Lake St. Louis? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/lemay` | buyer | `neighborhood` | Looking at a house in Lemay? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/lindenwood-park` | buyer | `neighborhood` | Looking at a house in Lindenwood Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/maplewood` | buyer | `neighborhood` | Looking at a house in Maplewood? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/mckinley-heights` | buyer | `neighborhood` | Looking at a house in McKinley Heights? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/mehlville` | buyer | `neighborhood` | Looking at a house in Mehlville? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/moline-acres` | buyer | `neighborhood` | Looking at a house in Moline Acres? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/mt-pleasant` | buyer | `neighborhood` | Looking at a house in Mt. Pleasant? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/normandy-park` | buyer | `neighborhood` | Looking at a house in Normandy Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/normandy` | buyer | `neighborhood` | Looking at a house in Normandy? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/northampton` | buyer | `neighborhood` | Looking at a house in Northampton? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/northwoods` | buyer | `neighborhood` | Looking at a house in Northwoods? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/norwood-court` | buyer | `neighborhood` | Looking at a house in Norwood Court? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/o-fallon` | buyer | `neighborhood` | Looking at a house in O'Fallon? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/oakville` | buyer | `neighborhood` | Looking at a house in Oakville? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/olympian-village` | buyer | `neighborhood` | Looking at a house in Olympian Village? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/pagedale` | buyer | `neighborhood` | Looking at a house in Pagedale? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/parkdale` | buyer | `neighborhood` | Looking at a house in Parkdale? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/pasadena-hills` | buyer | `neighborhood` | Looking at a house in Pasadena Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/pasadena-park` | buyer | `neighborhood` | Looking at a house in Pasadena Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/patch` | buyer | `neighborhood` | Looking at a house in Patch? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/peaceful-village` | buyer | `neighborhood` | Looking at a house in Peaceful Village? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/pevely` | buyer | `neighborhood` | Looking at a house in Pevely? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/pine-lawn` | buyer | `neighborhood` | Looking at a house in Pine Lawn? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/princeton-heights` | buyer | `neighborhood` | Looking at a house in Princeton Heights? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/riverview` | buyer | `neighborhood` | Looking at a house in Riverview? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/sappington` | buyer | `neighborhood` | Looking at a house in Sappington? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/scotsdale` | buyer | `neighborhood` | Looking at a house in Scotsdale? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/shaw` | buyer | `neighborhood` | Looking at a house in Shaw? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/soulard` | buyer | `neighborhood` | Looking at a house in Soulard? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/southampton` | buyer | `neighborhood` | Looking at a house in Southampton? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/southwest-garden` | buyer | `neighborhood` | Looking at a house in Southwest Garden? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/spanish-lake` | buyer | `neighborhood` | Looking at a house in Spanish Lake? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/st-ann` | buyer | `neighborhood` | Looking at a house in St. Ann? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/st-charles` | buyer | `neighborhood` | Looking at a house in St. Charles? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/st-john` | buyer | `neighborhood` | Looking at a house in St. John? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/st-louis-hills` | buyer | `neighborhood` | Looking at a house in St. Louis Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/st-paul` | buyer | `neighborhood` | Looking at a house in St. Paul? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/st-peters` | buyer | `neighborhood` | Looking at a house in St. Peters? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/sunset-hills` | buyer | `neighborhood` | Looking at a house in Sunset Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/sycamore-hills` | buyer | `neighborhood` | Looking at a house in Sycamore Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/the-hill` | buyer | `neighborhood` | Looking at a house in The Hill? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/tower-grove-east` | buyer | `neighborhood` | Looking at a house in Tower Grove East? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/tower-grove-south` | buyer | `neighborhood` | Looking at a house in Tower Grove South? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/university-city` | buyer | `neighborhood` | Looking at a house in University City? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/uplands-park` | buyer | `neighborhood` | Looking at a house in Uplands Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/velda-city` | buyer | `neighborhood` | Looking at a house in Velda City? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/velda-village-hills` | buyer | `neighborhood` | Looking at a house in Velda Village Hills? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/vinita-park` | buyer | `neighborhood` | Looking at a house in Vinita Park? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/vinita-terrace` | buyer | `neighborhood` | Looking at a house in Vinita Terrace? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/webster-groves` | buyer | `neighborhood` | Looking at a house in Webster Groves? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/weldon-spring-heights` | buyer | `neighborhood` | Looking at a house in Weldon Spring Heights? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/weldon-spring` | buyer | `neighborhood` | Looking at a house in Weldon Spring? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/wellston` | buyer | `neighborhood` | Looking at a house in Wellston? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/wentzville` | buyer | `neighborhood` | Looking at a house in Wentzville? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/west-alton` | buyer | `neighborhood` | Looking at a house in West Alton? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |
| `/neighborhoods/woodson-terrace` | buyer | `neighborhood` | Looking at a house in Woodson Terrace? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <section aria-label='FAQ'> |

## School districts (19)

| URL | Intent | Context | CTA headline | CTA button | Address field | Status | Implemented | Placement |
|---|---|---|---|---|---|---|---|---|
| `/school-districts/affton-school-district` | buyer | `school-district` | Found a house you think is in Affton School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <!-- CTA --> |
| `/school-districts/clayton-school-district` | buyer | `school-district` | Found a house you think is in Clayton School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <!-- CTA --> |
| `/school-districts/ferguson-florissant-school-district` | buyer | `school-district` | Found a house you think is in Ferguson-Florissant School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/fort-zumwalt-school-district` | buyer | `school-district` | Found a house you think is in Fort Zumwalt School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/francis-howell-school-district` | buyer | `school-district` | Found a house you think is in Francis Howell School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/hazelwood-school-district` | buyer | `school-district` | Found a house you think is in Hazelwood School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/kirkwood-school-district` | buyer | `school-district` | Found a house you think is in Kirkwood School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <!-- CTA --> |
| `/school-districts/ladue-school-district` | buyer | `school-district` | Found a house you think is in Ladue School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <!-- CTA --> |
| `/school-districts/lindbergh-schools` | buyer | `school-district` | Found a house you think is in Lindbergh Schools? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <!-- CTA --> |
| `/school-districts/mehlville-school-district` | buyer | `school-district` | Found a house you think is in Mehlville School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <!-- CTA --> |
| `/school-districts/normandy-school-district` | buyer | `school-district` | Found a house you think is in Normandy Schools Collaborative? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/parkway-school-district` | buyer | `school-district` | Found a house you think is in Parkway School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <!-- CTA --> |
| `/school-districts/pattonville-school-district` | buyer | `school-district` | Found a house you think is in Pattonville School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/ritenour-school-district` | buyer | `school-district` | Found a house you think is in Ritenour School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/riverview-gardens-school-district` | buyer | `school-district` | Found a house you think is in Riverview Gardens School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/rockwood-school-district` | buyer | `school-district` | Found a house you think is in Rockwood School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <!-- CTA --> |
| `/school-districts/st-louis-public-schools` | buyer | `school-district` | Found a house you think is in St. Louis Public Schools (SLPS)? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/university-city-school-district` | buyer | `school-district` | Found a house you think is in University City School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-block'> |
| `/school-districts/webster-groves-school-district` | buyer | `school-district` | Found a house you think is in Webster Groves School District? | Ask Me About the Address | Yes | IMPLEMENTED | 2026-09-28 | Before <!-- CTA --> |

## ZIP codes (6)

| URL | Intent | Context | CTA headline | CTA button | Address field | Status | Implemented | Placement |
|---|---|---|---|---|---|---|---|---|
| `/zip-codes/63123` | buyer | `zip-code` | Looking at a house in 63123? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before Nearby Alternatives section |
| `/zip-codes/63125` | buyer | `zip-code` | Looking at a house in 63125? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before Nearby Alternatives section |
| `/zip-codes/63126` | buyer | `zip-code` | Looking at a house in 63126? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before Nearby Alternatives section |
| `/zip-codes/63127` | buyer | `zip-code` | Looking at a house in 63127? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before Nearby Alternatives section |
| `/zip-codes/63128` | buyer | `zip-code` | Looking at a house in 63128? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before Nearby Alternatives section |
| `/zip-codes/63129` | buyer | `zip-code` | Looking at a house in 63129? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before Nearby Alternatives section |

## Listings (10)

| URL | Intent | Context | CTA headline | CTA button | Address field | Status | Implemented | Placement |
|---|---|---|---|---|---|---|---|---|
| `/listings/101-florwood-court-st-louis-mo` | buyer | `listing` | Interested in this house, or one like it? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='ctx-section'> |
| `/listings/11919-holly-brook` | buyer | `listing` | Interested in this house, or one like it? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-card'> |
| `/listings/12053-la-padera-lane-florissant-mo` | buyer | `listing` | Interested in this house, or one like it? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='ctx-section'> |
| `/listings/12237-glenpark-drive-maryland-heights-mo` | buyer | `listing` | Interested in this house, or one like it? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-card'> |
| `/listings/12258-trailoaks-court-black-jack-mo` | buyer | `listing` | Interested in this house, or one like it? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='ctx-section'> |
| `/listings/13218-wintergreen-estates-drive-fenton-mo` | buyer | `listing` | Interested in this house, or one like it? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='cta-card'> |
| `/listings/3410-brunswick-drive-florissant-mo` | buyer | `listing` | Interested in this house, or one like it? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='ctx-section'> |
| `/listings/4347-varano-drive-florissant-mo` | buyer | `listing` | Interested in this house, or one like it? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='ctx-section'> |
| `/listings/6766-lesli-mari-court-florissant-mo` | buyer | `listing` | Interested in this house, or one like it? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <div class='ctx-section'> |
| `/listings/` | buyer | `buyer-general` | Reading this because of a house you’re looking at? | Ask Me About the House | Yes | IMPLEMENTED | 2026-09-28 | Before <footer> |

## Excluded

| URL | Status | Reason |
|---|---|---|
| `/01-preapproval` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/02-affordability` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/03-interior` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/03c-renovated` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/05-pre-offer` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/06-under-contract` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/06b-deadlines` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/07-inspection` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/08-walkthrough` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/09-closing` | EXCLUDED | Journey chapter (noindex, part of the simulator) |
| `/404` | EXCLUDED | Error page |
| `/ask` | EXCLUDED | The Ask Me page itself |
| `/fixer-upper-vs-move-in` | EXCLUDED | Noindex iframe embed |
| `/home-cost-demo` | EXCLUDED | Noindex demo |
| `/journey/` | EXCLUDED | Interactive journey simulator (own UI) |
| `/pinterest-10a52` | EXCLUDED | Pinterest verification file |
| `/real-estate-photography-st-louis` | EXCLUDED | Off-topic (photography service page) |
| `/scan/` | EXCLUDED | Noindex utility |
| `/school-district-map` | EXCLUDED | Noindex embedded map |
| `/sellers/winter-listing-offer` | EXCLUDED | Landing page with its own call/text/email CTAs |
| `/stl-quiz` | EXCLUDED | Unreachable (redirect loop) until the _redirects rule is fixed |

## Delivery

No form backend exists on the site (checked: no Pages Functions, Workers, Apps Script or form service). `/ask` composes the message (source page, URL, context, intent, property, question, name, contact) and opens the visitor’s email app (`mailto:`) or, on phones, their messaging app (`sms:`). The page says nothing is sent until they press send, and offers a copy-and-send fallback.

To receive submissions directly, add a free server-side handler: e.g. a Cloudflare Pages Function (`/functions/ask.js`) that emails via Cloudflare Email Routing, or a Google Apps Script web app that writes to a Sheet and emails George. Hidden fields `source_title`, `source_url`, `ask_context` and `ask_intent` are already in the form.


## Analytics (GA4, no PII)

- `ask_me_click`: page_path, page_title, ask_context, ask_intent, ask_button
- `ask_me_form_start`: ask_context, ask_intent
- `ask_me_submit`: source_page, ask_context, ask_intent, delivery_method (`email_app` / `text_app`). Measures the hand-off, not a confirmed send.

Register `ask_context`, `ask_intent`, `ask_button`, `source_page` and `delivery_method` as event-scoped custom dimensions in GA4.

