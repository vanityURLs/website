---
aside: false
title: "Cloudflare products"
description: "Cloudflare products and dashboard surfaces that vanityURLs uses as part of its operating baseline."
weight: 20
---

vanityURLs is a URL shortener that runs on Cloudflare's edge network with your _own_ domain.

<table class="cloudflare-product-table">
  <thead>
    <tr>
      <th>Product</th>
      <th>Role in vanityURLs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://www.cloudflare.com/products/dns/">Cloudflare DNS</a></td>
      <td>Authoritative DNS for the short domain, including the proxied Worker custom domain record</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/workers/">Cloudflare Workers</a></td>
      <td>Runtime for redirects, protected operational pages, generated static assets, and server-side analytics dispatch</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/access/">Cloudflare Access</a></td>
      <td>Zero Trust Network Access (ZTNA) protection for protected operational surfaces such as the Stats dashboard and Runtime test matrix</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/ssl/">Cloudflare SSL/TLS</a></td>
      <td>Edge certificates, Universal SSL, HTTPS enforcement, and minimum TLS configuration</td>
    </tr>
  </tbody>
</table>

## Network protection before traffic reaches the vanityURLs instance

<table class="cloudflare-product-table">
  <thead>
    <tr>
      <th>Product or surface</th>
      <th>Role in vanityURLs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://www.cloudflare.com/products/waf/">Web Application Firewall</a></td>
      <td>Custom security rules for scanner probes, unexpected methods, suspicious clients, unwanted AI crawlers, and other edge-blocked traffic</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/rate-limiting/">Cloudflare Rate Limiting</a></td>
      <td>Rate limiting for abuse patterns that should not spend Worker resources</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/ddos/">Distributed Denial-of-Service (DDoS) Protection</a></td>
      <td>Always-on network protection</td>
    </tr>
    <tr>
      <td><a href="https://www.cloudflare.com/products/bot-management">Cloudflare Bot Management</a></td>
      <td>Bot controls used to reduce automated abuse before requests reach the Worker</td>
    </tr>
    <tr>
      <td><a href="https://developers.cloudflare.com/bots/concepts/bot/#ai-crawlers">Cloudflare AI Crawl Control</a></td>
      <td>Crawler-specific controls for selected AI crawler families</td>
    </tr>
    <tr>
      <td><a href="https://developers.cloudflare.com/rules/">Cloudflare Rules</a></td>
      <td>Managed Transforms and URL normalization before traffic reaches the vanityURLs instance</td>
    </tr>
    <tr>
      <td><a href="https://developers.cloudflare.com/waf/analytics/security-events/">Cloudflare Security Events</a></td>
      <td>Review surface for mitigations applied before the Worker runs</td>
    </tr>
  </tbody>
</table>

Cloudflare is an evergreen SaaS platform: features, APIs, dashboard labels, and navigation can change continuously without major version numbers. To keep the documentation aligned with that moving surface, vanityURLs maintains a structured [Cloudflare dashboard capture](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) in JSON. The capture helps maintainers compare UI changes over time and update the documentation deliberately. For the maintenance rationale, see [ADR 0012](https://github.com/vanityURLs/code/blob/main/docs/adr/0012-maintain-cloudflare-dashboard-capture.md) and [The JSON audit ledger behind the Cloudflare setup docs](/blog/json-audit-ledger-for-cloudflare-docs/).
