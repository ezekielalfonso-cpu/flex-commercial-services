# Technical SEO Audit — localhost:4321 (dev) / flexcommercialservices.com (config)

Pages audited: `/`, `/about`, `/services`, `/booking`, `/faq`

## Technical Score: 78/100

## Category Breakdown
| Category | Status | Score |
|----------|--------|-------|
| Crawlability | pass | 95 |
| Indexability | pass | 95 |
| Security | N/A (dev server; headers set at hosting/CDN layer) | — |
| URL Structure | warn | 80 |
| Mobile | pass | 95 |
| Core Web Vitals | warn | 70 |
| Structured Data | pass | 85 |
| JS Rendering | pass | 100 |
| IndexNow | fail (not implemented) | 0 |

## Verification of Previously-Applied Fixes (all confirmed correct)
- `astro.config.mjs`: `site: 'https://flexcommercialservices.com'`, `@astrojs/sitemap`, `trailingSlash: 'never'` — confirmed via `npx astro build`; `dist/sitemap-index.xml` → `dist/sitemap-0.xml` lists all 5 correct canonical URLs; `dist/robots.txt` correctly references the sitemap.
- All 5 pages have unique `<title>`/meta description, a real self-referencing `<link rel="canonical">` (non-www, no trailing slash), exactly one `<h1>`, and `<meta name="viewport" content="width=device-width, initial-scale=1">` with no zoom-lock.
- No `<meta name="robots" content="noindex">` found on any page.
- `/faq`: 8 Q&As, each question is a genuine `<h2 class="contents">` wrapping a `<button>` (display:contents preserves heading semantics in the a11y tree while removing box styling — a valid, well-supported pattern). Heading order on `/faq` is H1 → 8×H2 (FAQ items) → H2 (CTA) → H3s (footer) — no skipped levels. Same clean H1→H2→H3 hierarchy verified on all other pages.
- `public/robots.txt` serves 200 on the dev server; sitemap 404s on dev as expected (build-time only), confirmed working in `dist/`.

## New Findings

**Medium — Missing explicit width/height on all `<img>` tags (CLS risk).** Homepage has 12 `<img>` elements, none with `width`/`height` attributes, including the eager-loaded hero/LCP image and CDN/Unsplash card images. Without reserved space, these can cause layout shift as they load. Recommend adding explicit `width`/`height` (or `aspect-ratio` CSS on wrapper) to every image, especially LCP candidates.

**Low — Trailing-slash URLs 404 instead of redirecting.** With `trailingSlash: 'never'`, `/about/` returns 404 rather than a 301 to `/about`. Internal links are consistent (no trailing slashes), but any external backlink or typed URL with a trailing slash hits a dead end. No redirect rule exists in `netlify.toml`. Recommend adding a Netlify redirect rule normalizing trailing slashes, or verify Netlify's default static-asset handling covers this post-deploy.

**Low — LocalBusiness schema `priceRange: "Custom quote"` is non-standard.** Schema.org/Google expect `priceRange` as a currency-symbol range (e.g., `"$$"`) or numeric value; a free-text string may be ignored by rich-result parsers. Low impact since it's not a required field, but consider removing it or using a valid format.

**Not new (tracked, no action taken):** no dedicated per-service pages (7 verticals funnel to `/services`), no IndexNow implementation, no `openingHoursSpecification` (business hours unknown).
