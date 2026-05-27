---
aside: false
title: "Upgrading an instance"
description: "Refresh vanityURLs product files with npm run upgrade while preserving instance-owned configuration."
weight: 120
aliases:
  - /docs/upgrading/

---

Use `npm run upgrade` to refresh an existing vanityURLs instance. The command updates the product-owned files and leaves your instance-owned files alone.

Run it from a clean worktree:

```bash
npm run upgrade
```

The command fetches the configured upstream source, refreshes product files such as `defaults/` and `scripts/`, runs the project checks, and leaves a normal Git diff for review.

## What stays yours

The upgrade workflow does not replace:

- `custom/`
- `wrangler.toml`
- `.dev.vars`
- Cloudflare secrets
- generated `build/` output

That keeps your links, branding, policies, legal pages, Access configuration, analytics settings, and deployment shape under your control.

## Review and publish

After the command finishes:

```bash
git status --short
git diff
npm run check
git add defaults scripts
git commit -m "chore: upgrade vanityurls runtime"
git push
```

If the command stops, read the error and inspect `git status --short` before retrying. If you are migrating an older Cloudflare Pages `_redirects` instance to the Worker runtime, read [Migrating from Cloudflare Pages redirects to vanityURLs Workers](/blog/migrating-from-cloudflare-pages-redirects/) first.
