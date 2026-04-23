# vanityURLs i18n + data refactor — patch set

Generated: 2026-04-23

## What this package contains

Two things:

- **This directory** — mirrors your `website/` layout. Extract over your working copy.
- **`vanityurls-i18n.diff`** (sibling file) — unified diff, apply with `git apply` or `patch -p1`.

## Summary of changes

### Phase 1 — i18n URL bug fix

The site was configured with `defaultContentLanguageInSubdir: true` (English lives at `/en/`), but data files, layouts, and config treated English as if it lived at `/`. Every sidebar / breadcrumb / back link on the English side pointed to non-existent paths. Fixed everywhere using Hugo's `relLangURL`.

### Phase 2 — Data-driven text

All remaining inline `{{ if eq $lang "fr" }}…{{ else }}…{{ end }}` text patterns moved to data files, matching the pattern of your existing `data/trust.{en,fr}.yml`.

**Files changed**

Config & data:
- `hugo.yaml` — menus use `pageRef`; footer links stripped of language prefixes; trailing slash added to `/docs/demo/`.
- `data/fr/docs_nav.yaml` — stripped `/fr/` prefix so both language data files use identical paths.

**New data files:**
- `data/home.en.yml` + `data/home.fr.yml` — homepage strings (CTA, feature-section title/subtitle, how-it-works title/subtitle).
- `data/docs_index.en.yml` + `data/docs_index.fr.yml` — "In this section" heading used on docs section index pages.

Layouts — every `cond (eq $lang "fr") "/fr/..." "/..."` replaced with `relLangURL`; inline French/English conditionals swapped for data lookups on `index.html` and `docs/list.html`:
- `layouts/404.html`
- `layouts/index.html`
- `layouts/blog/single.html`
- `layouts/docs/list.html`
- `layouts/docs/single.html`
- `layouts/showcase/single.html`
- `layouts/partials/footer.html`
- `layouts/partials/header.html`
- `layouts/partials/jsonld.html`
- `layouts/partials/lang-switcher.html`

Content (42 files): removed every `translationKey:` line. Translation pairing now relies on shared basenames (Hugo handles this natively).

Static:
- `static/_redirects` — `/docs/` now redirects to `/en/docs/getting-started/` (old target didn't exist).

## Deletions — apply manually

The zip can't convey file removals. Delete these two files:

```
rm layouts/_default/trustv0.html
rm layouts/partials/docs-sidebar.html
```

- `trustv0.html` was a prototype — your `content/trust.*.md` uses `layout: trust`, so `trust.html` is production.
- `docs-sidebar.html` was unreferenced and referenced a broken `.Site.Data.docs_nav` path.

## Applying the patch

**Option A — extract over working copy:**
```
unzip -o vanityurls-i18n-patch.zip -d /path/to/your/website/
rm /path/to/your/website/layouts/_default/trustv0.html
rm /path/to/your/website/layouts/partials/docs-sidebar.html
```

**Option B — apply the diff (handles the deletions automatically):**
```
cd /path/to/your/website/
git apply /path/to/vanityurls-i18n.diff
```

## Validation

```
npm install
hugo --minify
# Every docs link on the EN side should now be /en/docs/..., not /docs/...
grep -oE 'href=[^ >]+/docs[^ >]*' public/en/docs/getting-started/index.html | sort -u | head
# Homepage in both languages should have the data-driven strings
grep -c "Get Started\|Everything you need" public/en/index.html
grep -c "Commencer\|Tout ce dont" public/fr/index.html
```

Expected results: all hrefs start with `/en/docs/` or `/fr/docs/`; both homepages show their respective localized text.

## How the data lookup works

The data file naming `home.en.yml` / `home.fr.yml` follows your existing `trust.en.yml` convention. Hugo treats the filename's `.en`/`.fr` as part of a single flat key (not nested maps), so the layout uses a `printf`-built key to look up the right language:

```go
{{ $lang := .Site.Language.Lang }}
{{ $data := index .Site.Data (printf "home.%s" $lang) }}
```

Then string access is clean: `{{ $data.cta_get_started }}`.
