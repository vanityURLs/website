# vanityURLs — round 14: Open Graph image

Adds `static/social.png` — the 1200x630 PNG that social platforms render in link previews. Slack, iMessage, Twitter/X, LinkedIn, Discord, and Mastodon all pick this up automatically through the OG/Twitter Card meta tags already in `head.html`.

## What you'll see after deploy

Before: small square thumbnail with `logo.svg` rendered as a tiny icon. SVGs are unevenly supported in OG contexts. LinkedIn shows no image at all.

After: wide-format card showing the wordmark, accent line, tagline, and domain. LinkedIn renders the full PNG. Slack/iMessage show clean previews.

## No head.html change needed

`layouts/partials/head.html` already had the `fileExists "static/social.png"` detection from earlier scaffolding. Once `social.png` lands in `static/`, every page automatically:

- Sets `og:image` to `https://vanityurls.link/social.png`
- Adds `og:image:width=1200`, `og:image:height=630`, `og:image:type=image/png`
- Switches Twitter card type from `summary` → `summary_large_image`
- Localizes `og:image:alt` per page language

## Files

| File | Purpose |
|---|---|
| `static/social.png` | The 1200x630 OG card |
| `scripts/build-og-image.py` | The generator (re-run if brand changes) |

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round14.zip
git add static/social.png scripts/build-og-image.py
git commit -m "feat: open graph card for social link previews"
```

## Validate after deploy

```bash
curl -sI https://vanityurls.link/social.png | head -3
curl -s https://vanityurls.link/en/ | grep -E 'og:image|twitter:card' | head
```

Preview in:
- Facebook/LinkedIn debugger: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/
- Slack: paste URL into a DM with yourself

Most platforms cache the OG image aggressively. If you've shared a vanityurls.link URL before, use "Scrape Again" to force a refresh.

## Regenerating

```bash
pip install --break-system-packages pillow fonttools brotli
python3 scripts/build-og-image.py
```

The script reads Inter Variable from `static/fonts/intervariable.woff2`, decompresses it, pins static instances at the weights it needs (Semibold, ExtraBold), and renders. Output is deterministic.
