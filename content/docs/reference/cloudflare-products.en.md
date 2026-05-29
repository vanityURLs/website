---
aside: false
title: "Cloudflare products"
description: "Cloudflare products and dashboard surfaces that vanityURLs uses, recommends, or deliberately leaves out of the baseline."
weight: 12
---

vanityURLs runs on Cloudflare, but not every Cloudflare product visible in the dashboard is part of the solution.

Use this page as the product inventory for a vanityURLs instance. The setup pages explain the operator workflow; this reference page names the Cloudflare products and surfaces involved.

## Required baseline

| Cloudflare product | Role in vanityURLs |
| --- | --- |
| [Cloudflare DNS](https://www.cloudflare.com/products/dns/) | Authoritative DNS for the short domain, including the proxied Worker custom domain record and DNS-only mail/security records |
| [Cloudflare Workers](https://www.cloudflare.com/products/workers/) | Runtime for redirects, protected operational pages, generated static assets, and server-side analytics dispatch when enabled |
| [Cloudflare Access](https://www.cloudflare.com/products/access/) | Zero Trust Network Access (ZTNA) protection for the Stats dashboard at `/_stats` and the Runtime test matrix at `/_tests` |
| [Cloudflare SSL/TLS](https://www.cloudflare.com/products/ssl/) | Edge certificates, Universal SSL, Full strict mode, HTTPS enforcement, minimum TLS version, and HSTS when the operator is ready |

## Baseline protection surfaces

These Cloudflare products or dashboard surfaces protect the short domain before traffic reaches the Worker.

| Cloudflare product or surface | Role in vanityURLs |
| --- | --- |
| [Cloudflare WAF](https://www.cloudflare.com/products/waf/) | Custom security rules for scanner probes, unexpected methods, suspicious clients, unwanted AI crawlers, and other edge-blocked traffic |
| [Cloudflare Rate Limiting](https://www.cloudflare.com/products/rate-limiting/) | Rate limiting for repeated short-link candidates and other abuse patterns that should not spend Worker resources |
| [Cloudflare DDoS Protection](https://www.cloudflare.com/ddos/) | Always-on network, SSL/TLS, and HTTP DDoS mitigation around the proxied short domain |
| [Cloudflare Bot Management](https://www.cloudflare.com/products/bot-management) | Product family behind bot controls; Free-plan vanityURLs guidance uses available controls such as Bot Fight Mode and Browser Integrity Check |
| [Cloudflare AI Crawl Control](https://developers.cloudflare.com/bots/concepts/bot/#ai-crawlers) | Crawler-specific controls and signals for AI crawlers; use only when the operator intentionally wants Cloudflare to block selected crawler families |
| [Cloudflare Rules](https://developers.cloudflare.com/rules/) | Managed Transforms, URL Normalization, and other zone rules; vanityURLs recommends URL normalization and avoids redirect rules as the link source of truth |
| [Cloudflare Security Events](https://developers.cloudflare.com/waf/analytics/security-events/) | Review surface for WAF, bot, crawler, Access, and rate-limit decisions that stop requests before the Worker runs |

## Reference-only or not baseline

These surfaces are visible during setup or assessment, but they are not required for the vanityURLs baseline.

| Cloudflare product or surface | Baseline decision |
| --- | --- |
| [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) and RUM | Leave disabled unless the operator explicitly wants browser-side performance telemetry; vanityURLs uses server-side analytics when analytics are enabled |
| [Cloudflare Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) | Useful for large static redirect lists, but not the Worker-based vanityURLs source of truth |
| [Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/) | Do not create Cache Rules or Cache Response Rules for the baseline; redirect decisions belong in the Worker |
| [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) | Not used by the baseline because vanityURLs does not expose a public form or link-creation API |
| [Cloudflare Workers Analytics](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/) | Useful infrastructure review surface for Worker request volume, errors, CPU time, wall time, and duration; not a product to configure during Quickstart |

## Maintenance

Cloudflare product names and dashboard navigation change over time. When a setup page changes because of a Cloudflare product or UI change, update the structured capture in [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) when the change is pertinent.

For the maintenance rationale, see [The JSON audit ledger behind the Cloudflare setup docs](/blog/json-audit-ledger-for-cloudflare-docs/) and [ADR 0012](https://github.com/vanityURLs/code/blob/main/docs/adr/0012-maintain-cloudflare-dashboard-capture.md).
