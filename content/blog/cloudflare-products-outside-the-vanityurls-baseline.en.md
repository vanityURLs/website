---
title: "Cloudflare products vanityURLs leaves out"
date: 2026-05-29
author: "Benoît H. Dicaire"
description: "The Cloudflare products vanityURLs documents as non-baseline, and why they stay outside the default setup."
tags: ["cloudflare", "operations", "baseline"]
featured: false
---

Cloudflare has more useful products than a short-link redirector should use.

That is not a criticism of Cloudflare. It is an operating boundary. vanityURLs uses [Cloudflare DNS](https://www.cloudflare.com/products/dns/), [Cloudflare Workers](https://www.cloudflare.com/products/workers/), [Cloudflare Access](https://www.cloudflare.com/products/access/), SSL/TLS, and selected edge protections. The baseline product list lives in [Cloudflare products](/docs/reference/cloudflare-products/). The detailed setup lives in [Network protection](/docs/customize/network-protection/).

This page records the other side of that decision: products that are visible, useful in the right deployment, and still not part of the default vanityURLs setup.

## The Exclusion Test

A Cloudflare product belongs in the baseline only if it protects or serves one of four surfaces:

- DNS and TLS for the short domain
- the Worker runtime
- protected operational pages such as `/_stats` and `/_tests`
- edge controls that reject traffic before the Worker runs

Everything else needs a specific local reason.

## Non-Baseline Products

| Product | Why it stays out of the baseline |
| --- | --- |
| [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) and [Real User Monitoring](https://developers.cloudflare.com/speed/observatory/rum/) | They add browser-side telemetry. vanityURLs uses server-side events from the Worker when analytics are enabled. |
| [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) | They create a second redirect system beside the Git-managed link registry and Worker resolver. |
| [Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/) and Cache Response Rules | They can preserve stale redirect decisions, lifecycle states, or analytics gaps. Static assets already carry their own headers. |
| [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) | It protects forms and interactive flows. The stock redirector has no public submission form, visitor login, checkout, or comment box. |
| [Workers Analytics](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/) | It is an observability surface, not a setup step. Use it after deployment for Worker health, not application event counts. |

As of the 2026-05-29 dashboard capture, these exclusions are also tracked in [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json). `Last verified: 2026-05-29`

## The Tradeoff

Leaving a product out can feel wasteful. The dashboard is right there.

But every extra product can add a second source of truth, a paid-plan dependency, browser-side code, or another place to debug a redirect that should have been boring.

Use the excluded products when the deployment actually needs them. Write down the reason when you do. Otherwise, leave the redirector small.
