# vanityURLs — round 6: self-hosted fonts

Generated: 2026-04-24

Removes Google Fonts entirely. Ships Inter and JetBrains Mono as self-hosted variable fonts under the SIL OFL 1.1. Tightens CSP by removing `fonts.googleapis.com` and `fonts.gstatic.com`.

## What changed

### Font delivery
- **Before:** `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:...&family=JetBrains+Mono:...">` — every page visit triggered DNS resolution and TLS handshake to Google, sending visitor IP + User-Agent + Referer
- **After:** Fonts served from `/fonts/InterVariable.woff2` and `/fonts/JetBrainsMono-VariableFont_wght.woff2` on your own domain

### CSP tightened
- **Before:** `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com`
- **After:** `style-src 'self' 'unsafe-inline'; font-src 'self'`

Two external origins removed. `default-src 'self'` becomes the enforced default for fonts — no connection to Google at all.

### Typography stack
Inter Variable covers **all weights 100–900** + full Unicode (Latin, Latin-Extended, Cyrillic, Greek, Vietnamese, IPA, symbols) in a single ~340 KB file. Same for JetBrains Mono. Variable fonts are actually *smaller* than the multi-file static approach when you need more than one weight — the previous setup was pulling four Inter weights (400/500/600/700) at ~100 KB each.

### Documentation corrected
Four content pages claimed "the site loads fonts from Google Fonts" — that statement was about to become false. Updated `security.en.md`, `security.fr.md`, `privacy.en.md`, `privacy.fr.md`, and `humans.txt` to reflect the new reality.

## Files in this patch

| File | Change |
|---|---|
| `scripts/fetch-fonts.sh` | **New** — one-time font download script |
| `assets/css/main.css` | 4 `@font-face` declarations prepended |
| `tailwind.config.js` | `sans` now prefers `InterVariable`; `mono` falls back cleaner |
| `layouts/partials/head.html` | Google Fonts `<link>` replaced with `<link rel="preload">` for the two woff2 files |
| `static/_headers` | CSP drops Google origins |
| `static/humans.txt` | Fonts attribution updated |
| `static/fonts/.gitkeep` | **New** — placeholder so the directory exists before fonts are fetched |
| `content/security.{en,fr}.md` | External-resources paragraph + CSP code block updated |
| `content/privacy.{en,fr}.md` | External-resources paragraph corrected |

## Applying

Same as previous rounds:

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o vanityurls-round6.zip
```

Or with the diff:

```bash
git apply /path/to/vanityurls-round6.diff
```

## One-time: fetch the fonts

```bash
./scripts/fetch-fonts.sh
```

Requires the `woff2` utility for the JetBrains Mono TTF→WOFF2 conversion step:

```bash
# macOS
brew install woff2

# Ubuntu / Debian
sudo apt install woff2
```

The script pulls from upstream:
- Inter: `https://rsms.me/inter/font-files/InterVariable.woff2` + italic
- JetBrains Mono: `https://github.com/JetBrains/JetBrainsMono/raw/v2.304/fonts/variable/` (pinned to v2.304)
- Licenses: both SIL OFL 1.1 texts

After it runs, commit the files:

```bash
git add static/fonts/ scripts/
git commit -m "feat: self-host fonts"
```

## Validation

After deploy:

```bash
# Fonts served from your domain
curl -I https://vanityurls.link/fonts/InterVariable.woff2
# → HTTP/2 200, Content-Type: font/woff2, Cache-Control: public, max-age=31536000, immutable

# DevTools Network tab on a page load:
#   - No requests to fonts.googleapis.com or fonts.gstatic.com
#   - Only /fonts/InterVariable.woff2 and /fonts/JetBrainsMono-VariableFont_wght.woff2

# DevTools Console:
#   - No CSP violations
```

Visual check:
- Body text renders in Inter (rounded-shoulder "a", tall x-height)
- Code blocks render in JetBrains Mono (distinctive zero with dot, ligatures on `=>`, `!==`)
- During the first page load there may be a brief flash of unstyled text as the webfont loads — `font-display: swap` behavior, same as before

## Why variable fonts

Inter's maintainer explicitly recommends `InterVariable.woff2` for web use: it's smaller than downloading 4+ static weights, and the `wght` axis interpolates any weight from 100 to 900 — not just the ones you chose upfront. Same reasoning for JetBrains Mono.

The weights declared in the `@font-face` block (`font-weight: 100 900`) are ranges: the browser uses font synthesis across that range as needed. Tailwind's `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700) all map cleanly to actual axis positions.

## License obligations

SIL OFL 1.1 requires redistribution include the license text. The fetch script downloads `Inter-LICENSE.txt` and `JetBrainsMono-OFL.txt` into `static/fonts/` — those files will be deployed alongside the fonts, satisfying the clause. If you ever subset or modify the fonts, don't rename the typeface without consulting the license.

## What I did NOT touch

- `cdn.jsdelivr.net` in `script-src` — mermaid still loads from there. Drop it if you commit to never using mermaid again.
- `'unsafe-inline'` in `style-src` — still required by the 4 inline `style="..."` attributes with Hugo variable interpolation. That'd be a separate round.
- `'wasm-unsafe-eval'` — still required by Pagefind.
