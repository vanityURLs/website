# Analytics

The site uses [Umami](https://umami.is) for visitor analytics. Umami is free for up to 10,000 events/month on the free tier. Current usage is ~3,000 events/month → 30% of free quota. Even at 5x traffic, well within free for an open source project. Events are sent **server-side from the Cloudflare Worker** rather than from a client-side JavaScript snippet. This document covers why, how it works, and how to debug it when something goes wrong.

This is a privacy-conscious site:

- **No cookies** are set, ever
- **No client-side storage** (no `localStorage`, no `sessionStorage`)
- **No client-side JavaScript** for tracking
- **No fingerprinting**. The Worker uses the visitor's user-agent string (which the browser sends anyway) and a truncated IP for coarse geolocation
- **The visitor's full IP address is never sent to Umami.** The Worker truncates it before forwarding: IPv4 to `/24` (last octet zeroed, e.g., `203.0.113.42` → `203.0.113.0`), IPv6 to `/48` (last 5 groups zeroed, e.g., `2001:db8:1234:5678:...` → `2001:db8:1234::`). This keeps country-level geolocation accurate while removing the precision needed to identify a specific household. The same anonymization pattern is used by Matomo, Plausible, and other privacy-focused analytics tools.
- **Sessions are derived deterministically** by Umami from `(truncated-IP + user-agent + website-id)`, salted by Umami. The truncation means visitors on the same network (e.g., the same coffee shop or the same office) will share session attribution rather than being individually tracked. Same visitor on different days gets a new session, Umami doesn't know they're the same person across days.

This is documented for visitors at `https://vanityURLs.link/en/privacy/` and `https://vanityURLs.link/fr/confidentialite/`. Let's keep those pages in sync with any operational changes.

**Why truncation rather than dropping the IP entirely?**

We considered dropping the IP entirely (sending no IP at all, just relying on Cloudflare's `cf-ipcountry` header for country-level geo) but rejected it because:

- Umami's session deduplication uses `(IP + UA + salt)` without any IP variation, two visitors using the same browser version would be merged into a single session, understating "Visitors" by potentially 30-50% on low-traffic days
- Dropping the IP doesn't actually improve privacy much over truncation, since the Worker still has the real IP from Cloudflare's `cf-connecting-ip` header; we can see it during request handling
- Truncation means the real IP exists for ~50ms of Worker execution and then is discarded, dropping means the same
- The legal and operational standard for "anonymized IP" in GDPR contexts is /24 truncation (IPv4) or /48 truncation (IPv6), dropping entirely is stricter than required.

## Why server-side?

Most analytics tools work by injecting a `<script>` tag into the page that runs in the visitor's browser. This is convenient, every page reload fires an event automatically but has trade-offs.

| Concern | Client-side | Server-side (this site) |
|---|---|---|
| Visible in DevTools | Yes — anyone can see the script and the request | No — the visitor's browser never knows analytics are running |
| Third-party script | Yes (loads `umami.js`) | No — the Worker is first-party |
| Cookies | Sometimes | Never, no client storage at all |
| Ad blockers | Block aggressively | Don't see anything to block |
| CSP impact | Requires `script-src` allowlist for the analytics domain | None, all asset CSP rules can stay strict |
| Bot filtering | Bots that don't run JS aren't counted (often desired, but inconsistent) | Bots are counted but TAGGED, so you can filter intentionally |

VanityURLs's audience cares about privacy and minimalism, server-side fits better. The trade-off is that the Worker has to handle the analytics call itself, which is what the rest of this doc explains.

## How it works

`src/worker.mjs` runs for every HTML request, assets bypass the Worker by configuration in `wrangler.toml`. 

The flow:
1. Visitor requests a page such as `https://vanityURLs.link/en/docs/getting-started/`
2. Cloudflare routes the request through the Worker
3. Worker fetches the asset (`/en/docs/getting-started/index.html`) from the static assets binding
4. Before returning the response to the visitor, Worker calls `ctx.waitUntil(trackPageview(...))`, this fires the analytics call in the background, without blocking the visitor's response
5. `trackPageview()` builds an Umami payload and POSTs to `https://cloud.umami.is/api/send`
6. Umami records the event with attribution: visitor's user-agent (which it parses for browser/OS), Cloudflare-provided geolocation, language preference, referrer, etc.
7. Visitor gets their HTML response, immediately. They never know the analytics call happened.

`ctx.waitUntil` is the key primitive: it lets the Worker return the response to the visitor right away while continuing to do work in the background. The visitor doesn't pay any latency cost.

## What gets tracked

Every HTML request fires one event. The event payload includes:

- **URL** — full path including query string (UTM params are stripped to a separate event field, see below)
- **Hostname** — `vanityurls.link`
- **Language** — visitor's `Accept-Language` header (typically `en-US`, `en-CA`, `fr-CA`, etc.)
- **Referrer** — where the visitor came from
- **User-agent** — full UA string, used by Umami to derive Browser/OS/Device

Some events get a `name` attribute set, which makes them appear in the **Events** tab in addition to **Pages**:

| Event name | When it fires |
|---|---|
| (none, plain pageview) | Default for normal HTML requests |
| `404` | When the response status is 404 (page not found) |
| `bot` | When the user-agent matches one of 24 known bot patterns (Googlebot, Bingbot, AhrefsBot, etc.). The actual bot identity is in `data.bot_name`. |
| `campaign` | When the URL has any `utm_*` query parameter. The UTM values are stripped from the URL and surfaced as `data.utm_*` event fields. |

Plain pageviews are pageviews. The other three are also pageviews under the hood — they still update the Pages chart — but they get tagged so you can find them quickly in the Events tab.

## UTM capture (campaign tracking)

When someone visits `https://vanityurls.link/en/?utm_source=newsletter&utm_medium=email&utm_campaign=launch`, the Worker:

1. Parses the URL
2. Extracts the five standard Google UTM parameters: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
3. Strips them from the URL (so the recorded page is just `/en/`, not the polluted version)
4. Sends a single event with `name: "campaign"` and `data.utm_source: "newsletter"`, `data.utm_medium: "email"`, `data.utm_campaign: "launch"`

Why strip them? Because if you don't, the Pages tab in Umami fragments into hundreds of `/en/?utm_source=...` variants, none of which are actually different pages. The single `/en/` aggregate is more useful, and the campaign attribution is preserved as event data.

To see campaign performance: Umami dashboard → **Events** tab → filter by name `campaign` → click an event → see the breakdown by `utm_source`, etc.

## Bot filtering

The Worker maintains a list of 24 known bot user-agent patterns (Googlebot, Bingbot, AhrefsBot, SemrushBot, GPTBot, ClaudeBot, etc.). When a request matches one of these, the event still fires but with `name: "bot"` and `data.bot_name: "Googlebot"`.

This is different from how most analytics tools handle bots:

- **Most tools**: drop bot traffic at ingestion time. You never see it. Your numbers are "clean" but you've lost the signal that crawlers are visiting you.
- **This site**: bot events ARE recorded. They just get tagged. The default Pages view shows everything (humans + bots mixed together); to see just humans, filter to events where `name` is null or != "bot".

Why? Two reasons. First, bot traffic IS useful data — knowing how often Googlebot crawls your site is a real signal for SEO health. Second, the bot list is curated and conservative; it doesn't catch every bot, and tagging is more honest than pretending bots don't exist.

### A bot detection caveat

Umami itself has a bot filter using the `isbot` package. If the Worker forwards a bot user-agent to Umami's `/api/send` endpoint, Umami's `isbot` filter drops the request before recording it (returns 200 with `{"beep":"boop"}`).

The Worker handles this by sending **two different user-agents**:

- The **outgoing request UA** (in the HTTP `User-Agent` header) is always a real-looking browser UA: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 ...`. This bypasses Umami's `isbot` filter.
- The **payload UA** (in `payload.userAgent`, in the JSON body) is the visitor's actual UA, including bot UAs. Umami reads this AFTER the `isbot` check, so it preserves accurate browser/OS attribution.

This is what makes bot tagging actually work end-to-end. Without this trick, bot events would be detected by the Worker, sent to Umami, and silently dropped at Umami's gate.

## Diagnostic mode

When something looks wrong (events missing, dashboard empty, weird counts), the Worker has an optional diagnostic mode:

```js
// In src/worker.mjs, inside trackPageview():
const diagMode = url.searchParams.has("diag-umami");
if (diagMode) {
  console.log("[diag] UMAMI_WEBSITE_ID present:", !!env.UMAMI_WEBSITE_ID);
  console.log("[diag] UMAMI_ENDPOINT present:", !!env.UMAMI_ENDPOINT);
  console.log("[diag] UMAMI_ENDPOINT value:", env.UMAMI_ENDPOINT);
  console.log("[diag] visitorUA:", visitorUA);
  console.log("[diag] botName:", botName);
  console.log("[diag] outgoing UA:", outgoingUA);
  console.log("[diag] payload:", JSON.stringify(payload));
}
```

This block is currently **removed** from production. To re-add it for debugging:

1. Restore the block (look at git log if you need the exact text)
2. Also add the response logging right after the `fetch()` call:
   ```js
   if (diagMode) {
     const responseText = await umamiResponse.text();
     console.log("[diag] Umami response status:", umamiResponse.status);
     console.log("[diag] Umami response body:", responseText);
   }
   ```
3. Deploy
4. In any browser, visit `https://vanityurls.link/en/?diag-umami=test1` (the value after `=` doesn't matter, it's just to make each test URL unique)
5. In Cloudflare dashboard → Workers & Pages → `vanityurls-website` → **Observability** tab → find the request and expand it → you'll see the `[diag] ...` lines

What the output tells you:

| Diag output | What it means |
|---|---|
| `UMAMI_WEBSITE_ID present: false` | Secret isn't reaching the Worker. Check Variables and Secrets at runtime level (NOT Build level). See `HOSTING.md`. |
| `UMAMI_ENDPOINT value: undefined` | Same as above. |
| `Umami response status: 200` and body has `cache` and `sessionId` | Pipeline working. Event recorded. |
| `Umami response body: {"beep":"boop"}` | Umami's `isbot` filter rejected the request. The outgoing UA isn't passing as a real browser. Check `WORKER_UA_FALLBACK` in `worker.mjs`. |
| `Umami response status: 401` or `403` | The website ID is wrong, or the endpoint is wrong. Verify both in the Umami dashboard. |
| `Umami response status: 4xx` other | Look at the body for an error message. Usually means the payload structure broke. |

After confirming what's wrong, **remove the diagnostic block again before deploying to production**. Leaving it in is harmless but adds 8+ log lines per `?diag-umami` request, which clutters the Observability tab.

## Reading the dashboard

Umami Cloud's dashboard at `https://cloud.umami.is/dashboard/<website-id>`. Three sections you'll use most:

### Overview tab

Top-level metrics — visitors, visits, views, bounce rate, average visit duration. The pageview chart shows trend over the selected time range.

The **Pages** card shows the top URL paths. Note: query strings are stripped from this view (so `/en/?diag-umami=test1` shows up as just `/en/`), but they ARE preserved in the raw event data.

### Events tab

Lists every named event (anything with a `name` attribute set). For this site, that means:
- `campaign` events with their UTM breakdown
- `bot` events with their bot name
- `404` events showing which non-existent URLs are being requested

This is where you find specific behaviors. The Pages tab is for "what's popular"; Events is for "what's happening."

### Sessions tab

Per-visitor breakdown: one row per session with browser, OS, device, location, total visits/views, last seen. Useful for verifying that a specific test (like your own visit from Firefox) actually got recorded with the right attribution.

## Troubleshooting

### "I deployed but no events show up"

Most likely: secrets are in the wrong place. Hit `?diag-umami` to confirm. See `HOSTING.md` section on Variables and Secrets.

### "Some events show up but the count seems low"

Check the time range. Umami Cloud's dashboard defaults to "Last 24 hours" but tabs may have inconsistent ranges. Expand to "Last 7 days" and recount.

Also: ad blockers don't affect this site (server-side tracking) but if you're testing from a browser logged INTO Umami (i.e., the same browser you use to view the dashboard), Umami may filter your own traffic. Use a different browser for testing — for this project, Chrome is the Umami admin browser and Firefox is the testing browser.

### "Bot count looks high"

That's correct, not a bug. Crawlers visit constantly. The "real human" view is in the Events tab → filter where `name` is null. To make Pages-tab numbers reflect just humans, you'd need an upstream filter (Umami doesn't currently support this in the UI).

### "Events show up but `data.utm_*` is empty"

The visitor's URL didn't have UTM parameters, or the parameters weren't the standard `utm_source`/`utm_medium`/`utm_campaign`/`utm_term`/`utm_content`. Custom UTM-like params (e.g., `gclid`, `fbclid`) aren't captured by this Worker — the spec is the five Google standards.

### "Worker deployed but `Observability` tab is empty"

Workers Logs needs to be **enabled**: Cloudflare dashboard → Workers & Pages → `vanityurls-website` → Settings → **Observability** → toggle **Workers Logs** to Enabled. After enabling, only NEW requests are captured.
