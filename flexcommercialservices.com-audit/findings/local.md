# Local SEO Findings — flexcommercialservices.com

**Audited pages (production, live site):** `/`, `/about`, `/services`, `/booking` (`/faq` skipped — redirects to `/home` in production).
**Business type detected:** Service-Area Business (SAB) — no street address on any page or in schema; phone + city/region only. This is a legitimate pattern for a mobile commercial cleaning company and is not flagged as a NAP defect.
**Industry vertical:** Home/Commercial Services (cleaning).
**Fetch method:** `render_page.py --mode never` (raw HTML) against the live production domain. The site is served via a GoHighLevel/LeadConnector funnel builder, not the Astro rebuild in this repo — the audited pages are what searchers and Google currently see.

**Local SEO Score estimate: ~27/100**

| Dimension | Weight | Est. Score | Notes |
|---|---|---|---|
| GBP Signals | 25% | 15/100 | No Maps embed, review widget, "Google" mention, or GBP link found on any of the 4 pages |
| Reviews & Reputation | 20% | 15/100 | 2 static testimonials, no ratings/aggregateRating, one testimonial has wrong brand name |
| Local On-Page SEO | 20% | 45/100 | City/state in titles, phone + tel: link everywhere, but no dedicated service pages or map |
| NAP Consistency & Citations | 15% | 40/100 | Phone/email/city consistent site-wide; zero Tier-1 citations found; Instagram handle mismatch |
| Local Schema Markup | 10% | 45/100 | LocalBusiness JSON-LD present on all 4 pages but generic type, missing most recommended fields |
| Local Link & Authority | 10% | 10/100 | No BBB, chamber, press, or community-signal mentions detected |

---

## Finding 1: Homepage testimonial displays a different, unrelated business name

**Severity:** Critical

**Description:** The homepage renders two testimonial cards. The first reads: *"— SqueakyClean … Our office has never looked better! SqueakyClean's team delivered impeccable service and transformed our workspace into a productive haven. – Ashley B."* followed by an "About SqueakyClean" link. This is template/demo content that was never replaced with the client's own brand — "SqueakyClean" is not Flex Commercial Services. A second, correctly-branded testimonial from "Rick W." also appears. A visitor (and Google, if this content is ever screenshotted/cited by AI search) sees an unrelated competitor name as social proof on the homepage.

**Recommendation:** Replace or delete the "SqueakyClean" testimonial immediately. Audit the entire live site for other leftover template placeholder copy. Populate the homepage with 3-5 real, attributed customer quotes (ideally sourced from actual Google reviews once a GBP review base exists).

## Finding 2: No Google Business Profile signals detectable anywhere on-site

**Severity:** Critical

**Description:** Across `/`, `/about`, `/services`, and `/booking`, there is zero reference to Google: no embedded Google Maps iframe, no "Find us on Google" / "Read our Google reviews" link, no GBP review widget, no place-ID reference, and the word "Google" does not appear once in any page's HTML. Since GBP signals are weighted 25% of local score and Primary GBP category is the single highest-scoring individual local pack factor (Whitespark 2026, score 193), an unreferenced or unclaimed GBP is a major visibility gap. It is not possible to confirm from the website alone whether a GBP listing exists at all — this needs to be checked directly in Google Maps/Search (outside this audit's scope, see Limitations).

**Recommendation:** Confirm a GBP listing exists and is verified; if not, create and verify one immediately with an accurate primary category (e.g., "Commercial Cleaning Service" — avoid generic "Cleaning Service"). Once verified, add an embedded Maps widget or a "Find us on Google / Leave a review" link in the footer of every page, and link out to the GBP profile from the booking/contact page.

## Finding 3: No dedicated landing page per service line

**Severity:** High

**Description:** The homepage lists five distinct service categories — Restaurant Cleaning, Office Cleaning, Fitness Center Cleaning, School/Daycare Cleaning, Move-In/Move-Out Cleaning — each with its own "Service Details" button. All five buttons link to the same generic `/services` URL, which itself only differentiates by pricing tier (Basic/Standard/Premium), not by service vertical. There is no `/services/restaurant-cleaning`, `/services/office-cleaning`, etc. Dedicated service pages are the **#1 local organic ranking factor and #2 AI-visibility factor** per Whitespark 2026 — this is arguably the single highest-leverage gap found in this audit.

