# Backlink Profile Audit — flexcommercialservices.com

Audit date: 2026-07-27
Data source tier: **Tier 0** (Common Crawl + local verification crawler only — Moz and Bing Webmaster API keys not configured)

## Summary

flexcommercialservices.com is present in Common Crawl's web index but falls below the ranking threshold used to compute PageRank and harmonic centrality — meaning the crawler found the domain but it currently has effectively **no measurable inbound link graph**. This is the expected profile for a young, unestablished local-business domain (Cleveland, OH commercial cleaning) that has not yet run any citation or link-building outreach. No known-backlink list was supplied for this audit, so the local verification crawler (`verify_backlinks.py`) could not be run — there was nothing to verify.

Because only 0–1 of the 7 scoring factors in the standard backlink health-score framework have any data source at Tier 0 (Moz DA/PA/spam score, anchor text, toxic ratio, link velocity, follow/nofollow ratio, and geographic relevance are all unavailable without paid/free-signup APIs), **a numeric Backlink Health Score would be misleading and is not produced.**

---

## Finding 1: No measurable backlink profile in Common Crawl

- **Severity:** High
- **Description:** `commoncrawl_graph.py` confirms `in_crawl: true` but `in_rankings: false`, with `pagerank: null`, `harmonic_centrality: null`, and `top_referring_domains: []` (0 domains sampled). The domain has been crawled at least once by Common Crawl but has not accumulated enough inbound links from other crawled pages to register in the ranked host graph. Source: Common Crawl (confidence: 0.50, domain-level only, quarterly-ish refresh cadence — current release `cc-main-2026-jan-feb-mar`).
- **Recommendation:** Not a code or technical fix — this is an off-site link-acquisition gap. Prioritize local citation building (see Finding 3) to generate the first wave of referring domains.

## Finding 2: Authority and toxicity metrics unavailable (Moz/Bing not configured)

- **Severity:** Medium
- **Description:** Domain Authority, Page Authority, Spam Score, anchor-text distribution, and follow/nofollow ratios all require the Moz API or Bing Webmaster API, neither of which is configured for this account. Both offer free tiers. Without them, toxic-link screening and anchor-text over-optimization checks (Google Penguin risk) cannot be performed at all right now — though for a domain with effectively zero backlinks, toxic-link risk is currently a non-issue by definition (there is nothing to poison).
- **Recommendation:** Sign up for the free Moz API (2,500 rows/month, https://moz.com/products/api) and Bing Webmaster Tools (https://www.bing.com/webmasters) to unlock Tier 1/2 data before the next backlink audit. This costs nothing and materially improves data quality once a link profile exists to measure.

## Finding 3: No local citation/directory footprint established (primary opportunity)

- **Severity:** High
- **Description:** For a small local commercial cleaning business, the fastest, most defensible path to a healthy initial backlink and citation profile is NAP-consistent listings on local/industry directories — not organic editorial links, which are unrealistic to expect at this stage. Zero referring domains were observed, consistent with no directory or citation work having been done yet.
- **Recommendation:** Build foundational local citations with consistent Name/Address/Phone (NAP) data: Google Business Profile, Bing Places, Apple Maps/Business Connect, Yelp, BBB, Nextdoor, Angi, Thumbtack, and Cleveland/Ohio-specific chambers of commerce and local business associations. Pursue a handful of industry-specific directories (ISSA, BSCAI — commercial cleaning trade associations) and local supplier/partner cross-links. This is link-building work, not a technical SEO fix, and should run in parallel with the sitemap/indexing fixes already identified elsewhere in this audit so new pages are actually crawlable when citation links start pointing at them.

---

## Quality Gates

- Backlink Health Score: **INSUFFICIENT DATA (0/7 factors scored with confidence ≥ 0.5; Common Crawl provides only a domain-presence signal, not a scoreable metric)**
- Common Crawl is the only active data source (confidence: 0.50, domain-level, quarterly cadence)
- No known-backlink list was provided, so `verify_backlinks.py` was not run this cycle
- Automated validation: `validate_backlink_report.py` → **PASS** (0 errors, 0 warnings)

## Structured Findings (for audit-data.json)

```json
{
  "category": "Backlink Profile",
  "score_estimate": "INSUFFICIENT DATA (Tier 0 only — expected for a young local-business domain)",
  "findings": [
    {
      "id": "backlinks-no-graph-signal",
      "title": "No measurable backlink profile in Common Crawl",
      "severity": "High",
      "description": "Domain is in Common Crawl's index (in_crawl: true) but below the ranking threshold (in_rankings: false); pagerank, harmonic_centrality null; 0 referring domains sampled.",
      "recommendation": "Build initial referring-domain base via local citation building; re-check Common Crawl next quarterly release."
    },
    {
      "id": "backlinks-apis-not-configured",
      "title": "Authority and toxicity metrics unavailable (Moz/Bing not configured)",
      "severity": "Medium",
      "description": "Moz API and Bing Webmaster API keys are not set up, so DA/PA, Spam Score, anchor-text distribution, and follow/nofollow data cannot be collected. Both are free-tier eligible.",
      "recommendation": "Configure free Moz API and Bing Webmaster Tools keys to enable Tier 1/2 backlink analysis on the next audit."
    },
    {
      "id": "backlinks-no-citations",
      "title": "No local citation/directory footprint established",
      "severity": "High",
      "description": "Zero referring domains observed, consistent with no local/industry directory citation work having been done for this Cleveland, OH commercial cleaning business.",
      "recommendation": "Build NAP-consistent citations on Google Business Profile, Bing Places, Yelp, BBB, Nextdoor, Angi, Thumbtack, local Cleveland/Ohio chambers, and industry trade associations (ISSA, BSCAI)."
    }
  ],
  "quality_gates": {
    "tier": 0,
    "factors_scored": 0,
    "factors_total": 7,
    "health_score": "INSUFFICIENT DATA",
    "validator_status": "PASS"
  }
}
```
