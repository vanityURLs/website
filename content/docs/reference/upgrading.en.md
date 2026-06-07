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

The command fetches the configured upstream source, refreshes product files such as `defaults/` and `scripts/`, runs the project checks, and leaves a normal Git diff for review. If package dependency definitions changed during the refresh, the upgrade runs `npm install` before validation so local tooling matches the updated product files.

## Release source

By default, `npm run upgrade` resolves the latest stable upstream release tag, such as `v3.3.1`, and refreshes product files from that tag. It should not pull unreleased commits from `main` unless you ask for them.

Use an explicit release when you need to pin an upgrade:

```bash
npm run upgrade -- --ref v3.3.1
```

Use `main` only for test instances or maintainer validation:

```bash
npm run upgrade -- --ref main
```

{{< callout type="note" title="Defaults are inherited" >}}
You do not need to rerun setup just to receive new product defaults. The build merges `defaults/v8s-site-config.json` with `custom/v8s-site-config.json`, so missing additive fields inherit the product baseline. Rerun `npm run setup` only when you want to change instance-owned answers.
{{< /callout >}}

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
git add defaults scripts package.json package-lock.json .npmrc .prettierignore
git commit -m "chore: upgrade vanityurls runtime"
git push
```

If the command stops, read the error and inspect `git status --short` before retrying. If you are migrating an older Cloudflare Pages `_redirects` instance to the Worker runtime, read [Migrating from Cloudflare Pages redirects to vanityURLs Workers](/blog/migrating-from-cloudflare-pages-redirects/) first.
