# Hostamble public-site content audit — 1 November 2026

**Status:** Full Astro source migration staged in `feat/content-audit-and-product-pages`. This is a review build, not approved for production. `main` is untouched by this change. Public staging remains `noindex,nofollow` and `robots.txt` disallows indexing.

## Route inventory and migrations

| Original route | Native Astro page | What changed / verification |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Rebuilt existing hero, promotion, domain search, pricing, features, setup, support, Trustpilot and FAQs using original theme classes and reusable Astro components. Removed obsolete July/discount claims, fake reviews, placeholder news and domain auto-indexing assertion. |
| `/shared-hosting.html` | `src/pages/shared-hosting.html.astro` | Confirmed technology, backup/migration facts, central shared pricing component; limits and totals unresolved rather than invented. |
| `/wordpress-hosting.html` | `src/pages/wordpress-hosting.html.astro` | Same underlying hosting service, WordPress installation; removed fake managed/cloud/automatic updates and exclusive resources. |
| `/domain-search.html` | `src/pages/domain-search.html.astro` | Functional WHMCS domain registration GET handoff; centrally listed first-year/renewal prices with caveat. No availability claimed. |
| `/transfer-domain.html` | `src/pages/transfer-domain.html.astro` | Transfer form handoff, registrar lock/authorization/eligibility overview; no invented universal fees or period extensions. |
| `/about-us.html` | `src/pages/about-us.html.astro` | Removed fictitious template team, company history, fabricated customer counts/testimonials. |
| `/contacts.html` | `src/pages/contacts.html.astro` | Support channels and confirmed hours/reply window; removed mismatched international `tel:` URL, unverified direct telephone claims and broken old contact form. |
| `/legal-agreement.html` | `src/pages/legal-agreement.html.astro` | Original terms section carried forward, unchanged in legal meaning, native Astro markup. Requires legal review. |
| `/privacy-policy.html` | `src/pages/privacy-policy.html.astro` | Original privacy policy carried forward, native Astro markup. Requires owner/legal review for current law and practices. |
| `/refund-and-cancellation-policy.html` | `src/pages/refund-and-cancellation-policy.html.astro` | Original refund/cancellation text preserved for legal review. Owner-approved public summary: seven-day money-back guarantee on **annual hosting plans**, but old policy text may differ. |
| `/business-email.html` | `src/pages/business-email.html.astro` | New factual enquiry page; no invented mailbox limits or pricing. Distinguishes paid service from included hosting mailboxes. |
| `/vps-server.html` | `src/pages/vps-server.html.astro` | New factual enquiry page; no fabricated CPU, RAM, OS, management, location or availability. |
| `/login.html`, `/register.html` | Native `.astro` client-area handoff pages | No duplicated sign-in/registration forms: WHMCS keeps authentication. |
| `/404` | `src/pages/404.astro` | Original 404 source retained. |

**Unmigrated public source pages:** None from the twelve archived HTML files: 10 public content pages and two old WHMCS wrapper pages are accounted for. Business Email and VPS are newly implemented. Original archive does **not** contain published Business Email/VPS product specification pages, blog articles, or a verified SLA. `/blog.html`, `/offers.html`, Cloud Hosting, reseller hosting, and archived miscellaneous template/demo pages are deliberately not generated; they are not part of the approved product set.

## Shared implementation

- `src/layouts/SiteLayout.astro` contains metadata and theme asset imports.
- `src/components/Header.astro`, `Footer.astro`: **native theme markup**, no runtime fragment includes.
- `HomeHero`, `HomeSections`, `PageHero`, `DomainSearch`, `DomainPrices`, `PricingGrid`, `FeatureGrid`, `FAQs`, `ContactCTA`: reusable native Astro components using the original CSS class names.
- `src/data/pricing.json` is the central source of INR amounts, cycles, domain rates and checkout paths; `src/lib/pricing.mjs` validates plan identifiers, price totals and checkout URLs. Missing hosting totals are **null**, not calculated or displayed as guessed figures. USD conversion disabled unless an approved dated FX rate is provided.
- `src/data/content.mjs` holds approved feature/support/offer/FAQ text. Interactions use `public/assets/js/site-interactions.js`, original theme JS, and native `<details>`.
- No new fonts, logo, visual system or animation libraries. Original CSS in `public/assets/css/*` and existing images/fonts retained pending visual parity review.

