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

## Cloudflare Workers (Git integration)

This is an Astro **static-assets Worker**, not Astro SSR. The committed `wrangler.jsonc` deploys `./dist` with clean URLs (`drop-trailing-slash`) and a real 404 response. `public/_redirects` and `public/_headers` are copied to dist and supported by Workers static assets. `npm run deploy` invokes Wrangler; no Cloudflare API token is stored in the repository.

**Cloudflare Worker project name must match `wrangler.jsonc.name`.** Its default value is `hostamble-redesign`; if your existing connected Worker has another name, **change this field to the exact existing Worker name** before deploying. The Git connection itself does not reveal the Worker name to this repository. If you see `Worker name mismatch` in Cloudflare's build log, correct this field instead of creating a second Worker.

In Cloudflare Workers & Pages → your Worker → **Settings → Build**, use production branch `main`, deploy command `npx wrangler deploy`, and root directory `/`. The repository's `wrangler.jsonc` now contains `"build": { "command": "npm run build" }`, so Wrangler builds Astro and creates `dist/` automatically even if Cloudflare's separate Build command field is empty. You may leave that field empty to avoid building twice, or set it to `npm run build` if desired. Production builds currently default to `noindex` until commercial/SEO sign-off. Once approved, use `PUBLIC_SITE_STAGE=production npm run build` as the **production** build command (keep preview builds noindexed). Cloudflare provides `WORKERS_CI_BRANCH` so your build configuration can distinguish preview and production branches. After modifying settings, push a new commit for a new build.

**Preserve WHMCS:** The domain `https://hostamble.com/dash/` must continue to resolve to the existing billing server. If a Worker is assigned as the catch-all for this host, requests to `/dash/*` can 404 or hit the static site instead. Configure separate hostname or route exclusions before routing the production website. The frontend cannot resolve this at build time. Also confirm Workers custom domain, TLS, and canonical `www`/apex redirects in Cloudflare dashboard.

To test without deploying from a clean checkout, run `npx wrangler deploy --dry-run --outdir .wrangler-dry-run && npm run verify:build`. This confirms the exact Cloudflare deploy command can create `dist/` itself. Avoid linking the Worker to the live site until these tests and the checkout route have been verified.

### Cloudflare error: assets.directory ./dist missing

If Cloudflare reports `The directory specified by assets.directory does not exist: /opt/buildhome/repo/dist`, it previously skipped the Astro build. Commit introducing Wrangler's `build.command` fixes this in source: every `npx wrangler deploy` must first run `npm run build`. GitHub Actions deliberately tests the Wrangler command with `dist` deleted and fails if the build output is not recreated. If Cloudflare still reports the same error after this commit, verify that the Worker builds from repository root `/` and deploys the latest `main` commit (rather than an older branch or mismatched root directory).
