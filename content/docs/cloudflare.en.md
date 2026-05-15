---
title: "Cloudflare Workers"
description: "Deploy vanityURLs as a Cloudflare Worker with static assets, generated registry, protected pages, and analytics configuration."
nav_order: 10
---

The current vanityURLs runtime deploys as a Cloudflare Worker, not a Pages `_redirects` file. Wrangler builds the site, publishes the `build/` directory as static assets, and runs `src/worker.mjs` for short-link routing.

## wrangler.toml

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-05"
workers_dev = false
preview_urls = false

[assets]
directory = "build"
binding = "ASSETS"

[build]
command = "npm run build"
```

Use your own Worker name. Keep `main = "src/worker.mjs"` because the editable source is copied into place during the build.

## Build pipeline

The build does four important jobs:

1. Copies `defaults/public/` into `build/`
2. Overlays `custom/public/` when it exists
3. Generates `build/v8s.json` from `custom/v8s-links.txt` or `defaults/v8s-links.txt`
4. Copies the Worker runtime to `src/worker.mjs`

Run the full validation before deploying:

```bash
npm run check
```

## Runtime variables

Configure analytics and protected views with Worker variables:

```toml
[vars]
ANALYTICS_PROVIDER = "umami"
UMAMI_ENDPOINT = "https://cloud.umami.is/api/send"
UMAMI_WEBSITE_ID = "<umami website id>"
UMAMI_GEO_IP_MODE = "full"
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

For Fathom:

```toml
[vars]
ANALYTICS_PROVIDER = "fathom"
FATHOM_SITE_ID = "<fathom site id>"
FATHOM_ENDPOINT = "https://cdn.usefathom.com/"
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

Store the Cloudflare Access audience as a secret:

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

## Protected paths

Create a Cloudflare Zero Trust self-hosted application for:

```text
v8s.link/_stats
v8s.link/_stats/*
v8s.link/_tests
v8s.link/_tests/*
```

The Worker validates the `Cf-Access-Jwt-Assertion` header. If Access is not configured, protected paths fail closed.

## Zone checklist

- SSL/TLS mode: Full strict
- Always Use HTTPS: on
- TLS 1.3: on
- Minimum TLS: 1.2 or stricter
- URL Normalization: enabled for incoming URLs
- Bot Fight Mode and Browser Integrity Check: on
- WAF rules: block scanner probes and unexpected methods
- Rate limits: protect short-link misses from request storms
