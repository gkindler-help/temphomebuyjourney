# stlhomejourney.com

Static HTML site for George Kindler, a licensed Missouri real estate agent. Cloudflare Pages deploys it from `main`.

Before you write or rebuild any page, read and follow `docs/content-rules.md`. It covers page structure (one topic per page, question subtopics in reader order, each question owned by one page), data accuracy, house style and George's stated positions.

Workflow:
- Merge only when George says "push" or "merge."
- Keep scratch and proofreading files out of the repo.
- Never publish directions or internal notes on the public site. Any new internal file (notes, rules, editor settings) must be blocked with a 301 to `/` at the top of `_redirects`.
- Every page must validate JSON-LD and have no overflow at 390px.
- Data tables: after building or rebuilding any page, run `python3 scripts/fold-tables.py`. It collapses every data table behind a "Show all N rows" toggle, keeping the rows in the HTML for search and AI citation.
- Site search: after any change to page content, titles or descriptions, run `python3 scripts/build-search.py` and commit `pagefind/` and `assets/search-recs.json` with the PR. Recommended-reading keywords live in `TOPICS` in that script.
- Lesson strip: one quiet "From George's own transactions" line sits right after the Quick Answers on article pages. Which story each page points to lives in `PAGES` in `scripts/build-lesson-strip.py`. When a new Lessons From a Sale page goes up, add it to `LESSONS`, point the pages it fits at it, then run `python3 scripts/build-lesson-strip.py`. A new page with Quick Answers gets an entry too.
- Link previews: after adding a page or changing a page title, run `python3 scripts/build-og.py` (needs Node + Playwright; set `CHROME` to a Chromium binary if needed) and commit `assets/og/` and the updated pages. It makes one preview card per page from the page's title, with a "Calculator included" tag on pages that have a calculator.
- Site index: after adding, removing or retitling pages, run `python3 scripts/build-site-index.py` to rebuild `/site-index` (every indexable page, grouped by area and topic). New neighborhood pages go in `REGION` in that script. The homepage "Browse St. Louis by area" block is a hand-picked ~45 links; keep it curated, not every page.
