# Performance Findings — flexcommercialservices.com

**Methodology note:** No Google API credentials are configured on this machine (`google_auth.py --check` → tier -1), so **CrUX field data (28-day real-user data) was NOT available**. PageSpeed Insights API also failed with a public rate-limit error when queried without a key. All metrics below are **lab-only estimates** from Lighthouse 13.4.1 CLI (mobile emulation, simulated throttling), one run per page, https://flexcommercialservices.com on 2026-07-27. Lab data can differ meaningfully from real-user field data (75th percentile), especially on a network-dependent, JS-heavy site like this one. Field validation via `crux_history.py` / `pagespeed_check.py` (with a configured API key) is recommended once traffic/API access is restored.

**Platform note:** The live production site is built on the **GoHighLevel (HighLevel) funnel/page builder** (`leadconnectorhq.com`, `stcdn.leadconnectorhq.com`), not the Astro codebase in this repository. All four pages load ~40+ chained builder JS bundles from `stcdn.leadconnectorhq.com/_preview/...` — the `_preview` path suggests these are **unpublished/preview-mode builder assets** being served on the live production domain rather than a fully published, CDN-optimized build. This is the dominant root cause of the render-blocking JS chain and slow LCP found below.

## Summary Table (Lighthouse mobile, lab only)

| Page | Perf Score | LCP | CLS | TBT (INP proxy) | Page Weight |
|---|---|---|---|---|---|
| `/` | 84 | 1.25s (Good) | 0.254 (**Poor**) | 5ms (Good) | 11.68 MB |
| `/about` | 81 | 3.22s (Needs Improvement) | 0.232 (Needs Improvement) | 103.5ms (Good) | 1.22 MB |
| `/services` | 47 | **20.3s (Poor)** | 0.174 (Needs Improvement) | **875ms (Poor)** | 3.67 MB |
| `/booking` | 49 | **7.45s (Poor)** | 0.204 (Needs Improvement) | 195.5ms (Good, borderline) | 1.29 MB |

TBT (Total Blocking Time) is used as a lab proxy for INP; Lighthouse does not simulate real INP interaction latency.

---

## Finding 1: `/services` LCP is catastrophically slow (20.3s)

**Severity: Critical**

**Description:** Lighthouse measured Largest Contentful Paint at 20,289ms on `/services` — 8x the "poor" threshold of 4.0s. The LCP breakdown insight shows the visible subparts (TTFB 124ms + resource load delay 25ms + resource load duration 348ms + element render delay 451ms ≈ 950ms) account for under 5% of the total time; the remainder is consumed by main-thread contention from a deep chain of 40+ sequentially-loaded GoHighLevel builder JS/CSS files (`stcdn.leadconnectorhq.com/_preview/*.js`), confirmed by the `network-dependency-tree-insight` audit failing and Total Blocking Time of 875ms (Poor). The page is effectively unusable for a significant window after navigation.

**Recommendation:** Confirm the `/services` page is served from a **published** GoHighLevel build, not a preview/draft link — `_preview` asset paths on a production domain often indicate the funnel was linked before publishing, or an old preview snapshot is cached. If already published, work with GHL support/CDN caching config to flatten the JS dependency chain and enable proper bundle caching. Longer term, prioritize the Astro migration already underway in this repo — a static-generated `/services` page would eliminate this chain entirely.

## Finding 2: `/booking` LCP is Poor (7.45s) on the conversion page

**Severity: Critical**

**Description:** The booking/conversion page — arguably the most commercially important page — has LCP of 7,449ms (Poor) and issues 116 network requests (76 from the same `_preview` GHL builder bundle pattern seen on other pages), likely compounded by an embedded scheduling/calendar widget loading synchronously.

**Recommendation:** Same root-cause fix as Finding 1 (publish/flatten the builder bundle). Additionally, lazy-load or defer the booking widget iframe until after initial paint, and verify the calendar widget isn't blocking the main thread during load.

## Finding 3: CLS is at or near "Poor" on every page

**Severity: High**

**Description:** Cumulative Layout Shift fails the "Good" (≤0.1) threshold on all four pages, and homepage CLS (0.254) crosses into "Poor" (>0.25). The `layout-shifts` audit found 4 shifts on `/`, 4 on `/about`, 3 on `/services`, 2 on `/booking`. The `unsized-images` audit also flags multiple `<img>` elements (served via `images.leadconnectorhq.com`) without explicit width/height, which is a classic CLS driver as images pop into layout after their surrounding containers render.

**Recommendation:** Add explicit `width`/`height` (or `aspect-ratio` CSS) to all image and picture elements, particularly hero/testimonial photography identified in `unsized-images`. Reserve space for any dynamically-injected builder sections/rows before they render. Re-test after fixes — target CLS ≤0.1 on all pages.

## Finding 4: Extremely heavy, unoptimized hero image on homepage (11.68 MB total page weight)

**Severity: High**

**Description:** The homepage transfers 11.68 MB total, dominated by a single 4.71 MB Unsplash-hosted JPEG (`images.unsplash.com/photo-1517248135467-...`) used as a background image. The `image-delivery-insight` audit (score 0) estimates 1,653 KB of savings available site-wide just from modern formats/compression, with 1.23 MB of that on this one image alone. `/services` and `/about` also flag image-delivery savings of 570 KB and 490 KB respectively.

**Recommendation:** Replace hotlinked Unsplash originals with self-hosted, compressed WebP/AVIF assets sized to their actual display dimensions (this image renders inside a 356×535px container, far smaller than the multi-megapixel original). Preload the true LCP image with `fetchpriority="high"` and `loading="eager"` (the `lcp-discovery-insight` audit on `/services` confirms `fetchpriority=high` is currently NOT applied to the LCP element).

## Finding 5: Render-blocking third-party JS chain from page builder platform

**Severity: Medium**

**Description:** Every page loads ~40+ chained `stcdn.leadconnectorhq.com` builder/runtime scripts plus tracking calls to `backend.leadconnectorhq.com/stats/event` and `attribution_service/user_session_v3/create_session` before meaningful content can render. This third-party/builder-runtime overhead is consistent across all four pages and is the structural cause of Findings 1–2.

**Recommendation:** This is largely out of direct control while the site remains on the GoHighLevel builder, but confirm tracking/attribution scripts are deferred (`async`/non-blocking) rather than chained into the critical rendering path. The Astro rebuild in this repository, once launched, removes this dependency entirely.

## Finding 6: Font loading and server response time — no issues found

**Severity: Info (Pass)**

**Description:** `font-display-insight` reported zero wasted ms on all pages checked (no FOIT/FOUT penalty detected), and TTFB (`server-response-time`) was excellent everywhere (30–50ms). These are not current bottlenecks.

**Recommendation:** No action needed; monitor after the LCP/image fixes above land, since TTFB and font strategy are currently masked by the much larger JS/image bottlenecks.

---

## Category Score Estimate

**Estimated Performance score: ~45/100 (Poor)** — lab-estimate only, no field/CrUX data available for validation. Driven primarily by catastrophic LCP failures on `/services` (20.3s) and `/booking` (7.45s), and CLS failing the "Good" threshold on every page. Homepage alone is closer to "Needs Improvement/Good" (score 84) but carries an outsized 11.68 MB payload that would likely degrade on real mid-tier mobile connections beyond what lab simulation shows.
