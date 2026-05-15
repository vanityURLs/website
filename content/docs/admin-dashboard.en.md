---
title: "Admin dashboard"
description: "Read-only operational dashboard for route inventory, effective states, metadata quality, and protected stats."
---

The admin dashboard is intentionally read-only. It is an operational view over the generated registry, not a content management system.

It reads:

```text
/v8s.json
```

## What it shows

- Route inventory
- Effective state
- Exact vs splat routing
- Expiry review
- Metadata quality
- Routing-table behavior
- Expiring-soon and missing-metadata filters

Analytics remain in Umami or Fathom. The dashboard is the routing and lifecycle plane; analytics tools are the measurement plane.

## Protection

Protect `/_stats`, `/_stats/*`, `/_tests`, and `/_tests/*` with Cloudflare Access. The Worker validates the Access assertion header and fails closed when protection is incomplete.

## Build recommendation

Use the full check command for Cloudflare builds and CI:

```bash
npm run check
```

Keep the generated output directory as:

```text
build
```
