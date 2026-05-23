---
aside: false
title: "LNK"
description: "Use the Node-based lnk command to manage links, schedules, and source policy in custom/."
weight: 20

---

`lnk` is the repository command-line interface for changing a vanityURLs instance. It edits source files in `custom/`, runs `npm run check`, then stages, commits, and pushes successful write operations.

Use it when you want the change to become part of your Git history and deploy through the normal Worker workflow. Use [Local helper](/docs/local-helper/) when you only want to open an existing redirect from the terminal.

## Requirements

- A configured vanityURLs repository available locally
- Node.js 20 or newer
- npm
- Git

Run the repo-local command:

```bash
./scripts/lnk --help
```

If you installed the workstation tools with `npm run local-install`, you can usually run `lnk` from any directory. Set `V8S_REPO` when an installed command needs to point at a specific local repository.

## Core commands

| Command | What it does |
| :--- | :--- |
| `./scripts/lnk LONG_URL [SLUG]` | Add a link to `custom/v8s-links.txt` |
| `./scripts/lnk --splat LONG_URL_WITH_:splat SLUG` | Add a splat link stored as `SLUG/*` |
| `./scripts/lnk list [SLUG]` | List generated registry entries from `build/v8s.json` |
| `./scripts/lnk schedule add SLUG TARGET ...` | Add or replace a scheduled target rule |
| `./scripts/lnk schedule default SLUG TARGET` | Set the fallback target for an existing schedule |
| `./scripts/lnk schedule list [SLUG]` | List schedule rules |
| `./scripts/lnk block add DOMAIN ...` | Add or update a blocked domain |
| `./scripts/lnk block keyword KEYWORD ...` | Add or update a blocked keyword |
| `./scripts/lnk block allow DOMAIN ...` | Add or update an allowed domain |
| `./scripts/lnk list policy` | Summarize the active source policy |
| `./scripts/lnk list categories` | List policy categories and severities |
| `./scripts/lnk list domain [block\|allow]` | List blocked and allowed domains |
| `./scripts/lnk list keyword` | List blocked keywords |
| `./scripts/lnk version` | Print the package version |

List commands accept `--format table` or `--format json`. Table is the default.

## Add links

```bash
./scripts/lnk https://github.com/vanityURLs github
./scripts/lnk https://www.linkedin.com/company/example social/linkedin --title LinkedIn --tags social --owner team
./scripts/lnk --splat https://docs.example.com/:splat docs
./scripts/lnk --state ephemeral --title "Launch" https://example.com campaign/launch
```

If you omit the slug, `lnk` generates a short random slug. Valid states are `permanent`, `ephemeral`, `expired`, `disabled`, `maintenance`, and `deactivated`.

Useful link options:

| Option | Purpose |
| :--- | :--- |
| `--state STATE` | Set the lifecycle state |
| `--title TEXT` | Add a human-readable title |
| `--description TEXT` | Add a human-readable description |
| `--tags TAGS` | Add comma-separated tags |
| `--owner OWNER` | Set the accountability label |
| `--expires-at DATE` | Set an ISO date or timestamp |
| `--notes TEXT` | Add internal notes |
| `--splat` | Store the slug as `SLUG/*` and require `:splat` in the target |

## List links

```bash
./scripts/lnk list
./scripts/lnk list social/linkedin
./scripts/lnk list --format json
```

`lnk list` reads the generated registry. If `build/v8s.json` does not exist, it runs `npm run build` first.

## Manage schedules

```bash
./scripts/lnk schedule add hangout https://zoom.us/j/work --label work --days mon,tue,wed,thu,fri --from 09:00 --to 17:00 --timezone America/Toronto --default https://discord.gg/personal
./scripts/lnk schedule default hangout https://discord.gg/personal --timezone America/Toronto
./scripts/lnk schedule list hangout
```

Schedule rules are written to `custom/v8s-schedules.json`. `schedule add` requires `--label`, `--days`, `--from`, and `--to`. Times use `HH:MM`; days use `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, and `sun`.

Use `--dry-run` on schedule commands to print the updated JSON without writing, checking, committing, or pushing.

## Manage source policy

```bash
./scripts/lnk list policy
./scripts/lnk list categories
./scripts/lnk list domain block
./scripts/lnk list keyword --format json
./scripts/lnk block add example-bad.test --category phishing --severity high --reason "Fake login page"
./scripts/lnk block keyword wallet-drain --category phishing --severity high --reason "Credential theft lure"
./scripts/lnk block allow example.com --reason "Owner-controlled domain"
```

Policy commands write `custom/v8s-policies.json`. The build turns the source policy into `build/v8s-blocklist.json`. Categories and severities are validated against `defaults/v8s-blocklist-categories.json`.

Use `--dry-run` on policy commands to print the updated JSON without writing, checking, committing, or pushing.

## Environment overrides

| Variable | Purpose |
| :--- | :--- |
| `DRY_RUN=true` | Print the planned change without writing, checking, committing, or pushing |
| `V8S_REPO=PATH` | Point an installed `lnk` command at a local vanityURLs repository |
| `V8S_LINKS_OWNER=OWNER` | Set the default owner value for new links |
| `V8S_LINKS_FILE=FILE` | Override the links file |
| `V8S_SCHEDULES_FILE=FILE` | Override the schedules file |
| `V8S_POLICY_FILE=FILE` | Override the policy file |

On Windows PowerShell:

```powershell
$env:V8S_REPO="C:\path\to\YOUR-SHORT-DOMAIN"
$env:V8S_LINKS_OWNER="team"
node ./scripts/lnk https://example.com example
```

## Write behavior

Successful link, schedule, and policy write operations run:

```text
npm run check
git add FILE
git commit -m OPERATION_MESSAGE
git push
```

Direct `lnk` write commands use operation-specific conventional commits, such as `feat(links): add SLUG`, `feat(schedules): update SLUG`, `feat(policies): block DOMAIN`, and `feat(policies): allow DOMAIN`.

For broader local publishing, `npm run local-publish` selects commit messages from `local_publish.commit_messages` in `defaults/v8s-local-config.json`, merged with `custom/v8s-local-config.json`. The default keys are:

| Key | Used when |
| :--- | :--- |
| `links` | Only `custom/v8s-links.txt` is staged |
| `policies` | Only `custom/v8s-policies.json` or `custom/v8s-blocklist.json` is staged |
| `site_config` | Only `custom/v8s-site-config.json` is staged |
| `mixed` | Multiple files or configured publish paths are staged |

Override the selected local-publish message with:

```bash
npm run local-publish -- --message "chore: update short-link configuration"
```

That means `lnk` is intentionally opinionated: it is for changes you are ready to validate and publish. Use `DRY_RUN=true` or command-specific `--dry-run` when you want to preview first.
