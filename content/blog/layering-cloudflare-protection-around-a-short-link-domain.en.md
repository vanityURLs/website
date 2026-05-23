---
title: "Layering Cloudflare protection around a short-link domain"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Why a vanityURLs instance should use Cloudflare edge controls before traffic reaches the Worker."
tags: ["cloudflare", "security", "network"]
featured: false
---

A short-link redirector looks simple from the outside: receive a slug, look up a destination, redirect. The internet does not treat it that gently. Even a quiet short domain can receive scanner probes, odd methods, bot traffic, crawler traffic, and repeated misses before anyone has announced it.

That is why vanityURLs uses layers. The Worker should stay small and deterministic, while Cloudflare handles the noisy edge traffic that should never spend Worker CPU or analytics quota.

## Block noise before the Worker

The Worker can reject unsafe destinations and known scanner probes, but high-volume junk is better handled earlier. Cloudflare WAF rules, rate limiting, Bot Fight Mode, Browser Integrity Check, and managed rules can reject commodity abuse before it reaches application code.

That separation makes operations easier to understand:

- Cloudflare Security Events show WAF, bot, crawler, Access, and rate-limit decisions
- Worker analytics shows requests that reached the application runtime
- Umami or Fathom shows application events sent by vanityURLs after runtime filtering

If a request is blocked at the edge, it should not appear as a short-link miss or consume analytics provider quota.

## Keep crawler policy enforceable

`robots.txt`, `llms.txt`, and `llms-full.txt` are useful for transparency. They describe what the site owner intends. They are not enforcement.

For a private, family, team, or internal short-link domain, it can be reasonable to block all crawler families except the ones you explicitly want. Mirror the policy in public files for transparency, but enforce it with Cloudflare AI Crawl Control or WAF user-agent rules.

Keep the exact crawler list in Cloudflare rather than in public docs. Crawler names, product behavior, and your own policy choices can change quickly.

## Treat redirects as dynamic

Redirect decisions can depend on lifecycle state, schedules, misses, analytics, and runtime policy. Cache static assets, but be very cautious about caching redirect responses. A stale redirect can preserve the wrong destination after a link has expired, changed schedule, or been disabled.

For most instances, the safest caching strategy is simple: let the Worker make redirect decisions and let asset headers handle static files.

## Use the dashboard that matches the layer

Cloudflare analytics and Security Events are for infrastructure questions: DNS, TLS, WAF, rate limiting, bots, AI crawler blocks, Access logins, Worker CPU, and Worker errors.

vanityURLs analytics is for application questions: redirects, misses, expand lookups, pageviews, and normalized bot events that reached the Worker.

Both views matter, but they answer different questions. Mixing them makes scanner traffic look like product behavior and can hide the fact that Cloudflare is already doing useful work before the Worker runs.

Use [Network protection](/docs/network-protection/) for the Cloudflare settings checklist and [Runtime security](/docs/runtime-security/) for the Worker-side controls.
