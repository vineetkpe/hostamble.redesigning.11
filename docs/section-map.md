# Page section inventory

The implementation keeps the landing page between **8 and 10 useful sections** and gives **every product page at least six**. These counts refer to real HTML `<section>` elements in the rendered build and are enforced in `scripts/verify-build.mjs`.

| Page | Planned section count | Sections in display order |
| --- | ---: | --- |
| Home | 10 | Hero; product discovery; domain search; getting-started journey; shared hosting pricing; six-month promotion; everyday benefits; choose your path; FAQs; support CTA |
| Shared Hosting | 8 | Hero; plan essentials; pricing; choosing a plan; launch steps; FAQs; domain search; support CTA |
| WordPress Hosting | 8 | Hero; WordPress introduction; pricing; plan tools; setup steps; FAQs; domain search; support CTA |
| Domains | 8 | Hero; domain search; extension guide; registration/renewal pricing; choosing a domain; registration steps; FAQs; support CTA |
| Business Email | 8 | Hero; use cases; enquiry; requirements; setup steps; domain search; FAQs; support CTA |
| VPS | 7 | Hero; introduction to VPS; possible use cases; quote enquiry; planning steps; FAQs; support CTA |

## Editorial principles

- Every section has a visitor job: discovery, comparison, education, action, or support.
- Shared/WordPress prices and domain renewals continue to come from `src/data/catalog.json`. We do not add an independent hardcoded pricing table inside the new sections.
- Business Email and VPS do **not** publish invented product pricing, specifications, guarantees or delivery dates. They explain how to request a verified quote.
- Keep the domain search as an actual WHMCS handoff; never invent live availability.
- Make sections responsive and keyboard friendly; use native FAQ disclosures and reduced-motion settings.
- New copy and the visual identity are still subject to owner review and production business verification.

To check: `npm run build && npm run verify:build`. CI also runs a Cloudflare Wrangler clean-checkout dry run before calling `verify:build`.
