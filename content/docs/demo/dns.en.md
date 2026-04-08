---
title: "DNS Setup"
description: "The complete DNS configuration for v8s.link and vanityurls.link, with every record explained."
nav_order: 34
---

The DNS configuration for both `vanityurls.link` and `v8s.link` is managed as code using [DNSControl](https://dnscontrol.org/) — a declarative DNS management tool. The source is at [vanityURLs/dnsConfiguration](https://github.com/vanityURLs/dnsConfiguration/blob/main/domains/vanityURLs.js).

You do **not** need DNSControl to use vanityURLs. The same records can be added manually in the Cloudflare dashboard. This page explains what each record does so you can replicate it.

## vanityurls.link — the docs website

### Core record: website

```js
ALIAS('@', 'website-2ax.pages.dev.', cfProxy)
```

This is the most important record. The `@` refers to the root domain (`vanityurls.link`). The ALIAS points to the Cloudflare Pages project URL for the documentation website.

`cfProxy` means the record is **Proxied** (orange cloud in the Cloudflare dashboard), which enables:
- Cloudflare's CDN caching
- DDoS protection
- SSL termination at the edge
- The `X-Robots-Tag` and other custom headers from `_headers` to be applied

{{< callout type="tip" title="ALIAS vs CNAME on the root" >}}
The DNS standard forbids CNAME records on the zone apex (`@`). Cloudflare's ALIAS (also called CNAME Flattening) works around this by resolving the target to an A record. Always use ALIAS for root domains in Cloudflare.
{{< /callout >}}

### Subdomains: convenience redirects

```js
AAAA("git",  '2001:DB8::1', cfProxy),
CF_TEMP_REDIRECT("git.vanityurls.link/*", "https://github.com/vanityURLs/$1"),

AAAA("code", '2001:DB8::1', cfProxy),
CF_TEMP_REDIRECT("code.vanityurls.link/*", "https://github.com/vanityURLs/website/$1"),

AAAA("www",  '2001:DB8::1', cfProxy),
CF_TEMP_REDIRECT("www.vanityurls.link/*", "https://vanityURLs.link/$1")
```

These use a two-step pattern:
1. An `AAAA` record pointing to `2001:DB8::1` — a Cloudflare-reserved placeholder IP that never routes to a real server
2. A Cloudflare Page Rule (`CF_TEMP_REDIRECT`) that intercepts requests and redirects them

This means `git.vanityurls.link/anything` → `github.com/vanityURLs/anything` — all processed at the Cloudflare edge. No server involved.

In the Cloudflare dashboard, these are configured under **Rules → Redirect Rules**.

### Email security records

```js
TXT('*.domainkey', "v=DKIM1; p=")
TXT('_dmarc', "v=DMARC1;p=reject;sp=reject;adkim=s;aspf=s;")
TXT('_mta-sts', "v=STSv1; id=20220101000000Z;")
ALIAS('mta-sts', 'mta-sts-vanityurls-link.pages.dev.', cfProxy)
```

These records protect the domain from email spoofing, even though no email is sent from it:

| Record | Purpose |
|--------|---------|
| `DKIM *.domainkey` | Empty public key signals no valid DKIM senders — blocks spoofed signed emails |
| `DMARC _dmarc` | `p=reject` tells receivers to reject any email claiming to be from this domain |
| `MTA-STS _mta-sts` | Signals that mail servers must use TLS when delivering to this domain |
| `MTA-STS ALIAS mta-sts.` | The MTA-STS policy is served via a Cloudflare Pages project |

{{< callout type="note" title="Why email records on a no-email domain?" >}}
Without DMARC `p=reject`, anyone can send spoofed phishing emails that appear to come from `vanityurls.link`. Setting DMARC to reject with no valid DKIM senders locks down the domain completely.
{{< /callout >}}

### GitHub Pages verification

```js
TXT('_github-pages-challenge-vanityURLs', '190fe223ffbdc9a230854700615524')
```

Required by GitHub when adding a custom domain to a GitHub Pages project under the `vanityURLs` organisation. If you're using Cloudflare Pages (not GitHub Pages), you don't need this record.

### Ignored records

```js
IGNORE_NAME("@")
```

DNSControl's `IGNORE_NAME("@")` tells the tool to leave the root `@` records managed by Cloudflare Email Routing (the MX records and SPF TXT) untouched. Without this, DNSControl would delete them.

## v8s.link — the short URL domain

### Core record: domain-level passthrough

```js
AAAA("@", '2001:DB8::1', cfProxy),
CF_TEMP_REDIRECT("v8s.link/*", "https://vanityURLs.link/$1"),
```

This is the key architectural decision for v8s.link: **the entire domain redirects to vanityURLs.link**. Any path on `v8s.link` is forwarded to `vanityURLs.link` with the same path.

This means the Cloudflare Pages project for v8s.link (`v8s-link.pages.dev`) processes the `_redirects` rules, but those rules are defined by `static.lnk` and `dynamic.lnk`. The `build/_redirects` file lists:
- `/` → `vanityURLs.link/`
- `/blog` → `vanityURLs.link/en/blog`
- etc.

The domain redirect acts as a fallback: any path not matched by `_redirects` falls through to the Cloudflare DNS redirect rule.

### `git` subdomain

```js
AAAA("git", '2001:DB8::1', cfProxy),
CF_TEMP_REDIRECT("git.v8s.link/*", "https://github.com/vanityURLs/$1"),
```

`git.v8s.link/vanityURLs` → `github.com/vanityURLs/vanityURLs`. A subdomain-level namespace for GitHub repos, separate from the `static.lnk` `/github` redirect.

## Minimal DNS setup for a new deployment

If you're setting up your own domain and don't need all the email security records, the minimum required configuration in Cloudflare is:

{{% steps %}}

### Add a CNAME (or ALIAS) for the root

In Cloudflare DNS, add:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `@` | `YOUR-PROJECT.pages.dev` | ✅ Proxied |

Or use ALIAS if CNAME on `@` is blocked.

### Add the custom domain in Cloudflare Pages

In your Pages project: **Custom domains** → **Set up a custom domain** → enter your domain.

Cloudflare automatically adds the necessary verification records.

### Add DMARC (recommended)

| Type | Name | Content |
|------|------|---------|
| TXT | `_dmarc` | `v=DMARC1;p=reject;sp=reject;adkim=s;aspf=s;` |

### Verify with lnk check

```bash
lnk check /github
# Checking https://your-domain/github...
# 301 → https://github.com/yourname  (43ms) ✓
```

{{% /steps %}}

## DNS as code: using DNSControl

The vanityURLs team manages DNS declaratively. The full setup requires:

1. [Install DNSControl](https://dnscontrol.org/getting-started)
2. Configure `creds.json` with your Cloudflare API token
3. Run `dnscontrol preview` to see planned changes
4. Run `dnscontrol push` to apply

The `dnsConfiguration` repository shows how to structure a multi-domain setup. This is optional — everything in this guide can be done through the Cloudflare dashboard.
