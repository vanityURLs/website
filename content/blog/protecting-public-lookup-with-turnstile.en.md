---
title: "Protect public lookup without challenging redirects"
date: 2026-06-05
author: "Benoît H. Dicaire"
description: "How vanityURLs uses Cloudflare Turnstile for lookup resolution while keeping ordinary short-link redirects fast and challenge-free."
tags: ["cloudflare", "turnstile", "lookup", "security"]
featured: false
---

The lookup page answers a useful question: where does this exact short link go before I open it?

That is good for trust and safety. It is also a visibility surface. A script that can repeat exact-slug lookups can learn destinations without following redirects.

vanityURLs protects that surface with [Cloudflare Turnstile](/docs/customize/network-protection/#configure-turnstile-for-lookup), but it does not put Turnstile in front of ordinary redirects.

## Split The Paths

Keep the public redirect path simple:

- `/{slug}` stays challenge-free
- `/lookup` renders the visitor lookup page
- `POST /lookup/resolve` requires a Turnstile token
- `POST /_analytics/lookup` records lookup activity after it reaches the Worker

Published links, QR codes, previews, command-line clients, and uptime checks should not need a browser challenge. Lookup resolution is different because it reveals the destination without performing the redirect.

## Fail Closed

The Worker treats Turnstile like Cloudflare Access treats private operational pages: missing protection configuration blocks the protected surface.

If the Turnstile secret is missing, `POST /lookup/resolve` returns `503`. If a request is missing a token, has an invalid token, or receives mismatched hostname/action metadata from Cloudflare `siteverify`, it returns `403`.

The browser widget is useful for user experience, but the Worker-side `siteverify` call is the access decision.

## Do Not Expose The Registry

Lookup is exact-match only. It returns one resolved destination, one miss, or one non-redirecting state.

It does not list links. Raw runtime files such as `/v8s.json`, `/v8s-blocklist.json`, and `/v8s-site-config.json` stay blocked from public direct access. The registry download remains an operator path under the protected stats API.

## Keep Rate Limits

Turnstile proves a browser interaction. It does not prove good intent.

A real browser can still request valid tokens and repeat expensive exact-slug checks, so keep the **Rate limit short-link candidates** rule in place. On plans that allow more than one rate limiting rule, add tighter limits for `/lookup/resolve` and `/_analytics/lookup`.

Use [Network protection](/docs/customize/network-protection/) for the setup steps and [Runtime security](/docs/reference/runtime-security/) for the Worker-side behavior.
