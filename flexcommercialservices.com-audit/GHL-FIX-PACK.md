# GoHighLevel Fix Pack — flexcommercialservices.com

Ready-to-apply content for whoever has GHL/Cloudflare admin access. I don't have credentials to this account, so these are drop-in pieces, not applied changes. Ordered by phase from ACTION-PLAN.md.

---

## Phase 1 — This week

### 1. Remove "SqueakyCle" leftover branding

Search the GHL funnel builder (Sites → your funnel → each page's elements, plus any global "Footer" section) for these exact strings and remove/replace every instance:

- `SqueakyCle` / `SqueakyClean` (testimonial text block)
- `squeakycle.com` and `squeakycle.com/booking` (button/link URLs)
- `squeakycle@gmail.com` (contact reference)
- Any button `aria-label` reading "About SqueakyCle" — relabel to match its actual destination (Flex's own About page)

This appeared **7 times in the homepage's raw HTML alone** and is shared via the global footer/testimonial component, so check every page, not just the homepage. Likely origin: an unedited GoHighLevel snapshot/template built for a different client.

Replace the testimonial with a real, attributed quote (or temporarily remove it — a missing testimonial is far less damaging than a competitor's name on your homepage).

### 2. Publish a working robots.txt

In GHL: Settings → Domains (or Sites → Funnel Settings, depending on your GHL setup) usually has a robots.txt override; if not, this needs a Cloudflare Worker/redirect rule serving the file directly at `/robots.txt`. Content to publish:

```
User-agent: *
Allow: /

Sitemap: https://flexcommercialservices.com/sitemap.xml
```

(Points to `/sitemap.xml` rather than Astro's `/sitemap-index.xml` convention, since GHL is the live platform — see item 4 below.)

### 3. Check for unpublished/draft assets on `/services` and `/booking`

The 20.3s and 7.45s load times trace to ~40 JS files loaded from URLs containing `_preview`. In GHL: open each funnel step/page and confirm it shows **Published**, not just saved as a draft, then hit "Publish" again explicitly on `/services` and `/booking` even if they appear live. If they're already published and `_preview` paths persist, contact GHL support — this may be a platform-side caching/CDN issue.

### 4. Fix canonical tags

GHL usually exposes a "Custom Meta" or "SEO" panel per page. Set on each page:

| Page | Canonical URL to set |
|---|---|
| `/` (root) | `https://flexcommercialservices.com/` |
| `/home` | `https://flexcommercialservices.com/` (same as root — or better, 301-redirect `/home` → `/` entirely and remove the duplicate page) |
| `/about` | `https://flexcommercialservices.com/about` |
| `/services` | `https://flexcommercialservices.com/services` |
| `/booking` | `https://flexcommercialservices.com/booking` |

Non-www, no trailing slash inconsistencies. If GHL's panel only accepts a toggle ("self-referencing canonical: on"), turn that on instead and skip the `/home` merge for now — just get `/` and `/booking`/`/about`/`/services` self-referencing first.

### 5. Verify/claim Google Business Profile

This is outside the website — go to https://business.google.com and search "Flex Commercial Services Cleveland". If a listing already exists but is unclaimed, claim and verify it. If none exists, create one with primary category **"Commercial Cleaning Service"** (not generic "Cleaning Service"), matching NAP: phone `(216) 801-9686`, service area Cleveland/Northeast Ohio (no public address needed — service-area business).

---

## Phase 2 — Next

### 6. Security headers (Cloudflare)

If the domain is proxied through Cloudflare (confirmed — `Server: cloudflare` on every response), add a **Transform Rule** (Rules → Transform Rules → Modify Response Header) applying to all requests:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
```

### 7. Remove pinch-zoom lock on `/booking`

In GHL's page settings for `/booking`, find the viewport/meta configuration (may be under page-level "Custom Code" head injection) and remove `user-scalable=no` / `maximum-scale=1` if it was manually added — check if this came from a form-widget plugin setting rather than the page itself.

### 8. Add above-the-fold tap-to-call

In GHL's header/nav element (global, applies site-wide), add a phone icon + `tel:+12168019686` link. Most GHL header widgets have a built-in "Phone Number" element — enable it if present, or add a text/button element with that link.

### 9. LocalBusiness schema — consolidated, ready to inject

If GHL exposes a "Custom Code — Header" field (site-wide or per-page), paste this once (ideally site-wide, or at minimum on `/`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://flexcommercialservices.com/#business",
  "name": "Flex Commercial Services",
  "description": "Professional commercial cleaning company serving Cleveland and Northeast Ohio. Specializing in office, restaurant, fitness center, and school/daycare cleaning, plus move-in/move-out cleaning.",
  "url": "https://flexcommercialservices.com",
  "telephone": "+12168019686",
  "email": "teamflexcommercialservices@gmail.com",
  "priceRange": "Custom quote",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cleveland",
    "addressRegion": "OH",
    "postalCode": "44102",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 41.4993, "longitude": -81.6944 },
  "areaServed": "Northeast Ohio",
  "sameAs": ["https://www.instagram.com/teamflexservices"]
}
</script>
```

Note the corrected non-www `url`/`@id` and the corrected Instagram handle (`teamflexservices`, matching the real footer link — the old schema pointed at the wrong account).

### 10. llms.txt (low priority, low effort)

If you can publish a static file at `/llms.txt` via GHL or a Cloudflare Worker:

```
# Flex Commercial Services

Commercial cleaning company serving Cleveland and Northeast Ohio, OH.

## Pages
- Home: https://flexcommercialservices.com/
- About: https://flexcommercialservices.com/about
- Services: https://flexcommercialservices.com/services
- Booking: https://flexcommercialservices.com/booking

## Key facts
- Phone: (216) 801-9686
- Services: Restaurant cleaning, office cleaning, fitness center cleaning, school/daycare cleaning, move-in/move-out cleaning
- Plans: Basic, Standard, Premium
```

---

## What I can't do from here

Applying any of the above requires logging into GoHighLevel and/or Cloudflare — I don't have those credentials and won't ask for them. If you want, paste me a screenshot of the GHL page editor once you're in a specific section (e.g. the testimonial block, or the SEO/meta panel) and I can tell you exactly what to click/change from there.
