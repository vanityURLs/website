---
aside: false
title: "Network protection"
description: "Configure the Cloudflare domain controls that protect a vanityURLs short-link zone before traffic reaches the Worker."
weight: 80
aliases:
  - /docs/network-protection/

---

Use this page when you are ready to configure Cloudflare controls in front of the Worker. Network protection keeps commodity abuse, unexpected methods, scanner probes, unwanted crawlers, and infrastructure noise away from application code.

For exact Cloudflare settings and WAF expressions, read [Network protection reference](/docs/reference/network-protection/). For the layered security rationale, read [Layering Cloudflare protection around a short-link domain](/blog/layering-cloudflare-protection-around-a-short-link-domain/).

{{% steps %}}

### Confirm the Worker custom domain

In **DNS**, use the Worker Custom Domain record that Cloudflare creates for the short domain. It should appear as a proxied Worker record for the hostname, such as `v8s.link -> v8s-link`.

Remove legacy synthetic `AAAA 100::` records for the same hostname once the Custom Domain is active. Keep mail, DKIM, DMARC, MTA-STS, and ownership verification records DNS-only unless the provider explicitly requires proxying.

### Set the HTTPS baseline

In **SSL/TLS**, start with Full strict, Universal SSL, Always Use HTTPS, TLS 1.3, and Automatic HTTPS Rewrites.

Enable HSTS only after every production hostname and subdomain is ready for HTTPS. Start with a conservative max age; include subdomains and preload only when the whole zone is intentionally HTTPS-only.

### Enable baseline security controls

In **Security**, enable the low-surprise controls first: Bot Fight Mode, Browser Integrity Check, the Cloudflare managed ruleset, and a practical Challenge Passage value.

Avoid controls that expose extra visitor data or change public content unless your instance needs them. `security.txt` should be configured before release so vulnerability reports have a clear contact path.

### Add WAF rules

In **WAF**, add rules for traffic that should never reach the Worker:

- block scanner probes such as `.php`, `/wp-`, `/.env`, and admin probes
- block unexpected methods so public redirects accept only `GET`, `HEAD`, and `OPTIONS`
- challenge suspicious clients while excluding verified bots, protected operational paths, static assets, and `robots.txt`
- block unwanted AI crawlers while keeping `/robots.txt` readable
- rate limit repeated misses and scanner-like candidates rather than successful redirects

Paste and validate one complete expression at a time. Save rules disabled while tuning, then enable them after checking Security Events.

### Decide crawler controls

If your repository ships `robots.txt`, keep Cloudflare Managed robots.txt disabled so the repository remains the source of truth.

Allow `/robots.txt` at minimum. Allow `/llms.txt` and `/llms-full.txt` only if you intentionally publish machine-readable context.

### Keep caching conservative

Let the Worker make redirect decisions. Do not add cache rules for redirect responses unless you have tested lifecycle states, schedules, analytics, misses, and status pages.

Keep Development Mode off except while actively debugging.

### Review the right analytics surface

Use Cloudflare analytics and Security Events for DNS, TLS, Worker infrastructure metrics, WAF, rate limiting, bot, AI crawler, and Access decisions.

Use vanityURLs server-side [Analytics](/docs/customize/analytics/) for application events that reach the Worker, such as pageviews, redirects, short-link misses, expand lookups, and normalized bot events.

{{% /steps %}}
