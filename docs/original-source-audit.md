# Original Hostamble source audit (3333.zip)

## Source inventory

- 12 original `.html` pages, 8 CSS files, 9 JavaScript files, 71 PNG images, 24 JPG images, plus icon fonts/SVG assets.
- Original branding: `assets/images/logo.png`, `amble.png`, `favicon.png`; theme CSS `assets/css/style.css`, Bootstrap, Remixicon, AceOrbit icon CSS; external Urbanist font stylesheet in original CSS.
- Main page composition: transparent/sticky header, mobile menu and search popup, promotional hero and hosting graphics, domain search, pricing plan tabs, service features, setup, testimonials, support, news, recognizable four-column footer.
- Original forms include an obsolete `/dash/domainchecker.php` POST on the homepage, migrated in this checkpoint to verified GET handoff `https://hostamble.com/dash/cart.php` with `a=add`, `domain=register`, and `query`.
- Original integration scripts: jQuery, Bootstrap, Slick, SAL, WOW, Magnific Popup, AceOrbit main.js, back-to-top. OneSignal/Tawk scripts are not loaded during this checkpoint, pending account-owner verification.

## Existing page/SEO URL inventory

- `/` (`index.html` original)
- `/shared-hosting.html`, `/wordpress-hosting.html`
- `/domain-search.html`, `/transfer-domain.html`
- `/about-us.html`, `/contacts.html`
- `/legal-agreement.html`, `/privacy-policy.html`, `/refund-and-cancellation-policy.html`
- `login.html` and `register.html` in the ZIP are wrapper pages; existing WHMCS retains identity and account management.
- Missing source files linked in the original: `/blog.html` and `/offers.html`; don't create fabricated routes.

At this checkpoint only `/` is implemented in Astro. Unconverted page links explicitly target the original production site. Preserve final URLs or add redirects during migration.

## Pricing, promotion, and factual discrepancies (resolve before launch)

- The archived source contains expired Republic Day / August 2026 promotional text, `77% OFF`, free-domain language tied to conflicting billing periods, and a countdown; the checkpoint removes stale countdown and rewrites obviously expired sale labels without changing the visual layout.
- The archived homepage's hosting pricing tables list Basic ₹59 monthly, Starter ₹79, Elite ₹109 (other cycles shown in the original archive). These must not be presented as verified live checkout prices.
- The owner confirms an `.us.cc` offer with **six-month** hosting, but eligibility, registration period, and renewals need confirmation.
- The archived source mentions BitNinja; owner confirms the current security product is Imunify360. Backup retention currently confirmed as daily JetBackup for the past 3 days on Shared/WordPress.
- The original page contains historical testimonials. Their provenance needs validation before production use.
- Source includes a contact form without a verified back-end handler; do not claim submission works.
- Source includes other services and generic claims that need owner review before migration.

## Visual checkpoint and testing limits

Astro wrappers preserve original markup/CSS/assets. **Actual desktop/mobile screenshots have not been generated** because local Chromium navigation was blocked by the execution environment. To verify exact visual parity, open the bundled checkpoint with `npm run dev` in a normal desktop browser and compare against `/reference/3333-original-website-source.zip`. Do not approve solely from simulated images.

Review hero, menu, domain search and plan tabs first, then approve section conversion for Shared Hosting, WordPress, Domains, Business Email and VPS. No production deployment is authorized.
