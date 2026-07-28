# GEO / AI Overviews Audit — Flex Commercial Services (localhost:4321)

## GEO Readiness Score: 61/100

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Citability | 25% | 50/100 | FAQ answers too short (16-46 words, below 134-167 optimal); services page has one 514-word unbroken paragraph |
| Structural Readability | 20% | 78/100 | FAQ now uses real question-based `<h2>` (verified) + FAQPage JSON-LD; services page has only 3 `<h2>`s for dense content |
| Multi-Modal Content | 15% | 55/100 | Images present with alt text (services: 9 imgs, descriptive but generic alts e.g. "Restaurant", "Office"); no video |
| Authority & Brand Signals | 20% | 55/100 | LocalBusiness/ProfessionalService JSON-LD with NAP, geo, areaServed present; dynamic copyright year confirmed (2026); no dates, no external platform presence (known/open) |
| Technical Accessibility | 20% | 90/100 | SSR/static output confirmed via `astro build`; robots.txt default-allows all crawlers (verified) |

## Verified fixes (all confirmed)
1. **FAQ headings**: All 8 Q&As render as real `<h2>` in raw HTML (confirmed via direct extraction, not JS-dependent), plus `FAQPage` JSON-LD schema present.
2. **robots.txt**: `dist/robots.txt` (build-time) = `User-agent: *` / `Allow: /` with sitemap reference — no blocks on any crawler, AI or otherwise.
3. **Stats banner**: Home page raw HTML shows real values (100+, 5★, 3+) — not "0+"/"0★". Same confirmed on `/about`.
4. **No entity contamination**: No unrelated business names in testimonials. One benign hit for "GoHighLevel" in `booking.html`, but it's inside an HTML `<!-- -->` developer comment (CRM platform reference, not a competing brand), invisible to text extraction/crawlers — not a contamination issue.
5. **Footer copyright**: Renders "© Flex Commercial Services 2026" dynamically, matching current year.

## New findings

**[Medium] FAQ answers are under-length for citation.** All 8 answers are 16-46 words vs. the 134-167 word optimal citation window. Short answers reduce standalone extractability for AI Overviews/ChatGPT. *Fix:* Expand 3-4 highest-value answers (pricing process, insurance, industries served) to 100-160 words with specific facts. Effort: Low.

**[Medium] Services page lacks structural breakdown.** Only 3 `<h2>` elements; the main descriptive content is a single 514-word paragraph rather than per-service self-contained blocks. *Fix:* Add a question/service-based H2 per offering (e.g., "What's included in office cleaning?") each followed by a 134-167 word self-contained passage. Effort: Medium.

**[Low] Image alt text is generic.** Alts like "Restaurant", "Office", "Medical" don't convey specific service value; could be more descriptive for multi-modal signal strength. Effort: Low.

## Known/open gaps (not re-flagged as new, per brief)
No `/llms.txt` (Info only — no ranking weight per primary-source evidence), no pricing/guarantee facts as citable text, no publish/updated dates, no Wikipedia/Reddit/YouTube presence.

## Platform-specific estimate
- Google AI Overviews: ~60/100 (SSR/schema good, thin passages hurt)
- ChatGPT: ~40/100 (no Wikipedia/Reddit entity signals)
- Perplexity: ~35/100 (no Reddit/community presence)
- Bing Copilot: ~60/100 (clean crawl access, decent schema)
