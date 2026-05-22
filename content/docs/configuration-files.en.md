---
aside: false
title: "Configuration files"
description: "Reference the vanityURLs source, custom, local, and generated configuration files."
weight: 30
---

vanityURLs keeps product defaults, instance-owned choices, local workstation settings, and generated runtime artifacts in separate files.

| File | Purpose |
| :--- | :--- |
| `defaults/v8s-site-config.json` | Product baseline for languages and operator fields |
| `custom/v8s-site-config.json` | Instance-owned site settings. Details are in [Site config](#site-config) below |
| `custom/v8s-links.txt` | [Human-authored source of truth for links](/docs/link-format/) |
| `custom/v8s-policies.json` | Instance-owned blocklist and policy choices |
| `custom/v8s-local-config.json` | Workstation-only helper paths written by `npm run local-install` |
| `build/v8s.json` | Generated runtime redirect registry |
| `build/v8s-blocklist.json` | Generated runtime blocklist policy |
| `build/v8s-site-config.json` | Generated site configuration used by the Worker build |

## Site Config

`custom/v8s-site-config.json` is the main setup file written by `npm run setup`. It stores instance-owned site settings, including languages, branding, operator contacts, and legal-page mode. The important top-level sections are:

| Section | Purpose |
| :--- | :--- |
| `i18n` | Default language and supported languages |
| `operator` | Operator identity, contacts, legal-page mode, analytics disclosure, and response window |
| `branding` | Short domain, installer-managed public-page flag, and split-color wordmark |

Do not edit generated files in `build/`. Edit `custom/`, then rebuild with `npm run check`.
