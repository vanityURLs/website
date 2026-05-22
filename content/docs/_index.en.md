---
aside: false
title: "Documentation"
description: "v8s.link documentation for the current vanityURLs Worker, defaults, link registry, protection, and deployment model."
---

v8s.link is the public reference instance for the current vanityURLs runtime. The application builds a Cloudflare Worker with static assets, a generated `v8s.json` registry, default pages, optional custom overrides, [protected operational views](/docs/access-control/), [network protection](/docs/network-protection/), and abuse-prevention policy.

Start with Setup if you are creating a new short-link domain. Read the overview first, then use the Quickstart for the first deployment path: get a short domain, create a Cloudflare account, clone the repository, configure the Worker, deploy, and test.

Use Customize when you are moving from the plain default instance to your own link inventory, brand assets, public policy files, status pages, and localized pages. Use Reference for runtime details, security, analytics, admin views, and release work.

Use Reference for repository layout, generated runtime data, CLI behavior, migration notes, and the public v8s.link reference instance.

For long-lived instances, use the upgrading guide to refresh `defaults/` and `scripts/` while preserving `custom/`, `wrangler.toml`, secrets, and generated output.
