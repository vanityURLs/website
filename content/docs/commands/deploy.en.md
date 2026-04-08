---
title: "lnk deploy"
description: "Commit all pending link changes and push to trigger a Cloudflare deployment."
nav_order: 26
---

Commit your pending changes to `static.lnk` and `dynamic.lnk`, then push to the remote repository. Cloudflare Pages detects the push and deploys your updated redirects to the edge in approximately 15 seconds.

```bash
$ lnk deploy ["commit message"]
```

## Usage

```bash
$ lnk deploy "add github and linkedin links"
Validating redirects...  OK ✓
Committing changes...
  modified: static.lnk
  modified: dynamic.lnk
[main a3f7c12] add github and linkedin links
  2 files changed, 3 insertions(+), 1 deletion(-)
Pushing to origin/main...
Done. Deployment triggered on Cloudflare Pages.
Your links will be live in ~15 seconds.
```

## Options

| Option | Description |
|--------|-------------|
| `--no-validate` | Skip pre-deploy validation |
| `--dry-run` | Show what would be committed without pushing |
| `--branch BRANCH` | Push to a specific branch (default: `main`) |
| `--message TEXT`, `-m` | Commit message (can also be the first positional arg) |

## What lnk deploy does

{{% steps %}}

### Validate

Runs `lnk validate` automatically before committing. If validation fails, the deploy is aborted. Use `--no-validate` to skip this step.

### Stage changes

Runs `git add static.lnk dynamic.lnk build/_redirects` — only the link files and generated output. Other uncommitted changes in your repository are not included.

### Commit

Creates a git commit with your message. If no message is provided, lnk prompts for one interactively. If running non-interactively (e.g. in CI), uses a timestamped default: `lnk deploy 2025-04-02T09:15:32`.

### Push

Runs `git push origin HEAD`. Cloudflare Pages picks up the push via a webhook and starts a new build immediately.

{{% /steps %}}

## Examples

```bash
# Deploy with an explicit message
lnk deploy "add conference talk links for DevConf 2025"

# Preview what would be committed
lnk deploy --dry-run "test"
Would commit:
  modified: static.lnk (+2 lines)
  modified: dynamic.lnk (+1 line)
Would push to: origin/main

# Skip validation (not recommended)
lnk deploy --no-validate "emergency link fix"

# Deploy to a staging branch first
lnk deploy --branch staging "test new campaign links"
```

## Check the deployment

After pushing, monitor your deployment at:

```bash
open https://dash.cloudflare.com/pages
```

Or use the Cloudflare Pages API to poll build status:

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/pages/projects/$CF_PROJECT/deployments" \
  -H "Authorization: Bearer $CF_TOKEN" | jq '.[0].latest_stage'
```

{{< callout type="note" title="Validate before you deploy" >}}
`lnk validate --live` runs automatically unless you pass `--no-validate`. If any redirect destination returns a non-2xx/3xx response, the deploy is blocked. This protects you from publishing broken links.
{{< /callout >}}
