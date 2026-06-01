---
title: "Edit custom, leave defaults boring"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Why vanityURLs keeps product defaults separate from instance-owned links, branding, policy, and public pages."
tags: ["customization", "upgrades", "git"]
featured: false
---

The fastest way to ruin a small self-hosted tool is to edit upstream files in place.

It works once. Then the next upgrade asks a dull question with expensive consequences: which files are product defaults, which files are local decisions, and which files are generated output?

vanityURLs avoids that by keeping three layers:

| Layer                         | Owner    | Rule                  |
| ----------------------------- | -------- | --------------------- |
| `defaults/` and `scripts/`    | product  | refresh from upstream |
| `custom/`                     | instance | review and preserve   |
| `build/` and generated `src/` | build    | replace freely        |

That boundary is not bureaucracy. It is what keeps upgrades from becoming archaeology.

## Defaults Are The Product Baseline

`defaults/` contains the files vanityURLs ships: public pages, localized status pages, redirected badges, sample links, default policy, protected dashboard shell, test page, and site configuration.

Do not personalize them.

When vanityURLs improves default pages, hardens policy, fixes assets, or changes Worker assumptions, an instance should be able to accept those changes without sorting them from local branding edits.

## Custom Is The Instance Layer

`custom/` contains the decisions that make the instance yours:

- redirect inventory
- scheduled link behavior
- local allow/block policy
- site configuration and supported languages
- public page overrides
- logos, icons, badges, and machine-readable policy files
- local helper configuration

When those choices live under `custom/`, an upgrade is a Git review. When they are scattered through upstream files, it is a memory test.

## Generated Output Is Disposable

`build/` and generated `src/` are deployment output.

They matter at runtime. They are still the wrong place for durable edits. Change the source layer, then rebuild. The Worker, runtime registry, runtime blocklist, and site config should be reproducible from reviewed files.

## The Tradeoff

The boundary can feel fussy when you want to change one line.

Accept the friction. Fork `scripts/workers/` only when you intend to maintain a Worker fork. Edit `defaults/` only when you are changing the product baseline. Put instance behavior in `custom/`.

Use [Custom overrides](/docs/reference/custom-overrides/) for exact file paths and [Upgrading an instance](/docs/reference/upgrading/) for the upgrade workflow.
