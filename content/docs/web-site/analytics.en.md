---
aside: false
title: "Website analytics"
description: "How vanityURLs.link sends privacy-conscious server-side analytics from the site Worker."
weight: 40
---

The website uses Umami for visitor analytics. Events are sent server-side from the Cloudflare Worker instead of through a browser JavaScript snippet.

## Privacy model

The website analytics setup is intentionally small:

- no analytics cookies
- no client-side analytics script
- no `localStorage` or `sessionStorage` for tracking
- no browser fingerprinting
- no full visitor IP address sent to Umami

The Worker truncates visitor IP addresses before forwarding analytics data: IPv4 to `/24` and IPv6 to `/48`. That preserves coarse geography while removing household-level precision.

{{< callout type="warning" title="Keep public privacy pages in sync" >}}
When analytics behavior changes, update the public privacy pages and this documentation together.
{{< /callout >}}

## Why server-side

| Concern | Browser analytics script | Worker-side analytics |
| ------- | ------------------------ | --------------------- |
| Third-party script | Required | Not required |
| Cookies or browser storage | Often present | Not used |
| CSP impact | Requires analytics script and network allowlists | No browser-side analytics exception |
| Ad blockers | Often block the script | Browser never makes the analytics request |
| Bot behavior | Depends on browser JavaScript execution | Worker can tag known bots deliberately |

The tradeoff is that analytics behavior lives in Worker code and needs tests.

## Request flow

{{< mermaid >}}
flowchart TD
  A[Visitor requests<br/>HTML page]
  B[Request reaches Worker]
  C[Worker fetches HTML]
  D[HTML response returns]
  E[Analytics runs<br/>in background]
  F[Umami records event]
  G[Static asset request]
  H[No analytics event]

  A --> B
  B --> C
  C --> D
  C --> E
  E --> F
  G --> H
{{< /mermaid >}}

HTML requests pass through `src/worker.mjs`, which uses `ctx.waitUntil(...)` to send analytics without delaying the visitor response. Static asset requests should not produce analytics events.

## Event names

| Event | When it appears |
| ----- | --------------- |
| Plain pageview | Normal HTML request |
| `404` | The generated response status is 404 |
| `bot` | The user agent matches a known crawler pattern |
| `campaign` | The URL contains standard `utm_*` parameters |

UTM parameters are stripped from the recorded page URL and moved into event data so the Pages view does not fragment into many query-string variants.

## Required configuration

| Variable | Location |
| -------- | -------- |
| `UMAMI_WEBSITE_ID` | Cloudflare runtime secret |
| `UMAMI_ENDPOINT` | `wrangler.toml` `[vars]` |

{{< callout type="warning" title="Use runtime secrets, not build-time secrets" >}}
Cloudflare has two similar-looking Variables and Secrets screens. The Worker only sees runtime variables in **Settings** > **Variables and Secrets**.
{{< /callout >}}

## Debugging

When events disappear:

1. Confirm the latest Worker deployed.
2. Confirm `UMAMI_WEBSITE_ID` is present as a runtime secret.
3. Confirm `UMAMI_ENDPOINT` points at the intended Umami endpoint.
4. Check Cloudflare **Workers Logs** for the HTML request.
5. Test from a browser that is not logged into the Umami dashboard.
6. Compare named events in Umami's **Events** tab before assuming Pages counts are wrong.

If diagnostic logging is temporarily added to `src/worker.mjs`, remove it before production cleanup. The logs can reveal operational details and add noise to every diagnostic request.

## Changing analytics behavior

When you change UTM handling, bot detection, payload shape, or privacy behavior:

1. Edit `src/worker.mjs`.
2. Add or update tests in `src/worker.test.mjs`.
3. Run `npm test`.
4. Run `npm run build`.
5. Deploy through the normal Git flow.
6. Watch Cloudflare Workers Logs after deployment.
