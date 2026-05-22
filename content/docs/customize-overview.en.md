---
aside: false
title: "Customize overview"
description: "Plan the phase-2 customization work after the first vanityURLs deployment is online."
---

After the Quickstart works, customization is where the instance becomes yours. Phase 2 is not one task; it is a set of small decisions you can make in any order.

Start with the area that hurts most:

| Goal | Start here |
| :--- | :--- |
| Change the public look and static pages | [Custom overrides](/docs/custom-overrides/) |
| Configure the split-color wordmark and brand assets | [Brand](/docs/brand/) |
| Add, inspect, or update short links | [LNK Command Line Interface](/docs/cli/) and [Link format](/docs/link-format/) |
| Add time-based destinations | [Scheduled links](/docs/schedules/) |
| Decide which languages to publish | [Languages](/docs/i18n/) |
| Finish legal-page and analytics choices | [Setup decisions](/docs/setup-decisions/) |
| Protect private operational paths | [Access control](/docs/access-control/) |
| Configure redirect analytics | [Analytics](/docs/analytics/) |
| Tune allow/block policy | [Policy and blocklist](/docs/blocklist/) |

The important rule is simple: edit `custom/`, not generated files in `build/`. Product defaults live in `defaults/`; your instance-owned choices live in `custom/`; the build combines both into the Worker assets and runtime JSON that Cloudflare deploys.

For exact file behavior, use [Configuration files](/docs/configuration-files/) and [Custom overrides](/docs/custom-overrides/).
