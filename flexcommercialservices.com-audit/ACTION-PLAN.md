# Action Plan — flexcommercialservices.com

Sequencing assumes fixes happen wherever the live site actually ends up running (GoHighLevel now, or Astro after cutover — see FULL-AUDIT-REPORT.md "Strategic Decision Required"). Items marked **[GHL]** must be done in the current live platform regardless of a future migration, because they're actively hurting the business today.

## Phase 1: Critical Fixes (this week)

| Item | Where | Depends on |
|---|---|---|
| Remove all "SqueakyCle"/squeakycle.com leftover content (testimonial, buttons, aria-labels, email) | GHL | — |
| Publish a real robots.txt with `Sitemap:` directive | GHL | — |
| Confirm `/services` and `/booking` are served from a *published* GHL build, not `_preview` draft assets; if so, that alone may fix the 20.3s/7.45s LCP | GHL | — |
| Verify whether a Google Business Profile exists; claim/verify it if not | Google Maps/Search, external to site | — |
| Fix canonical tags: pick one of `/` or `/home` as canonical, self-referencing non-www canonicals on all 5 pages | GHL | Decide canonical host first |

## Phase 2: High-Impact Improvements (weeks 2-3)

| Item | Where | Depends on |
|---|---|---|
| Generate and publish a working sitemap (even a hand-built 5-URL one) | GHL | Sitemap fix confirmed reachable |
| Configure a real 404 response for unmatched paths; stop the catch-all-to-/home redirect | GHL | — |
| Add security headers via Cloudflare Transform Rules/Workers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options) | Cloudflare | — |
| Remove `user-scalable=no` from `/booking` viewport meta | GHL | — |
| Add above-the-fold tap-to-call phone number (header or floating mobile button) | GHL | — |
| Add starting-price anchors per service tier and a move-out price range | GHL content | — |
| Add insurance/bonding/licensing statement to `/about` and homepage | GHL content | — |
| Fix schema: complete PostalAddress, consistent `geo`/`sameAs` on every page, correct Instagram handle | GHL / Astro (port later) | — |
| Add explicit `width`/`height` to all images; replace the 4.71MB hotlinked Unsplash image with a compressed, self-hosted asset sized to its display dimensions | GHL | — |
| Start local citation building: GBP, Yelp, BBB, Nextdoor, Angi, Thumbtack, Cleveland/Ohio chambers, ISSA/BSCAI | External | GBP confirmed/claimed |

## Phase 3: Content & Authority (month 2)

| Item | Where | Depends on |
|---|---|---|
| Build dedicated pages per service vertical (restaurant, office, fitness, school/daycare, move-in/out) with unique 500-800 word copy, process detail, compliance angle per vertical | GHL or Astro | Decide platform first |
| Add "Our Process" section, trust bar (insured/bonded/licensed), 1 case study per vertical | Content | Phase 3 pages |
| Fix heading hierarchy sitewide: one real H1 per page, demote footer labels | GHL/Astro | — |
| Add 134-167 word self-contained AI-citable answer blocks on `/` and `/services` | Content | — |
| Add named service-area suburbs (8-15 cities) in copy + schema `areaServed` | Content + schema | — |
| Add business hours to footer/`/booking` + matching `openingHoursSpecification` schema | GHL/Astro | — |
| Add BreadcrumbList and WebSite schema | GHL/Astro | Canonical host decided |
| Populate `/llms.txt` with a structured business summary | GHL | — |
| Collect first 10+ real Google reviews; replace placeholder testimonials; add `aggregateRating` schema once real reviews exist | External + content | GBP confirmed |
| Restore `/faq` on the live deployment | Deploy fix | Platform decision |

## Phase 4: Monitoring & Iteration (ongoing)

- Re-run `/seo drift baseline https://flexcommercialservices.com` once Phase 1-2 fixes ship, to track regressions going forward.
- Re-run `/seo audit` after Phase 2 to confirm LCP/CLS/sitemap/robots fixes landed and re-score.
- Sign up for free Moz + Bing Webmaster API keys to unlock real backlink/DA data on the next audit.
- Configure Google API credentials (`google_auth.py --setup`) to get real CrUX field data instead of lab-only Lighthouse estimates.
- Monitor review velocity — aim for one new review at least every ~18 days to avoid the documented review-inactivity ranking cliff.
- IndexNow implementation once sitemap/robots.txt are stable.
