/**

- article-registry.js
- Single source of truth for all STL Home Journey articles.
- 
- ARCHITECTURE NOTES:
- - audience: ‘buyer’ | ‘seller’ | ‘both’
- - chapters: array of journey chapter numbers this article is relevant to (0 = index)
- - published: false = exists in registry but renders nothing (use for seller stubs)
- - toolLink: if article has a companion tool, link it here
- - pillLabel: short label for the Read More pill injected into journey chapters
- - tags: for filtering on the index page
- - series: groups related articles under a parent hub
- 
- TO ADD A NEW ARTICLE:
- 1. Add entry to ARTICLES array
- 1. Create /articles/[slug].html from the article template
- 1. Set published: true
- That’s it. Pills inject automatically via shared.js _mergeRegistryChips().
  */

window.ARTICLE_REGISTRY = {

version: ‘1.0.0’,

// ─── SERIES DEFINITIONS ─────────────────────────────────────────────────────
// Used for hub pages and grouping on the index
series: {
‘affordability’: {
title: ‘St. Louis Affordability by Zip Code’,
slug: ‘affordability’,
audience: ‘buyer’,
description: ‘How far your budget actually goes across 79 St. Louis zip codes — factoring in taxes, insurance, and real monthly costs.’,
hubSlug: ‘stl-affordability-by-zip-code’,
toolLink: ‘https://gkindler-help.github.io/buyeraffordabilityheatmap/’,
},
‘repair-guide’: {
title: ‘St. Louis Home Repair Cost Guide for Buyers’,
slug: ‘repair-guide’,
audience: ‘buyer’,
description: ‘Know what a home will actually cost before you make an offer — roof, HVAC, basement, sewer, and more.’,
hubSlug: ‘stl-home-repair-cost-guide’,
toolLink: null,
},
‘seller-net’: {
title: ‘St. Louis Home Seller Guides: Know What You'll Net’,
slug: ‘seller-net’,
audience: ‘seller’,
description: ‘The real numbers behind selling a home in St. Louis — commissions, costs, cash offers, and net proceeds.’,
hubSlug: ‘stl-home-seller-guides’,
toolLink: null,
},
‘cash-offer’: {
title: ‘Should You Accept a Cash Offer in St. Louis?’,
slug: ‘cash-offer’,
audience: ‘seller’,
description: ‘What cash buyers are actually doing with your home — and what it costs you to say yes.’,
hubSlug: ‘should-you-accept-a-cash-offer-stl’,
toolLink: ‘https://gkindler-help.github.io/cashofferexposed/’,
},
‘zillow’: {
title: ‘The Truth About Zillow’,
slug: ‘zillow’,
audience: ‘both’,
description: ‘How Zillow's pay-to-play model works, what it costs buyers and sellers, and how to use it without getting used.’,
hubSlug: ‘truth-about-zillow-stl’,
toolLink: null,
},
‘pricing’: {
title: ‘How to Price Your St. Louis Home to Sell’,
slug: ‘pricing’,
audience: ‘seller’,
description: ‘The strategy behind pricing that sells fast and nets more — not just picking a number.’,
hubSlug: ‘how-to-price-your-stl-home’,
toolLink: null,
},
},

// ─── ARTICLES ────────────────────────────────────────────────────────────────
articles: [

```
// ── BUYER: AFFORDABILITY SERIES ──────────────────────────────────────────

{
  slug: 'stl-affordability-by-zip-code',
  title: 'St. Louis Home Affordability by Zip Code',
  shortTitle: 'Affordability by Zip Code',
  description: 'Two homes at the same price can cost hundreds more per month depending on where they sit. This interactive map shows the real number across 79 St. Louis zip codes.',
  pillLabel: 'Affordability by Zip',
  audience: 'buyer',
  series: 'affordability',
  isHub: true,
  chapters: [1, 2],
  tags: ['affordability', 'budget', 'zip-codes', 'property-tax', 'tools'],
  toolLink: 'https://gkindler-help.github.io/buyeraffordabilityheatmap/',
  seo: {
    title: 'St. Louis Home Affordability by Zip Code | STL Home Journey',
    description: 'Find out how far your budget goes across St. Louis — factoring in property taxes, insurance, and real monthly costs by zip code.',
    keywords: 'st louis home affordability, st louis zip code property taxes, affordable homes st louis',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-affordability-by-zip-code',
},

{
  slug: 'how-much-income-to-buy-home-stl',
  title: 'How Much Income Do You Need to Buy a Home in St. Louis?',
  shortTitle: 'Income Required to Buy in STL',
  description: 'Your lender\'s approval number and your real affordability number are not the same. Here\'s what the math actually looks like across St. Louis price points.',
  pillLabel: 'Income to Buy in STL',
  audience: 'buyer',
  series: 'affordability',
  isHub: false,
  chapters: [1, 2],
  tags: ['affordability', 'budget', 'income', 'first-time-buyer', 'mortgage'],
  toolLink: 'https://gkindler-help.github.io/buyeraffordabilityheatmap/',
  seo: {
    title: 'How Much Income Do You Need to Buy a Home in St. Louis? | STL Home Journey',
    description: 'St. Louis is affordable — but affordable doesn\'t mean free. See exactly what income you need by price point, down payment, and zip code.',
    keywords: 'income to buy home st louis, st louis home buying income requirements, how much to buy house st louis',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-affordability-by-zip-code/how-much-income-do-you-need-to-buy-a-home-in-st-louis',
},

{
  slug: 'renting-vs-buying-stl',
  title: 'Renting vs. Buying a Home in St. Louis: What the Numbers Actually Show',
  shortTitle: 'Rent vs. Buy in STL',
  description: 'The rent vs. buy decision in St. Louis isn\'t as simple as comparing monthly payments. Here\'s the full picture.',
  pillLabel: 'Rent vs. Buy in STL',
  audience: 'buyer',
  series: 'affordability',
  isHub: false,
  chapters: [1],
  tags: ['affordability', 'renting', 'first-time-buyer', 'decision'],
  toolLink: null,
  seo: {
    title: 'Renting vs. Buying a Home in St. Louis | STL Home Journey',
    description: 'Should you rent or buy in St. Louis right now? See the real numbers — equity, total cost, and break-even timeline.',
    keywords: 'renting vs buying st louis, should i buy a home in st louis, rent or buy st louis 2026',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-affordability-by-zip-code/renting-vs-buying-a-home-in-st-louis-what-the-numbers-actually-show',
},

{
  slug: 'first-time-buyer-programs-stl',
  title: 'First-Time Home Buyer Programs in St. Louis: What\'s Actually Available',
  shortTitle: 'First-Time Buyer Programs STL',
  description: 'Down payment assistance, grants, and loan programs for St. Louis buyers — what\'s real, what\'s limited, and how to actually access it.',
  pillLabel: 'First-Time Buyer Programs',
  audience: 'buyer',
  series: 'affordability',
  isHub: false,
  chapters: [1, 2],
  tags: ['affordability', 'first-time-buyer', 'down-payment', 'programs', 'fha', 'va'],
  toolLink: null,
  seo: {
    title: 'First-Time Home Buyer Programs in St. Louis | STL Home Journey',
    description: 'Down payment assistance, grants, and loan programs for first-time buyers in St. Louis — what\'s actually available and how to qualify.',
    keywords: 'first time home buyer programs st louis, down payment assistance st louis, st louis home buying grants',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-affordability-by-zip-code/first-time-home-buyer-programs-in-st-louis-whats-actually-available',
},

{
  slug: 'most-affordable-zip-codes-stl-2026',
  title: 'Most Affordable Zip Codes in St. Louis Right Now (2026 Data)',
  shortTitle: 'Most Affordable Zip Codes STL',
  description: 'Where your dollar goes furthest in St. Louis right now — ranked by real monthly cost, not just listing price.',
  pillLabel: 'Most Affordable Zip Codes',
  audience: 'buyer',
  series: 'affordability',
  isHub: false,
  chapters: [2],
  tags: ['affordability', 'zip-codes', 'budget', 'neighborhoods', 'data'],
  toolLink: 'https://gkindler-help.github.io/buyeraffordabilityheatmap/',
  seo: {
    title: 'Most Affordable Zip Codes in St. Louis (2026) | STL Home Journey',
    description: 'The most affordable zip codes in St. Louis ranked by real monthly ownership cost — taxes, insurance, and market price combined.',
    keywords: 'most affordable zip codes st louis, cheapest places to buy st louis, affordable neighborhoods st louis 2026',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-affordability-by-zip-code/most-affordable-zip-codes-in-st-louis-right-now-2026-data',
},

// ── BUYER: REPAIR COST GUIDE SERIES ─────────────────────────────────────

{
  slug: 'stl-home-repair-cost-guide',
  title: 'St. Louis Home Repair Cost Guide for Buyers: Know Before You Offer',
  shortTitle: 'Home Repair Cost Guide',
  description: 'Most buyers make an offer based on how a home feels. This guide — and the tool behind it — exists to fix that.',
  pillLabel: 'Repair Cost Guide',
  audience: 'buyer',
  series: 'repair-guide',
  isHub: true,
  chapters: [4, 5],
  tags: ['inspection', 'repair-costs', 'negotiation', 'offer', 'tools'],
  toolLink: null,
  seo: {
    title: 'St. Louis Home Repair Cost Guide for Buyers | STL Home Journey',
    description: 'Know what a home will actually cost before you offer — roof, HVAC, basement, electrical, sewer, and tuckpointing in the St. Louis market.',
    keywords: 'home repair costs st louis, st louis home inspection costs, what to check when buying house st louis',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-repair-cost-guide-for-buyers-know-before-you-offer',
},

{
  slug: 'what-to-look-for-buying-house-stl',
  title: 'What to Look For When Buying a House in St. Louis (Walkthrough Checklist)',
  shortTitle: 'Walkthrough Checklist',
  description: 'The items that cost tens of thousands are the ones most buyers walk right past. Roof, HVAC, basement, sewer lateral, tuckpointing, electrical — before you\'re under contract.',
  pillLabel: 'Walkthrough Checklist',
  audience: 'buyer',
  series: 'repair-guide',
  isHub: false,
  chapters: [4, 5],
  tags: ['inspection', 'walkthrough', 'repair-costs', 'checklist', 'hvac', 'basement', 'roof'],
  toolLink: null,
  seo: {
    title: 'What to Look For When Buying a House in St. Louis | STL Home Journey',
    description: 'A walkthrough checklist for St. Louis buyers — the costly items most buyers miss before making an offer: roof, HVAC, basement, sewer, electrical.',
    keywords: 'what to look for buying house st louis, home walkthrough checklist st louis, st louis home inspection checklist',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-repair-cost-guide-for-buyers-know-before-you-offer/what-to-look-for-when-buying-a-house-in-st-louis-walkthrough-checklist',
},

{
  slug: 'repair-costs-affect-offer-price-stl',
  title: 'How Repair Costs Should Affect Your Offer Price in St. Louis',
  shortTitle: 'Repair Costs & Your Offer',
  description: 'How to turn a repair estimate into a defensible offer number — and what to do when the seller won\'t move.',
  pillLabel: 'Repair Costs & Your Offer',
  audience: 'buyer',
  series: 'repair-guide',
  isHub: false,
  chapters: [5, 6],
  tags: ['negotiation', 'offer', 'repair-costs', 'inspection'],
  toolLink: null,
  seo: {
    title: 'How Repair Costs Should Affect Your Offer Price in St. Louis | STL Home Journey',
    description: 'Turn your inspection findings into a defensible offer — how to price repair costs into your St. Louis home offer and negotiate from a position of knowledge.',
    keywords: 'how to negotiate home repairs st louis, repair costs home offer st louis, inspection negotiation st louis',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-repair-cost-guide-for-buyers-know-before-you-offer/how-repair-costs-should-affect-your-offer-price-in-st-louis',
},

{
  slug: 'home-inspection-st-louis',
  title: 'What Happens at a Home Inspection in St. Louis',
  shortTitle: 'What Happens at an Inspection',
  description: 'What to expect, what the inspector actually checks, and what you need to do with the results.',
  pillLabel: 'Home Inspection in STL',
  audience: 'buyer',
  series: 'repair-guide',
  isHub: false,
  chapters: [5],
  tags: ['inspection', 'process', 'what-to-expect'],
  toolLink: null,
  seo: {
    title: 'What Happens at a Home Inspection in St. Louis | STL Home Journey',
    description: 'What to expect at a home inspection in St. Louis — what\'s checked, what the report means, and how to use it in negotiations.',
    keywords: 'home inspection st louis, what does home inspector check st louis, st louis inspection process',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-repair-cost-guide-for-buyers-know-before-you-offer/what-happens-at-a-home-inspection-in-st-louis',
},

// ── BOTH: ZILLOW SERIES ──────────────────────────────────────────────────

{
  slug: 'truth-about-zillow-stl',
  title: 'The Truth About Zillow: What St. Louis Buyers and Sellers Need to Know',
  shortTitle: 'The Truth About Zillow',
  description: 'Zillow is the most visited real estate platform in the country. It is also a lead generation business. Here\'s what that means for you.',
  pillLabel: 'The Truth About Zillow',
  audience: 'both',
  series: 'zillow',
  isHub: true,
  chapters: [2, 3],
  tags: ['zillow', 'consumer-protection', 'agents', 'lead-gen'],
  toolLink: null,
  seo: {
    title: 'The Truth About Zillow for St. Louis Buyers and Sellers | STL Home Journey',
    description: 'How Zillow\'s pay-to-play model works, what it costs buyers and sellers, and how to use Zillow without getting used by it.',
    keywords: 'zillow st louis, is zillow accurate st louis, zillow zestimate st louis, zillow agent referrals',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/the-truth-about-zillow-what-st-louis-buyers-and-sellers-need-to-know',
},

{
  slug: 'zillow-pay-to-play-system',
  title: 'How Zillow\'s Pay-to-Play System Works — and What It Costs You',
  shortTitle: 'Zillow\'s Pay-to-Play Model',
  description: 'Zillow charges agents $20–$60 per lead referral. That cost gets passed somewhere. Here\'s where.',
  pillLabel: 'How Zillow Makes Money',
  audience: 'both',
  series: 'zillow',
  isHub: false,
  chapters: [2],
  tags: ['zillow', 'consumer-protection', 'agents', 'lead-gen', 'commissions'],
  toolLink: null,
  seo: {
    title: 'How Zillow\'s Pay-to-Play System Works | STL Home Journey',
    description: 'Zillow\'s agent referral model — how it works, what agents pay, and why that matters when you click "Contact Agent" on any listing.',
    keywords: 'how zillow makes money, zillow agent referral fees, zillow pay to play',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/the-truth-about-zillow-what-st-louis-buyers-and-sellers-need-to-know/how-zillows-pay-to-play-system-works-and-what-it-costs-you',
},

{
  slug: 'what-happens-when-you-click-zillow',
  title: 'What Happens the Moment You Click on Zillow',
  shortTitle: 'What Clicking Zillow Triggers',
  description: 'The second you engage with a Zillow listing, a process starts that most buyers don\'t know about.',
  pillLabel: 'What Zillow Does With Your Click',
  audience: 'buyer',
  series: 'zillow',
  isHub: false,
  chapters: [2],
  tags: ['zillow', 'consumer-protection', 'agents', 'lead-gen'],
  toolLink: null,
  seo: {
    title: 'What Happens When You Click on Zillow | STL Home Journey',
    description: 'When you click "Contact Agent" or request a showing on Zillow, here\'s exactly what happens — and who gets your information.',
    keywords: 'zillow contact agent what happens, zillow lead generation, zillow showing request',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/the-truth-about-zillow-what-st-louis-buyers-and-sellers-need-to-know/what-happens-the-moment-you-click-on-zillow',
},

{
  slug: 'zillow-zestimate-accurate-stl',
  title: 'Is the Zillow Zestimate Accurate in St. Louis?',
  shortTitle: 'Zillow Zestimate Accuracy STL',
  description: 'The Zestimate is a starting point, not a valuation. Here\'s how far off it runs in the St. Louis market — and why.',
  pillLabel: 'Is the Zestimate Accurate?',
  audience: 'both',
  series: 'zillow',
  isHub: false,
  chapters: [2, 6],
  tags: ['zillow', 'valuation', 'zestimate', 'data', 'maris'],
  toolLink: null,
  seo: {
    title: 'Is the Zillow Zestimate Accurate in St. Louis? | STL Home Journey',
    description: 'How accurate is the Zillow Zestimate in St. Louis? See the real variance data and what to use instead for a reliable home value estimate.',
    keywords: 'zillow zestimate accuracy st louis, is zillow accurate st louis, zillow vs actual sale price st louis',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/the-truth-about-zillow-what-st-louis-buyers-and-sellers-need-to-know/is-the-zillow-zestimate-accurate-in-st-louis',
},

{
  slug: 'how-to-use-zillow-without-getting-used',
  title: 'How to Use Zillow Without Getting Used by Zillow',
  shortTitle: 'Using Zillow Smartly',
  description: 'Zillow is useful. It\'s just not useful in the ways most buyers think. Here\'s the right way to use it.',
  pillLabel: 'Using Zillow Smartly',
  audience: 'buyer',
  series: 'zillow',
  isHub: false,
  chapters: [2, 3],
  tags: ['zillow', 'consumer-protection', 'strategy'],
  toolLink: null,
  seo: {
    title: 'How to Use Zillow Without Getting Used by It | STL Home Journey',
    description: 'Zillow is a useful research tool — if you know what it\'s actually for. Here\'s how to get value from Zillow without letting it drive your decisions.',
    keywords: 'how to use zillow, zillow tips for buyers, zillow vs realtor st louis',
  },
  published: true,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/the-truth-about-zillow-what-st-louis-buyers-and-sellers-need-to-know/how-to-use-zillow-without-getting-used-by-zillow',
},

// ── SELLER: SELLER NET SERIES (stubs — published: false until seller journey) ──

{
  slug: 'stl-home-seller-guides',
  title: 'St. Louis Home Seller Guides: Know What You\'ll Net',
  shortTitle: 'Seller Guides Hub',
  description: 'The real numbers behind selling a home in St. Louis — commissions, costs, cash offers, and what you actually walk away with.',
  pillLabel: 'Seller Guides',
  audience: 'seller',
  series: 'seller-net',
  isHub: true,
  chapters: [],
  tags: ['selling', 'net-proceeds', 'commissions', 'costs'],
  toolLink: null,
  seo: {
    title: 'St. Louis Home Seller Guides | STL Home Journey',
    description: 'Know your net before you list — commissions, closing costs, cash offer tradeoffs, and what you actually walk away with in St. Louis.',
    keywords: 'how much to sell house st louis, st louis home selling costs, net proceeds selling home st louis',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-seller-guides-know-what-youll-net',
},

{
  slug: 'what-will-i-net-selling-stl',
  title: 'What Will I Net Selling My St. Louis Home?',
  shortTitle: 'Your Net Proceeds in STL',
  description: 'The number sellers actually care about — what\'s left after commissions, closing costs, and everything else comes out.',
  pillLabel: 'What You\'ll Net Selling',
  audience: 'seller',
  series: 'seller-net',
  isHub: false,
  chapters: [],
  tags: ['selling', 'net-proceeds', 'costs', 'commissions'],
  toolLink: null,
  seo: {
    title: 'What Will I Net Selling My St. Louis Home? | STL Home Journey',
    description: 'Calculate your real net proceeds from selling a St. Louis home — after agent commissions, title fees, transfer taxes, and closing costs.',
    keywords: 'net proceeds selling home st louis, how much will i make selling house st louis, seller closing costs st louis',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-seller-guides-know-what-youll-net/what-will-i-net-selling-my-st-louis-home',
},

{
  slug: 'cost-to-sell-home-stl',
  title: 'What Does It Actually Cost to Sell a Home in St. Louis?',
  shortTitle: 'Real Cost to Sell in STL',
  description: 'Every cost that comes out before you see a dollar — agent fees, title, transfer tax, staging, repairs, and closing.',
  pillLabel: 'Cost to Sell in STL',
  audience: 'seller',
  series: 'seller-net',
  isHub: false,
  chapters: [],
  tags: ['selling', 'costs', 'commissions', 'closing'],
  toolLink: null,
  seo: {
    title: 'What Does It Cost to Sell a Home in St. Louis? | STL Home Journey',
    description: 'The full breakdown of seller closing costs in St. Louis — agent commissions, title insurance, transfer taxes, repairs, and more.',
    keywords: 'cost to sell home st louis, seller closing costs st louis, st louis home selling fees',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-seller-guides-know-what-youll-net/what-does-it-actually-cost-to-sell-a-home-in-st-louis',
},

{
  slug: 'who-pays-buyer-agent-commission-stl',
  title: 'Who Pays the Buyer\'s Agent Commission in St. Louis Now?',
  shortTitle: 'Buyer Agent Commission Rules STL',
  description: 'The NAR settlement changed the rules. Here\'s what sellers in St. Louis actually need to know.',
  pillLabel: 'Buyer Commission Rules STL',
  audience: 'seller',
  series: 'seller-net',
  isHub: false,
  chapters: [],
  tags: ['selling', 'commissions', 'nar-settlement', 'buyer-agent'],
  toolLink: null,
  seo: {
    title: 'Who Pays the Buyer\'s Agent Commission in St. Louis Now? | STL Home Journey',
    description: 'After the NAR settlement, who pays the buyer\'s agent commission in St. Louis? What sellers need to know about the new rules.',
    keywords: 'buyer agent commission st louis, nar settlement st louis, who pays realtor fees st louis',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-seller-guides-know-what-youll-net/who-pays-the-buyers-agent-commission-in-st-louis-now',
},

// ── SELLER: CASH OFFER SERIES ────────────────────────────────────────────

{
  slug: 'should-you-accept-cash-offer-stl',
  title: 'Should You Accept a Cash Offer in St. Louis? (What Sellers Need to Know)',
  shortTitle: 'Should You Take the Cash Offer?',
  description: 'Cash offers close fast and skip contingencies. They also usually come in 30%–70% of market value. Here\'s how to decide.',
  pillLabel: 'Cash Offer: Worth It?',
  audience: 'seller',
  series: 'cash-offer',
  isHub: true,
  chapters: [],
  tags: ['selling', 'cash-offer', 'investor', 'consumer-protection'],
  toolLink: 'https://gkindler-help.github.io/cashofferexposed/',
  seo: {
    title: 'Should You Accept a Cash Offer in St. Louis? | STL Home Journey',
    description: 'Cash offers in St. Louis — when they make sense and when they cost you tens of thousands. What sellers need to know before signing.',
    keywords: 'cash offer st louis, should i accept cash offer st louis, cash buyer st louis home',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-seller-guides-know-what-youll-net/should-you-accept-a-cash-offer-in-st-louis-what-sellers-need-to-know',
},

{
  slug: 'how-cash-buyers-calculate-offers-stl',
  title: 'How Cash Buyers Calculate Offers in St. Louis (Real Example Using a 63012 Property)',
  shortTitle: 'How Cash Buyers Price Their Offers',
  description: 'The actual math behind a cash offer — ARV, renovation budget, holding costs, and the profit margin baked in before they even call you.',
  pillLabel: 'How Cash Buyers Price Offers',
  audience: 'seller',
  series: 'cash-offer',
  isHub: false,
  chapters: [],
  tags: ['selling', 'cash-offer', 'investor', 'arv', 'consumer-protection'],
  toolLink: 'https://gkindler-help.github.io/cashofferexposed/',
  seo: {
    title: 'How Cash Buyers Calculate Offers in St. Louis | STL Home Journey',
    description: 'The formula cash buyers use to price St. Louis homes — ARV, repair budget, holding costs, and profit margin — shown with a real 63012 example.',
    keywords: 'how cash buyers calculate offers, cash buyer formula st louis, arv st louis investor offer',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-seller-guides-know-what-youll-net/should-you-accept-a-cash-offer-in-st-louis-what-sellers-need-to-know/how-cash-buyers-calculate-offers-in-st-louis-real-example-using-a-63012-p',
},

{
  slug: 'what-you-lose-with-cash-offer-stl',
  title: 'What Do You Lose With a Cash Offer in St. Louis? (Real Cost Breakdown)',
  shortTitle: 'Real Cost of a Cash Offer',
  description: 'The convenience premium on a cash offer in St. Louis — calculated in dollars, not vague warnings.',
  pillLabel: 'Real Cost of a Cash Offer',
  audience: 'seller',
  series: 'cash-offer',
  isHub: false,
  chapters: [],
  tags: ['selling', 'cash-offer', 'investor', 'consumer-protection', 'costs'],
  toolLink: 'https://gkindler-help.github.io/cashofferexposed/',
  seo: {
    title: 'What Do You Lose With a Cash Offer in St. Louis? | STL Home Journey',
    description: 'What a cash offer actually costs St. Louis sellers — the real dollar difference between a cash buyer and listing on the open market.',
    keywords: 'cash offer vs listing st louis, what cash offer costs sellers st louis, cash buyer discount st louis',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/st-louis-home-seller-guides-know-what-youll-net/should-you-accept-a-cash-offer-in-st-louis-what-sellers-need-to-know/what-do-you-lose-with-a-cash-offer-in-st-louis-real-cost-breakdown',
},

// ── SELLER: PRICING SERIES ───────────────────────────────────────────────

{
  slug: 'how-to-price-stl-home',
  title: 'How to Price Your St. Louis Home to Sell in One Weekend',
  shortTitle: 'How to Price Your Home',
  description: 'The strategy behind pricing that actually works — not just picking a number and hoping.',
  pillLabel: 'How to Price Your Home',
  audience: 'seller',
  series: 'pricing',
  isHub: true,
  chapters: [],
  tags: ['selling', 'pricing', 'strategy', 'days-on-market'],
  toolLink: null,
  seo: {
    title: 'How to Price Your St. Louis Home to Sell | STL Home Journey',
    description: 'The pricing strategy that sells St. Louis homes fast — how to read the market, price competitively, and avoid the costly mistakes most sellers make.',
    keywords: 'how to price home st louis, st louis home pricing strategy, selling home st louis fast',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/how-to-price-your-st-louis-home-to-sell-in-one-weekend',
},

{
  slug: 'why-most-stl-homes-priced-wrong',
  title: 'Why Most St. Louis Homes Are Priced Wrong',
  shortTitle: 'Why Homes Are Priced Wrong',
  description: 'Overpriced homes sit. Underpriced homes leave money on the table. Here\'s where most sellers go wrong.',
  pillLabel: 'Why Homes Are Priced Wrong',
  audience: 'seller',
  series: 'pricing',
  isHub: false,
  chapters: [],
  tags: ['selling', 'pricing', 'days-on-market', 'strategy'],
  toolLink: null,
  seo: {
    title: 'Why Most St. Louis Homes Are Priced Wrong | STL Home Journey',
    description: 'The most common pricing mistakes St. Louis sellers make — and what the data shows about how overpricing affects final sale price.',
    keywords: 'st louis home overpriced, pricing mistakes selling home st louis, days on market st louis',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/how-to-price-your-st-louis-home-to-sell-in-one-weekend/why-most-st-louis-homes-are-priced-wrong',
},

{
  slug: 'best-time-to-list-stl',
  title: 'Best Time to List Your Home in St. Louis',
  shortTitle: 'Best Time to List in STL',
  description: 'St. Louis has clear seasonal patterns in buyer activity and sale prices. Here\'s when the data says to list.',
  pillLabel: 'Best Time to List in STL',
  audience: 'seller',
  series: 'pricing',
  isHub: false,
  chapters: [],
  tags: ['selling', 'timing', 'data', 'seasonal', 'pricing'],
  toolLink: null,
  seo: {
    title: 'Best Time to List Your Home in St. Louis | STL Home Journey',
    description: 'When is the best time to sell a home in St. Louis? The seasonal data on buyer activity, days on market, and sale prices by month.',
    keywords: 'best time to sell home st louis, when to list house st louis, st louis real estate seasonal trends',
  },
  published: false,
  sourceUrl: 'https://sites.google.com/view/st-louis-real-estate-guides/how-to-price-your-st-louis-home-to-sell-in-one-weekend/best-time-to-list',
},
```

],

// ─── HELPER METHODS ──────────────────────────────────────────────────────────

/**

- Returns all published articles for a given audience filter.
- @param {‘buyer’|‘seller’|‘both’|‘all’} audience
  */
  getByAudience(audience) {
  if (audience === ‘all’) return this.articles.filter(a => a.published);
  return this.articles.filter(a =>
  a.published && (a.audience === audience || a.audience === ‘both’)
  );
  },

/**

- Returns all published articles mapped to a given chapter number.
- Used by shared.js to inject pills.
- @param {number} chapter
  */
  getByChapter(chapter) {
  return this.articles.filter(a =>
  a.published && a.chapters.includes(chapter)
  );
  },

/**

- Returns all published articles in a given series.
- @param {string} seriesSlug
  */
  getBySeries(seriesSlug) {
  return this.articles.filter(a =>
  a.published && a.series === seriesSlug
  );
  },

/**

- Returns a single article by slug.
- @param {string} slug
  */
  getBySlug(slug) {
  return this.articles.find(a => a.slug === slug) || null;
  },

/**

- Returns all published articles with a given tag.
- @param {string} tag
  */
  getByTag(tag) {
  return this.articles.filter(a =>
  a.published && a.tags.includes(tag)
  );
  },

/**

- Returns all unique tags across published articles for a given audience.
- @param {‘buyer’|‘seller’|‘both’|‘all’} audience
  */
  getTagsForAudience(audience) {
  const articles = this.getByAudience(audience);
  const tagSet = new Set();
  articles.forEach(a => a.tags.forEach(t => tagSet.add(t)));
  return […tagSet].sort();
  },

};
