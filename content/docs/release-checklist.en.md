---
aside: false
title: "Release checklist"
description: "Production checklist for deploying or upgrading a v8s instance on Cloudflare."
weight: 40

---

Use this checklist before launching a new instance or promoting a major upgrade. A vanityURLs instance is robust, but anything shiny on the internet attracts scanners, bots, and abuse attempts.

## Repository

- Run `npm run clean` before release or before comparing generated output
- Refresh upstream `defaults/` and `scripts/` with the [upgrade workflow](/docs/upgrading/)
- Keep all instance-owned files in `custom/`
- Keep Worker runtime edits in `scripts/workers/`; treat `src/` as generated
- Run `npm run check`
- Review generated registry, runtime policy, and site config changes
- Commit and deploy from a clean working tree

CI should run `npm run check` before deployment. Keep deployment credentials out of the repo and configure them as GitHub or Cloudflare secrets.

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

- **Zero Trust**: {{< arrow left >}} [Access control](/docs/access-control/) documentation
  - Access applications & policies
  - Identity providers
  - Settings
- **Workers & Pages**: {{< arrow left >}} [Workers](/docs/quickstart/#connect-the-repository-to-workers--pages) documentation and [wrangler.toml](/blog/wrangler/#keep-wranglertoml-close-to-the-deployment-boundary)
  - deployment
  - assets binding
  - variables
  - observability
  - custom domains
  - build settings
- **Domain configuration**: {{< arrow left >}} [Network protection](/docs/network-protection/) documentation
  - AI Crawl Control
  - Analytics
  - Caching
  - DNS
  - Network
  - Rules
  - Security
  - SSL/TLS
  - WAF

Use [Network protection](/docs/network-protection/) for the recommended DNS, SSL/TLS, Security, WAF, AI Crawl Control, Rules, Network, Caching, and Cloudflare analytics settings.

## Abuse controls

- Keep runtime blocklist policy enabled as the application fallback after Cloudflare network controls
- Review `defaults/v8s-blocklist-categories.json` when generated feeds change
- Keep editable source policy in `custom/v8s-policies.json`; treat `build/v8s-blocklist.json` as generated output

Do not use a redirector for phishing, malware, disguised tracking, undisclosed affiliate routing, shortener chains, or any destination that violates user expectations.

## Analytics

- Use server-side analytics only; do not add browser tracking scripts
- Configure either Umami or Fathom with Worker variables and secrets
- Confirm traffic blocked by [Network protection](/docs/network-protection/) is not sent to analytics
- Confirm collection works with one test redirect
- Review vendor rate limits and account quotas before launch
- Watch the first 24 hours for scanner noise that could consume quota

## Operational smoke checks

- Confirm a known active short link returns the expected redirect
- Confirm a hidden or missing slug returns 404
- Confirm a blocked target fails validation
- Confirm `/_stats` and `/_tests` are protected by [Cloudflare Access](/docs/access-control/)
- Confirm server-side analytics receive one test event when analytics are enabled
- Confirm [Network protection](/docs/network-protection/) blocks commodity scanner traffic before it reaches the Worker

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
