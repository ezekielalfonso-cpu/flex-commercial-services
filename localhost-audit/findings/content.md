# Content Quality & E-E-A-T Audit — Flex Commercial Services (localhost:4321)

Pages audited: `/`, `/about`, `/services`, `/booking`, `/faq`
Method note: `render_page.py` correctly hard-blocked `localhost` per SSRF policy; three scratchpad JSON outputs from that script came back populated with content from the *live production domain* (flexcommercialservices.com via Cloudflare), not the dev server. That data was discarded and not used anywhere in this audit. Verification below is from direct `curl` fetches of localhost plus source reads (`about.astro`, `index.astro`).

## Content Quality Score: 58/100

## E-E-A-T Breakdown
| Factor | Score | Key Signals |
|---|---|---|
| Experience | 17/25 | Founder narrative (David George, Riley Hinkel — restaurant kitchens, office hallways) is specific and first-hand. No case studies/before-after documentation of actual jobs. |
| Expertise | 14/25 | FAQ covers insurance/bonding and service area well; no named credentials/certifications elsewhere; service pages read as generic brand copy. |
| Authoritativeness | 10/25 | No third-party citations or linked reviews (Google/Yelp); unexplained "Flex Family of Companies" affiliation claim; 2/4 homepage testimonials still placeholder. |
| Trustworthiness | 17/25 | Phone/contact present; stats banner bug fixed (100+/5★/3+ verified in raw HTML on `/` and `/about`); no freshness/update dates anywhere; no privacy policy (declined). |

## AI Citation Readiness: 52/100
FAQ's 8 structured Q&As are AI-citation-friendly (clear question/answer pairs), but no visible schema markup was confirmed, no publish/update dates exist to signal freshness, and quotable stats are limited to the 3 banner numbers.

## Verified (confirmed, not re-flagged as new)
- Stats banner shows real values (100+, 5★, 3+) in raw HTML on both `/` and `/about` — bug fix confirmed.
- Founder story is accurate, named, first-hand narrative.
- "Award-Worthy Clean" → "Consistently Exceptional" confirmed.
- "3+ years of hands-on experience" wording confirmed.
- AI headshot placeholders and 2 placeholder testimonials confirmed present, documented as known/intentional TODOs.
- No privacy policy confirmed absent on all 5 pages (declined by owner).

## NEW Findings

### 1. Unexplained "Flex Family of Companies" affiliation claim
Severity: Medium
`/about` displays "Proud member of the Flex Family of Companies" with a logo but no link, explanation, or context. An unverifiable affiliation claim can hurt rather than help Authoritativeness.
Recommendation: Link to the parent/sister company or remove the claim if it can't be substantiated on-page.

### 2. Founder-story image hosted on third-party CDN
Severity: Low
The "Flex Family of Companies" image is served from `assets.cdn.filesafe.space` (a GoHighLevel/LeadConnector asset host), not self-hosted.
Recommendation: Self-host brand imagery for reliability and brand control.

### 3. No content freshness signals site-wide
Severity: Medium
No publish or "last updated" dates appear on any of the 5 pages (About, Services, FAQ especially would benefit).
Recommendation: Add a visible "Last updated" date, particularly on FAQ and Services.

### 4. Testimonials/reviews not linked to a verifiable third-party platform
Severity: Medium
All testimonials are static on-site text with no link to Google Business Profile or Yelp reviews, so authenticity can't be independently verified.
Recommendation: Link testimonials to source reviews or embed a live Google review widget.

### 5. No named expertise attribution outside About page
Severity: Low
Service and FAQ content reads as unattributed brand copy; the "Who" test is answered only on `/about`.
Recommendation: Light attribution (e.g., "written by the Flex team based on X years of on-site experience") on Services/FAQ would reinforce Expertise.
