# Hostamble — website redesign

A new, **static Astro** marketing site for Hostamble. This is a **review branch**, not a live deployment. The repository started with only a README and .gitignore; no approved `concept/`, artwork, fonts, or strategy assets were present to port. The CSS illustration and simple "h." symbol are original working visual concepts pending brand sign-off.

## Run locally

Requires **Node 22.12+** and npm.

```bash
npm ci                 # after CI generates the lockfile
cp .env.example .env
npm run dev
npm run validate:catalog
npm test
npm run check
npm run build
npm run preview
```

If a fresh clone is missing `package-lock.json` while the initial CI run is still generating it, run `npm install` once. The workflow attempts to commit a resolved lockfile to this feature branch after checks succeed. Do not merge without a committed lockfile and a green build.

## Pages

`/`, `/shared-hosting`, `/wordpress-hosting`, `/domains`, `/business-email`, `/vps`, `/about`, `/support`, `/guides`, `/legal`, and a custom `404`. Business email and VPS are **enquiry-led**, not invented product tables.

## Update prices in one place

Edit **`src/data/catalog.json`**. All amounts are **integer paise** (₹49 = 4900); explicitly list every offered cycle rather than multiplying. Domain first-year and renewal amounts are separate. Run `npm run validate:catalog && npm test && npm run build` after edits.

`src/lib/pricing.mjs` guards against negative or missing prices, unknown cycles, duplicate IDs and unsafe WHMCS links. The website displays data from the catalog both with and without JavaScript. The current INR/USD rate is **null** until a verifiable source, observation date, and acceptable age are recorded; the selector safely stays in INR. USD is only an estimate, never a billing currency.

**Important:** Changes in this repository **do not update WHMCS**. Reconcile plan names, cycles, product IDs, renewal figures, taxes and promotion eligibility with the billing platform *before* publishing. No client-controlled price is submitted to checkout. Plan actions intentionally open the relevant WHMCS store, not an unverified direct product ID. Domain search is a native GET to `/dash/cart.php` with `a=add`, `domain=register`, and a `query` field.

## Preview versus production

The default build is a **noindex preview** (`PUBLIC_SITE_STAGE=preview`). In this mode all pages have `noindex,nofollow`, robots disallows crawling, and sitemap is empty.

Only after launch checks: build with `PUBLIC_SITE_STAGE=production` for indexable pages, a production robots file, and the explicit sitemap. Protect staging with authentication at the hosting layer; robots/noindex alone are not access controls.

Static hosting must support clean URLs and required redirects. `public/_redirects` is the Netlify-compatible starter map; other providers need native 301s (see `docs/redirects.md`). Configure TLS, a restrictive CSP after asset tests, HSTS, referrer policy, `X-Content-Type-Options`, and frame protections at the deployment layer. Never store deployment credentials in the repo.

## Verification and status

`tests/pricing.test.mjs` covers the central pricing logic, USD fallback, safety guardrails, and known cycles. A GitHub Actions job is included to test and build the project when a branch is pushed. Visual/browser checks (320–1440px, keyboard, focus, reduced motion) and actual WHMCS checkout verification are **not yet completed**.

See `docs/launch-checklist.md` for commercial discrepancies and launch blockers. Do not deploy this draft over the live site until signed off.
