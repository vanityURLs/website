---
title: "Custom overrides"
description: "Turn a plain vanityURLs deployment into your own branded instance by adding files under custom/ while keeping defaults upgradable."
---

Use `custom/` for instance-owned files. This keeps your deployment upgradable because default pages, Worker logic, and product policy can move forward without mixing in every local brand choice.

A new instance can run with very few custom files. Add more only when you need to change links, branding, public policy, or status-page behavior.

## Defaults versus custom

`defaults/` is the product baseline. It contains the default public pages, status pages, logos, protected dashboard shell, test page, policy files, sample links, and runtime assets.

`custom/` is your instance overlay. Files in `custom/` either replace specific defaults or provide instance data that should survive upstream updates.

The build order is:

1. Copy `defaults/public/` into `build/`.
2. Overlay `custom/public/` when it exists.
3. Copy the default `defaults/public/_stats/index.html`.
4. Overlay `custom/public/_stats/index.html` when it exists.
5. Build `v8s.json` from `custom/v8s-links.txt` when it exists, otherwise from `defaults/v8s-links.txt`.
6. Merge `defaults/v8s-blocklist.json`, optional `custom/v8s-blocklist.json`, and optional generated blocklist data.

## Common custom files

```text
custom/v8s-links.txt
custom/v8s-schedules.json
custom/v8s-blocklist.json
custom/public/v8s-logo.svg
custom/public/favicon.svg
custom/public/site.webmanifest
custom/public/robots.txt
custom/public/security.txt
custom/public/llms.txt
custom/public/llms-full.txt
```

Use `custom/v8s-links.txt` for your redirect inventory, `custom/v8s-schedules.json` for scheduled link state changes, and `custom/v8s-blocklist.json` for instance-specific blocked slugs or patterns.

Use `custom/public/` for public files served by the Worker: logos, icons, CSS, HTML pages, policy documents, robots policy, and localized pages.

## What can be customized

Replace branding assets under `custom/public/`, such as `v8s-logo.svg`, `favicon.svg`, PNG icons, and `site.webmanifest`.

Add public policy pages under `custom/public/`, such as `terms.html`, `privacy.html`, `abuse.html`, and `security.html`. Every public instance owner is responsible for their own terms, privacy notice, abuse contact, security contact, analytics disclosure, and data retention language. The defaults are placeholders and product patterns, not legal advice.

Replace the expand page with `custom/public/expand/index.html`. Localized expand pages use language directories, for example `custom/public/fr/expand/index.html`.

Replace the protected dashboard shell with `custom/public/_stats/index.html` only when you need a different static dashboard page. Keep `/_stats` and `/_tests` protected with Cloudflare Access because those views expose routing and diagnostic information.

Replace headers and machine-readable policy files with care. If you override `custom/public/_headers`, keep security and cache rules compatible with the Worker and protected paths.

## Custom status pages

The Worker serves specific files for link and routing states. To build custom status pages from scratch, place the files at these exact paths:

```text
custom/public/404.html
custom/public/disabled.html
custom/public/expired.html
custom/public/maintenance.html
```

Localized versions use the language code as the first directory segment:

```text
custom/public/fr/404.html
custom/public/fr/disabled.html
custom/public/fr/expired.html
custom/public/fr/maintenance.html
custom/public/es/404.html
custom/public/de/404.html
custom/public/it/404.html
```

You only need to add the localized pages you actually support. If a localized page is missing, the Worker can fall back to the default page for the requested state.

The HTTP status code comes from the Worker, not the HTML file:

| File | Used for | Status |
|---|---|---|
| `404.html` | Unknown short links and missing pages | 404 |
| `disabled.html` | Disabled links | 403 |
| `expired.html` | Expired links | 410 |
| `maintenance.html` | Temporarily unavailable links | 503 |

If you replace `404.html`, include these placeholders where you want runtime context to appear:

```html
<!-- {{SLUG_MESSAGE}} -->
<!-- {{REFERENCE_LINE}} -->
```

`{{SLUG_MESSAGE}}` is replaced with a safe message about the requested slug. `{{REFERENCE_LINE}}` is replaced with a correlation reference that helps with support and log review. If you omit the placeholders, the page still works, but users and maintainers get less context.

Status pages can be self-contained HTML. If they use shared styling or images, put those assets in `custom/public/` and reference them from the site root, for example `/status.css`, `/favicon.svg`, or `/v8s-logo.svg`.

Keep status pages static. Do not depend on a browser tracking script for analytics; server-side analytics are emitted by the Worker when configured.

## Upgrade workflow

```bash
git pull upstream main
npm run generate:blocklist
npm run check
```

Keep runtime behavior changes out of `defaults/functions/` and generated Worker files unless you intend to maintain a fork. Prefer configuration, policy, and asset overrides for deployable instances.
