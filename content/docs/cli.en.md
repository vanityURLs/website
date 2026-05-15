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

`scripts/v8s.zsh` is a shell convenience for opening known redirects from the generated registry:

```zsh
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.zsh
v8s --list
v8s docs
v8s --print docs
```

It does not create links. It only opens active `http://` or `https://` targets already present in `~/.v8s.json`.
