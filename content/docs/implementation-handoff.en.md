---
title: "Implementation handoff"
description: "Current implementation notes for documentation updates across defaults, custom overrides, local tooling, policies, languages, badges, and install workflows."
---

This page consolidates the current code-side decisions that should be assessed whenever the website documentation is updated. It is a working handoff for documentation maintainers, not a replacement for the source code.

## Core mental model

`defaults/` is the product baseline. It contains the pages, assets, policies, schedules, sample links, site configuration, and local-install defaults that ship with vanityURLs.

`custom/` is the instance owner's layer. It contains local links, local schedules, local policy replacement, custom public pages, local site configuration, and workstation configuration. Instance owners should be able to update upstream `defaults/` and `scripts/` without losing their own `custom/` choices.

`build/` is generated output. It contains the runtime static assets, `v8s.json`, `v8s-blocklist.json`, and `v8s-site-config.json`. It is safe to remove with `npm run clean`.

`src/` is generated during build from `scripts/workers/` for Wrangler compatibility. The source of truth is `scripts/workers/`, not `src/`.

The runtime registry has two useful local copies:

- `build/v8s.json` is the repository-local build artifact.
- The configured workstation registry path, usually `~/.v8s.json`, is the local helper cache.

`lnk` mutates source files under `custom/`. npm scripts may build, validate, publish, install helper files, copy generated output, or update local workstation paths.

## Configuration files

The current source configuration set is:

```text
defaults/v8s-links.txt
defaults/v8s-schedules.json
defaults/v8s-policies.json
defaults/v8s-blocklist-categories.json
defaults/v8s-site-config.json
defaults/v8s-local-config.json
```

`custom/v8s-links.txt` is the instance-owned link file. The CLI writes links there. If the file does not exist, the CLI creates it.

`custom/v8s-policies.json` replaces the default source policy file for instance policy decisions. Removed custom policy items should not reappear through a default merge. Legacy `v8s-blocklist.json` names are still recognized by some code paths for migration compatibility, but documentation should prefer `v8s-policies.json`.

`build/v8s-blocklist.json` remains the runtime file name consumed by the Worker. That distinction is intentional: source policy is edited as policies; runtime output is served as a blocklist artifact.

`custom/v8s-site-config.json` stores site-level instance choices. Current important fields include:

```json
{
  "i18n": {
    "default_language": "en",
    "supported_languages": ["en", "fr"]
  },
  "branding": {
    "domain": "example.link",
    "custom_public": true,
    "wordmark": {
      "black": "example.",
      "green": "link"
    }
  }
}
```

`custom/v8s-local-config.json` stores workstation-oriented choices such as helper install paths, local registry path, repository path, and local publish defaults. It is created or updated by `npm run local-install`.

## Build behavior

The build copies `defaults/public/`, copies English defaults to the public root, overlays `custom/public/` when it contains files, prunes unsupported language directories from `build/`, builds `v8s-blocklist.json`, builds `v8s.json`, writes `v8s-site-config.json`, and patches the generated Worker language list from the site config.

If `custom/public/` is used, the owner should define supported languages in `custom/v8s-site-config.json`. Otherwise they can accidentally create a mixed-language instance where only one or two languages were customized but every default language still appears.

English policy pages have extension-free aliases such as `/privacy`, `/terms`, `/abuse`, and `/security`. French policy pages are served under `/fr/privacy.html`, `/fr/terms.html`, `/fr/abuse.html`, and `/fr/security.html`.

The default English and French public pages now include footer-style policy links. Default Spanish, Italian, and German pages are localized for core pages and status pages, but do not currently include equivalent policy pages.

## Instance install behavior

`npm run setup` runs the instance installer. It now asks about:

- short URL domain
- Worker name
- owner label
- analytics provider
- Cloudflare Access team domain
- supported languages
- whether to copy default web pages into `custom/public`
- split-color wordmark portions

When the owner accepts branded pages, the installer copies `defaults/public/` to `custom/public/`, rewrites the wordmark from `Vanity` + `URLs` to the configured black and green portions, updates relevant labels and brand links, and prunes unsupported language directories.

