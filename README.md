# Hostamble — original theme visual checkpoint (Astro)

This is the **first homepage checkpoint** reproduced from the user-provided original-site source. It is not a finished rebuild. The source archive is retained separately in the user's uploaded original `3333.zip` and the downloadable checkpoint package.

The implementation intentionally reuses the original Hostamble/AceOrbit HTML, CSS, JavaScript, image and icon assets. The archive's old countdown and anti-copy blocker were removed. Previously listed prices and testimonials require business confirmation; do not treat them as verified live data.

## Development

Node.js 22.12+ required.

```sh
npm install
npm run dev
npm run check
npm run build
npx wrangler deploy --dry-run
```

The only built Astro routes are `/` and `/404`. Other pages currently link to the existing original website pending phased migration. WHMCS `/dash/*` must remain handled by its existing service, not by this static project.

The entire checkpoint is **noindex** in both HTML and robots.txt until the user approves the rebuilt original design. See `docs/original-source-audit.md` for discrepancies and remaining steps.

**Cloudflare:** `wrangler.jsonc` keeps the Worker name `hostamble-redesign`, the `dist` asset output and `npm run build` setup that Git-connected deployment expects.
