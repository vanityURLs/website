---
aside: false
title: "Demo: v8s.link"
description: "How the public v8s.link instance demonstrates the current vanityURLs defaults and Worker runtime."
weight: 50

---

v8s.link is the public reference instance for vanityURLs. It demonstrates the current defaults directory, generated registry, protected operational pages, lifecycle states, blocklist policy, and Cloudflare Worker deployment model.

## What the reference shows

{{< cards >}}
{{< card title="Default pages" icon="layout" href="/docs/reference/repository-layout/" >}}
Search-style home, expand page, localized status pages, icons, manifest, security headers, and protected stats shell.
{{< /card >}}
{{< card title="v8s-links.txt" icon="link" href="/docs/demo/links/" >}}
Sample exact links, namespaced links, lifecycle test links, metadata, tags, owners, and expiry behavior.
{{< /card >}}
{{< card title="Worker runtime" icon="cloud" href="/docs/reference/runtime-security/" >}}
Static assets plus Worker routing, generated `v8s.json`, [Cloudflare Access protection](/docs/customize/access-control/), and server-side analytics hooks.
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

## What to copy

Use the layout, default pages, `custom/` override pattern, Worker settings, and validation workflow. Replace the demo links with your own `custom/v8s-links.txt`; the product starter file stays intentionally small.
