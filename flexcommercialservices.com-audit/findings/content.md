# Content Quality & E-E-A-T Findings — flexcommercialservices.com

**Audited pages (production, live site):** `/`, `/about`, `/services`, `/booking` (`/faq` skipped — 301-redirects to `/home`, which is byte-identical to `/`; the deployed live site runs on GoHighLevel/LeadConnector, not the Astro codebase in this repo).

**Content Quality Score estimate: ~38/100**

### E-E-A-T Breakdown

| Factor | Score | Key Signals |
|--------|-------|-------------|
| Experience | 11/25 | Genuine founder-origin narrative on `/about` ("David George and Riley Hinkel... built it from restaurant kitchens, office hallways"), but no photos of real work, no before/after, no case studies; 2 of 4 testimonials confirmed placeholder/leaked-brand, undermining authenticity of the rest |
| Expertise | 7/25 | No certifications, no technical process detail, no team credentials beyond two founder names |
| Authoritativeness | 6/25 | Vague unverifiable claims ("Award-Worthy," "received recognition... praise from local businesses") with no named award, platform, or rating; no press/association mentions |
| Trustworthiness | 10/30 | Phone/email consistent site-wide, HTTPS, LocalBusiness schema with NAP; but zero insurance/bonding/licensing mentions anywhere, no privacy/terms links found, and a leaked competitor brand name ("SqueakyCle"/"SqueakyClean") appears in a homepage testimonial alongside placeholder testimonial content |

### AI Citation Readiness: ~22/100
No quotable stats, guarantees, or numeric facts (years in business, clients served, response time) on any live page; FAQ content (the most naturally AI-citable format) is not live.

---

## Finding 1: Leaked competitor brand + placeholder testimonials on the homepage

**Severity:** Critical

**Description:** The homepage (and its duplicate `/home`) displays a testimonial block naming "SqueakyCle"/"SqueakyClean" — an unrelated business, not Flex Commercial Services — including an "About SqueakyCle" link, alongside a second testimonial. Other specialists confirmed 2 of the 4 site-wide testimonials are literally marked PLACEHOLDER in source. This is unedited GoHighLevel template/snapshot content shipped to production. It is one of the strongest negative trust signals a rater (or an AI system scraping for quotable social proof) could encounter.

**Recommendation:** Remove all placeholder/leaked-brand content immediately; replace with real, attributed reviews (full name + company, ideally linked to Google Business Profile).

## Finding 2: `/` and `/home` are duplicate content with no canonical tag

**Severity:** High

**Description:** Root and `/home` return identical title, meta description, 276-word body, and heading structure, with no `<link rel="canonical">` on either. `/faq` redirects into this duplicate rather than resolving to real content. Canonical host is also inconsistent site-wide (`/about` and `/booking` canonicalize to `www`, `/services` to bare domain).

**Recommendation:** Pick one canonical homepage URL, 301-redirect the other, add self-referencing canonicals with a consistent host across all pages, and restore a real `/faq` page.

## Finding 3: No dedicated content for the 5 named service verticals

**Severity:** High

**Description:** Homepage lists Restaurant/Office/Fitness Center/School-Daycare/Move-In-Out Cleaning as bare H2 card headings with zero body copy; `/services` (207 words, vs. the 800-word service-page floor) covers only generic Basic/Standard/Premium pricing tiers and never mentions any of the five verticals by name — a direct relevance gap against target keywords like "restaurant cleaning Cleveland."

**Recommendation:** Build ~500-800 words of unique, specific copy per vertical (compliance standards, frequency, equipment).

## Finding 4: No insurance, bonding, licensing, or credential signals anywhere

**Severity:** High

**Description:** Zero matches for "insur," "bond," "licens," "certifi," "founded," or "since [year]" across all four live pages — a critical B2B trust gap for commercial cleaning.

**Recommendation:** Add explicit insurance/bonding statement, relevant certifications, and years-in-business to `/about` and the homepage.

## Finding 5: Thin content and internal duplication

**Severity:** Medium

**Description:** Word counts fall below topical-coverage floors site-wide: homepage 276 (floor 500), services 207 (floor 800), about 318, booking 132 — with a boilerplate paragraph repeated verbatim twice on `/booking`. Improper heading hierarchy compounds this: the real hero copy is only H2 while non-descriptive footer labels ("Quick Links," "Contact Us," "Follow Us") are marked H1, duplicated twice in the DOM.

**Recommendation:** Expand each page with genuine topical depth; fix the duplicated booking paragraph; enforce one descriptive H1 per page.

---

## What's Working

- LocalBusiness JSON-LD schema present on all four pages with consistent phone/email NAP.
- HTTPS site-wide with consistent footer contact info and click-to-call.
- `/about` contains a genuinely specific founder-origin narrative (named founders, concrete work history) that is a real Experience signal once separated from the placeholder-testimonial issue.
- Clean, consistent CTA structure ("Book a Service") across pages.
