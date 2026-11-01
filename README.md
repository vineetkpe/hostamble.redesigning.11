# Hostamble: native Astro migration (review branch)

Native Astro public pages and reusable components preserve the archived AceOrbit theme classes, original stylesheets, illustrations, font/icon files, scripts and brand identity.

- Shared components: `src/components/` (header, footer, hero, domain search, pricing grid, features, FAQ, CTA).
- Public routes: `src/pages/*.astro` (original `.html` URLs retained).
- Shared data: `src/data/pricing.json` (central INR pricing), `src/data/content.mjs` (support, offer, FAQ and hosting facts).
- Original CSS and vendor assets remain in `public/assets/` until full browser parity is verified.
- WHMCS owns accounts, orders, billing, domain purchases, and transfers. Astro does not replace checkout.
- Current staging output is `noindex`; do not publish to production without owner approval.

Run `npm install`, `npm run check`, `npm run build`, and `npm run validate:content`.

See `CONTENT-AUDIT.md` for unresolved business facts and route inventory.
