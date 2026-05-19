---
title: "CLI"
description: "Use the Node-based v8s CLI to manage links, schedules, and blocklist policy without Bash."
---

The repo-local CLI is `./scripts/lnk`. It is a Node executable, so it works on macOS, Linux, Windows, and CI environments where Node and Git are available.

Bash is not required for link management. The Zsh helper remains optional and separate.

## Requirements

- Node.js 20 or newer
- npm
- Git
- Wrangler for deployment commands
- A Cloudflare account only when deploying or managing Worker secrets

On Windows, run the commands from PowerShell, Windows Terminal, or a Git-aware shell. The CLI itself does not require WSL.

## Add links

```bash
./scripts/lnk https://github.com/vanityURLs github
./scripts/lnk https://www.linkedin.com/company/example social/linkedin --title LinkedIn --tags social --owner team
./scripts/lnk --splat https://docs.example.com/:splat docs
```

By default, the CLI writes to `custom/v8s-links.txt` when it exists. Override that with:

```bash
V8S_LINKS_FILE=custom/v8s-links.txt ./scripts/lnk https://example.com example
```

On Windows PowerShell:

```powershell
$env:V8S_LINKS_FILE="custom/v8s-links.txt"
node ./scripts/lnk https://example.com example
```

The CLI appends the row, runs `git add`, commits with `feat(links): add SLUG`, and pushes. Use `DRY_RUN=true` to print the row without writing.

## Add schedules

```bash
./scripts/lnk schedule add hangout https://zoom.us/j/work --label work --days mon,tue,wed,thu,fri --from 09:00 --to 17:00 --timezone America/Toronto --default https://discord.gg/personal
./scripts/lnk schedule list hangout
```

The schedule commands write `custom/v8s-schedules.json` by default, commit with `feat(schedules): update SLUG`, and push. Use `--dry-run` to inspect the JSON output.

Use `schedule default` later if you need to update the fallback target for a slug that already has at least one schedule rule.

## Manage blocklist policy

```bash
./scripts/lnk block categories
./scripts/lnk block add example-bad.test --category phishing --severity high --reason "Fake login page"
./scripts/lnk block keyword wallet-drain --category phishing --severity high --reason "Credential theft lure"
./scripts/lnk block allow example.com --reason "Owner-controlled domain"
```

Blocklist commands write `custom/v8s-blocklist.json`.

## Optional Zsh helper

`scripts/v8s.zsh` is an optional shell convenience for people who want to open known redirects from their terminal. It is separate from `./scripts/lnk`: the Node CLI edits link source files, while the Zsh helper only reads the generated runtime registry.

```zsh
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.zsh
```

The helper reads `~/.v8s.json` by default. `npm run build` can sync the generated `build/v8s.json` there on a local macOS workstation. If you keep the registry somewhere else, set `V8S_REGISTRY` before sourcing or using the helper:

```zsh
export V8S_REGISTRY=/path/to/YOUR-SHORT-DOMAIN/build/v8s.json
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.zsh
```

Useful commands:

```zsh
v8s --list
v8s docs
v8s --print docs
v8s --path
```

| Command | Behavior |
|---|---|
| `v8s --list` | Lists active `permanent` and `ephemeral` slugs from the registry. |
| `v8s docs` | Opens the target for the exact `docs` slug. |
| `v8s --print docs` | Prints the target without opening it. |
| `v8s --path` | Prints the registry path currently in use. |

The helper requires `jq` because it queries `links[]` in the generated JSON registry. On macOS, install it with Homebrew:

```bash
brew install jq
```

The helper is deliberately narrow:

- It does not create, edit, commit, or push links.
- It only opens exact slugs that already exist in `build/v8s.json` or the configured registry.
- It only opens links whose state is `permanent` or `ephemeral`.
- It refuses non-web targets and only opens `http://` or `https://` URLs.
- It validates slug input before looking up the target.

Use `./scripts/lnk` when you want to change the instance. Use `v8s` when you want a fast local shortcut to an existing redirect.
