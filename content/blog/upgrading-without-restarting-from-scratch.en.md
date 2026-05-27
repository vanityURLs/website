---
title: "You do not need to restart from scratch"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "How npm run upgrade and npm run setup let an existing vanityURLs instance receive product updates without rebuilding the instance from zero."
tags: ["upgrades", "operations", "git"]
featured: false
---

When a tool is still moving quickly, the tempting but exhausting instinct is to start over each time the installer improves. Delete the instance, clone again, answer the questions again, copy custom files back, hope nothing subtle was lost.

That is not the intended vanityURLs workflow.

An instance is designed to keep its local identity while the product layer improves around it. Your links, schedules, policies, branding, legal pages, Cloudflare settings, and helper configuration live in the instance layer. The upstream product files live in `defaults/` and `scripts/`. The generated output can be rebuilt.

## The two commands that matter

`npm run upgrade` refreshes product-owned files from upstream. It is the command that brings in newer defaults, scripts, validation logic, generated page behavior, and runtime hardening.

`npm run setup` reapplies the instance configuration with the current installer behavior. The installer is idempotent: it reads existing values, offers them as defaults, and updates the generated configuration instead of requiring a fresh clone.

That means an existing instance can adopt a better installer without losing its local choices.

## A practical update sequence

For the `v8s.link` instance, the update path is:

```bash
git pull
npm run upgrade
npm run setup
npm run check
git status
git add .
git commit -m "chore: update v8s.link instance"
git push
```

The same sequence works for another instance with its own repository name, worker name, short domain, and custom files.

## What to review before pushing

Treat the result like any other operational change. Review the Git diff, especially changes under `custom/`, `wrangler.toml`, and generated public pages.

If the diff only reflects the new product behavior and your expected instance answers, commit it and push. Cloudflare will rebuild from GitHub and your instance keeps moving forward without a rebuild-from-zero ritual.

Use [Upgrading an instance](/docs/reference/upgrading/) for the command reference and [Custom overrides](/docs/reference/custom-overrides/) for the file boundary between product defaults and instance-owned changes.
