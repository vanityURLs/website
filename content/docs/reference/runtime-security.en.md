---
aside: false
title: "Runtime security approach"
description: "How the vanityURLs Worker stays small, deterministic, and defensive at the edge."
weight: 100
aliases:
  - /docs/runtime-security/
---

The vanityURLs runtime is deliberately small: validate the generated registry, serve static assets, read `v8s.json`, and return one of a small set of outcomes.

For the design rationale, read [Runtime security for a small redirector](/blog/runtime-security-for-a-small-redirector/). This page is the compact reference for controls to preserve.

## Defensive runtime

The Worker keeps the runtime path narrow:

- only public `GET`, `HEAD`, and quiet `OPTIONS` requests are accepted, plus `POST /lookup/resolve` for lookup resolution and the dedicated `POST /_analytics/lookup` beacon
- direct access to `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`, and `/v8s-custom-assets.json` returns 404
- redirects allow only `http:` and `https:` targets
- redirect targets with credentials, missing hostnames, control characters, or unsupported protocols fail closed
- splat values are URL-encoded segment by segment before insertion
- lifecycle states resolve through explicit routing rules
- protected operational paths verify [Cloudflare Access](/docs/customize/access-control/) JWTs and fail closed when Access is not configured
- scanner probes return a plain no-store 404 before short-link lookup or analytics
- analytics is sent with `ctx.waitUntil()` so provider failure does not delay redirects

Default runtime protections include:

- non-HTTP(S) protocols
- credentials embedded in URLs
- localhost, `.localhost`, and `.local` targets
- private, loopback, reserved, multicast, and documentation IP ranges
- known public shorteners used for redirect chains
- local examples of phishing lure domains
- high-risk executable download extensions such as `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, and `.jar`

## Resolution order

For each request, the Worker follows a deliberately narrow path:

1. Reject raw runtime assets and known scanner probes
2. Accept only `GET`, `HEAD`, and `OPTIONS` for public routes, plus `POST /lookup/resolve` and `POST /_analytics/lookup`
3. Normalize the incoming path
4. Look for an exact link
5. If no exact link matches, look for a splat link
6. Apply schedule and lifecycle state
7. Return a redirect, an informational page, or a 404

Schedules only apply to exact links. Splat links are useful for stable namespaces, but they should not be used for time-sensitive redirects.

## Build-time guardrails

`npm run check` builds the same assets used for deployment, validates the generated registry, validates policy files, lints the repository, and runs Worker tests.

Validation verifies that link rows have the expected shape, URL targets normalize safely, unsafe targets are rejected, splat aliases do not shadow unsafe parent paths, schedules are valid, generated runtime assets use the expected schema, raw runtime assets stay unreachable, and generated `src/` matches the Worker source in `scripts/workers/`.

The generated registry and runtime policy are treated as data, not executable code. Local instance changes belong in `custom/`; product defaults stay in `defaults/`; canonical Worker source stays in `scripts/workers/`; generated `src/` is only for Wrangler compatibility. That keeps updates reviewable and makes rollback a normal Git operation.

Default response headers include `X-Generated-By: vanityURLs.link`, no-index rules, host-scoped HSTS, `nosniff`, clickjacking protection, referrer and permissions policies, and a strict product-page Content Security Policy. HTML assets that come from `custom/public/` get a separate sandboxed compatibility CSP so copied instance pages can use inline custom code without becoming fully trusted same-origin peers of the built-in pages.

## Content Security Policy

vanityURLs uses two CSP profiles for public HTML:

| Profile                   | Applies to                                                                               | Purpose                                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Strict product-page CSP   | Default generated pages, lookup, stats shell, tests, legal pages, and other product HTML | Keep repo-owned HTML deterministic by allowing only self-hosted scripts, styles, fonts, images, and data images |
| Sandboxed custom-page CSP | HTML files that came from `custom/public/`                                               | Let instance-owned pages use inline CSS and JavaScript while isolating them from built-in same-origin pages     |

The strict product-page CSP has this shape:

```text
default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self';
img-src 'self' data:; connect-src 'self' https://api.github.com;
base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

