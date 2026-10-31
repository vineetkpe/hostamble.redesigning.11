# Hostamble launch blockers — operator checklist

This file is internal workflow documentation and should **not** be exposed as public website data.

## Pricing and product truth — unresolved

- [ ] Shared page published Basic ₹49/mo, Starter ₹99/mo, Elite ₹149/mo in October 2026. Other live pages show Basic ₹59, Starter ₹79, Elite ₹109. Confirm which products are sold in WHMCS.
- [ ] WordPress Growth published ₹139 monthly / ₹1168 annually, which is not twelve months at the monthly rate; **do not silently alter**. Confirm annual price and site limits. WordPress store lists different plan labels and capacities.
- [ ] Confirm tax treatment, renewal hosting charges, refund applicability, free domain rules, and plan cycle options directly with WHMCS.
- [ ] Verify each plan's WHMCS product ID and exact billing-cycle mapping before deep-linking to a selected plan; avoid generic checkout links if they cannot preserve selections.
- [ ] Recheck domain first-year and renewal prices (.com ₹1299/₹1299, .in ₹814.80/₹814.80, .online ₹299/₹4999, .site ₹199/₹4599), and any premium-domain fees.
- [ ] Verify .US.CC promotional terms, eligible semiannual hosting plans, region/availability, and whether the domain is free only as a bundled offer.
- [ ] Verify Business Email and VPS commercial packages; until then they are enquiry-only.
- [ ] Source a current dated INR/USD exchange rate; record rate, date, and source in catalog. Keep USD disabled if unavailable or stale.

## Brand and content

- [ ] Provide/approve final Hostamble logo artwork, font license files, palette and copy. Existing repo contained no approved concept assets.
- [ ] Review all support and marketing language with the owner. No unverified uptime metrics, customer reviews, savings or guarantees should be added.
- [ ] Approve full legal policy text and verify migrated terms/privacy/refund destinations.

## Cloudflare Workers

- [ ] Set `wrangler.jsonc.name` equal to the connected Worker name (the current name is unverified).
- [ ] Confirm the Worker listens to `main`; use Cloudflare Git integration build command `npm run build` and deploy command `npx wrangler deploy`.
- [ ] Keep `hostamble.com/dash/*` served by legacy WHMCS (routing/exclusion required if assigning Worker to the apex host).
- [ ] Confirm whether the public site is on `www.hostamble.com` or apex before publishing canonical tags and Search Console.

## Engineering, SEO and deployment

- [ ] Confirm package-lock committed by CI and `npm ci`, catalog validation, tests, typecheck, build all pass.
- [ ] Test menu, FAQ disclosures, pricing periods, stale USD fallback, localStorage errors, ticker pause/Escape/reduced motion and domain query handoff.
- [ ] Test no overflow and keyboard navigation at 320/375/768/1024/1440 CSS pixels; audit contrast, zoom, focus and assistive technologies (WCAG 2.2 AA target).
- [ ] Audit Lighthouse and real field data against LCP 2.5s, INP 200ms, CLS 0.1 goals (not measured).
- [ ] Complete old URL inventory and server-side 301 map, canonicals, sitemap, custom 404 and non-looping redirects.
- [ ] Ensure staging is both access-controlled and noindexed; set `PUBLIC_SITE_STAGE=production` only for an approved production build.
- [ ] Apply response headers, TLS, credential scoping, MFA, and staging access controls in the deployment service.
- [ ] Validate domain/WHMCS handoffs manually. Test without purchases or sending customer messages.
- [ ] Configure Search Console and consent-aware analytics only with authorized production account access.
- [ ] Arrange backup and rollback plan before live DNS or hosting replacement.

## Source checks

Consult `docs/source-notes.md` for where provisional values came from. Recheck all commercial facts on launch day.

## Approved visual correction — remaining verification

- [ ] The supplied Open Waypoint SVG is now used consistently; obtain the missing original concept HTML/CSS and brand guide for final pixel-level review (they were not attached to this repository).
- [ ] Approved display fonts are loaded from Google Fonts; obtain original bundled licensed font files if local hosting is required.
- [ ] Confirm exact eligibility, registration duration, renewals and exclusions for the owner-approved free .us.cc domain with six-month hosting. The banner selects semiannual totals but does not promise WHMCS will auto-apply an unverified offer.
- [ ] Verify actual plan-ID/deep-link and four-cycle agreement with live WHMCS; do not silently correct the WordPress Growth annual discrepancy.
- [ ] Recheck domain registration/renewal snapshot (31 Oct 2026) before production launch.
- [ ] Confirm any specific chat and WhatsApp destination URLs; do not invent URLs.
- [ ] Browser check for 320/375/768/1024/1440 px, keyboard, native domain handoff, and reduced-motion; static build alone does not establish WCAG compliance.
- [ ] Inspect public staging/production indexing; the default preview build is deliberately noindex.
