---
title: "Runtime security for a small redirector"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Why vanityURLs keeps the Worker small, blocks raw runtime assets, and uses Cloudflare edge controls around the redirect path."
tags: ["security", "runtime", "cloudflare"]
featured: false
---

Short-link domains are small targets with oversized consequences. A bad redirect can damage trust quickly, and scanner traffic can arrive before the domain is even public. That is why vanityURLs treats simplicity as a security feature, not an aesthetic preference.

The runtime is not a public link-submission service. It is not a database-backed web application. It is a Git-built redirect engine: validate the registry, deploy static assets, read generated data, and return a redirect, protected page, disabled page, expired page, or localized 404.

## Fewer moving parts

The Worker avoids the parts that usually make a shortener harder to reason about:

- no public write API
- no visitor accounts
- no cookies
- no client-side analytics
- no database query layer
- no origin server behind Cloudflare

That does not make the code invulnerable. It makes the runtime small enough to test and surround with Cloudflare controls.

## Fail closed

The Worker accepts only a narrow set of request shapes. Raw runtime files are blocked, redirect targets must use `http:` or `https:`, splat values are encoded before insertion, and protected operational routes verify Cloudflare Access before showing private views.

Scanner probes return a plain no-store 404 before short-link lookup or analytics. Analytics provider failures do not delay redirects because events are sent with `ctx.waitUntil()`.

That posture is intentionally practical: reject obvious junk early, keep link resolution deterministic, and make failures quiet.

## Build-time guardrails

`npm run check` is part of the security story. It builds deployable assets, validates generated runtime data, validates policy files, runs lint, and runs Worker tests.

The generated registry and policy are treated as data. Instance changes live in `custom/`, product defaults live in `defaults/`, canonical Worker source lives in `scripts/workers/`, and generated `src/` exists for Wrangler compatibility.

That separation keeps updates reviewable and makes rollback a normal Git operation.

## Cloudflare still matters

The Worker should not be the first place high-volume abuse gets handled. Use Cloudflare WAF, rate limiting, bot controls, AI crawler controls, DNS, SSL/TLS, and Access policies to reject commodity abuse before it reaches runtime.

Use [Network protection](/docs/network-protection/) for edge controls and [Runtime security](/docs/runtime-security/) for the compact runtime reference.
