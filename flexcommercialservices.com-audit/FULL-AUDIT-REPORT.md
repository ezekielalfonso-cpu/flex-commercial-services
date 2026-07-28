# SEO Health Audit — flexcommercialservices.com

**Audit date:** 2026-07-27
**Business type:** Local Service (Service-Area Business) — commercial cleaning, Cleveland/Northeast Ohio
**Pages audited (live, 200 status):** `/`, `/home`, `/about`, `/services`, `/booking` (`/faq` excluded — 301-redirects to `/home` in production)

---

## The one fact that reframes this entire audit

**The live production site is not the Astro codebase in this git repository.** Response headers, cookies, and markup patterns (GoHighLevel/LeadConnector builder signatures, `leadconnectorhq.com` asset hosts, Vue teleport-anchor comments) confirm flexcommercialservices.com is currently served by a **GoHighLevel funnel**, behind Cloudflare. The Astro rebuild in this repo — the one with 14 modified components/pages, Tailwind v4, `@astrojs/sitemap` correctly configured — has **never been deployed**.

Nearly every finding below describes the live GHL site, not this repo. None of them can be fixed by editing files here; they require access to the GoHighLevel/Cloudflare account. See "Strategic Decision Required" at the end.

A second, independently-confirmed critical issue: the live site's homepage testimonials and several buttons reference **a different, unrelated business — "SqueakyCle"/"SqueakyClean"** — including outbound links to `squeakycle.com`, a `squeakycle@gmail.com` contact, and mismatched aria-labels. This is leftover GoHighLevel template content that was never rebranded, and it was independently flagged by 4 of the 10 specialist audits (technical, content, GEO, local) as one of the most damaging issues found.

---

## SEO Health Score: 39/100 (Poor)

| Category (plugin weighting) | Weight | Score | Contribution |
|---|---|---|---|
| Technical SEO (technical + sitemap blended) | 22% | 32/100 | 7.0 |
| Content Quality | 23% | 38/100 | 8.7 |
| On-Page SEO (SXO/page-intent proxy) | 20% | 42/100 | 8.4 |
| Schema / Structured Data | 10% | 58/100 | 5.8 |
| Performance (CWV, lab-only) | 10% | 45/100 | 4.5 |
| AI Search Readiness (GEO) | 10% | 32/100 | 3.2 |
| Images | 5% | ~30/100 | 1.5 |
| **Weighted Total** | | | **39/100** |

**Supplementary categories** (not in the core 7-weight model, but audited and important):

| Category | Score | Note |
|---|---|---|
| Local SEO | 27/100 | Lowest individual score — zero GBP signals detectable on-site |
| Visual / Mobile UX | 74/100 | Highest score — layout is clean, main gap is CTA placement |
| Backlinks | Insufficient data | Tier 0 only (no Moz/Bing keys); expected for a young domain, not a defect |
| SXO (Search Experience) | 42/100 | Page-type mismatch vs. competitors dominating target SERPs |

---

## Critical Findings (fix immediately)

