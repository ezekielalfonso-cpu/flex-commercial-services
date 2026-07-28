# Local SEO Audit — Flex Commercial Services (localhost:4321)

Audited pages: `/`, `/about`, `/services`, `/booking`, `/faq`
Method: Direct source inspection (`src/layouts/Layout.astro`, `src/components/Footer.astro`, `src/components/Navbar.astro`, `src/pages/*.astro`) plus rendered HTML via curl. DataForSEO MCP not available — no live GBP data, geo-grid rank checks, or aggregator/citation crawl performed.

## Local SEO Score: 37/100

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| GBP Signals | 25% | 5/25 | No Maps embed, place ID, review widget, or GBP posts indicator detectable anywhere in code. Cannot confirm from the codebase alone whether a GBP listing even exists. |
| Reviews & Reputation | 20% | 4/20 | Only 2 real testimonials + 2 placeholders; no `aggregateRating`/`reviewCount` in schema (correctly omitted — no real data to report); no third-party review presence detected. |
| Local On-Page SEO | 20% | 14/20 | Strong title tags (city+service on every page), NAP visible in footer + nav `tel:` links, hub-and-spoke nav (all pages 1 click deep). Capped by: no dedicated per-service page (7 verticals funnel to one `/services` page — biggest known gap, unchanged), and H1 inconsistency (see New Findings). |
| NAP Consistency & Citations | 15% | 6/15 | NAP itself is now fully consistent (see audit below). Score capped because zero Tier-1 citations (Yelp/BBB/Facebook) detected, no Apple Business Connect / Bing Places evidence. |
| Local Schema Markup | 10% | 7/10 | Well-built: `LocalBusiness`+`ProfessionalService`, structured `areaServed` cities, `WebSite`, `BreadcrumbList`, `FAQPage`, `ContactPage`, `Service`+`OfferCatalog`. Docked for geo precision and missing `openingHoursSpecification` (see New Findings). |
| Local Link & Authority | 10% | 1/10 | No chamber, BBB, press, or community-involvement signals anywhere in code (known, unchanged — requires real-world business development, not code). |

## Business Type: Service-Area Business (SAB) — confirmed correct
No street address anywhere (footer shows "Cleveland, OH 44102" — locality/ZIP only). Schema `address` correctly omits `streetAddress`. `areaServed` is a proper SAB signal. This is the correct, legitimate pattern for a mobile commercial-cleaning business and should not be treated as a defect.

## Industry Vertical: Home Services (commercial cleaning)
No exact Google-supported LocalBusiness subtype exists for commercial/janitorial cleaning specifically (closest generic option is `HomeAndConstructionBusiness`). Current `["LocalBusiness", "ProfessionalService"]` is a defensible choice given no closer match — not flagged as an error.

## NAP Consistency Audit — VERIFIED CLEAN

| Field | Footer (visible HTML) | Nav (`tel:` links) | Schema (`Layout.astro` JSON-LD) | Match? |
|---|---|---|---|---|
| Name | Flex Commercial Services | Flex Commercial Services (logo alt) | Flex Commercial Services | Yes |
| City/State/ZIP | Cleveland, OH 44102 | — | addressLocality: Cleveland, addressRegion: OH, postalCode: 44102 | Yes — the previously flagged 44101/44102 mismatch is resolved |
| Phone | (216)-801-9686 / `tel:2168019686` | `tel:2168019686` (desktop + mobile) | +1-216-801-9686 | Yes |
| Email | teamflexcommercialservices@gmail.com | — | teamflexcommercialservices@gmail.com | Yes |
| Instagram | @teamflexservices → instagram.com/teamflexservices | — | `sameAs`: instagram.com/teamflexservices | Yes — the previously flagged handle mismatch is resolved |

No discrepancies found across footer, nav, and schema sources.

## New Findings (not previously flagged)

