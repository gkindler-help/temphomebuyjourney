# Ask Me — Conversion Map

Source of truth for which pages carry the **Ask Me** CTA. CTA copy lives in `/assets/ask-me.js` (`CONTEXTS`); this file tracks rollout.

**How it works:** a page gets `<div data-ask-me="CONTEXT_KEY">…</div>` at its decision point plus `<script src="/assets/ask-me.js?v=1" defer></script>` before `</body>`. The button links to `/ask?about=CONTEXT_KEY&from=/page-path`; the source title and URL are carried automatically.

**Delivery today:** `/ask` hands the message to the visitor’s own email or text app. Nothing is stored or sent by the site. See “Delivery” below.

**Status values:** `LIVE` (on main), `IMPLEMENTED` (on branch, not merged), `HELD` (decision needed), `CANDIDATE` (not approved, not implemented).

**Threshold:** only pages where the reader’s next thought is “what about *my* house / offer / listing / situation?”


## First batch

| URL | Intent | Visitor decision | CTA headline | CTA button | Address field | Context key | Status | Implemented | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `/` | buyer | Found a house they like; unsure whether to pursue it | Found a house you’re seriously considering? | Ask Me About the House | Yes | `home` | IMPLEMENTED | 2026-09-28 | After "Real transactions" section, before sellers |
| `/articles/home-inspection-st-louis` | buyer | Worried about something they saw or an inspection finding | Something about the house worrying you? | Ask Me What I’d Look At | Yes | `home-inspection` | IMPLEMENTED | 2026-09-28 | Before FAQ; existing contact card after FAQ kept |
| `/articles/federal-pacific-panel-va-loan-st-louis` | buyer | Found an FPE panel in a house, possibly using VA | Found one of these panels in a house you’re considering? | Ask Me About the House | Yes | `federal-pacific-va` | IMPLEMENTED | 2026-09-28 | Before FAQ; existing contact card after FAQ kept |
| `/articles/how-to-screen-stl-homes-before-va-offer` | buyer | About to write a VA offer | Found a house you want to write on? | Ask Me to Look at It Before You Offer | Yes | `va-pre-offer` | IMPLEMENTED | 2026-09-28 | Before FAQ; existing contact card after FAQ kept |
| `/articles/mhdc-first-place-next-step-missouri-guide` | buyer | Using MHDC on a specific house | Planning to use MHDC on an actual house? | Ask Me About the Deal | Yes | `mhdc` | IMPLEMENTED | 2026-09-28 | After the 15 lender questions, before Bottom Line; existing contact after |
| `/articles/average-price-move-in-ready-home-st-louis` | buyer | Is the asking price reasonable? | Found a house and wondering if the price makes sense? | Ask Me About the Price | Yes | `price-value` | IMPLEMENTED | 2026-09-28 | Before FAQ |
| `/articles/fixer-upper-vs-move-in-ready-st-louis` | buyer | Does this fixer pencil out? | Looking at a fixer right now? | Ask Me If the Numbers Make Sense | Yes | `fixer-upper` | IMPLEMENTED | 2026-09-28 | After "When a fixer makes sense", before Find Your Neighborhoods; page had no contact CTA |
| `/articles/multiple-offers-without-overpaying-st-louis` | buyer | About to compete for a house | About to compete for a house? | Ask Me How I’d Structure the Offer | Yes | `multiple-offers` | IMPLEMENTED | 2026-09-28 | After Part 1 (competing), before Part 2; existing call CTA before FAQ kept |
| `/articles/mehlville-vs-oakville-vs-concord-stl` | buyer | Choosing between areas | Down to two or three areas? | Ask Me to Compare Them | No | `area-comparison` | IMPLEMENTED | 2026-09-28 | Before FAQ |
| `/complete-guide` | buyer | Moving from research to looking | Ready to stop researching and start looking? | Ask Me to Help You Start | No | `buyer-start` | IMPLEMENTED | 2026-09-28 | After Closing Day chapter, before For VA Buyers; existing end CTA kept |
| `/articles/why-your-st-louis-home-didnt-sell` | seller | Listing failed; what happened? | Want me to look at what actually happened? | Ask Me to Review Your Listing | Yes | `expired-review` | IMPLEMENTED | 2026-09-28 | Right after the 20-question diagnostic; existing end CTA kept |
| `/articles/no-showings-st-louis-home` | seller | Listed with no showings | Your house is listed and nobody’s coming? | Ask Me to Look at the Listing | Yes | `no-showings` | IMPLEMENTED | 2026-09-28 | Before "If Your Listing Expired"; existing end CTA kept |
| `/articles/showings-but-no-offers-st-louis` | seller | Showings but no offers | Getting traffic but nobody’s writing? | Ask Me What Buyers May Be Telling You | Yes | `showings-no-offers` | IMPLEMENTED | 2026-09-28 | Before "If Your Listing Already Failed to Sell"; existing end CTA kept |
| `/articles/when-to-lower-house-price-st-louis` | seller | Considering a price cut | Thinking about cutting the price? | Ask Me Before You Reduce It | Yes | `price-reduction` | IMPLEMENTED | 2026-09-28 | Before "Already Been Sitting"; existing end CTA kept |
| `/articles/sell-house-fall-winter-st-louis` | seller | Must sell before spring | Have to sell before spring? | Ask Me How I’d Approach Your House | Yes | `winter-selling` | IMPLEMENTED | 2026-09-28 | Before "Let's Work With the Market"; existing offer banner and end CTA kept |
| `/articles/cost-to-sell-home-stl` | seller | What will selling cost me? | Thinking about selling and want the real number? | Ask Me What Selling Would Cost | Yes | `cost-to-sell` | IMPLEMENTED | 2026-09-28 | Before FAQ |
| `/articles/what-will-i-net-selling-stl` | seller | What will I walk away with? | Want to know what you’d actually walk away with? | Ask Me to Run Your Numbers | Yes | `seller-net` | IMPLEMENTED | 2026-09-28 | Before FAQ |
| `/sellers/cash-offers-st-louis` | seller | Holding a real cash offer | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | `cash-offer` | IMPLEMENTED | 2026-09-28 | Before FAQ |
| `/articles/should-you-accept-cash-offer-stl` | seller | Deciding whether to sign a cash offer | Before you sign it, want a second set of eyes? | Ask Me About the Offer | Yes | `accept-cash-offer` | IMPLEMENTED | 2026-09-28 | Before FAQ |
| `/articles/how-george-works-with-sellers` | seller | Ready to talk about their own house | Want to talk about your house instead of another hypothetical? | Ask Me About Selling It | Yes | `seller-start` | IMPLEMENTED | 2026-09-28 | Before "What Working With Me Really Comes Down To"; existing end CTA kept |
| `/tools/cash-offer-decoder` | seller | Compare a decoded offer with other options | You’ve decoded the offer. Want to compare it with your other options? | Ask Me to Compare the Numbers | Yes | — | HELD | — | Results already include an "Email George" CTA that sends the computed numbers. Adding Ask Me would stack two contact blocks. Decide: replace that block with Ask Me (passing the numbers) or leave as is. |

