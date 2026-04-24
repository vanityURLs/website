# vanityURLs — round 5: CSP hardening (scripts-only)

Generated: 2026-04-24

Standalone follow-up to the CSP-WASM fix. This round removes `'unsafe-inline'` from the `script-src` directive. `style-src` still has `'unsafe-inline'` — that's intentional per our earlier conversation (style-src inline is a much lower risk than script-src and keeping it avoids a larger refactor of the inline `style="..."` attributes).

## What changed

### Before
`script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net`

### After
`script-src 'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net`

The removal of `'unsafe-inline'` means **any injected `<script>` or inline event handler is blocked by the browser**. Every piece of JS on the site now comes from an external file with a SubResource Integrity (SRI) hash, or from an inert `<script type="application/json">` data block (which isn't executable).

## Architecture

### New JS assets (3 files)
- **`assets/js/theme-init.js`** (~300 bytes) — sets the `dark` class on `<html>` before `<body>` paints, to avoid a light-mode flash. Loaded synchronously in `<head>` via an SRI-pinned `<script>`.
- **`assets/js/app.js`** (~11 KB) — all client JS: theme toggle, mobile menu, anchor links, copy-to-clipboard, search modal with Pagefind, TOC scroll-spy, header dropdown keyboard nav, sidebar keyboard nav, showcase filter, blog reading-progress bar, blog copy-link, code-shortcode copy button, tabs shortcode. Loaded with `defer`.
- **`assets/js/mermaid-init.js`** — mermaid diagram setup. Only loaded on pages where `{{< mermaid >}}` is used.

All three are processed through Hugo Pipes: `resources.Get` → `js.Build` (minified) → `resources.Fingerprint` → content-addressed filename + SRI integrity hash.

### i18n passed via inert JSON
The previous inline `<script>` blocks used Hugo template interpolation like `{{ i18n "copy_code" | jsonify }}`. Externalizing the scripts means app.js needs those strings at runtime. They're passed via:

```html
<script id="app-config" type="application/json">{"i18n":{"copy_code":"...",...}}</script>
```

`type="application/json"` is not executable JS — the browser doesn't run it, so CSP doesn't care. `app.js` reads it with `document.getElementById('app-config').textContent`.

### Inline event handlers removed (5 sites)
| File | Before | After |
|---|---|---|
| `layouts/partials/header.html` | `onclick="toggleTheme()"` (×2) | `data-action="toggle-theme"` |
| `layouts/docs/single.html` | `onchange="window.location=this.value"` | `data-action="navigate-on-change"` |
| `layouts/showcase/list.html` | `onclick="filterShowcase(this, '...')"` (×2) | `data-filter="..."` only |

Event binding happens in `app.js` via `addEventListener`.

### Inline `<script>` blocks removed (6 sites)
| File | What moved |
|---|---|
| `layouts/_default/baseof.html` | 4 inline blocks → `theme-init.js`, `app.js`, `mermaid-init.js` |
| `layouts/showcase/list.html` | `filterShowcase()` → `app.js` |
| `layouts/blog/single.html` | Progress bar + copy-link → `app.js` |
| `layouts/shortcodes/code.html` | Copy button handler → `app.js` |
| `layouts/shortcodes/tabs.html` | Tab switching (per-instance) → `app.js`, container discovery by `[data-tabs]` |

`baseof.html` went from **414 lines to 58 lines**.

Inline `<script type="application/ld+json">` blocks in `layouts/partials/jsonld.html` are untouched — they're data, not executable JS. CSP allows them regardless of `script-src` because browsers don't execute that content type.

## Applying

No deletions this round — just file additions and replacements.

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o /path/to/vanityurls-round5.zip
```

If your `.gitignore` doesn't already allow `assets/js/`, you may need to stage explicitly:

```bash
git add assets/js/
```

## Validation

After deploying:

1. **Search works** — ⌘K, type anything, results render.
2. **Theme toggle** — moon/sun button flips, state persists across reloads, no flash on page load.
3. **Mobile menu** — hamburger icon opens/closes.
4. **Copy buttons** — every code block gets one; hover, click, icon flips to checkmark briefly.
5. **Showcase filter** — tag buttons filter cards, active state tracks.
6. **Blog progress bar** — scroll a blog post, the thin bar fills.
7. **DevTools Console** — zero CSP violation reports. Any `"Refused to execute inline script because it violates the following Content Security Policy directive"` means I missed a spot.

## What didn't change

- `style-src 'unsafe-inline'` stays — there are 4 inline `style="..."` attributes using Hugo variable interpolation (per-page brand colors on showcase cards, progress-bar `width:0%`, hero background). Refactoring them would add another round of work for a minor security gain.
- `cdn.jsdelivr.net` stays in `script-src` — mermaid CDN. Could be pinned with SRI on the mermaid `<script>` itself if you want to go further, but you'd then have to bump the hash manually on every mermaid version upgrade.
- `'wasm-unsafe-eval'` stays — required by Pagefind.

## Heads-up

The `app.js` file needs the HTML changes to the event handlers to be deployed together — if you ship `app.js` without the `data-action` changes to `header.html`, the theme toggle button will silently stop working. The zip and the diff both ship them together, so just make sure you commit them in one go.

If anything in the validation list above fails after deploy, paste the exact console error — it will tell me which selector/handler didn't land.
