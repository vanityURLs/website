---
aside: false
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

An unknown short-link domain can still receive serious scanner and bot traffic. Treat WAF rules, Cloudflare bot controls, AI crawler controls, and the runtime blocklist as quota protection for analytics, not only as security features. Traffic blocked before the Worker cannot spend Umami or Fathom collection capacity.

## Umami data model

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

Umami is the best fit when you want structured event properties in the analytics UI, because the Worker sends redirect, miss, expand, and bot metadata as event data.

## Fathom data model

Fathom receives provider-native collection requests from the Worker. Pageviews are sent as pageviews; redirect, miss, expand, and bot events are sent as named Fathom events.

Fathom request fields include:

- site ID
- page origin
- page path
- referrer
- selected query and campaign parameters
- generated client ID for the collection request
- event name for non-pageview events
- event payload for non-pageview events

Fathom event payloads include:

- event type
- slug
- target host
- effective state
- schedule label
- redirect status
- redirect error or expand result, when present
- country and colo from Cloudflare request metadata
- correlation ID
- requested path and query

Use Fathom when you want simple privacy-oriented traffic and event reporting without adding browser JavaScript. Use Umami when you need richer per-event filtering over custom properties.

## Provider limits

Provider limits are account- and product-specific, so verify the current vendor documentation and the plan attached to the instance before enabling high-volume collection.

For Fathom, the Worker uses the collection endpoint and does not need the management API key. Fathom's public API documentation currently says API requests count against monthly pageviews, with limits of 2,000 requests per hour on Sites and Events endpoints and 10 requests per minute on aggregations and currents. Treat Fathom pageviews and events emitted by the Worker as quota-bearing traffic, and watch the first 24 hours after launch for scanner noise.

For Umami Cloud, the Worker sends collection events to `/api/send`, not authenticated reporting queries. Umami documents that `/api/send` does not require an authentication token, but it must include a proper `User-Agent` header. Umami Cloud's API-key documentation currently limits API-key calls to 50 calls every 15 seconds. Treat reporting/helper calls and collection events as separate paths, then confirm the actual Cloud plan limits before launch.

Operationally:

- keep scanner probes, unexpected methods, and unwanted crawler families blocked before analytics
- do not rely on analytics provider dashboards to show edge-blocked traffic
- expect obscure domains to receive unsolicited probes
- check Workers Logs for `umami tracking failed` and `fathom tracking failed`
- pause analytics during an active bot incident if provider quota becomes the immediate risk

References: [Fathom API documentation](https://usefathom.com/docs/api-reference), [Umami `/api/send` documentation](https://umami.is/docs/api/sending-stats), and [Umami Cloud API-key documentation](https://umami.is/docs/cloud/api-key).

## IP mode

`UMAMI_GEO_IP_MODE` controls whether the Worker forwards `CF-Connecting-IP`:

| Value | Behavior |
|---|---|
| `full` | Sends the full visitor IP for more accurate geo reports |
| `truncated` or unset | Sends an anonymized IP |
| `none` | Omits IP override entirely |

For a public privacy-first deployment, use `truncated` or `none` unless you have a specific operational need for full geo reporting.

Fathom collection does not require forwarding `CF-Connecting-IP` from the Worker. The Worker sends provider-native Fathom requests with the visitor user agent when safe, and falls back to a generic Worker user agent for known bot traffic.

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