**Recommendation:** Build a dedicated page per core service (restaurant, office, fitness center, school/daycare, move-in/move-out), each with unique copy, service-specific FAQs, industry-relevant testimonials, a `Service` schema block (`serviceType` + `areaServed` + `provider`), and internal links back to `/booking`. Avoid making these pages a "swap test" doorway pattern — each should read as genuinely different content, not just a city/service token swap.

## Finding 4: Instagram handle mismatch between schema, footer link, and known handle

**Severity:** High

**Description:** The footer's live "Follow Us" Instagram link (present on every page, correct across all 4) points to `instagram.com/teamflexservices`, matching the business's actual handle. However, the homepage's `LocalBusiness` JSON-LD `sameAs` array points to a different URL: `https://www.instagram.com/flexcommercialservices` — an account that does not match the real handle. This is a citation-adjacent NAP discrepancy: Google and AI crawlers reading structured data will associate the business with the wrong social profile, diluting the entity-linking benefit `sameAs` is meant to provide.

**Recommendation:** Update the `sameAs` array in the homepage JSON-LD to `https://www.instagram.com/teamflexservices`. Add the same `sameAs` array (Instagram + any future Facebook/GBP/Yelp URLs) consistently to the `about`, `services`, and `booking` schema blocks — currently only the homepage schema has a `sameAs` property at all.

## Finding 5: LocalBusiness schema present but incomplete and inconsistent across pages

**Severity:** Medium

**Description:** JSON-LD is present on all 4 audited pages, which is better than baseline expectation — however:
- Generic `@type: "LocalBusiness"` is used instead of an industry-appropriate subtype. Schema.org has no dedicated "commercial cleaning" type, but `DryCleaningOrLaundry`/`HomeAndConstructionBusiness`-adjacent types don't fit either; `LocalBusiness` is acceptable here but should still carry `additionalType` or a clear `description` (which it does).
- `geo` coordinates appear only on the homepage (41.4993, -81.6944) — 4 decimal places, one short of the recommended 5+ decimal minimum (~1.1m accuracy) — and are absent from `/about`, `/services`, `/booking`.
- No page has `openingHoursSpecification`, `image`, `aggregateRating`, or `priceRange`.
- `areaServed: "Northeast Ohio"` appears on home/about/booking schema but is missing from the nested `provider` object on `/services`.
- On `/services` and `/booking`, `LocalBusiness` is only nested as a `provider`/sub-property (under `Service` and `ContactPage` respectively) rather than existing as its own top-level entity — acceptable but weaker for entity consolidation; consider adding `@id` references tying all instances back to one canonical business entity.

**Recommendation:** Standardize one canonical `LocalBusiness` JSON-LD block (with `@id`) referenced via `provider`/`mainEntity` on subpages rather than duplicating/varying fields. Add `geo` (5-decimal precision) and `sameAs` to every page, add `openingHoursSpecification`, and add at least one `image` and (once reviews exist) `aggregateRating`.

## Finding 6: No visible ratings, review counts, or third-party review presence

**Severity:** Medium

**Description:** The only review-adjacent content is 2 unstructured testimonial quotes on the homepage (see Finding 1) — no star rating, no review count, no `aggregateRating` schema, no date/recency indicator, and no link to a review platform. A search for "Flex Commercial Services" + Cleveland cleaning returned no visible Yelp, BBB, Facebook, or GBP listings in Google/Bing search results (see Finding 9 for citation detail). Review count and velocity are ~20% of local pack weight and reviews under 10 total miss the "Magic 10" threshold that produces a documented ranking boost (Sterling Sky).

**Recommendation:** Prioritize collecting the first 10+ Google reviews (magic threshold) and maintain at least one new review every 18 days to avoid the ranking "cliff" Sterling Sky documented for review-inactive listings. Add `aggregateRating` schema once a real review base exists. Never gate/pre-screen reviewers before directing to Google (FTC prohibited, up to $53,088/violation).

## Finding 7: Service area described generically, with no named submarkets

**Severity:** Medium

**Description:** Every page's copy and schema describe the service area only as "Cleveland and Northeast Ohio" (meta description, schema `areaServed`) or "Businesses across Northeast Ohio" (about page body copy). No specific suburbs, neighborhoods, or secondary cities are named anywhere (e.g., Lakewood, Parma, Westlake, Akron, Solon, Beachwood). For an SAB, `areaServed` with explicitly named cities is the schema.org-supported, industry-recommended pattern, and named-city content on the page itself supports broader local-intent keyword coverage.

