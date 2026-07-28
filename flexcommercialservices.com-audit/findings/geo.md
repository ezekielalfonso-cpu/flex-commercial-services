# GEO / AI Search Readiness Audit — flexcommercialservices.com (LIVE production)

Audited: 2026-07-27. Pages: `/`, `/about`, `/services`, `/booking` (all 200 OK, served via GoHighLevel/LeadConnector — not the Astro repo). Method: `render_page.py --mode never` (raw pre-JS HTML, confirms what non-JS-executing AI crawlers actually see) + direct `curl` for `/robots.txt` and `/llms.txt`.

**GEO Readiness Score: 32/100**

| Dimension (weight) | Score | Notes |
|---|---|---|
| Citability (25%) | 35/100 | Real copy exists but is marketing prose, not self-contained 134-167 word answer blocks; no direct facts on pricing $, guarantees, or response time |
| Structural Readability (20%) | 30/100 | 7 `<h1>` tags on homepage (footer labels mismarked as H1); no question-based headings; no live FAQ |
| Multi-Modal Content (15%) | 30/100 | Static images only, alt text present; no video/infographics |
| Authority & Brand Signals (20%) | 20/100 | Founder names present (good) but severe brand/entity contamination from leftover "SqueakyCle" content (see Finding 3) undermines disambiguation; no dates, no external entity presence found |
| Technical Accessibility (20%) | 45/100 | Content is present in raw pre-JS HTML (not a blind SPA shell); but robots.txt/llms.txt are empty stubs and canonical-host inconsistencies (see technical.md) add crawl ambiguity |

---

## Findings

### 1. [HIGH] robots.txt is a 200-OK empty file — no explicit AI crawler directives
**Description:** `curl -I https://flexcommercialservices.com/robots.txt` returns `200 OK`, `Content-Length: 0`. There are zero `User-agent` blocks, meaning GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot are not explicitly disallowed (an empty robots.txt defaults to allow-all), but there is also no explicit `Allow:` signal, no `Sitemap:` line, and no way to selectively block training-only crawlers (CCBot, anthropic-ai) while keeping search crawlers open. This is the same root defect flagged in `technical.md` (Finding C1), reframed here for AI-crawler-specific impact.
**Recommendation:** Publish a robots.txt that explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot, references a real sitemap, and optionally disallows CCBot/anthropic-ai if training-data opt-out is desired. Must be configured at the GHL/Cloudflare layer, not in this repo.

### 2. [MEDIUM] /llms.txt resolves 200 but is a 0-byte stub — no structured AI guidance
**Description:** `https://flexcommercialservices.com/llms.txt` returns `200 OK`, `Content-Type: text/plain`, `Content-Length: 0` — effectively the same empty-stub pattern as robots.txt, not a 404. Per the skill's primary-source evidence, llms.txt currently carries no confirmed citation-ranking weight with major AI search systems, so this is not scored as a blocker, but a populated file costs little and gives crawlers/agents a structured summary of the business, services, and contact facts.
**Recommendation:** Publish a minimal `/llms.txt` with site title, one-line description ("Flex Commercial Services — commercial cleaning company serving Cleveland and Northeast Ohio, OH"), links to `/`, `/about`, `/services`, `/booking`, and key facts (phone, service area, plan tiers). Low priority relative to Findings 1 and 3.

### 3. [CRITICAL] Leftover "SqueakyCle" brand content on the homepage breaks entity disambiguation for AI answer engines
**Description:** The raw (pre-JS) homepage HTML contains two near-identical testimonial blocks with the same opening line ("A clear space for a clear mind.") — one attributed to "SqueakyCle" (`— SqueakyCle— ... About SqueakyCle`) and one to "Flex Commercial Services"/"FCS" (`— Flex Commercial Services— ... About FCS`), plus outbound links/aria-labels referencing squeakycle.com and a squeakycle@gmail.com contact (documented in full in `technical.md` Finding C5). For an LLM or AI Overview crawler ingesting this page as a single content unit, this reads as two different businesses sharing identical marketing copy and testimonial structure on the same domain — the single highest-risk signal for an AI system to either (a) refuse to cite the page due to ambiguous entity identity, or (b) misattribute "Flex Commercial Services" facts/reviews to a different brand, or vice versa. This directly undermines the task's core requirement that the business be "consistently and clearly identified... in a way a language model could disambiguate it from other businesses with similar names."
**Recommendation:** Remove all SqueakyCle references from the live site (already flagged as high-urgency in technical.md); this is the single highest-leverage GEO fix available — no other change on this site will improve AI citation eligibility while this contamination remains live.

