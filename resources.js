/* resources.js
   STL Home Buyer Journey — Resource Registry
   Single source of truth for all resource pages.

   To add a new resource:
   1. Copy resource-template.html, fill in SCENES, set window.RESOURCE_ID
   2. Add one entry to RESOURCES_REGISTRY below
   3. Done — shared.js picks it up automatically

   Citation fields:
     chapter      — which journey chapter number this resource ties into
     scene        — scene index within that chapter (0-based)
     context      — short phrase shown in "For This Chapter" and Option B exit card
     entrySection — ID of the section in the resource page to open to (matches
                    a value in the resource's window.RESOURCE_SECTIONS array)
*/

window.RESOURCES_REGISTRY = [

  /* ── EXAMPLE ENTRY (uncomment and edit when first resource is ready) ──

  {
    id:      "lender-qa",
    title:   "Lender Q&A — What Your Lender Won't Tell You",
    summary: "Direct answers on rates, pre-approval, loan types, and what happens at the table.",
    url:     "resource-lender-qa.html",
    citations: [
      {
        chapter:      1,
        scene:        4,
        context:      "Before you choose a lender, know the questions to ask.",
        entrySection: "overview"
      },
      {
        chapter:      2,
        scene:        0,
        context:      "Your pre-approval number is not your spending limit.",
        entrySection: "preapproval"
      },
      {
        chapter:      5,
        scene:        2,
        context:      "Once you're under contract, your lender's timeline controls the deal.",
        entrySection: "under-contract"
      }
    ]
  },

  {
    id:      "inspector-qa",
    title:   "Home Inspector Q&A — What The Report Actually Means",
    summary: "How to read an inspection report, what to negotiate, and what to walk away from.",
    url:     "resource-inspector-qa.html",
    citations: [
      {
        chapter:      3,
        scene:        0,
        context:      "What I look for during a showing is what your inspector will flag in the report.",
        entrySection: "overview"
      },
      {
        chapter:      7,
        scene:        0,
        context:      "The items that matter most are rarely the ones at the top of the report.",
        entrySection: "reading-the-report"
      }
    ]
  },

  */

  /* Registry intentionally empty until first resource page is built.
     shared.js will show the "Resources Coming Soon" empty state. */

];
