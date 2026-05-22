---
aside: false
title: "Upgrading an instance"
description: "Keep custom instance files safe while refreshing vanityURLs defaults and scripts from upstream."
weight: 100

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

Then review and commit:

```bash
git status --short
git diff
git add defaults scripts
git commit -m "chore: upgrade vanityurls runtime"
git push
```

## Upstream remote

For a long-lived instance, add an upstream remote when your repository no longer tracks the vanityURLs product repository as `origin`. Most instances use `origin` for their own private or public deployment repository, so `upstream` gives Git a second name for the product source you want to pull updates from:

```bash
git remote add upstream https://github.com/vanityurls/v8s.git
npm run upgrade -- --remote upstream --ref main
```

Replace `https://github.com/vanityurls/v8s.git` with the Git repository URL you use as the product upstream for your own instance. If you fork or mirror the runtime, point `upstream` at that fork or mirror instead. You only need this when you are ready to refresh product-owned files such as `defaults/` and `scripts/`.

You can also point directly to a URL:

```bash
npm run upgrade -- --remote https://github.com/vanityurls/v8s.git --ref main
```

For a no-change rehearsal:

```bash
npm run upgrade -- --source HEAD --dry-run
```

## Protected local files

The upgrade tool refuses to replace:

- `custom/`
- `wrangler.toml`
- `.dev.vars`
- Cloudflare secrets
- generated `build/` output

That keeps local links, legal pages, privacy policy, source policy, branding, Access settings, analytics IDs, local helper paths, and deployment shape under the instance owner's control.

## Link maintenance

Link maintenance belongs with the link tools, not the upgrade workflow. Use [LNK](/docs/cli/) when you want to inspect, add, update, validate, commit, and push short-link changes. Use [Local helper](/docs/local-helper/) when you only want to open existing links quickly without editing source files.

## Why not Homebrew yet

Homebrew can be useful later for a standalone `v8s` CLI. It does not solve the hard part of this project today, which is safely refreshing a Git-backed instance without trampling local files. A repo-local upgrade command is easier to inspect, easier to test, and easier to adapt while the runtime is still moving quickly.
