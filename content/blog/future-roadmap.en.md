---
title: "What comes next for v8s.link"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "A draft roadmap for making v8s easier to install, update, and operate without making the runtime heavier."
tags: ["roadmap", "operations"]
draft: true
---

The next challenge is not the first install. A new v8s instance can already be created quickly.

The harder problem is long-term ownership: how does an instance safely receive upstream improvements to `defaults/` and `scripts/` while preserving everything in `custom/`?

## The upgrade principle

The project should keep the contract simple:

- product-owned files live in `defaults/` and `scripts/`
- instance-owned files live in `custom/`
- generated output can be rebuilt
- secrets stay in Cloudflare or local secret storage
- documentation lives on the website, not duplicated in every instance repo

That contract makes a future upgrade tool possible without requiring a package manager on day one.

## Near-term tooling

The current direction is a scripted upgrade workflow:

1. run `npm run clean`
2. fetch the upstream release
3. preview changes to `defaults/` and `scripts/`
4. keep `custom/`, `wrangler.toml`, and secrets untouched
5. run `npm run check`
6. show the owner exactly what changed before deploy

This is more important than a Homebrew formula right now. A package manager can install a tool, but it cannot replace a careful merge policy.

## CLI and terminal workflow

The `v8s.zsh` helper should remain focused: inspect the generated registry, open or copy known redirects, and refuse arbitrary terminal targets. It is a convenience layer over the validated registry, not a second source of truth.

That gives power users a fast terminal workflow without weakening the runtime model.

## Public instance later

The public `v8s.link` instance should arrive with the operational lessons already built in:

- clear terms and privacy responsibilities
- blocklist policy and abuse reporting
- server-side analytics only
- WAF and bot protection guidance
- boring default public files for robots and LLM crawlers
- documentation that says exactly where Cloudflare settings live

The project should grow by making the simple path safer, not by turning the Worker into an application platform.