1. **[Medium] Geo coordinates under-precise**: `geo.latitude/longitude` = 41.4993 / -81.6944 (4 decimal places). Google guidance calls for minimum 5 decimal places (~1.1m accuracy) for both the meta `geo.position` tag and the schema `GeoCoordinates`. Currently both use the same 4-decimal pair.
2. **[Medium] No `openingHoursSpecification` in schema, and no visible business hours anywhere on the site.** Copy references "24-hour response" and "same-day priority scheduling" (services/faq/booking pages) but never states actual operating hours. Businesses open at query time rank higher (GBP factor #5 per Whitespark); add either standard hours or an explicit "by appointment / 24/7 response" `openingHoursSpecification`.
3. **[Low] `priceRange: "Custom quote"`** is a non-standard value for schema.org `priceRange` (Google's own examples use `$`/`$$`/`$$$` or a numeric range). May not render correctly in Rich Results Test / AI parsers. Consider a numeric range (e.g., `"$$-$$$"`) or omitting the property rather than free text.
4. **[Low] `sameAs` array contains only Instagram.** As citations are built (Yelp, BBB, Facebook, GBP URL), add each as a `sameAs` entry — this is also an AI-citability signal (3 of top 5 AI visibility factors are citation-related per Whitespark 2026).
5. **[Low] H1 city-keyword inconsistency**: Home, About, and Booking H1s include "Cleveland" / local intent; Services H1 ("Commercial Cleaning Services & Plans") and FAQ H1 ("Frequently Asked Questions") do not. Minor — title tags on both already contain the city, so impact is limited, but H1 is a stronger on-page signal.
6. **[Low] `areaServed` inconsistency between schema blocks**: the sitewide `LocalBusiness` entity (Layout.astro) correctly uses 6 structured `City` entities, but the page-level `Service` schema on `/services` still uses `"areaServed": "Northeast Ohio"` as a bare string. Not a NAP issue, but inconsistent structured-data rigor within the same site.
7. **[Info, not scored] Team photos on About page (`public/images/ai-headshot-david.png`, `ai-headshot-riley.png`) are AI-generated headshots, not real photos.** Not a local-pack ranking factor directly, but photo authenticity is an E-E-A-T/trust signal worth flagging for the business owner outside the local SEO scope.

## Confirmed Unchanged / Still-Open (per prior session, not re-flagged as new)
- No GBP embed/reference/review widget on-site.
- Only 2 real testimonials, 2 placeholders; no real aggregate rating.
- No detectable Tier-1 citations (Yelp/BBB/Facebook).
- No chamber/press/authority signals.
- Biggest gap: no dedicated per-service page (7 verticals → one generic `/services` page) — Whitespark's #1 local organic ranking factor and #2 AI visibility factor.

## Top Prioritized Actions

**Critical**
1. Build dedicated service pages for at least the top 2-3 verticals (Medical, Restaurant, Office) with unique, non-doorway content, local proof points, and Service schema per page.

**High**
2. Claim/verify Google Business Profile if not already done; embed Maps/place reference and a review widget once live.
3. Begin systematic review generation (target 10+ reviews, maintain 18-day cadence) — real reviews will unlock legitimate `aggregateRating` schema.
4. Get listed on Yelp, BBB, Facebook, and industry-relevant directories (Thumbtack, Nextdoor per Home Services vertical).

**Medium**
5. Add 5th-decimal geo precision.
6. Add `openingHoursSpecification` + visible hours/availability statement.
7. Claim Bing Places and Apple Business Connect.
8. Align `/services` page `areaServed` with the structured City list used sitewide.

**Low**
9. Fix `priceRange` to a standard format.
10. Add "Cleveland" to Services/FAQ H1s; expand `sameAs` as citations go live.

## Limitations Disclaimer
This audit is code/content-only. It could NOT assess: actual GBP existence, category, or Insights data; real-time local pack position or geo-grid rankings; Domain Authority or comprehensive backlink profile; live citation-directory crawl (Yelp/BBB checked structurally only, not via live search); review velocity/recency (no GBP access); competitor comparison. A DataForSEO-enabled pass or manual GBP audit is recommended to close these gaps.
