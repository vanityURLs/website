---
title: "vanityURLs vs hosted and self-hosted shorteners"
date: 2026-05-27
author: "Benoît H. Dicaire"
description: "A draft comparison of vanityURLs, hosted URL shorteners, and self-hosted alternatives for operators who want branded short links as code."
tags: ["comparison", "short-links", "cloudflare"]
featured: false
draft: true
---

vanityURLs is for operators who want a branded short-link domain they can run from Git on Cloudflare Workers, with no shared hosted account, no default click database, and configuration that can be reviewed like code. It is not trying to replace every hosted dashboard; it is trying to make a small, auditable redirector easy to own.

## Comparison table

| Dimension | vanityURLs | Bitly | Dub | Short.io | YOURLS | Shlink |
| --- | --- | --- | --- | --- | --- | --- |
| Custom domain | Operator-owned Cloudflare domain | Hosted plan feature | Hosted plan feature | Hosted plan feature | Self-hosted domain | Self-hosted domain |
| Analytics model | Off by default; optional server-side Umami or Fathom | Hosted analytics | Hosted analytics | Hosted analytics | Built-in self-hosted stats | Built-in self-hosted visits |
| Account required | No visitor accounts; operator uses Cloudflare and GitHub | Hosted account | Hosted account | Hosted account | Admin account on your install | Admin/API access on your install |
| Data residency | Depends on operator Cloudflare, Git, and optional analytics choices | Provider-controlled | Provider-controlled | Provider-controlled | Your hosting/database choices | Your hosting/database choices |
| ToS surface | Instance operator terms generated from config | Provider terms plus your link use | Provider terms plus your link use | Provider terms plus your link use | Your terms | Your terms |
| Deployment model | Cloudflare Worker plus Static Assets from Git | Hosted SaaS | Hosted SaaS, open-source core | Hosted SaaS | PHP app and database | PHP service and database |
| Cost at scale | Cloudflare usage plus optional analytics provider | Plan-based | Plan-based | Plan-based | Hosting and maintenance | Hosting and maintenance |
| Code visibility | Open source MIT code and instance config in Git | Closed hosted service | Open-source product with hosted service | Closed hosted service | Open source | Open source |
| Link scheduling | Configured in Git and evaluated by the Worker | Plan/product dependent | Product dependent | Product dependent | Plugin/custom code dependent | Built-in feature set dependent |
| Bulk operations | Text file and `lnk` CLI workflow | Dashboard/API/import tooling | Dashboard/API/import tooling | Dashboard/API/import tooling | Admin/API/database workflows | CLI/API workflows |

## Bitly

[Bitly](https://bitly.com/) wins when a team wants a mature hosted product, a dashboard-first workflow, brand and campaign features, and a vendor responsible for product operations. It is the safer choice when non-technical users need to create and inspect links without touching Git or Cloudflare.

Against vanityURLs, the tradeoff is ownership surface. Bitly is a hosted account with provider terms, plan limits, and provider analytics; vanityURLs keeps the redirector in the operator's Cloudflare account and the configuration in Git.

Pick Bitly when the shortener is a marketing or team collaboration tool. Pick vanityURLs when the shortener is infrastructure you want to version, audit, and deploy yourself.

## Dub

[Dub](https://dub.co/) is strong for developer-focused hosted link management: polished APIs, productized analytics, teams, and a modern dashboard. It also has open-source code, which makes it easier to inspect than a fully closed hosted shortener.

Against vanityURLs, Dub is broader and more product-like. vanityURLs is intentionally narrower: a stateless Cloudflare Worker, Git-based configuration, optional analytics, and generated operator pages.

Pick Dub when you want a developer platform for links with hosted ergonomics. Pick vanityURLs when the key requirement is a small operator-owned redirector rather than a link-management SaaS account.

## Short.io

[Short.io](https://short.io/) is a hosted custom-domain shortener with dashboards, API access, analytics, and multi-domain workflows. It fits teams that want a managed control plane and do not want to design an operations model around Git.

Against vanityURLs, Short.io shifts operational responsibility to the provider but also shifts data, billing, and policy surface there. vanityURLs requires more setup discipline, but the instance remains tied to the operator's Cloudflare, GitHub, and optional analytics choices.

Pick Short.io when speed of adoption and dashboard management matter most. Pick vanityURLs when the operator wants the redirect rules and public trust posture to live in a repository.

## YOURLS

[YOURLS](https://yourls.org/) is a long-running self-hosted shortener with an admin UI, plugins, API support, and built-in statistics. It is a good fit when you want a traditional self-hosted web application with a database and extensibility through plugins.

Against vanityURLs, YOURLS gives you a UI and dynamic storage, while vanityURLs gives you a database-free Worker generated from files. YOURLS can be more flexible at runtime; vanityURLs is easier to reason about as a static, deployable artifact.

Pick YOURLS when you want a conventional self-hosted admin application. Pick vanityURLs when Cloudflare Workers, Git review, and stateless runtime behavior are the point.

## Shlink

[Shlink](https://shlink.io/) is a self-hosted short-link platform with a service/API model, visit tracking, CLI tooling, and a richer backend than a static redirect registry. It fits operators who want an open-source application but still need a dynamic service.

Against vanityURLs, Shlink has a wider application surface and a database-backed model. vanityURLs gives up that runtime flexibility in exchange for a smaller edge runtime and file-based configuration.

Pick Shlink when you need an open-source URL shortener with an API-first backend and persistent visit data. Pick vanityURLs when your preferred source of truth is Git and the deployment target is a Cloudflare Worker.

## Kutt

[Kutt](https://github.com/thedevs-network/kutt) is an open-source shortener with accounts, custom domains, APIs, and statistics. It is closer to a self-hosted SaaS-style application than a static redirector.

Against vanityURLs, Kutt is a better fit for multi-user link management. vanityURLs is a better fit for a single operator or small team that prefers pull requests, local commands, and generated runtime files.

Pick Kutt when users need accounts and a web application. Pick vanityURLs when accounts are unnecessary and removing the database is a feature.

## When not to choose vanityURLs

Do not choose vanityURLs if you need hosted account management, per-user dashboards, built-in billing, a public link creation API, link editing without Git, or analytics that work without configuring a provider. Do not choose it if your team cannot operate Cloudflare DNS, Workers, GitHub, and a small Node-based build workflow.

Also avoid vanityURLs when you need mutable runtime state. The project is deliberately shaped around deployable configuration, so every link change should be reviewed, built, and deployed like code.

## Sources

- [Bitly](https://bitly.com/)
- [Dub](https://dub.co/)
- [Short.io](https://short.io/)
- [YOURLS](https://yourls.org/)
- [Shlink](https://shlink.io/)
- [Kutt](https://github.com/thedevs-network/kutt)
