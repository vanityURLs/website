---
title: "Migrating from Cloudflare Pages redirects to vanityURLs Workers"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Move an older vanityURLs instance from Cloudflare Pages _redirects to the current Cloudflare Workers runtime without losing the link inventory."
tags: ["migration", "cloudflare", "workers"]
featured: false
aliases:
  - /docs/migration/
  - /en/docs/migration/
---

The first vanityURLs instances were intentionally simple: a domain, a `_redirects` file, and Cloudflare Pages. That was a good starting point. It made short links easy to keep in Git, easy to review, and easy to deploy.

The current runtime keeps the same spirit, but moves the redirect decision into a Cloudflare Worker. That change gives the instance a stronger runtime: protected operational pages, generated policy, localized public pages, server-side analytics, scanner protection, and a clearer split between product defaults and instance-owned files.

This migration is not a reinvention of your short domain. It is a controlled move from a static redirects file to a generated Worker registry while preserving the links people already use.

## What changed

- `wrangler.toml` is the deployment source of truth
- Static files are served through the Worker assets binding named `ASSETS`
- The build copies `defaults/`, overlays `custom/`, and generates `build/v8s.json`, `build/v8s-blocklist.json`, and `build/v8s-site-config.json`
- `custom/v8s-links.txt` is preferred when it exists; otherwise the build uses `defaults/v8s-links.txt`
- Editable source policy is `v8s-policies.json`; `build/v8s-blocklist.json` is generated runtime output
- `/en/_stats/`, other localized stats paths, and `/_tests` are protected by [Cloudflare Access](/docs/customize/access-control/)
- Analytics events are emitted by the Worker
- Scanner probes and risky destinations are blocked by the generated runtime policy

## Convert legacy .lnk files

Legacy rows looked like this:

```text
/github https://github.com/vanityURLs 302 "GitHub"
/docs/* https://docs.example.com/:splat 302 "Docs passthrough"
```

The new format is:

```text
slug|target|state|title|description|tags|owner|expires_at|notes
```

Run the converter:

```bash
npm run convert:lnk -- .lnk custom/v8s-links.txt --owner v8s --force
```

Status codes map to states:

| Legacy status       | New state              |
| ------------------- | ---------------------- |
| `301`, `308`        | `permanent`            |
| `302`, `303`, `307` | `ephemeral`            |
| omitted             | `ephemeral` by default |

Use `--default-state permanent` if omitted statuses should become permanent links.

## Verify after migration

1. Run `npm run check`
2. Visit `/`
3. Visit a valid short link and confirm the redirect
4. Visit a missing slug and confirm the localized 404
5. Visit `/lookup/`
6. Visit `/en/_stats/` from a private browser and confirm Cloudflare Access login using [Access control](/docs/customize/access-control/) as the expected configuration
7. Visit `/file.php` and confirm scanner probes are blocked or return a plain 404
8. Confirm Umami or Fathom receives redirect events if analytics are configured

## Keep the migration small

The safest migration changes one layer at a time. Convert the link source, run the build, confirm the generated registry, deploy the Worker, and only then start refining branding, analytics, legal pages, or network controls.

That order keeps the important promise intact: existing short links should continue to resolve while the runtime underneath them becomes easier to maintain.
