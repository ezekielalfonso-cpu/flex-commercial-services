# Technical SEO Audit — flexcommercialservices.com (LIVE production)

Audited: 2026-07-27
Method: Direct HTTP inspection (curl) + raw HTML fetch (`render_page.py --mode never`) of the 5 resolvable pages: `/`, `/home`, `/about`, `/services`, `/booking`. No Google API credentials configured, so Core Web Vitals are assessed from lab/source signals only (no CrUX field data).

**Platform note (context for all findings below):** The live site is NOT the Astro codebase in this git repo. Response bodies, headers (`cf-cache-status`, GHL cookie patterns), and markup (`<!--teleport anchor-->` Vue comments, `cbutton-` class naming, `leadconnectorhq.com` preconnects) show the live site is actually served from **GoHighLevel (GHL) / LeadConnector**, behind Cloudflare. The Astro rebuild in this repo has evidently not been deployed to production. This is the single most important fact for this audit: all findings below describe the GHL site, and none of them can be fixed by editing files in this repo — they require access to the GHL/Cloudflare site configuration.

### Technical Score: 42/100

| Category | Status | Score |
|----------|--------|-------|
| Crawlability | fail | 20/100 |
| Indexability | fail | 30/100 |
| Security | fail | 25/100 |
| URL Structure | warn | 55/100 |
| Mobile | warn | 65/100 |
| Core Web Vitals (source signals) | warn | 50/100 |
| Structured Data | pass | 75/100 |
| JS Rendering | pass | 80/100 |
| IndexNow | fail | 0/100 |

---

## Critical

### C1. robots.txt returns 200 with an empty body — no crawl directives, no sitemap reference
**Evidence:** `curl -I https://flexcommercialservices.com/robots.txt` → `HTTP/1.1 200 OK`, `Content-Type: text/plain`, `Content-Length: 0`. Body is completely empty.
**Impact:** Not fatal by itself (an empty robots.txt is technically "allow all"), but it provides zero guidance to crawlers and, critically, has no `Sitemap:` directive, compounding the missing-sitemap issue below.
**Recommendation:** Publish a minimal robots.txt with `User-agent: *` / `Allow: /` and a `Sitemap:` line pointing at a real, working sitemap URL. Must be done in the GHL/Cloudflare layer, not the repo.

