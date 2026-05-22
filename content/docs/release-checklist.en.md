---
aside: false
title: "Release checklist"
description: "Production checklist for deploying or upgrading a v8s instance on Cloudflare."
---

Use this checklist before launching a new instance or promoting a major upgrade. A vanityURLs instance is robust, but anything shiny on the internet attracts scanners, bots, and abuse attempts.

## Repository

- Run `npm run clean`
- Refresh upstream `defaults/` and `scripts/` with the [upgrade workflow](/docs/upgrading/)
- Keep all instance-owned files in `custom/`
- Keep Worker runtime edits in `scripts/workers/`; treat `src/` as generated
- Run `npm run check`
- Review generated registry, runtime policy, and site config changes
- Commit and deploy from a clean working tree

## Worker and assets

- Confirm the Worker has an `ASSETS` binding
- Confirm the custom domain points to the Worker
- Disable public `workers.dev` and preview URLs if they are not part of the service
- Protect `/_stats` and `/_tests` with [Cloudflare Access](/docs/access-control/)
- Keep `/_stats/*` and `/_tests/*` policies narrow
- Confirm the Worker accepts only `GET`, `HEAD`, and `OPTIONS`
- Confirm raw runtime files return 404: `/v8s.json`, `/v8s-blocklist.json`, and `/v8s-site-config.json`
- Confirm response headers include `X-Generated-By: vanityURLs.link` unless intentionally overridden

## Cloudflare domain configuration

In Cloudflare, the relevant settings are split across three places:

- **Zero Trust**: {{< arrow left >}} [Access control](/docs/access-control/)
  - Access applications & policies
  - Identity providers
  - Settings
- **Workers & Pages**: Worker deployment, assets binding, variables, observability, custom domains, and build settings
- **Domain configuration**: DNS, SSL/TLS, WAF, Security, AI Crawl Control, Rules, Network, Caching, and analytics

Recommended baseline:

- SSL/TLS mode: Full (strict)
- Always Use HTTPS: on
- HSTS: on after certificate and redirect behavior are confirmed
- Minimum TLS: TLS 1.2 or newer
- Bot Fight Mode or equivalent bot controls: on when available
- AI crawler controls: block unwanted AI bots while allowing `/robots.txt`
- Managed `robots.txt`: off when you publish your own files from `defaults/public/`
- URL normalization: on
- Remove `X-Powered-By` response headers: on

## WAF and abuse controls

- Block obvious scanner probes before they reach the Worker
- Block unexpected HTTP methods at the edge
- Challenge suspicious non-bot traffic that targets short-link candidates
- Rate-limit short-link candidates to protect Worker CPU and analytics quotas
- Keep runtime blocklist policy enabled as the application fallback
- Review `defaults/v8s-blocklist-categories.json` when generated feeds change
- Keep editable source policy in `custom/v8s-policies.json`; treat `build/v8s-blocklist.json` as generated output

Do not use a redirector for phishing, malware, disguised tracking, undisclosed affiliate routing, shortener chains, or any destination that violates user expectations.

## Analytics

- Use server-side analytics only; do not add browser tracking scripts
- Configure either Umami or Fathom with Worker variables and secrets
- Confirm blocked WAF traffic is not sent to analytics
- Confirm collection works with one test redirect
- Review vendor rate limits and account quotas before launch
- Watch the first 24 hours for scanner noise that could consume quota

## Legal and public files

- Publish `robots.txt`, `llms.txt`, and `llms-full.txt` from `defaults/public/` or override them in `custom/public/`
- Make the instance intentionally boring to bots: this is a redirect engine, not a public content site
- Confirm `v8s-site-config.json` lists the intended `supported_languages`
- Add or customize terms, privacy, abuse, and security contact pages appropriate for the owner and jurisdiction. See [Legal and trust pages](/docs/legal-trust-pages/)
- Treat the included legal text as a draft, not legal advice

## Branding and local tooling

- Use `npm run setup` when you want installer-managed `custom/public` pages and split-color wordmark configuration
- Confirm localized redirected badges exist for supported languages
- Run `npm run optimize:badges` after editing default redirected badge SVGs
- Run `npm run local-install` when the owner wants the local shell helper, local registry path, and installed `lnk`
- Use `npm run local-publish` only from an owner workstation that should validate, commit, and push configured local paths

The strongest release posture is boring: small Worker, reviewed static registry, narrow Cloudflare exposure, protected operational pages, and clear ownership of every destination.
