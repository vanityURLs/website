---
title: "Runtime registry"
description: "How v8s builds the private schema 2.2 routing registry used by the Cloudflare Worker."
---

The Worker does not read `v8s-links.txt` on every request. The build creates a private runtime registry at `build/v8s.json` and publishes it as an internal asset. Direct public requests for `v8s.json`, `redirect-targets.json`, and blocklist assets return 404.

The registry is intentionally simple: one generated JSON file, schema version `2.2`, validated before deploy, consumed by one Worker.

## Build inputs

The registry is generated from:

- `defaults/v8s-links.txt`, then `custom/v8s-links.txt`
- `defaults/v8s-schedules.json`, then `custom/v8s-schedules.json`
- `defaults/v8s-blocklist.json`, generated blocklist data, and `custom/v8s-blocklist.json`
- static page assets from `defaults/public/` overlaid by `custom/public/`

Use `custom/` for every instance-owned change. That keeps future updates simple: upstream can refresh `defaults/` and `scripts/` while the instance keeps its own links, policy, branding, legal pages, and generated secrets.

## Registry shape

The top-level object contains:

- `schema_version`: currently `2.2`
- `generated_at`: build timestamp
- `source`: the source file used to generate the active links
- `links`: exact short-link rules keyed by path
- `splats`: wildcard rules such as `docs/*`
- `schedules`: optional time windows for exact links
- `blocklist`: merged runtime safety policy

A link entry stores the normalized target URL, redirect state, HTTP status, label, description, tags, owner, and optional metadata. Splat entries keep the parent prefix and append the captured suffix to the destination when the link is active.

## Resolution order

For each request, the Worker follows a deliberately narrow path:

1. Reject private implementation assets and known scanner probes.
2. Accept only `GET`, `HEAD`, and `OPTIONS`.
3. Normalize the incoming path.
4. Look for an exact link.
5. If no exact link matches, look for a splat link.
6. Apply schedule and lifecycle state.
7. Return a redirect, an informational page, or a 404.

Schedules only apply to exact links. Splat links are useful for stable namespaces, but they should not be used for time-sensitive redirects.

## Link states

The runtime supports stable lifecycle states:

| State | Behavior |
|---|---|
| `permanent` | 301 redirect |
| `ephemeral` | 302 redirect |
| `scheduled` | redirect only during configured windows |
| `inactive` | show inactive page |
| `deprecated` | show deprecated page |
| `hidden` | return 404 |

Validation catches unsupported states, malformed URLs, unsafe targets, duplicate aliases, risky splat parents, and schedule mistakes before the Worker is deployed.

## Why JSON instead of a database

v8s is a redirect engine, not a public content application. A generated registry keeps the release easy to audit, easy to reproduce, and easy to roll back. Git history records every link change, Cloudflare deploys an immutable Worker version, and the runtime has very little mutable state to attack.

If a future public instance needs delegated editing, the admin surface should write changes back to reviewed files or a similarly auditable source of truth. The runtime should stay small.
