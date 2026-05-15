---
title: "Release checklist"
description: "Production checklist for deploying or upgrading a v8s instance on Cloudflare."
---

Use this checklist before launching a new instance or promoting a major upgrade. A v8s instance is simple, but a short-link domain still attracts scanners, bots, and abuse attempts.

## Repository

- Run `npm run clean`.
- Refresh upstream `defaults/` and `scripts/` with the upgrade workflow.
- Keep all instance-owned files in `custom/`.
- Run `npm run check`.
- Review generated registry and blocklist changes.
- Commit and deploy from a clean working tree.

## Worker and assets

- Confirm the Worker has an `ASSETS` binding.
- Confirm the custom domain points to the Worker.
- Disable public `workers.dev` and preview URLs if they are not part of the service.
- Protect `/_stats` and `/_tests` with Cloudflare Access.
- Keep `/_stats/*` and `/_tests/*` policies narrow.
- Confirm the Worker accepts only `GET`, `HEAD`, and `OPTIONS`.
- Confirm private implementation assets return 404.

## Cloudflare domain configuration

In Cloudflare, the relevant settings are split across three places:

- **Zero Trust**: Access applications, Access policies, identity providers, and Zero Trust settings
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

- Block obvious scanner probes before they reach the Worker.
- Block unexpected HTTP methods at the edge.
- Challenge suspicious non-bot traffic that targets short-link candidates.
- Rate-limit short-link candidates to protect Worker CPU and analytics quotas.
- Keep runtime blocklist policy enabled as the application fallback.
- Review `defaults/v8s-blocklist-categories.json` when generated feeds change.

Do not use a redirector for phishing, malware, disguised tracking, undisclosed affiliate routing, shortener chains, or any destination that violates user expectations.

## Analytics

- Use server-side analytics only; do not add browser tracking scripts.
- Configure either Umami or Fathom with Worker variables and secrets.
- Confirm blocked WAF traffic is not sent to analytics.
- Confirm collection works with one test redirect.
- Review vendor rate limits and account quotas before launch.
- Watch the first 24 hours for scanner noise that could consume quota.

## Legal and public files

- Publish `robots.txt`, `llms.txt`, and `llms-full.txt` from `defaults/public/` or override them in `custom/public/`.
- Make the instance intentionally boring to bots: this is a redirect engine, not a public content site.
- Add terms, privacy, and security contact pages appropriate for the owner and jurisdiction.
- Treat the included legal text as a draft, not legal advice.

The strongest release posture is boring: small Worker, reviewed static registry, narrow Cloudflare exposure, protected operational pages, and clear ownership of every destination.
