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

For the layered security rationale, read [Layering Cloudflare protection around a short-link domain](/blog/layering-cloudflare-protection-around-a-short-link-domain/). The raw Cloudflare dashboard capture lives in [data/cloudflare-protection-defaults.json](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json); use it to track Cloudflare menu changes, not as an operator checklist.

For the features intentionally left out of the default setup, read [Cloudflare features not to enable by default](/blog/cloudflare-features-not-to-enable-by-default/).

{{% steps %}}

### Confirm the Worker custom domain

In Cloudflare, open **Domains** > **your short domain** > **DNS** > **Records**. Use the Worker Custom Domain record that Cloudflare creates for the short domain. It should appear as a proxied Worker record for the hostname, such as `v8s.link -> v8s-link`.

Remove legacy synthetic `AAAA 100::` records for the same hostname once the Custom Domain is active. Keep mail, DKIM, DMARC, MTA-STS, and ownership verification records DNS-only unless the provider explicitly requires proxying.

Use separate proxied records only for real web subdomains, such as `mta-sts`, `www`, or a docs site.

### Set the HTTPS baseline

In Cloudflare, open **Domains** > **your short domain** > **SSL/TLS** > **Overview**. In **Configure encryption mode**, select **Custom SSL/TLS**, choose **Full (Strict)**, then save. Cloudflare may show **Automatic SSL/TLS (default)** with a current applied mode such as **Flexible** before you make this change; that is the state to replace for a production Worker custom domain.

Then open **SSL/TLS** > **Edge Certificates** and review the options in dashboard order:

| Dashboard option | Recommendation |
| --- | --- |
| Manage Edge Certificates | Confirm an active Universal certificate covers the apex domain and wildcard, such as `v8s.link` and `*.v8s.link` |
| Advanced Certificate Manager | No action unless the instance needs paid custom certificate controls |
| Total TLS | No action on the Free baseline; it requires Advanced Certificate Manager |
| Cipher suites | No action on the Free baseline; it requires Advanced Certificate Manager |
| Always Use HTTPS | On |
| HTTP Strict Transport Security (HSTS) | Start with no browser-enforced HSTS until every production hostname and subdomain is HTTPS-ready |
| Minimum TLS Version | TLS 1.2 or stricter |
| Opportunistic Encryption | On is fine; no vanityURLs-specific action required |
| TLS 1.3 | On |
| Automatic HTTPS Rewrites | On |
| Certificate Transparency Monitoring | Optional, useful for unexpected certificate alerts |
| Disable Universal SSL | Do not click it; seeing this action means Universal SSL is currently enabled |

HSTS is the easy place to misread the UI. **Enable HSTS** with **Max Age Header (max-age)** set to **0 (Disable)** does not give browsers a durable HSTS policy; it is a non-enforcing or reset state. Use that while validating the zone. For production enforcement, choose a non-zero max age after every public hostname is HTTPS-ready. A one-month max age is a practical first setting; enable **includeSubDomains** and **Preload** only when the whole zone is intentionally HTTPS-only.

### Enable baseline security controls

In Cloudflare, open **Domains** > **your short domain** > **Security** > **Settings** for the dashboard, bot, browser integrity, challenge, library replacement, and `security.txt` controls. The Settings page is long and includes filter chips and a search field. They are useful for finding a known setting, but this checklist follows the page order because the filters hide context and can make setup harder to audit. Custom expressions are covered in **Add WAF rules** below.

The free-plan security settings should stay boring and explicit. Turn on protections that reduce commodity abuse, but avoid features that alter public content or expose extra visitor data unless there is a clear need.

