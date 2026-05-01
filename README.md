# ![Logo](.github/banner.png "Logo")

![GitHub Stars](https://img.shields.io/github/stars/vanityURLs/website?style=flat-square&logoColor=186ADE&labelColor=3E5462&color=CCFBF1)
![GitHub forks](https://img.shields.io/github/forks/vanityURLs/website?style=flat-square&logoColor=186ADE&labelColor=3E5462&color=CCFBF1)
![GitHub Last Commit](https://img.shields.io/github/last-commit/vanityURLs/website?style=flat-square&logoColor=186ADE&labelColor=3E5462&color=CCFBF1)
![GitHub licence](https://img.shields.io/github/license/vanityURLs/website?style=flat-square&logoColor=186ADE&labelColor=3E5462&color=CCFBF1)

vanityURLs is a simple solution to deploy a budget-friendly Url Shortener. It runs at scale in your Cloudflare subscription with continuous integration.

This repository contains the source code for the [vanityURLs.link website](https://vanityurls.link), built using the [Hugo](gohugo.io) static site generator.

## 🚀 Quick Start
To preview the site locally, ensure you have Hugo installed and run:
```bash
hugo server --buildDrafts
```
Then, visit `http://localhost:1313` in your browser.

## 📚 Documentation Hub
We maintain separate guides for specific workflows:

1.  🛠️  **[Development Guide](./DEVELOPMENT.md)**: Local environment setup, coding patterns, and testing
2.  🚀  **[Hosting & Deployment](./HOSTING.md)**: Production infrastructure and deployment pipelines
3.  📊  **[Analytics & Metrics](./ANALYTICS.md)**: Tracking configuration and data privacy

## Key features

**i18n**
- Bilingual content: `page.en.md` / `page.fr.md` side-by-side
- UI strings in `i18n/en.yaml` and `i18n/fr.yaml` (45+ keys with pluralization)
- Localized dates via `date_format_long` i18n key
- Language-neutral data file paths (layouts prepend `/en/` or `/fr/` via `relLangURL`)
- Language switcher preserves current page when translation exists

**Documentation**
- Multi-level sidebar driven by `data/{en,fr}/docs_nav.yaml` — paths are language-neutral
- Table of contents, breadcrumbs, Edit-on-GitHub, prev/next, mobile `<select>` dropdown

**Blog**
- Featured post via `featured: true` front matter (one per language)
- Reading progress bar, social share (X, LinkedIn, copy-link), related posts, tags, RSS

**UX / Accessibility**
- Dark mode with no-flash-on-load
- Copy-to-clipboard on every `<pre>`
- ⌘K search via Pagefind
- Skip-to-content link, arrow-key sidebar nav, anchor hover

**SEO / Performance**
- hreflang, Open Graph, JSON-LD (SoftwareApplication, TechArticle, BreadcrumbList)
- Favicon + apple-touch-icon from `/logo.svg`
- Language-scoped PWA manifest
- Fingerprinted + minified CSS with SRI

**Shortcodes**

```markdown
{{< callout type="warning" title="Breaking change" >}}
This option was removed in v2.
{{< /callout >}}

{{< code file="config/deploy.yml" lang="yaml" >}}
service: my-app
{{< /code >}}

{{< details title="Why not Kubernetes?" >}}
Kubernetes is overkill for most teams.
{{< /details >}}

{{< cards cols="3" >}}
{{< card title="Installation" icon="download" href="/docs/installation/" >}}
Get up and running in minutes.
{{< /card >}}
{{< /cards >}}

{{< filetree/container >}}
  {{< filetree/folder name="config" >}}
    {{< filetree/file name="deploy.yml" annotation="// edit this" >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}
```
## Contributions

[Contributions](.github/CONTRIBUTING.md) are welcome! We recognize [all types](https://allcontributors.org/docs/en/emoji-key) based on the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Please note that this project is released with a [Contributor Code of Conduct](.github/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Related
 * [dnsConfiguration](https://github.com/bhdicaire/dnsConfiguration) – Automated DNS configuration with StackOverflow's DNSControl and Git

## Licence
**vanityURLs** is Copyright 2023 Benoît H. Dicaire and [licensed under the MIT licence](https://github.com/vanityURLs/vanityURLs/blob/main/LICENSE).
