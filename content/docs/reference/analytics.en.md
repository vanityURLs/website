---
aside: false
title: "Analytics reference"
description: "Server-side analytics events, provider payloads, IP modes, and blocked-traffic behavior in vanityURLs."
weight: 55
aliases:
  - /docs/reference/server-side-analytics/

---

vanityURLs analytics runs inside the Cloudflare Worker. It does not require browser tracking JavaScript, cookies, or a visitor account.

The Worker sends analytics with `ctx.waitUntil()`. Redirects and pages should continue responding even when the analytics provider is slow or unavailable.

## Configuration Fields

Configure analytics with Worker variables in `wrangler.toml` and Worker secrets when a helper script needs an API token.

| Field | Scope | Purpose |
|---|---|---|
| `ANALYTICS_PROVIDER` | Worker variable | `disabled`, `umami`, `fathom`, or `umami,fathom` |
| `UMAMI_ENDPOINT` | Worker variable | Umami collection endpoint, usually `https://cloud.umami.is/api/send` |
| `UMAMI_WEBSITE_ID` | Worker variable or secret | Umami website ID used for collection |
| `UMAMI_GEO_IP_MODE` | Worker variable | Controls whether the Worker forwards visitor IP information to Umami |
| `UMAMI_BOT_MODE` | Worker variable | Use `original` to keep original event names for known bots instead of normalizing them to `bot` |
| `FATHOM_SITE_ID` | Worker variable or secret | Fathom site ID used for collection |
| `FATHOM_ENDPOINT` | Worker variable | Fathom collection endpoint, usually `https://cdn.usefathom.com/` |
| `FATHOM_BOT_MODE` | Worker variable | Use `original` to keep original event names for known bots instead of normalizing them to `bot` |
| `FATHOM_API_TOKEN` | Local secret | Optional management API token for local helper scripts; not needed by the Worker for collection |

## Events

| Event | When it is sent |
|---|---|
| `pageview` | A static or status HTML page returns successfully |
| `redirect` | A short link resolves to a target |
| `short-link-miss` | A request looks like a short-link candidate but no slug matches |
| `expand` | The `/expand` page asks the Worker to inspect a slug through `POST /_analytics/expand` |
| `bot` | A known bot triggers an event and bot normalization is enabled |

Scanner probes matched by the runtime blocklist return a plain `404` before analytics. Common PHP and WordPress probes should not pollute miss metrics.

Requests blocked by Cloudflare before the Worker do not emit vanityURLs analytics events. Use Cloudflare Security Events and Cloudflare analytics for traffic blocked by Access, WAF, rate limiting, bot controls, crawler controls, DNS, or TLS policy.

## Umami Payload

Umami receives pageviews as native pageviews. Redirect, miss, expand, and normalized bot activity are sent as named events with structured event data.

Umami payloads include:

- website ID
- requested URL
- referrer
- first language tag from `Accept-Language`
- visitor user agent or a safe bot fallback user agent
- visitor IP according to `UMAMI_GEO_IP_MODE`

Non-pageview event data can include:

- event type
- slug
- target host
- effective lifecycle state
- schedule label
- redirect status
- redirect error or expand result, when present
- country and colo from Cloudflare request metadata
- correlation ID
- requested path and query
- bot family, when detected

## Fathom Payload

Fathom receives provider-native collection requests from the Worker. Pageviews are sent as pageviews; redirect, miss, expand, and bot activity are sent as named Fathom events.

Fathom request fields include:

- site ID
- page origin
- page path
- referrer
- selected query and campaign parameters
- generated client ID for the collection request
- event name for non-pageview events
- event payload for non-pageview events

Fathom event payloads can include:

- event type
- slug
- target host
- effective lifecycle state
- schedule label
- redirect status
- redirect error or expand result, when present
- country and colo from Cloudflare request metadata
- correlation ID
- requested path and query

## IP Mode

`UMAMI_GEO_IP_MODE` controls whether the Worker forwards `CF-Connecting-IP` to Umami.

| Value | Behavior |
|---|---|
| `full` | Sends the full visitor IP for more accurate geo reports |
| `truncated` or unset | Sends an anonymized IP |
| `none` | Omits IP override entirely |

Fathom collection does not require forwarding `CF-Connecting-IP` from the Worker. The Worker sends provider-native Fathom requests with the visitor user agent when safe, and falls back to a generic Worker user agent for known bot traffic.

## Provider Limits

Provider limits are account- and product-specific. Verify the current vendor documentation and the plan attached to the instance before enabling high-volume collection.

The Worker uses collection endpoints for runtime analytics. Treat management API keys, reporting APIs, helper scripts, and collection events as separate paths with separate limits and credentials.

References: [Fathom API documentation](https://usefathom.com/docs/api-reference), [Umami sending stats documentation](https://umami.is/docs/api/sending-stats), and [Umami Cloud API-key documentation](https://umami.is/docs/cloud/api-key).
