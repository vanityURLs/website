---
aside: false
title: "Upgrading an instance"
description: "Keep custom instance files safe while refreshing vanityURLs defaults and scripts from upstream."
weight: 100
aliases:
  - /docs/upgrading/

---

Installing a vanityURLs instance is easy. Updating one safely is the part that needs a repeatable workflow, because the instance owner should keep links, branding, policy, and Cloudflare configuration while receiving new defaults, scripts, fixes, and security hardening.

If you are moving an older Cloudflare Pages `_redirects` instance to the current Worker runtime, use [Migrating from Cloudflare Pages redirects to vanityURLs Workers](/blog/migrating-from-cloudflare-pages-redirects/).

The rule is simple:

- instance-owned files live in `custom/`
- Cloudflare deployment settings live in `wrangler.toml`
- generated output is disposable
- upstream product files live in `defaults/` and `scripts/`
- generated Worker entry files live in `src/`

## Upgrade command

Run from a clean worktree:

```bash
npm run upgrade
```

`npm run update` is a convenience alias for the same upgrade workflow.

The command:

1. refuses to run if local changes are present
2. runs `npm run clean` first
3. fetches the configured upstream ref
4. replaces product-owned paths, currently `defaults/` and `scripts/`
5. runs `npm run check`
6. leaves a normal Git diff for review

If `npm run check` fails, the upgrade may already have refreshed `defaults/` and `scripts/` before stopping. Run `git status --short` and inspect the error before retrying. If the failure is caused by a bug that has since been fixed upstream, rerun `npm run upgrade` after confirming the newer release or commit is available on GitHub. For example, vanityURLs 2.7.1 fixed legacy scanner keyword handling for trusted PHP destination URLs.

Then review and commit:

```bash
git status --short
git diff
git add defaults scripts
git commit -m "chore: upgrade vanityurls runtime"
git push
```

## Protected local files

The upgrade tool refuses to replace:

- `custom/`
- `wrangler.toml`
- `.dev.vars`
- Cloudflare secrets
- generated `build/` output

That keeps local links, legal pages, privacy policy, source policy, branding, Access settings, analytics IDs, local helper paths, and deployment shape under the instance owner's control.
