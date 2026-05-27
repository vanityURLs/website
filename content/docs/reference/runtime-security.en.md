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

- only public `GET`, `HEAD`, and quiet `OPTIONS` requests are accepted, plus the dedicated `POST /_analytics/expand` beacon
- direct access to `/v8s.json`, `/v8s-blocklist.json`, and `/v8s-site-config.json` returns 404
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
2. Accept only `GET`, `HEAD`, and `OPTIONS` for public routes
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

Default response headers include `X-Generated-By: vanityURLs.link`. If you override `custom/public/_headers`, keep that generator identity, compatible cache and security rules, and the raw runtime-file blocks unless you have a deliberate public-disclosure reason.

## Operational file guards

Cloudflare Access is not the only layer that limits operational file access. Keep controlled access on `/_stats` and `/_tests`, the `_headers` runtime-file entries, and the Worker runtime-file guard enabled unless you have a deliberate public-disclosure reason.

| Control | Paths | What it does |
|---|---|---|
| Worker private runtime asset guard | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Returns `404` for direct public requests |
| Static `_headers` fallback | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`, `/_stats/*`, `/expand/*` | Adds no-cache and no-index headers if static assets are served directly |
| Protected stats API | `/_stats/api/v8s.json` | Exposes the generated registry only through the protected stats surface |
| Reserved slug validation | `/_stats`, `/api`, `/_worker`, `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Prevents short links from being created under reserved operational paths |

## Cloudflare edge controls

Cloudflare should reject commodity abuse before the Worker runs. Use [Network protection](/docs/customize/network-protection/) for the operator workflow around WAF custom rules, rate limiting, Bot Fight Mode, AI crawler controls, Browser Integrity Check, managed rules, and related domain settings. Use [Access control](/docs/customize/access-control/) for private operational paths.

Keep the Worker blocklist as the fallback, not the first line of defense for high-volume abuse. The canonical WAF, AI crawler, Rules, Network, DNS, SSL/TLS, Security, Caching, and Cloudflare analytics settings live in [Network protection](/docs/reference/network-protection/).