The installer stores those decisions in `custom/v8s-site-config.json` to keep the process idempotent. If `custom/public/` already contains files and was not marked as installer-managed, the installer refuses to replace it unless `--force` is used.

Example non-interactive install:

```bash
node scripts/install.mjs \
  --domain example.link \
  --customize-public \
  --languages en,fr \
  --wordmark-black example. \
  --wordmark-green link
```

## Local install and publish behavior

`npm run local-install` configures local workstation tooling. It checks for `jq`; if `jq` is missing, it prints platform-specific install suggestions and stops. It can install the shell helper and copies `scripts/lnk` to the configured local bin path.

The shell helper is shell-neutral as `scripts/v8s.sh`; the older Zsh wrapper is compatibility only. New documentation should avoid describing the helper as inherently Zsh-only.

`npm run build` writes `build/v8s.json`. It also copies that registry to the configured local registry path only when local config enables the shell helper and a custom local config exists.

`npm run update` is an alias for the upgrade workflow. It refreshes product-owned files from upstream. `npm run upgrade` remains the underlying command.

`npm run local-publish` runs checks, stages configured local paths, commits, and pushes. The default configured path is `custom`, and the default commit message is `chore: update local vanityURLs configuration`.

## CLI decisions

`scripts/lnk` is the source-editing CLI for links, schedules, and policies.

Important current CLI behavior:

- `scripts/lnk --help` and `scripts/lnk version` read the version from `package.json`.
- `lnk` writes links to `custom/v8s-links.txt`, creating it when needed.
- `V8S_REPO` points the installed CLI to the local repository.
- `V8S_LINKS_OWNER` is the owner environment variable. The older `LNK_OWNER` alias was removed.
- `lnk list` shows link entries; `lnk list SLUG` filters to a slug.
- `lnk list policy`, `lnk list categories`, `lnk list domain`, `lnk list domain block`, `lnk list domain allow`, and `lnk list keyword` inspect policy data.
- JSON output is useful for automation or exact inspection; human output is the default for ordinary CLI use.

The intended mental model is that `lnk` edits source files, then the owner runs `npm run build`, `npm run check`, or `npm run local-publish` to validate and publish the change.

## Branding and badges

The localized redirected badges live in:

```text
defaults/public/en/v8s-redirected.svg
defaults/public/en/v8s-redirected-dark.svg
defaults/public/fr/v8s-redirected.svg
defaults/public/fr/v8s-redirected-dark.svg
defaults/public/es/v8s-redirected.svg
defaults/public/es/v8s-redirected-dark.svg
defaults/public/it/v8s-redirected.svg
defaults/public/it/v8s-redirected-dark.svg
defaults/public/de/v8s-redirected.svg
defaults/public/de/v8s-redirected-dark.svg
```

The English assets are also copied to the build root so existing root references keep working.

Translations used by the badges:

- English: `redirected by vanityURLs.link`
- French: `redirigé par vanityURLs.link`
- Spanish: `redirigido por vanityURLs.link`
- Italian: `reindirizzato da vanityURLs.link`
- German: `weitergeleitet von vanityURLs.link`

Use `npm run optimize:badges` to reproduce the SVGO cleanup against all default redirected badge SVGs.

## Headers and generator identity

Default `_headers` now includes:

```text
X-Generated-By: vanityURLs.link
```

Raw runtime files such as `/v8s.json`, `/v8s-blocklist.json`, and `/v8s-site-config.json` should remain blocked from direct public access.

## Decisions to assess in docs

Review and update any page that still says:

- source policy is `v8s-blocklist.json` instead of `v8s-policies.json`
- Worker source lives in `scripts/src/` instead of `scripts/workers/`
- the shell helper is Zsh-only
- custom blocklist policy merges with defaults instead of replacing source policy
- all default languages should appear even after an owner customizes only one or two language folders
- policy pages exist only as custom examples
- `lnk` writes to defaults when custom links do not exist

Documentation should consistently preserve the distinction between source files, runtime generated files, and workstation-local files.
