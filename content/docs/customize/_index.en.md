---
aside: false
title: "Customize"
description: "Plan the phase-2 customization work after the first vanityURLs deployment is online."
weight: 20
aliases:
  - /docs/customize-overview/
---

After the Quickstart works, customization is where the instance becomes yours. Use this section when you are ready to refine links, branding, public pages, policy, access control, analytics, and operational settings.

For a practical map of what to customize first, read [Where to start customizing vanityURLs](/blog/where-to-start-customizing-vanityurls/).

The important rule is simple: edit `custom/`, not generated files in `build/`. Product defaults live in `defaults/`; your instance-owned choices live in `custom/`; the build combines both into the Worker assets and runtime JSON that Cloudflare deploys.

{{< mermaid >}}
flowchart LR
  A["defaults/<br/>Product baseline"] --> C["npm run build"]
  B["custom/<br/>Instance choices"] --> C
  C --> D["build/<br/>Generated output"]
  D --> E["Worker assets<br/>and runtime JSON"]
  E --> F["Cloudflare<br/>deployment"]
{{< /mermaid >}}
