---
aside: false
title: "Demo configuration"
description: "Configuration values used by the public v8s.link demo instance."
weight: 10

---

The source repository is [vanityURLs/v8s.link](https://github.com/vanityURLs/v8s.link), and the deployed instance is [https://v8s.link](https://v8s.link). Quickstart uses these values to ensure that commands stay concrete. Replace them with your own.

The demo intentionally does not configure analytics, final legal copy, jurisdiction-specific privacy and terms pages, or finished branding. Refer to the documentation for the customization.

## Configuration values

| Value | Demo configuration |
| --- | --- |
| Short domain | `v8s.link` |
| Local directory | `v8s-link` |
| GitHub account name | `your-github-account` |
| GitHub repository name | `v8s-link` |
| Worker name | `v8s-link` |
| Repository | [`vanityURLs/v8s.link`](https://github.com/vanityURLs/v8s.link) |
| Cloudflare Access team domain | `vanityurls.cloudflareaccess.com` |
| Operator legal name | `Benoît H. Dicaire` |
| Operator domain for contact emails | `vanityurls.link` |
| Trust & Safety contact | `abuse@vanityurls.link` |
| Security contact | `security@vanityurls.link` |
| Supported languages | `de,en,es,fr,it`, with English as the fallback |
| Analytics | Disabled |
| Legal and jurisdiction pages | Deferred |
| Branding | Split-color domain wordmark copied to `custom/public`; no slogan |
| Link inventory | Example inventory in [`custom/v8s-links.txt`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-links.txt) |

## Configuration files

| File | What to inspect |
|---|---|
| [`custom/v8s-site-config.json`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-site-config.json) | Instance settings created by `npm run setup` |
| [`wrangler.toml`](https://github.com/vanityURLs/v8s.link/blob/main/wrangler.toml) | Worker name, build command, Access team domain, route, and custom domain |
| [`custom/public/en/index.html`](https://github.com/vanityURLs/v8s.link/blob/main/custom/public/en/index.html) | Copied homepage with the split-color domain wordmark |
| [`custom/v8s-links.txt`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-links.txt) | Human-authored source of truth for short links |

When your instance behaves differently, compare your `custom/` files to the demo before digging into `defaults/`.

## Related documentation

### Planning context

- [Choosing a short domain for redirects](/blog/choosing-a-short-domain-for-redirects/)
- [Wrangler Without Shooting Yourself in the Foot](/blog/wrangler/)
- [Keeping vanityURLs upgradable with custom overrides](/blog/keeping-vanityurls-upgradable-with-custom-overrides/)
- [Where to start customizing vanityURLs](/blog/where-to-start-customizing-vanityurls/)

### Reference documentation

- [Configuration files](/docs/reference/configuration-files/)
- [Repository layout](/docs/reference/repository-layout/)
- [Custom overrides](/docs/customize/custom-overrides/)
- [Brand](/docs/customize/brand/)
- [Footer & pages](/docs/customize/footer-pages/)
- [Jurisdiction](/docs/customize/jurisdiction/)
