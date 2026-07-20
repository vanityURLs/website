---
name: hugo-quality
description: Tooling, linting, link-checking and deploy workflow for the bilingual Hugo sites (vanityURLs/website, bhdicaire.com, a6z.tech) deployed to Cloudflare Workers. Use when setting up quality tooling, checking links, configuring the build, or reasoning about how CSS and internal links are validated. For a repo's content/layout conventions, use its own hugo-conventions skill.
---

# Hugo quality & tooling

Bilingual EN/FR, **Hugo Extended**, Tailwind compiled through Hugo, deployed to Cloudflare
Workers on push to `main`.

**This repo (`vanityURLs/website`) is the reference implementation** — the full toolchain is
installed and running here, and everything below is drawn from its actual config, not a
template. bhdicaire.com and a6z.tech do **not** have it yet; port from here when setting them
up. Always check `package.json` before assuming a script exists in a given repo.

## What is true of all three repos

- **Hugo config is YAML**: `hugo.yml`, `languages.yml` (in `config/_default/` or repo root).
  This is only about Hugo config — `wrangler.jsonc`/`.toml` and `tailwind.config.cjs` stay in
  their tools' native formats. Do not "convert everything to YAML."
- **CSS is compiled by Hugo's PostCSS pipeline**, not a standalone Tailwind CLI. `baseof.html`
  runs `resources.Get "css/…" | css.PostCSS | minify | fingerprint`. Stack is
  `tailwindcss` + `postcss` + `autoprefixer` (v3) or `@tailwindcss/postcss` (v4). Never add a
  `@tailwindcss/cli --watch` step — it emits a competing stylesheet.
- **Dev**: `npm run dev` (`hugo server`). Hugo watches `assets/`; CSS rebuilds live.

## The toolchain, as actually configured in vanityURLs

Installed: `prettier`, `markdownlint-cli2`, `cspell`, `postcss`/`postcss-cli`/`autoprefixer`,
`pagefind`, `wrangler`, `@commitlint/cli` + `config-conventional`. `yamllint` and `lychee`
are machine binaries (Python / Rust), not npm deps.

### Prettier — defaults, scoped, no template formatting

No `.prettierrc` at all: Prettier runs on its defaults (which include `proseWrap: preserve`,
so Markdown is not reflowed — important, these sites use two-space hard line breaks). It is
scoped by glob and **does not format HTML/Go templates** — there is no
`prettier-plugin-go-template` here.

```jsonc
"format":       "prettier --write \"{content,brand-content}/**/*.md\" \"{data,i18n}/**/*.{json,yaml,yml}\" \"*.{json,md,yml}\"",
"format:check": "prettier --check \"{content,brand-content}/**/*.md\" \"{data,i18n}/**/*.{json,yaml,yml}\" \"*.{json,md,yml}\""
```

`.prettierignore` holds `CHANGELOG.md` (generated).

### markdownlint — `.markdownlint.yml`

`default: true`, then targeted relaxations. The tuning that matters:

```yaml
default: true
MD013: false            # line length
MD024: { siblings_only: true }   # dup headings OK unless under the same parent
MD033: false            # inline HTML (shortcodes, callouts)
MD034: false            # bare URLs
MD036: false
MD040: false            # fenced blocks without a language
MD041: { allow_preamble: true, front_matter_title: "^\\s*title\\s*[:=]" }
MD052: { shortcut_syntax: false, ignored_labels: ["x"] }   # footnote/ref syntax
MD053: { ignored_definitions: ["//"] }
```

`.markdownlintignore` holds `CHANGELOG.md`. Script: `markdownlint-cli2 'content/**/*.md' 'brand-content/**/*.md'` (plus `:fix`).

### cSpell — English only, French excluded on purpose

`cspell.json`: `language: "en"`. cSpell's French dictionary is weak, so rather than fight it
the FR files are **ignored entirely**:

```jsonc
"ignorePaths": ["CHANGELOG.md", "content/**/*.fr.md", "brand-content/**/*.fr.md",
                "data/**/*.fr.yml", "i18n/fr.yml"],
"ignoreRegExpList": ["/<[^>]+>/g", "/https?:\\/\\/[^\\s)]+/g"]   // skip tags and URLs
```

A curated `words` array carries project vocabulary (DMARC, chezmoi, goldmark, Cloudflare, …).
The `lint:spell:fix` script harvests new tokens into a word list:
`cspell --words-only … | sort -u >> cspell-words.txt`.

### yamllint — `.yamllint.yml`

```yaml
extends: default
rules: { colons: disable, document-start: disable, line-length: disable }
```

Script runs `yamllint` on the config/data/i18n YAML, with a `js-yaml` parse as fallback when
the binary is absent.

### commitlint — installed, dormant

`@commitlint/cli` + `config-conventional` are present but there is **no config file and no git
hook**, so nothing enforces it automatically yet. Commit messages are conventional by
discipline. Wiring a `commit-msg` hook (husky or native) would make it enforced.

## Link checking — lychee, offline for internal

This is the part most generic guides get wrong. **These repos check internal links with
`lychee --offline` against built HTML**, not `hugo --refValidations` (which is not a real
flag).

```bash
# Internal — offline, resolves links against the built tree:
npm run build
lychee --offline --no-progress --root-dir public public/index.html public/404.html public/en public/fr

# External — cached, rate-limited, tolerant of 429, GitHub excluded:
lychee --cache --no-progress --max-concurrency 16 --host-concurrency 2 \
  --host-request-interval 500ms --max-retries 0 --timeout 10 \
  --accept '100..=103,200..=299,429' --exclude '^https://github\.com/' public
```

An alternative for internal refs is Hugo-native: set `refLinksErrorLevel: ERROR` in
`hugo.yml` so a plain `hugo` build fails on a broken `ref`/`relref`. lychee-offline catches
more (every rendered link, not only shortcode refs); the config option is cheaper. Use either
or both.

Prefer `relref` with an absolute **content** path for internal links; URLs flatten section
directories (`/blog/hugo/x` → `/blog/x/`), so never hand-write the URL.

## Clean-build gotcha

Hugo caches the PostCSS result in `resources/`. After editing `assets/css/*` or adding classes
Tailwind must newly include, a cached build serves **stale CSS** while the HTML looks correct.
Before trusting styling: `npm run clean` (or `rm -rf public resources/_gen`), then rebuild,
then confirm the class is in the fingerprinted stylesheet under `public/css/`.

## Aggregate scripts (vanityURLs shape)

```jsonc
"lint":      "npm run format:check && npm run lint:md && npm run lint:yaml && npm run lint:spell && npm run docs:check",
"lint:all":  "npm run lint && npm run lint:links"
```

`docs:check` is a repo-specific script validating Cloudflare docs references — not generic.

## Pre-commit checklist

1. `npm run lint` clean (format, markdown, yaml, spelling).
2. `hugo` builds clean — read the warnings.
3. After CSS changes: clean rebuild, then confirm the class compiled into `public/css/`.
4. `npm run lint:links` (internal offline; external when the network is worth waiting on).
5. Both language versions of any new page exist under `public/en/…` and `public/fr/…`.
6. `public/`, `resources/`, `.hugo_build.lock`, `node_modules/`, `.wrangler/`, `.lycheecache`
   gitignored.
7. Stage only what you changed; commit signed, conventional message; push.
```
