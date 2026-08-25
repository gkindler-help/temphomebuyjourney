/* /resources.js
   STL Home Buyer Journey — Resource Registry
   Single source of truth for all resources, tools, and articles.

   Each entry drives:
   1. The Resources tab panel (filtered by current chapter)
   2. Auto-injected scene chips (matched by chapter + scene index)
   3. Tool panel launch (when tool: true)
   4. Article links (when tool: false — opens article URL directly)

   To add a new resource:
   1. Create the HTML page
   2. Add an entry here with the correct chapter/scene citations
   3. Nothing else needs to change

   Scene indices are 0-based (first scene = 0).

   Chapter map:
     1  = Pre-Approval
     2  = Affordability
     3  = Interior Walk
     4  = Pre-Offer
     5  = Under Contract
     6  = Inspection / Deadlines
     7  = Inspection Report
     8  = Walk-Through
     9  = Closing
*/

window.RESOURCES_REGISTRY = [

  /* ══════════════════════════════════════════════════════════
     INTERACTIVE TOOLS
  ══════════════════════════════════════════════════════════ */

  /* ── OPEN HOUSE PREP ──────────────────────────────────── */
  {
    id:      'prep',
    title:   'STL Open House Prep',
    summary: 'First weekend rate, days on market, true monthly cost, and price tiers by ZIP — before you walk in the door.',
    url:     'prep',
    tool:    true,
    toolId:  'prep',
    citations: [
      { chapter: 2, scene: 1, context: 'Before you walk into a showing — know what the competition looks like in this zip code.' },
      { chapter: 5, scene: 2, context: 'Before you write the offer — pull the market data for this zip.' }
    ]
  },

  /* ── AFFORDABILITY MAP ────────────────────────────────── */
  {
    id:      'afford',
    title:   'STL Affordability Map',
    summary: '79 ZIP codes color-coded by what your budget actually buys — first weekend rate, days on market, median price.',
    url:     'afford',
    tool:    true,
    toolId:  'afford',
    citations: [
      { chapter: 2, scene: 0, context: 'See what your budget gets you across 79 St. Louis zip codes.' },
      { chapter: 2, scene: 3, context: 'Now that you know how to think about affordability — see it mapped by zip.' }
    ]
  },

  /* ── COST SURVIVAL GUIDE ──────────────────────────────── */
  {
    id:      'home-cost',
    title:   'STL Home Cost Survival Guide',
    summary: 'Walk the property, tap what you see, get St. Louis repair estimates — not national averages.',
    url:     'home-cost',
    tool:    true,
    toolId:  'home-cost',
    citations: [
      { chapter: 3, scene: 5, context: 'Walk the basement and flag what you see — every dollar you identify is a dollar you can negotiate.' },
      { chapter: 8, scene: 1, context: 'If something is wrong at the walk-through you need numbers before you have that conversation.' }
    ]
  },

  /* ── COMPARE PROPERTIES ───────────────────────────────── */
  {
    id:      'compare',
    title:   'STL Compare Properties',
    summary: 'Two homes side by side — true monthly cost, taxes, insurance, and 30-year difference.',
    url:     'compare',
    tool:    true,
    toolId:  'compare',
    citations: [
      { chapter: 5, scene: 3, context: 'Before you commit — compare this property against your alternatives.' },
      { chapter: 5, scene: 4, context: 'Side by side before you write — true monthly cost, not just list price.' }
    ]
  },

  /* ── COMMON HOME FAILURES ─────────────────────────────── */
  {
    id:      'fails',
    title:   'STL Common Home Failures',
    summary: 'Visual guide to the most expensive and most commonly missed defects in St. Louis homes.',
    url:     'fails',
    tool:    true,
    toolId:  'fails',
    citations: [
      { chapter: 3, scene: 3, context: 'Two-prong outlets are one tell. See the full list of what to look for at any showing.' },
      { chapter: 3, scene: 7, context: 'Federal Pacific panel. Know what you are looking at before the inspector does.' },
      { chapter: 7, scene: 2, context: 'The defects that show up most in St. Louis homes — and what they actually cost.' }
    ]
  },

  /* ── NEIGHBORHOOD MATCHER ─────────────────────────────── */
  {
    id:      'neighborhood-matcher',
    title:   'STL Neighborhood Matcher',
    summary: '5 questions. Ranked area matches across 98 St. Louis neighborhoods — with links to individual neighborhood guides.',
    url:     'neighborhood-matcher',
    tool:    true,
    toolId:  'neighborhood-matcher',
    citations: [
      { chapter: 1, scene: 0, context: 'Before you start touring — figure out which part of St. Louis actually fits your life.' },
      { chapter: 2, scene: 0, context: 'Budget and location are linked. Find the areas that match both before you set a price range.' },
      { chapter: 4, scene: 0, context: 'Narrowing down where to buy is part of offer strategy. Run the matcher if you have not yet.' }
    ]
  },


  /* ══════════════════════════════════════════════════════════
     ARTICLES: THE TRUTH ABOUT ZILLOW (5)
  ══════════════════════════════════════════════════════════ */

  {
    id:      'art-truth-about-zillow-stl',
    title:   'The Truth About Zillow',
    summary: 'Zillow is the most visited real estate platform in the country. It is also a lead generation machine — not a buyer tool.',
    url:     'articles/truth-about-zillow-stl',
    tool:    false,
    citations: [
      { chapter: 2, scene: 0, context: 'Before you rely on Zillow for anything — understand what it actually is and how it makes money.' },
      { chapter: 3, scene: 0, context: 'You found this home on Zillow. Here is what happened the moment you clicked.' }
    ]
  },

  {
    id:      'art-zillow-pay-to-play',
    title:   'How Zillow\'s Pay-to-Play System Works',
    summary: 'Zillow charges agents per lead referral. That cost gets passed somewhere — and it is not to the agent.',
    url:     'articles/zillow-pay-to-play-system',
    tool:    false,
    citations: [
      { chapter: 2, scene: 1, context: 'The agent who called you paid Zillow for your number. Here is what that means for you.' }
    ]
  },

  {
    id:      'art-what-happens-when-you-click-zillow',
    title:   'What Happens the Moment You Click on Zillow',
    summary: 'The second you engage with a Zillow listing, a process starts that most buyers do not see coming.',
    url:     'articles/what-happens-when-you-click-zillow',
    tool:    false,
    citations: [
      { chapter: 2, scene: 1, context: 'You clicked. Here is exactly what was triggered on the other end.' }
    ]
  },

  {
    id:      'art-zillow-zestimate-accurate-stl',
    title:   'Is the Zillow Zestimate Accurate in St. Louis?',
    summary: 'The Zestimate is a starting point, not a valuation. Here is how far off it runs in St. Louis — and why.',
    url:     'articles/zillow-zestimate-accurate-stl',
    tool:    false,
    citations: [
      { chapter: 2, scene: 2, context: 'The Zestimate on this property is not what it is worth. Here is what to use instead.' },
      { chapter: 6, scene: 0, context: 'If the appraisal comes in different than the Zestimate, this is why.' }
    ]
  },

  {
    id:      'art-how-to-use-zillow-without-getting-used',
    title:   'How to Use Zillow Without Getting Used by Zillow',
    summary: 'Zillow is useful — just not in the ways most buyers think. Here is how to extract the signal and ignore the noise.',
    url:     'articles/how-to-use-zillow-without-getting-used',
    tool:    false,
    citations: [
      { chapter: 2, scene: 3, context: 'Use Zillow as a search tool. Use this guide to know its limits.' },
      { chapter: 3, scene: 1, context: 'You found this home on Zillow. Here is how to use that data without letting it mislead your offer.' }
    ]
  },


  /* ══════════════════════════════════════════════════════════
     ARTICLES: ST. LOUIS AFFORDABILITY (5)
  ══════════════════════════════════════════════════════════ */

  {
    id:      'art-stl-affordability-by-zip-code',
    title:   'St. Louis Home Affordability by Zip Code',
    summary: 'Two homes at the same price can cost hundreds more per month depending on where they sit. Here is the full picture by zip.',
    url:     'articles/stl-affordability-by-zip-code',
    tool:    false,
    citations: [
      { chapter: 1, scene: 2, context: 'Your approval number does not account for property tax differences by zip. This does.' },
      { chapter: 2, scene: 0, context: 'Before you set a search radius — see how much zip code affects your real monthly payment.' }
    ]
  },

  {
    id:      'art-how-much-income-to-buy-home-stl',
    title:   'How Much Income Do You Need to Buy a Home in St. Louis?',
    summary: 'Your lender\'s approval number and your real affordability number are not the same thing.',
    url:     'articles/how-much-income-to-buy-home-stl',
    tool:    false,
    citations: [
      { chapter: 1, scene: 1, context: 'Before you talk to a lender — know what income actually supports which price point in St. Louis.' },
      { chapter: 2, scene: 0, context: 'The number your lender approves and the number you should spend are often different. Here is why.' }
    ]
  },

  {
    id:      'art-renting-vs-buying-stl',
    title:   'Renting vs. Buying in St. Louis: What the Numbers Actually Show',
    summary: 'The rent vs. buy decision in St. Louis is not as simple as comparing monthly payments.',
    url:     'articles/renting-vs-buying-stl',
    tool:    false,
    citations: [
      { chapter: 1, scene: 0, context: 'Still deciding whether to buy at all? Read this before you go further.' }
    ]
  },

  {
    id:      'art-first-time-buyer-programs-stl',
    title:   'First-Time Home Buyer Programs in St. Louis',
    summary: 'Down payment assistance, grants, and loan programs for St. Louis buyers — what is available and how to qualify.',
    url:     'articles/first-time-buyer-programs-stl',
    tool:    false,
    citations: [
      { chapter: 1, scene: 2, context: 'MHDC and other programs can cover your down payment and closing costs. Here is what is available.' },
      { chapter: 2, scene: 1, context: 'Before you decide how much to put down — check whether assistance programs cover part of it.' }
    ]
  },

  {
    id:      'art-most-affordable-zip-codes-stl-2026',
    title:   'Most Affordable Zip Codes in St. Louis Right Now',
    summary: 'Where your dollar goes furthest in St. Louis right now — ranked by real monthly cost, not just list price.',
    url:     'articles/most-affordable-zip-codes-stl-2026',
    tool:    false,
    citations: [
      { chapter: 2, scene: 2, context: 'If budget is the primary constraint — here are the zip codes where it stretches furthest right now.' }
    ]
  },


  /* ══════════════════════════════════════════════════════════
     ARTICLES: HOME REPAIR COST GUIDE (4)
  ══════════════════════════════════════════════════════════ */

  {
    id:      'art-stl-home-repair-cost-guide',
    title:   'St. Louis Home Repair Cost Guide for Buyers',
    summary: 'Most buyers make an offer based on how a home feels. This guide exists to fix that — real repair costs, St. Louis contractors.',
    url:     'articles/stl-home-repair-cost-guide',
    tool:    false,
    citations: [
      { chapter: 4, scene: 1, context: 'Before you write a number on an offer — know what the defects you saw actually cost to fix.' },
      { chapter: 5, scene: 0, context: 'The inspection report is coming. This tells you what the line items will actually cost.' }
    ]
  },

  {
    id:      'art-what-to-look-for-buying-house-stl',
    title:   'What to Look For When Buying a House in St. Louis',
    summary: 'The items that cost tens of thousands are the ones most buyers walk right past at the showing.',
    url:     'articles/what-to-look-for-buying-house-stl',
    tool:    false,
    citations: [
      { chapter: 4, scene: 0, context: 'You are about to tour. Here is what to look at — basement, panel, grade, roof.' },
      { chapter: 5, scene: 1, context: 'Before the inspector goes through — know what to watch for yourself.' }
    ]
  },

  {
    id:      'art-repair-costs-affect-offer-price-stl',
    title:   'How Repair Costs Should Affect Your Offer Price in St. Louis',
    summary: 'How to turn a repair estimate into a defensible offer number — not a guess.',
    url:     'articles/repair-costs-affect-offer-price-stl',
    tool:    false,
    citations: [
      { chapter: 5, scene: 2, context: 'You have the repair numbers. Here is how to translate them into an offer adjustment.' },
      { chapter: 6, scene: 1, context: 'The inspection came back with issues. Here is how to use those numbers in your objection.' }
    ]
  },

  {
    id:      'art-home-inspection-st-louis',
    title:   'What Happens at a Home Inspection in St. Louis',
    summary: 'What to expect, what the inspector checks, and what to do with the results before your deadline.',
    url:     'articles/home-inspection-st-louis',
    tool:    false,
    citations: [
      { chapter: 5, scene: 3, context: 'The inspection is scheduled. Here is what the process looks like and what you need to do with the results.' }
    ]
  },


  /* ══════════════════════════════════════════════════════════
     ARTICLES: WHO'S ACTUALLY REPRESENTING YOU? (5)
  ══════════════════════════════════════════════════════════ */

  {
    id:      'art-do-i-need-a-buyers-agent-stl',
    title:   'Do You Actually Need a Buyer\'s Agent in St. Louis?',
    summary: 'The honest answer — what representation costs, what it gets you, and what changed after the NAR settlement.',
    url:     'articles/do-i-need-a-buyers-agent-stl',
    tool:    false,
    citations: [
      { chapter: 1, scene: 0, context: 'Before you commit to any agent — understand what representation actually means and costs.' },
      { chapter: 2, scene: 0, context: 'The agent showing you homes has a fiduciary duty — but only if you have an agreement. Here is what that means.' }
    ]
  },

  {
    id:      'art-what-buyer-agent-actually-does-stl',
    title:   'What a Buyer\'s Agent Actually Does',
    summary: 'The fiduciary duty, the pre-showing prep, the offer strategy, the inspection negotiation — what a good agent is doing that you cannot see.',
    url:     'articles/what-buyer-agent-actually-does-stl',
    tool:    false,
    citations: [
      { chapter: 2, scene: 1, context: 'Here is what I am doing before every showing that most buyers never see.' },
      { chapter: 5, scene: 0, context: 'Your agent\'s job does not stop at offer accepted. Here is what happens next — and what to expect.' }
    ]
  },

  {
    id:      'art-how-to-interview-buyers-agent-stl',
    title:   'How to Interview a Buyer\'s Agent in St. Louis',
    summary: 'Seven questions that reveal exactly who you are dealing with before you sign anything.',
    url:     'articles/how-to-interview-buyers-agent-stl',
    tool:    false,
    citations: [
      { chapter: 2, scene: 0, context: 'Before you sign a buyer agency agreement — ask these seven questions first.' }
    ]
  },

  {
    id:      'art-red-flags-bad-buyer-agent-stl',
    title:   'Red Flags: How to Spot a Bad Buyer\'s Agent',
    summary: 'Pressure tactics, the handoff to a junior agent, dual agency — the warning signs before they cost you.',
    url:     'articles/red-flags-bad-buyer-agent-stl',
    tool:    false,
    citations: [
      { chapter: 2, scene: 1, context: 'If your agent is doing any of these things — you need to know before you go further.' }
    ]
  },

  {
    id:      'art-nar-settlement-buyer-representation-stl',
    title:   'What the NAR Settlement Changed for St. Louis Buyers',
    summary: 'What the August 2024 NAR settlement actually changed and what it means for your buyer agency agreement today.',
    url:     'articles/nar-settlement-buyer-representation-stl',
    tool:    false,
    citations: [
      { chapter: 2, scene: 0, context: 'The rules around buyer agent compensation changed in 2024. Here is what that means before you sign.' },
      { chapter: 9, scene: 0, context: 'Buyer agent compensation shows on the Closing Disclosure. Here is what changed and what to expect.' }
    ]
  },


  /* ══════════════════════════════════════════════════════════
     ARTICLES: MORTGAGE AND FINANCING (5)
  ══════════════════════════════════════════════════════════ */

  {
    id:      'art-mortgage-pre-approval-st-louis',
    title:   'How to Get Pre-Approved for a Mortgage in St. Louis',
    summary: 'What pre-approval actually means, what documents you need, and what lenders look at before they say yes.',
    url:     'articles/mortgage-pre-approval-st-louis',
    tool:    false,
    citations: [
      { chapter: 1, scene: 1, context: 'Pre-approval is not a formality — it determines what you can offer and how sellers see you.' },
      { chapter: 2, scene: 0, context: 'Before you set a budget — understand what the pre-approval process actually produces.' }
    ]
  },

  {
    id:      'art-conventional-vs-fha-loan-st-louis',
    title:   'Conventional vs. FHA Loan in St. Louis',
    summary: 'How conventional and FHA loans compare — and how your loan type affects your offer competitiveness and seller concession limits.',
    url:     'articles/conventional-vs-fha-loan-st-louis',
    tool:    false,
    citations: [
      { chapter: 1, scene: 2, context: 'FHA vs. conventional — your loan type affects how sellers see your offer and how much they can cover.' },
      { chapter: 2, scene: 1, context: 'The loan type you choose changes your offer strategy. Read this before you commit to one.' }
    ]
  },

  {
    id:      'art-credit-score-buy-home-st-louis',
    title:   'What Credit Score Do You Need to Buy a Home in St. Louis?',
    summary: 'Minimum credit scores by loan type and what the difference between score tiers actually costs you in rate.',
    url:     'articles/credit-score-buy-home-st-louis',
    tool:    false,
    citations: [
      { chapter: 1, scene: 1, context: 'Your credit score determines your loan type, your rate, and your monthly payment. Here are the thresholds.' }
    ]
  },

  {
    id:      'art-how-much-down-payment-st-louis',
    title:   'How Much Down Payment Do You Need in St. Louis?',
    summary: 'Real down payment requirements by loan type, what assistance covers, and what putting more down actually buys you.',
    url:     'articles/how-much-down-payment-st-louis',
    tool:    false,
    citations: [
      { chapter: 1, scene: 2, context: 'The 20% down myth costs buyers in St. Louis. Here are the real minimums by loan type.' },
      { chapter: 2, scene: 1, context: 'Down payment affects your rate, your PMI, and your monthly payment. Here is how to think about the tradeoff.' }
    ]
  },

  {
    id:      'art-buyer-closing-costs-st-louis',
    title:   'Buyer Closing Costs in St. Louis: The Full Breakdown',
    summary: 'Every closing cost line item — lender fees, title, prepaids, escrow — and how much the seller can legally cover by loan type.',
    url:     'articles/buyer-closing-costs-st-louis',
    tool:    false,
    citations: [
      { chapter: 9, scene: 0, context: 'You are about to see your Closing Disclosure. Here is every line item explained before you get to the table.' }
    ]
  },


  /* ══════════════════════════════════════════════════════════
     ARTICLES: OFFER STRATEGY AND NEGOTIATION (1)
  ══════════════════════════════════════════════════════════ */

  {
    id:      'art-st-louis-home-price-reduction-negotiation',
    title:   '$30K Off Before Inspections: St. Louis Case Study',
    summary: 'A verified St. Louis transaction — roof, foundation, 90 days on market, two failed deals, and how the negotiation played out.',
    url:     'articles/st-louis-home-price-reduction-negotiation',
    tool:    false,
    citations: [
      { chapter: 3, scene: 4, context: 'What you see at the showing can become negotiating leverage. Here is a real example of how that plays out.' },
      { chapter: 5, scene: 2, context: 'Before you write your offer number — read how repair findings translated into a $30,000 price reduction.' }
    ]
  },


  /* ══════════════════════════════════════════════════════════
     ARTICLES: SOUTH COUNTY ST. LOUIS (5)
  ══════════════════════════════════════════════════════════ */

  {
    id:      'art-south-county-stl-neighborhood-guide',
    title:   'South County St. Louis Neighborhood Guide',
    summary: 'The full buyer\'s guide to South County — nine communities, school districts, market speed, and what each area actually feels like.',
    url:     'articles/south-county-stl-neighborhood-guide',
    tool:    false,
    citations: [
      { chapter: 2, scene: 0, context: 'Considering South County? Here is the full picture — neighborhoods, school districts, and price ranges.' },
      { chapter: 4, scene: 0, context: 'Before you narrow your search to South County — know which communities fit your priorities.' }
    ]
  },

  {
    id:      'art-south-county-stl-neighborhoods-by-price',
    title:   'South County St. Louis Neighborhoods by Price: $152K to $523K',
    summary: 'Nine communities mapped by actual median value, market speed, and what your budget realistically gets you at each tier.',
    url:     'articles/south-county-stl-neighborhoods-by-price',
    tool:    false,
    citations: [
      { chapter: 2, scene: 2, context: 'If you are targeting South County — here is exactly what each price tier buys you, neighborhood by neighborhood.' },
      { chapter: 4, scene: 1, context: 'Before you make an offer in South County — know where your number sits in the market.' }
    ]
  },

  {
    id:      'art-buying-a-home-in-oakville-mo',
    title:   'Buying a Home in Oakville, MO',
    summary: 'What buyers need to know about Oakville before making an offer — market speed, school districts, price ranges, and inspection priorities.',
    url:     'articles/buying-a-home-in-oakville-mo',
    tool:    false,
    citations: [
      { chapter: 2, scene: 2, context: 'Targeting Oakville? Here is what the market looks like and what to watch for at the showing.' },
      { chapter: 4, scene: 0, context: 'Oakville is a competitive market. Here is what to know before you write an offer there.' }
    ]
  },

  {
    id:      'art-mehlville-vs-oakville-vs-concord-stl',
    title:   'Mehlville vs. Oakville vs. Concord: Which Should You Buy In?',
    summary: 'Side-by-side comparison for buyers deciding between these three South County corridors — price, schools, competition, and character.',
    url:     'articles/mehlville-vs-oakville-vs-concord-stl',
    tool:    false,
    citations: [
      { chapter: 2, scene: 2, context: 'Mehlville, Oakville, or Concord — here is how they compare on price, schools, and market speed.' },
      { chapter: 4, scene: 0, context: 'If you are deciding between these three corridors — read this before you commit to a search area.' }
    ]
  },

  {
    id:      'art-lindbergh-vs-mehlville-school-district-stl',
    title:   'Lindbergh vs. Mehlville School District: What Buyers Need to Know',
    summary: 'What the school district boundary means for home prices, offer strategy, and resale value in South County St. Louis.',
    url:     'articles/lindbergh-vs-mehlville-school-district-stl',
    tool:    false,
    citations: [
      { chapter: 2, scene: 2, context: 'The Lindbergh vs. Mehlville district line affects price by up to $40K on the same street. Verify before you offer.' },
      { chapter: 4, scene: 1, context: 'Before you write an offer in South County — confirm the school district assignment for that address.' }
    ]
  }

];
