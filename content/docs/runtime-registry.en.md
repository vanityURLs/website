---
aside: false
title: "Runtime registry"
description: "How v8s builds the private routing registry and runtime artifacts used by the Cloudflare Worker."
weight: 60

---

The Worker does not read `v8s-links.txt` on every request. The build creates a private runtime registry at `build/v8s.json` and publishes it as an internal asset.

Direct public requests for raw runtime files return 404, including:

```text
/v8s.json
/v8s-blocklist.json
/v8s-site-config.json
```

The registry is intentionally simple: one generated JSON file, validated before deploy, consumed by one Worker.

## Build inputs

The runtime artifacts are generated from:

- `defaults/v8s-links.txt`, replaced by `custom/v8s-links.txt` when present
- `defaults/v8s-schedules.json`, with `custom/v8s-schedules.json` merged over it
- `defaults/v8s-policies.json`, replaced by `custom/v8s-policies.json` when present
- `defaults/v8s-site-config.json`, with `custom/v8s-site-config.json` merged into site-level choices
- static page assets from `defaults/public/`, overlaid by `custom/public/`
- generated blocklist feed data when `npm run generate:blocklist` has produced it

Use `custom/` for every instance-owned change. That keeps future updates simple: upstream can refresh `defaults/` and `scripts/` while the instance keeps its own links, policy, branding, legal pages, local helper config, and secrets.

## Runtime artifacts

The build writes:

| Artifact | Purpose |
|---|---|
| `build/v8s.json` | Redirect registry consumed by the Worker. |
| `build/v8s-blocklist.json` | Runtime policy artifact consumed by the Worker. |
| `build/v8s-site-config.json` | Site configuration used by the build. |
| `src/worker.mjs` | Generated Worker entry copied from `scripts/workers/` for Wrangler. |

`scripts/workers/` is the Worker source of truth. `src/` is generated output.

The local helper cache, usually `~/.v8s.json`, is separate from `build/v8s.json`. It exists only for workstation shortcuts installed by `npm run local-install`.

## Registry shape

The top-level registry object contains:

- `schema_version`
- `generated_at`
- `source`: the source link file used for active links
- `links`: exact short-link rules keyed by path
- `splats`: wildcard rules such as `docs/*`
- `schedules`: optional time windows for exact links
- `blocklist`: runtime safety policy metadata

A link entry stores the normalized target URL, redirect state, HTTP status, label, description, tags, owner, and optional metadata. Splat entries keep the parent prefix and append the captured suffix to the destination when the link is active.

## Resolution order

For each request, the Worker follows a deliberately narrow path:

1. Reject raw runtime assets and known scanner probes
2. Accept only `GET`, `HEAD`, and `OPTIONS` for public routes
3. Normalize the incoming path
4. Look for an exact link
5. If no exact link matches, look for a splat link
6. Apply schedule and lifecycle state
7. Return a redirect, an informational page, or a 404

Schedules only apply to exact links. Splat links are useful for stable namespaces, but they should not be used for time-sensitive redirects.

## Why JSON instead of a database

v8s is a redirect engine, not a public content application. A generated registry keeps the release easy to audit, reproduce, and roll back. Git history records every link change, Cloudflare deploys an immutable Worker version, and the runtime has very little mutable state to attack.

If a future public instance needs delegated editing, the admin surface should write changes back to reviewed files or a similarly auditable source of truth. The runtime should stay small.
