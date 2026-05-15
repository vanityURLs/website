---
title: "Repository layout"
description: "How the current vanityURLs repository is organized around defaults, custom overrides, generated output, and Worker source."
---

The repository separates product defaults from instance-owned changes. That separation is what makes v8s.link useful as a reference implementation and lets future instances update upstream code without losing local branding.

```text
defaults/
  public/                 # default HTML, CSS, icons, localized pages
  public/_stats/          # read-only stats dashboard shell
  v8s-links.txt           # demo/default link registry
  v8s-schedules.json      # optional schedule rules
  v8s-blocklist.json      # default trust-and-safety policy
  v8s-blocklist-categories.json

custom/
  public/                 # instance branding and page overrides
  v8s-links.txt           # instance-owned links
  v8s-schedules.json      # instance schedules
  v8s-blocklist.json      # instance allow/block policy

scripts/
  src/
    worker.mjs            # canonical Worker runtime source
    worker.test.mjs       # Worker runtime tests
  lnk                     # Node CLI for links and schedules
  build.mjs               # build defaults + custom into deploy output
  clean.mjs               # remove generated output
  upgrade.mjs             # refresh product-owned files from upstream

build/
  v8s.json                # generated runtime registry
  v8s-blocklist.json      # generated trust-and-safety policy
  ...static assets...
```

## Defaults

`defaults/` is the product baseline. The public v8s.link instance uses these files to show a working shortener with the search-style home page, expand page, localized status pages, default icons, the protected stats shell, and sample links.

## Custom

`custom/` belongs to the instance owner. Put brand assets, favicon changes, page overrides, link lists, schedules, and local policy here.

The build prefers `custom/v8s-links.txt` when it exists. If it does not, the build falls back to `defaults/v8s-links.txt`, which is why a fresh clone can still produce a usable demo.

## Generated output

`build/v8s.json` is the runtime registry. It contains schema version `2.2`, routing rules, generated timestamps, normalized link targets, lifecycle states, metadata, and optional schedule blocks.

Cloudflare serves static pages from `build/`; the Worker reads `v8s.json` to resolve short links.

`src/` is generated during `npm run build` so Wrangler can deploy `src/worker.mjs`. It is not the source of truth. Edit `scripts/src/worker.mjs`, then let the build copy it into place. `npm run clean` removes generated `build/`, `src/`, and `functions/` output.