| Setting, in dashboard order | Recommendation | Why |
| --- | --- | --- |
| AI Labyrinth | Off | It intentionally modifies pages for bots; keep public redirect and policy pages deterministic |
| Block AI bots | Block on all pages | Blocks AI training crawlers across the zone without maintaining a custom user-agent rule list |
| Bot Fight Mode | On, default configuration | The Free-plan control is on/off; there are no per-rule options to tune |
| Browser Integrity Check | On, default configuration | Blocks malformed or suspicious browser requests before Worker code runs |
| Challenge Passage | 30 minutes | Keeps managed challenges useful without making repeat legitimate visits too noisy |
| Cloudflare Managed Free Ruleset | On | Cloudflare maintains and updates this free managed ruleset; it is generic baseline coverage, not vanityURLs-specific posture |
| Continuous script monitoring | Off for the default instance | The generated pages load one local script for UI niceness; enable this only after adding third-party scripts or if you want Cloudflare script inventory alerts |
| Custom fallthrough rules | No rule by default | Only needed when you deliberately want a fallback rule for unmatched traffic |
| Email Address Obfuscation | On | Harmless with no matching rule; useful if generated public pages show role addresses |
| HTTP DDoS attack protection | On, always active | Cloudflare-managed HTTP DDoS protection runs independently of the Worker |
| Manage your robots.txt | Disable Cloudflare-managed robots.txt configuration | The repository ships `defaults/public/robots.txt`; keep the repo as the source of truth instead of letting Cloudflare replace it with Content Signals Policy output |
| Network-layer DDoS attack protection | On, always active | Baseline network DDoS mitigation is handled at Cloudflare's edge |
| Replace insecure JavaScript libraries | On | Currently most useful for known third-party libraries such as `polyfill`; it is low risk and can catch future additions |
| Security level | Leave **I'm Under Attack Mode** disabled | Use only for active incidents; it is too disruptive as a normal redirector baseline |
| Security.txt | Configure before release | Publish a contact path for vulnerability reports |
| SSL/TLS DDoS attack protection | On, always active | TLS-layer DDoS mitigation is handled by Cloudflare |

{{< details title="No-action security settings for a default redirector" >}}

| Setting | Baseline decision |
| --- | --- |
| Client certificates | Do not configure for the public redirector unless a future origin/API requires mTLS |
| Endpoint Labels | No action; this belongs to API Shield endpoint organization, and the redirector does not expose an operator API |
| Hotlink Protection | Off; shortener assets are small, and off-site image reuse is not product behavior |
| IP access rules | No action; prefer precise custom rules or Cloudflare Access instead of broad IP rules |
| IP lists | No action unless custom WAF rules need reusable IP sets |
| Leaked Credentials Detection | Off unless the app later adds password login; vanityURLs does not authenticate visitors with passwords |
| mTLS rules | No action for a Worker-only public redirector |
| Rate limit authentication requests | No rule by default; private paths are protected by Cloudflare Access SSO, not a password endpoint on the redirector |
| Schema Validation | No action unless explicit API schemas are added |
| User agent blocking | No rules by default; use it only for a specific aggressive client, and prefer managed bot controls or WAF rules first |
| Web asset discovery | No action; leaving discovery visible is fine, but it does not change redirect behavior |
| Zone lockdown | No action on the Free baseline; Cloudflare documents Zone Lockdown as paid-plan only and recommends custom rules for allowlist-style behavior |

{{< /details >}}

Do not enable client certificates, mTLS rules, visitor location headers, or True-Client-IP headers for the public shortener unless a downstream service explicitly needs them. The Worker already receives Cloudflare country and colo metadata for aggregate analytics.

