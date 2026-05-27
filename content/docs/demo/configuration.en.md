---
aside: false
title: "Demo configuration"
description: "Configuration values used by the public v8s.link demo instance."
weight: 10

---

Use this page as the configuration reference for the values used throughout [Quickstart](/docs/setup/quickstart/). The demo repository shows the operator-owned layer, not only the upstream product defaults.

## Quickstart assumptions

Quickstart uses these values so the commands stay concrete. Replace them with the short domain, repository, Cloudflare team, operator identity, and contact emails for your own instance.

| Assumption | Example used in Quickstart |
| --- | --- |
| Short domain | `v8s.link` |
| Local directory | `v8s-link` |
| GitHub account name | `your-github-account` |
| GitHub repository name | `v8s-link` |
| Worker name | `v8s-link` |
| Cloudflare Access team domain | `vanityurls.cloudflareaccess.com` |
| Operator legal name | `Benoît H. Dicaire` |
| Operator domain for contact emails | `vanityurls.link` |
| Trust & Safety contact | `abuse@vanityurls.link` |
| Security contact | `security@vanityurls.link` |

## Instance configuration

| Area | Demo value |
|---|---|
| Short domain | `v8s.link` |
| Repository | [`vanityURLs/v8s.link`](https://github.com/vanityURLs/v8s.link) |
| Worker name | `v8s-link` |
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

{{< cards >}}
{{< card title="Configuration files" icon="file-cog" href="/docs/reference/configuration-files/" >}}
How `custom/v8s-site-config.json`, `wrangler.toml`, generated files, and local settings fit together.
{{< /card >}}
{{< card title="Repository layout" icon="folder-tree" href="/docs/reference/repository-layout/" >}}
Where defaults, custom overrides, generated output, local tooling, and Worker source live.
{{< /card >}}
{{< card title="Custom overrides" icon="layers" href="/docs/customize/custom-overrides/" >}}
How instance-owned files under `custom/` replace or extend product defaults safely.
{{< /card >}}
{{< /cards >}}

For planning context, read [Choosing a short domain for redirects](/blog/choosing-a-short-domain-for-redirects/), [Wrangler Without Shooting Yourself in the Foot](/blog/wrangler/), and [Keeping vanityURLs upgradable with custom overrides](/blog/keeping-vanityurls-upgradable-with-custom-overrides/).

## What not to read into it

The demo intentionally does not configure analytics, final legal copy, jurisdiction-specific privacy and terms pages, or finished branding. Those are phase 2 customization decisions.
