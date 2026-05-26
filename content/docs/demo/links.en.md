---
aside: false
title: "Demo links"
description: "The starter links used by the v8s.link demo instance."
weight: 20

---

The v8s.link demo intentionally keeps the same slim starter inventory that `npm run setup` creates from `defaults/v8s-links.txt`.

## Current links

| Slug | Long link | Purpose |
|---|---|---|
| `home` | `https://v8s.link` | Root home link |
| `status` | `https://status.v8s.link` | Status page placeholder |
| `docs` | `https://vanityURLs.link/en/docs/` | vanityURLs documentation |

```text
# slug|target|state|title|description|tags|owner|expires_at|notes
home|https://v8s.link|permanent|Home|Primary website|core|bhd||
status|https://status.v8s.link|ephemeral|Status|Service status page|status|bhd||
docs|https://vanityURLs.link/en/docs/|permanent|Docs|vanityURLs documentation|docs|bhd||
```

## Why the demo is small

The demo is meant to prove that the Quickstart works, not to become a large public directory of example links. Larger link inventories, namespaces, lifecycle examples, schedules, and migration examples belong in focused documentation and blog posts.

Run `./scripts/lnk list` in your own instance to see the same starter inventory after setup.
