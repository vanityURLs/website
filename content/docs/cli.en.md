---
aside: false
title: "LNK Command Line Interface"
description: "Use the Node-based v8s CLI to manage links, schedules, and source policy."
---

The repo-local CLI is `./scripts/lnk`. It is a Node executable, so it works on macOS, Linux, Windows, and CI environments where Node and Git are available.

The CLI edits source files in `custom/`. After edits, run `npm run build`, `npm run check`, or `npm run local-publish` to regenerate and publish runtime artifacts.

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

By default, the CLI writes to `custom/v8s-links.txt` and creates the file when needed. Override the repository path or owner with:

```bash
V8S_REPO=/path/to/YOUR-SHORT-DOMAIN V8S_LINKS_OWNER=team ./scripts/lnk https://example.com example
```

On Windows PowerShell:

```powershell
$env:V8S_REPO="C:\path\to\YOUR-SHORT-DOMAIN"
$env:V8S_LINKS_OWNER="team"
node ./scripts/lnk https://example.com example
```

`V8S_REPO` points an installed CLI to the local repository. `V8S_LINKS_OWNER` sets the default owner value for new links.

The CLI appends the row, runs `git add`, commits with `feat(links): add SLUG`, and pushes. Use `DRY_RUN=true` to print the row without writing.

## Check and update links

List current short links:

```bash
./scripts/lnk list
./scripts/lnk list social/x
```

Check generated active long links:

```bash
npm run build
npm run check:targets
```

`npm run check:targets` reads `build/v8s.json`, checks active `permanent` and `ephemeral` web targets, and reports unreachable long links with the slugs that use them.

Use local publish when you want the configured local paths validated, staged, committed, and pushed:

```bash
npm run local-publish
```

The default configured path is `custom`, and the default commit message is `chore: update local vanityURLs configuration`.

## Add schedules

```bash
./scripts/lnk schedule add hangout https://zoom.us/j/work --label work --days mon,tue,wed,thu,fri --from 09:00 --to 17:00 --timezone America/Toronto --default https://discord.gg/personal
./scripts/lnk schedule list hangout
```

The schedule commands write `custom/v8s-schedules.json` by default, commit with `feat(schedules): update SLUG`, and push. Use `--dry-run` to inspect the JSON output.

Use `schedule default` later if you need to update the fallback target for a slug that already has at least one schedule rule.

## Manage source policy

```bash
./scripts/lnk list policy
./scripts/lnk list categories
./scripts/lnk block add example-bad.test --category phishing --severity high --reason "Fake login page"
./scripts/lnk block keyword wallet-drain --category phishing --severity high --reason "Credential theft lure"
./scripts/lnk block allow example.com --reason "Owner-controlled domain"
```

Policy commands write `custom/v8s-policies.json`. The build turns the selected source policy into the runtime artifact `build/v8s-blocklist.json`.

## Local helper

Use `./scripts/lnk` when you want to change the instance. Use the read-only `v8s` helper when you want a fast local shortcut to an existing redirect.

See [Local helper](/docs/local-helper/) for installation, registry configuration, commands, and limits.
