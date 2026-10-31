# Route and redirects checklist

The live site contains URLs that do not share the new clean path conventions. The sample `public/_redirects` is recognized by Netlify-compatible deployments; on other servers implement actual **server-side permanent redirects**. Merely publishing `_redirects` on arbitrary hosting is not sufficient.

Verified old path -> intended new path:

| Old path | New path | Status |
| --- | --- | --- |
| /shared-hosting.html | /shared-hosting | 301 candidate |
| /wordpress-hosting.html | /wordpress-hosting | 301 candidate |
| /vps-server.html | /vps | 301 candidate |
| /enterprices-email.html | /business-email | 301 candidate |

Existing legal pages (/legal-agreement, /privacy-policy, /refund-and-cancellation-policy) must be preserved and reviewed with the owner; the new /legal page links to the current legal material and is **not** a replacement. Do not redirect legal documents to the homepage or overwrite them without approval. Additional indexed legacy routes, trailing slash aliases and commerce paths require a Search Console/server-log inventory. Do not interfere with `/dash/` (WHMCS).

Canonical host: `https://www.hostamble.com`. Redirect `http` and bare-host equivalents at the hosting layer after review. Avoid chains and loops.
