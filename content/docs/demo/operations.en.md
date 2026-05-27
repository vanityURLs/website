---
aside: false
title: "Demo operations"
description: "Operational behavior, live paths, and example link inventory for the v8s.link demo instance."
weight: 20
aliases:
  - /docs/demo/links/

---

The source repository is [vanityURLs/v8s.link](https://github.com/vanityURLs/v8s.link), and the deployed instance is [https://v8s.link](https://v8s.link). It's time to inspect how this instance behave at runtime.

## Core pages

English (`en`) is the main and fallback language when a localized page is unavailable because it's not currently [supported](https://www.vanityurls.link/en/docs/reference/i18n/) or installed during setup.

| Path | What it proves |
|---|---|
| [v8s.link](https://v8s.link) | Default home page for searching or opening short links |
| [v8s.link/expand/](https://v8s.link/expand/) | Preview a short-link destination without opening it |
| [v8s.link/404.html](https://v8s.link/404.html) | Localized missing-link page |
| [v8s.link/expired.html](https://v8s.link/expired.html) | Expired lifecycle page |
| [v8s.link/disabled.html](https://v8s.link/disabled.html) | Disabled lifecycle page |
| [v8s.link/maintenance.html](https://v8s.link/maintenance.html) | Maintenance lifecycle page |
| [v8s.link/.well-known/security.txt](https://v8s.link/.well-known/security.txt) | Machine-readable vulnerability disclosure contact. |

## Links

The current links are stored in [`custom/v8s-links.txt`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-links.txt). Each non-comment row uses the link format documented in [Link format](/docs/reference/link-format/):

```text
slug|target|state|title|description|tags|owner|expires_at|notes
```

Run `./scripts/lnk list` in your own instance to see the current local inventory. Run `./scripts/lnk add` when you are ready to add a link through the command line interface.

| Slug | Long link | What it demonstrates |
|---|---|---|
| [`v8s.link/ai/chat`](https://v8s.link/ai/chat) | `chatgpt.com` | Nested namespace for AI tools |
| [`v8s.link/pkg/n`](https://v8s.link/pkg/n) | `www.npmjs.com/package` | Compact package-manager namespace |
| [`v8s.link/social/x`](https://v8s.link/social/x) | `x.com/BHDicaire/` | Social profile namespace |
| [`v8s.link/v8s/doc`](https://v8s.link/v8s/doc) | `vanityUrls.link/en/docs/` | Project documentation shortcut |
| [`v8s.link/v8s/hugo`](https://v8s.link/v8s/hugo) | `github.com/vanityURLs/website` | Website source shortcut |
| [`v8s.link/v8s/issues`](https://v8s.link/v8s/issues) | `github.com/vanityurls/vanityurls/issues` | Issue tracker shortcut |
| [`v8s.link/v8s/latest`](https://v8s.link/v8s/latest) | `github.com/vanityURLs/website/releases/latest` | Latest release shortcut |
| [`v8s.link/v8s/roadmap`](https://v8s.link/v8s/roadmap) | `github.com/orgs/vanityURLs/projects` | Project roadmap shortcut |
| [`v8s.link/v8s/status`](https://v8s.link/v8s/status) | `status.vanityUrls.link` | Public status shortcut |

```text
ai/chat|chatgpt.com||Open AI|Artificial Intelligence|ai|bhd||
pkg/n|www.npmjs.com/package||NPM|Distribution / package manager|pkg,js|bhd||
social/x|x.com/BHDicaire/||X profile|Social profile on X|social|bhd||
v8s/doc|vanityUrls.link/en/docs/||VanityURLs documentation (web)||v8s,git|bhd|||
v8s/hugo|github.com/vanityURLs/website||V8S website (hugo)|v8s,hugo|bhd|||
v8s/issues|github.com/vanityurls/vanityurls/issues||V8S web site|documentation|v8s,git|bhd|||
v8s/latest|github.com/vanityURLs/website/releases/latest||V8S web site|documentation|v8s,git|bhd|||
v8s/roadmap|github.com/orgs/vanityURLs/projects||V8S web site|documentation|v8s,git|bhd|||
v8s/status|status.vanityUrls.link||Uptime monitoring|status page|v8s,web|bhd|||
```

## Lifecycle examples

| Slug | State | What to expect |
|---|---|---|
| [`v8s.link/test/1`](https://v8s.link/test/1) | `permanent` | Permanent redirect |
| [`v8s.link/test/2`](https://v8s.link/test/2) | `ephemeral` | Temporary redirect |
| [`v8s.link/test/3`](https://v8s.link/test/3) | `expired` with an expiry date | Expired state page |
| [`v8s.link/test/4`](https://v8s.link/test/4) | `disabled` | Disabled state page |
| [`v8s.link/test/5`](https://v8s.link/test/5) | `maintenance` | Maintenance state page |
| [`v8s.link/test/6`](https://v8s.link/test/6) | `deactivated` | True not-found behavior |

```text
test/1|youtu.be/dQw4w9WgXcQ|permanent|Test permanent (state)||test|bhd|||
test/2|youtu.be/dQw4w9WgXcQ|ephemeral|Test permanent (ephemeral)|Ephemeral -> 302|test|bhd|||
test/3|youtu.be/dQw4w9WgXcQ|expired|Test expired (state)|effective state to expired|test|bhd|2026-04-30||
test/4|youtu.be/dQw4w9WgXcQ|disabled|Test disabled (state)|-> /disabled|test|bhd|||
test/5|youtu.be/dQw4w9WgXcQ|maintenance|Test maintenance (state)||test|bhd|||
test/6|youtu.be/dQw4w9WgXcQ|deactivated|Test deactivated (state)|deactivated -> true 404|test|bhd|||
```

## Operational references

- [Link format](/docs/reference/link-format/) documents the pipe-separated source format used by `custom/v8s-links.txt`
- [Runtime security](/docs/reference/runtime-security/) explains Worker routing, generated runtime files, protected assets, and Cloudflare Access boundaries
- [Access control](/docs/customize/access-control/) covers Cloudflare Access for private operational paths
- [Policy and blocklist](/docs/customize/blocklist/) explains target URL policy, shortener loops, malware hosts, and local overrides
- [Reading your admin dashboard](/blog/reading-your-admin-dashboard/) gives context for monitoring an instance after deployment
- [Runtime security for a small redirector](/blog/runtime-security-for-a-small-redirector/) explains why the Worker stays small and lets Cloudflare handle edge protection
