---
aside: false
title: "Local helper"
description: "Use the read-only v8s shell helper to open known redirects from your terminal."
weight: 10
aliases:
  - /docs/local-helper/
---

The local helper is the `v8s` terminal command. It lets you open a known short link directly from your terminal instead of switching to a browser first, typing the short domain, and waiting for the redirect. For day-to-day work, that makes repeat links faster to reach.

The helper is deliberately read-only. It reads a generated registry such as `build/v8s.json` or `~/.v8s.json`, opens exact slugs that already exist, and refuses targets that are not web URLs. It does not create, edit, commit, or push links. It only opens `permanent` and `ephemeral` links with `http://` or `https://` targets after validating the slug input.

The helper is separate from the [CLI](/docs/command-line-interface/lnk/). Use `./scripts/lnk` when you want to change the instance: the `lnk` CLI edits source files in `custom/`, commits, and pushes. Use `v8s` when you want a fast local shortcut to an existing redirect.

## Requirements

- A configured vanityURLs repository available locally
- Node.js 20 or newer
- npm
- Git
- [`jq`](https://jqlang.org/)
- A POSIX-compatible shell that can source `scripts/v8s.sh`, such as `sh`, Bash, or Zsh

Shells with different scripting models, such as Fish or PowerShell, can still run the project commands, but they cannot source `scripts/v8s.sh` directly without a compatibility layer.

## Install helper

Run the workstation setup command from your vanityURLs repository:

```bash
npm run local-install
```

The command checks for `jq`, installs the POSIX-compatible helper from `scripts/v8s.sh` when requested, copies `scripts/lnk` to the configured local bin path, and records paths in `custom/v8s-local-config.json`.

## Configure registry

`npm run local-install` writes workstation-specific helper settings to `custom/v8s-local-config.json`. That file stores the helper install path, shell rc file, local registry path, repository path, and `lnk` install path. It is separate from `custom/v8s-site-config.json`, which stores public instance settings used by the website and Worker.

The helper reads the configured local registry path, usually `~/.v8s.json`. `npm run build` writes `build/v8s.json` and copies it to the configured local registry only when local config enables the helper.

If you keep the registry somewhere else, set `V8S_REGISTRY` before sourcing or using the helper:

```zsh
export V8S_REGISTRY=/path/to/YOUR-SHORT-DOMAIN/build/v8s.json
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.sh
```

## Use helper

| Command            | Behavior                                                         |
| ------------------ | ---------------------------------------------------------------- |
| `v8s --list`       | Lists active `permanent` and `ephemeral` slugs from the registry |
| `v8s slug`         | Opens the target for the exact `slug` value                      |
| `v8s --print slug` | Prints the target without opening it                             |
| `v8s --path`       | Prints the registry path currently in use                        |
