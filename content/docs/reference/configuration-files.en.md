---
aside: false
title: "Configuration files"
description: "Reference the vanityURLs source, custom, local, and generated configuration files."
weight: 30
aliases:
  - /docs/configuration-files/

---

vanityURLs keeps product defaults, instance-owned choices, local workstation settings, and generated runtime artifacts in separate files.

| File | Purpose |
| --- | --- |
| `defaults/v8s-site-config.json` | Product baseline for languages, operator fields, and link CLI defaults |
| `custom/v8s-site-config.json` | Instance-owned site settings. Details are in [Site config](#site-config) below |
| `custom/v8s-links.txt` | [Human-authored source of truth for links](/docs/reference/link-format/) |
| `custom/v8s-policies.json` | Instance-owned blocklist and policy choices |
| `custom/v8s-local-config.json` | Workstation-only helper paths written by `npm run local-install` |
| `build/v8s.json` | Generated runtime redirect registry |
| `build/v8s-blocklist.json` | Generated runtime blocklist policy |
| `build/v8s-site-config.json` | Generated site configuration used by the Worker build |

## Site Config

`custom/v8s-site-config.json` is the main setup file written by `npm run setup`. It stores instance-owned site settings, including languages, branding, operator contacts, legal-page mode, and link CLI defaults. The important top-level sections are:

| Section | Purpose |
| --- | --- |
| `i18n` | Default language and supported languages |
| `operator` | Operator identity, contacts, legal-page mode, analytics disclosure, and response window |
| `links` | Default generated slug length and tag-specific generated slug lengths for `lnk` |
| `branding` | Short domain, installer-managed public-page flag, and split-color wordmark |

Example:

```json
{
  "i18n": {
    "default_language": "en",
    "supported_languages": ["en", "fr"]
  },
  "links": {
    "random_slug_length": 3,
    "tag_random_slug_lengths": {
      "social": 5
    }
  },
  "branding": {
    "domain": "example.link",
    "custom_public": true,
    "wordmark": {
      "black": "example.",
      "green": "link"
    }
  }
}
```

Do not edit generated files in `build/`. Edit `custom/`, then rebuild with `npm run check`.

## Public overlay order

The public asset build is deterministic:

1. Copy `defaults/public/` into `build/`
2. Overlay `custom/public/` when it exists
3. Copy the default `defaults/public/_stats/index.html`
4. Overlay `custom/public/_stats/index.html` when it exists
5. Prune unsupported language directories based on `v8s-site-config.json`
6. Build `v8s.json`, `v8s-blocklist.json`, and `v8s-site-config.json`
7. Generate `src/` from `scripts/workers/` for Wrangler

## Runtime artifacts

The Worker does not read `v8s-links.txt` on every request. The build creates runtime artifacts from source files, validates them, and deploys them with the Worker assets.

Build inputs include:

- `defaults/v8s-links.txt`, replaced by `custom/v8s-links.txt` when present
- `defaults/v8s-schedules.json`, with `custom/v8s-schedules.json` merged over it
- `defaults/v8s-policies.json`, replaced by `custom/v8s-policies.json` when present
- `defaults/v8s-site-config.json`, with `custom/v8s-site-config.json` merged into site-level choices
- static page assets from `defaults/public/`, overlaid by `custom/public/`
- generated blocklist feed data when `npm run generate:blocklist` has produced it

The build writes:

| Artifact | Purpose |
| --- | --- |
| `build/v8s.json` | Redirect registry consumed by the Worker |
| `build/v8s-blocklist.json` | Runtime policy artifact consumed by the Worker |
| `build/v8s-site-config.json` | Site configuration used by the build |
| `src/worker.mjs` | Generated Worker entry copied from `scripts/workers/` for Wrangler |

`scripts/workers/` is the Worker source of truth. `src/` is generated output. Direct public requests for raw runtime files such as `/v8s.json`, `/v8s-blocklist.json`, and `/v8s-site-config.json` should return 404.
