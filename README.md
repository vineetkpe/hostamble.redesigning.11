# Hostamble — clean slate

The previous Hostamble website implementation has been **removed from the current working tree** so we can start again from scratch.

Only a blank Astro starter, a plain temporary placeholder, and the minimum Cloudflare Workers deployment configuration remain. There are **no** old marketing pages, designs, styling systems, logo artwork, pricing tables, checkout integrations, or client-side interactions in this version.

Previous commits remain in Git history if individual files ever need to be recovered. This is a deliberate clean-start commit, **not** a finished website.

## Start development

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npx wrangler deploy --dry-run
```

## Cloudflare Git deployment

The existing `wrangler.jsonc` retains the Worker name `hostamble-redesign`, the `./dist` static-assets directory, and the automatic `npm run build` command so that `npx wrangler deploy` works from a clean checkout.

**Important:** A push to the Cloudflare-connected production branch may replace the former website with the minimal placeholder. This is intentional for the requested reset. The placeholder has a `noindex` tag and `robots.txt` blocks crawler indexing.

If `/dash/` is on the same production hostname, preserve its separate existing billing-system routing in Cloudflare. A static Worker cannot serve those old billing endpoints automatically.