## Candidates (not approved, not implemented)

| URL | Intent | Visitor decision | CTA headline | CTA button | Address field | Status | Notes |
|---|---|---|---|---|---|---|---|
| `/articles/average-price-reduction-after-inspection-st-louis` | buyer | Negotiating after inspection | Got an inspection report and don’t know what to ask for? | Ask Me About the Report | Yes | CANDIDATE | Inspection negotiation pattern |
| `/articles/repair-costs-affect-offer-price-stl` | buyer | Pricing repairs into an offer | Got an inspection report and don’t know what to ask for? | Ask Me About the Report | Yes | CANDIDATE | Inspection negotiation pattern |
| `/articles/st-louis-home-price-reduction-negotiation` | buyer | Negotiating price on a house that has sat | Found a house and wondering if the price makes sense? | Ask Me About the Price | Yes | CANDIDATE | Price/appraisal pattern |
| `/articles/va-appraisal-failed-st-louis-what-happens-next` | buyer | VA appraisal came back with conditions | Worried a house might have a VA appraisal problem? | Ask Me What I’d Check | Yes | CANDIDATE | VA appraisal pattern |
| `/articles/va-home-loan-st-louis-what-kills-deals` | buyer | VA property condition risk | Worried a house might have a VA appraisal problem? | Ask Me What I’d Check | Yes | CANDIDATE | VA appraisal pattern |
| `/articles/can-you-buy-fixer-upper-va-loan-st-louis` | buyer | Fixer with a VA loan | Looking at a fixer right now? | Ask Me If the Numbers Make Sense | Yes | CANDIDATE | Fixer pattern |
| `/articles/lessons-from-a-sale-ste-genevieve-septic` | buyer | Buying a house with septic | Buying a house with septic? | Ask Me About the Septic | Yes | CANDIDATE | Septic pattern |
| `/articles/stl-home-repair-cost-guide` | buyer | Seeing a defect in a house | Seeing something in a house that concerns you? | Ask Me What I’d Do Next | Yes | CANDIDATE | Property-defect pattern |
| `/fails` | buyer | Red flags by property type | Seeing something in a house that concerns you? | Ask Me What I’d Do Next | Yes | CANDIDATE | Property-defect pattern; tool-style page |
| `/articles/lindbergh-vs-mehlville-school-district-stl` | buyer | Houses on both sides of a district line | Considering houses on both sides of the district line? | Ask Me About the Addresses | Yes | CANDIDATE | School boundary pattern |
| `/compare` | buyer | Comparing neighborhoods | Down to two or three areas? | Ask Me to Compare Them | No | CANDIDATE | Tool page; place after results |
| `/stl-home-buying-power-calculator` | buyer | Knows budget, not where to spend it | Know your number. Not sure where to spend it? | Ask Me Where Your Budget Fits | No | CANDIDATE | Tool page; place after results |
| `/articles/renting-vs-buying-stl` | buyer | Unsure buying makes sense | Still not sure buying makes sense for you? | Ask Me About Your Situation | No | CANDIDATE |  |
| `/articles/mortgage-pre-approval-st-louis` | buyer | Pre-approved, ready to look | Pre-approved and ready to start looking? | Ask Me What I’d Do Next | No | CANDIDATE |  |
| `/articles/do-i-need-a-buyers-agent-stl` | buyer | Weighing representation | Want to know what I’d actually do for you? | Ask Me | Optional | CANDIDATE | Representation pattern |
| `/articles/what-buyer-agent-actually-does-stl` | buyer | Weighing representation | Want to know what I’d actually do for you? | Ask Me | Optional | CANDIDATE | Representation pattern |
| `/articles/how-to-interview-buyers-agent-stl` | buyer | Interviewing agents | Want to know what I’d actually do for you? | Ask Me | Optional | CANDIDATE | Representation pattern |
| `/articles/buying-a-home-in-oakville-mo` | buyer | Looking at a house in Oakville | Looking at a house in Oakville? | Ask Me About the House | Yes | CANDIDATE | Neighborhood pattern; transactional guide |
| `/neighborhoods/concord` | buyer | Looking at a house in Concord | Looking at a house in Concord? | Ask Me About the House | Yes | CANDIDATE | Neighborhood pattern; add only to pages with clear transactional intent |
| `/school-districts/lindbergh-schools` | buyer | House believed to be in Lindbergh | Found a house you think is in Lindbergh? | Ask Me About the Address | Yes | CANDIDATE | School district pattern; pilot one district first |
| `/school-districts/mehlville-school-district` | buyer | House believed to be in Mehlville | Found a house you think is in Mehlville? | Ask Me About the Address | Yes | CANDIDATE | School district pattern |
| `/articles/relist-house-st-louis-30-day-rule` | seller | Relisting after expiration | Thinking about putting the house back on the market? | Ask Me What I’d Change First | Yes | CANDIDATE | Relisting/DOM pattern |
| `/articles/what-not-to-repair-before-selling-stl-pricing-strategy` | seller | What to fix before listing | Not sure what to fix before you list? | Ask Me What I’d Leave Alone | Yes | CANDIDATE |  |
| `/articles/selling-home-south-st-louis-county` | seller | Selling in South County | Thinking about selling your South County house? | Ask Me About Your House | Yes | CANDIDATE |  |
| `/articles/how-cash-buyers-calculate-offers-stl` | seller | Understanding an offer’s math | Have an offer and want to know how they probably got there? | Ask Me to Break Down the Offer | Yes | CANDIDATE | Cash offer ecosystem |
| `/articles/what-you-lose-with-cash-offer-stl` | seller | Cost of convenience | Want to know what convenience is costing you? | Ask Me to Run the Difference | Yes | CANDIDATE | Cash offer ecosystem |
| `/sellers/cash-offer-vs-listing-st-louis` | seller | Direct sale vs listing | Trying to decide between selling directly and listing? | Ask Me to Compare Your Options | Yes | CANDIDATE | Cash offer ecosystem |
| `/sellers/how-investors-calculate-cash-offers` | seller | Understanding an offer’s math | Have an offer and want to know how they probably got there? | Ask Me to Break Down the Offer | Yes | CANDIDATE | Cash offer ecosystem; overlaps the /articles version |
| `/sellers/inherited-house-cash-offer-st-louis` | seller | Inherited house | Dealing with an inherited house right now? | Ask Me About Your Options | Yes | CANDIDATE | Cash offer ecosystem |
| `/sellers/sell-vacant-house-st-louis` | seller | Carrying a vacant house | Carrying a vacant house right now? | Ask Me What I’d Do With It | Yes | CANDIDATE | Cash offer ecosystem |
| `/sellers/sell-house-with-tenants-st-louis` | seller | Selling with tenants | Trying to sell a house with tenants? | Ask Me About the Property | Yes | CANDIDATE | Cash offer ecosystem |
| `/sellers/retrading-cash-offer-st-louis` | seller | Cash buyer lowered the offer | Did your cash buyer just lower the offer? | Ask Me to Look at What Changed | Yes | CANDIDATE | Cash offer ecosystem |
| `/sellers/questions-to-ask-cash-buyer-st-louis` | seller | Vetting a cash buyer | Have an actual cash offer in front of you? | Ask Me to Look at the Offer | Yes | CANDIDATE | Cash offer ecosystem |
| `/sellers/why-sellers-accept-lower-cash-offers` | seller | Weighing a low cash offer | Want to know what convenience is costing you? | Ask Me to Run the Difference | Yes | CANDIDATE | Cash offer ecosystem |
| `/fsbo-st-louis` | seller | Considering selling without an agent | Want to talk about your house instead of another hypothetical? | Ask Me About Selling It | Yes | CANDIDATE | Review tone first: FSBO readers may resist an agent CTA |