**Recommendation:** Add a short "Areas We Serve" section (footer or dedicated page) listing 8-15 named Cleveland-area suburbs/cities, and mirror that list as multiple `areaServed` `Place` entries in schema (each with `sameAs` to the relevant Wikipedia/Wikidata entry where practical).

## Finding 8: No business hours displayed anywhere on-site

**Severity:** Medium

**Description:** None of the 4 pages state operating hours, availability, or response-time expectations (e.g., "Mon–Fri 8am–6pm" or "24/7 emergency response"). "Business open at time of search" is a confirmed local pack ranking factor (Whitespark #5), and hours also affect user trust/conversion on the booking page specifically.

**Recommendation:** Publish hours (or explicit "by appointment"/"24/7" language) in the footer and on `/booking`, and add matching `openingHoursSpecification` to schema.

## Finding 9: No detectable Tier-1 citation presence (Yelp, BBB, Facebook)

**Severity:** Medium

**Description:** Bing and Google web searches for `"Flex Commercial Services" Cleveland cleaning` returned no matching results from Yelp, BBB, Facebook, Nextdoor, or any directory — only unrelated companies also named "Flex." Direct fetch of Yelp's search endpoint returned a 403 (bot-blocked), so a Yelp listing cannot be fully ruled out, but no independent citation of this business was found through any available public search channel. Combined with the total absence of on-site GBP/Facebook/Yelp links, this suggests the business currently has little to no citation footprint outside its own website and Instagram.

**Recommendation:** Claim/create listings on Google Business Profile, Facebook Business, Yelp, BBB, Apple Business Connect, and Bing Places, using identical NAP to the website (phone (216) 801-9686, "Cleveland, OH", areaServed Northeast Ohio). Add outbound links to each from the site footer once live. For the home/commercial-services vertical, also prioritize Thumbtack, Nextdoor, and BBB accreditation (BBB has above-average trust value for verification in Google's local algorithm).

## Finding 10: `url` field in schema uses `www` while the live/canonical domain is non-`www`; no canonical tag found

**Severity:** Low

**Description:** All 4 schema blocks set `"url": "https://www.flexcommercialservices.com"`, but the site's actual/working domain is non-`www` (`https://flexcommercialservices.com`); `www` and `http` variants do correctly 301-redirect to the canonical non-`www` HTTPS URL, so this is not currently broken, but it is an inconsistency between the declared entity URL and the resolved canonical. No `<link rel="canonical">` tag was found in the homepage `<head>` in the raw HTML fetched.

**Recommendation:** Update schema `url` values to the non-`www` canonical form site-wide, and confirm canonical tags are present on all pages (may already be injected client-side by the funnel builder — verify with a rendered/JS-executed fetch, which this audit's environment could not perform; see Limitations).

---

## What's Working

- **NAP phone/email consistency:** `(216) 801-9686` and `teamflexcommercialservices@gmail.com` are identical across visible footer content and JSON-LD schema on all 4 audited pages, with a working `tel:` click-to-call link site-wide.
- **City/state in titles:** Title tags correctly include "Cleveland, OH" on home, about, and services pages, supporting local relevance signals.
- **LocalBusiness schema baseline:** Structured data is present on every page audited (not universal for small business sites) and correctly omits `streetAddress`, matching the legitimate SAB business model — no false/fabricated address risk.
- **Instagram link (footer):** Correctly points to the real `@teamflexservices` handle (only the schema `sameAs` is wrong — see Finding 4).

---

## Limitations

- No DataForSEO MCP available: real-time local pack position, geo-grid ranking, and live GBP Insights data (impressions, direction requests, call clicks, photo views) could not be assessed.
- Whether a Google Business Profile actually exists/is verified could not be confirmed — only its absence of *on-site reference* was assessed. Recommend a direct Google Maps search for the business name to confirm.
- Playwright rendering was unavailable in this environment; pages were audited via raw HTML fetch. The site's funnel-builder (GoHighLevel/LeadConnector) may client-side-inject additional elements (canonical tags, chat widgets, popups) not captured here — a rendered-DOM pass is recommended to confirm.
- Yelp search was bot-blocked (403); BBB and Facebook were checked only via third-party search engine results, not direct API/site queries — citation absence is inferred, not exhaustively confirmed.
- Domain Authority, comprehensive backlink profile, and review sentiment analysis were out of scope (no paid tool access).
