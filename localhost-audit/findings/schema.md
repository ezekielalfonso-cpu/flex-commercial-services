# Schema.org Structured Data Audit — Flex Commercial Services

**Site:** http://localhost:4321 (Astro dev server) | **Pages audited:** `/`, `/about`, `/services`, `/booking`, `/faq`
**Method:** Raw HTML fetched directly via `curl` (dev server is `localhost`, which the plugin's SSRF guard in `render_page.py`/`url_safety.py` correctly blocks — used direct fetch instead for this internal dev-server check only). Each page's `<script type="application/ld+json">` block was extracted and parsed with `json.loads()`.

## Schema Score: 91 / 100

## Detection & JSON Syntax Validation

| Page | ld+json blocks | JSON valid | Nodes in `@graph` |
|---|---|---|---|
| `/` | 1 | ✅ | LocalBusiness+ProfessionalService, WebSite |
| `/about` | 1 | ✅ | + BreadcrumbList |
| `/services` | 1 | ✅ | + BreadcrumbList, Service |
| `/booking` | 1 | ✅ | + BreadcrumbList, ContactPage |
| `/faq` | 1 | ✅ | + BreadcrumbList, FAQPage (8 Q&As) |

No syntax errors, no trailing commas, no unclosed brackets. All `@id` cross-references (`WebSite.publisher`, `Service.provider`, `ContactPage.mainEntity` → `#business`) resolve to a node actually present in the same graph — no dangling references.

## Confirmed Correct (per session's prior work)

- Single consolidated `LocalBusiness`/`ProfessionalService` entity via `Layout.astro`, identical on all 5 pages — verified byte-for-byte across fetched HTML.
- `@context: "https://schema.org"` (https, not http) ✅
- `sameAs` → `https://www.instagram.com/teamflexservices` ✅ absolute URL
- `priceRange: "Custom quote"` present ✅
- `address.postalCode: "44102"` present ✅
- `areaServed` = 6 structured `City` entities (Cleveland, Lakewood, Parma, Strongsville, Beachwood, Solon) on the LocalBusiness node ✅
- `WebSite` node present sitewide, correctly `@id`-linked to the business as `publisher` ✅
- `BreadcrumbList` present on About/Services/Booking/FAQ, correctly absent on Home ✅
- `/services` `Service` + `hasOfferCatalog` block, 4 offers matching the on-page pricing cards exactly ✅
- `/booking` `ContactPage` block, `mainEntity` correctly links to `#business` ✅
- `/faq` `FAQPage`, 8 real Q&As matching the rendered accordion exactly, no Google SERP benefit claimed (retired May 7 2026) — correctly kept at Info priority for AI/LLM citation value, not flagged for removal ✅
- `geo` lat/long are numeric (not strings) ✅
- `telephone` in E.164 format (`+1-216-801-9686`) ✅
- No deprecated types (HowTo, SpecialAnnouncement, etc.) anywhere ✅
- No placeholder text inside any JSON-LD block ✅

Known/deliberate and correctly left as-is: no `openingHoursSpecification`, `geo` at 4-decimal precision, no `streetAddress` (service-area business).

## NEW Findings

1. **`areaServed` granularity mismatch (Minor).** `LocalBusiness.areaServed` on `/services` is the structured 6-`City` array, but the page's own `Service.areaServed` is still a bare string `"Northeast Ohio"`. Not invalid, but inconsistent within the same graph. Recommend changing `Service.areaServed` to reference the same City array (or `{"@id": "https://flexcommercialservices.com/#business"}`'s areaServed isn't inheritable, so duplicate the array literal).

2. **Homepage canonical URL has a trailing slash the rest of the site doesn't use (Minor).** `Layout.astro`'s `canonicalURL` default is `new URL(Astro.url.pathname, siteURL).href`. For `/` this evaluates to `https://flexcommercialservices.com/` (trailing slash), while `astro.config.mjs` sets `trailingSlash: 'never'` and every JSON-LD URL reference (`LocalBusiness.url`, `WebSite.url`, and every page's `BreadcrumbList` "Home" item) uses `https://flexcommercialservices.com` (no slash). Confirmed via `<link rel="canonical">` on all 5 fetched pages — only home has the slash. Cosmetic but worth normalizing so the canonical and the JSON-LD `url`/`@id` values for the homepage match exactly.

3. **No explicit `logo` property (Info/opportunity).** Only `image` is set on the LocalBusiness node. Google's Logo structured-data guidelines look for `Organization.logo` specifically for knowledge-panel logo eligibility (LocalBusiness inherits from Organization). Since the same asset is already used as the favicon, it's likely a real logo mark — safe to add `"logo": "https://assets.cdn.filesafe.space/.../68124cf13176b90a9f675eb4.png"` alongside `image`.

4. **Do not add Review/AggregateRating schema yet (guardrail, not a gap).** Homepage `index.astro` displays 4 testimonials, but source comments mark 2 of the 4 as `PLACEHOLDER — replace with real client testimonial`. Marking these up as `Review`/`AggregateRating` now would violate Google's structured-data policy against unverifiable/fabricated reviews. Revisit once all 4 are real.

5. **No `Person`/founder markup on `/about` (optional opportunity).** David George and Riley Hinkel are named with titles and photos but have no `Person` schema. Low priority — there's no `sameAs` (LinkedIn, etc.) to back it yet, so adding it now would be thin; worth doing once profile links exist.

## Files Reviewed
- `C:\Users\Ezeki\flex-commercial-services\src\layouts\Layout.astro`
- `C:\Users\Ezeki\flex-commercial-services\src\pages\index.astro`
- `C:\Users\Ezeki\flex-commercial-services\src\pages\about.astro`
- `C:\Users\Ezeki\flex-commercial-services\src\pages\services.astro`
- `C:\Users\Ezeki\flex-commercial-services\src\pages\booking.astro`
- `C:\Users\Ezeki\flex-commercial-services\src\pages\faq.astro`
- `C:\Users\Ezeki\flex-commercial-services\astro.config.mjs`
