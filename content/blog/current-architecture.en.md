---
title: "The current v8s architecture"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "How the current Worker, defaults, custom overrides, analytics, and Cloudflare security model fit together."
tags: ["architecture", "cloudflare", "security"]
---

The current v8s release is built around a small contract: keep the runtime simple, keep the source of truth in Git, and push abuse filtering as close to the edge as possible.

## The instance model

An instance has two kinds of files:

- `defaults/` contains the product defaults, public operational pages, blocklist defaults, robots and LLM crawler guidance, and scripts that should be updated from upstream
- `custom/` contains the instance-owned links, schedules, policy overrides, branding, legal pages, and any local public files

That split is the upgrade story. If instance owners keep their work in `custom/`, future releases can refresh `defaults/` and `scripts/` without trampling local content.

## The runtime

At build time, v8s generates a schema `3.0` registry from the link file, schedules, blocklist, and static assets. The Cloudflare Worker uses that generated registry to resolve requests.

The Worker does very little by design:

1. reject private implementation assets and known scanner probes
2. accept only `GET`, `HEAD`, and `OPTIONS`, plus the Turnstile-protected public lookup `POST` endpoints
3. resolve exact links before splat links
4. apply schedules and lifecycle states
5. emit non-blocking server-side analytics when enabled
6. return a redirect, a protected page, or a 404

This is the security posture. Simplicity is not decoration; it is part of the threat model.

## Cloudflare around the Worker

The Worker is only one layer. A production instance should also use Cloudflare's domain security tools:

- [Zero Trust Access](/docs/customize/access-control/) for localized stats paths such as `/en/_stats/` and for `/_tests`
- [Cloudflare Turnstile](/blog/protecting-public-lookup-with-turnstile/) for public lookup resolution
- WAF rules for scanner probes and unexpected methods
- rate limiting for short-link candidates
- bot controls and AI crawler controls
- Full (strict) TLS, HTTPS enforcement, and URL normalization
- custom `robots.txt`, `llms.txt`, and `llms-full.txt` published from the repo

The goal is to reject obvious abuse before it spends Worker CPU or analytics quota.

## Analytics

v8s does not need browser analytics. Redirect events can be sent server-side from the Worker to Umami or Fathom with `ctx.waitUntil()`.

The privacy posture is intentionally narrow: do not add tracking JavaScript, do not set browser identifiers, and do not send analytics for traffic that Cloudflare already blocked. Owners still need to review provider quotas and account limits because scanner traffic can appear even before a short domain is public.

## Responsibility

A redirect engine can be used for good documentation links, stable project aliases, event pages, and personal infrastructure. It can also be misused for phishing, malware, undisclosed tracking, or redirect chains.

The code can make abuse harder. The instance owner remains responsible for every destination they publish.
