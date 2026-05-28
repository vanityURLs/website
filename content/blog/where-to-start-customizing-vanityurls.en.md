---
title: "Where to start customizing vanityURLs"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "A practical map for choosing the first customization area after a plain vanityURLs instance is online."
tags: ["customization", "setup", "operations"]
featured: false
---

Once the Quickstart works, the redirector is already useful. Customization is the part where it becomes yours: your links, your public pages, your brand, your policies, your access rules, and your operating habits.

You do not need to customize everything at once. Start with the area that hurts most.

| Goal | Start here |
| --- | --- |
| Change the public look and static pages | [Custom overrides](/docs/reference/custom-overrides/) |
| Configure the split-color wordmark and brand assets | [Brand](/docs/reference/brand/) |
| Add, inspect, or update short links | [LNK](/docs/command-line-interface/lnk/) and [Link format](/docs/reference/link-format/) |
| Add time-based destinations | [Scheduled links](/docs/reference/schedules/) |
| Decide which languages to publish | [Internationalization](/docs/reference/i18n/) |
| Configure jurisdiction and public trust contacts | [Jurisdiction](/docs/customize/jurisdiction/) |
| Protect private operational paths | [Access control](/docs/customize/access-control/) |
| Protect the domain before traffic reaches the Worker | [Network protection](/docs/customize/network-protection/) |
| Configure redirect analytics | [Analytics](/docs/customize/analytics/) |
| Tune allow/block policy | [Policy and blocklist](/docs/customize/blocklist/) |

The nicest path is usually not linear. A personal instance might start with links and branding. A team instance might start with Access control and owner labels. A public marketing domain might start with legal pages, analytics, and network protection.

The important thing is to keep each change small enough to validate. Make one area better, run the checks, deploy, and then move to the next area.
