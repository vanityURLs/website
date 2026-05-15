---
title: "Cloudflare Workers"
description: "Recommended Cloudflare configuration for vanityURLs Workers, custom domains, DNS, Access, observability, and zone protection."
nav_order: 10
---

The current vanityURLs runtime deploys as a Cloudflare Worker with static assets. The Worker is the origin for the short-link hostname, so use a Worker Custom Domain instead of the older Pages `_redirects` or DNS `AAAA 100::` route pattern.

## Cloudflare navigation map

Cloudflare splits the required vanityURLs settings across three different dashboard areas. Check the dashboard scope before changing a setting; being in the right Cloudflare product is not always enough.

| Dashboard area | How to get there | vanityURLs settings there |
|---|---|---|
| Zero Trust | Main menu, then Zero Trust | Access applications, Access policies, identity providers, Zero Trust settings |
| Workers & Pages | Main menu, Build, Compute, Workers & Pages | Worker deployments, metrics, logs, bindings, custom domains, Worker settings |
| Domain configuration | Main menu, Account home, then click the domain in the main page content | DNS, SSL/TLS, Security, WAF rules, AI Crawl Control, Rules settings, Network, Caching |

In the Cloudflare UI, the domain configuration area may not have a clear product name. The most reliable signal is the domain name in the top line and a left menu with items such as DNS, SSL/TLS, Security, Rules, Network, and Caching.

Use Zero Trust for who may access private paths. Use Workers & Pages for the Worker itself. Use Domain configuration for traffic, DNS, TLS, and zone-level security.

## Recommended Worker shape

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-05"
workers_dev = false
preview_urls = false

[build]
command = "npm run build"

[assets]
directory = "./build"
binding = "ASSETS"
not_found_handling = "404-page"
run_worker_first = [
  "/*",
  "!/*.css",
  "!/*.js",
  "!/*.png",
  "!/*.svg",
  "!/*.ico",
  "!/*.webmanifest",
  "!/*.txt",
  "!/*.xml",
  "!/fonts/*",
]

[[routes]]
pattern = "v8s.link"
custom_domain = true

