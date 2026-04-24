# vanityURLs — round 8: fix 404 + normalize YAML extensions

Two related cleanups:

## 1. Fix the broken 404 page

**Root cause:** `content/404.en.md` and `content/404.fr.md` contained Hugo template code (`{{ define "main" }}`, `{{ i18n "not_found_title" }}`) as plain Markdown text. Hugo's Markdown renderer doesn't interpret `{{ ... }}` — it passes them through as literal characters. That's why the screenshot showed `{{ i18n "not_found_title" }}` rendered verbatim.

On top of that, the URL in the screenshot was `/en/404/` (directory-style) — Hugo was treating the broken `content/404.en.md` as a regular content page and generating `/en/404/index.html`. Cloudflare's `not_found_handling = "404-page"` actually looks for `/en/404.html` (file-style), so even if the content had rendered correctly, Cloudflare wouldn't have found it where it needs to.

**Fix applied:**

- **Delete `content/404.en.md` and `content/404.fr.md`** (they were shadowing and breaking the real layout).
- The existing `layouts/404.html` already handles both languages correctly via Hugo's built-in 404 convention. With the shadow files gone, Hugo now emits:
  - `public/en/404.html` — handles misses under `/en/*`
  - `public/fr/404.html` — handles misses under `/fr/*`
- **Add a step in `build.sh`** to copy `public/en/404.html` to `public/404.html` so top-level URLs (e.g. `/typo` with no language prefix) also have a 404 to walk up to.

Your `wrangler.toml` is correct as-is — `not_found_handling = "404-page"` is the right value for this site (static site generation, not SPA). See [Cloudflare's SSG docs](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/) for reference.

## 2. Normalize all YAML extensions to `.yml`

Before this patch the repo mixed `.yaml` (hugo config, i18n files, nested docs_nav) and `.yml` (home, trust, docs_index). Normalized to `.yml` throughout.

Also flattened `data/en/docs_nav.yaml` and `data/fr/docs_nav.yaml` to `data/docs_nav.en.yml` and `data/docs_nav.fr.yml`, matching the pattern used by the other per-language data files (`home.en.yml`, `docs_index.en.yml`, `trust.en.yml`).

### File operations

**Rename (no content change):**
- `hugo.yaml` → `hugo.yml`
- `i18n/en.yaml` → `i18n/en.yml`
- `i18n/fr.yaml` → `i18n/fr.yml`

**Move + rename:**
- `data/en/docs_nav.yaml` → `data/docs_nav.en.yml`
- `data/fr/docs_nav.yaml` → `data/docs_nav.fr.yml`

**Delete:**
- `data/en/` (empty after move)
- `data/fr/` (empty after move)
- `content/404.en.md` (broken 404 source)
- `content/404.fr.md` (broken 404 source)

### Code changes

**`layouts/docs/list.html` and `layouts/docs/single.html`:**
```go
// before
{{ $nav  := index .Site.Data $lang "docs_nav" }}
// after
{{ $nav  := index .Site.Data (printf "docs_nav.%s" $lang) }}
```
The lookup pattern now matches the other data files (`home.{en,fr}.yml`, `docs_index.{en,fr}.yml`).

**`layouts/partials/footer.html`:** comment updated from `hugo.yaml` to `hugo.yml`.

**`build.sh`:** new step copies `public/en/404.html` → `public/404.html` after Hugo build.

**`package.json`:** `lint:yaml` and `lint:spell` scripts updated to reference `hugo.yml`, `*.yml`, `data/*.yml`.

**`README.md`:** file paths and project-layout tree updated to reflect the new names.

## Applying

Because this patch combines file renames, directory deletions, and content changes, the zip alone won't do the job — it can't tell `git` to delete files. Use this sequence:

```bash
cd /Volumes/Tarmac/code/vanityURLs/website

# 1. Remove broken 404 content and the now-empty nested dirs
git rm content/404.en.md content/404.fr.md
git rm data/en/docs_nav.yaml data/fr/docs_nav.yaml
rmdir data/en data/fr

# 2. Rename config and i18n files
git mv hugo.yaml hugo.yml
git mv i18n/en.yaml i18n/en.yml
git mv i18n/fr.yaml i18n/fr.yml

# 3. Overlay the patch (adds the renamed docs_nav files and the code changes)
unzip -o ~/Downloads/vanityurls-round8.zip

# 4. Stage and commit
git add -A
git commit -m "fix(404): remove broken content templates; rename all yaml to yml"
```

## Validation after deploy

```bash
# Each language's 404 serves correctly
curl -sI https://vanityurls.link/en/nonexistent | head -1
# → HTTP/2 404

# Top-level 404 works too
curl -sI https://vanityurls.link/does-not-exist | head -1
# → HTTP/2 404

# Content — should see "Page not found" / "Page introuvable" rendered properly,
# not "{{ i18n ... }}" literal text
curl -s https://vanityurls.link/en/nonexistent | grep -o "Page not found"
curl -s https://vanityurls.link/fr/nonexistent | grep -o "Page introuvable"
```

In the browser: visit any URL that doesn't exist under `/en/` or `/fr/` and verify the 404 page renders with proper styling (brand-colored button, docs fallback link, correct language chrome).

## What I verified in my sandbox

- Hugo builds successfully with the renamed files (Hugo accepts both `.yml` and `.yaml`; renaming to `.yml` is officially supported).
- Docs sidebar still renders (17 sidebar links in `/en/docs/getting-started/`) — the `docs_nav` data is being loaded from the new flat filename.
- `/en/404.html` and `/fr/404.html` are generated with correct i18n strings ("Page not found" / "Page introuvable"), full header/footer chrome, and no raw template tags.
- No stale references to `hugo.yaml`, `docs_nav.yaml`, `i18n/en.yaml`, `i18n/fr.yaml`, `data/en/`, or `data/fr/` anywhere in the repo.
