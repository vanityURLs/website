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

The code repository keeps the executable activity list in [`RELEASE_CHECKLIST.md`](https://github.com/vanityURLs/code/blob/main/RELEASE_CHECKLIST.md). This post explains why those checks matter and adds operational context for Cloudflare and instance owners.

The strongest release posture is boring: a small Worker, reviewed generated files, narrow Cloudflare exposure, protected operational pages, and clear ownership of every destination.

## Repository and build

- Run `npm run clean` before release or before comparing generated output
- Refresh upstream `defaults/` and `scripts/` with [Upgrading an instance](/docs/reference/upgrading/)
- Keep instance-owned files in `custom/`
- Keep Worker runtime edits in `scripts/workers/`; treat `src/` as generated
- Run `npm run check`
- Run `npm run validate:targets` when you want target reachability in the release gate
- Confirm `build/v8s-release-manifest.json` exists and review its hashes
- Review generated registry, runtime policy, site config, and public asset changes
- Commit and deploy from a clean working tree

CI should run `npm run check` before deployment. Use grouped commands for focused confidence: `npm run test`, `npm run validate`, and `npm run smoke` run the whole group, while commands such as `test:worker`, `validate:targets`, and `smoke:analytics` run one layer. Keep deployment credentials out of the repo and configure them as GitHub or Cloudflare secrets.

## Worker and private surfaces

- Confirm the Worker has an `ASSETS` binding
- Confirm the custom domain points to the Worker
- Disable public `workers.dev` and preview URLs if they are not part of the service
- Protect `*/_stats`, `*/_stats/*`, `/_tests`, and `/_tests/*` with [Access control](/docs/customize/access-control/)
- Confirm the Worker accepts only `GET`, `HEAD`, and `OPTIONS` on public routes
- Confirm raw runtime files return 404: `/v8s.json`, `/v8s-blocklist.json`, and `/v8s-site-config.json`
- Confirm response headers include `X-Generated-By: vanityURLs.link` unless intentionally overridden

## Cloudflare domain controls

Cloudflare settings are split across three areas:

- **Zero Trust**: Access applications, policies, identity providers, and settings
- **Workers & Pages**: deployment, assets binding, variables, observability, custom domains, and build settings
- **Domain configuration**: AI Crawl Control, Analytics, Caching, DNS, Network, Rules, Security, SSL/TLS, and WAF

Use [Access control](/docs/customize/access-control/) for private operational paths, [Network protection](/docs/customize/network-protection/) for domain settings, and [Wrangler Without Shooting Yourself in the Foot](/blog/wrangler/) for Worker naming and `wrangler.toml` guidance.

## Abuse and policy

- Keep runtime blocklist policy enabled as the application fallback after Cloudflare network controls
- Review `defaults/v8s-blocklist-categories.json` when generated feeds change
- Keep editable source policy in `custom/v8s-policies.json`; treat `build/v8s-blocklist.json` as generated output
- Do not use the redirector for phishing, malware, disguised tracking, undisclosed affiliate routing, shortener chains, or destinations that violate user expectations

Use [Policy and blocklist](/docs/customize/blocklist/) for instance policy and [Runtime security](/docs/reference/runtime-security/) for built-in runtime protections.

## Analytics

- Use server-side analytics only; do not add browser tracking scripts
- Configure Umami or Fathom with Worker variables and secrets
- Confirm traffic blocked by [Network protection](/docs/customize/network-protection/) is not sent to analytics
- Review vendor rate limits and account quotas before launch
- Watch the first 24 hours for scanner noise that could consume quota

Use [Analytics](/docs/customize/analytics/) for variables, event names, provider limits, IP mode, and verification.

## Public files and brand

- Publish `robots.txt`, `llms.txt`, and `llms-full.txt` from `defaults/public/`, or override them in `custom/public/`
- Confirm `custom/v8s-site-config.json` lists the intended `supported_languages`
- Add or customize terms, privacy, abuse, and security contact pages for the owner and jurisdiction
- Treat included legal text as a draft, not legal advice
- Confirm localized redirected badges exist for supported languages
- Run `npm run optimize:badges` after editing default redirected badge SVGs

Use [Footer & pages](/docs/customize/footer-pages/), [Internationalization](/docs/reference/i18n/), and [Brand](/docs/reference/brand/) for the underlying details.

## Operational smoke checks

- Confirm a known active short link returns the expected redirect
- Confirm a hidden or missing slug returns 404
- Confirm a blocked target fails validation
- Confirm `/en/_stats/`, one other localized stats path, and `/_tests` are protected
- Confirm server-side analytics receive one test event when analytics are enabled
- Confirm Cloudflare blocks commodity scanner traffic before it reaches the Worker

## Rollback versus migration

Migration instructions explain how to move forward. A rollback note explains how to retreat safely when production traffic reveals a problem after deployment. For vanityURLs, rollback should stay boring: return to the previous Git commit or Cloudflare deployment, confirm the Worker still reads the previous `links[]` registry shape, and rerun the smoke checks.
