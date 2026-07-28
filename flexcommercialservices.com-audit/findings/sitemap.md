# Sitemap Audit — flexcommercialservices.com

Audit date: 2026-07-27

## Summary

The site has **no reachable XML sitemap in production**, and **robots.txt is empty**, so even if a sitemap existed nothing would point search engines to it. Local repo configuration (`astro.config.mjs` with `@astrojs/sitemap`) is correct, and a correct `robots.txt` exists locally referencing `Sitemap: https://flexcommercialservices.com/sitemap-index.xml` — but neither has been deployed to production. This is a **deployment gap, not a code gap**.

---

## Finding 1: Sitemap unreachable on production (all conventional paths tested)

- **Severity:** Critical
- **Description:** Tested every standard sitemap URL pattern on the live site; none serve a valid sitemap:
  | URL | Result |
  |---|---|
  | `/sitemap-index.xml` | HTTP 301 → `/home` |
  | `/sitemap-0.xml` | HTTP 301 → `/home` |
  | `/sitemap_index.xml` | HTTP 301 → `/home` |
  | `/sitemap1.xml` | HTTP 301 → `/home` |
  | `/sitemap.xml` | HTTP 200, Content-Length: 0 (empty body) |

  The 301s to `/home` indicate a catch-all "unmatched path → /home" redirect rule is intercepting the Astro-generated sitemap paths, meaning those files are not present on the deployed server at all. `/sitemap.xml` returns a 200 but with zero bytes — also non-functional, and not the path Astro's sitemap integration would generate by default anyway.
- **Recommendation:** Confirm the production build actually includes `@astrojs/sitemap` output (`dist/sitemap-index.xml`, `dist/sitemap-0.xml`) and that the deploy pipeline is shipping the latest build. Verify the catch-all redirect rule (likely in hosting/CDN config or a middleware) excludes `sitemap*.xml` and `robots.txt` from the "redirect unmatched to /home" behavior. Redeploy and re-test all five paths above expecting HTTP 200 with valid XML.

## Finding 2: robots.txt is empty in production

- **Severity:** Critical
- **Description:** `https://flexcommercialservices.com/robots.txt` returns HTTP 200 with Content-Length: 0. There is no `Sitemap:` directive, no crawl rules — nothing. A correct version exists in the local repo as an **untracked** file (`public/robots.txt`, confirmed via `git status`) referencing `Sitemap: https://flexcommercialservices.com/sitemap-index.xml`, but it has never been committed or deployed.
- **Recommendation:** Commit `public/robots.txt` to the repo and deploy. Even once the sitemap itself is fixed (Finding 1), Google has no discovery path to it without this file being live.

## Finding 3: Sitemap coverage cannot be validated until deployed

- **Severity:** High (blocked by Findings 1–2)
- **Description:** Since no sitemap is currently reachable, a live crawled-pages-vs-sitemap comparison cannot be performed. Known live pages returning HTTP 200: `/`, `/home`, `/about`, `/services`, `/booking` (5 pages). `/faq` returns HTTP 301 → `/home`, so it is not yet live and should not be included in the sitemap until it resolves 200.
- **Recommendation:** Once the sitemap is deployed and reachable, re-run coverage validation to confirm it lists exactly the 5 live 200-status pages (plus any future live pages), and does not include `/faq` while it redirects. Also confirm `<loc>` values use the canonical `/home` vs `/` consistently (both currently return 200, which is a duplicate-content signal worth resolving separately) — but do not include both in the sitemap; pick one canonical URL.

## Finding 4: No visibility into XML validity, URL count, or lastmod accuracy

- **Severity:** Info
- **Description:** Standard checks (valid XML syntax, <50,000 URL limit, `<lastmod>` accuracy, absence of `priority`/`changefreq` tags) could not be run — there is no file to inspect. Given the site has only 5 pages, the 50k URL limit and multi-file splitting are non-issues for the foreseeable future, and no location-page doorway-page risk applies (0 programmatic location pages, well under the 30-page warning threshold).
- **Recommendation:** After deployment, re-run full validation. Since `@astrojs/sitemap` generates clean output by default (no `priority`/`changefreq`, accurate `lastmod` from build time), no further action is expected to be needed beyond confirming the file is reachable and correctly referenced in robots.txt.

---

## Quality Gates

- Location pages in sitemap: 0 — well under the 30-page warning and 50-page hard-stop thresholds. No doorway-page risk currently.

## Structured Findings (for audit-data.json)

```json
{
  "category": "Sitemap",
  "score_estimate": "1/10",
  "findings": [
    {
      "id": "sitemap-unreachable",
      "title": "XML sitemap unreachable on production (all paths tested)",
      "severity": "Critical",
      "description": "All conventional sitemap URLs (/sitemap-index.xml, /sitemap-0.xml, /sitemap_index.xml, /sitemap1.xml) return HTTP 301 to /home via a catch-all redirect; /sitemap.xml returns HTTP 200 with an empty body. No valid sitemap is being served despite correct local astro.config.mjs configuration.",
      "recommendation": "Verify @astrojs/sitemap output is included in the production build, confirm the deploy pipeline ships it, and exclude sitemap*.xml from the catch-all redirect-to-/home rule."
    },
    {
      "id": "robots-txt-empty",
      "title": "robots.txt is empty in production",
      "severity": "Critical",
      "description": "https://flexcommercialservices.com/robots.txt returns HTTP 200 with Content-Length: 0. A correct robots.txt referencing the sitemap exists locally but is untracked and never deployed.",
      "recommendation": "Commit and deploy public/robots.txt with the Sitemap: directive pointing to /sitemap-index.xml."
    },
    {
      "id": "coverage-unvalidated",
      "title": "Sitemap coverage vs live pages cannot be validated (blocked)",
      "severity": "High",
      "description": "5 pages resolve HTTP 200 (/, /home, /about, /services, /booking); /faq redirects (301) and is not yet live. Coverage cannot be confirmed until the sitemap is reachable.",
      "recommendation": "Re-validate sitemap contents against live 200-status pages once deployed; exclude /faq until it goes live; resolve / vs /home duplicate-canonical ambiguity."
    },
    {
      "id": "xml-checks-blocked",
      "title": "XML validity, URL count, lastmod checks blocked by unreachability",
      "severity": "Info",
      "description": "No file exists to validate syntax, tag usage, or lastmod accuracy. Site has only 5 pages, so 50k URL limit is not a concern; no location-page doorway risk (0 location pages).",
      "recommendation": "Re-run full validation after deployment fix; expect a clean pass given @astrojs/sitemap defaults."
    }
  ],
  "quality_gates": {
    "location_pages_count": 0,
    "warning_threshold_30": false,
    "hard_stop_threshold_50": false
  }
}
```
