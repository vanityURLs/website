---
title: "Security Statement"
description: "How vanityURLs.link is secured — encryption, hosting, headers, email protection, and open-source auditability."
---
{{< callout type="note" title="Last reviewed: April 2026" >}}
This statement applies to vanityURLs.link. It does not apply to self-hosted instances of vanityURLs, which are the sole responsibility of their operators.
{{< /callout >}}

vanityURLs.link is a static documentation website for the open-source project. vanityURLs does NOT do

- **No cookies** — the site sets no cookies of any kind
- **No analytics** — there is no tracking, session recording, or analytics script
- **No personal data collection** — no forms, no accounts, no logs of visitor data
- **No third-party advertising** — no ad networks, no programmatic advertising
- **No CDN-injected scripts** — Cloudflare's [Zaraz](https://www.cloudflare.com/products/zaraz/) and Rocket Loader are not enabled

The only external network request a visitor's browser may make is to jsDelivr, and only on documentation pages that include Mermaid diagrams. Fonts are served directly from vanityurls.link. Search is handled client-side by [Pagefind](https://pagefind.app/) — queries never leave your browser.

The source code for this website is public. You can audit every line of it at: [github.com/vanityURLs/website](https://github.com/vanityURLs/website).

This includes:
- The Hugo templates and layouts
- The `_headers` security configuration
- The GitHub Actions CI/CD workflow
- The Tailwind CSS configuration and all JavaScript

If you find something unexpected, please [report it](vulnerability).

## Cloudflare Pages (hosting)

This website is served exclusively by [Cloudflare Pages](https://pages.cloudflare.com/), a globally distributed serverless platform. Cloudflare provides:

- **TLS 1.3** — all connections are encrypted using TLS 1.3 (TLS 1.2 minimum). Older protocol versions are rejected.
- **HSTS** — HTTP Strict Transport Security is enforced, preventing protocol downgrade attacks.
- **HTTP/2 and HTTP/3** — modern transport protocols are enabled automatically.
- **DDoS protection** — Cloudflare's network absorbs volumetric attacks at the edge before they reach the origin.
- **Zero origin servers** — there is no origin server to attack. The site is served entirely from Cloudflare's edge cache.

Cloudflare's infrastructure security practices are documented at [cloudflare.com/trust-hub](https://www.cloudflare.com/trust-hub/).

### HTTP Security Headers

Every response from vanityURLs.link includes the following headers, defined in `build/_headers` and enforced by Cloudflare Pages:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevents the site from being embedded in iframes — blocks clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter for older browsers |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer information sent to third parties |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Explicitly disables access to device APIs |
| `Content-Security-Policy` | (see below) | Restricts which resources the browser may load |
| `frame-ancestors` | `none` | Modern replacement for X-Frame-Options |

### Content Security Policy

```
default-src 'self';
script-src  'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net;
style-src   'self' 'unsafe-inline';
font-src    'self';
img-src     'self' data:;
connect-src 'self';
frame-ancestors 'none'
```

External resources are limited to: jsDelivr CDN for the Mermaid diagram library, used only on documentation pages that include diagrams. `'wasm-unsafe-eval'` in `script-src` is required by the client-side Pagefind search engine, which uses WebAssembly.

## Email Domain Protection

vanityURLs.link does not send email. The domain is locked against spoofing with:

| Record | Value | Effect |
|--------|-------|--------|
| `DMARC _dmarc` | `p=reject; sp=reject; adkim=s; aspf=s` | Receiving mail servers must reject any email claiming to come from this domain |
| `DKIM *.domainkey` | `v=DKIM1; p=` | Empty public key — no DKIM signature can be valid for this domain |
| `MTA-STS _mta-sts` | `v=STSv1` | Mail servers contacting this domain must use TLS |

This configuration makes it technically impossible to forge a valid email from `@vanityurls.link`.

## Vulnerability Reporting

If you discover a security issue in this website or the vanityURLs software, [report it](vulnerability).