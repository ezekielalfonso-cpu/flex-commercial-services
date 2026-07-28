# SXO Findings: flexcommercialservices.com

Analyzed via SERP-backwards methodology against 4 target intents: "commercial cleaning company Cleveland," "office cleaning services Cleveland," "restaurant cleaning service Cleveland," "move out cleaning Cleveland." Pages evaluated: `/`, `/about`, `/services`, `/booking` (all rendered — site runs on GoHighLevel/LeadConnector funnel builder, not the local Astro codebase; a separate finding elsewhere already covers this platform mismatch and leftover "SqueakyCle" branding in testimonials/links).

**SXO Gap Score: 42/100** (separate from SEO Health Score)

---

## Finding 1: Page-Type Mismatch — Landing Page shipped where Service/Local Page is expected
- **Severity:** HIGH
- **Description:** SERP consensus for all four target keywords is dominated (>80%) by dedicated **Service/Local Pages**: Jani-King, ABM, Coverall, CleanNet, Clean Method, Orion Cleaning all rank with explicit process sections ("Core 4 Cleaning Process"), years-in-business credentials, service-area detail, and (for move-out queries) visible hourly pricing ($35–44/hr average shown directly in SERP via Care.com/TaskRabbit aggregators). Flex's `/services` and `/booking` pages are structured as short, CTA-heavy funnel landing pages (221 and 145 words respectively) with a thin one-line "Our Process" mention, no visible pricing, no case studies, and no service-area detail. `/services` meta description promises "Basic, Standard & Premium" plans but none are priced or detailed on-page.
- **Recommendation:** Rebuild `/services` as a true Service Page: process steps (what happens on visit 1, checklist, supplies/equipment used), tiered plan comparison with at least starting price or price range, named service area list (Cleveland + surrounding NEO suburbs), and industry-specific sub-sections (offices, restaurants, fitness centers, schools/daycares) each with their own compliance/trust angle (health-code cleaning for restaurants, custodial standards for schools).

## Finding 2: No visible pricing anywhere in the funnel
- **Severity:** HIGH
- **Description:** Every page requires a form submission or call to learn cost. Competing SERP results for move-out cleaning show pricing directly in aggregator snippets, setting searcher expectation of transparency. This is a hard blocker for the one-time move-out persona who is comparison-shopping quickly and won't wait for a callback.
- **Recommendation:** Add a "starting at $X" price anchor per service tier on `/services`, and a "most move-outs cost $X–$Y, quote in 24 hrs" line on `/booking`.

## Finding 3: H1 not semantically set on any page
- **Severity:** MEDIUM
- **Description:** Parsed H1 arrays for `/`, `/services`, `/booking`, `/about` all returned footer boilerplate ("Quick Links," "Contact Us," "Follow Us") instead of the hero headline — the actual hero text is not wrapped in a real `<h1>`. This weakens both crawlability and the "answer within 10 seconds" clarity signal facilities managers need.
- **Recommendation:** Wrap each page's hero headline in a single, keyword-relevant `<h1>` (e.g., `/services` → "Commercial Cleaning Services in Cleveland, OH").

## Finding 4: No process, credentials, or case-study depth for B2B decision-makers
- **Severity:** MEDIUM
- **Description:** Competing Service Pages lead with tenure ("40+ years"), named methodology, and multi-site proof. Flex shows generic testimonials (some carrying leftover "SqueakyCle" branding — trust-damaging, tracked separately) but no certifications, insurance/bonding statement, or facility-type case studies.
- **Recommendation:** Add an "Our Process" section with 3–4 concrete steps, an insured/bonded/licensed trust bar, and one case study or before/after per target vertical (office, restaurant, gym, school).

## Finding 5: Move-in/move-out treated as an afterthought, not a distinct transactional path
- **Severity:** MEDIUM
- **Description:** Move-out cleaning is mentioned in passing rather than given its own fast-path page/section with turnaround time and simplified booking — the persona who just signed a lease wants speed, not a recurring-contract sales flow.
- **Recommendation:** Give move-in/move-out its own short page or clearly separated `/booking` module: "Need it cleaned by Friday? Get a same-week move-out quote" with a lighter-weight form than the recurring-contract flow.

---

## Persona Scores

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Facilities Manager comparing 3 vendors (recurring office contract) | 14/25 | 10/25 | 8/25 | 18/25 | 50/100 | Needs Work |
| New lessee needing fast one-time move-in/out cleaning | 12/25 | 9/25 | 10/25 | 17/25 | 48/100 | Needs Work |

Both personas share the same weak points: **Clarity** (no scannable pricing/process) and **Trust** (missing credentials, plus off-brand testimonial content). Action scores are the strongest area — CTAs and the booking form itself are present and functional.

## Limitations
- SERP analysis via WebSearch only (no DataForSEO); PAA/ad copy not directly enumerable from these results, so user stories are inferred from ranking-page structure and aggregator pricing data rather than explicit PAA text.
- Site is JS-rendered via GoHighLevel Nuxt app; `parse_html.py`'s automated schema/heading detection under-reported (schema types returned null despite `LocalBusiness` JSON-LD present in raw HTML), so schema markup should be spot-checked manually before final scoring.
- Only 4 keywords sampled; restaurant- and school/daycare-specific SERPs were not independently queried.
