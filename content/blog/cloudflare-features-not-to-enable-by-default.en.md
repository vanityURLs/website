---
title: "Cloudflare features not to enable by default"
date: 2026-05-28
author: "Benoît H. Dicaire"
description: "Which Cloudflare dashboard features a vanityURLs instance should leave alone unless there is a specific operational reason."
tags: ["cloudflare", "security", "operations"]
featured: false
---

Cloudflare gives a short-link operator a very large dashboard. That does not mean every feature belongs in the default vanityURLs setup.

A vanityURLs instance already has a narrow shape: a Cloudflare Worker, Worker Static Assets, a Git-managed link registry, optional server-side analytics, and a few Cloudflare controls in front of the Worker. The safest default is to configure the controls that protect that shape, then leave unrelated products alone until a real requirement appears.

## Start with the layer that exists

Use Cloudflare for DNS, TLS, WAF rules, bot controls, AI crawler controls, Access, URL normalization, conservative cache behavior, Worker analytics, and Security Events. Those features protect the actual redirector path before traffic reaches application code.

Do not add features because they are visible in the dashboard. Each extra product can change traffic, inject scripts, create another source of truth, add paid-plan dependencies, or make debugging harder.

## Leave product-unrelated surfaces alone

Argo Smart Routing, Email Routing, DMARC Management, Email Security, Cache Reserve, Smart Shield, Web3 Gateways, and most Error Pages features solve problems outside the normal vanityURLs runtime.

For a default short-link instance:

- there is no origin server for Argo, Cache Reserve, or Smart Shield to optimize
- email security products do not protect redirects
- Web3 Gateways are interesting only if operators later ask for decentralized content workflows
- custom Cloudflare error pages are optional polish, not part of redirect correctness

This does not make those products bad. It means they should not become setup steps for every operator.

## Avoid competing redirect systems

Do not configure legacy Page Rules, Bulk Redirects, or Cloudflare redirect templates as the default way to manage links. vanityURLs already treats links as source-controlled data in Git, builds a runtime registry, and lets the Worker resolve exact, dynamic, scheduled, and lifecycle-aware links.

Adding another redirect system creates two sources of truth. The next person debugging a wrong destination has to ask whether the redirect came from `custom/v8s-links.txt`, a Worker rule, a Page Rule, a Bulk Redirect list, or a dashboard template. That is not a feature; that is fog.

Zone-level Workers Routes are similar. A normal vanityURLs instance should use the Worker custom domain for the apex short domain. Add zone-level routes only when you have a deliberate, documented routing pattern that the custom domain cannot express.

## Do not inject browser analytics by default

Cloudflare Web Analytics and RUM rely on a JavaScript beacon that runs in the visitor's browser. Cloudflare documents both manual snippets and automatic injection for proxied sites and Pages projects.

That is not the default vanityURLs privacy posture. The redirector can emit server-side events from the Worker to Umami or Fathom without adding client-side tracking JavaScript, browser identifiers, or another script in public pages. Those events also map better to the product questions vanityURLs cares about: redirects, misses, expand lookups, pageviews, and normalized bot events that reached the Worker.

Use Cloudflare analytics for infrastructure questions. Use Umami or Fathom for application events. Avoid making the browser participate unless an operator explicitly chooses that tradeoff.

## Treat API and app-security inventory as optional

Cloudflare Web Assets, API Discovery, Endpoint Management, and Schema Validation are built for API and application inventories. They can discover endpoints, manage API paths, and validate requests against OpenAPI schemas.

That is useful for a JSON API. It is not the default model for a short-link redirector whose public interface is mostly `GET` and `HEAD` requests to slugs. vanityURLs does not ship an OpenAPI-controlled public API for visitors, and blocking redirect traffic against an API schema would be more complexity than protection.

Consider these tools only if your instance grows a real API or custom application surface beyond vanityURLs redirects and public pages.

## Keep edge code in one place

Cloudflare Snippets run small pieces of JavaScript from Rules. Cloud Connector can route traffic to storage providers such as R2, Amazon S3, Google Cloud Storage, or Azure Storage.

For vanityURLs, the Worker is already the edge code boundary, and Worker Static Assets already serves the shipped public files. Snippets would duplicate logic that belongs in the Worker or in the repository. Cloud Connector would introduce another routing path for files the Worker asset binding already handles.

Use them only for an intentional extension that you can explain in one sentence and test independently.

## Certificates: use the simple path first

Universal SSL, Full strict mode, TLS 1.3, HTTPS enforcement, and HSTS after readiness are enough for the normal setup. Advanced Certificate Manager is useful when an operator needs custom certificate behavior, additional certificate controls, or a requirement that Universal SSL does not satisfy.

Do not turn certificate management into an advanced project before the short domain is even redirecting correctly.

## The rule of thumb

If a Cloudflare feature does not protect the Worker path, the short domain, the DNS/TLS layer, or the private operational pages, it is probably not part of the default setup.

Write down the reason before enabling anything else. Future-you will be kinder to present-you than the Cloudflare dashboard is.

Use [Network protection](/docs/customize/network-protection/) for the baseline settings that should be configured by default.
