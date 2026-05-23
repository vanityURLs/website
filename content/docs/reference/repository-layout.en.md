---
aside: false
title: "Repository layout"
description: "How the current vanityURLs repository is organized around defaults, custom overrides, generated output, local tooling, and Worker source."
weight: 60
aliases:
  - /docs/repository-layout/

---

The repository separates product defaults from instance-owned changes. That separation lets an instance owner update upstream `defaults/` and `scripts/` without losing local links, branding, policy, or workstation choices.

```text
defaults/
  public/                         # default HTML, CSS, icons, localized pages, badges
  public/_stats/                  # read-only stats dashboard shell
  v8s-links.txt                   # demo/default link registry
  v8s-schedules.json              # optional schedule rules
  v8s-policies.json               # default trust-and-safety policy source
  v8s-blocklist-categories.json   # policy category and severity labels
  v8s-site-config.json            # default site languages and branding
  v8s-local-config.json           # default workstation helper settings

custom/
  public/                         # instance branding and page overrides
  v8s-links.txt                   # instance-owned links
  v8s-schedules.json              # instance schedules
  v8s-policies.json               # instance policy replacement
  v8s-site-config.json            # supported languages and branding choices
  v8s-local-config.json           # local helper and publish paths

scripts/
  workers/
    worker.mjs                    # canonical Worker runtime source
    worker.test.mjs               # Worker runtime tests
  lnk                             # Node CLI for links, schedules, and policies
  v8s.sh                          # shell-neutral local helper
  v8s.zsh                         # compatibility wrapper
  build.mjs                       # build defaults + custom into deploy output
  install.mjs                     # first-time instance setup
  local-install.mjs               # workstation helper setup
  local-publish.mjs               # validate, commit, and push configured local paths
  upgrade.mjs                     # refresh product-owned files from upstream

src/
  worker.mjs                      # generated from scripts/workers/ for Wrangler

build/
  v8s.json                        # generated runtime registry
  v8s-blocklist.json              # generated runtime policy artifact
  v8s-site-config.json            # generated site configuration artifact
  ...static assets...
```

## Defaults

`defaults/` is the product baseline. It contains the default public pages, localized status pages, localized redirected badges, policy pages, icons, protected stats shell, sample links, source policy, schedules, site configuration, and local-install defaults.

## Custom

`custom/` belongs to the instance owner. Put brand assets, page overrides, link lists, schedules, site configuration, local helper configuration, and policy replacement here.

The build prefers `custom/v8s-links.txt` when it exists. If it does not, the build falls back to `defaults/v8s-links.txt`, which is why a fresh clone can still produce a usable demo.

`custom/v8s-policies.json` replaces the default policy source. It is not merged with `defaults/v8s-policies.json`; removed custom policy decisions should not reappear through a default merge.

## Generated output

`build/v8s.json` is the runtime registry. It contains routing rules, generated timestamps, normalized link targets, lifecycle states, metadata, and optional schedule blocks.

`build/v8s-blocklist.json` is the runtime policy artifact consumed by the Worker. It is generated from the selected source policy and optional generated feed data.

`build/v8s-site-config.json` records the site configuration used for the build, including `i18n.supported_languages` and branding. The build also prunes unsupported language directories from `build/`.

`src/` is generated during `npm run build` so Wrangler can deploy `src/worker.mjs`. It is not the source of truth. Edit `scripts/workers/`, then let the build copy it into place. `npm run clean` removes generated `build/`, `src/`, and old compatibility output.
