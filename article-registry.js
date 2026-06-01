/* article-registry.js
   Single source of truth for all STL Home Journey articles.
   ASCII-safe only -- no curly quotes, no smart apostrophes, no em dashes.
   ES5 compatible -- no spread operator, no shorthand methods.
   Version 1.1.1 -- added Neighborhood Guides series
*/

window.ARTICLE_REGISTRY = {

  version: "1.2.0",

  series: {
    "zillow": {
      title: "The Truth About Zillow",
      slug: "zillow",
      audience: "both",
      description: "How Zillow's pay-to-play model works and how to use it without getting used.",
      hubSlug: "truth-about-zillow-stl",
      toolLink: null
    },
    "affordability": {
      title: "St. Louis Affordability by Zip Code",
      slug: "affordability",
      audience: "buyer",
      description: "How far your budget actually goes across 79 St. Louis zip codes.",
      hubSlug: "stl-affordability-by-zip-code",
      toolLink: "https://gkindler-help.github.io/buyeraffordabilityheatmap/"
    },
    "repair-guide": {
      title: "St. Louis Home Repair Cost Guide for Buyers",
      slug: "repair-guide",
      audience: "buyer",
      description: "Know what a home will actually cost before you make an offer.",
      hubSlug: "stl-home-repair-cost-guide",
      toolLink: null
    },
    "representation": {
      title: "Who's Actually Representing You?",
      slug: "representation",
      audience: "buyer",
      description: "What buyer representation means, how to choose the right agent, and what changed after the NAR settlement.",
      hubSlug: "do-i-need-a-buyers-agent-stl",
      toolLink: null
    },
    "mortgage": {
      title: "Mortgage and Financing in St. Louis",
      slug: "mortgage",
      audience: "buyer",
      description: "Pre-approval, loan types, credit scores, down payments, and closing costs.",
      hubSlug: "mortgage-pre-approval-st-louis",
      toolLink: null
    },
    "neighborhoods": {
      title: "St. Louis Neighborhood Guides for Buyers",
      slug: "neighborhoods",
      audience: "buyer",
      description: "What buyers actually need to know before committing to a St. Louis neighborhood -- schools, price tiers, tradeoffs, and honest comparisons.",
      hubSlug: "south-county-stl-neighborhood-guide",
      toolLink: null
    },
    "va-buyer": {
      title: "Why VA Deals Fall Apart in St. Louis (And How to Avoid It)",
      slug: "va-buyer",
      audience: "buyer",
      description: "From a Marine veteran who's closed VA loans here -- the appraisal traps, electrical panels, and property issues that kill deals before closing.",
      hubSlug: "va-home-loan-st-louis-what-kills-deals",
      toolLink: null
    },
    "seller-net": {
      title: "St. Louis Home Seller Guides",
      slug: "seller-net",
      audience: "seller",
      description: "The real numbers behind selling a home in St. Louis.",
      hubSlug: "stl-home-seller-guides",
      toolLink: null
    },
    "cash-offer": {
      title: "Should You Accept a Cash Offer in St. Louis?",
      slug: "cash-offer",
      audience: "seller",
      description: "What cash buyers are actually doing with your home and what it costs you to say yes.",
      hubSlug: "should-you-accept-a-cash-offer-stl",
      toolLink: "https://gkindler-help.github.io/cashofferexposed/"
    },
    "pricing": {
      title: "How to Price Your St. Louis Home to Sell",
      slug: "pricing",
      audience: "seller",
      description: "The strategy behind pricing that sells fast and nets more.",
      hubSlug: "how-to-price-your-stl-home",
      toolLink: null
    },
    "cash-offer-hub": {
      title: "Cash Offers in St. Louis, Decoded",
      slug: "cash-offer-hub",
      audience: "seller",
      description: "Investor math, contract mechanics, sales psychology, and local St. Louis seller situations -- the full cluster before accepting a cash offer.",
      hubSlug: "cash-offers-st-louis",
      toolLink: "/tools/cash-offer-decoder.html"
    },
    "school-districts": {
      title: "St. Louis School District Guides for Buyers",
      slug: "school-districts",
      audience: "buyer",
      description: "What buyers need to know about St. Louis school districts before they commit to a neighborhood -- boundaries, test scores, price premiums, and honest comparisons.",
      hubSlug: "school-districts",
      toolLink: null
    }
  },

  articles: [

    /* ── BOTH: ZILLOW SERIES ── */

    {
      slug: "truth-about-zillow-stl",
      title: "The Truth About Zillow: What St. Louis Buyers and Sellers Need to Know",
      shortTitle: "The Truth About Zillow",
      description: "Zillow is the most visited real estate platform in the country. It is also a lead generation business.",
      pillLabel: "The Truth About Zillow",
      audience: "both",
      series: "zillow",
      isHub: true,
      chapters: [2, 3],
      tags: ["zillow", "consumer-protection", "agents", "lead-gen"],
      toolLink: null,
      published: true
    },
    {
      slug: "zillow-pay-to-play-system",
      title: "How Zillow's Pay-to-Play System Works -- and What It Costs You",
      shortTitle: "Zillow Pay-to-Play Model",
      description: "Zillow charges agents per lead referral. That cost gets passed somewhere.",
      pillLabel: "How Zillow Makes Money",
      audience: "both",
      series: "zillow",
      isHub: false,
      chapters: [2],
      tags: ["zillow", "consumer-protection", "agents", "lead-gen", "commissions"],
      toolLink: null,
      published: true
    },
    {
      slug: "what-happens-when-you-click-zillow",
      title: "What Happens the Moment You Click on Zillow",
      shortTitle: "What Clicking Zillow Triggers",
      description: "The second you engage with a Zillow listing, a process starts that most buyers don't know about.",
      pillLabel: "What Zillow Does With Your Click",
      audience: "buyer",
      series: "zillow",
      isHub: false,
      chapters: [2],
      tags: ["zillow", "consumer-protection", "agents", "lead-gen"],
      toolLink: null,
      published: true
    },
    {
      slug: "zillow-zestimate-accurate-stl",
      title: "Is the Zillow Zestimate Accurate in St. Louis?",
      shortTitle: "Zillow Zestimate Accuracy STL",
      description: "The Zestimate is a starting point, not a valuation. Here's how far off it runs in the St. Louis market.",
      pillLabel: "Is the Zestimate Accurate?",
      audience: "both",
      series: "zillow",
      isHub: false,
      chapters: [2, 6],
      tags: ["zillow", "valuation", "zestimate", "data", "maris"],
      toolLink: null,
      published: true
    },
    {
      slug: "how-to-use-zillow-without-getting-used",
      title: "How to Use Zillow Without Getting Used by Zillow",
      shortTitle: "Using Zillow Smartly",
      description: "Zillow is useful. Just not in the ways most buyers think.",
      pillLabel: "Using Zillow Smartly",
      audience: "buyer",
      series: "zillow",
      isHub: false,
      chapters: [2, 3],
      tags: ["zillow", "consumer-protection", "strategy"],
      toolLink: null,
      published: true
    },

    /* ── BUYER: AFFORDABILITY SERIES ── */

    {
      slug: "stl-affordability-by-zip-code",
      title: "St. Louis Home Affordability by Zip Code",
      shortTitle: "Affordability by Zip Code",
      description: "Two homes at the same price can cost hundreds more per month depending on where they sit.",
      pillLabel: "Affordability by Zip",
      audience: "buyer",
      series: "affordability",
      isHub: true,
      chapters: [1, 2],
      tags: ["affordability", "budget", "zip-codes", "property-tax", "tools"],
      toolLink: "https://gkindler-help.github.io/buyeraffordabilityheatmap/",
      published: true
    },
    {
      slug: "how-much-income-to-buy-home-stl",
      title: "How Much Income Do You Need to Buy a Home in St. Louis?",
      shortTitle: "Income Required to Buy in STL",
      description: "Your lender's approval number and your real affordability number are not the same.",
      pillLabel: "Income to Buy in STL",
      audience: "buyer",
      series: "affordability",
      isHub: false,
      chapters: [1, 2],
      tags: ["affordability", "budget", "income", "first-time-buyer", "mortgage"],
      toolLink: "https://gkindler-help.github.io/buyeraffordabilityheatmap/",
      published: true
    },
    {
      slug: "renting-vs-buying-stl",
      title: "Renting vs. Buying a Home in St. Louis: What the Numbers Actually Show",
      shortTitle: "Rent vs. Buy in STL",
      description: "The rent vs. buy decision in St. Louis is not as simple as comparing monthly payments.",
      pillLabel: "Rent vs. Buy in STL",
      audience: "buyer",
      series: "affordability",
      isHub: false,
      chapters: [1],
      tags: ["affordability", "renting", "first-time-buyer", "decision"],
      toolLink: null,
      published: true
    },
    {
      slug: "first-time-buyer-programs-stl",
      title: "First-Time Home Buyer Programs in St. Louis: What's Actually Available",
      shortTitle: "First-Time Buyer Programs STL",
      description: "Down payment assistance, grants, and loan programs for St. Louis buyers.",
      pillLabel: "First-Time Buyer Programs",
      audience: "buyer",
      series: "affordability",
      isHub: false,
      chapters: [1, 2],
      tags: ["affordability", "first-time-buyer", "down-payment", "programs", "fha", "va"],
      toolLink: null,
      published: true
    },
    {
      slug: "most-affordable-zip-codes-stl-2026",
      title: "Most Affordable Zip Codes in St. Louis Right Now (2026 Data)",
      shortTitle: "Most Affordable Zip Codes STL",
      description: "Where your dollar goes furthest in St. Louis right now -- ranked by real monthly cost.",
      pillLabel: "Most Affordable Zip Codes",
      audience: "buyer",
      series: "affordability",
      isHub: false,
      chapters: [2],
      tags: ["affordability", "zip-codes", "budget", "neighborhoods", "data"],
      toolLink: "https://gkindler-help.github.io/buyeraffordabilityheatmap/",
      published: true
    },

    /* ── BUYER: MOVE-IN READY PRICING ── */

    {
      slug: "average-price-move-in-ready-home-st-louis",
      title: "What's the Average Price of a Move-In Ready Home in St. Louis? (And What Buyers Usually Get Wrong)",
      shortTitle: "Move-In Ready Home Prices in St. Louis",
      description: "Real sold data by area — South County, St. Charles, South City, West County. What move-in ready actually costs and the tradeoffs buyers learn too late.",
      pillLabel: "Market Pricing",
      audience: "buyer",
      series: "fixer-upper",
      isHub: false,
      chapters: [2, 3, 4],
      tags: ["move-in-ready", "pricing", "neighborhoods", "south-county", "st-charles", "relocation", "first-time-buyer", "va-buyer"],
      published: true
    },

    /* ── BUYER: REPAIR COST GUIDE SERIES ── */

    {
      slug: "fixer-upper-vs-move-in-ready-st-louis",
      title: "Fixer Upper vs. Move-In Ready in St. Louis: The Real Math by Neighborhood",
      shortTitle: "Fixer Upper vs. Move-In Ready",
      description: "St. Louis has the largest fixer upper price gap in the country — 64% below move-in ready. But renovation costs and financing change everything.",
      pillLabel: "Fixer Upper Guide",
      audience: "buyer",
      series: "fixer-upper",
      isHub: true,
      chapters: [3, 4, 5],
      tags: ["fixer-upper", "renovation", "financing", "fha-203k", "homestyle", "neighborhoods", "tools"],
      toolLink: "../fixer-upper-vs-move-in",
      published: true
    },
    {
      slug: "stl-home-repair-cost-guide",
      title: "St. Louis Home Repair Cost Guide for Buyers: Know Before You Offer",
      shortTitle: "Home Repair Cost Guide",
      description: "Most buyers make an offer based on how a home feels. This guide exists to fix that.",
      pillLabel: "Repair Cost Guide",
      audience: "buyer",
      series: "repair-guide",
      isHub: true,
      chapters: [4, 5],
      tags: ["inspection", "repair-costs", "negotiation", "offer", "tools"],
      toolLink: null,
      published: true
    },
    {
      slug: "what-to-look-for-buying-house-stl",
      title: "What to Look For When Buying a House in St. Louis (Walkthrough Checklist)",
      shortTitle: "Walkthrough Checklist",
      description: "The items that cost tens of thousands are the ones most buyers walk right past.",
      pillLabel: "Walkthrough Checklist",
      audience: "buyer",
      series: "repair-guide",
      isHub: false,
      chapters: [4, 5],
      tags: ["inspection", "walkthrough", "repair-costs", "checklist", "hvac", "basement", "roof"],
      toolLink: null,
      published: true
    },
    {
      slug: "repair-costs-affect-offer-price-stl",
      title: "How Repair Costs Should Affect Your Offer Price in St. Louis",
      shortTitle: "Repair Costs and Your Offer",
      description: "How to turn a repair estimate into a defensible offer number.",
      pillLabel: "Repair Costs and Your Offer",
      audience: "buyer",
      series: "repair-guide",
      isHub: false,
      chapters: [5, 6],
      tags: ["negotiation", "offer", "repair-costs", "inspection"],
      toolLink: null,
      published: true
    },
    {
      slug: "home-inspection-st-louis",
      title: "What Happens at a Home Inspection in St. Louis",
      shortTitle: "What Happens at an Inspection",
      description: "What to expect, what the inspector checks, and what to do with the results.",
      pillLabel: "Home Inspection in STL",
      audience: "buyer",
      series: "repair-guide",
      isHub: false,
      chapters: [5],
      tags: ["inspection", "process", "what-to-expect"],
      toolLink: null,
      published: true
    },
    {
  slug: "st-louis-home-price-reduction-negotiation",
  title: "How a St. Louis Home Sat 90 Days -- And My Buyer Got $30,000 Off Before Inspections",
  shortTitle: "$30K Off Before Inspections: Case Study",
  description: "A verified St. Louis case study -- roof, foundation, 90 days on market, two failed contracts, and a $30,000 reduction before inspections started.",
  pillLabel: "The $30K Case Study",
  audience: "buyer",
  series: "repair-guide",
  isHub: false,
  chapters: [3, 5],
  tags: ["negotiation", "days-on-market", "inspection", "price-reduction", "case-study", "st-louis-city", "repair-costs", "red-flags"],
  toolLink: null,
  published: true
    },

    /* ── BUYER: VA LOAN SERIES ── */

    {
      slug: "va-home-loan-st-louis-what-kills-deals",
      title: "VA Home Loan in St. Louis: What Kills Deals (And How I Screen Properties)",
      shortTitle: "VA Loans: What Kills Deals",
      description: "From a Marine Corps veteran who's closed VA loans in St. Louis: the property issues, appraisal traps, and deal-killers I screen for before my veteran buyers make an offer.",
      pillLabel: "What Kills VA Deals",
      audience: "buyer",
      series: "va-buyer",
      isHub: true,
      chapters: [1, 2],
      tags: ["va-loan", "appraisal", "veteran", "inspection", "electrical", "deal-killers"],
      toolLink: null,
      published: true
    },
    {
      slug: "federal-pacific-panel-va-loan-st-louis",
      title: "Federal Pacific Panels and VA Loans in St. Louis: The $3,500 Deal-Killer",
      shortTitle: "Federal Pacific Panels VA",
      description: "Federal Pacific Stab-Lok panels are in thousands of St. Louis homes. VA appraisers flag them on sight. Here is what it costs to replace and why it kills VA deals.",
      pillLabel: "The FPE Panel Deal-Killer",
      audience: "buyer",
      series: "va-buyer",
      isHub: false,
      chapters: [1, 2],
      tags: ["va-loan", "appraisal", "electrical", "federal-pacific", "deal-killer", "south-county", "north-county"],
      toolLink: null,
      published: true
    },
    {
      slug: "can-you-buy-fixer-upper-va-loan-st-louis",
      title: "Can You Buy a Fixer-Upper with a VA Loan in St. Louis? The Honest Answer",
      shortTitle: "Fixer-Uppers and VA Loans",
      description: "The VA loan requires move-in ready condition. VA renovation loans are rare in St. Louis. Here is what fixer-upper actually means for VA buyers.",
      pillLabel: "VA Loans and Fixer-Uppers",
      audience: "buyer",
      series: "va-buyer",
      isHub: false,
      chapters: [1, 3],
      tags: ["va-loan", "fixer-upper", "renovation", "as-is", "appraisal"],
      toolLink: null,
      published: true
    },
    {
      slug: "va-appraisal-failed-st-louis-what-happens-next",
      title: "VA Appraisal Failed in St. Louis: What Happens Next (And Your 3 Options)",
      shortTitle: "VA Appraisal Failed: Your Options",
      description: "The VA appraisal came back with conditions. The seller will not fix them. Here are your three options and what happens to your earnest money.",
      pillLabel: "When VA Appraisal Fails",
      audience: "buyer",
      series: "va-buyer",
      isHub: false,
      chapters: [5, 6],
      tags: ["va-loan", "appraisal", "earnest-money", "contingency", "termination"],
      toolLink: null,
      published: true
    },
    {
      slug: "how-to-screen-stl-homes-before-va-offer",
      title: "How to Screen St. Louis Homes Before You Make a VA Offer",
      shortTitle: "Pre-Offer VA Screening",
      description: "The exact screening checklist I use to identify VA appraisal issues before my veteran buyers write an offer. No surprises. No failed deals.",
      pillLabel: "VA Pre-Offer Checklist",
      audience: "buyer",
      series: "va-buyer",
      isHub: false,
      chapters: [1, 4],
      tags: ["va-loan", "appraisal", "checklist", "screening", "inspection", "electrical", "roof", "foundation"],
      toolLink: null,
      published: true
    },

    /* ── BUYER: REPRESENTATION SERIES ── */

    {
      slug: "do-i-need-a-buyers-agent-stl",
      title: "Do You Actually Need a Buyer's Agent in St. Louis?",
      shortTitle: "Do I Need a Buyer's Agent?",
      description: "The honest answer to whether you need a buyer's agent -- what representation costs and what it gets you.",
      pillLabel: "Do I Need a Buyer's Agent?",
      audience: "buyer",
      series: "representation",
      isHub: true,
      chapters: [1, 2],
      tags: ["agents", "representation", "nar-settlement", "consumer-protection"],
      toolLink: null,
      published: true
    },
    {
      slug: "what-buyer-agent-actually-does-stl",
      title: "What a Buyer's Agent Actually Does -- and What Most of Them Don't",
      shortTitle: "What a Buyer's Agent Does",
      description: "The fiduciary duty, the pre-showing prep, the offer strategy, the inspection negotiation.",
      pillLabel: "What a Buyer's Agent Does",
      audience: "buyer",
      series: "representation",
      isHub: false,
      chapters: [2, 5],
      tags: ["agents", "representation", "fiduciary", "consumer-protection"],
      toolLink: null,
      published: true
    },
    {
      slug: "how-to-interview-buyers-agent-stl",
      title: "How to Interview a Buyer's Agent in St. Louis (The 7 Questions That Matter)",
      shortTitle: "How to Interview a Buyer's Agent",
      description: "The seven questions that reveal exactly who you are dealing with before you sign anything.",
      pillLabel: "Interview Your Agent",
      audience: "buyer",
      series: "representation",
      isHub: false,
      chapters: [2],
      tags: ["agents", "representation", "zillow", "consumer-protection", "nar-settlement"],
      toolLink: null,
      published: true
    },
    {
      slug: "red-flags-bad-buyer-agent-stl",
      title: "Red Flags: How to Spot a Bad Buyer's Agent in St. Louis Before It Costs You",
      shortTitle: "Red Flags: Bad Buyer's Agent",
      description: "The warning signs of a bad buyer's agent -- pressure tactics, the handoff, dual agency.",
      pillLabel: "Red Flags: Bad Agent",
      audience: "buyer",
      series: "representation",
      isHub: false,
      chapters: [2],
      tags: ["agents", "representation", "zillow", "consumer-protection", "red-flags"],
      toolLink: null,
      published: true
    },
    {
      slug: "nar-settlement-buyer-representation-stl",
      title: "What the NAR Settlement Changed for St. Louis Buyers -- and What It Didn't",
      shortTitle: "NAR Settlement for Buyers",
      description: "What the August 2024 NAR settlement actually changed and what it means for your negotiation.",
      pillLabel: "NAR Settlement Explained",
      audience: "buyer",
      series: "representation",
      isHub: false,
      chapters: [2, 9],
      tags: ["agents", "representation", "nar-settlement", "commissions", "consumer-protection"],
      toolLink: null,
      published: true
    },

    /* ── BUYER: MORTGAGE AND FINANCING SERIES ── */

    {
      slug: "mortgage-pre-approval-st-louis",
      title: "How to Get Pre-Approved for a Mortgage in St. Louis: What Buyers Need to Know First",
      shortTitle: "Mortgage Pre-Approval in STL",
      description: "What mortgage pre-approval actually means, what documents you need, and what lenders do not tell you.",
      pillLabel: "Mortgage Pre-Approval",
      audience: "buyer",
      series: "mortgage",
      isHub: true,
      chapters: [1, 2],
      tags: ["mortgage", "pre-approval", "financing", "first-time-buyer", "lender"],
      toolLink: null,
      published: true
    },
    {
      slug: "conventional-vs-fha-loan-st-louis",
      title: "Conventional vs. FHA Loan in St. Louis: Which One Is Right for You?",
      shortTitle: "Conventional vs. FHA in STL",
      description: "How conventional and FHA loans compare -- and how loan type affects your offer on older St. Louis housing stock.",
      pillLabel: "Conventional vs. FHA",
      audience: "buyer",
      series: "mortgage",
      isHub: false,
      chapters: [1, 2],
      tags: ["mortgage", "fha", "conventional", "financing", "loan-type"],
      toolLink: null,
      published: true
    },
    {
      slug: "credit-score-buy-home-st-louis",
      title: "What Credit Score Do You Need to Buy a Home in St. Louis?",
      shortTitle: "Credit Score to Buy in STL",
      description: "Minimum credit scores for each loan type and what the difference between scores costs you over 30 years.",
      pillLabel: "Credit Score to Buy",
      audience: "buyer",
      series: "mortgage",
      isHub: false,
      chapters: [1],
      tags: ["mortgage", "credit-score", "financing", "fha", "conventional"],
      toolLink: null,
      published: true
    },
    {
      slug: "how-much-down-payment-st-louis",
      title: "How Much Down Payment Do You Need to Buy a Home in St. Louis?",
      shortTitle: "Down Payment in STL",
      description: "Real down payment requirements by loan type, what assistance covers, and what you need beyond the down payment.",
      pillLabel: "Down Payment in STL",
      audience: "buyer",
      series: "mortgage",
      isHub: false,
      chapters: [1, 2],
      tags: ["mortgage", "down-payment", "financing", "first-time-buyer", "programs"],
      toolLink: null,
      published: true
    },
    {
      slug: "buyer-closing-costs-st-louis",
      title: "Buyer Closing Costs in St. Louis: What You'll Actually Pay",
      shortTitle: "Buyer Closing Costs STL",
      description: "The full line-item breakdown of buyer closing costs -- lender fees, title, prepaid items, and what sellers can cover.",
      pillLabel: "Buyer Closing Costs",
      audience: "buyer",
      series: "mortgage",
      isHub: false,
      chapters: [9],
      tags: ["mortgage", "closing-costs", "financing", "title", "seller-concessions"],
      toolLink: null,
      published: true
    },

    /* ── BUYER: NEIGHBORHOOD GUIDES SERIES ── */


    {
      slug: "south-county-stl-neighborhood-guide",
      title: "South County St. Louis Neighborhood Guide: The Full Buyer Overview",
      shortTitle: "South County Neighborhood Guide",
      description: "South St. Louis County covers 9 communities from Lemay to Sunset Hills -- price tiers, school districts, market speed, and which neighborhood fits which buyer.",
      pillLabel: "South County Guide",
      audience: "buyer",
      series: "neighborhoods",
      isHub: true,
      chapters: [2, 3],
      tags: ["neighborhoods", "south-county", "buyer-guide", "schools", "price-tiers", "market-speed"],
      toolLink: null,
      published: true
    },
    {
      slug: "south-county-stl-neighborhoods-by-price",
      title: "South County St. Louis Neighborhoods by Price: From $152K to $523K",
      shortTitle: "South County by Price",
      description: "South St. Louis County spans a $370,000 price range across 9 neighborhoods -- mapped by median value, market speed, and what your budget gets you.",
      pillLabel: "South County by Price",
      audience: "buyer",
      series: "neighborhoods",
      isHub: false,
      chapters: [2, 3],
      tags: ["neighborhoods", "south-county", "prices", "affordability", "budget", "market-speed"],
      toolLink: null,
      published: true
    },
    {
      slug: "mehlville-vs-oakville-vs-concord-stl",
      title: "Mehlville vs. Oakville vs. Concord: Which South County Suburb Is Right for You?",
      shortTitle: "Mehlville vs. Oakville vs. Concord",
      description: "Mehlville, Oakville, and Concord are South County's three most-searched communities -- compared on price, schools, market speed, and what buyers find when they show up.",
      pillLabel: "Mehlville vs. Oakville vs. Concord",
      audience: "buyer",
      series: "neighborhoods",
      isHub: false,
      chapters: [2, 3],
      tags: ["neighborhoods", "south-county", "mehlville", "oakville", "concord", "schools", "price-comparison"],
      toolLink: null,
      published: true
    },
    {
      slug: "lindbergh-vs-mehlville-school-district-stl",
      title: "Lindbergh vs. Mehlville School District: What South County Buyers Need to Know",
      shortTitle: "Lindbergh vs. Mehlville Schools",
      description: "Both districts serve South St. Louis County -- but which block you buy on determines which district you're in. What buyers need to know before they offer.",
      pillLabel: "Lindbergh vs. Mehlville Schools",
      audience: "buyer",
      series: "neighborhoods",
      isHub: false,
      chapters: [2, 3],
      tags: ["neighborhoods", "schools", "south-county", "lindbergh", "mehlville", "district"],
      toolLink: null,
      published: true
    },

    {
      slug: "buying-a-home-in-oakville-mo",
      title: "Buying in Oakville MO: What the $318K Median Doesn't Tell You",
      shortTitle: "Buying in Oakville MO",
      description: "Oakville is 15.88 square miles -- and the southwest side is not the same market as the west. What buyers miss before searching South County's biggest community.",
      pillLabel: "Buying in Oakville",
      audience: "buyer",
      series: "neighborhoods",
      isHub: false,
      chapters: [2, 3],
      tags: ["neighborhoods", "south-county", "oakville", "buyer-guide", "market-speed"],
      toolLink: null,
      published: true
    },
    {
      slug: "average-price-reduction-after-inspection-st-louis",
      title: "How My Buyer Got $30,000 Off Before Inspections Even Started",
      shortTitle: "$30K Off Before Inspections: Case Study",
      description: "90 days on market. Two failed contracts. Roof and foundation issues. Real case study showing exactly how a $30K price reduction happened -- and the math behind it.",
      pillLabel: "The $30K Case Study",
      audience: "buyer",
      series: "repair-guide",
      isHub: false,
      chapters: [3, 5],
      tags: ["negotiation", "days-on-market", "inspection", "price-reduction", "case-study", "repair-costs"],
      toolLink: null,
      published: true
    },

        /* ── BUYER: SCHOOL DISTRICTS SERIES ── */

    {
      slug: "affton-school-district",
      title: "Affton School District: Test Scores, Boundaries, and What Buyers Need to Know",
      shortTitle: "Affton School District",
      description: "What buyers need to know about Affton School District -- test scores, boundaries, and communities served.",
      pillLabel: "Affton Schools",
      audience: "buyer",
      series: "school-districts",
      path: "school-districts",
      isHub: false,
      chapters: [2, 3],
      tags: ["schools", "school-districts", "affton", "south-county"],
      toolLink: null,
      published: true
    },
    {
      slug: "clayton-school-district",
      title: "Clayton School District: Test Scores, Boundaries, and What Buyers Need to Know",
      shortTitle: "Clayton School District",
      description: "What buyers need to know about Clayton School District -- test scores, boundaries, and communities served.",
      pillLabel: "Clayton Schools",
      audience: "buyer",
      series: "school-districts",
      path: "school-districts",
      isHub: false,
      chapters: [2, 3],
      tags: ["schools", "school-districts", "clayton", "central-corridor"],
      toolLink: null,
      published: true
    },
    {
      slug: "kirkwood-school-district",
      title: "Kirkwood School District: Test Scores, Boundaries, and What Buyers Need to Know",
      shortTitle: "Kirkwood School District",
      description: "What buyers need to know about Kirkwood School District -- test scores, boundaries, and communities served.",
      pillLabel: "Kirkwood Schools",
      audience: "buyer",
      series: "school-districts",
      path: "school-districts",
      isHub: false,
      chapters: [2, 3],
      tags: ["schools", "school-districts", "kirkwood", "south-county"],
      toolLink: null,
      published: true
    },
    {
      slug: "ladue-school-district",
      title: "Ladue School District: Test Scores, Boundaries, and What Buyers Need to Know",
      shortTitle: "Ladue School District",
      description: "What buyers need to know about Ladue School District -- test scores, boundaries, and communities served.",
      pillLabel: "Ladue Schools",
      audience: "buyer",
      series: "school-districts",
      path: "school-districts",
      isHub: false,
      chapters: [2, 3],
      tags: ["schools", "school-districts", "ladue", "west-county"],
      toolLink: null,
      published: true
    },
    {
      slug: "lindbergh-schools",
      title: "Lindbergh Schools: Test Scores, Boundaries, and What Buyers Need to Know",
      shortTitle: "Lindbergh Schools",
      description: "What buyers need to know about Lindbergh Schools -- test scores, boundaries, and communities served.",
      pillLabel: "Lindbergh Schools",
      audience: "buyer",
      series: "school-districts",
      path: "school-districts",
      isHub: false,
      chapters: [2, 3],
      tags: ["schools", "school-districts", "lindbergh", "south-county"],
      toolLink: null,
      published: true
    },
    {
      slug: "mehlville-school-district",
      title: "Mehlville School District: Test Scores, Boundaries, and What Buyers Need to Know",
      shortTitle: "Mehlville School District",
      description: "What buyers need to know about Mehlville School District -- test scores, boundaries, and communities served.",
      pillLabel: "Mehlville Schools",
      audience: "buyer",
      series: "school-districts",
      path: "school-districts",
      isHub: false,
      chapters: [2, 3],
      tags: ["schools", "school-districts", "mehlville", "south-county"],
      toolLink: null,
      published: true
    },
    {
      slug: "parkway-school-district",
      title: "Parkway School District: Test Scores, Boundaries, and What Buyers Need to Know",
      shortTitle: "Parkway School District",
      description: "What buyers need to know about Parkway School District -- test scores, boundaries, and communities served.",
      pillLabel: "Parkway Schools",
      audience: "buyer",
      series: "school-districts",
      path: "school-districts",
      isHub: false,
      chapters: [2, 3],
      tags: ["schools", "school-districts", "parkway", "west-county"],
      toolLink: null,
      published: true
    },
    {
      slug: "rockwood-school-district",
      title: "Rockwood School District: Test Scores, Boundaries, and What Buyers Need to Know",
      shortTitle: "Rockwood School District",
      description: "What buyers need to know about Rockwood School District -- test scores, boundaries, and communities served.",
      pillLabel: "Rockwood Schools",
      audience: "buyer",
      series: "school-districts",
      path: "school-districts",
      isHub: false,
      chapters: [2, 3],
      tags: ["schools", "school-districts", "rockwood", "west-county"],
      toolLink: null,
      published: true
    },
    {
      slug: "webster-groves-school-district",
      title: "Webster Groves School District: Test Scores, Boundaries, and What Buyers Need to Know",
      shortTitle: "Webster Groves School District",
      description: "What buyers need to know about Webster Groves School District -- test scores, boundaries, and communities served.",
      pillLabel: "Webster Groves Schools",
      audience: "buyer",
      series: "school-districts",
      path: "school-districts",
      isHub: false,
      chapters: [2, 3],
      tags: ["schools", "school-districts", "webster-groves", "central-corridor"],
      toolLink: null,
      published: true
    },

    /* ── SELLER STUBS -- published: false until seller journey launches ── */

    {
      slug: "stl-home-seller-guides",
      title: "St. Louis Home Seller Guides: Know What You'll Net",
      shortTitle: "Seller Guides Hub",
      description: "The real numbers behind selling a home in St. Louis.",
      pillLabel: "Seller Guides",
      audience: "seller",
      series: "seller-net",
      isHub: true,
      chapters: [],
      tags: ["selling", "net-proceeds", "commissions", "costs"],
      toolLink: null,
      published: false
    },
    {
      slug: "what-will-i-net-selling-stl",
      title: "What Will I Net Selling My St. Louis Home?",
      shortTitle: "Your Net Proceeds in STL",
      description: "The number sellers actually care about -- what's left after commissions and closing costs.",
      pillLabel: "What You'll Net Selling",
      audience: "seller",
      series: "seller-net",
      isHub: false,
      chapters: [],
      tags: ["selling", "net-proceeds", "costs", "commissions"],
      toolLink: null,
      published: true
    },
    {
      slug: "cost-to-sell-home-stl",
      title: "What Does It Actually Cost to Sell a Home in St. Louis?",
      shortTitle: "Real Cost to Sell in STL",
      description: "Every cost that comes out before you see a dollar -- fees, title, staging, repairs, closing.",
      pillLabel: "Cost to Sell in STL",
      audience: "seller",
      series: "seller-net",
      isHub: false,
      chapters: [],
      tags: ["selling", "costs", "commissions", "closing"],
      toolLink: null,
      published: true
    },
    {
      slug: "who-pays-buyer-agent-commission-stl",
      title: "Who Pays the Buyer's Agent Commission in St. Louis Now?",
      shortTitle: "Buyer Agent Commission Rules STL",
      description: "The NAR settlement changed the rules. Here's what sellers in St. Louis actually need to know.",
      pillLabel: "Buyer Commission Rules STL",
      audience: "seller",
      series: "seller-net",
      isHub: false,
      chapters: [],
      tags: ["selling", "commissions", "nar-settlement", "buyer-agent"],
      toolLink: null,
      published: true
    },
    {
      slug: "should-you-accept-cash-offer-stl",
      title: "Should You Accept a Cash Offer in St. Louis?",
      shortTitle: "Should You Take the Cash Offer?",
      description: "Cash offers close fast. They also usually come in well below market value. Here's how to decide.",
      pillLabel: "Cash Offer: Worth It?",
      audience: "seller",
      series: "cash-offer",
      isHub: true,
      chapters: [],
      tags: ["selling", "cash-offer", "investor", "consumer-protection"],
      toolLink: "https://gkindler-help.github.io/cashofferexposed/",
      published: true
    },
    {
      slug: "how-cash-buyers-calculate-offers-stl",
      title: "How Cash Buyers Calculate Offers in St. Louis",
      shortTitle: "How Cash Buyers Price Their Offers",
      description: "The actual math -- ARV, renovation budget, holding costs, and the profit margin baked in before they call.",
      pillLabel: "How Cash Buyers Price Offers",
      audience: "seller",
      series: "cash-offer",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "investor", "arv", "consumer-protection"],
      toolLink: "https://gkindler-help.github.io/cashofferexposed/",
      published: true
    },
    {
      slug: "what-you-lose-with-cash-offer-stl",
      title: "What Do You Lose With a Cash Offer in St. Louis?",
      shortTitle: "Real Cost of a Cash Offer",
      description: "The convenience premium on a cash offer -- calculated in dollars, not vague warnings.",
      pillLabel: "Real Cost of a Cash Offer",
      audience: "seller",
      series: "cash-offer",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "investor", "consumer-protection", "costs"],
      toolLink: "https://gkindler-help.github.io/cashofferexposed/",
      published: true
    },
    {
      slug: "how-to-price-stl-home",
      title: "How to Price Your St. Louis Home to Sell in One Weekend",
      shortTitle: "How to Price Your Home",
      description: "The strategy behind pricing that actually works.",
      pillLabel: "How to Price Your Home",
      audience: "seller",
      series: "pricing",
      isHub: true,
      chapters: [],
      tags: ["selling", "pricing", "strategy", "days-on-market"],
      toolLink: null,
      published: false
    },
    {
      slug: "why-most-stl-homes-priced-wrong",
      title: "Why Most St. Louis Homes Are Priced Wrong",
      shortTitle: "Why Homes Are Priced Wrong",
      description: "Overpriced homes sit. Underpriced homes leave money on the table.",
      pillLabel: "Why Homes Are Priced Wrong",
      audience: "seller",
      series: "pricing",
      isHub: false,
      chapters: [],
      tags: ["selling", "pricing", "days-on-market", "strategy"],
      toolLink: null,
      published: false
    },
    {
      slug: "best-time-to-list-stl",
      title: "Best Time to List Your Home in St. Louis",
      shortTitle: "Best Time to List in STL",
      description: "St. Louis has clear seasonal patterns. Here's when the data says to list.",
      pillLabel: "Best Time to List in STL",
      audience: "seller",
      series: "pricing",
      isHub: false,
      chapters: [],
      tags: ["selling", "timing", "data", "seasonal", "pricing"],
      toolLink: null,
      published: false
    },
    {
      slug: "what-not-to-repair-before-selling-stl-pricing-strategy",
      title: "5 Expensive St. Louis Home Repairs That Won't Help You Sell (Price It Right Instead)",
      description: "Don't waste $20K on repairs hoping to sell for more. Learn the first-weekend pricing strategy that gets St. Louis homes under contract in 3 days—often over asking price, with no inspection drama.",
      pillLabel: "What NOT to Repair Before Selling",
      audience: "seller",
      series: "pricing",
      isHub: false,
      chapters: [],
      tags: ["selling", "repairs", "pricing", "strategy", "competition"],
      toolLink: "https://stlhomejourney.com/tools/cash-offer-decoder",
      published: true
    },
    {
      slug: "selling-home-south-st-louis-county",
      title: "Selling Your Home in South St. Louis County — The Complete Guide",
      description: "Based on 743 South County sales across Oakville, Crestwood, Concord, Affton, and Sappington: market velocity data, school district premiums, pricing by square footage, and the first-weekend strategy that works.",
      pillLabel: "South County Selling Guide",
      audience: "seller",
      series: "area-guides",
      isHub: false,
      chapters: [],
      tags: ["south-county", "selling", "market-data", "oakville", "crestwood", "concord", "affton", "sappington", "pricing", "school-districts"],
      toolLink: "https://stlhomejourney.com/tools/cash-offer-decoder",
      published: true
    },
    {
      slug: "how-much-house-afford-making-50k-st-louis",
      title: "How Much House Can You Afford Making $50K in St. Louis?",
      description: "On a $50K salary, you can afford $160K-$180K homes in Affton, North County, and South City. Real PITI breakdown with St. Louis property taxes.",
      pillLabel: "Affordability on $50K Salary",
      audience: "buyer",
      series: "income-guides",
      isHub: false,
      chapters: [2],
      tags: ["affordability", "income", "salary", "budget", "first-time-buyer", "affton", "north-county"],
      toolLink: "https://stlhomejourney.com/afford.html",
      published: true
    },
    {
      slug: "how-much-house-afford-making-60k-st-louis",
      title: "How Much House Can You Afford Making $60K in St. Louis?",
      description: "On a $60K salary, you can afford $200K-$220K homes in Oakville, Florissant, and Arnold. Real numbers using actual St. Louis taxes.",
      pillLabel: "Affordability on $60K Salary",
      audience: "buyer",
      series: "income-guides",
      isHub: false,
      chapters: [2],
      tags: ["affordability", "income", "salary", "budget", "oakville", "florissant", "arnold"],
      toolLink: "https://stlhomejourney.com/afford.html",
      published: true
    },
    {
      slug: "how-much-house-afford-making-70k-st-louis",
      title: "How Much House Can You Afford Making $70K in St. Louis? (Real Numbers)",
      description: "On a $70K salary in St. Louis, you can afford a $230K-$260K home depending on debt and down payment. Real PITI breakdown using actual St. Louis property taxes, plus neighborhoods that fit your budget.",
      pillLabel: "Affordability on $70K Salary",
      audience: "buyer",
      series: "income-guides",
      isHub: false,
      chapters: [2],
      tags: ["affordability", "income", "salary", "budget", "oakville", "affton", "arnold", "first-time-buyer", "mortgage"],
      toolLink: "https://stlhomejourney.com/afford.html",
      published: true
    },
    {
      slug: "how-much-house-afford-making-80k-st-louis",
      title: "How Much House Can You Afford Making $80K in St. Louis?",
      description: "On an $80K salary, you can afford $265K-$300K homes in Crestwood, Imperial, and Fenton. Access to Lindbergh Schools.",
      pillLabel: "Affordability on $80K Salary",
      audience: "buyer",
      series: "income-guides",
      isHub: false,
      chapters: [2],
      tags: ["affordability", "income", "salary", "budget", "crestwood", "imperial", "fenton", "lindbergh"],
      toolLink: "https://stlhomejourney.com/afford.html",
      published: true
    },
    {
      slug: "how-much-house-afford-making-100k-st-louis",
      title: "How Much House Can You Afford Making $100K in St. Louis?",
      description: "On a $100K salary, you can afford $330K-$375K homes in Crestwood, Concord, and St. Charles. Lindbergh Schools within reach.",
      pillLabel: "Affordability on $100K Salary",
      audience: "buyer",
      series: "income-guides",
      isHub: false,
      chapters: [2],
      tags: ["affordability", "income", "salary", "budget", "crestwood", "concord", "st-charles", "lindbergh"],
      toolLink: "https://stlhomejourney.com/afford.html",
      published: true
    },
    {
      slug: "how-much-house-afford-making-120k-st-louis",
      title: "How Much House Can You Afford Making $120K in St. Louis?",
      description: "On a $120K salary, you can afford $400K-$450K homes in Sappington, Ballwin, and Wildwood. Executive home territory.",
      pillLabel: "Affordability on $120K Salary",
      audience: "buyer",
      series: "income-guides",
      isHub: false,
      chapters: [2],
      tags: ["affordability", "income", "salary", "budget", "sappington", "ballwin", "wildwood", "executive"],
      toolLink: "https://stlhomejourney.com/afford.html",
      published: true
    },
    {
      slug: "how-much-house-afford-making-150k-st-louis",
      title: "How Much House Can You Afford Making $150K in St. Louis?",
      description: "On a $150K salary, you can afford $500K-$575K homes in Chesterfield, Creve Coeur, and Wildwood. Premium West County.",
      pillLabel: "Affordability on $150K Salary",
      audience: "buyer",
      series: "income-guides",
      isHub: false,
      chapters: [2],
      tags: ["affordability", "income", "salary", "budget", "chesterfield", "creve-coeur", "wildwood", "luxury"],
      toolLink: "https://stlhomejourney.com/afford.html",
      published: true
    },
    {
      slug: "how-much-house-afford-making-200k-st-louis",
      title: "How Much House Can You Afford Making $200K+ in St. Louis?",
      description: "On a $200K+ salary, you can afford $650K-$800K+ homes in Clayton, Ladue, and Wildwood estates. Top-tier St. Louis real estate.",
      pillLabel: "Affordability on $200K+ Salary",
      audience: "buyer",
      series: "income-guides",
      isHub: false,
      chapters: [2],
      tags: ["affordability", "income", "salary", "budget", "clayton", "ladue", "wildwood", "luxury", "high-end"],
      toolLink: "https://stlhomejourney.com/afford.html",
      published: true
    },

    /* ── SELLER: CASH OFFER HUB SERIES ── */
    {
      slug: "cash-offers-st-louis",
      title: "Cash Offers in St. Louis, Decoded",
      shortTitle: "Cash Offers Hub",
      description: "The master hub for St. Louis sellers evaluating cash offers: investor math, tradeoffs, sales psychology, and how to compare paths before you sign.",
      pillLabel: "Cash Offer Hub",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: true,
      chapters: [],
      tags: ["selling", "cash-offer", "investor", "consumer-protection", "seller-hub"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "cash-offer-vs-listing-st-louis",
      title: "Cash Offer vs Listing With a Realtor in St. Louis",
      shortTitle: "Cash Offer vs Listing",
      description: "Compare a direct cash sale, as-is MLS listing, and traditional retail listing to decide the right path for a St. Louis seller.",
      pillLabel: "Cash vs Listing",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "listing", "as-is", "mls"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "how-investors-calculate-cash-offers",
      title: "How Investors Calculate Cash Offers",
      shortTitle: "Investor Math Explained",
      description: "ARV, repair deductions, holding costs, resale costs, risk, and profit margin -- the full investor formula explained for St. Louis sellers.",
      pillLabel: "Investor Math",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "investor", "arv", "repairs"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "why-sellers-accept-lower-cash-offers",
      title: "Why Some Sellers Accept Lower Cash Offers",
      shortTitle: "Why Sellers Take Less",
      description: "The real reasons St. Louis sellers accept below-market cash offers: speed, certainty, inherited homes, vacancies, tenants, repairs, and family stress.",
      pillLabel: "Why Sellers Take Less",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "inherited", "vacant", "tenants", "convenience"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "why-investors-ask-why-selling",
      title: "Why Investors Ask Why Are You Selling?",
      shortTitle: "Why Investors Ask Why",
      description: "Understanding how investor conversations use motivation, urgency, and sales psychology to shape cash offers -- and how sellers can protect themselves.",
      pillLabel: "Sales Psychology",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "investor", "psychology", "negotiation"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "how-wholesaling-works-missouri",
      title: "How Wholesaling Works in Missouri",
      shortTitle: "Wholesaling Explained",
      description: "What wholesalers do, how assignment works, and what St. Louis sellers need to know before signing a contract with a buyer who may not be the final buyer.",
      pillLabel: "Wholesaling in Missouri",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "wholesaling", "assignment", "contract"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "assignment-contract-real-estate-missouri",
      title: "Assignment Contracts in Missouri Real Estate",
      shortTitle: "Assignment Contracts",
      description: "What assignment contracts mean for Missouri home sellers: who may actually close, the costs and risks, red flags to watch, and questions to ask before signing.",
      pillLabel: "Assignment Contracts",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "assignment", "contract", "wholesaling"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "proof-of-funds-cash-buyer-st-louis",
      title: "Proof of Funds for Cash Buyers in St. Louis",
      shortTitle: "Proof of Funds",
      description: "Why proof of funds matters before accepting a cash offer, what it should look like, and what it costs sellers who skip the verification step.",
      pillLabel: "Proof of Funds",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "proof-of-funds", "buyer-credibility", "closing"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "retrading-cash-offer-st-louis",
      title: "What Is Retrading in a Cash Offer?",
      shortTitle: "Retrading Explained",
      description: "Retrading is when a buyer lowers the price after inspection. What it looks like, how it happens, and how St. Louis sellers can protect themselves.",
      pillLabel: "Retrading Risk",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "retrading", "inspection", "price-reduction"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "questions-to-ask-cash-buyer-st-louis",
      title: "Questions to Ask a Cash Buyer Before You Sign",
      shortTitle: "Cash Buyer Checklist",
      description: "A practical St. Louis seller checklist: buyer identity, proof of funds, assignment, earnest money, inspection terms, closing date, and retrade risk.",
      pillLabel: "Seller Checklist",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "checklist", "questions", "consumer-protection"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "inherited-house-cash-offer-st-louis",
      title: "Inherited House Cash Offers in St. Louis",
      shortTitle: "Inherited House Cash Offers",
      description: "How to evaluate a cash offer on an inherited St. Louis home: comparing family relief against equity, local demand, and what the house could net on the open market.",
      pillLabel: "Inherited House",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "inherited", "estate", "family"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "sell-vacant-house-st-louis",
      title: "Selling a Vacant House in St. Louis",
      shortTitle: "Selling Vacant House",
      description: "Compare cash offers against as-is MLS options for vacant St. Louis homes -- weighing real carrying costs against discount size before you decide.",
      pillLabel: "Vacant House Sale",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "vacant", "carrying-costs", "as-is"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "sell-house-with-tenants-st-louis",
      title: "Selling a House With Tenants in St. Louis",
      shortTitle: "Selling With Tenants",
      description: "How tenant-occupied St. Louis rentals affect the cash-offer decision, investor demand, lease issues, and whether a private offer is leaving competition untapped.",
      pillLabel: "Selling With Tenants",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "tenants", "rental", "landlord"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "south-county-cash-offers",
      title: "South County Cash Offers",
      shortTitle: "South County Cash Offers",
      description: "Cash offers in Oakville, Mehlville, Affton, Lemay, Concord, and nearby South County communities compared against local buyer demand and as-is MLS alternatives.",
      pillLabel: "South County",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "south-county", "oakville", "mehlville", "affton"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    },
    {
      slug: "oakville-cash-offer-guide",
      title: "Oakville Cash Offer Guide",
      shortTitle: "Oakville Cash Offers",
      description: "Hyperlocal guide for Oakville sellers comparing investor math against Oakville buyer demand, school district pull, and as-is MLS alternatives before signing.",
      pillLabel: "Oakville",
      audience: "seller",
      series: "cash-offer-hub",
      isHub: false,
      chapters: [],
      tags: ["selling", "cash-offer", "oakville", "south-county", "local"],
      toolLink: "/tools/cash-offer-decoder.html",
      published: true
    }

  ],

  /* ── HELPER METHODS ── */

  getByAudience: function(audience) {
    if (audience === "all") {
      return this.articles.filter(function(a) { return a.published; });
    }
    return this.articles.filter(function(a) {
      return a.published && (a.audience === audience || a.audience === "both");
    });
  },

  getByChapter: function(chapter) {
    return this.articles.filter(function(a) {
      return a.published && a.chapters.indexOf(chapter) !== -1;
    });
  },

  getBySeries: function(seriesSlug) {
    return this.articles.filter(function(a) {
      return a.published && a.series === seriesSlug;
    });
  },

  getBySlug: function(slug) {
    var found = this.articles.filter(function(a) { return a.slug === slug; });
    return found.length ? found[0] : null;
  },

  getByTag: function(tag) {
    return this.articles.filter(function(a) {
      return a.published && a.tags.indexOf(tag) !== -1;
    });
  },

  getTagsForAudience: function(audience) {
    var articles = this.getByAudience(audience);
    var tagMap = {};
    articles.forEach(function(a) {
      a.tags.forEach(function(t) { tagMap[t] = true; });
    });
    return Object.keys(tagMap).sort();
  }

};
