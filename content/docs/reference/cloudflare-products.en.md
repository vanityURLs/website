---
aside: false
title: "Cloudflare products"
description: "Cloudflare products and dashboard surfaces that vanityURLs uses as part of its operating baseline."
weight: 20
---

vanityURLs is a URL shortener that runs on Cloudflare's edge network with your _own_ domain.

Cloudflare is an evergreen SaaS platform: features, APIs, dashboard labels, and navigation can change continuously without major version numbers. To keep the documentation aligned with that moving surface, vanityURLs maintains a structured [Cloudflare dashboard capture](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) in JSON. The capture helps maintainers compare UI changes over time and update the documentation deliberately. For the maintenance rationale, see [ADR 0012](https://github.com/vanityURLs/code/blob/main/docs/adr/0012-maintain-cloudflare-dashboard-capture.md) and [The JSON audit ledger behind the Cloudflare setup docs](/blog/json-audit-ledger-for-cloudflare-docs/).

| Product | Role in vanityURLs |
| --- | --- |
| [Cloudflare DNS](https://www.cloudflare.com/products/dns/) | Authoritative DNS for the short domain, including the proxied Worker custom domain record |
| [Cloudflare Workers](https://www.cloudflare.com/products/workers/) | Runtime for redirects, protected operational pages, generated static assets, and server-side analytics dispatch |
| [Cloudflare Access](https://www.cloudflare.com/products/access/) | Zero Trust Network Access (ZTNA) protection for protected operational surfaces such as the Stats dashboard and Runtime test matrix |
| [Cloudflare SSL/TLS](https://www.cloudflare.com/products/ssl/) | Edge certificates, Universal SSL, HTTPS enforcement, and minimum TLS configuration |

## Network protection before traffic reaches the vanityURLs instance

| Product or surface | Role in vanityURLs |
| --- | --- |
| [Web Application Firewall](https://www.cloudflare.com/products/waf/) | Custom security rules for scanner probes, unexpected methods, suspicious clients, unwanted AI crawlers, and other edge-blocked traffic |
| [Cloudflare Rate Limiting](https://www.cloudflare.com/products/rate-limiting/) | Rate limiting for abuse patterns that should not spend Worker resources |
| [Distributed Denial-of-Service (DDoS) Protection](https://www.cloudflare.com/ddos/) | Always-on network protection |
| [Cloudflare Bot Management](https://www.cloudflare.com/products/bot-management) | Bot controls used to reduce automated abuse before requests reach the Worker |
| [Cloudflare AI Crawl Control](https://developers.cloudflare.com/bots/concepts/bot/#ai-crawlers) | Crawler-specific controls for selected AI crawler families |
| [Cloudflare Rules](https://developers.cloudflare.com/rules/) | Managed Transforms and URL normalization before traffic reaches the vanityURLs instance |
| [Cloudflare Security Events](https://developers.cloudflare.com/waf/analytics/security-events/) | Review surface for mitigations applied before the Worker runs |

For Cloudflare products that are useful to understand but outside the default baseline, see [Cloudflare products outside the vanityURLs baseline](/blog/cloudflare-products-outside-the-vanityurls-baseline/).
