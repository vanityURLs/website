---
title: "Keep scanner traffic out of the Worker"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Why a vanityURLs instance should use Cloudflare edge controls before traffic reaches the Worker."
tags: ["cloudflare", "security", "network"]
featured: false
---

A short-link redirector looks simple: receive a slug, look up a destination, redirect.

The internet supplies the rest. PHP probes. WordPress paths. Odd methods. Bot traffic. Crawlers. Repeated misses for slugs nobody created.

The Worker should not be the first place that noise gets expensive. vanityURLs keeps the Worker small and deterministic, then uses Cloudflare edge controls for traffic that should never spend Worker CPU or analytics quota.

## Block Before Runtime

The Worker still validates destinations and runtime policy. That is the last line of defense, not the first.

Use Cloudflare WAF rules, rate limiting, Bot Fight Mode, Browser Integrity Check, managed rules, and Access where they match the layer. Commodity abuse should stop before application code runs.

That separation keeps the evidence clean:

- [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/) show WAF, bot, crawler, Access, and rate-limit decisions
- Worker analytics shows requests that reached the runtime
- Umami or Fathom shows application events emitted after vanityURLs filtering

If a request is blocked at the edge, it should not look like product behavior or consume analytics provider quota.

## Make Crawler Policy Enforceable

`robots.txt`, `llms.txt`, and `llms-full.txt` are useful for transparency. They are not enforcement.

For a private, family, team, or internal short-link domain, blocking most crawler families can be reasonable. Mirror the policy in public files so the intent is visible. Enforce it with Cloudflare AI Crawl Control or WAF user-agent rules.

Keep the exact crawler list in Cloudflare. Crawler names, product behavior, and local policy can change faster than public docs should.

## Treat Redirects As Dynamic

Redirect decisions can depend on lifecycle state, schedules, misses, analytics, and runtime policy.

Cache static assets. Be careful with redirect responses. A stale redirect can preserve the wrong destination after a link has expired, changed schedule, or been disabled.

For most instances, the safe default is simple: let the Worker decide redirects and let asset headers handle static files.

## Use The Right Dashboard

Cloudflare analytics and Security Events answer infrastructure questions: DNS, TLS, WAF, rate limiting, bots, AI crawler blocks, Access logins, Worker CPU, and Worker errors.

vanityURLs analytics answers application questions: redirects, misses, lookup requests, pageviews, and normalized bot events that reached the Worker.

Both views matter. Mixing them makes scanner traffic look like user behavior and hides useful edge protection.

Use [Network protection](/docs/customize/network-protection/) for the Cloudflare checklist and [Runtime security](/docs/reference/runtime-security/) for Worker-side controls.
