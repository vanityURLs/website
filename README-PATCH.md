# vanityURLs — round 19: UTM capture + Mermaid self-hosting + tightened CSP + Lighthouse audit plan

Three substantive changes. Each independently valuable, but they reinforce each other: Mermaid self-hosted means CSP can drop the jsDelivr exception, which lets the trust card claim "no third-party scripts" again, which lets the security page claim no external requests. Clean security posture all the way through.

## Item 1 — UTM parameter capture in `worker.mjs`

### Before

`payload.url = url.pathname + url.search`. UTM params (`?utm_source=newsletter&utm_campaign=launch`) ended up buried in a single string. You couldn't filter Umami charts by `utm_source` or pivot by campaign.

### After

UTM params are stripped from `payload.url` and surfaced into Umami's `payload.data` as filterable dimensions. The standardized five Google params are recognized: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`. Other query params (`?ref=hn`, `?page=2`) pass through unchanged.

### Event routing

A new event type joins the existing trio:

| Status | Bot UA? | UTMs? | Sent to Umami as |
|---|---|---|---|
| 200 | No | No  | Pageview (no `name`) — counts in main chart |
| 200 | No | Yes | Event with `name="campaign"`, `data.utm_*` |
| 200 | Yes | No  | Event with `name="bot"`, `data.bot_name` |
| 200 | Yes | Yes | Event with `name="bot"`, `data` merges `bot_name` + `utm_*` |
| 404 | (any) | (any) | Event with `name="404"`, `data.utm_*` if any |

Why "campaign" is its own event name: pageviews can't carry `data` (Umami constraint). To attach UTMs as filterable dimensions, the record must be promoted to a named event. `"campaign"` is what marketers call this in every other analytics tool.

### Filtering campaign traffic in Umami

In the Umami dashboard:

- **Campaign traffic in pageview charts:** click Events → "campaign" → Properties → `utm_source` shows the breakdown.
- **All pageviews from a specific campaign:** Filters → "Event name = campaign" + "Property utm_campaign = launch".
- **Excluding campaign traffic from your headline pageview number:** by design, named events don't count in the pageview chart. So your "Visitors" number IS already excluding campaign-tagged traffic.

If you want a unified pageview chart that includes campaigns, the way to do that in Umami is the Reports tab.

### Tests

Round 19 adds 7 UTM-related test cases (25 total now, up from 18):

- UTMs strip from URL, populate data, promote to `name="campaign"`
- Non-UTM query params preserved (e.g. `?ref=hn` survives)
- UTM + bot: data merges, name stays "bot"
- UTM + 404: data captured, name stays "404"
- Empty UTM values (`?utm_source=`) ignored
- No query params: stays a plain pageview
- Only non-UTM params: stays a plain pageview (no false promotion to campaign)

Run with `npm test`.

## Item 2 — Mermaid self-hosted

### What changed

Mermaid v10.9.5's `mermaid.min.js` (3.3 MB minified, ~990 KB gzipped) is now vendored at `assets/js/mermaid.min.js`. It's loaded via Hugo Pipes' `resources.Get` + `Fingerprint`, producing a URL like `/js/mermaid.min.<hash>.js` with SRI integrity. Cached forever, browser revalidates only on hash change.

The CSP no longer references `https://cdn.jsdelivr.net`. From:

```
script-src 'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net
```

to:

```
script-src 'self' 'wasm-unsafe-eval'
```

Only `'wasm-unsafe-eval'` remains as a relaxation, required by Pagefind's WebAssembly search. No external script origins are allowed.

### Why we kept Mermaid even though no published page uses it

You preserved the diagram option for future docs. The integration is conditional (`{{ if .HasShortcode "mermaid" }}`), so the bundle ships ~3.3 MB to the build output but downloads zero bytes to users until you write `{{< mermaid >}}` in a page.

To upgrade Mermaid in the future:

```bash
npm pack mermaid@10 --pack-destination /tmp
tar -xzf /tmp/mermaid-*.tgz -C /tmp
cp /tmp/package/dist/mermaid.min.js assets/js/mermaid.min.js
git add assets/js/mermaid.min.js
git commit -m "chore: bump mermaid to <version>"
```

The fingerprint in the URL changes automatically; old cached versions are invalidated.

### Why Hugo Pipes vs. js.Build

