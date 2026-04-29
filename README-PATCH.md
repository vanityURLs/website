# vanityURLs — round 20: Lighthouse fixes

Three fixes from the Lighthouse audit. The big one is a real bug that's been live for a while; the other two are smaller but worth knocking out.

## Headline numbers

Current Lighthouse mobile scores:

| Page | Mobile Perf | Desktop Perf |
|---|---|---|
| `/en/` | 90 | 100 |
| `/en/docs/getting-started/` | 77 | 99 |
| `/en/blog/introducing-v8s/` | 72 | 100 |
| `/fr/docs/cloudflare/` | 67 | 97 |
| `/en/showcase/` | 89 | 100 |

Desktop is great. Mobile has consistent render-blocking findings (2.5s–5.0s estimated savings). Same root cause on every page, fixed once in `head.html`.

## Fix 1 — Font preloads were never being emitted (the big one)

### What was wrong

`layouts/partials/head.html` lines 90–95:

```
{{/* ── Fonts ──────────────────────────────────────────────────
     Self-hosted from /fonts/ ...
<link rel="preload" href="/fonts/intervariable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/jetbrainsmono.woff2" as="font" type="font/woff2" crossorigin>
*/}}
```

The two `<link rel=preload>` tags were sandwiched **inside** a Hugo comment block (`{{/* ... */}}`). Hugo strips comments before rendering, so neither preload ever made it into the HTML.

This means: when a browser loads any page on the site, it discovers the font dependency only after the CSS finishes downloading and parsing. The fonts are then fetched, the page re-paints once they arrive, and we get the "delayed text render" pattern Lighthouse is flagging as render-blocking.

This bug has been live since the round-6 font self-hosting work. Round 6 added the preload tags but accidentally wrapped them in a comment block.

### How verified

Before fix:
```bash
curl -s https://vanityurls.link/en/ | grep -E 'rel=preload.*woff2'
# (nothing — preloads aren't there)
```

After fix:
```html
<link rel=preload href=/fonts/intervariable.woff2 as=font type=font/woff2 crossorigin>
<link rel=preload href=/fonts/jetbrainsmono.woff2 as=font type=font/woff2 crossorigin>
```

### Expected impact

This is the dominant cause of the mobile render-blocking finding. With preloads in place:

- Browser starts the font fetch in parallel with CSS download (instead of sequentially after CSS parses)
- LCP improves on every page
- Greatest absolute improvement on `/fr/docs/cloudflare/` (currently 67), where the 5-second render-blocking estimate was largest
- Could plausibly bring all mobile scores into the 85+ range

It won't be a silver bullet — the other render-blocking factor is the CSS bundle itself, which still has to download synchronously. But fixing the font discovery cascade is the cheapest, biggest win available.

## Fix 2 — Forced reflow in reading-progress bar

### What was wrong

`assets/js/app.js` reading-progress handler (line 437–439):

```js
var total = doc.scrollHeight - doc.clientHeight;
var pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
bar.style.width = Math.min(pct, 100) + '%';
```

The handler was attached directly to `scroll` events. Each scroll event triggers:

1. Read `scrollHeight`, `clientHeight`, `scrollY` (forces layout calculation)
2. Write `bar.style.width` (invalidates layout)

Read-then-write in the same synchronous handler triggers forced reflow because the browser has to recompute layout to give us the read values, then mark layout dirty again from the write. Repeat on every scroll tick (potentially 60+ per second on a smooth-scroll device).

Lighthouse flagged this on the blog page specifically because that's the only page with a reading-progress bar (it's wrapped in `if (bar)`).

### The fix

Wrap update logic in `requestAnimationFrame`:

```js
var ticking = false;
var update = function () {
  var doc   = document.documentElement;
  var total = doc.scrollHeight - doc.clientHeight;
  var pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
  bar.style.width = Math.min(pct, 100) + '%';
  ticking = false;
};
var onScroll = function () {
  if (!ticking) {
    window.requestAnimationFrame(update);
    ticking = true;
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
```