### 4. [MEDIUM] No self-contained, citable answer blocks for core commercial facts
**Description:** Passage-level review of the extracted body text across all four pages found no clear, quotable statements for: specific pricing (Basic/Standard/Premium plans are named but carry no $ figures anywhere in text or schema — `services.astro` schema also omits `price`), service guarantees, response/turnaround time, or a specific named service area beyond `"areaServed": "Northeast Ohio"` in JSON-LD (not present in visible body copy). Existing prose is persuasive/marketing-toned ("Spotless Spaces, Superior Service") rather than direct-answer ("Flex Commercial Services provides three tiered commercial cleaning plans — Basic, Standard, and Premium — serving Cleveland and Northeast Ohio businesses including restaurants, offices, fitness centers, and schools.").
**Recommendation:** Add a 134-167 word self-contained answer block near the top of `/services` and `/` answering "What does Flex Commercial Services offer and who do they serve?" with concrete, extractable facts (plan names, service area, industries served, phone). Repeat the pattern for guarantees/response time once those policies are defined.

### 5. [LOW] Homepage heading hierarchy interferes with structural readability for AI parsing
**Description:** Homepage raw HTML has 7 `<h1>` elements (footer "Quick Links"/"Contact Us"/"Follow Us" labels mismarked as H1, duplicated for desktop/mobile) rather than one clear H1 stating the core value proposition. No question-based H2/H3 headings anywhere (e.g., "What commercial cleaning services does Flex offer in Cleveland?") that would match AI Overview / AI Mode query patterns. Cross-reference: `technical.md` Finding M3.
**Recommendation:** One keyword-relevant H1 per page; demote footer labels to non-heading elements; add 2-3 question-phrased H2s per page (services, service area, booking process) to increase passage-extraction match rate.

### 6. [INFO] Content is server-rendered and reachable without JS execution — technical accessibility floor is intact
**Description:** Despite `render_page.py` flagging `is_spa: true` (Vue/GHL teleport-anchor markers), the raw pre-JS HTML for all four pages already contains full visible copy and real `<a href>` navigation — confirmed by extracting body text with comments/scripts stripped (765-2062 characters of real copy per page). AI crawlers that do not execute JavaScript (GPTBot, ClaudeBot, PerplexityBot) can already read the core content today. This is the one dimension not requiring remediation.
**Recommendation:** No action needed on SSR/JS-dependency specifically; this is a genuine strength to preserve in any future migration off GoHighLevel.

### 7. [INFO] No Wikipedia, Reddit, YouTube, or LinkedIn brand presence identified
**Description:** No evidence of external entity presence was found during this audit (site-side check only; live platform search not performed). Per the skill's brand-mention correlation data, YouTube mentions (~0.737) and Reddit presence correlate most strongly with AI citation likelihood, well above backlinks (~0.266). For a small local commercial cleaning business this is expected at this stage, but it caps the achievable Authority & Brand Signals score until addressed.
**Recommendation:** Medium/high-effort, lower priority than Findings 1-5: claim/verify Google Business Profile (feeds AI Overviews directly), seek local business directory and Reddit (r/Cleveland local recommendations) mentions, and consider a short YouTube walkthrough of a completed job.

---

## Top 5 Highest-Impact Changes

1. Remove all "SqueakyCle" leftover content and links (Finding 3) — critical, low effort, single highest-leverage fix.
2. Publish a real robots.txt with explicit AI crawler allow rules + sitemap reference (Finding 1) — high impact, low effort.
3. Add 134-167 word self-contained answer blocks with concrete facts (plans, service area, contact) on `/` and `/services` (Finding 4) — high impact, medium effort.
4. Fix heading hierarchy (one H1/page, question-based H2s) (Finding 5) — medium impact, low effort.
5. Populate `/llms.txt` with structured business summary (Finding 2) — low/speculative impact, low effort.

---

## Platform-Specific Estimate

| Platform | Estimated Score | Rationale |
|---|---|---|
| Google AI Overviews | 30/100 | Depends on classic ranking; canonical-host and sitemap gaps (see technical.md) limit indexation confidence feeding AIO |
| Google AI Mode | 25/100 | Broader pool but weighted toward freshness/entity authority — both weak here (no dates, entity confusion) |
| ChatGPT | 20/100 | Heavily weighted to Wikipedia/Reddit presence — none found; SqueakyCle contamination is especially damaging for entity resolution |
| Perplexity | 25/100 | Reddit/community-validation weighted — none found |
| Bing Copilot | 35/100 | Relies on Bing index + basic on-page signals; content is crawlable server-side, which helps here |
