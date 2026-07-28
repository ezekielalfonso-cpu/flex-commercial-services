# Visual / Above-the-Fold Audit — flexcommercialservices.com

Pages tested: `/`, `/services`, `/booking`
Viewports: Desktop (1920x1080), Mobile (375x812) — full-page and above-fold captures
Screenshots: `flexcommercialservices.com-audit/screenshots/` (`home-*`, `services-*`, `booking-*`, plus per-page subfolders with all 4 viewports)

---

## Finding 1: No tap-to-call phone number in header/nav (Desktop & Mobile)
**Severity:** High
**Description:** The header/navbar on all three pages (desktop and mobile) contains only the logo and nav links (Home, About, Services, Booking) — no phone number is present in the hero or sticky header. The only `tel:` link (`tel:(216)-801-9686`) on the site lives in the footer, meaning mobile visitors must scroll through the entire page (hero, service cards/plans, and on `/booking` the full multi-field contact form) before reaching a clickable phone number. For a local Cleveland commercial cleaning company, phone calls are typically a primary/high-intent conversion path, and this is currently the least accessible CTA on the site.
**Recommendation:** Add a persistent, clickable `tel:` phone number in the header (icon + number) that is visible without scrolling on both desktop and mobile, or add a floating mobile "Call Now" button. Ensure it meets the 48x48px touch-target minimum.

## Finding 2: Homepage above-fold CTA is not the primary conversion action
**Severity:** Medium
**Description:** On both desktop and mobile, the homepage hero's only CTA button is "Our Services," which routes to `/services` rather than directly to booking/quote request or a call action. The actual booking CTA ("Book a Quote") only appears on the `/services` page, one click deeper. This adds friction for visitors who already know they want a quote.
**Recommendation:** Add a secondary, higher-contrast CTA in the homepage hero (e.g., "Get a Free Quote" linking to `/booking`, alongside or instead of "Our Services"), or add a phone CTA next to it so ready-to-convert visitors aren't forced through an extra page.

## Finding 3: Booking form is long and mostly below the fold on mobile
**Severity:** Low-Medium
**Description:** On mobile (375x812), the `/booking` page above-the-fold view shows the "Contact for Booking" heading/intro and only the top of the form (First Name, Last Name fields visible); Phone, Business Name, Email, and the submit button ("Let's get connected!") all require scrolling. This is acceptable for a lead form but increases the chance of drop-off, especially with no visible progress indicator or shorter alternative (e.g., a one-tap "Call instead" option) alongside the form.
**Recommendation:** Consider moving phone number/call CTA above or beside the form fold, or shortening the initial required fields, so mobile users have a fast path to conversion without scrolling.

## Finding 4: Above-the-fold content otherwise renders cleanly
**Severity:** Informational (positive)
**Description:** H1 ("Spotless Spaces, Superior Service" / "Our Cleaning Services" / "Contact for Booking") is visible without scrolling on all pages and viewports. Hero images load properly, text is legible (no sub-16px body copy observed), the mobile hamburger menu renders correctly (icon present, standard placement top-right), and no overlapping elements, text clipping, or broken layout were observed in desktop or mobile captures for any of the three pages. No obvious horizontal-scroll or layout-shift risk was visually detected in the static captures.
**Recommendation:** No action required; verify hamburger menu tap behavior in a live browser as this was not testable from static screenshots.

---

## Summary
- **Tap-to-call presence:** Exists (`tel:` link confirmed in page HTML) but is footer-only — not visible above the fold on any page/viewport.
- **Booking CTA prominence:** Strong on `/services` ("Book a Quote"), absent/indirect on homepage hero.
- **Layout/mobile responsiveness:** No broken layouts, overlaps, or text-overflow observed across desktop/mobile on `/`, `/services`, `/booking`.
- **Above-the-fold H1 + CTA:** Present on all pages; CTA relevance to booking varies by page.
