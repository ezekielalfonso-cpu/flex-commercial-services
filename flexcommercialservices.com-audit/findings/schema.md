# Schema.org / Structured Data Audit — flexcommercialservices.com (LIVE production)

Audited: `/`, `/home`, `/about`, `/services`, `/booking` (all 200 OK).
`/faq` currently redirects to `/home` — skipped (stale deployment per environment notes).
Method: raw HTTP fetch of production HTML (`render_page.py --mode never`), regex-extracted `<script type="application/ld+json">` blocks, validated with `json.loads()`. No Microdata or RDFa detected on any page.

**Platform note:** The live site's HTML (GoHighLevel/LeadConnector page builder markers, `cdn.filesafe.space` assets) is **not** the Astro codebase in this repo. The local `src/layouts/Layout.astro` contains a *different, more complete* LocalBusiness block (adds `@id`, `image`, `postalCode: "44102"`, E.164 phone) that is not live yet, and the local Astro source currently has **no** page-specific Service/ContactPage JSON-LD at all — meaning a straight deploy of the current Astro repo would fix the address/image gaps below but **regress** the Service and ContactPage schema that already exists live. Port those blocks into `services.astro`/`booking.astro` before cutover.

---

## Detection Summary

| Page | @type(s) found | Valid JSON? | geo | sameAs |
|---|---|---|---|---|
| `/` | LocalBusiness | ✅ | ✅ | ✅ |
| `/home` | LocalBusiness | ✅ | ✅ | ✅ |
| `/about` | LocalBusiness | ✅ | ❌ missing | ❌ missing |
| `/services` | Service (provider: LocalBusiness) + OfferCatalog/Offer (3 plans) | ✅ | ❌ | ❌ |
| `/booking` | ContactPage (provider: LocalBusiness) | ✅ | ❌ | ❌ |

No Organization, WebSite, BreadcrumbList, or Review/AggregateRating schema found on any page.

---

## Findings

### 1. [HIGH] Incomplete PostalAddress — missing `streetAddress` and `postalCode`
Every LocalBusiness block on the live site (`/`, `/home`, `/about`, `/services`, `/booking`) only includes `addressLocality`, `addressRegion`, `addressCountry`. Google's local business structured data guidance treats a full `PostalAddress` (with `streetAddress` + `postalCode`) as the minimum bar for reliable entity/NAP matching against Google Business Profile — this directly affects map-pack entity confidence.
**Recommendation:** Add `streetAddress` and `postalCode` (local Astro source already has `postalCode: "44102"` — confirm street address before publishing if this is a service-area business without a public storefront; SABs may legitimately omit `streetAddress` and set `hideAddress`-style handling, but `postalCode` should always be included).

### 2. [HIGH] Inconsistent entity data across pages (NAP/geo fragmentation)
`geo` (GeoCoordinates) and `sameAs` (Instagram) appear on `/` and `/home` but are **absent** on `/about`, `/services`, and `/booking`. Duplicating the LocalBusiness entity per-page with inconsistent properties weakens entity consolidation and risks Google treating these as slightly different entities.
**Recommendation:** Use one canonical LocalBusiness object (ideally with a stable `@id`) referenced via `"provider": {"@id": "https://www.flexcommercialservices.com/#business"}` on every page, so all pages point to the identical, fully-populated entity instead of re-declaring partial copies.

### 3. [MEDIUM] No `openingHoursSpecification` or `priceRange`
Neither property appears anywhere. Both are Google-recommended for LocalBusiness and support "Open now" / hours display and business-tier categorization in local search and AI answers.
**Recommendation:** Add real business hours and a `priceRange` (e.g. `"$$"` or a text descriptor like `"Custom quote"`).

### 4. [MEDIUM] Generic `@type: LocalBusiness` — no more specific subtype available, but under-leveraged
Schema.org/Google do not define a dedicated `CleaningService` type, so `LocalBusiness` alone is an acceptable fallback for a commercial/janitorial B2B provider. However, layering a second type sharpens entity classification with no downside.
**Recommendation:** Use `"@type": ["LocalBusiness", "ProfessionalService"]`.

### 5. [MEDIUM] No BreadcrumbList
None of the 5 pages include BreadcrumbList markup. Low-cost addition that reinforces site hierarchy for both classic rich results and AI crawlers/citation.

### 6. [INFO] Testimonials on homepage are not marked up as Review/AggregateRating — correctly so, for now
4 testimonials render on `/` with 5-star visuals, but the Astro source (`src/pages/index.astro`) explicitly flags 2 of the 4 as `// PLACEHOLDER — replace with real client testimonial`. **Do not** add Review/AggregateRating schema against placeholder or unverified quotes — this risks a manual action for fabricated ratings. Once real, attributable reviews exist (ideally synced from Google Business Profile), add Review + AggregateRating.

### 7. [INFO] No Organization or WebSite schema
Not critical for a single-location LocalBusiness (LocalBusiness already carries the org identity), but a minimal WebSite block reinforces brand entity for AI/LLM citation.

### 8. [INFO] FAQPage — not yet applicable
`/faq` isn't live (redirects to `/home`). Per current policy, Google retired FAQ rich results for all sites (May 7, 2026) — do not implement FAQPage for SERP benefit once `/faq` ships. Info-level only, for potential AI/LLM citation value.

### 9. [PASS] What's already correct
- JSON-LD used exclusively (no Microdata/RDFa) ✅
- `@context: "https://schema.org"` (https) on all blocks ✅
- All JSON-LD blocks are syntactically valid (parsed clean with `json.loads`) ✅
- No deprecated types (HowTo, SpecialAnnouncement, etc.) present ✅
- `Service` + `hasOfferCatalog` + `Offer`/`itemOffered` pattern on `/services` correctly models the 3 tiered cleaning plans without fabricating prices ✅
- `ContactPage` type is appropriate for the `/booking` quote-request page ✅
- `geo` coordinates present (where included) and NAP phone/email consistent in value across pages ✅

---

## Ready-to-Use JSON-LD

### Consolidated LocalBusiness (replace per-page duplicates; place once, referenced by `@id` elsewhere)
```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://www.flexcommercialservices.com/#business",
  "name": "Flex Commercial Services",
  "description": "Professional commercial cleaning company serving Cleveland and Northeast Ohio. Specializing in janitorial services, medical sanitization, and post-event cleanup.",
  "url": "https://www.flexcommercialservices.com",
  "telephone": "+1-216-801-9686",
  "email": "teamflexcommercialservices@gmail.com",
  "image": "https://assets.cdn.filesafe.space/jGKx4eTTbP1enXZEBWxm/media/68124cf13176b90a9f675eb4.png",
  "priceRange": "Custom quote",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street Address]",
    "addressLocality": "Cleveland",
    "addressRegion": "OH",
    "postalCode": "44102",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.4993,
    "longitude": -81.6944
  },
  "areaServed": "Northeast Ohio",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "17:00"
  },
  "sameAs": [
    "https://www.instagram.com/flexcommercialservices"
  ]
}
```

### BreadcrumbList (example for /services)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.flexcommercialservices.com/" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.flexcommercialservices.com/services" }
  ]
}
```

### WebSite (place once, e.g. homepage only)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.flexcommercialservices.com/#website",
  "url": "https://www.flexcommercialservices.com",
  "name": "Flex Commercial Services",
  "publisher": { "@id": "https://www.flexcommercialservices.com/#business" }
}
```

### Review/AggregateRating (DO NOT implement until real, verified reviews replace placeholders)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.flexcommercialservices.com/#business",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[Real average, e.g. 4.9]",
    "reviewCount": "[Real count of verified reviews]"
  }
}
```
