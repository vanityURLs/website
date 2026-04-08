---
title: "Redirects as Code: Managing Short Links the GitOps Way"
date: 2025-03-10
author: "Benoît H. Dicaire"
description: "What happens when you treat your URL redirects like infrastructure — versioned, reviewed, and deployed via CI/CD?"
tags: ["guide", "tutorial"]
featured: false
---

Most URL shorteners are black boxes. You log in through a web UI, create a link, and hope the service stays running. When something breaks — a link stops working, a campaign URL points to the wrong page, someone accidentally deleted a redirect — there's no audit trail, no rollback, no way to know who changed what and when.

vanityURLs takes a different approach: your redirects live in a plain text file, in a Git repository, deployed via Cloudflare Pages. This is GitOps applied to URL management.

## The file is the source of truth

Your entire redirect table is two files:

```
# static.lnk — permanent links
/github      https://github.com/bhdicaire         301
/linkedin    https://linkedin.com/in/bhdicaire    301
/portfolio   https://bhdicaire.com               301

# dynamic.lnk — time-limited links
/devconf     https://devconf.cz/talk/2025         302
/survey      https://forms.example.com/q/spring   302
```

These get merged at build time:

```bash
cat static.lnk dynamic.lnk > build/_redirects
```

That's the entire pipeline. No database. No API. No server.

## Every change is a commit

When you add a link with `lnk add`:

```bash
lnk add /github https://github.com/bhdicaire
lnk deploy "add github link"
```

What happens under the hood:

```
[main 3a7f1c2] add github link
  Date: Mon Apr 1 09:12:44 2025
  1 file changed, 1 insertion(+)
  diff --git a/static.lnk b/static.lnk
  +/github  https://github.com/bhdicaire  301
```

You now have a full audit trail:
- **Who** made the change (Git author)
- **When** it happened (commit timestamp)
- **What** changed (diff)
- **Why** (commit message)

## Pull requests for link reviews

For teams, you can require pull request approval before any redirect goes live:

```yaml
# .github/branch-protection.yml
main:
  required_pull_request_reviews: 1
  require_status_checks:
    - lnk validate --live
```

Someone wants to add a campaign link? Open a PR. The CI validates the URL is reachable. A teammate reviews it. Merge deploys it automatically.

This prevents the classic problems:
- Typos in destination URLs go live undetected
- Broken links from deleted pages aren't caught
- No visibility into who added a campaign link six months ago

## Rollback is just `git revert`

Third-party URL shorteners have no rollback. With vanityURLs:

```bash
# A redirect is pointing somewhere wrong
git log --one-liner static.lnk
a3f7c12 add summit conference link
8b2c4f1 update linkedin url
...

# Revert the bad commit
git revert a3f7c12 --no-edit
git push

# Cloudflare deploys the correction in 15 seconds
```

No support ticket. No UI. No waiting.

## The validate step

Before any deployment, `lnk validate` catches common mistakes:

```bash
$ lnk validate --live
Validating static.lnk... OK ✓
Validating dynamic.lnk...
  WARNING: /old-summit → https://summit2023.example.com  (404 Not Found)
1 warning found.
```

This is the same principle as `terraform plan` before `terraform apply` — review your changes before they go live.

## Summary

Managing redirects as code means:

- **Full history** of every link, every change, every person
- **Peer review** via pull requests before links go live
- **Validation** catches broken destinations before deployment
- **Rollback** is a single `git revert`
- **Zero cost** — all of this runs on free-tier GitHub and Cloudflare

This is what "infrastructure as code" looks like for URL management. Your links are as auditable and reliable as the rest of your infrastructure.

[Read the full CLI reference →](/docs/commands/)
