---
title: "Customize overview"
description: "How defaults, custom files, and the build output fit together before you customize a vanityURLs instance."
---

Customization starts with one rule: source files live in `defaults/` and `custom/`, but the Worker reads generated files from `build/`.

Think of `defaults/` as the product baseline and `custom/` as the instance overlay. The build combines both into the runtime assets that Cloudflare deploys.

```text
defaults + custom -> build -> build/v8s.json and build/v8s-blocklist.json
```

## Source files

`defaults/` includes these configuration-like source files:

```text
defaults/v8s-links.txt
defaults/v8s-blocklist.json
defaults/v8s-blocklist-categories.json
defaults/v8s-schedules.json
```

`custom/` can replace, merge, or overlay selected defaults before build:

| Custom file | Build behavior |
|---|---|
| `custom/v8s-links.txt` | Replaces `defaults/v8s-links.txt` as the link source. |
| `custom/v8s-blocklist.json` | Merges with `defaults/v8s-blocklist.json`. |
| `custom/v8s-schedules.json` | Merges over `defaults/v8s-schedules.json`. |
| `custom/public/` | Overlays `defaults/public/`. |

The defaults keep a plain instance working. The custom files make the deployed instance yours.

## Runtime output

After build, the generated redirect registry is:

```text
build/v8s.json
```

It is not named `v8s-links.json`, and it is not generated into both `defaults/` and `custom/`. Link source files are inputs; `build/v8s.json` is the runtime output.

The build also writes the runtime blocklist:

```text
build/v8s-blocklist.json
```

Cloudflare deploys the Worker source and the built static assets from `build/`. Local edits should happen in `custom/`, then `npm run check` or `npm run build` should regenerate the runtime files.

## Build code

The build flow lives in:

- [`scripts/build.mjs`](https://github.com/vanityURLs/vanityURLs/blob/main/scripts/build.mjs)
- [`scripts/build-redirect-targets.mjs`](https://github.com/vanityURLs/vanityURLs/blob/main/scripts/build-redirect-targets.mjs)

Use the detailed customization pages after this overview when you need exact file formats, status-page requirements, schedules, or blocklist policy.
