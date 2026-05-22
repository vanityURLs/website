---
aside: false
title: "Runtime security approach"
description: "How the vanityURLs Worker stays small, deterministic, and defensive at the edge."
weight: 80

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
- protected operational paths verify [Cloudflare Access](/docs/access-control/) JWTs and fail closed when Access is not configured
- scanner probes return a plain no-store 404 before short-link lookup or analytics
- analytics is sent with `ctx.waitUntil()` so provider failure does not delay redirects

## Build-time guardrails

`npm run check` builds the same assets used for deployment, validates the generated registry, validates policy files, lints the repository, and runs Worker tests.

Validation verifies that link rows have the expected shape, URL targets normalize safely, unsafe targets are rejected, splat aliases do not shadow unsafe parent paths, schedules are valid, generated runtime assets use the expected schema, raw runtime assets stay unreachable, and generated `src/` matches the Worker source in `scripts/workers/`.

The generated registry and runtime policy are treated as data, not executable code. Local instance changes belong in `custom/`; product defaults stay in `defaults/`; canonical Worker source stays in `scripts/workers/`; generated `src/` is only for Wrangler compatibility. That keeps updates reviewable and makes rollback a normal Git operation.

Default response headers include `X-Generated-By: vanityURLs.link`. If you override `_headers`, keep that generator identity and the raw runtime-file blocks unless you have a deliberate public-disclosure reason.

## Cloudflare edge controls

Cloudflare should reject commodity abuse before the Worker runs. Use [Network protection](/docs/network-protection/) for WAF custom rules, rate limiting, Bot Fight Mode, AI crawler controls, Browser Integrity Check, managed rules, and related domain settings. Use [Access control](/docs/access-control/) for private operational paths.

Keep the Worker blocklist as the fallback, not the first line of defense for high-volume abuse. The canonical WAF, AI crawler, Rules, Network, DNS, SSL/TLS, Security, Caching, and Cloudflare analytics guidance lives in [Network protection](/docs/network-protection/).
