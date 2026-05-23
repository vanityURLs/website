---
title: "Release checklist for a vanityURLs instance"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "A compact production checklist for launching or upgrading a vanityURLs instance on Cloudflare."
tags: ["release", "operations", "cloudflare"]
featured: false
aliases:
  - /docs/release-checklist/
  - /en/docs/release-checklist/
---

Use this checklist before launching a new instance or promoting a major upgrade. A vanityURLs instance is robust, but anything shiny on the internet attracts scanners, bots, and abuse attempts.

The strongest release posture is boring: a small Worker, reviewed generated files, narrow Cloudflare exposure, protected operational pages, and clear ownership of every destination.

## Repository and build

- Run `npm run clean` before release or before comparing generated output
- Refresh upstream `defaults/` and `scripts/` with [Upgrading an instance](/docs/upgrading/)
- Keep instance-owned files in `custom/`
- Keep Worker runtime edits in `scripts/workers/`; treat `src/` as generated
- Run `npm run check`
- Review generated registry, runtime policy, site config, and public asset changes
- Commit and deploy from a clean working tree

CI should run `npm run check` before deployment. Keep deployment credentials out of the repo and configure them as GitHub or Cloudflare secrets.

## Worker and private surfaces

- Confirm the Worker has an `ASSETS` binding
- Confirm the custom domain points to the Worker
- Disable public `workers.dev` and preview URLs if they are not part of the service
- Protect `/_stats`, `/_stats/*`, `/_tests`, and `/_tests/*` with [Access control](/docs/access-control/)
- Confirm the Worker accepts only `GET`, `HEAD`, and `OPTIONS` on public routes
- Confirm raw runtime files return 404: `/v8s.json`, `/v8s-blocklist.json`, and `/v8s-site-config.json`
- Confirm response headers include `X-Generated-By: vanityURLs.link` unless intentionally overridden

## Cloudflare domain controls

Cloudflare settings are split across three areas:

- **Zero Trust**: Access applications, policies, identity providers, and settings
- **Workers & Pages**: deployment, assets binding, variables, observability, custom domains, and build settings
- **Domain configuration**: AI Crawl Control, Analytics, Caching, DNS, Network, Rules, Security, SSL/TLS, and WAF

Use [Access control](/docs/access-control/) for private operational paths, [Network protection](/docs/network-protection/) for domain settings, and [Wrangler Without Shooting Yourself in the Foot](/blog/wrangler/) for Worker naming and `wrangler.toml` guidance.

## Abuse and policy

- Keep runtime blocklist policy enabled as the application fallback after Cloudflare network controls
- Review `defaults/v8s-blocklist-categories.json` when generated feeds change
- Keep editable source policy in `custom/v8s-policies.json`; treat `build/v8s-blocklist.json` as generated output
- Do not use the redirector for phishing, malware, disguised tracking, undisclosed affiliate routing, shortener chains, or destinations that violate user expectations

Use [Policy and blocklist](/docs/blocklist/) for instance policy and [Runtime security](/docs/runtime-security/) for built-in runtime protections.

## Analytics

- Use server-side analytics only; do not add browser tracking scripts
- Configure Umami or Fathom with Worker variables and secrets
- Confirm traffic blocked by [Network protection](/docs/network-protection/) is not sent to analytics
- Review vendor rate limits and account quotas before launch
- Watch the first 24 hours for scanner noise that could consume quota

Use [Analytics](/docs/analytics/) for variables, event names, provider limits, IP mode, and verification.

## Public files and brand

- Publish `robots.txt`, `llms.txt`, and `llms-full.txt` from `defaults/public/`, or override them in `custom/public/`
- Confirm `custom/v8s-site-config.json` lists the intended `supported_languages`
- Add or customize terms, privacy, abuse, and security contact pages for the owner and jurisdiction
- Treat included legal text as a draft, not legal advice
- Confirm localized redirected badges exist for supported languages
- Run `npm run optimize:badges` after editing default redirected badge SVGs

Use [Footer & pages](/docs/footer-pages/), [Internationalization](/docs/i18n/), and [Brand](/docs/brand/) for the underlying details.

## Operational smoke checks

- Confirm a known active short link returns the expected redirect
- Confirm a hidden or missing slug returns 404
- Confirm a blocked target fails validation
- Confirm `/_stats` and `/_tests` are protected
- Confirm server-side analytics receive one test event when analytics are enabled
- Confirm Cloudflare blocks commodity scanner traffic before it reaches the Worker
