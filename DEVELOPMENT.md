# Development

How to run, modify, and contribute to this site locally.

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| **Hugo (Extended)** | `0.158.0+` (production currently pinned to 0.160.1) | The site uses `css.PostCSS` and `css.Build` APIs introduced in 0.158. Earlier versions will fail to build. |
| **Node.js** | `20+` (production currently pinned to 24.14.1) | For PostCSS, Pagefind search index, Tailwind CSS, Wrangler CLI. |
| **Go** | optional, `1.20+` | Only needed if you build Hugo from source. The pinned binary doesn't need it. |
| **Git** | any modern version | The site uses `enableGitInfo: true` in `hugo.yml`, which reads commit metadata for "last modified" timestamps. |

You don't need Wrangler installed unless you want to deploy to Cloudflarefrom your laptop. The default deploy flow (git push → Cloudflare auto-deploy) handles deployment server-side. Refer to [hosting documentation](./HOSTING.md)

### Installing Hugo

The official binaries on `github.com/gohugoio/hugo/releases` always have the latest version, refer to [Hugo documentation](https://gohugo.io/installation/) for `BSD`, `Linux`, and `Windows`. You can install on macOS via Homebrew: `brew install hugo`.


No matter the installation process, verify the version is `>= 0.158.0` AND that you have the **extended** edition:

```bash
hugo version
# hugo v0.160.1+extended ...   ← needs the +extended suffix
```

Extended edition is **required** for SCSS/PostCSS pipelines. The non-extended version will silently emit raw, untransformed CSS that doesn't match production.

## First-time setup

```bash
git clone https://github.com/vanityURLs/website.git
cd website
npm install
```

`npm install` installs Tailwind, Pagefind, PostCSS, and the linting tools. It takes ~30 seconds on a fresh clone.

## Daily workflow

### Run the dev server

```bash
npm run dev
```

This is `hugo server --buildDrafts` under the hood. It:

- Builds the site in memory
- Watches all `content/`, `layouts/`, `assets/`, `data/`, `i18n/` paths for changes
- Triggers live-reload in your browser on save (~200ms turnaround)
- Serves at `http://localhost:1313/`

`--buildDrafts` includes `draft: true` content (in `content/blog/` we might have pending posts. Without this flag, drafts are skipped and you'd just see the published content.

### Run with the search index

The default `npm run dev` doesn't build the Pagefind search index, so search will be broken locally. If you need to test search behavior:

```bash
npm run dev:search
```

This does a one-shot `hugo --minify` build, runs Pagefind to generate the search index, then starts the dev server. The downside: edits won't trigger search-index rebuilds, so search results lag behind your changes until you re-run the command.

For most editing work, the default `npm run dev` is fine — search just won't work until production deploy.

### Stop the dev server

`Ctrl+C` in the terminal. Hugo cleans up automatically.

## Repository structure

```
website/
├── archetypes/                  # Hugo content templates (used by `hugo new`)
├── assets/
│   ├── css/                     # Source CSS (main.css, chroma themes, showcase colors)
│   │   ├── main.css             # Tailwind input + custom CSS
│   │   ├── chroma.css           # Light mode syntax highlighting
│   │   └── chroma-dark.css      # Dark mode syntax highlighting
│   └── js/
│       ├── app.js               # Reading progress, search modal, dropdowns, dark mode
│       └── mermaid.min.js       # Self-hosted Mermaid (round 19)
│
├── content/                     # Markdown content (the "pages")
│   ├── _index.{en,fr}.md        # Site home pages
│   ├── blog/                    # Blog posts
│   ├── docs/                    # Documentation pages
│   ├── showcase/                # Showcase entries
│   ├── accessibility.{en,fr}.md
│   ├── privacy.{en,fr}.md
│   ├── security.{en,fr}.md
│   └── ...
│
├── data/
│   ├── docs_nav.{en,fr}.yml     # Documentation sidebar nav
│   └── trust.{en,fr}.yml        # "Why trust this site" content blocks
│
├── i18n/
│   ├── en.yml                   # English UI strings (button labels, etc.)
│   └── fr.yml                   # French UI strings
│
├── layouts/
│   ├── _default/
│   │   ├── baseof.html          # Master template (all pages extend this)
│   │   ├── single.html          # Single-page layout
│   │   ├── list.html            # List/index layouts
│   │   └── term.html            # Taxonomy term pages (e.g., /tags/foo/)
│   ├── partials/
│   │   ├── head.html            # <head> contents
│   │   ├── header.html          # Site header (logo, nav, search button)
│   │   ├── footer.html          # Site footer
│   │   ├── lang-switcher.html   # EN/FR toggle
│   │   ├── search-modal.html    # Pagefind search dialog
│   │   └── structured-data.html # JSON-LD per page
│   ├── 404.html                 # 404 page
│   ├── index.html               # Site home (special: not a content page)
│   ├── blog/                    # Blog-specific layouts
│   ├── docs/                    # Docs-specific layouts
│   ├── showcase/                # Showcase layouts
│   ├── shortcodes/              # Custom shortcodes (e.g., {{< code >}})
│   └── tags/
│       └── term.html            # Per-tag list page
│
├── public/                      # Hugo build output (gitignored, regenerated each build)
├── resources/                   # Hugo asset cache (gitignored)
│
├── scripts/                     # One-off helper scripts (not part of build)
├── src/
│   ├── worker.mjs               # The Cloudflare Worker for server-side analytics
│   └── worker.test.mjs          # Worker tests for debugging
│
├── static/                      # Files served as-is (no Hugo processing)
│   ├── _headers                 # HTTP response headers (CSP, security)
│   ├── _redirects               # URL redirects (e.g., / → /en/)
│   ├── favicon.ico              # Browser tab icon
│   ├── humans.txt
│   ├── logo.svg
│   ├── site.webmanifest         # PWA manifest
│   └── social.png               # Open Graph image (1200×630)
│
├── build.sh                     # Build script run by Cloudflare Workers
├── hugo.yml                     # Hugo site configuration
├── package.json                 # npm dependencies + scripts
├── tailwind.config.js           # Tailwind theme (brand colors, fonts, etc.)
├── postcss.config.js            # PostCSS pipeline
└── wrangler.toml                # Cloudflare Worker configuration
```

### `assets/` vs `static/`

Two different folders for static-looking content. The distinction matters:

- **`assets/`** — files that Hugo processes (PostCSS, fingerprinting, minification, SCSS). The Hugo template references these via `resources.Get` and `resources.Fingerprint`. The output filename includes a content hash (`main.abc123.css`), so caches are invalidated automatically on change.
- **`static/`** — files served verbatim, no processing, original filename preserved. Use for files that need a stable URL (`/favicon.ico`, `/social.png`, `/humans.txt`) or where the contents are already optimized (the Mermaid bundle, fonts).

If you're adding a new asset:
- New CSS or JS that should be bundled/fingerprinted → `assets/`
- A favicon, OG image, or anything that needs `https://yoursite/foo.ext` to work as a fixed URL → `static/`

## How to ...

### Add a blog post

```bash
hugo new blog/my-new-post.en.md
```

Hugo creates `content/blog/my-new-post.en.md` from the archetype with sensible default frontmatter. Edit:

```yaml
---
title: "My New Post"
description: "Short description for SEO and social cards"
date: 2026-05-01
tags: [hugo, cloudflare]
draft: true   # remove or set to false to publish
---

Body content goes here. Markdown.
```

For French translation, create `content/blog/my-new-post.fr.md` with the same structure but French content. Hugo automatically pairs them by filename — they'll show up linked via the language switcher.

### Add a documentation page

```bash
hugo new docs/my-topic.en.md
```

Then edit `data/docs_nav.en.yml` to add the page to the sidebar:

```yaml
- title: "My topic"
  url: /en/docs/my-topic/
  weight: 50   # controls sort order
```

Repeat for French (`docs/my-topic.fr.md` and `data/docs_nav.fr.yml`).

### Add a showcase entry

```bash
hugo new showcase/example.en.md
```

Showcase entries support custom theming via `showcase-colors.css` — the showcase index is a gallery, individual showcase pages can override the brand color. See existing entries in `content/showcase/` for the frontmatter conventions.

### Translate an existing page

If `content/foo/bar.en.md` exists and you want to add French:

1. Copy the file to `content/foo/bar.fr.md`
2. Translate the frontmatter (`title`, `description`) and body
3. Save. Hugo pairs them automatically.

The language switcher in the header will show both. If only one translation exists, the switcher links to the language root (`/fr/` or `/en/`) instead of a sibling translation.

### Add a UI string (button label, error message, etc.)

UI strings live in `i18n/en.yml` and `i18n/fr.yml`. To add a new one:

```yaml
# i18n/en.yml
my_new_string: "Click here to continue"
```

```yaml
# i18n/fr.yml
my_new_string: "Cliquez ici pour continuer"
```

Use it in templates with `{{ i18n "my_new_string" }}`.

### Add a redirect

Edit `static/_redirects`. Format:

```
/old-path     /new-path     301
/marketing/*  /docs/:splat  301
```

Trailing slashes matter — Cloudflare matches literally. To handle both `/foo` and `/foo/`, list both. The `*` wildcard captures path suffixes; `:splat` interpolates them. See `HOSTING.md` for the full Cloudflare _redirects spec.

### Add a security or HTTP header

Edit `static/_headers`. The format is one URL pattern per block, with header lines indented:

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; ...
  X-Content-Type-Options: nosniff
```

Patterns are URL prefixes. `/*` matches everything. `/blog/*` matches just blog pages.

### Update the analytics Worker

If you need to add a new event type, change UTM handling, or modify bot detection:

1. Edit `src/worker.mjs`
2. Run `npm test` to verify the 25-test suite still passes
3. Commit and push (auto-deploys via Cloudflare)
4. Watch the **Observability** tab for any errors after deploy

Add tests for new behavior in `src/worker.test.mjs` (it uses Node's built-in test infrastructure, no external framework).

### Test the Worker locally

```bash
npx wrangler dev
```

This runs the Worker locally with a hot-reload dev server, mocking the Static Assets binding. You can hit `http://localhost:8787/` and the Worker code will execute against local assets.

Caveats:
- Secrets aren't auto-loaded. Either: (a) `npx wrangler secret put UMAMI_WEBSITE_ID --env dev` to set them locally, or (b) accept that analytics calls will silently skip (the Worker's env-check will catch missing secrets).
- The Static Assets binding behavior may differ slightly from production. Confirm the actual deploy if you change anything about asset routing.

### Run the full lint suite

```bash
npm run lint           # markdown + YAML + spelling + secrets
npm run lint:md        # markdownlint on content/**/*.md
npm run lint:md:fix    # auto-fix markdownlint issues
npm run lint:spell     # cspell on content/**/*.md
npm run lint:spell:fix # add new words to cspell-words.txt
npm run lint:yaml      # validate YAML config files
npm run lint:links     # check for broken links (uses lychee)
npm run lint:secrets   # gitleaks scan
```

Run `npm run lint` before committing — the CI does the same checks and you'll catch issues earlier.

### Run the worker tests

```bash
npm test
```

25 tests covering: bot detection, UTM extraction, payload structure, response handling, edge cases. Should pass in ~50ms.

## Conventions

### Commit messages

Use conventional commits format. The release-please tool reads these for automatic changelog generation:

```
feat(content): add new docs page for advanced routing
fix(layout): correct hero subtitle contrast on dark gradient
chore(deps): upgrade hugo to 0.160.1
docs: rewrite accessibility statement for accuracy
```

Available types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`. The first word after `:` should be lowercase.

### File naming

- Content files: `name.{en,fr}.md` (language code in the middle, before `.md`)
- Layouts: `lowercase-with-dashes.html`
- Assets: match the source they replace (e.g., `mermaid.min.js`, not `Mermaid.min.js`)

### Frontmatter

Required fields on every content page:

```yaml
title: "Page title"
description: "Short description (used for OG/Twitter Card and meta description)"
date: 2026-04-30  # YYYY-MM-DD; used for sort order, not displayed unless explicit
```

Optional but recommended:

```yaml
tags: [hugo, cloudflare]   # for blog posts
draft: true                # exclude from production builds
weight: 10                 # for ordering in section lists
```

### Tailwind classes

Use Tailwind utility classes directly in templates. Avoid creating custom CSS unless:
- It's genuinely something Tailwind can't express (e.g., a complex animation)
- You're styling syntax highlighting (`chroma.css` / `chroma-dark.css`)

Brand colors are in `tailwind.config.js` under `theme.extend.colors.brand`. The full palette is `brand-50` through `brand-900` in 100-step increments. Use `text-brand-700` etc. — these are real classes generated at build time, not improvised values.

## Common gotchas

### "My new page doesn't show up"

- Did you set `draft: true`? Drafts only show with `--buildDrafts`.
- Did you save with the right filename? `name.en.md` not `name.md`.
- Did you wait for live-reload? It takes ~200ms.
- Try restarting `npm run dev`. Hugo's file watcher occasionally misses creates (rarer on macOS than Linux).

### "Translations aren't pairing"

- The base filename must match exactly: `foo.en.md` ↔ `foo.fr.md`. NOT `foo.en.md` ↔ `bar.fr.md`.
- The directories must match: `blog/foo.en.md` ↔ `blog/foo.fr.md`.

### "Search isn't working"

- The default `npm run dev` doesn't build the search index. Use `npm run dev:search` for that. Or just live with broken local search and verify on production.

### "CSS changes aren't applying"

- Tailwind's PurgeCSS removes unused classes. If you're using a class that doesn't appear in any `.html` template, it gets purged.
- Try a hard reload (`Cmd+Shift+R` / `Ctrl+Shift+R`).
- Check browser DevTools Network tab — is the new CSS file being requested? The filename includes a hash; if you see the old hash, Hugo hasn't rebuilt.

### "Hugo server won't start"

- Check `hugo version`. If it's < 0.158, upgrade.
- Check that you have the **extended** edition (`+extended` suffix in the version string).
- Try `rm -rf resources/_gen` and re-run.

### "I see a 'Hugo: 0.123.7' error in the build log"

That's a sandbox-environment issue from the audit cycle, not your local. Production uses 0.160.1 (pinned in `build.sh`). Your local should also be 0.158+.

## Production deploy

See `HOSTING.md` for the full deploy flow. The TL;DR:

```bash
git push origin main
# wait ~60-90s
# Cloudflare auto-deploys via GitHub integration
```

To watch the build live: Cloudflare dashboard → Workers & Pages → `vanityurls-website` → **Deployments** tab.