### C2. No XML sitemap is reachable — sitemap endpoints resolve to 200-with-empty-body or 301 to /home
**Evidence:**
- `/sitemap.xml` → `HTTP/1.1 200 OK`, `Content-Type: text/xml`, `Content-Length: 0` (empty file, same broken pattern as robots.txt).
- `/sitemap-index.xml` (the path the repo's `@astrojs/sitemap` integration would publish to) → `HTTP/1.1 301`, `Location: https://flexcommercialservices.com/home` (caught by the catch-all redirect, confirmed below).
**Impact:** Google/Bing have no authoritative list of indexable URLs for this domain. Discovery is entirely dependent on internal links and manual submission.
**Recommendation:** Generate and publish a real sitemap.xml (even a hand-built 5-URL sitemap is better than none) at the GHL host level, and reference it from robots.txt.

### C3. Catch-all redirect sends every non-matched path — including real content and infrastructure files — to /home with a 301, and there is no real 404 handling
**Evidence:** Confirmed across 8 independent test paths, all returning identical `301` → `Location: https://flexcommercialservices.com/home`:
`/faq`, `/sitemap-index.xml`, `/nonexistent-random-xyz123`, `/blog`, `/contact`, `/pricing`, `/services/office-cleaning`, `/404`.
Notably `/faq` 301-redirects despite `src/pages/faq.astro` existing and being tracked in this git repo — confirming the live deployment is stale/out of sync with the codebase (do not attempt to fix by editing the repo; this is a deployment issue).
**Impact:** (a) Any broken/typo'd/old URL soft-404s as a 301 instead of returning a real 404/410, which both wastes crawl budget and can cause Google to treat `/home` as a duplicate/soft-404 target with abnormally high inlink count. (b) Search engines cannot distinguish "moved" from "never existed" from "not deployed yet," which will suppress indexation confidence broadly. (c) Confirms sitemap/infra endpoints are entirely unreachable (see C2).
**Recommendation:** Configure a genuine 404 response for unmatched paths. Reserve 301s for actual moved content (e.g., old `/faq` → new `/faq` once deployed, not → homepage).

### C4. Canonical tags conflict across pages and point to the wrong host in two cases
**Evidence:**
- `/` and `/home` (near-duplicate content, same `<title>`, same meta description, same JSON-LD): **no canonical tag at all** in either `<head>`.
- `/about` canonical: `<link rel="canonical" href="https://www.flexcommercialservices.com/about">` (www)
- `/booking` canonical: `<link rel="canonical" href="https://www.flexcommercialservices.com/booking">` (www)
- `/services` canonical: `<link rel="canonical" href="https://flexcommercialservices.com/services">` (non-www)
- Verified host behavior: `curl -I https://www.flexcommercialservices.com/` → `301` → `Location: https://flexcommercialservices.com/` — i.e. **www is not the canonical host, non-www is.** So `/about` and `/booking` declare a canonical URL that itself immediately 301-redirects to a different URL. This is a self-contradicting canonical (canonical points at a redirecting URL rather than the final destination), which Google's own guidance says to avoid.
**Impact:** Google is left to pick a canonical host itself, risking `www` vs non-`www` indexation splits, and the `/` vs `/home` duplicate has no disambiguation signal at all.
**Recommendation:** Add a self-referencing canonical using the non-www host consistently on every page: `/` → canonical `https://flexcommercialservices.com/`, `/home` → canonical to `https://flexcommercialservices.com/` (pick one as primary, 301 the other), `/about`, `/services`, `/booking` → non-www self-referencing canonicals.

### C5. Unrelated third-party brand ("SqueakyCle") is embedded in the live site's footer and structured data area
**Evidence:** On `/` (and likely other pages sharing the global footer), footer navigation includes:
- `<a aria-label="About SqueakyCle " href="https://flexcommercialservices.com/about">` — mismatched aria-label naming a different company while linking to Flex's own About page.
- `<a aria-label="  Home " href="https://squeakycle.com/">` and `<a href="https://squeakycle.com/booking">` — outbound links to an entirely different external domain (squeakycle.com).
- Contact email reference `squeakycle@gmail.com` appearing in the footer alongside Flex's real contact info.
Occurs 7 times in the raw HTML of the homepage alone.
**Impact:** This looks like unremoved template/demo content from a GoHighLevel snippet built for a different client ("Squeaky Clean" branding), left live in production. It creates NAP (Name/Address/Phone) and brand-entity confusion for both users and search engines, sends outbound authority/clicks to an unrelated domain, and undermines local SEO trust/entity signals (Google's understanding of "who this business is").
**Recommendation:** Remove all squeakycle.com references, correct aria-labels, and audit the rest of the funnel/site for other leftover template branding. This is a content/trust issue with direct technical-SEO consequences (entity confusion, outbound link leakage) and should be treated as high urgency.

---

## High

### H1. No security headers present on any response
**Evidence:** Full response headers captured via `curl -I` for `/`, `/home`, `/about`, `/services`, `/booking`, `/robots.txt` show only Cloudflare/cache headers (`cache-control`, `cf-cache-status`, `Server: cloudflare`, `set-cookie`, `via: 1.1 google`). None of the following are present on any page: `Strict-Transport-Security` (HSTS), `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Robots-Tag`.
**Impact:** No HSTS means the HTTP→HTTPS redirect (confirmed working, see URL Structure) is not enforced at the browser level on repeat visits, leaving a window for downgrade/MITM attacks. Missing `X-Content-Type-Options: nosniff` and `X-Frame-Options`/frame-ancestors CSP leaves the site more exposed to MIME-sniffing and clickjacking. This is a Cloudflare/GHL-level configuration gap, not fixable from the Astro repo.
**Recommendation:** Add security headers via Cloudflare (Transform Rules / Workers) since GHL likely doesn't expose header config directly: `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and a baseline CSP.

### H2. `/services` page is missing a meta description
**Evidence:** `grep` for `<meta name="description"` on `services.html` returns no match, while all other 4 pages have one.
**Impact:** Google will auto-generate a snippet for this page in search results, reducing control over click-through messaging for what is likely a primary commercial-intent landing page.
**Recommendation:** Add a unique, benefit-led meta description (~150-160 chars) to `/services`.

### H3. `/booking` disables pinch-to-zoom via viewport meta
**Evidence:** `/booking` viewport tag: `<meta name="viewport" content="minimum-scale=1.0, width=device-width, maximum-scale=1, user-scalable=no">`. All other pages use the standard `width=device-width, initial-scale=1` with no scale lock.
**Impact:** `user-scalable=no` + `maximum-scale=1` is a known mobile-usability and accessibility failure (WCAG 1.4.4) — it prevents users from zooming to read a booking/lead-gen form, exactly the page where friction most directly costs conversions.
**Recommendation:** Remove `user-scalable=no` and `maximum-scale=1` from the booking page viewport tag; standardize on the same viewport meta used elsewhere.

---

## Medium

### M1. Heavy, unscoped Google Fonts request blocks rendering
**Evidence:** Single `<link rel="stylesheet">` to `fonts.googleapis.com` requesting **all 10 weights × italic variants** of both Lato and Montserrat, plus a third "Style Script" family — one enormous render-blocking CSS request rather than a scoped subset of the 2-3 weights actually used.
**Impact:** Likely a meaningful contributor to LCP delay (render-blocking web font CSS fetched from a third-party origin before First/Largest Contentful Paint can complete). No field CWV data available to confirm magnitude — flagged as a source-level risk, not a measured failure.
**Recommendation:** Request only the specific weights/styles in use, and/or self-host + preload critical fonts with `font-display: swap`.

### M2. Page weight / DOM bloat
**Evidence:** Raw HTML alone is 320-325 KB for `/` and `/home` (before any JS/CSS/image payload), with 292 `<div>` elements and 24 inline `<style>` blocks on the homepage — typical of visual page-builder (GHL) output rather than hand-built markup.
**Impact:** Elevated risk for CLS (many independently-styled/animated blocks — note `data-animation-class="animate__animated..."` entrance animations detected on several buttons/sections) and slower parse/render time contributing to LCP. Cannot be confirmed as a Poor/Needs-Improvement CWV rating without lab or field data.
**Recommendation:** Run Lighthouse/PageSpeed Insights against the live GHL pages once GSC/PSI API access is available (`scripts/pagespeed_check.py`) to get real LCP/INP/CLS numbers; audit entrance-animation usage for layout-shift risk.

### M3. Heading structure misuse
**Evidence:** Homepage contains 7 `<h1>` elements in the raw HTML: one with real text ("A Proud Member Of The Flex Family Of Companies" — not a keyword-relevant primary heading), and the footer's "Quick Links", "Contact Us", and "Follow Us" section labels are also marked up as `<h1>` (repeated twice, likely desktop+mobile footer variants).
**Impact:** Multiple/duplicate H1s dilute topical relevance signals and the one page-level H1 that does render text doesn't target the core "commercial cleaning Cleveland OH" intent. Footer labels as H1 is a semantic-HTML error.
**Recommendation:** One keyword-relevant H1 per page (e.g., "Commercial Cleaning Services in Cleveland, OH"); demote footer section labels to `<h2>`/`<h3>` or non-heading elements.

### M4. IndexNow protocol not implemented
**Evidence:** `/indexnow-key.txt` returns `301` (caught by the same catch-all redirect as every other unmatched path) rather than a 200 key file.
**Impact:** No fast-path indexing signal to Bing/Yandex/Naver; those engines must rely on regular crawl discovery, which is already impaired by the missing sitemap (C2).
**Recommendation:** Generate an IndexNow key, publish it at the site root, and submit URLs via `scripts/indexnow_submit.py` once C2/C3 are resolved.

---

## Low / Info

### I1. HTTPS enforcement and www→non-www redirect are working correctly
**Evidence:** `http://flexcommercialservices.com/` → single-hop `301` to `https://flexcommercialservices.com/`. `https://www.flexcommercialservices.com/` → single-hop `301` to `https://flexcommercialservices.com/`. Both are clean 1-hop redirects (no chains), TLS is valid (Cloudflare-terminated).
**This is working well** — no action needed.

### I2. JSON-LD LocalBusiness/Service/ContactPage structured data is present and reasonably well-formed on every page
**Evidence:** All 5 pages carry an `@graph`-wrapped JSON-LD block: `LocalBusiness` (root/home/about) with NAP fields (`telephone`, `address`, `email`), `Service` (services page), `ContactPage` (booking page).
**Minor issue:** the `Service` and `ContactPage` blocks both hardcode `"url": "https://www.flexcommercialservices.com..."` (www) inside the `provider`/page object, inconsistent with the confirmed non-www canonical host (see C4) — recommend aligning to non-www throughout structured data once canonical host is standardized.
**This is largely working well** — structured data coverage is a genuine strength relative to the rest of the audit.

### I3. Content is present in raw/initial HTML — not a blind CSR shell
**Evidence:** `render_page.py` flagged `is_spa: true` (Vue `<!--teleport anchor-->` markers detected, consistent with GHL's page-builder runtime), but the homepage's raw (non-rendered) HTML already contains full visible copy (e.g., "Cleveland" appears 28 times in raw HTML) and real `<a href>` navigation links to `/about`, `/services`, `/booking` rather than JS-only click handlers.
**Impact:** Low indexing risk from rendering — Googlebot does not need to execute JS to see primary content or discover internal links.
**This is working well** — no action needed on the JS-rendering front specifically, independent of the other crawlability failures above.

### I4. Mobile viewport tag present on all pages
**Evidence:** All 5 pages include `<meta name="viewport" content="width=device-width, initial-scale=1">` (except `/booking`, see H3). `<html lang="en">` is correctly set on all 5 pages.
**This is working well**, aside from the booking-page exception noted in H3.

### I5. All homepage `<img>` tags have `alt` attributes
**Evidence:** 5 `<img>` elements found on homepage raw HTML, 0 missing `alt`. (Not exhaustively checked across all pages/lazy-loaded background images, which may be CSS `background-image` and thus outside this check's scope.)
