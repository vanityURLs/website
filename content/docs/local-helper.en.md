---
title: "Local helper"
description: "Use the read-only v8s shell helper to open known redirects from your terminal."
nav_order: 13
---

The local helper is the `v8s` terminal command. It reads the generated runtime registry and opens existing short links from your workstation.

The helper is separate from the [CLI](/docs/cli/). The `lnk` CLI edits source files in `custom/`, commits, and pushes. The `v8s` helper only reads a generated registry such as `build/v8s.json` or `~/.v8s.json`.

## Requirements

- A configured vanityURLs repository
- Node.js 20 or newer
- npm
- Git
- `jq`
- A shell that can source `scripts/v8s.sh`

On macOS, install `jq` with Homebrew:

```bash
brew install jq
```

## Install helper

Run the workstation setup command from your vanityURLs repository:

```bash
npm run local-install
```

The command checks for `jq`, installs the shell-neutral helper from `scripts/v8s.sh` when requested, copies `scripts/lnk` to the configured local bin path, and records paths in `custom/v8s-local-config.json`.

## Configure registry

The helper reads the configured local registry path, usually `~/.v8s.json`. `npm run build` writes `build/v8s.json` and copies it to the configured local registry only when local config enables the helper.

If you keep the registry somewhere else, set `V8S_REGISTRY` before sourcing or using the helper:

```zsh
export V8S_REGISTRY=/path/to/YOUR-SHORT-DOMAIN/build/v8s.json
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.sh
```

## Use helper

Useful commands:

```zsh
v8s --list
v8s docs
v8s --print docs
v8s --path
```

| Command | Behavior |
| --- | --- |
| `v8s --list` | Lists active `permanent` and `ephemeral` slugs from the registry |
| `v8s docs` | Opens the target for the exact `docs` slug |
| `v8s --print docs` | Prints the target without opening it |
| `v8s --path` | Prints the registry path currently in use |

## Limits

The helper is deliberately narrow:

- It does not create, edit, commit, or push links
- It only opens exact slugs that already exist in `build/v8s.json` or the configured registry
- It only opens links whose state is `permanent` or `ephemeral`
- It refuses non-web targets and only opens `http://` or `https://` URLs
- It validates slug input before looking up the target

Use `./scripts/lnk` when you want to change the instance. Use `v8s` when you want a fast local shortcut to an existing redirect.
