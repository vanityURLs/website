---
title: "Documentation"
description: "v8s.link documentation for the current vanityURLs Worker, defaults, link registry, protection, and deployment model."
---

v8s.link is the public reference instance for the current vanityURLs runtime. The application now builds a Cloudflare Worker with static assets, a generated `v8s.json` registry, default pages, optional custom overrides, protected operational views, and abuse-prevention policy.

Start with the quickstart if you are creating a new short-link domain. Use the reference pages when you are customizing the default instance, migrating from the older `.lnk`/Pages model, or checking how v8s.link is configured.

For production hardening, read the runtime security approach with the Cloudflare guide. The design depends on a small Worker, a generated registry, build-time validation, Cloudflare Access for private views, WAF rules for commodity abuse, and server-side analytics only for traffic that reaches the Worker.
