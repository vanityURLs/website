---
aside: false
title: "Analytics"
description: "Configure server-side analytics for vanityURLs redirects, misses, bots, lookups, and pageviews."
aliases:
  - /docs/analytics/
  - /docs/server-side-analytics/
weight: 20
---

Use server-side analytics when you want redirect and page activity without adding browser tracking JavaScript. vanityURLs sends analytics from the Worker with `ctx.waitUntil()`, so provider failures should not delay redirects.

For provider selection and privacy tradeoffs, read [Choosing privacy-friendly analytics for short links](/blog/choosing-privacy-friendly-analytics-for-short-links/). For event names, provider payloads, IP handling, and blocked-traffic behavior, read [Analytics](/docs/reference/analytics/).

{{< mermaid >}}
flowchart LR
  A["Request<br/>reaches<br/>Worker"] --> B{"Request type"}
  B -->|"valid short link"| C["Redirect<br/>response"]
  C --> D["redirect event"]
  B -->|"valid local page"| E["Public page<br/>response"]
  E --> F["pageview event"]
  B -->|"unknown slug"| G["404 page"]
  G --> H["short-link-miss<br/>event"]
  B -->|"lookup"| I["Lookup response"]
  I --> J["pageview event"]
  D --> K["ctx.waitUntil<br/>analytics send"]
  F --> K
  H --> K
  J --> K
  K --> L["Umami or Fathom"]
{{< /mermaid >}}

{{% steps %}}

### Decide whether to enable analytics

Leave analytics disabled during the first setup unless you already know what question the reports need to answer. A working redirector with no analytics is a valid production choice.

Enable analytics when you need to measure campaign links, printed QR codes, launch traffic, old-link usage, lookups, or realistic missing-link activity.

### Choose a provider

Set `ANALYTICS_PROVIDER` in `wrangler.toml`.

| Value          | Use when                                                  |
| -------------- | --------------------------------------------------------- |
| `disabled`     | You do not want vanityURLs to send analytics events       |
| `umami`        | You want structured event properties in Umami             |
| `fathom`       | You want Fathom pageviews and named events                |
| `umami,fathom` | You are migrating providers or comparing both temporarily |

{{< callout type="warning" title="Keep dual collection temporary" >}}
Do not leave dual-provider collection enabled longer than needed; it doubles collection traffic.
{{< /callout >}}

### Configure analytics solution

Configure either Umami or Fathom in `wrangler.toml`.

For Umami, configure the provider, endpoint, website ID, and IP mode:

```toml
[vars]
ANALYTICS_PROVIDER = "umami"
UMAMI_ENDPOINT = "https://cloud.umami.is/api/send"
UMAMI_WEBSITE_ID = "<umami website id>"
UMAMI_GEO_IP_MODE = "truncated"
```

{{< callout type="tip" title="Prefer less location detail" >}}
For a public privacy-first deployment, use `truncated` or `none` for `UMAMI_GEO_IP_MODE` unless you have a specific operational need for full geo reporting.
{{< /callout >}}

OR

For Fathom, configure the provider, site ID, and collection endpoint:

```toml
[vars]
ANALYTICS_PROVIDER = "fathom"
FATHOM_SITE_ID = "<fathom site id>"
FATHOM_ENDPOINT = "https://cdn.usefathom.com/"
```

The Worker does not need the Fathom management API key for collection. Use secrets only for provider API keys needed by local helper scripts.

### Keep edge protection in front

Requests blocked by Cloudflare before the Worker do not emit vanityURLs analytics events. Review WAF, rate limiting, bot, and AI crawler decisions with [Network protection](/docs/customize/network-protection/), and Access decisions with [Access control](/docs/customize/access-control/).

Treat Cloudflare network controls and the runtime blocklist as analytics quota protection, not only as security features.

### Verify locally

Before deployment, run:

```bash
npm run smoke:analytics
```

The smoke test builds the instance and intercepts analytics calls locally. It verifies the event path without sending data to the provider.

### Verify after deployment

1. Visit `https://v8s.link/lookup` and confirm pageviews with the analytics dashboard
2. Visit a valid short link; confirm a `redirect` event
3. Visit a realistic missing slug; confirm a `short-link-miss` event
4. Visit `/file.php`; confirm it is blocked without a miss event
5. Check Workers Logs for umami or fathom tracking failed

Provider dashboards can lag. Use Workers Logs first when debugging ingestion errors.

{{% /steps %}}