## Not planned (informational, below the threshold)

Zillow explainers (`/articles/truth-about-zillow-stl`, `/articles/zillow-pay-to-play-system`, `/articles/what-happens-when-you-click-zillow`), commission/NAR explainers (`/articles/nar-settlement-buyer-representation-stl`, `/articles/who-pays-buyer-agent-commission-stl`), broad area overviews (`/articles/where-to-live-in-st-louis`), `/stl-quiz`, and the journey simulator (`/journey`). Revisit only if a page grows a personal decision point.


## Delivery

No form backend exists on the site (checked: no Pages Functions, Workers, Apps Script or form service). `/ask` therefore composes the message (source page, URL, context, intent, property, question, name, contact) and opens the visitor’s email app (`mailto:`) or, on phones, their messaging app (`sms:`). The page says plainly that nothing is sent until they press send, and offers a copy-and-send fallback.

To receive submissions directly, add a free server-side handler and point the form at it: e.g. a Cloudflare Pages Function (`/functions/ask.js`) that emails via Cloudflare Email Routing, or a Google Apps Script web app that writes to a Sheet and emails George. Hidden fields `source_title`, `source_url`, `ask_context` and `ask_intent` are already in the form.


## Analytics (GA4, no PII)

- `ask_me_click`: page_path, page_title, ask_context, ask_intent, ask_button
- `ask_me_form_start`: ask_context, ask_intent (first keystroke on /ask)
- `ask_me_submit`: source_page, ask_context, ask_intent, delivery_method (`email_app` / `text_app`). Measures the hand-off, not a confirmed send.

Register `ask_context`, `ask_intent`, `ask_button`, `source_page` and `delivery_method` as event-scoped custom dimensions in GA4 to report on them.