`mermaid.min.js` is pre-minified and uses an IIFE wrapper with mixed module detection (UMD, AMD, global). esbuild (which Hugo's `js.Build` uses) can choke on this kind of pattern, and even if it succeeds, re-minifying is wasted work. We use `resources.Get | Fingerprint "sha256"` which:
- Doesn't try to parse the JS — treats it as opaque bytes
- Doesn't re-minify
- Computes a SHA-256 hash for fingerprinting AND SRI integrity in one pass

`mermaid-init.js` (your own init script) still goes through `js.Build` since it's small and benefits from minification.

## Item 3 — Trust card and security policy updated

### Trust card

Restored the stronger claim now that it's strictly accurate:

| Locale | Before (round 18) | After (round 19) |
|---|---|---|
| EN | "...no third-party trackers." | "...no third-party scripts." |
| FR | "...aucun traqueur tiers." | "...aucun script tiers." |

### Security policy pages

Two paragraphs in each language updated:

- **External-request paragraph:** rewrote from "the only external network request is to jsDelivr..." to "no external network requests are made... Mermaid loads from a self-hosted, fingerprinted bundle..."
- **CSP block:** removed `https://cdn.jsdelivr.net` from the documented `script-src`
- **CSP explanation:** rewrote from "External resources are limited to: jsDelivr CDN..." to "`'self'` everywhere — no external origins are allowed."

### Privacy policy pages

Re-read both EN and FR. Already accurately scoped to "no third-party analytics/tracking/advertising" — those claims were true even when Mermaid was on jsDelivr (jsDelivr was serving a library, not tracking). No changes needed.

## Item 4 — Lighthouse audit plan

A run-it-yourself document at `LIGHTHOUSE-AUDIT.md`. Covers:

- Five representative URLs to test (homepage, docs, blog, FR doc, showcase)
- Three ways to run (PageSpeed Insights, Chrome DevTools, CLI)
- Specific risks given recent changes (Worker latency, fonts, Mermaid bundle)
- Per-category scoring expectations and concern thresholds
- A scoring table to fill in for the commit notes

I can't run Lighthouse from this sandbox (no real browser, no network reach). After deploying round 19, run the audit yourself and we can react to specific findings if anything's below the floor thresholds.

## Files in this patch

| File | Change |
|---|---|
| `src/worker.mjs` | UTM extraction + capture (`extractUtm()`, updated `trackPageview`) |
| `src/worker.test.mjs` | +7 tests covering UTM behaviors (25 total) |
| `assets/js/mermaid.min.js` | **New** — vendored Mermaid 10.9.5 (3.3 MB) |
| `layouts/_default/baseof.html` | Mermaid `<script src>` now points at self-hosted Hugo Pipes resource |
| `static/_headers` | CSP `script-src` no longer references `https://cdn.jsdelivr.net` |
| `data/trust.en.yml` | "no third-party trackers" → "no third-party scripts" |
| `data/trust.fr.yml` | "aucun traqueur tiers" → "aucun script tiers" |
| `content/security.en.md` | CSP block + external-request paragraph updated |
| `content/security.fr.md` | Same in FR |
| `LIGHTHOUSE-AUDIT.md` | **New** — run-it-yourself audit guide |

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round19.zip
git add -A
git commit -m "feat: capture UTMs in analytics; self-host mermaid; tighten CSP"
git push
```

The patch is large because of the 3.3 MB `mermaid.min.js`. Git LFS isn't necessary — it compresses well and only changes when you upgrade Mermaid.

## Validate after deploy

**UTM capture:**
```bash
# Visit a URL with UTMs
curl -s "https://vanityurls.link/en/?utm_source=test&utm_campaign=round19" -o /dev/null

# Check Umami → Events → "campaign" → Properties
# Should see utm_source=test, utm_campaign=round19
```

**Mermaid self-hosting:**
```bash
# CSP no longer mentions jsdelivr
curl -sI https://vanityurls.link/en/ | grep -i content-security-policy
# Should NOT contain "cdn.jsdelivr.net"

# Mermaid is reachable on its self-hosted URL
# (Don't expect this to be live until you add a page with {{< mermaid >}})
```

**Lighthouse:**
Open `https://pagespeed.web.dev/`, paste each of the 5 URLs from `LIGHTHOUSE-AUDIT.md`. Capture scores. Flag anything below the floor thresholds.

## Note on next steps

If Lighthouse surfaces any specific issues, those become their own targeted rounds. Common candidates:
- **Image optimization** (responsive `srcset`, AVIF/WebP)
- **Critical CSS inlining** for above-the-fold render
- **Resource hints** (`<link rel=preload>` for critical assets, `<link rel=prefetch>` for likely next-pages)
- **Structured data** (`application/ld+json` for BlogPosting, Article schemas)

But run Lighthouse first — let real measurements guide the priority.
