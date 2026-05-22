---
aside: false
title: "Default links"
description: "Annotated examples from defaults/v8s-links.txt in the current v8s.link reference implementation."
---

The default link registry is `defaults/v8s-links.txt`. A production instance normally replaces it with `custom/v8s-links.txt`, but the defaults are useful because they show the supported shape of a real registry.

## Namespaced examples

The default file groups links by human task area:

| Prefix | Examples | Purpose |
|---|---|---|
| `ai/` | `ai/chat`, `ai/claude`, `ai/hf` | AI tools and model resources |
| `edu/` | `edu/a`, `edu/d`, `edu/s` | Research and academic lookup |
| `g/` | `g/cal`, `g/drive`, `g/meet` | Google productivity surfaces |
| `meet/` | `meet/g`, `meet/t`, `meet/z` | Meeting-room aliases |
| `pkg/` | `pkg/d`, `pkg/n`, `pkg/p`, `pkg/r` | Package registries |
| `social/` | `social/fb`, `social/ig`, `social/x` | Social profiles |
| `v8s/` | `v8s/code`, `v8s/doc`, `v8s/status` | vanityURLs project links |

Namespacing keeps the root short-link space clean while still allowing memorable URLs such as `v8s.link/social/x`.

## Lifecycle test links

The defaults include test links that exercise every runtime state:

| Slug | State | Expected behavior |
|---|---|---|
| `test/1` | `permanent` | 301 to target |
| `test/2` | `ephemeral` | 302 to target |
| `test/3` | `expired` | 302 to `/expired` |
| `test/4` | `disabled` | 302 to `/disabled` |
| `test/5` | `maintenance` | 302 to `/maintenance` |
| `test/6` | `deactivated` | true 404 |

These links are for validation. Replace them in your own `custom/v8s-links.txt` unless you want public lifecycle probes on your domain.

## Project links

The `v8s/` namespace demonstrates how a public instance can document itself:

```text
v8s/code|github.com/vanityURLs/vanityURLs||V8S web site|documentation|v8s,git|bhd|||
v8s/doc|vanityUrls.link/en/docs/||VanityURLs documentation||v8s,git|bhd|||
v8s/status|status.vanityUrls.link||Uptime monitoring|status page|v8s,web|bhd|||
```

The omitted state falls back to the registry default. The build normalizes bare hostnames to `https://`.

## What to change

For a new instance, keep the structure but replace the sample rows with your own links, owner labels, and tags. Add `custom/v8s-schedules.json` only for links that need time-aware destinations.
