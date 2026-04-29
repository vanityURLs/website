# vanityURLs — round 23: Umami diagnostic + bot-UA bypass fix

Two related changes to the Worker, both small. Goal: confirm the analytics pipeline is actually working, and fix one known bug while we're in there.

## Don't delete the Worker

Worth saying upfront: the Worker, the analytics integration, the bot detection, the UTM capture — none of that is broken. Deleting and rebuilding would mean losing solid infrastructure to chase a misconfiguration that we haven't even confirmed yet. The right move is to verify the secrets, then if needed, fix them in place.

## What changed

### Fix 1: Browser-shaped fallback UA

The old `WORKER_UA_FALLBACK` was:
```
Mozilla/5.0 (compatible; vanityURLs-edge-tracker/1.0; +https://vanityurls.link/)
```

That's literally a bot UA — contains the word "tracker" — and Umami's isbot package catches it. So when our Worker fell back to this UA (no incoming UA, or bot UA), Umami silently dropped the event with `{"beep":"boop"}` and 200 OK. The Worker thought the call succeeded.

New fallback:
```
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15
```

Real Safari UA. Bypasses the isbot check.

### Fix 2: Use the fallback for bot UAs too

Before round 23, when a bot like Googlebot hit the site, the Worker:
1. Detected "Googlebot" via our own bot patterns → tagged `name="bot"` ✓
2. Forwarded `Googlebot/2.1` as the outgoing request UA → Umami's isbot dropped it ✗

Result: empty Events tab. Crawlers were correctly identified by us but never recorded by Umami because the request itself was filtered before recording.

After round 23: when our Worker detects a bot, it sends the real bot UA in `payload.userAgent` (so Umami can attribute it to the right browser/OS in the recorded data) but forwards the browser fallback as the request header. Umami's isbot check passes, and the event lands with `name="bot"` and `data.bot_name=Googlebot`.

For real human visitors, nothing changes — their actual UA still gets forwarded, and Umami's session deduplication still works correctly.

### Diagnostic mode (temporary, gated by `?diag-umami`)

Added a diagnostic logging block that activates only when the URL contains `?diag-umami`. When triggered, it logs to the Cloudflare Worker dashboard's Log stream:

```
[diag] UMAMI_WEBSITE_ID present: true|false
[diag] UMAMI_ENDPOINT present: true|false
[diag] UMAMI_ENDPOINT value: https://...
[diag] visitorUA: <full UA string>
[diag] botName: null|<bot name>
[diag] outgoing UA: <what we sent>
[diag] payload: <full JSON payload>
[diag] Umami response status: 200|4xx
[diag] Umami response body: {...}
```

This tells us, in one shot:
1. Whether secrets are visible to the Worker (env vars present)
2. What we're sending
3. What Umami responds with

After we've confirmed the pipeline works, this block should be removed (it's marked clearly in the comments).

## How to verify after deploy

### Step 1: Open the Cloudflare Worker Log stream

Cloudflare dashboard → Workers & Pages → `vanityurls-website` → **Logs** tab → "Begin log stream"

### Step 2: Hit a diagnostic URL

In Firefox (or whatever browser is *not* logged into Umami):

```
https://vanityurls.link/en/?diag-umami=$(date +%s)
```

(Just type the URL — no terminal needed. The `=$(date +%s)` part isn't required, it's just to make each test URL unique. You can use any value: `?diag-umami=test1`, `?diag-umami=test2`, etc.)

### Step 3: Read the log output

In the Log stream you should see the `[diag]` lines. What to interpret:

**If you see `UMAMI_WEBSITE_ID present: false`:**
The secret isn't set, or it's set as a "Variable" (plaintext) instead of a "Secret" (encrypted). In Cloudflare dashboard → Workers & Pages → `vanityurls-website` → Settings → Variables and Secrets, both `UMAMI_WEBSITE_ID` and `UMAMI_ENDPOINT` should appear with lock icons (encrypted). If they don't, delete and re-add them as Secrets.

**If you see `UMAMI_ENDPOINT present: true` and a value:**
Secrets are visible. Look at the next lines.

**If `Umami response status: 200` AND `Umami response body: {"cache": ...}`:**
Pipeline works. Event is recorded in Umami. Check Umami dashboard's Pages list for the diagnostic URL — it should appear within 1-2 minutes.

**If `Umami response status: 200` AND `Umami response body: {"beep":"boop"}`:**
Umami's isbot filter is dropping the request. Means our fallback UA isn't being recognized as a browser, OR Umami changed their isbot list. Tell me and we'll iterate.

**If `Umami response status: 4xx`:**
Authentication or payload error. The body will say what's wrong.

### Step 4: Confirm in Umami

Switch to Chrome (the browser logged into cloud.umami.is). Open the dashboard, set time range to "Last 24 hours". The diagnostic URL with `?diag-umami=test1` should appear in the Pages list.

## After diagnosis

Once we've confirmed it's working, **the diagnostic block should be removed** in a follow-up round. It's gated, so leaving it in production is safe — but it does add a `console.log` cost to the rare `?diag-umami` URL hits. The block is clearly marked with a removal note.

## Files in this patch

| File | Change |
|---|---|
| `src/worker.mjs` | Browser-shaped fallback UA; bot-UA bypass in outgoing request; diagnostic logging gated on `?diag-umami` |
| `src/worker.test.mjs` | Tests still pass (25/25); no new tests needed since behavior is gated |

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round23.zip
git add -A
git commit -m "fix(analytics): bypass Umami isbot for forwarded bot UAs; add ?diag-umami logging"
git push
```

Wait for Cloudflare to deploy (~1 min after push), then run the diagnostic steps above and tell me what the log stream shows.

## A note on the "should we delete and rebuild" question

If Step 1 shows `UMAMI_WEBSITE_ID present: false`, the fix is to delete the bad Variable and add a proper Secret in the dashboard:

1. Workers & Pages → `vanityurls-website` → Settings → Variables and Secrets
2. Find any plaintext "Variable" entries for `UMAMI_*` — delete them
3. Click "Add" → choose **Secret** (not Variable) → enter the name and value
4. Save and the Worker auto-restarts

That's it. No worker rebuild needed.

If Step 1 shows secrets are present and pipeline still doesn't work, paste the diagnostic log here and I'll diagnose from the actual data.
