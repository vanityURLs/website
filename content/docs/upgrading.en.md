---
title: "Upgrading an instance"
description: "Keep custom instance files safe while refreshing vanityURLs defaults and scripts from upstream."
---

Installing a vanityURLs instance is easy. Updating one safely is the part that needs a repeatable workflow, because the instance owner should keep links, branding, policy, and Cloudflare configuration while receiving new defaults, scripts, fixes, and security hardening.

The rule is simple:

- instance-owned files live in `custom/`
- Cloudflare deployment settings live in `wrangler.toml`
- generated output is disposable
- upstream product files live in `defaults/` and `scripts/`

## Upgrade command

Run from a clean worktree:

```bash
npm run upgrade
```

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

For a long-lived instance, add an upstream remote that points at the vanityURLs runtime source:

```bash
git remote add upstream https://github.com/dicaire/dicai-re.git
npm run upgrade -- --remote upstream --ref main
```

You can also point directly to a URL:

```bash
npm run upgrade -- --remote https://github.com/dicaire/dicai-re.git --ref main
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

That keeps local links, legal pages, privacy policy, blocklist overrides, branding, Access settings, analytics IDs, and deployment shape under the instance owner's control.

## Why not Homebrew yet

Homebrew can be useful later for a standalone `v8s` CLI. It does not solve the hard part of this project today, which is safely refreshing a Git-backed instance without trampling local files. A repo-local upgrade command is easier to inspect, easier to test, and easier to adapt while the runtime is still moving quickly.
