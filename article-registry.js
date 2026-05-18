/* article-registry.js
   Single source of truth for all STL Home Journey articles.
   ASCII-safe only -- no curly quotes, no smart apostrophes, no em dashes.
   ES5 compatible -- no spread operator, no shorthand methods.
   Version 1.1.1 -- added Neighborhood Guides series
*/

window.ARTICLE_REGISTRY = {

  version: "1.1.2",

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

    /* ── BUYER: REPAIR COST GUIDE SERIES ── */

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
      published: false
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
      published: false
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
      published: false
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
      published: false
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
      published: false
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
      published: false
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
