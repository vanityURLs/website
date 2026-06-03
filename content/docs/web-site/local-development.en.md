---
aside: false
title: "Local development"
description: "Run, build, test, and debug the vanityURLs Hugo web site locally."
weight: 10
---

Use this page when you are changing layouts, content, styles, search, or the small Cloudflare Worker that serves the documentation site.

## Prerequisites

| Tool | Version | Why |
| ---- | ------- | --- |
| Hugo Extended | `0.158.0+` | The site uses Hugo asset pipeline features that require a modern extended build |
| Node.js | `20+` | npm scripts, Tailwind, PostCSS, Pagefind, Wrangler, and tests |
| Git | Any modern version | `enableGitInfo` uses commit metadata for last-modified dates |
| Go | Optional | Only needed if you build Hugo yourself |

{{< callout type="warning" title="Use Hugo Extended" >}}
The non-extended Hugo binary can fail or emit CSS that does not match production. Confirm `hugo version` includes `+extended`.
{{< /callout >}}

## First-time setup

```bash
git clone https://github.com/vanityURLs/website.git
cd website
npm install
```

`npm install` installs Tailwind, Pagefind, PostCSS, Wrangler, and the linting tools.

## Daily workflow

Run the local server:

```bash
npm run dev
```

This runs `hugo server --buildDrafts`, watches `content/`, `layouts/`, `assets/`, `data/`, and `i18n/`, then serves the site at `http://localhost:1313/`.

The default dev server does not build the Pagefind search index. When you need to test search:

```bash
npm run dev:search
```

This performs a one-shot minified Hugo build, builds the Pagefind index, then starts the dev server. Re-run it when search results need to reflect new edits.

## Build and checks

```bash
npm run build
npm run lint
npm run lint:all
npm test
```

| Command | Use when |
| ------- | -------- |
| `npm run build` | Verify Hugo, generated assets, and Pagefind output |
| `npm run lint` | Run formatting, Markdown, YAML, and spelling checks |
| `npm run lint:all` | Include generated-site link checks before a release or larger cleanup |
| `npm test` | Run the Worker tests in `src/worker.test.mjs` |

The external link checker can be slow or rate-limited. Keep it separate from normal editing unless you are doing a release-quality pass.

## Worker development

The site Worker in `src/worker.mjs` serves static assets and sends server-side analytics events for HTML requests.

Run it locally with Wrangler:

```bash
npx wrangler dev
```

Wrangler serves at `http://localhost:8787/` and hot-reloads Worker changes.

{{< callout type="note" title="Local secrets are optional for most Worker tests" >}}
Analytics calls skip when required environment values are missing. That is fine for layout and asset-routing work. Add local secrets only when you are specifically debugging analytics behavior.
{{< /callout >}}

## Local deploy while testing

Use this only when the GitHub integration is unavailable or you intentionally need to test a local deployment:

```bash
npm install
npm run build
npx wrangler login
npx wrangler deploy
```

Local deploys use the same `wrangler.toml` and runtime secrets documented in [Hosting and deployment](/docs/web-site/hosting-deployment/). Cloudflare marks them as manually deployed instead of Git-backed.

## Common fixes

| Symptom | Check |
| ------- | ----- |
| A new page does not appear | Confirm the file is not `draft: true`, uses `name.en.md` or `name.fr.md`, and has a section weight when it belongs in docs navigation |
| Translations do not pair | The base filename and directory must match, such as `content/docs/foo.en.md` and `content/docs/foo.fr.md` |
| Search is empty locally | Use `npm run dev:search` or verify search after a production-style build |
| CSS changes do not appear | Hard reload, confirm Hugo rebuilt, and check whether Tailwind purged a class that only exists dynamically |
| Hugo will not start | Confirm Hugo Extended is installed and try removing `resources/_gen` before rebuilding |

## Commit style

Use conventional commits so release-please can generate release notes correctly:

```text
docs: add website contributor guide
fix(layout): correct mobile docs navigation
style: tune callout spacing
test: cover website analytics payload
```

Common types are `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, and `chore`.
