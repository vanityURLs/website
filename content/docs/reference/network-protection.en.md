---
aside: false
title: "Network protection"
description: "Cloudflare DNS, TLS, WAF, crawler, caching, and analytics settings that protect a vanityURLs short-link zone before traffic reaches the Worker."
weight: 59
aliases:
  - /docs/reference/cloudflare-network-protection/

---

Network protection covers the Cloudflare domain settings that sit in front of the vanityURLs Worker.

Use this reference for settings under the Cloudflare domain configuration area: **AI Crawl Control**, **Analytics**, **Caching**, **DNS**, **Network**, **Rules**, **Security**, **SSL/TLS**, and **WAF**. Use [Network protection](/docs/customize/network-protection/) for the setup workflow and [Layering Cloudflare protection around a short-link domain](/blog/layering-cloudflare-protection-around-a-short-link-domain/) for the rationale.

## DNS

For the root short domain, prefer the Worker Custom Domain row that Cloudflare creates for the Worker. It should appear as a proxied Worker record for the hostname, like `v8s.link -> v8s-link`.

Avoid keeping legacy synthetic `AAAA 100::` records for the same hostname once the Custom Domain is active. Keep mail records, DKIM, DMARC, MTA-STS, and ownership verification records as DNS-only unless the service explicitly requires proxying.

Use separate proxied records only for real web subdomains, such as `mta-sts`, `www`, or a docs site.

## SSL/TLS

Start with these settings:

| Setting | Recommendation |
| --- | --- |
| SSL/TLS mode | Full strict |
| Universal SSL | On |
| Always Use HTTPS | On |
| TLS 1.3 | On |
| Minimum TLS | 1.2 or stricter |
| Automatic HTTPS Rewrites | On |
| HSTS | On after every production hostname and subdomain is ready for HTTPS |
| Certificate Transparency Monitoring | Optional, useful for unexpected certificate alerts |

Enable HSTS only after every production hostname and subdomain is ready for HTTPS. A one-month max age is a practical first setting; include subdomains and preload only when the whole zone is intentionally HTTPS-only.

## Security

The free-plan security settings should stay boring and explicit. Turn on protections that reduce commodity abuse, but avoid features that alter public content or expose extra visitor data unless there is a clear need.

| Setting | Recommendation | Why |
| --- | --- | --- |
| New application security dashboard | On | Use the current dashboard view for security events and action items |
| Bot Fight Mode | On | Adds baseline bot challenges on the free plan |
| Browser Integrity Check | On | Blocks malformed or suspicious browser requests before Worker code runs |
| Challenge Passage | 30 minutes | Keeps managed challenges useful without making repeat legitimate visits too noisy |
| Cloudflare managed ruleset | On | Provides Cloudflare-maintained baseline app protection |
| Email Address Obfuscation | On if public pages show email addresses | Protects visible email addresses without changing human-readable content |
| Hotlink Protection | Off by default | Shortener assets are small; enable only if off-site image reuse becomes a real cost |
| Leaked Credentials Detection | Off unless the app has password login | vanityURLs does not authenticate visitors with passwords |
| Security.txt | Configure before release | Publish a contact path for vulnerability reports |
| Replace insecure JavaScript libraries | On | Lets Cloudflare replace known insecure libraries when supported |
| Schema Validation | Off unless API schemas are defined | It needs explicit endpoints and active schemas to be useful |
| Zone IP allowlist rules | Off unless admin paths need IP allowlisting | Cloudflare Access is the primary control for private paths |

Do not enable client certificates, mTLS rules, visitor location headers, or True-Client-IP headers for the public shortener unless a downstream service explicitly needs them. The Worker already receives Cloudflare country and colo metadata for aggregate analytics.

## WAF

Cloudflare security rules run before the Worker. Use them for traffic that should never reach application code.

Recommended rule set:

