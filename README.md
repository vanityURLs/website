# vanityURLs i18n fix — patch set

Generated: 2026-04-23

## What this package contains

Two things:

- **This directory** — the full set of modified files, mirroring your `website/` layout. You can extract them over your working copy.
- **`vanityurls-i18n.diff`** (sibling file) — a unified diff you can review line-by-line or apply with `git apply` / `patch -p1`.

## Summary of changes

**Bug fix — English docs navigation 404s**
The site was configured with `defaultContentLanguageInSubdir: true` (English lives at `/en/`), but data files, layouts, and config treated English as if it lived at `/`. Every sidebar/breadcrumb/back link on the English side pointed to non-existent paths. Fixed by using Hugo's `relLangURL` everywhere and letting Hugo manage language prefixes.

**Files changed**

Config & data:
- `hugo.yaml` — menus use `pageRef`; footer links stripped of language prefixes; trailing slash added to `/docs/demo/`
- `data/fr/docs_nav.yaml` — stripped `/fr/` prefix so both language data files use identical paths

Layouts — every `cond (eq $lang "fr") "/fr/..." "/..."` pattern replaced with `relLangURL`:
- `layouts/404.html`
- `layouts/index.html`
- `layouts/_default/trustv0.html`
- `layouts/blog/single.html`
- `layouts/docs/list.html`
- `layouts/docs/single.html`
- `layouts/showcase/single.html`
- `layouts/partials/footer.html`
- `layouts/partials/header.html`
- `layouts/partials/jsonld.html`
- `layouts/partials/lang-switcher.html`

Content (42 files): removed every `translationKey:` line. Translation pairing now relies on shared basenames (which Hugo already supports natively).

Static:
- `static/_redirects` — `/docs/` now redirects to `/en/docs/getting-started/` (old target didn't exist)

## Deletions — apply manually

The zip can't convey file removals. Delete this one file:

```
rm layouts/partials/docs-sidebar.html
```

It was unreferenced and contained a broken `.Site.Data.docs_nav` lookup.

## Applying the patch

**Option A — extract over working copy:**
```
unzip -o vanityurls-i18n-patch.zip -d /path/to/your/website/
rm /path/to/your/website/layouts/partials/docs-sidebar.html
```

**Option B — apply the diff:**
```
cd /path/to/your/website/
git apply /path/to/vanityurls-i18n.diff
rm layouts/partials/docs-sidebar.html
```

## Validation

After applying:
```
npm install
hugo --minify
grep 'href="/docs' public/en/docs/getting-started/index.html | head -5
```

Expected: no bare `/docs/...` hrefs — all links should be `/en/docs/...` or `/fr/docs/...`.