[observability]
[observability.logs]
enabled = true
invocation_logs = true
```

The important parts are:

- `custom_domain = true`, because the Worker is the origin for the whole hostname.
- `workers_dev = false` and `preview_urls = false`, because public preview hostnames are unnecessary for a production shortener.
- `ASSETS` binding, because the Worker serves default and custom static pages from `build/`.
- `run_worker_first`, because short-link lookup, protected paths, scanner blocks, and analytics must run before asset fallback.
- Workers Logs enabled, because Cloudflare metrics are useful for performance and error rate, but application events belong in server-side analytics.

## DNS and domains

For the root short domain, prefer the Worker Custom Domain row that Cloudflare creates for the Worker. It should appear as a proxied Worker record for the hostname, like `v8s.link -> v8s-link`.

Avoid keeping legacy synthetic `AAAA 100::` records for the same hostname once the Custom Domain is active. Keep mail records, DKIM, DMARC, MTA-STS, and ownership verification records as DNS-only unless the service explicitly requires proxying.

Use separate proxied records only for real web subdomains, such as `mta-sts`, `www`, or a docs site.

## Zone security

Recommended free-plan posture for the short-link zone:

| Setting | Recommendation |
|---|---|
| DNS setup | Full |
| SSL/TLS mode | Full strict |
| Always Use HTTPS | On |
| TLS 1.3 | On |
| Minimum TLS | 1.2 or stricter |
| Bot Fight Mode | On |
| Block AI crawlers | On all pages, unless you intentionally want model crawlers |
| AI Labyrinth | Off unless you explicitly want bot delay pages |
| Cloudflare managed ruleset | On |
| HTTP DDoS protection | On |
| Network-layer DDoS protection | On |
| Development Mode | Off |
| Under Attack Mode | Off unless actively mitigating an incident |
| Manage robots.txt | Disabled if the repository already ships `robots.txt` |
| Browser Integrity Check | On |
| URL Normalization | Normalize incoming URLs |

For SSL/TLS, start with `Full (strict)`, Universal SSL active, Always Use HTTPS on, TLS 1.3 on, and Minimum TLS 1.2. Enable HSTS only after every production hostname and subdomain is ready for HTTPS. A one-month max age is a practical first setting; include subdomains and preload only when the whole zone is intentionally HTTPS-only.

Keep Automatic HTTPS Rewrites on. Certificate Transparency Monitoring is optional, but useful when the account owner wants email alerts for unexpected certificates.

## Security settings

The free-plan security settings should stay boring and explicit. Turn on the protections that reduce commodity abuse, but avoid features that alter public content or expose extra visitor data unless there is a clear need.

| Setting | Recommendation | Why |
|---|---|---|
| New application security dashboard | On | Use the current dashboard view for security events and action items. |
| AI Labyrinth | Off by default | It modifies bot-visible pages and is better treated as an intentional anti-crawler choice. |
| Block AI bots | On all pages | Keeps unwanted AI training crawlers out before the Worker. |
| Bot Fight Mode | On | Adds baseline bot challenges on the free plan. |
| Browser Integrity Check | On | Blocks malformed or suspicious browser requests before Worker code runs. |
| Challenge Passage | 30 minutes | Keeps managed challenges useful without making repeat legitimate visits too noisy. |
| Cloudflare managed ruleset | On | Provides Cloudflare-maintained baseline app protection. |
| Email Address Obfuscation | On if public pages show email addresses | Protects visible email addresses without changing human-readable content. |
| Hotlink Protection | Off by default | Shortener assets are small; enable only if off-site image reuse becomes a real cost. |
| Leaked Credentials Detection | Off unless the app has password login | vanityURLs does not authenticate visitors with passwords. |
| Security.txt | Configure before release | Publish a contact path for vulnerability reports. |
| Replace insecure JavaScript libraries | On | Lets Cloudflare replace known insecure libraries when supported. |
| Schema Validation | Off unless API schemas are defined | It needs explicit endpoints and active schemas to be useful. |
| Zone IP allowlist rules | Off unless admin paths need IP allowlisting | Cloudflare Access is the primary control for private paths. |

Do not enable client certificates, mTLS rules, visitor location headers, or True-Client-IP headers for the public shortener unless a downstream service explicitly needs them. The Worker already receives Cloudflare country and colo metadata for aggregate analytics.

## Rules settings and network

Recommended Rules settings:

| Setting | Recommendation |
|---|---|
| Remove `X-Powered-By` response headers | On |
| Add visitor location headers | Off |
| Remove visitor IP headers | Off unless an origin behind the Worker receives them |
| Add security headers transform | Off if the Worker already emits the intended headers |
| URL normalization type | Cloudflare |
| Normalize incoming URLs | On |
| Normalize URLs to origin | Off |

Recommended Network settings:

| Setting | Recommendation |
|---|---|
| IPv6 Compatibility | On |
| gRPC | Off |
| WebSockets | Off unless a custom page requires them |
| Pseudo IPv4 | Off |
| IP Geolocation | On |
| Maximum Upload Size | Lowest practical plan default |
| Network Error Logging | On |
| Onion Routing | On |

Incoming URL normalization is especially important because WAF rules, Access, and Workers evaluate the normalized URL. Keep origin normalization off unless another origin behind Cloudflare expects already-normalized paths.

## WAF and rate limiting

Cloudflare security rules run before the Worker. Use them for traffic that should never spend Worker CPU, then leave the Worker blocklist as the application-level fallback.

Recommended rule set:

| Rule | Action | Notes |
|---|---|---|
| Block scanner probes | Block | Match common exploit paths such as `.php`, `/wp-`, `/.env`, and admin probes. |
| Block unexpected methods | Block | Allow only `GET`, `HEAD`, and `OPTIONS` for the public redirect hostname. |
| Challenge suspicious clients | Managed Challenge | Exclude verified bots, `/_stats`, `/_tests`, static assets, and `robots.txt`. |
| Block unwanted AI crawlers | Block | Exclude `/robots.txt`; match crawler user agents you do not want to serve. |
| Rate limit short-link candidates | Block or challenge | Count repeated misses and scanner-like candidates, not successful redirects. |

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

Keep the exact AI crawler list in Cloudflare, not in public docs, because crawler names and policy choices change. At minimum, leave `/robots.txt` allowed so crawlers can read the published policy.

## AI crawler policy

If the repository ships `robots.txt`, keep Cloudflare Managed robots.txt disabled. That makes the repo the source of truth and avoids Cloudflare overwriting intentional directives.

The default `defaults/public/robots.txt` disallows crawling by default and only allows policy/context files such as `/robots.txt`, `/llms.txt`, and `/llms-full.txt`. Those files exist to describe the software and the deployed surface, not to advertise the link inventory. A vanityURLs instance is a redirect engine, not a public content site; there is normally nothing useful for bots to harvest.

Use AI Crawl Control or a WAF user-agent rule when you want Cloudflare to block selected AI crawler traffic before it reaches the Worker. Mirror the same policy in `robots.txt` for transparency, but treat `robots.txt` as advisory and the WAF rule as enforcement.

Useful defaults:

- Allow `/robots.txt`.
- Allow `/llms.txt` and `/llms-full.txt` only if you intentionally publish machine-readable context.
- Block unwanted AI crawlers and AI assistants at Cloudflare.
- Keep verified search engine crawlers allowed unless your instance is intentionally private.
- Review Cloudflare Security Events after enabling the rule, because it will not appear in Worker analytics when blocked at the edge.

For a private, family, team, or internal short-link domain, it is reasonable to block all crawler families except the ones you explicitly want. Do not rely on `robots.txt` alone for this; use Cloudflare AI Crawl Control, WAF rules, and the runtime blocklist together.

## Protected operations

Protect these paths with a Cloudflare Zero Trust self-hosted application:

```text
v8s.link/_stats
v8s.link/_stats/*
v8s.link/_tests
v8s.link/_tests/*
```

Use one self-hosted Access application for these private operations. Configure the destinations exactly, then attach a default-deny policy model with a single allow policy for maintainers.

Recommended Access settings:

| Setting | Recommendation |
|---|---|
| Application type | Self-hosted |
| Public hostnames | `v8s.link/_stats`, `v8s.link/_stats/*`, `v8s.link/_tests`, `v8s.link/_tests/*` |
| Policy | Allow named maintainer emails or a maintained identity group |
| Session duration | 24 hours |
| MFA | Respect global enforcement or require it directly on the policy |
| Browser rendering | Off |
| Identity providers | Use account-managed IdPs such as GitHub, Google Workspace, or Okta |

Do not commit identity-provider app IDs, client secrets, Access audiences, or service tokens. Keep them in Cloudflare Zero Trust and Worker secrets. Rotate provider secrets if they are ever exposed in a screenshot, log, or repository.

Set the team domain as a Worker variable and the Access audience as a secret:

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

The Worker validates the `Cf-Access-Jwt-Assertion` header. If Access is not configured, protected paths fail closed.

Test the policy from Cloudflare Zero Trust before release, then visit `/_stats` and `/_tests` from a signed-out browser profile to confirm both paths are denied.

## Observability split

Use Cloudflare dashboards for infrastructure signals:

- DNS, certificate, and TLS status
- Worker requests, errors, CPU time, wall time, and request duration
- WAF, rate limiting, bot, and AI crawler events
- Access login decisions for protected paths

Use vanityURLs server-side analytics for application events:

- pageviews
- redirects
- short-link misses
- expand lookups
- normalized bot events that reach the Worker

Traffic blocked by WAF, AI Crawl Control, Access, or rate limiting does not reach the Worker and should be reviewed in Cloudflare Security Events, not in Umami or Fathom.

## Build and deploy

The Cloudflare Git integration can run:

```text
npx wrangler@latest deploy --config wrangler.toml
```

The repository build command runs before deploy, copies `defaults/`, overlays `custom/`, validates `v8s.json`, and copies the runtime Worker into `src/worker.mjs`.

Run the same validation locally before pushing:

```bash
npm run check
```

## References

- [Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