| Rule | Action | Notes |
| --- | --- | --- |
| Block scanner probes | Block | Match common exploit paths such as `.php`, `/wp-`, `/.env`, and admin probes |
| Block unexpected methods | Block | Allow only `GET`, `HEAD`, and `OPTIONS` for the public redirect hostname |
| Challenge suspicious clients | Managed Challenge | Exclude verified bots, `/_stats`, `/_tests`, static assets, and `robots.txt` |
| Block unwanted AI crawlers | Block | Exclude `/robots.txt`; match crawler user agents you do not want to serve |
| Rate limit short-link candidates | Block or challenge | Count repeated misses and scanner-like candidates, not successful redirects |

Example expressions for a `v8s.link` zone:

```text
http.host in {"v8s.link" "www.v8s.link"} and (
  ends_with(lower(http.request.uri.path), ".php") or
  contains(lower(http.request.uri.path), "/wp-") or
  contains(lower(http.request.uri.path), "/.env")
)
```

```text
http.host eq "v8s.link" and
not http.request.method in {"GET" "HEAD" "OPTIONS"}
```

```text
http.host eq "v8s.link" and
not cf.client.bot and
not starts_with(http.request.uri.path, "/_stats") and
not starts_with(http.request.uri.path, "/_tests") and
http.request.uri.path ne "/robots.txt"
```

Use the expression editor for nested rules, paste and validate one complete expression at a time, save rules disabled while tuning, then enable them after checking Security Events.

## AI Crawl Control

If the repository ships `robots.txt`, keep Cloudflare Managed robots.txt disabled. That makes the repo the source of truth and avoids Cloudflare overwriting intentional directives.

Useful defaults:

- Allow `/robots.txt`
- Allow `/llms.txt` and `/llms-full.txt` only if you intentionally publish machine-readable context
- Block unwanted AI crawlers and AI assistants at Cloudflare
- Keep verified search engine crawlers allowed unless your instance is intentionally private
- Review Cloudflare Security Events after enabling the rule, because it will not appear in Worker analytics when blocked at the edge

At minimum, leave `/robots.txt` allowed so crawlers can read the published policy.

## Rules

Recommended Rules settings:

| Setting | Recommendation |
| --- | --- |
| Remove `X-Powered-By` response headers | On |
| Add visitor location headers | Off |
| Remove visitor IP headers | Off unless an origin behind the Worker receives them |
| Add security headers transform | Off if the Worker already emits the intended headers |
| URL normalization type | Cloudflare |
| Normalize incoming URLs | On |
| Normalize URLs to origin | Off |

Incoming URL normalization is especially important because WAF rules, Access, and Workers evaluate the normalized URL. Keep origin normalization off unless another origin behind Cloudflare expects already-normalized paths.

## Network

Recommended Network settings:

| Setting | Recommendation |
| --- | --- |
| IPv6 Compatibility | On |
| gRPC | Off |
| WebSockets | Off unless a custom page requires them |
| Pseudo IPv4 | Off |
| IP Geolocation | On |
| Maximum Upload Size | Lowest practical plan default |
| Network Error Logging | On |
| Onion Routing | On |

## Caching

Keep caching boring for a redirector:

- Leave dynamic redirect decisions to the Worker
- Let static assets under `build/` use the Worker and asset headers
- Keep Development Mode off except while actively debugging
- Do not add cache rules that cache redirect responses unless you have tested lifecycle states, schedules, analytics, and misses

## Analytics

Use Cloudflare analytics and Security Events for infrastructure decisions:

- DNS, certificate, and TLS status
- Worker requests, errors, CPU time, wall time, and request duration
- WAF, rate limiting, bot, and AI crawler events
- Access login decisions for protected paths

Use vanityURLs server-side [Analytics](/docs/customize/analytics/) for application events such as pageviews, redirects, short-link misses, expand lookups, and normalized bot events that reach the Worker.

Traffic blocked by WAF, AI Crawl Control, Access, or rate limiting does not reach the Worker and should be reviewed in Cloudflare Security Events.
