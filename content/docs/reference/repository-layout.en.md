---
aside: false
title: "Repository layout"
description: "How a current vanityURLs instance is organized around product defaults, instance-owned custom files, build output, local tooling, and Worker source."
weight: 90
aliases:
  - /docs/repository-layout/

---

A vanityURLs instance keeps product-owned files separate from instance-owned files. That is what makes `npm run upgrade` practical: upstream can refresh `defaults/` and `scripts/`, while your links, branding, policy choices, and Cloudflare deployment settings stay under your control.

The public [v8s.link repository](https://github.com/vanityURLs/v8s.link) follows this layout:

{{< filetree/container >}}
{{< filetree/file name="package.json" annotation="npm scripts and dependencies" >}}
{{< filetree/file name="package-lock.json" annotation="locked dependency graph" >}}
{{< filetree/file name="wrangler.toml" annotation="Cloudflare Worker deployment settings" >}}
{{< filetree/folder name="defaults" annotation="product baseline refreshed by upgrade" >}}
  {{< filetree/folder name="public" annotation="default pages, assets, badges, status pages, and headers" >}}
    {{< filetree/file name="_headers" annotation="static asset cache and no-index headers" >}}
    {{< filetree/file name="robots.txt" >}}
    {{< filetree/file name="style.css" >}}
    {{< filetree/file name="script.js" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="v8s-links.txt" annotation="starter link inventory and inline schedules" >}}
  {{< filetree/file name="v8s-policies.json" annotation="default trust-and-safety policy" >}}
  {{< filetree/file name="v8s-blocklist-categories.json" annotation="policy category labels" >}}
  {{< filetree/file name="v8s-language-metadata.json" annotation="localized generated-page labels" >}}
  {{< filetree/folder name="legal" annotation="default generated legal and trust copy" >}}
    {{< filetree/file name="v8s-legal-content.json" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="v8s-site-config.json" annotation="default languages, branding, and operator values" >}}
  {{< filetree/file name="v8s-local-config.json" annotation="default workstation helper settings" >}}
{{< /filetree/folder >}}
{{< filetree/folder name="custom" annotation="instance-owned overrides" >}}
  {{< filetree/folder name="public" annotation="instance branding, pages, assets, and headers" >}}
    {{< filetree/file name="_headers" >}}
    {{< filetree/file name="robots.txt" >}}
    {{< filetree/file name="style.css" >}}
    {{< filetree/file name="script.js" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="v8s-links.txt" annotation="human-authored source of truth for links" >}}
  {{< filetree/file name="v8s-site-config.json" annotation="instance languages, branding, operator values, and contacts" >}}
{{< /filetree/folder >}}
{{< filetree/folder name="scripts" annotation="product tooling" >}}
  {{< filetree/folder name="workers" annotation="canonical Worker source and tests" >}}
    {{< filetree/file name="worker.mjs" >}}
    {{< filetree/file name="worker.test.mjs" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="lnk" annotation="CLI for links, schedules, and policy workflows" >}}
  {{< filetree/file name="build.mjs" annotation="build defaults plus custom into deploy output" >}}
  {{< filetree/file name="install.mjs" annotation="npm run setup" >}}
  {{< filetree/file name="upgrade.mjs" annotation="npm run upgrade" >}}
  {{< filetree/file name="local-install.mjs" annotation="local helper setup" >}}
  {{< filetree/file name="v8s.sh" annotation="read-only local helper" >}}
{{< /filetree/folder >}}
{{< filetree/folder name="src" annotation="generated Worker entry copied from scripts/workers" >}}
  {{< filetree/file name="worker.mjs" >}}
{{< /filetree/folder >}}
{{< filetree/folder name="build" annotation="generated deploy output" >}}
  {{< filetree/file name="v8s.json" annotation="runtime redirect registry" >}}
  {{< filetree/file name="v8s-blocklist.json" annotation="runtime policy artifact" >}}
  {{< filetree/file name="v8s-site-config.json" annotation="runtime site configuration" >}}
  {{< filetree/file name="_headers" >}}
  {{< filetree/file name="index.html" >}}
  {{< filetree/folder name="_stats" annotation="protected stats shell" >}}
    {{< filetree/file name="index.html" >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="_tests" annotation="protected runtime test page" >}}
    {{< filetree/file name="index.html" >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="en" annotation="localized public pages and assets" >}}
    {{< filetree/file name="index.html" >}}
    {{< filetree/file name="404.html" >}}
    {{< filetree/file name="expired.html" >}}
    {{< filetree/file name="disabled.html" >}}
    {{< filetree/file name="maintenance.html" >}}
  {{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

## Product Defaults

`defaults/` is the product baseline. It contains public pages, localized status pages, redirected badges, policy pages, icons, the protected stats shell, starter links, inline starter schedules, default policy, site configuration, and local-helper defaults.

`scripts/` is product tooling. Edit it only when you are changing vanityURLs itself. Instance operators usually receive updates to this directory through `npm run upgrade`.

## Instance Files

`custom/` belongs to the instance owner. Put links, brand assets, page overrides, site configuration, local helper configuration, and policy replacement here.

The build prefers `custom/v8s-links.txt` when it exists. If it does not, the build falls back to `defaults/v8s-links.txt` so a fresh clone can still produce a working starter instance.

`custom/v8s-policies.json` replaces the default policy source when present. It is not merged with `defaults/v8s-policies.json`; removed custom policy decisions should not reappear through a default merge.

`wrangler.toml` also belongs to the instance. It defines the Worker name, route or custom domain, build command, and Cloudflare Access team domain.

## Generated Output

`build/` and `src/` are generated. Do not edit them by hand.

`build/v8s.json` is the runtime redirect registry. It contains normalized link targets, the schema 3.0 `tree`, routing rules, lifecycle states, metadata, generated timestamps, and optional schedule blocks.

`build/v8s-blocklist.json` is the runtime policy artifact consumed by the Worker. It is generated from the selected policy source and optional generated feed data.

`build/v8s-site-config.json` records the site configuration used for the build, including supported languages, branding, operator information, and contact settings.

`build/v8s-release-manifest.json` records the release package version, Git commit, schema versions, Cloudflare compatibility date, and SHA-256 hashes for release inputs and outputs.

`src/worker.mjs` and `src/lib/analytics-policy.mjs` are generated during `npm run build` so Wrangler can deploy the Worker and its support modules. The source of truth is `scripts/workers/`. `npm run clean` removes generated `build/`, `src/`, and old compatibility output.