That profile blocks inline `<script>` and `<style>`. Product pages should use shipped `v8s-*` assets and self-hosted fonts, not third-party font or script hosts.

The sandboxed custom-page CSP has this shape:

```text
sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads;
default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' https:;
style-src 'self' 'unsafe-inline' https:; img-src 'self' https: data: blob:;
connect-src 'self' https:; base-uri 'self'; form-action 'self' https:;
frame-ancestors 'none'
```

The sandbox deliberately omits `allow-same-origin`. In the browser, that makes custom HTML run with an opaque origin even though the user still sees the same short-link hostname. Custom pages can load their own same-host CSS and JavaScript, run inline snippets, submit forms, open popups, download files, and navigate links through the Worker. They should not expect to read host cookies, host `localStorage`, protected stats APIs, or other same-origin-only product surfaces.

Sandboxed custom pages send browser `fetch()` requests with `Origin: null`. The Worker only permits that origin for public lookup endpoints, `POST /lookup/resolve` and `POST /_analytics/lookup`. Protected stats, tests, and raw runtime files stay locked down.

Only override CSP in `custom/public/_headers` when the instance deliberately accepts a different trust model. If you do, keep `frame-ancestors 'none'`, `base-uri 'self'`, the no-index rules, host-scoped HSTS, and raw runtime-file blocks unless there is a specific reason to change them. Removing the sandbox turns custom HTML into a fully trusted same-origin peer of the built-in pages; that is a conscious security decision, not a theme tweak.

## Operational file guards

Cloudflare Access is not the only layer that limits operational file access. Keep controlled access on localized stats paths such as `/en/_stats/` and `/fr/_stats/`, localized test paths such as `/en/_tests/`, the `_headers` runtime-file entries, and the Worker runtime-file guard enabled unless you have a deliberate public-disclosure reason.

| Control                            | Paths                                                                                                              | What it does                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Worker private runtime asset guard | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`, `/v8s-custom-assets.json`                             | Returns `404` for direct public requests                                 |
| Static `_headers` fallback         | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`, `/v8s-custom-assets.json`, `/*/_stats/*`, `/lookup/*` | Adds no-cache and no-index headers if static assets are served directly  |
| Protected stats API                | `/en/_stats/api/v8s.json`, `/<lang>/_stats/api/v8s.json`                                                           | Exposes the generated registry only through the protected stats surface  |
| Reserved slug validation           | `/_stats`, `/<lang>/_stats`, `/api`, `/_worker`, `/v8s.json`, `/v8s-blocklist.json`, `/v8s-custom-assets.json`     | Prevents short links from being created under reserved operational paths |

Sandboxed custom HTML makes browser `fetch()` calls look like they come from `Origin: null`. The Worker only adds that CORS allowance for the public lookup endpoints, `POST /lookup/resolve` and `POST /_analytics/lookup`; protected stats, tests, and raw runtime assets do not receive that allowance.

## Cloudflare edge controls

Cloudflare should reject commodity abuse before the Worker runs. Use [Network protection](/docs/customize/network-protection/) for the operator workflow around WAF custom rules, rate limiting, AI crawler controls, Browser Integrity Check, managed rules, and related domain settings. Avoid challenge-style or page-rewriting controls, including Managed Challenge, Bot Fight Mode, and zone-wide JavaScript Detections, on public strict-CSP HTML unless the instance deliberately accepts Cloudflare script injection. vanityURLs HTML responses include `Cache-Control: no-transform` so intermediaries should not rewrite the repository-built page. Use [Access control](/docs/customize/access-control/) for private operational paths.

Keep the Worker blocklist as the fallback, not the first line of defense for high-volume abuse. The canonical WAF, AI crawler, Rules, Network, DNS, SSL/TLS, Security, Caching, and Cloudflare analytics settings live in [Network protection](/docs/customize/network-protection/).
