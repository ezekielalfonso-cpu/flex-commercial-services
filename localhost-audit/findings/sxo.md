# SXO Findings — Flex Commercial Services (localhost:4321)

Re-audit of `/`, `/about`, `/services`, `/booking` (plus `/faq` for context) against 4 target intents:
"commercial cleaning company Cleveland", "office cleaning services Cleveland",
"restaurant cleaning service Cleveland", "move out cleaning Cleveland".

Note: `scripts/render_page.py` hard-blocks `localhost` by SSRF design (`url_safety: Blocked hostname: localhost`).
Pages were instead fetched directly via curl (own local dev server, explicitly requested by user) and parsed with
`scripts/parse_html.py --url <url> <file> --json`. Live SERP scraping was not performed for this pass; SERP consensus
is carried over from the prior GHL-site audit (Jani-King, ABM, Coverall-style dedicated Service/Local Pages with
process detail, tenure credentials, visible pricing).

## SXO Gap Score: 55/100 (up from implied prior baseline in the ~35-40 range)

| Dimension | Score | Evidence |
|---|---|---|
| Page Type | 6/15 | All verticals (restaurant, office, fitness, school/daycare, medical, move-in/out, post-contractor) still funnel to one `/services` page with anchor links (`#choose-your-plan`); no dedicated per-service or per-suburb pages. Unchanged from prior audit. |
| Content Depth | 8/15 | `/faq` now has 8 substantive Q&As (insurance/bonding, named suburbs, pricing flexibility, founder differentiation). Real improvement, but no process/step detail per vertical on `/services`. |
| UX Signals | 10/15 | Clear repeated CTAs ("Get a Free Quote", "Book This Plan"), single semantically correct `<h1>` per page confirmed (was flagged broken previously — now fixed). |
| Schema | 12/15 | LocalBusiness/ProfessionalService, WebSite, BreadcrumbList, Service+OfferCatalog (plan names/descriptions), ContactPage, and FAQPage schema all present and well-formed. |
| Media | 7/15 | Generic Unsplash stock per vertical; two new AI-generated founder headshots on `/about`. No real jobsite photos, no video. |
| Authority | 9/15 | Named owners (David George, Riley Hinkel) with headshots and founder story on `/about`; "100+" clients and "3+ years" experience now confirmed in raw (non-JS) HTML on `/` and `/about`; insured/bonded confirmed in FAQ. Meaningful, verifiable improvement over the prior audit's flagged gap. |
| Freshness | 3/10 | No visible last-updated/date signals anywhere. |

## Title: Page-type mismatch is unchanged and remains the primary constraint
**Severity: HIGH (was CRITICAL)**
Description: For 3 of 4 target intents ("office cleaning services Cleveland", "restaurant cleaning service Cleveland",
"move out cleaning Cleveland"), competitor SERPs favor dedicated Service/Local pages with process and tenure depth.
This site still routes every vertical into one `/services` page. Only "commercial cleaning company Cleveland"
(a brand/homepage-shaped query) is reasonably aligned by the homepage + about + services combination.
Recommendation: Split `/services` into dedicated landing pages per vertical (`/office-cleaning-cleveland`,
`/restaurant-cleaning-cleveland`, `/move-out-cleaning-cleveland`), each with the process/credential depth now
available in `/about` and `/faq` pulled inline rather than requiring a separate page visit.

## Title: Visible pricing is still absent sitewide
**Severity: HIGH**
Description: Zero dollar figures found across `/`, `/about`, `/services`, `/booking`, `/faq`. Plan names (Basic,
Standard/Tailored, Premium, One-Time) exist with qualitative descriptions only; schema `priceRange` is literally
"Custom quote". Facilities managers comparing vendors and move-out shoppers both use price as a fast filter.
Recommendation: Add at least a "starting at $X" range or transparent estimator, especially on `/services` and the
move-in/out card.

## Title: Trust/authority content improvements measurably closed the E-E-A-T gap
**Severity: RESOLVED (positive finding)**
Description: Founder story, named owners with photos, "100+ clients"/"3+ years" stats, and insured/bonded
confirmation are now all present in server-rendered (non-JS) HTML — previously flagged as either missing or
JS-only/unverifiable. This directly improves the Authority dimension and the facilities-manager persona's Trust score.
Recommendation: Surface 1-2 of these trust signals (insured/bonded badge, 100+ clients) directly on `/services` and
`/booking`, not just `/about` and `/faq`, so they're visible without an extra click.

## Title: H1 semantic wrapping issue is fixed
**Severity: RESOLVED (positive finding)**
Description: Prior audit flagged incorrect H1 wrapping. Confirmed via HTML source: each page now has exactly one
`<h1>` element containing the full heading text (styling spans/`<br>` inside, not separate heading tags).
Recommendation: None — maintain this pattern on any new pages.

## Title: Move-in/move-out still treated as one of seven equal service cards
**Severity: MEDIUM-HIGH**
Description: For the transactional "move out cleaning Cleveland" intent, the page offers no urgency messaging
(same-day/48-hr turnaround), landlord-inspection checklist, or move-out-specific proof — it's positioned identically
to recurring janitorial verticals like fitness centers and schools.
Recommendation: Give move-in/out a dedicated landing section or page with turnaround-time promise, checklist, and a
streamlined one-off booking path distinct from the recurring-contract quote flow.

## Persona Scores

### Persona 1: Facilities manager comparing vendors for a recurring contract
**59/100** (was ~48-50) — Relevance 18/25, Clarity 14/25, Trust 17/25, Action 10/25
Trust jumped meaningfully (named owners, stats, insured/bonded now verifiable). Action remains weak: no
vertical-specific proposal path, no pricing to pre-qualify before a call.

### Persona 2: Fast one-time move-in/out cleaning
**40/100** (flat to slightly down vs. ~48-50) — Relevance 10/25, Clarity 8/25, Trust 12/25, Action 10/25
The content improvements (founder story, FAQ) don't address this persona's urgency-driven, transactional need.
Move-out is still buried in a 7-item vertical list with no dedicated page, timeline promise, or use-case-specific
proof — so this persona saw no real benefit from the recent work.

## Limitations
- No live SERP re-scrape performed this pass; SERP consensus is inherited from the prior GHL-site audit.
- `render_page.py`'s SSRF protection blocks `localhost` by design; pages fetched via direct curl instead, so
  `is_spa`/hydration diagnostics and the accessibility tree were not captured.
- Word counts and schema are from server-rendered HTML only; no post-hydration DOM diff was run.
