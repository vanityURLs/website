---
title: "Cloudflare products outside the vanityURLs baseline"
date: 2026-05-29
author: "Benoît H. Dicaire"
description: "Why some visible Cloudflare products are useful to know about but are not part of the default vanityURLs setup."
tags: ["cloudflare", "operations", "baseline"]
featured: false
---

Cloudflare exposes a broad set of useful products in its dashboard. vanityURLs deliberately uses only a narrow subset by default.

That does not make the other products wrong for every deployment. It means a short-link redirector benefits from a small, predictable operating model: DNS, TLS, a Worker, Access for protected operational surfaces, and edge protection before traffic reaches the Worker.

Some Cloudflare products are worth understanding, but they should not become setup steps unless an operator makes a deliberate choice.

## Cloudflare Web Analytics and RUM

[Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) and Real User Measurement can collect browser-side performance and visitor data.

That is outside the vanityURLs baseline. The redirector can send server-side events from the Worker to Umami or Fathom when analytics are enabled. That model avoids adding a browser-side telemetry script to public pages and fits the product questions vanityURLs cares about: redirects, misses, expand lookups, public pageviews, and normalized bot events that reached the Worker.

Leave Cloudflare RUM disabled unless the operator explicitly wants browser-side performance telemetry in addition to the Worker event model.

## Cloudflare Bulk Redirects

[Cloudflare Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) are useful for large static redirect lists.

They are not the Worker-based vanityURLs source of truth. vanityURLs stores links in the repository, builds a runtime registry, and resolves exact links, splats, schedules, lifecycle states, expand previews, and analytics behavior inside the Worker.

Using Bulk Redirects for normal vanityURLs links would create a second redirect system. That makes troubleshooting harder because the operator must determine whether a redirect came from Git, a Worker rule, a legacy Page Rule, or a Bulk Redirect list.

## Cloudflare Cache Rules

[Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/) are powerful, but they are not part of the vanityURLs baseline.

Redirect decisions belong in the Worker. The Worker and static asset headers decide what should be `no-store`, `no-index`, or cacheable. Adding Cache Rules or Cache Response Rules risks stale redirects, stale lifecycle states, hidden analytics gaps, and confusing misses.

For the baseline, keep Cache Rules and Cache Response Rules empty.

## Cloudflare Turnstile

[Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) protects forms and interactive application flows from automated abuse.

The default vanityURLs instance does not expose a public form, link creation API, comment box, login form, or checkout flow. Protected operational surfaces are handled by Cloudflare Access instead.

Turnstile can become relevant if an operator builds a custom public submission flow around vanityURLs, but it is not part of the stock redirector.

## Cloudflare Workers Analytics

[Cloudflare Workers Analytics](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/) is useful for infrastructure review. It can help operators understand Worker request volume, errors, CPU time, wall time, and duration.

It is not a separate product to configure during Quickstart. It is an observability surface to consult after deployment.

For application events, use vanityURLs server-side analytics if enabled. For traffic blocked before the Worker, use Cloudflare Security Events. For Worker infrastructure health, use Workers Analytics.

## The rule

If a Cloudflare product does not protect the DNS/TLS layer, the Worker path, the short domain, or protected operational surfaces, it is probably not part of the baseline.

Write down the reason before enabling it. That keeps the redirector small, the documentation honest, and future troubleshooting less surprising.
