---
title: "Keeping vanityURLs upgradable with custom overrides"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Why vanityURLs keeps product defaults separate from instance-owned links, branding, policy, and public pages."
tags: ["customization", "upgrades", "git"]
featured: false
---

The easiest way to make a small self-hosted tool painful is to edit everything in place. It feels fast on day one, then every upgrade becomes detective work: which files came from upstream, which files belong to the instance, and which generated files can be safely replaced?

vanityURLs avoids that by keeping a simple boundary. Product-owned files live in `defaults/` and `scripts/`. Instance-owned files live in `custom/`. Generated output lives in `build/` and `src/`.

That boundary is not bureaucracy. It is what makes a self-hosted redirector stay boring after the first deployment.

## Defaults are the product baseline

`defaults/` contains the files that ship with vanityURLs: public pages, localized status pages, redirected badges, sample links, default policy, protected dashboard shell, test page, and site configuration.

Those files should be easy to refresh from upstream. When vanityURLs improves default pages, hardens policy, fixes generated assets, or changes Worker assumptions, the instance owner should be able to receive those changes without hunting through local branding edits.

## Custom is the instance layer

`custom/` contains the choices that make the instance yours:

- redirect inventory
- scheduled link behavior
- local allow/block policy
- site configuration and supported languages
- public page overrides
- logos, icons, badges, and machine-readable policy files
- local helper configuration

When those choices live under `custom/`, upgrades become a normal Git review instead of a merge archaeology session.

## Generated output is disposable

`build/` and generated `src/` are deployment output. They are important at runtime, but they are not where an operator should make durable changes.

Edit the source layer, then rebuild. That keeps the deployed Worker, runtime registry, runtime blocklist, and site config reproducible from reviewed files.

## The upgrade story

The point of `custom/` is to make upgrades boring. Upstream can refresh `defaults/`, `scripts/`, validation logic, dependency files, and generated runtime behavior while the instance keeps its own links, schedules, policies, branding, public pages, local helper settings, and site configuration.

That means most instance customization should avoid direct edits to:

- `defaults/`, because upstream owns the baseline files
- `scripts/workers/`, unless you intend to maintain a Worker fork
- `src/`, because it is generated for Wrangler compatibility
- `build/`, because it is generated deployment output

Use [Custom overrides](/docs/customize/custom-overrides/) for exact file paths and [Upgrading an instance](/docs/reference/upgrading/) for the upgrade workflow.
