# vanityURLs — round 24: Umami diagnostic cleanup + ops note

The diagnostic logging from round 23 did its job. Pipeline confirmed working end-to-end:

- ✓ Worker runs on every HTML request
- ✓ Both `UMAMI_WEBSITE_ID` and `UMAMI_ENDPOINT` reach the Worker as `env.*`
- ✓ Outgoing fetch to `https://cloud.umami.is/api/send` succeeds with 200
- ✓ Umami accepts events with real session tokens (not `{"beep":"boop"}`)
- ✓ Dashboard shows visitor with full attribution: Firefox / macOS / Desktop / Montreal, Canada
- ✓ Page views correctly recorded for `/en/` and `/fr/`

The earlier "less data than I'd expect" symptom was the **secrets-in-Build-not-runtime** misconfiguration. Cloudflare's dashboard has two places that look identical but have different scopes:

```
✓ Settings → Variables and Secrets          ← runtime, available as env.*
✗ Settings → Build → Variables and secrets  ← build-time only, NOT in env
```

The secrets had been in the Build section. The Worker code reads `env.UMAMI_WEBSITE_ID` at runtime, found it `undefined`, and silently skipped the entire `trackPageview()` function. Events from production traffic were being silently dropped at the Worker level — never even reaching Umami. Now that both secrets are in the runtime "Variables and Secrets" section as encrypted Secrets, events flow correctly.

## What's in this round

### 1. Diagnostic block removed

Round 23's `?diag-umami` console.log block (~30 lines, gated on URL param) is removed. It was verbose by design and had served its diagnostic purpose. Removing it:

- Cleans up the Observability tab (no more 8+ log lines per `?diag-umami` request)
- Slightly reduces per-request overhead on `?diag-umami` URLs (negligible but principle-correct)
- Removes the extra `await umamiResponse.text()` call that was reading the response body just to log it

### 2. Operations comment added

A documented warning at the top of `trackPageview()`'s env-check, so this gap doesn't bite future-you (or future-me) in 6 months. The comment explains:

- The two-places-named-the-same Cloudflare dashboard pitfall
- Where secrets MUST live (Settings → Variables and Secrets, runtime level)
- Where they MUST NOT live (Build section)
- Exact navigation path to set them correctly

The Worker still silently skips when secrets are missing (correct behavior for `wrangler dev` and similar), but now anyone debugging "why isn't analytics working" will find the answer in the code itself instead of having to repeat this diagnostic round.

## Files in this patch

| File | Change |
|---|---|
| `src/worker.mjs` | Removed `?diag-umami` block; added operations comment near env-check |

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round24.zip
git add -A
git commit -m "chore(analytics): remove diag-umami block; document secrets configuration"
git push
```

Or with the diff:

```bash
git apply ~/Downloads/vanityurls-round24.diff
```

## After deploy

The next time real human traffic hits your site:

- Each visit fires one event to Umami via `ctx.waitUntil`
- Bot traffic gets tagged `name="bot"` with `data.bot_name=Googlebot` (etc.) — visible in the **Events** tab in Umami
- 404 responses get tagged `name="404"` — also in Events tab
- UTM-tagged URLs (`?utm_source=newsletter`) get tagged `name="campaign"` with `data.utm_*` — also Events tab

Test that hitting `https://vanityurls.link/en/?diag-umami=test1` no longer produces `[diag] ...` log lines in the Observability tab — only the standard request invocation entry.

## What's done in this audit cycle (rounds 17-24)

- Tag term pages fixed (Hugo 0.146 lookup change)
- Showcase CSS scope tightened, trust card accuracy
- UTM capture in analytics, Mermaid self-hosted, CSP tightened
- Lighthouse Mobile Perf 67-90 → 91 across the board
- WCAG AA contrast: A11y 95 → 100
- Umami analytics confirmed working end-to-end

## Deferred queue

Still on the list:

1. **9 draft blog posts** — bucket and ship the publishable ones (especially `analytics.md` and `outliningEvolution.md` which now describe real architecture)
2. **Product repo (vanityURLs/vanityURLs) click tracking** — same Worker pattern for short-link redirects
3. **CSS inlining round** — only if you change your mind on Mobile Perf 95+