## Unresolved owner / launch confirmations

1. **Hosting catalog:** Archived home displays Basic/Starter/Elite ₹59/₹79/₹109 monthly while archived Shared page displays ₹49/₹99/₹149. Live checkout also exposes PERSONAL/STARTUP/PREMIUM/BUSINESS plans, conflicting names/specifications. Need *current actual purchasable plan IDs, names, per-cycle totals, renewal prices, tax treatment, website/storage/bandwidth/database limits* before publishing prices or removing disclaimers. Existing category and archived deep links were kept for owner verification; the site cannot change WHMCS billing details.
2. **`.us.cc` promotion:** Approved text is exactly “Get a free .us.cc domain with semiannual hosting.” Owner must confirm eligible products, registration period, redemption mechanism, exclusions and renewal rates. Public domain registration and renewal rates are separate and not free forever.
3. **Refund:** Owner approves seven-day money-back guarantee **on annual hosting plans only**. The archived refund policy has broader “first payment” language; legal review and explicit owner sign-off required before publishing a reconciled document. Do not silently edit legal rights.
4. **SLA:** Owner reports 99.99% uptime guarantee and an SLA document, but original SLA document/URL was not supplied. No numerical uptime or SLA remedy promise is published.
5. **WHMCS:** Verify every deep checkout product URL, billing cycle, domain transfer and registration handoff using a signed-in session (without placing orders), and confirm promotions actually apply in checkout. Account registration path must be confirmed if different from `/dash/register.php`.
6. **Support:** User supplied live chat/WhatsApp staffed hours and 12-hour *reply* (not resolution). Obtain a verified WhatsApp direct URL before adding it. `support@hostamble.com` and WHMCS client area remain visible.
7. **Business Email:** Confirm package prices, billing units, mailbox storage/counts, access methods, spam protection, setup/migration support and difference from hosting mailboxes.
8. **VPS:** Confirm current plan availability, CPU/RAM/disk/bandwidth, OS, control panel, root access, management scope, backups, billing, provisioning and support.
9. **Domain pricing:** Rates were read from the publicly indexed WHMCS domain pricing table on 1 Nov 2026; .com first/renew ₹1299, .online ₹299/₹4999, .site ₹199/₹4599, .xyz ₹338.99/₹2378.99, .shop ₹262.80/₹4198.80, .us.cc ₹599/₹1499. Confirm in live client checkout before launch. Registrant privacy and DNS feature availability varies by TLD.
10. **Legal & SEO:** Review current terms, privacy, refund policy with the business and lawyer. Staging is blocked from indexing and sitemap publication. Production indexing/redirect decisions must be approved.

## Links and redirects

- Content links point to equivalent local archived `.html` routes, preserving familiar URLs.
- Login/register, domain availability, orders, domain pricing and billing leave Astro for verified / original WHMCS endpoints (`hostamble.com/dash/`). No custom authentication or checkout added.
- Trustpilot points only to `https://www.trustpilot.com/review/hostamble.com`. No unverifiable quotes or scores.
- No Cloud Hosting/reseller public routes, sitemap entries or nav items.
- Unverified blog/template links removed. If permanent URL changes are approved, configure 301 redirects before launch.

## Validation

`npm run check`, `npm run build`, `npm run validate:content`, browser navigation, mobile horizontal-overflow checks, billing controls, domain form handoffs and legal links are part of the CI review. Items that cannot be tested without live billing credentials remain explicitly blocked rather than guessed. **No production deployment authorized.**
