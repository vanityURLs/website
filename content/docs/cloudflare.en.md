---
title: "Cloudflare Workers"
description: "Recommended Cloudflare configuration for vanityURLs Workers, custom domains, DNS, Access, observability, and zone protection."
nav_order: 10
---

The current vanityURLs runtime deploys as a Cloudflare Worker with static assets. The Worker is the origin for the short-link hostname, so use a Worker Custom Domain instead of the older Pages `_redirects` or DNS `AAAA 100::` route pattern.

## Recommended Worker shape

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-05"
workers_dev = false
preview_urls = false

[build]
command = "npm run build"

[assets]
directory = "./build"
binding = "ASSETS"
not_found_handling = "404-page"
run_worker_first = [
  "/*",
  "!/*.css",
  "!/*.js",
  "!/*.png",
  "!/*.svg",
  "!/*.ico",
  "!/*.webmanifest",
  "!/*.txt",
  "!/*.xml",
  "!/fonts/*",
]

[[routes]]
pattern = "v8s.link"
custom_domain = true

[observability]
[observability.logs]
enabled = true
invocation_logs = true
```

The important parts are:

- `custom_domain = true`, because the Worker is the origin for the whole hostname.
- `workers_dev = false` and `preview_urls = false`, because public preview hostnames are unnecessary for a production shortener.
- `ASSETS` binding, because the Worker serves default and custom static pages from `build/`.
- `run_worker_first`, because short-link lookup, protected paths, scanner blocks, and analytics must run before asset fallback.
- Workers Logs enabled, because Cloudflare metrics are useful for performance and error rate, but application events belong in server-side analytics.

## DNS and domains

For the root short domain, prefer the Worker Custom Domain row that Cloudflare creates for the Worker. It should appear as a proxied Worker record for the hostname, like `v8s.link -> v8s-link`.

Avoid keeping legacy synthetic `AAAA 100::` records for the same hostname once the Custom Domain is active. Keep mail records, DKIM, DMARC, MTA-STS, and ownership verification records as DNS-only unless the service explicitly requires proxying.

Use separate proxied records only for real web subdomains, such as `mta-sts`, `www`, or a docs site.

## Zone security

Recommended free-plan posture for the short-link zone:

| Setting | Recommendation |
|---|---|
| DNS setup | Full |
| SSL/TLS mode | Full strict |
| Always Use HTTPS | On |
| TLS 1.3 | On |
| Minimum TLS | 1.2 or stricter |
| Bot Fight Mode | On |
| Block AI crawlers | On all pages, unless you intentionally want model crawlers |
| Development Mode | Off |
| Under Attack Mode | Off unless actively mitigating an incident |
| Manage robots.txt | Disabled if the repository already ships `robots.txt` |
| Browser Integrity Check | On |
| URL Normalization | Normalize incoming URLs |

Add WAF custom rules for scanner probes and unexpected methods when the zone needs more protection than the Worker-level blocklist. Keep rate limits focused on repeated misses and scanner-like paths; do not rate-limit normal redirect traffic too aggressively.

## Protected operations

Protect these paths with a Cloudflare Zero Trust self-hosted application:

```text
v8s.link/_stats
v8s.link/_stats/*
v8s.link/_tests
v8s.link/_tests/*
```

Set the team domain as a Worker variable and the Access audience as a secret:

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

The Worker validates the `Cf-Access-Jwt-Assertion` header. If Access is not configured, protected paths fail closed.

## Build and deploy

The Cloudflare Git integration can run:

```text
npx wrangler@latest deploy --config wrangler.toml
```

The repository build command runs before deploy, copies `defaults/`, overlays `custom/`, validates `v8s.json`, and copies the runtime Worker into `src/worker.mjs`.

Run the same validation locally before pushing:

```bash
npm run check
```

## References

- [Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
