# vanityURLs — combined patch

Generated: 2026-04-23

This patch set supersedes the earlier `vanityurls-i18n-patch.zip`. It bundles everything into a single delta against your current repo, so you only need to apply one thing.

## What this package contains

Two things:

- **This directory** — mirrors your `website/` layout. Extract over your working copy.
- **`vanityurls-audit-fixes.diff`** (sibling file) — unified diff; apply with `git apply` or `patch -p1`.

## Summary — what changed and why

### Round 1: i18n URL bug fix + data-driven homepage text

The site had `defaultContentLanguageInSubdir: true` (English at `/en/`) but layouts treated English as living at `/`. Every English sidebar and breadcrumb linked to non-existent `/docs/...` paths. All fixed with `relLangURL`. Homepage conditional strings moved to `data/home.{en,fr}.yml`; "In this section" heading moved to `data/docs_index.{en,fr}.yml`. The `translationKey:` lines were stripped from all content (Hugo pairs translations by basename already).

### Round 2: audit fixes — critical, high, and selected medium/low findings

**Critical**

- **RSS feed was broken.** Every `index.xml` started with `&lt;?xml` (HTML-entity-escaped XML declaration). Feed readers rejected it. Deleted the custom `layouts/_default/rss.xml` — Hugo's internal RSS template works correctly.
- **`/security/`, `/trust/`, `/privacy/`, etc. were unreachable.** `security.txt` pointed at `/security/` but the site only has `/en/security/`. Added 18 new redirect rules to `static/_redirects`.
- **`security.txt` pinned Trust Center to `/en/trust/`.** Changed to language-neutral `/trust/` which now redirects.
- **`layouts/_default/single.html` missing dark-mode classes.** 9 legal/info pages (accessibility, contributing, impressum, license, privacy, security, terms, vulnerability, 404) rendered with `text-gray-900` and no `prose-invert` in dark mode. Added `dark:text-gray-100` and `dark:prose-invert`.
- **`<script>` block after `</html>` in `baseof.html`.** ~115 lines of keyboard-nav JS lived outside the document. Moved inside `</body>`.
- **Search modal duplicated.** `search-modal.html` partial was included from both `baseof.html:36` and `header.html:154`, producing duplicate `id` attributes on every page. Removed from header.

**High**

- **Tag pages showed English "post/posts" in French** (`layouts/tags/list.html`). Replaced with `{{ i18n "tag_post_count" (dict "Count" ...) }}` and added pluralized keys in both i18n files.
- **Tags index H1 was hardcoded English** (`layouts/tags/taxonomy.html`). Replaced with `{{ i18n "tags_title" }}` → "Étiquettes" in French.
- **Date formats hardcoded US-style** ("Jan 2, 2006") across four layouts. Now uses `.Date.Format (i18n "date_format_long")`. FR renders "2 Jan 2026".
- **Search JS had three hardcoded English strings** (`baseof.html`: "Run npm run index...", "Search error...", "No results for..."). All now `{{ i18n ... | jsonify }}`.
- **Hardcoded English `aria-label` strings** across 8 layouts: "Toggle menu", "Share on X", "Share on LinkedIn", "Copy link", "Copy code", "Breadcrumb", "Page navigation", "Post navigation", "Blog pagination", "Link to this section". All i18n'd.
- **`build.sh` didn't run pagefind** — search index went stale whenever content changed without a local `npm run build`. Added `npx pagefind --site public` step.
- **`static/pagefind/` was committed** (912 KB of generated output). Removed from repo; added to `.gitignore` (along with `public/`).

**Medium/Low**

- **`$lang` variable set but unused** in `footer.html`. Removed.
- **PWA `start_url` was `/`.** With defaultContentLanguageInSubdir, launching the installed PWA triggered a redirect. Changed to `/en/`.
- **Version-infrastructure dead weight.** `data/version.yml` was never read, `layouts/partials/version-banner.html` was a 1-line stub, and `release-please-config.json` was bumping `data/version.yml` on every release for nothing. Removed all three.
- **404 pages had no `description`** in front matter. Added.
- **`package.json` build scripts misaligned with `build.sh`** (the old `cp -r public/pagefind static/` step became obsolete). Cleaned up.

## Deletions

The zip can't convey file removals. These are also handled by the `.diff` if you apply that instead:

```
rm layouts/_default/trustv0.html
rm layouts/_default/rss.xml
rm layouts/partials/docs-sidebar.html
rm layouts/partials/version-banner.html
rm data/version.yml
rm -rf static/pagefind/
```

## Applying the patch

**Option A — extract over working copy:**
```bash
unzip -o vanityurls-patch.zip -d /path/to/your/website/
# Then run the deletions above
```

**Option B — apply the diff (handles deletions automatically):**
```bash
cd /path/to/your/website/
git apply /path/to/vanityurls-audit-fixes.diff
```

## Validation

```bash
npm install
hugo --gc --minify && npx pagefind --site public

# Round 1 — URLs should all be language-prefixed
grep -oE 'href=[^ >]*docs[^ >]*' public/en/docs/getting-started/index.html | sort -u
# Expect: /en/docs/..., never bare /docs/...

# Round 2 — RSS declaration should not be escaped
head -c 60 public/en/blog/index.xml
# Expect: <?xml version="1.0" ...   (NOT &lt;?xml)

# Round 2 — tag page should show French plural in FR
grep -oE '>\s*[0-9]+\s*article[s]?\s*<' public/fr/tags/guide/index.html
# Expect: >3 articles< (or similar), not "posts"

# Round 2 — privacy page should be dark-mode styled
grep -c "prose-invert" public/en/privacy/index.html
# Expect: ≥ 1
```

## Things NOT addressed in this patch

From the audit (graded as lower priority or out of scope):

- `_default/taxonomy.html` only renders a stub if you add a new taxonomy — kept it in place with dark-mode classes rather than deleting it.
- Asymmetric `aliases:` (EN has `/a11y`, `/imprint`, `/disclosure` shortcuts; FR doesn't).
- Inconsistency between GitHub `CONTRIBUTING.md` and site `/contributing/`.
- `CONTRIBUTING.md` structure review.
- `wrangler.toml` vs `hugo.yaml` domain casing.
- Security.txt `Expires` date annual-rotation reminder.

## Hugo version note

Your `build.sh` installs Hugo 0.160.0. Templates use `css.PostCSS` which is a Hugo 0.128+ API. Worth updating your project notes to reflect 0.160, not 0.123.7, as the required version — 0.123.7 doesn't build this site.
