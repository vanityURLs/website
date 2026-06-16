---
aside: false
title: "Network protection"
description: "Configure the Cloudflare domain controls that protect a vanityURLs short-link zone before traffic reaches the Worker."
weight: 60
aliases:
  - /docs/network-protection/
  - /docs/reference/network-protection/
  - /docs/reference/cloudflare-network-protection/
---

Use this page when you are ready to configure Cloudflare controls in front of the Worker. Network protection keeps commodity abuse, unexpected methods, scanner probes, unwanted crawlers, and infrastructure noise away from application code.

Prefer the Terraform starter in [`terraform/cloudflare-baseline`](https://github.com/vanityURLs/website/tree/main/terraform/cloudflare-baseline) for repeatable setup. It covers the Access baseline, the `Redirect www to apex` redirect rule, the `Rate limit short-link candidates` rate limit, and the `Block scanner probes`, `Block unexpected methods`, and `Block suspicious script clients` WAF rules. Use Cloudflare's managed **Block AI bots** control for broad AI crawler blocking so Cloudflare can keep the crawler list current, then use **AI Crawl Control** for crawler-specific visibility and exceptions. Use the dashboard steps below as the human-readable checklist and fallback for settings that still need visual review.

For the layered security rationale, read [Layering Cloudflare protection around a short-link domain](/blog/layering-cloudflare-protection-around-a-short-link-domain/). The raw Cloudflare dashboard capture lives in [data/cloudflare-protection-defaults.json](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json); use it to track Cloudflare menu changes, not as an operator checklist.

For the features intentionally left out of the default setup, read [Cloudflare features not to enable by default](/blog/cloudflare-features-not-to-enable-by-default/).

{{< mermaid >}}
flowchart LR
A["Visitor request"] --> B["Cloudflare edge"]
B --> C["TLS, DDoS,<br/>managed rules"]
C --> D["WAF, rate limit,<br/>bot controls"]
D --> E{"Allowed to<br/>reach Worker?"}
E -->|"no"| F["Block, challenge,<br/>or rate-limit response"]
E -->|"yes"| G["vanityURLs Worker"]
G --> H["Redirect short link"]
G --> I["Public local page"]
G --> J["Protected path<br/>to the dashboard"]
{{< /mermaid >}}

{{% steps %}}

### Confirm the Worker custom domain

In Cloudflare, open **Domains** > **your short domain** > **DNS** > **Records**. Use the Worker Custom Domain record that Cloudflare creates for the short domain. It should appear as a proxied Worker record for the hostname, such as `v8s.link -> v8s-link`.

Remove legacy synthetic `AAAA 100::` records for the same hostname once the Custom Domain is active. Keep mail, DKIM, DMARC, MTA-STS, and ownership verification records DNS-only unless the provider explicitly requires proxying.

Use the apex hostname as the only vanityURLs Worker hostname. If you publish `www`, create a proxied DNS record for `www` and redirect it to the apex in Cloudflare before the Worker. Use separate proxied records only for real web subdomains, such as `mta-sts` or a docs site.

### Redirect www to the apex

In Cloudflare, open **Domains** > **your short domain** > **Rules**. Prefer **Redirect Rules** when available. If your zone already uses legacy **Page Rules**, a single forwarding URL rule is also fine for this hostname canonicalization because it runs before the Worker and stays outside the vanityURLs link registry.

If Cloudflare asks you to create a proxied DNS record for `www`, use these DNS values in the same zone as the apex short domain:

| DNS field    | Value                 |
| ------------ | --------------------- |
| Type         | `A`                   |
| Name         | `www`                 |
| IPv4 address | `192.0.2.1`           |
| Proxy status | Proxied, orange cloud |

`192.0.2.1` is a documentation/test address and is safe here because the proxied redirect rule handles the request at Cloudflare before any origin connection is needed. In the DNS form, use `www`, not the full hostname. For example, entering `www.v8s.link` while you are inside another zone would create the wrong name, such as `www.v8s.link.example.com`.

Configure the redirect with these values:

| Field                      | Value                        |
| -------------------------- | ---------------------------- |
| Rule name                  | `Redirect www to apex`       |
| If incoming requests match | `Wildcard pattern`           |
| Request URL                | `https://www.v8s.link/*`     |
| Target URL                 | `https://v8s.link/${1}`      |
| Status code                | `301 - Permanent Redirect`   |
| Preserve query string      | Enabled                      |
| Order                      | Before Worker/WAF evaluation |

Use **Wildcard pattern**, not **All incoming requests**, because this rule should only match the `www` hostname. Replace `v8s.link` with your current short domain, such as `a6z.link` when you are working in the `a6z.link` zone. Include `https://` in the **Request URL** field; the dashboard rejects a host-only value such as `www.v8s.link/*`. The wildcard capture is referenced as `${1}` in the **Target URL**, so `/foo` becomes `https://v8s.link/foo`. Enable **Preserve query string** so `https://www.v8s.link/foo?x=1` becomes `https://v8s.link/foo?x=1`.

Keep the `www` DNS record proxied so Cloudflare can receive the request and apply the redirect. Do not add `www` to the Worker custom domain or to the WAF/rate-limit expressions below unless you intentionally serve the Worker on both hostnames.

### Set the HTTPS baseline

In Cloudflare, open **Domains** > **your short domain** > **SSL/TLS** > **Overview**. In **Configure encryption mode**, select **Custom SSL/TLS**, choose **Full (Strict)**, then save. Cloudflare may show **Automatic SSL/TLS (default)** with a current applied mode such as **Flexible** before you make this change; that is the state to replace for a production Worker custom domain.

Then open **SSL/TLS** > **Edge Certificates** and review the options in dashboard order:

| Dashboard option                      | Recommendation                                                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Manage Edge Certificates              | Confirm an active Universal certificate covers the apex domain and wildcard, such as `v8s.link` and `*.v8s.link`  |
| Advanced Certificate Manager          | No action unless the instance needs paid custom certificate controls                                              |
| Total TLS                             | No action on the Free baseline; it requires Advanced Certificate Manager                                          |
| Cipher suites                         | No action on the Free baseline; it requires Advanced Certificate Manager                                          |
| Always Use HTTPS                      | On                                                                                                                |
| HTTP Strict Transport Security (HSTS) | Leave Cloudflare dashboard HSTS disabled unless you intentionally want a zone-level policy beyond the repo header |
| Minimum TLS Version                   | TLS 1.2 or stricter                                                                                               |
| Opportunistic Encryption              | On is fine; no vanityURLs-specific action required                                                                |
| TLS 1.3                               | On                                                                                                                |
| Automatic HTTPS Rewrites              | On                                                                                                                |
| Certificate Transparency Monitoring   | Optional, useful for unexpected certificate alerts                                                                |
| Disable Universal SSL                 | Do not click it; seeing this action means Universal SSL is currently enabled                                      |

{{< callout type="warning" title="HSTS can look enabled when it is not" >}}
HSTS is the easy place to misread the UI. The repository ships a host-scoped `Strict-Transport-Security: max-age=31536000` header for Worker and static-asset responses. Prefer that repo-managed header as the source of truth. Enable Cloudflare dashboard HSTS only when you deliberately want Cloudflare to own or strengthen the policy across the zone. Use `includeSubDomains` and **Preload** only when the whole zone is intentionally HTTPS-only.
{{< /callout >}}

{{< callout type="warning" title="Avoid competing header sources" >}}
Keep CSP, HSTS, frame, referrer, and permissions policy in the repository unless there is a deliberate zone-level reason to manage one of them in Cloudflare. If Cloudflare Transform Rules, Snippets, Zaraz, Rocket Loader, managed HSTS, or other dashboard features add or rewrite the same headers or inject scripts, they can conflict with the Worker and `_headers` policy.

This follows [ADR 0014: Prefer repository-owned configuration](https://github.com/vanityURLs/code/blob/main/docs/adr/0014-prefer-repository-owned-configuration.md): use the Cloudflare dashboard for controls that cannot reasonably live in Git, and leave dashboard duplicates disabled when the repository already owns the behavior.
{{< /callout >}}

{{< callout type="warning" title="Avoid challenge JavaScript on public HTML" >}}
Do not use **Managed Challenge**, **Bot Fight Mode**, or zone-wide **JavaScript Detections** as the baseline for public redirect, lookup, or status pages. Cloudflare can inject Challenge Platform code such as `/cdn-cgi/challenge-platform/scripts/jsd/main.js` into matching HTML responses, which makes repo-owned HTML and CSP behavior non-deterministic. vanityURLs sends `Cache-Control: no-transform` on HTML responses as a product-side guard, but the dashboard controls should still stay off unless the instance deliberately accepts Cloudflare-owned script injection. For narrow script-client rules, use **Block** or leave the rule disabled.
{{< /callout >}}

On the Free plan, **JavaScript Detections** is controlled by **Bot Fight Mode** on **Security** > **Settings**. Turn **Bot Fight Mode** off for strict-CSP vanityURLs instances. On plans with Super Bot Fight Mode or Bot Management, JavaScript Detections can also appear under **Security** > **Bots** > **Configure Bot Management** > **JavaScript Detections**.

### Enable baseline security controls

In Cloudflare, open **Domains** > **your short domain** > **Security** > **Settings** for the dashboard, bot, browser integrity, challenge, content-rewrite, and `security.txt` controls. The Settings page is long and includes filter chips and a search field. They are useful for finding a known setting, but this checklist follows the page order because the filters hide context and can make setup harder to audit. Custom expressions are covered in **Add WAF rules** below.

The free-plan security settings should stay boring and explicit. Turn on protections that reduce commodity abuse, but avoid features that alter public content or expose extra visitor data unless there is a clear need.

| Setting, in dashboard order           | Recommendation                                      | Why                                                                                                                                                                     |
| ------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI Labyrinth                          | Off                                                 | It intentionally modifies pages for bots; keep public redirect and policy pages deterministic                                                                           |
| Block AI bots                         | Block on all pages                                  | Blocks AI training crawlers across the zone without maintaining a custom user-agent rule list                                                                           |
| Bot Fight Mode                        | Off for strict-CSP instances                        | It enables Cloudflare JavaScript Detections, which can inject Challenge Platform code into public HTML and conflict with repo-owned `script-src 'self'`                 |
| Browser Integrity Check               | On, default configuration                           | Blocks malformed or suspicious browser requests before Worker code runs                                                                                                 |
| Challenge Passage                     | 30 minutes                                          | Keeps managed challenges useful without making repeat legitimate visits too noisy                                                                                       |
| Cloudflare Managed Free Ruleset       | On                                                  | Cloudflare maintains and updates this free managed ruleset; it is generic baseline coverage, not vanityURLs-specific posture                                            |
| Continuous script monitoring          | Off for the default instance                        | The baseline uses same-origin, fingerprinted scripts with CSP and SRI. Enable inventory alerts only after intentionally adding third-party scripts                      |
| Custom fallthrough rules              | No rule by default                                  | Only needed when you deliberately want a fallback rule for unmatched traffic                                                                                            |
| Email Address Obfuscation             | Off                                                 | Cloudflare rewrites matching email addresses and can inject helper code; keep generated pages, CSP, and SRI deterministic                                               |
| HTTP DDoS attack protection           | On, always active                                   | Cloudflare-managed HTTP DDoS protection runs independently of the Worker                                                                                                |
| Manage your robots.txt                | Disable Cloudflare-managed robots.txt configuration | The repository ships `defaults/public/robots.txt`; keep the repo as the source of truth instead of letting Cloudflare replace it with Content Signals Policy output     |
| Network-layer DDoS attack protection  | On, always active                                   | Baseline network DDoS mitigation is handled at Cloudflare's edge                                                                                                        |
| Replace insecure JavaScript libraries | Off                                                 | The baseline uses self-hosted, fingerprinted JavaScript with SRI; do not let Cloudflare rewrite script URLs or bytes unless you intentionally give up repo-owned hashes |
| Security level                        | Leave **I'm Under Attack Mode** disabled            | Use only for active incidents; it is too disruptive as a normal redirector baseline                                                                                     |
| Security.txt                          | Leave Cloudflare dashboard Security.txt off         | The repository generates and deploys `/.well-known/security.txt`; keep that file and the footer/security pages in one source of truth                                   |
| SSL/TLS DDoS attack protection        | On, always active                                   | TLS-layer DDoS mitigation is handled by Cloudflare                                                                                                                      |

{{< details title="No-action security settings for a default redirector" >}}

| Setting                            | Baseline decision                                                                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Client certificates                | Do not configure for the public redirector unless a future origin/API requires mTLS                                                           |
| Endpoint Labels                    | No action; this belongs to API Shield endpoint organization, and the redirector does not expose an operator API                               |
| Hotlink Protection                 | Off; shortener assets are small, and off-site image reuse is not product behavior                                                             |
| IP access rules                    | No action; prefer precise custom rules or Cloudflare Access instead of broad IP rules                                                         |
| IP lists                           | No action unless custom WAF rules need reusable IP sets                                                                                       |
| Leaked Credentials Detection       | Off unless the app later adds password login; vanityURLs does not authenticate visitors with passwords                                        |
| mTLS rules                         | No action for a Worker-only public redirector                                                                                                 |
| Rate limit authentication requests | No rule by default; private paths are protected by Cloudflare Access SSO, not a password endpoint on the redirector                           |
| Schema Validation                  | No action unless explicit API schemas are added                                                                                               |
| User agent blocking                | No rules by default; use it only for a specific aggressive client, and prefer managed bot controls or WAF rules first                         |
| Web asset discovery                | No action; leaving discovery visible is fine, but it does not change redirect behavior                                                        |
| Zone lockdown                      | No action on the Free baseline; Cloudflare documents Zone Lockdown as paid-plan only and recommends custom rules for allowlist-style behavior |

{{< /details >}}

{{< callout type="warning" title="Avoid extra visitor data and mTLS complexity" >}}
Do not enable client certificates, mTLS rules, visitor location headers, or True-Client-IP headers for the public shortener unless a downstream service explicitly needs them. The Worker already receives Cloudflare country and colo metadata for aggregate analytics.
{{< /callout >}}

Cloudflare moves dashboard labels regularly. Review the [Cloudflare Docs changelog](https://developers.cloudflare.com/changelog/) and product changelogs, especially [Rules](https://developers.cloudflare.com/rules/changelog/) and bot controls, when refreshing this page. Use the raw capture in [data/cloudflare-protection-defaults.json](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) to compare menu labels over time.

### Add WAF rules

In Cloudflare, open **Domains** > **your short domain** > **Security** > **Security rules** > **Security rules**. To add a custom rule, use **Create rule** or the **Show all rule types** menu, choose **Custom rules**, enter the rule name, click **Edit expression**, paste one expression, choose the action, then deploy. For rate limiting, use the **Rate limiting rules** row instead.

Cloudflare security rules run before the Worker. Use them for traffic that should never reach application code.

The expressions below use `v8s.link` and intentionally scope to the apex hostname. Redirect `www.v8s.link` to the apex before the Worker instead of adding `www` to every Worker, WAF, and rate-limit rule. A DNS CNAME alone aliases a hostname; it does not create an HTTP redirect by itself.

For the Free-plan rate limiting rule, use **Rate limit short-link candidates** as the rule name, **IP** as the characteristic, **20 requests** per **10 seconds**, **Block** as the action, **10 seconds** as the duration, and **First** as the order. The expression excludes the `/lookup` page but not `/lookup/resolve`, so lookup resolution stays covered by the single available rate limiting rule.

<table class="waf-rules-table">
  <thead>
    <tr>
      <th>Rule</th>
      <th>Action</th>
      <th>Expression</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Rate limit short-link candidates<br><small>Rate limiting rule</small></td>
      <td>Characteristic: IP<br>Threshold: 20 requests per 10 seconds<br>Action: Block<br>Duration: 10 seconds<br>Order: First</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
not cf.client.bot and
not http.request.uri.path contains "/_stats" and
not http.request.uri.path contains "/_tests" and
not starts_with(http.request.uri.path, "/_analytics") and
not http.request.uri.path in {"/" "/index" "/lookup" "/privacy" "/terms" "/abuse" "/security" "/404" "/expired" "/disabled" "/maintenance" "/security.txt" "/.well-known/security.txt" "/robots.txt" "/favicon.svg"} and
not lower(http.request.uri.path) contains ".css" and
not lower(http.request.uri.path) contains ".js" and
not lower(http.request.uri.path) contains ".png" and
not lower(http.request.uri.path) contains ".svg" and
not lower(http.request.uri.path) contains ".ico" and
not lower(http.request.uri.path) contains ".txt" and
not lower(http.request.uri.path) contains ".webmanifest" and
not lower(http.request.uri.path) contains ".woff"</code></pre>
      </td>
      <td>Create this first. It counts likely short-link candidates and lookup resolution requests while excluding operator paths, policy pages, well-known files, the lookup page, analytics beacons, and static assets. On plans with only one rate limiting rule, use this rule as the baseline.</td>
    </tr>
    <tr>
      <td>Rate limit lookup resolution<br><small>Rate limiting rule</small></td>
      <td>Block for 60 seconds when the rate exceeds 30 requests per minute</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
http.request.method eq "POST" and
http.request.uri.path eq "/lookup/resolve" and
not cf.client.bot</code></pre>
      </td>
      <td>`/lookup/resolve` is exact-match only and returns no list, but it can reveal destinations for guessed slugs. Add this tighter rule only when your Cloudflare plan allows multiple rate limiting rules.</td>
    </tr>
    <tr>
      <td>Rate limit lookup analytics<br><small>Rate limiting rule</small></td>
      <td>Block for 60 seconds when the rate exceeds 60 requests per minute</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
http.request.method eq "POST" and
http.request.uri.path eq "/_analytics/lookup" and
not cf.client.bot</code></pre>
      </td>
      <td>Protects Umami/Fathom quota from direct beacon abuse. This endpoint does not resolve links; it only records lookup activity that reached the Worker.</td>
    </tr>
    <tr>
      <td>Block scanner probes<br><small>Custom rule</small></td>
      <td>Block</td>
      <td>
        <pre><code>http.host eq "v8s.link" and (
  ends_with(lower(http.request.uri.path), ".php") or
  lower(http.request.uri.path) contains "/wp-content/" or
  lower(http.request.uri.path) contains "/wp-includes/" or
  lower(http.request.uri.path) contains "/wp-admin/" or
  lower(http.request.uri.path) contains "/wp-" or
  lower(http.request.uri.path) contains "wp-login.php" or
  lower(http.request.uri.path) contains "xmlrpc.php" or
  lower(http.request.uri.path) contains ".env" or
  lower(http.request.uri.path) contains "phpinfo" or
  lower(http.request.uri.path) contains "/vendor/" or
  lower(http.request.uri.path) contains "/.git" or
  lower(http.request.uri.path) contains "/cgi-bin/"
)</code></pre>
      </td>
      <td>Blocks common PHP, WordPress, environment-file, dependency, Git, and CGI probes.</td>
    </tr>
    <tr>
      <td>Block unexpected methods<br><small>Custom rule</small></td>
      <td>Block</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
not http.request.method in {"GET" "HEAD" "OPTIONS"} and
not (
  http.request.method eq "POST" and
  http.request.uri.path in {"/lookup/resolve" "/_analytics/lookup"}
)</code></pre>
      </td>
      <td>Allows only methods expected by the public redirect hostname, plus the two public lookup POST endpoints.</td>
    </tr>
    <tr>
      <td>Block suspicious script clients<br><small>Custom rule</small></td>
      <td>Block</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
not cf.client.bot and
not http.request.uri.path contains "/_stats" and
not http.request.uri.path contains "/_tests" and
(
  lower(http.user_agent) contains "curl" or
  lower(http.user_agent) contains "wget" or
  lower(http.user_agent) contains "python-requests" or
  lower(http.user_agent) contains "go-http-client" or
  lower(http.user_agent) contains "httpclient"
)</code></pre>
      </td>
      <td>Blocks common script and HTTP-client user agents without injecting challenge JavaScript into public HTML.</td>
    </tr>
  </tbody>
</table>

Paste and validate one complete expression at a time. Deploy rules disabled while tuning if traffic is already flowing, then enable them after checking Security Events.

{{< callout type="note" title="Lookup is public, not an inventory endpoint" >}}
The lookup page and `/lookup/resolve` endpoint intentionally let a visitor inspect one exact slug before clicking. They do not list links or autocomplete slugs, and the shipped `X-Frame-Options: DENY` plus `frame-ancestors 'none'` headers prevent clickjacking. The remaining risk is bulk guessing from scripts, so protect `/lookup/resolve` and `/_analytics/lookup` with explicit rate limits.
{{< /callout >}}

### Decide crawler controls

In Cloudflare, use **Domains** > **your short domain** > **AI Crawl Control** for crawler-specific visibility and exceptions. This is separate from the broad **Security** > **Settings** > **Block AI bots** toggle covered earlier.

Use **Block AI bots** as the broad baseline for known and newly classified AI crawlers. Cloudflare updates that managed rule over time, while a static user-agent expression only blocks the names you typed into it. Do not create or keep a custom WAF user-agent list as the primary AI crawler defense when **Block AI bots** is set to **Block on all pages**.

Use **AI Crawl Control** when you need crawler-level decisions, monitoring, or an exception to the broad baseline. If the dashboard says the AI crawler rule was modified outside AI Crawl Control, review the underlying WAF rule and remove local edits that make AI Crawl Control unable to parse the expression. Keep any custom additions narrow and parseable, or put them in a separate fallback rule below Cloudflare-managed crawler controls.

Use **AI Crawl Control** > **Security** to block named crawlers and configure the blocked-crawler response. If you use this page, set the block response allowed paths to:

- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`
- `/.well-known/*`

Leave `/mcp` and `/ads.txt` disabled unless the instance intentionally publishes those files. Keeping `/.well-known/*` allowed matters because vanityURLs publishes the security disclosure contact at `/.well-known/security.txt`.

{{< callout type="warning" title="Keep repository robots.txt authoritative" >}}
Use **AI Crawl Control** > **Signals** for crawler compliance monitoring. Leave **Managed robots.txt** off when the repository ships `robots.txt`; otherwise Cloudflare can replace the file seen at `/robots.txt`. The default vanityURLs file is:
{{< /callout >}}

```text
User-agent: *
Disallow: /

Allow: /robots.txt
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /en/_stats/
Disallow: /*/_stats/
Disallow: /lookup/
```

The Signals page should show `/robots.txt` as reachable with `200 OK`. Use **Agent Readiness** and **Robots.txt violations** as monitoring surfaces, not as the source of truth for the file content.

### Configure Rules and URL normalization

In Cloudflare, open **Domains** > **your short domain** > **Rules** > **Settings**. Review **Managed Transforms**, **Bulk Redirects**, and **URL Normalization**.

Recommended Rules settings:

| Category           | Setting                                | Recommendation                                                                                                                                                                                   |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Managed Transforms | Remove `X-Powered-By` response headers | On as defense-in-depth; Cloudflare does not appear to enable this by default, and vanityURLs does not intentionally emit `X-Powered-By`                                                          |
| Managed Transforms | Add visitor location headers           | Off; Umami and Fathom do not need city/latitude/longitude request headers from Cloudflare, and adding them increases location data exposure                                                      |
| Managed Transforms | Remove visitor IP headers              | Off unless an origin behind the Worker receives them                                                                                                                                             |
| Managed Transforms | Add security headers transform         | Off by default; vanityURLs owns headers in the Worker and repository `_headers` files, and Cloudflare's broad transform adds a fixed header bundle that may not match the app policy             |
| Bulk Redirects     | Bulk Redirect Lists                    | No action for Worker-based vanityURLs; useful for large static redirect lists, but they bypass the registry lifecycle, analytics, lookup pages, schedules, splats, and local publishing workflow |
| URL Normalization  | URL normalization type                 | Cloudflare                                                                                                                                                                                       |
| URL Normalization  | Normalize incoming URLs                | On, used by Access, WAF rules, and Workers                                                                                                                                                       |
| URL Normalization  | Normalize URLs to origin               | Off                                                                                                                                                                                              |

### Configure Network settings

In Cloudflare, open **Domains** > **your short domain** > **Network**.

Recommended Network settings:

| Setting               | Recommendation                         |
| --------------------- | -------------------------------------- |
| IPv6 Compatibility    | On                                     |
| gRPC                  | Off                                    |
| WebSockets            | Off unless a custom page requires them |
| Pseudo IPv4           | Off                                    |
| IP Geolocation        | On                                     |
| Maximum Upload Size   | Lowest practical plan default          |
| Network Error Logging | On                                     |
| Onion Routing         | On                                     |

### Keep caching conservative

In Cloudflare, open **Domains** > **your short domain** > **Caching** > **Configuration** for general cache settings, then **Caching** > **Cache Rules** to confirm there are no cache rules.

Keep caching boring for a redirector:

- Leave dynamic redirect decisions to the Worker
- Let static assets under `build/` use the Worker and asset headers
- Keep Development Mode off except while actively debugging
- Do not create Cache Rules or Cache Response Rules for the baseline
- If any Cache Rules or Cache Response Rules exist, disable or delete them before go-live

{{% /steps %}}
