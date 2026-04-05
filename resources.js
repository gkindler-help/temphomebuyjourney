/* /resources.js
   STL Home Buyer Journey — Resource Registry
   Single source of truth for all resources and tools.

   Each entry drives:
   1. The Resources tab panel (filtered by current chapter)
   2. Auto-injected scene chips (matched by chapter + scene index)
   3. Tool panel launch (when tool: true)

   To add a new resource:
   1. Create the HTML page
   2. Add an entry here with the correct chapter/scene citations
   3. Nothing else needs to change

   Scene indices are 0-based (first scene = 0).
*/

window.RESOURCES_REGISTRY = [

  /* ── OPEN HOUSE PREP ─────────────────────────────────────────
     Ch.2 scene 1 — most competition (before the showing)
     Ch.5 scene 2 — view count (before writing the offer)
  ─────────────────────────────────────────────────────────────── */
  {
    id:      'prep',
    title:   'STL Open House Prep',
    summary: 'First weekend rate, days on market, true monthly cost, and price tiers by ZIP — before you walk in the door.',
    url:     'prep.html',
    tool:    true,
    toolId:  'prep',
    citations: [
      { chapter: 2, scene: 1, context: 'Before you walk into a showing — know what the competition looks like in this zip code.' },
      { chapter: 5, scene: 2, context: 'Before you write the offer — pull the market data for this zip.' }
    ]
  },

  /* ── AFFORDABILITY MAP ───────────────────────────────────────
     Ch.2 scene 0 — pre-1970 stock (first price discussion)
     Ch.2 scene 3 — now you know (end of affordability chapter)
  ─────────────────────────────────────────────────────────────── */
  {
    id:      'afford',
    title:   'STL Affordability Map',
    summary: '79 ZIP codes color-coded by what your budget actually buys — first weekend rate, days on market, median price.',
    url:     'afford.html',
    tool:    true,
    toolId:  'afford',
    citations: [
      { chapter: 2, scene: 0, context: 'See what your budget gets you across 79 St. Louis zip codes.' },
      { chapter: 2, scene: 3, context: 'Now that you know how to think about affordability — see it mapped by zip.' }
    ]
  },

  /* ── COST SURVIVAL GUIDE ─────────────────────────────────────
     Ch.3 scene 5 — going downstairs (biggest defect moment)
     Ch.8 scene 1 — what if something is wrong (walk-through)
  ─────────────────────────────────────────────────────────────── */
  {
    id:      'home-cost',
    title:   'STL Home Cost Survival Guide',
    summary: 'Walk the property, tap what you see, get St. Louis repair estimates — not national averages.',
    url:     'home-cost.html',
    tool:    true,
    toolId:  'home-cost',
    citations: [
      { chapter: 3, scene: 5, context: 'Walk the basement and flag what you see — every dollar you identify is a dollar you can negotiate.' },
      { chapter: 8, scene: 1, context: 'If something is wrong at the walk-through you need numbers before you have that conversation.' }
    ]
  },

  /* ── COMPARE PROPERTIES ──────────────────────────────────────
     Ch.5 scene 3 — as soon as you say go (offer decision)
     Ch.5 scene 4 — now you decide (final offer scene)
  ─────────────────────────────────────────────────────────────── */
  {
    id:      'compare',
    title:   'STL Compare Properties',
    summary: 'Two homes side by side — true monthly cost, taxes, insurance, and 30-year difference.',
    url:     'compare.html',
    tool:    true,
    toolId:  'compare',
    citations: [
      { chapter: 5, scene: 3, context: 'Before you commit — compare this property against your alternatives.' },
      { chapter: 5, scene: 4, context: 'Side by side before you write — true monthly cost, not just list price.' }
    ]
  },

  /* ── COMMON HOME FAILURES ────────────────────────────────────
     Ch.3 scene 3 — two-prong outlets (electrical tell)
     Ch.3 scene 7 — electrical panel (Federal Pacific)
     Ch.7 scene 2 — inspections I recommend (before the report)
  ─────────────────────────────────────────────────────────────── */
  {
    id:      'fails',
    title:   'STL Common Home Failures',
    summary: 'Visual guide to the most expensive and most commonly missed defects in St. Louis homes.',
    url:     'fails.html',
    tool:    true,
    toolId:  'fails',
    citations: [
      { chapter: 3, scene: 3, context: 'Two-prong outlets are one tell. See the full list of what to look for at any showing.' },
      { chapter: 3, scene: 7, context: 'Federal Pacific panel. Know what you are looking at before the inspector does.' },
      { chapter: 7, scene: 2, context: 'The defects that show up most in St. Louis homes — and what they actually cost.' }
    ]
  }

];
