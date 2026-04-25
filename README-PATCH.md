# vanityURLs — round 13: privacy-first server-side analytics

Adds an edge Worker that emits a Umami pageview event for every HTML page request, without any client-side JavaScript. Asset requests bypass the Worker entirely and remain billed as free static-asset reads.

## Design

**HTML page request (`/en/docs/`):**
1. Cloudflare's edge receives the request.
2. wrangler.toml's `assets.run_worker_first = ["/*", "!/js/*", ...]` matches — Worker runs.
3. `src/worker.js`:
   - Delegates to `env.ASSETS.fetch(request)` — Cloudflare serves the `.html` bytes with the `_headers` rules applied (CSP, cache-control, etc.).
   - Checks the response: Content-Type `text/html` and status 200 or 404?
   - If yes → `ctx.waitUntil(trackPageview(...))` fires a background POST to Umami. Response is already flushed; analytics never blocks.
   - Returns the original response unchanged.

**Asset request (`/css/main.abc123.css`):**
1. Negative pattern `!/css/*` excludes the path — Worker does not run.
2. Asset handler serves the CSS with `_headers` applied. Billed as a free static-asset read.

## What lands at Umami

```json
{
  "type": "event",
  "payload": {
    "hostname": "vanityurls.link",
    "language": "fr-CA",
    "referrer": "https://google.com/",
    "url": "/en/docs/getting-started/",
    "website": "<UMAMI_WEBSITE_ID>",
    "userAgent": "Mozilla/5.0 (...)",
    "ip": "203.0.113.42"
  }
}
```

For 404s, payload also includes `"name": "404"` so you can filter these out of pageview charts in Umami.

We pass `userAgent` and `ip` because Umami uses them for browser/OS/device detection and country derivation. Without overrides, every visitor would be tagged as "some Cloudflare server in Chicago." Umami hashes IPs rather than persisting them.

## Required secrets

```bash
wrangler secret put UMAMI_WEBSITE_ID
# Paste the UUID from the Umami dashboard → Settings → Websites

wrangler secret put UMAMI_ENDPOINT
# Paste: https://cloud.umami.is/api/send
```

For local `wrangler dev`, create `.dev.vars` (already gitignored):

```
UMAMI_WEBSITE_ID=deadbeef-...
UMAMI_ENDPOINT=https://cloud.umami.is/api/send
```

If either secret is missing, the Worker still serves pages correctly — it just skips the analytics call. Local dev won't pollute production stats.

## Files in this patch

| File | Change |
|---|---|
| `src/worker.js` | **New** — edge Worker (138 lines) |
| `src/worker.test.js` | **New** — 10 Node-runnable smoke tests |
| `wrangler.toml` | Added `main`, `assets.binding`, selective `run_worker_first` patterns |
| `package.json` | Added `type: module` + `test` script |
| `.gitignore` | Added `.dev.vars` / `.dev.vars.*` |
| `README.md` | Documented the Worker layer, secrets setup, project tree |
| `content/privacy.en.md` | Rewrote — server-side analytics disclosed |
| `content/privacy.fr.md` | Matching FR rewrite |
| `content/security.en.md` | "No analytics" → "No client-side analytics" with Umami disclosure |
| `content/security.fr.md` | Matching FR update |

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round13.zip
git add -A
git commit -m "feat: privacy-first server-side analytics via Umami at the edge"
```

## Before deploy

1. Create the Umami site at cloud.umami.is → Settings → Websites. Copy the UUID.
2. Set both secrets via `wrangler secret put`.
3. Push.

If secrets aren't set, the Worker serves pages correctly but skips tracking. Safe default.

## Validate after deploy

```bash
curl -sI https://vanityurls.link/en/ | head
curl -sI https://vanityurls.link/logo.svg | head
curl -sI https://vanityurls.link/pagefind/pagefind.js | head
```

Load a few pages in browser, check Umami dashboard real-time view. Country should match your real location (from IP override), browser detected from UA override.

If nothing shows up, check `wrangler tail` and confirm `wrangler secret list` has both secrets.

## Local development

```bash
npm run build
wrangler dev
```

Open `http://127.0.0.1:8787/en/`. With `.dev.vars` set, events land in Umami; without, silently skipped.

## Rollback

```bash
# Quickest: unset secrets — Worker still serves pages, just no tracking
wrangler secret delete UMAMI_WEBSITE_ID

# Fuller: revert wrangler.toml main + assets.binding/run_worker_first
```
