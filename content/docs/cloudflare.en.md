---
aside: false
title: "Cloudflare setup"
description: "Cloudflare setup and operating guidance for vanityURLs Workers, custom domains, DNS, Access, identity providers, observability, and zone protection."
nav_order: 10
---

The current vanityURLs runtime deploys as a Cloudflare Worker with static assets. The Worker is the origin for the short-link hostname, so use a Worker Custom Domain instead of the older Pages `_redirects` or DNS `AAAA 100::` route pattern.

Use the quickstart for the shortest path to a plain instance. Use this page when you need the full Cloudflare checklist for the dashboard, Git integration, Access, identity providers, variables, DNS, security, and observability.

## Cloudflare navigation map

Cloudflare splits the required vanityURLs settings across three different dashboard areas. Check the dashboard scope before changing a setting; being in the right Cloudflare product is not always enough.

| Dashboard area | How to get there | vanityURLs settings there |
|---|---|---|
| Zero Trust | Main menu, then Zero Trust | Access applications, Access policies, identity providers, Zero Trust settings |
| Workers & Pages | Main menu, Build, Compute, Workers & Pages | Worker deployments, metrics, logs, bindings, custom domains, Worker settings |
| Domain configuration | Main menu, Account home, then click the domain in the main page content | DNS, SSL/TLS, Security, WAF rules, AI Crawl Control, Rules settings, Network, Caching |

In the Cloudflare UI, the domain configuration area may not have a clear product name. The most reliable signal is the domain name in the top line and a left menu with items such as DNS, SSL/TLS, Security, Rules, Network, and Caching.

Use Zero Trust for who may access private paths. Use Workers & Pages for the Worker itself. Use Domain configuration for traffic, DNS, TLS, and zone-level security.

## First-time setup

In **Workers & Pages**, create an application, continue with GitHub, select the repository, and confirm that the project name matches `wrangler.toml`.

Leave the build and deploy fields controlled by the repository unless you have a deliberate reason to override them in Cloudflare. The repository build copies `defaults/`, overlays `custom/`, validates `v8s.json`, builds the runtime policy and site config, and copies `scripts/workers/` into generated `src/` before Wrangler deploys. Disable builds for non-production branches unless branch deploys are part of your workflow.

Attach your short domain as a Worker Custom Domain. When the Custom Domain is active, the Worker should be the origin for that hostname.

Set runtime variables and secrets in **Workers & Pages**, under the Worker settings:

| Name | Type | Required when | Notes |
|---|---|---|---|
| `CF_ACCESS_TEAM_DOMAIN` | Variable | Protecting `/_stats` or `/_tests` | Use the full team domain, such as `<team>.cloudflareaccess.com`. |
| `CF_ACCESS_AUD` | Secret | Protecting `/_stats` or `/_tests` | Copy the Application Audience tag from the Access application. |
| `UMAMI_ENDPOINT` | Variable | Using Umami with a non-default endpoint | Umami Cloud uses `https://cloud.umami.is/api/send`. |
| `UMAMI_WEBSITE_ID` | Secret | Sending Umami analytics | Use the website ID for the public hostname. |

The Worker also supports other analytics providers and privacy modes. Keep provider IDs, API keys, Access audiences, and client secrets out of Git unless a value is explicitly documented as public configuration.

## Access control

Use Cloudflare Access to protect `/_stats`, `/_stats/*`, `/_tests`, and `/_tests/*`. Keep public redirects outside Access so visitors can follow short links without logging in.

The canonical vanityURLs Access setup lives in [Access control](/docs/access-control/). Use that page for Zero Trust applications, policy selectors, identity-provider choices, the Access team domain, and the `CF_ACCESS_AUD` Worker secret.

## Recommended Worker shape

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-05"
workers_dev = false
preview_urls = false

[build]
command = "npm run build"

[assets]
directory = "./build"
binding = "ASSETS"
not_found_handling = "404-page"
run_worker_first = [
  "/*",
  "!/*.css",
  "!/*.js",
  "!/*.png",
  "!/*.svg",
  "!/*.ico",
  "!/*.webmanifest",
  "!/*.txt",
  "!/*.xml",
  "!/fonts/*",
]

[[routes]]
pattern = "v8s.link"
custom_domain = true

[observability]
[observability.logs]
enabled = true
invocation_logs = true
```

The important parts are:

- `custom_domain = true`, because the Worker is the origin for the whole hostname
- `workers_dev = false` and `preview_urls = false`, because public preview hostnames are unnecessary for a production shortener
- `ASSETS` binding, because the Worker serves default and custom static pages from `build/`
- `run_worker_first`, because short-link lookup, protected paths, scanner blocks, and analytics must run before asset fallback
- Workers Logs enabled, because Cloudflare metrics are useful for performance and error rate, but application events belong in server-side analytics

## Domain configuration and network protection

Use [Network protection](/docs/network-protection/) for DNS, SSL/TLS, Security, WAF, AI Crawl Control, Rules, Network, Caching, zone analytics, and the Cloudflare Security Events workflow. Keep this Cloudflare setup page focused on Workers & Pages, Access pointers, Worker variables, observability split, and deploy behavior.

## Protected operations

The private operational paths are documented in [Access control](/docs/access-control/). After configuring Access, test `/_stats` and `/_tests` from a signed-out browser profile and confirm Cloudflare Access appears before the dashboard or test page.

## Observability split

Use Cloudflare dashboards for infrastructure signals:

- DNS, certificate, and TLS status
- Worker requests, errors, CPU time, wall time, and request duration
- WAF, rate limiting, bot, and AI crawler events
- Access login decisions for protected paths

Use vanityURLs server-side analytics for application events:

- pageviews
- redirects
- short-link misses
- expand lookups
- normalized bot events that reach the Worker

Traffic blocked by WAF, AI Crawl Control, Access, or rate limiting does not reach the Worker and should be reviewed in Cloudflare Security Events, not in Umami or Fathom.

## Build and deploy

The Cloudflare Git integration can run:

```text
npx wrangler@latest deploy --config wrangler.toml
```

The repository build command runs before deploy, copies `defaults/`, overlays `custom/`, validates `v8s.json`, builds `v8s-blocklist.json` and `v8s-site-config.json`, and copies `scripts/workers/` into generated `src/` for Wrangler.

Run the same validation locally before pushing:

```bash
npm run check
```

## References

- [Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