`scroll` events still fire as fast as the browser sends them, but `update` only runs once per animation frame (~16ms intervals). Reads happen in the rAF callback, batched with the next paint, so the browser doesn't have to recompute layout mid-scroll.

This pattern is the standard scroll-handler optimization. The `ticking` flag prevents queuing multiple rAFs for the same frame.

### Expected impact

- Eliminates the "Forced reflow" finding on the blog page
- Should resolve the "1 long main-thread task" finding (it's the same root cause)
- Smoother scroll on long blog posts (especially noticeable on lower-end mobile)
- No visible change otherwise — bar still tracks scroll position

## Fix 3 — Color contrast on home hero subtitle

### What was wrong

`layouts/index.html` line 28:

```html
<p class="text-xl text-gray-400 mb-10 max-w-2xl">
```

`text-gray-400` is a light gray. On the home page's light background it doesn't meet WCAG AA contrast (4.5:1 for normal text, 3:1 for large text — this is `text-xl` which qualifies as large, but `gray-400` on white still falls short).

The other `text-gray-400` uses on the same page (lines 67, 122, 136, 155) were paired with `text-gray-500 dark:text-gray-400` — the `gray-500` provides AA contrast in light mode, `gray-400` works in dark mode. Just the hero subtitle was missing the light-mode pairing.

### The fix

```html
<p class="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
```

`gray-600` on white is well above AA contrast. `gray-400` on dark-mode background remains. Visually nearly identical to before — slightly darker subtitle in light mode.

### Expected impact

- Accessibility score: 95 → 100 on `/en/`
- The other pages don't have this issue (their A11y is already 95–96 from other minor things)

## Files in this patch

| File | Change |
|---|---|
| `layouts/partials/head.html` | Closed the Hugo comment block before the preload tags so they actually emit |
| `layouts/index.html` | Hero subtitle uses `text-gray-600 dark:text-gray-400` |
| `assets/js/app.js` | Reading-progress handler uses `requestAnimationFrame` to batch reads/writes |

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round20.zip
git add -A
git commit -m "perf: emit font preloads, batch reading-progress writes, fix hero contrast"
git push
```

Or with the diff:

```bash
git apply ~/Downloads/vanityurls-round20.diff
```

## Validate after deploy

**Font preloads now emit:**
```bash
curl -s https://vanityurls.link/en/ | grep -E 'rel=preload.*woff2'
# Should show two preload links
```

**Hero subtitle has proper class:**
```bash
curl -s https://vanityurls.link/en/ | grep -oE '<p[^>]*text-xl[^>]*>' | head -1
# Should show: text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl
```

**Re-run Lighthouse on all 5 URLs.** Expected pattern:

- Mobile Performance: should jump 5–15 points across the board (font preload is the biggest single win)
- `/en/` Accessibility: 95 → 100 (hero contrast fixed)
- `/en/blog/introducing-v8s/`: forced-reflow finding gone, long task finding gone

If mobile performance is still below 85 on any page after this round, the next things to look at are the unused-CSS finding (~11 KiB) — would need either Tailwind purge tuning or critical-CSS inlining.

## What's NOT in this round

- **Reduce unused CSS (11–12 KiB):** Real but minor. Tailwind ships utility classes that aren't all used. Could be addressed by tightening the `tailwind.config.js` `content` glob or by introducing critical-CSS inlining for above-the-fold rules. Both are bigger work for ~12 KiB of savings on a ~30 KB total bundle. Defer until other rounds clear.
- **theme-init.js synchronous in `<head>`:** This is intentional — it has to run before paint to avoid a flash of light mode. 555 bytes uncompressed. Keeping it as-is.
- **Network dependency tree finding:** This is descriptive, not actionable on its own. The font preload fix shortens the dependency chain.
