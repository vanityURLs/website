---
title: "Migration guide"
description: "Move a legacy vanityURLs Pages or .lnk instance to the current Cloudflare Workers runtime."
---

Use this guide when moving from the older Cloudflare Pages `_redirects` model to the current Worker model used by v8s.link.

## What changed

- `wrangler.toml` is the deployment source of truth
- Static files are served through the Worker assets binding named `ASSETS`
- The build copies `defaults/`, overlays `custom/`, and generates `build/v8s.json`
- `custom/v8s-links.txt` is preferred when it exists; otherwise the build uses `defaults/v8s-links.txt`
- `/_stats` and `/_tests` are protected by Cloudflare Access
- Server-side analytics are emitted by the Worker
- Scanner probes and risky destinations are blocked by `v8s-blocklist.json`

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

| Legacy status | New state |
|---|---|
| `301`, `308` | `permanent` |
| `302`, `303`, `307` | `ephemeral` |
| omitted | `ephemeral` by default |

Use `--default-state permanent` if omitted statuses should become permanent links.

## Verify after migration

1. Run `npm run check`
2. Visit `/`
3. Visit a valid short link and confirm the redirect
4. Visit a missing slug and confirm the localized 404
5. Visit `/expand/`
6. Visit `/_stats` from a private browser and confirm Cloudflare Access login
7. Visit `/file.php` and confirm scanner probes are blocked or return a plain 404
8. Confirm Umami or Fathom receives redirect events if analytics are configured
