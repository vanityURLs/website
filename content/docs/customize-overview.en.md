---
title: "Customize overview"
description: "How defaults, custom files, generated output, and local helper files fit together before you customize a vanityURLs instance."
---

Customization starts with one rule: source files live in `defaults/` and `custom/`, but the deployed Worker reads generated runtime files from `build/`.

Think of `defaults/` as the product baseline and `custom/` as the instance owner's layer. The build combines both into the static assets and runtime JSON that Cloudflare deploys.

```text
defaults + custom -> build -> build/v8s.json, build/v8s-blocklist.json, and build/v8s-site-config.json
```

## Source files

`defaults/` includes these configuration-like source files:

```text
defaults/v8s-links.txt
defaults/v8s-schedules.json
defaults/v8s-policies.json
defaults/v8s-blocklist-categories.json
defaults/v8s-site-config.json
defaults/v8s-local-config.json
```

`custom/` can replace, merge, or overlay selected defaults before build:

| Custom file | Build behavior |
|---|---|
| `custom/v8s-links.txt` | Replaces `defaults/v8s-links.txt` as the link source. |
| `custom/v8s-schedules.json` | Merges over `defaults/v8s-schedules.json`. |
| `custom/v8s-policies.json` | Replaces `defaults/v8s-policies.json` as the source policy file. |
| `custom/v8s-site-config.json` | Merges site-level choices such as `i18n.supported_languages` and branding. |
| `custom/public/` | Overlays `defaults/public/`. |

The legacy `v8s-blocklist.json` source name may still be recognized by migration code, but new documentation and new instances should use `v8s-policies.json` for editable policy.

## Runtime output

After build, the generated redirect registry is:

```text
build/v8s.json
```

It is not named `v8s-links.json`, and it is not generated into both `defaults/` and `custom/`. Link source files are inputs; `build/v8s.json` is the runtime output.

The build also writes:

```text
build/v8s-blocklist.json
build/v8s-site-config.json
```

`build/v8s-blocklist.json` is the runtime policy artifact consumed by the Worker. `build/v8s-site-config.json` records the site configuration used for the build, including supported languages and branding.

The Worker source of truth lives in `scripts/workers/`. During build, vanityURLs copies it into generated `src/` for Wrangler compatibility and patches the generated language list from `v8s-site-config.json`.

## Workstation files

`npm run local-install` can install local helper tooling and configure a workstation registry path. The repository-local runtime registry is `build/v8s.json`; the local helper cache is usually `~/.v8s.json`.

Those files have different jobs:

| File | Purpose |
|---|---|
| `build/v8s.json` | Build artifact deployed with the Worker assets. |
| `~/.v8s.json` | Optional local helper cache used by the shell helper. |

Local edits should happen in `custom/`, then `npm run check`, `npm run build`, or `npm run local-publish` should regenerate and validate the runtime files.

## Build code

The build flow lives in:

- [`scripts/build.mjs`](https://github.com/vanityURLs/vanityURLs/blob/main/scripts/build.mjs)
- [`scripts/build-redirect-targets.mjs`](https://github.com/vanityURLs/vanityURLs/blob/main/scripts/build-redirect-targets.mjs)

Use the detailed customization pages after this overview when you need exact file formats, status-page requirements, schedules, policy, or branding behavior.