1. **Leaked competitor brand "SqueakyCle" live on the homepage** — testimonial, "About SqueakyCle" button, outbound links to squeakycle.com/booking, squeakycle@gmail.com contact. *(technical, content, geo, local — independently confirmed)*
2. **robots.txt returns 200 OK with a completely empty body** — no directives, no sitemap reference.
3. **No XML sitemap reachable anywhere** — `/sitemap-index.xml` (where Astro's integration would publish) 301s into a catch-all redirect; `/sitemap.xml` returns 200 with zero bytes.
4. **Catch-all redirect swallows every unmatched path into `/home` with a 301** — confirmed across 8+ test paths including `/faq` (which exists in this repo's committed history but isn't live). No real 404 handling exists.
5. **Canonical tag chaos** — `/` and `/home` (duplicate content) have no canonical at all; `/about` and `/booking` canonicalize to `www`, which itself 301-redirects to non-www (self-contradicting canonical); `/services` canonicalizes to non-www. Google is left to guess the canonical host.
6. **`/services` LCP is 20.3 seconds; `/booking` LCP is 7.45 seconds** (both lab-measured, "Poor"). Root cause: ~40 chained GoHighLevel builder JS files loaded from `_preview` asset paths — naming that suggests possibly-unpublished draft assets are live in production. Worth confirming directly with whoever manages the GHL account.
7. **Zero on-site Google Business Profile signals** — no Maps embed, no review widget, no mention of "Google" anywhere across all 4 pages. Whether a GBP listing even exists could not be confirmed from the website alone.

---

## High Findings

- **No security headers anywhere** (no HSTS, CSP, X-Frame-Options, X-Content-Type-Options) — Cloudflare/GHL-level config gap.
- **`/booking` disables pinch-to-zoom** (`user-scalable=no`) — WCAG 1.4.4 mobile accessibility failure, on the page where it costs the most.
- **No tap-to-call phone number above the fold** — the only `tel:` link on the site is in the footer; mobile visitors must scroll past the entire page, including the booking form, to find a clickable number.
- **No dedicated page per service vertical** — Restaurant, Office, Fitness Center, School/Daycare, and Move-In/Out Cleaning all funnel to one generic `/services` page differentiated only by price tier. Flagged as the single highest-leverage local-SEO gap (Whitespark's #1 local organic ranking factor).
- **No visible pricing anywhere in the funnel** — a hard blocker for the comparison-shopping move-out-cleaning searcher; competing SERP results show pricing directly.
- **Zero insurance/bonding/licensing/certification mentions** — critical B2B trust gap for a commercial cleaning vendor.
- **Incomplete/inconsistent LocalBusiness schema** — missing `streetAddress`/`postalCode`; `geo` and `sameAs` present only on the homepage, absent elsewhere.
- **Schema `sameAs` points to the wrong Instagram handle** (`flexcommercialservices` instead of the real `teamflexservices`, which the footer link correctly uses).
- **CLS fails "Good" on all 4 pages** (homepage 0.254 = Poor) — driven by unsized images popping into layout.
- **Homepage ships 11.68MB**, dominated by a single 4.71MB hotlinked Unsplash JPEG.
- **No local citation footprint** — no detectable Yelp, BBB, Facebook, or directory listings anywhere.
- **No measurable backlink profile** — expected at this stage for a young local-business domain, but a real gap to start closing.

---

## Medium Findings

- Heading structure misuse: homepage has 7 `<h1>` tags (footer labels mismarked); no page has its real hero headline semantically wrapped as an H1.
- Heavy, unscoped Google Fonts request (all weights/styles of 3 font families) blocking render.
- IndexNow protocol not implemented.
- No `openingHoursSpecification`, `priceRange`, or `BreadcrumbList` in schema anywhere.
- No business hours displayed anywhere on-site.
- Service area described only generically ("Cleveland and Northeast Ohio") — no named suburbs.
- No visible ratings/review count; only 2 testimonials total (need 10+ for the documented "Magic 10" local-ranking threshold).
- Thin content site-wide, all pages below topical-depth floors (homepage 276w/500 floor, services 207w/800 floor, about 318w, booking 132w with a duplicated paragraph).
- No self-contained, AI-citable answer blocks — no quotable pricing, guarantees, or response-time facts anywhere.
- `/llms.txt` exists but is a 0-byte stub.
- Homepage hero CTA routes to `/services`, not directly to booking — adds friction for ready-to-convert visitors.
- Move-in/move-out cleaning treated as an afterthought rather than a distinct fast-track transactional path.

---

## What's Already Working

- HTTPS enforcement and www→non-www redirects are clean, single-hop, and correctly configured.
- JSON-LD LocalBusiness/Service/ContactPage structured data present and syntactically valid on every page — a genuine relative strength.
- Content is present in raw, pre-JS HTML (not a blind SPA shell) — AI crawlers and Googlebot can read core content and links without executing JavaScript.
- Consistent NAP (phone/email) across all pages, with a working `tel:` click-to-call link.
- `/about` contains a genuine, specific founder-origin narrative (named founders, concrete work history) — a real E-E-A-T asset once separated from the placeholder-testimonial problem.
- Font loading and server response time (TTFB 30-50ms) are not current bottlenecks.
- Above-the-fold layout is clean on desktop and mobile — no overlapping elements, broken layout, or horizontal scroll observed.
- Two of four testimonial slots are explicitly marked `PLACEHOLDER` in the Astro source — meaning the *intent* is already correct in the codebase, just not deployed with real content yet.

---

## Strategic Decision Required

This audit found two parallel problems that need different owners:

1. **The live site (GoHighLevel) has active, damaging issues** — leaked competitor branding, broken sitemap/robots.txt, catastrophic LCP, zero GBP presence — that are actively hurting the business *today* and can only be fixed inside the GHL/Cloudflare account.
2. **The Astro rebuild in this repo is further along in some ways** (correct sitemap config, cleaner architecture) but **behind in others** (no page-specific Service/ContactPage schema that already exists live, no `/faq` content live, uncommitted changes across 14 files) and has never been deployed.

Before turning findings into deployed fixes, it's worth deciding: patch the live GoHighLevel site directly, finish and cut over to the Astro rebuild, or run a hybrid (fix the worst GHL issues now — SqueakyCle removal, robots.txt, GBP — while finishing Astro in parallel for a later cutover)?
