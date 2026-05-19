---
title: "Runtime security approach"
description: "How the vanityURLs Worker stays small, deterministic, and defensive at the edge."
---

The vanityURLs runtime is deliberately simple. It is not a public link-submission service, not a database-backed application, and not a general web framework. It is a Git-built redirect engine: validate the link registry, deploy static assets, read `v8s.json`, and return one of a small set of outcomes.

Simplicity is part of the security model. The Worker has fewer moving parts than a typical shortener: no public write API, no visitor accounts, no cookies, no client-side analytics, no database query layer, and no origin server behind Cloudflare.

## Defensive runtime

The Worker keeps the runtime path narrow:

- only public `GET`, `HEAD`, and quiet `OPTIONS` requests are accepted, plus the dedicated `POST /_analytics/expand` beacon
- direct access to `/v8s.json`, `/v8s-blocklist.json`, and `/v8s-site-config.json` returns 404
- redirects allow only `http:` and `https:` targets
- redirect targets with credentials, missing hostnames, control characters, or unsupported protocols fail closed
- splat values are URL-encoded segment by segment before insertion
- lifecycle states resolve through explicit routing rules
- protected operational paths verify Cloudflare Access JWTs and fail closed when Access is not configured
- scanner probes return a plain no-store 404 before short-link lookup or analytics
- analytics is sent with `ctx.waitUntil()` so provider failure does not delay redirects

The important point is not that any code is magically bulletproof. The point is that the runtime is small enough to reason about, test, and surround with edge controls.

## Build-time guardrails

`npm run check` builds the same assets used for deployment, validates the generated registry, validates policy files, lints the repository, and runs Worker tests.

The generated registry and runtime policy are treated as data, not executable code. Local instance changes belong in `custom/`; product defaults stay in `defaults/`; canonical Worker source stays in `scripts/workers/`; generated `src/` is only for Wrangler compatibility. That keeps updates reviewable and makes rollback a normal Git operation.

Default response headers include `X-Generated-By: vanityURLs.link`. If you override `_headers`, keep that generator identity and the raw runtime-file blocks unless you have a deliberate public-disclosure reason.

## Cloudflare edge controls

Cloudflare should reject commodity abuse before the Worker runs. Use WAF custom rules, rate limiting, Bot Fight Mode, AI crawler controls, Browser Integrity Check, managed rules, and Access as the outer layer.

This split matters:

- Cloudflare Security Events show WAF, bot, crawler, Access, and rate-limit decisions
- Worker analytics shows application events that actually reached runtime
- Umami or Fathom should not be used as the primary source for edge-blocked traffic

## WAF rule entry notes

Cloudflare's visual rule builder can be awkward for nested expressions. When creating vanityURLs WAF rules, use the expression editor for the final rule, paste one complete expression at a time, validate it, save the rule disabled if you are still tuning, then enable after checking Security Events.

Good first rules are:

- block scanner probes such as `.php`, `/wp-`, `/.env`, admin paths, and framework probes
- block unexpected methods for the public redirect hostname
- managed-challenge suspicious clients while excluding `/_stats`, `/_tests`, static assets, `robots.txt`, and verified bots
- block unwanted AI crawlers while allowing `/robots.txt`
- rate-limit repeated short-link candidates and misses

Keep the Worker blocklist as the fallback, not the first line of defense for high-volume abuse.
