---
title: "Server-side analytics"
description: "Configure privacy-preserving server-side analytics for vanityURLs redirects, misses, bots, expand previews, and pageviews."
---

vanityURLs records analytics from the Worker, not from browser JavaScript. Redirects can be measured even when the visitor never loads an HTML page, and the public pages do not need client-side tracking scripts.

Analytics is non-blocking. The Worker sends events with `ctx.waitUntil()`, so redirect latency is not tied to Umami, Fathom, or another provider being available.

## Providers

Set one or more providers with `ANALYTICS_PROVIDER`:

```toml
[vars]
ANALYTICS_PROVIDER = "umami"
UMAMI_ENDPOINT = "https://cloud.umami.is/api/send"
UMAMI_WEBSITE_ID = "<umami website id>"
UMAMI_GEO_IP_MODE = "truncated"
```

```toml
[vars]
ANALYTICS_PROVIDER = "fathom"
FATHOM_SITE_ID = "<fathom site id>"
FATHOM_ENDPOINT = "https://cdn.usefathom.com/"
```

During a migration, send to both:

```toml
[vars]
ANALYTICS_PROVIDER = "umami,fathom"
```

For first-party Worker event storage, add the Analytics Engine binding in `wrangler.toml` and include Cloudflare as a provider:

```toml
ANALYTICS_PROVIDER = "umami,cloudflare"

[[analytics_engine_datasets]]
binding = "V8S_ANALYTICS"
dataset = "v8s_link_events"
```

Use secrets for provider API keys that are only needed by local helper scripts. The Worker does not need the Fathom management API key for collection.

## Events

| Event | When it is sent |
|---|---|
| `pageview` | A static or status HTML page returns successfully |
| `redirect` | A short link resolves to a target |
| `short-link-miss` | A request looks like a short-link candidate but no slug matches |
| `expand` | The `/expand` page asks the Worker to inspect a slug |
| `bot` | A known bot triggers an event and bot normalization is enabled |

Scanner probes matched by the runtime blocklist return a plain `404` before analytics. That keeps common probes such as PHP and WordPress paths out of miss metrics.

Requests blocked by Cloudflare before the Worker do not emit vanityURLs analytics events. Review WAF, rate limiting, Access, bot, and AI crawler decisions in Cloudflare Security Events or the relevant Cloudflare dashboard.

## Data model

Umami receives event properties such as:

- slug
- target host
- effective state
- schedule label
- redirect status
- country and colo from Cloudflare request metadata
- correlation ID
- requested path and query
- bot family, when detected

Fathom receives provider-native pageview and event requests with selected campaign/query parameters. Use Umami when you need per-event properties such as `slug`, `target_host`, or `effective_state`.

## IP mode

`UMAMI_GEO_IP_MODE` controls whether the Worker forwards `CF-Connecting-IP`:

| Value | Behavior |
|---|---|
| `full` | Sends the full visitor IP for more accurate geo reports |
| `truncated` or unset | Sends an anonymized IP |
| `none` | Omits IP override entirely |

For a public privacy-first deployment, use `truncated` or `none` unless you have a specific operational need for full geo reporting.

## Verification

Before deployment:

```bash
npm run smoke:analytics
```

After deployment:

1. Visit `/`, `/terms`, and `/expand`; confirm pageviews.
2. Visit a valid short link; confirm a `redirect` event.
3. Visit a realistic missing slug; confirm a `short-link-miss` event.
4. Visit `/file.php`; confirm it is blocked without a miss event.
5. Check Workers Logs for `umami tracking failed` or `fathom tracking failed`.

Umami can lag by a few minutes. Use Workers Logs first when debugging ingestion errors.

## Optional Cloudflare Analytics Engine

Workers Analytics Engine is a good backend for first-party aggregate reporting because it is designed for high-cardinality Worker events. Keep Umami or Fathom for public web analytics, and use Analytics Engine when you want a first-party reporting layer inside the protected admin dashboard.

For private reports, protect the dashboard path with Cloudflare Access and keep the Worker fail-closed when `CF_ACCESS_AUD` is not configured.

## References

- [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/)
- [Write to Analytics Engine from Workers](https://developers.cloudflare.com/workers/examples/analytics-engine/)
