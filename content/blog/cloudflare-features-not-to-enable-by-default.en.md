---
title: "Do not turn every Cloudflare knob"
date: 2026-05-28
author: "Benoît H. Dicaire"
description: "Which Cloudflare dashboard features a vanityURLs instance should leave alone unless there is a specific operational reason."
tags: ["cloudflare", "security", "operations"]
featured: false
---

The Cloudflare dashboard is not a checklist.

That is the rule. A vanityURLs instance has a narrow job: serve short links from a Worker, keep operational pages behind Access, and let Cloudflare reject obvious noise before application code runs. The baseline controls are documented in [Network protection](/docs/customize/network-protection/). The product inventory is documented in [Cloudflare products](/docs/reference/cloudflare-products/).

This post is the negative space. It names the knobs that should stay off unless an operator has a reason that survives writing down.

## Keep One Redirect System

Do not configure legacy Page Rules, Bulk Redirects, redirect templates, or zone-level Workers Routes as the default link-management path.

vanityURLs already has a [link registry](/docs/reference/glossary/#link-registry), generated runtime data, lifecycle states, schedules, splats, lookup pages, and Worker-side analytics. Another redirect surface turns troubleshooting into archaeology.

Use a second redirect system only when it has a documented boundary. For example: a one-time migration rule, a hostname outside the vanityURLs Worker, or a static list that is intentionally not part of the repository-managed registry.

## Keep The Browser Out Of Analytics

Do not enable Cloudflare Web Analytics or RUM by default.

Both can be useful. Both make the visitor's browser participate. The default vanityURLs posture is server-side analytics from the Worker to Umami or Fathom, if analytics are enabled at all.

Use Cloudflare infrastructure views for Worker health and edge decisions. Use vanityURLs application analytics for redirects, misses, lookup requests, pageviews, and normalized bot events that reached the Worker.

## Avoid API Inventory Without An API

Leave Web Assets, API Discovery, Endpoint Management, and Schema Validation out of the default setup.

They make sense for an application with a real public API and a schema to enforce. The public vanityURLs surface is mostly `GET` and `HEAD` requests to slugs. Blocking redirect traffic against an API inventory would add more machinery than protection.

## Keep Edge Code In The Worker

Do not add Cloudflare Snippets or Cloud Connector for the stock instance.

The Worker is already the edge code boundary. Workers Static Assets already serves the shipped public files. A second edge-code path makes behavior harder to review and harder to test.

Use Snippets only for an extension that can be explained in one sentence and tested independently.

## Keep Certificates Boring

Start with Universal SSL, Full strict mode, HTTPS enforcement, TLS 1.3, and HSTS only after the zone is ready.

Advanced Certificate Manager, custom cipher controls, and similar certificate work belong to deployments with a real certificate requirement. They are not prerequisites for a working short domain.

## The Short Version

If a feature does not protect DNS/TLS, the Worker path, the short domain, or protected operational pages, it is not part of the default setup.

As of the 2026-05-29 dashboard capture, the raw list of visible baseline and non-baseline Cloudflare surfaces lives in [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json). `Last verified: 2026-05-29`

The tradeoff is deliberate. vanityURLs gives up some dashboard convenience so the redirector has one runtime, one registry, and fewer places for stale state to hide.
