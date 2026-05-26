---
aside: false
title: "Demo: v8s.link"
description: "How the public v8s.link instance demonstrates the Quickstart baseline."
weight: 50

---

v8s.link is the public demo instance for vanityURLs. It shows the Quickstart baseline after the redirector is deployed, before analytics, full branding, jurisdiction, privacy pages, and terms pages are customized.

The source repository is [vanityURLs/v8s.link](https://github.com/vanityURLs/v8s.link), and the deployed instance is [https://v8s.link](https://v8s.link).

## Current configuration

| Area | Demo value |
|---|---|
| Short domain | `v8s.link` |
| Repository | [`vanityURLs/v8s.link`](https://github.com/vanityURLs/v8s.link) |
| Worker name | `v8s-link` |
| Supported languages | `de,en,es,fr,it`, with English as the fallback |
| Analytics | Disabled |
| Legal and jurisdiction pages | Deferred |
| Branding | Split-color domain wordmark copied to `custom/public`; no slogan |
| Link inventory | Starter links only: `home`, `status`, `docs` |

## What the reference shows

{{< cards >}}
{{< card title="Default pages" icon="layout" href="/docs/reference/repository-layout/" >}}
Search-style home, expand page, localized status pages, icons, manifest, security headers, and protected stats shell.
{{< /card >}}
{{< card title="v8s-links.txt" icon="link" href="/docs/demo/links/" >}}
The intentionally small starter link inventory created by `npm run setup`.
{{< /card >}}
{{< card title="Worker runtime" icon="cloud" href="/docs/reference/runtime-security/" >}}
Static assets plus Worker routing, generated `v8s.json`, and [Cloudflare Access protection](/docs/customize/access-control/) for operational paths.
{{< /card >}}
{{< /cards >}}

## Useful live paths

| Path | What it proves |
|---|---|
| [v8s.link](https://v8s.link) | Default home page for searching or opening short links |
| [v8s.link/expand/](https://v8s.link/expand/) | Preview a short-link destination without opening it |
| [v8s.link/404.html](https://v8s.link/404.html) | Localized missing-link page |
| [v8s.link/expired.html](https://v8s.link/expired.html) | Expired lifecycle page |
| [v8s.link/disabled.html](https://v8s.link/disabled.html) | Disabled lifecycle page |
| [v8s.link/maintenance.html](https://v8s.link/maintenance.html) | Maintenance lifecycle page |
| [v8s.link/.well-known/security.txt](https://v8s.link/.well-known/security.txt) | Machine-readable vulnerability disclosure contact following [RFC 9116: A File Format to Aid in Security Vulnerability Disclosure](https://www.rfc-editor.org/info/rfc9116/) |

## What not to read into it

The demo intentionally does not configure analytics, final legal copy, jurisdiction-specific privacy and terms pages, or finished branding. Those are phase 2 customization decisions.

Use this instance to compare your first deployment against a known working baseline. Then move to the Customize section when you are ready to make the instance yours.