Cloudflare moves dashboard labels regularly. Review the [Cloudflare Docs changelog](https://developers.cloudflare.com/changelog/) and product changelogs, especially [Rules](https://developers.cloudflare.com/rules/changelog/) and bot controls, when refreshing this page. Use the raw capture in [data/cloudflare-protection-defaults.json](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) to compare menu labels over time.

### Add WAF rules

In Cloudflare, open **Domains** > **your short domain** > **Security** > **Security rules** > **Security rules**. To add a custom rule, use **Create rule** or the **Show all rule types** menu, choose **Custom rules**, enter the rule name, click **Edit expression**, paste one expression, choose the action, then deploy. For rate limiting, use the **Rate limiting rules** row instead.

Cloudflare security rules run before the Worker. Use them for traffic that should never reach application code.

The expressions below use `dicai.re`; replace both hostnames with your short domain and `www` hostname before deploying.

<table>
  <thead>
    <tr>
      <th>Rule</th>
      <th>Rule type</th>
      <th>Action</th>
      <th>Expression</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Block scanner probes</td>
      <td>Custom rule</td>
      <td>Block</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and (
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
      <td>Block unexpected methods</td>
      <td>Custom rule</td>
      <td>Block</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and
not http.request.method in {"GET" "HEAD" "OPTIONS"}</code></pre>
      </td>
      <td>Allows only methods expected by the public redirect hostname.</td>
    </tr>
    <tr>
      <td>Challenge suspicious clients</td>
      <td>Custom rule</td>
      <td>Managed Challenge</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and
not cf.client.bot and
not starts_with(http.request.uri.path, "/_stats") and
not starts_with(http.request.uri.path, "/_tests") and
http.request.uri.path ne "/robots.txt"</code></pre>
      </td>
      <td>Exclude verified bots, protected operator paths, and `robots.txt`.</td>
    </tr>
    <tr>
      <td>Block unwanted AI crawlers</td>
      <td>Custom rule</td>
      <td>Block</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and
http.request.uri.path ne "/robots.txt" and (
  lower(http.user_agent) contains "applebot" or
  lower(http.user_agent) contains "chatgpt-user" or
  lower(http.user_agent) contains "claudebot" or
  lower(http.user_agent) contains "gptbot" or
  lower(http.user_agent) contains "perplexitybot"
)</code></pre>
      </td>
      <td>Use only for crawlers not covered by **Block AI bots**; keep `/robots.txt` reachable.</td>
    </tr>
    <tr>
      <td>Rate limit short-link candidates</td>
      <td>Rate limiting rule</td>
      <td>Block or challenge</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and
not cf.client.bot and
http.request.method in {"GET" "HEAD"} and
not starts_with(http.request.uri.path, "/_") and
http.request.uri.path ne "/robots.txt"</code></pre>
      </td>
      <td>Count repeated misses and scanner-like candidates, not successful redirects.</td>
    </tr>
  </tbody>
</table>

Paste and validate one complete expression at a time. Deploy rules disabled while tuning if traffic is already flowing, then enable them after checking Security Events.

### Decide crawler controls

In Cloudflare, use **Security** > **Settings** > **Block AI bots** for edge blocking, and use **Security** > **Settings** > **Manage your robots.txt** or **AI Crawl Control** for `robots.txt` signals.

Block AI bots is enforcement: Cloudflare blocks AI training crawlers before they reach the Worker. Managed `robots.txt` is a signal to crawlers: Cloudflare can publish a Content Signals Policy or AI-training disallow directives, but it changes the file visitors see at `/robots.txt`.

If the repository ships `robots.txt`, keep Cloudflare Managed robots.txt disabled. That makes the repository the source of truth and avoids Cloudflare replacing intentional directives.

Useful defaults:

- Allow `/robots.txt`
- Allow `/llms.txt` and `/llms-full.txt` only if you intentionally publish machine-readable context
- Block unwanted AI crawlers and AI assistants at Cloudflare
- Keep verified search engine crawlers allowed unless your instance is intentionally private
- Review Cloudflare Security Events after enabling the rule, because it will not appear in Worker analytics when blocked at the edge

At minimum, leave `/robots.txt` allowed so crawlers can read the published policy.

### Configure Rules and URL normalization

In Cloudflare, open **Domains** > **your short domain** > **Rules** > **Settings** > **Managed Transforms** for header transforms, then **Rules** > **Settings** > **URL Normalization** for URL normalization.

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

### Configure Network settings

In Cloudflare, open **Domains** > **your short domain** > **Network**.

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

### Keep caching conservative

In Cloudflare, open **Domains** > **your short domain** > **Caching** > **Configuration** for general cache settings, and **Caching** > **Cache Rules** if you need a specific rule.

Keep caching boring for a redirector:

- Leave dynamic redirect decisions to the Worker
- Let static assets under `build/` use the Worker and asset headers
- Keep Development Mode off except while actively debugging
- Do not add cache rules that cache redirect responses unless you have tested lifecycle states, schedules, analytics, and misses

### Review the right analytics surface

In Cloudflare, open **Domains** > **your short domain** > **Security** > **Analytics** for WAF, bot, and rate-limit events, **Analytics** > **Workers** for Worker infrastructure metrics, and **DNS** > **Analytics** for DNS diagnostics.

Use Cloudflare analytics and Security Events for infrastructure decisions:

- DNS, certificate, and TLS status
- Worker requests, errors, CPU time, wall time, and request duration
- WAF, rate limiting, bot, and AI crawler events
- Access login decisions for protected paths

Use vanityURLs server-side [Analytics](/docs/customize/analytics/) for application events such as pageviews, redirects, short-link misses, expand lookups, and normalized bot events that reach the Worker.

Traffic blocked by WAF, AI Crawl Control, Access, or rate limiting does not reach the Worker and should be reviewed in Cloudflare Security Events.

{{% /steps %}}
