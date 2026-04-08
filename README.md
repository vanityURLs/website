# ![Logo](.github/header.png "Logo")

![GitHub Stars](https://img.shields.io/github/stars/vanityURLs/website?style=flat-square&logoColor=186ADE&labelColor=3E5462&color=C25100)
![GitHub forks](https://img.shields.io/github/forks/vanityURLs/website?style=flat-square&logoColor=186ADE&labelColor=3E5462&color=C25100)
![GitHub Last Commit](https://img.shields.io/github/last-commit/vanityURLs/website?style=flat-square&logoColor=186ADE&labelColor=3E5462&color=C25100)
![GitHub licence](https://img.shields.io/github/license/vanityURLs/website?style=flat-square&logoColor=186ADE&labelColor=3E5462&color=C25100)

## Key features

### Documentation
- **3-level sidebar** — Section → Page → Child pages, chevron expand/collapse
- **Table of contents** — right panel on XL screens, scroll-aware active link
- **Breadcrumbs** — section path above each page
- **Edit on GitHub** link + last-modified date on every page
- **Prev/Next navigation** driven by `nav_order` front matter
- **Mobile dropdown** — full 3-level nav in a `<select>` on small screens

### Blog
- **Featured post** — full-width hero card (from `featured: true` front matter)
- **Reading progress bar** — thin stripe at top of viewport
- **Social share** — X/Twitter, LinkedIn, copy-link
- **Related posts** — Hugo `.Related` API, 3 cards below each post
- **Tag taxonomy** — filterable at `/tags/{name}/`
- **RSS feed** per language

### Showcase
- **Client-side JS filter** — filter by tag without page reload
- **Count badges** on filter buttons
- **Stats grid** — key metrics in company profile pages
- **Submit CTA** — links to GitHub Discussions

### UX / Accessibility
- **Dark mode** — system preference + localStorage toggle, no flash on load
- **Copy-to-clipboard** — on every `<pre>` code block
- **⌘K search** — Pagefind modal, bilingual, keyboard shortcut
- **Skip to content** — visible on Tab focus
- **Sidebar keyboard nav** — Arrow keys, Enter/Space
- **Anchor links** — `#` link revealed on heading hover

### SEO / Performance
- **hreflang** alternate links for every page
- **Open Graph** meta tags (`og:type`, `og:title`, `og:description`, `og:url`, `twitter:card`)
- **JSON-LD** structured data (`SoftwareApplication` on home, `TechArticle` on docs)
- **Web manifest** with dual theme-color for light/dark
- **Fingerprinted + minified CSS** with SRI integrity hash
- **Print styles** — clean printable docs

### Shortcodes

```markdown
{{< callout type="warning" title="Breaking change" >}}
This option was removed in v2.
{{< /callout >}}

{{< code file="config/deploy.yml" lang="yaml" >}}
service: my-app
image: my-org/my-app
{{< /code >}}

{{< tabs >}}
{{< tab label="gem" >}}
gem install kamal
{{< /tab >}}
{{< tab label="docker" >}}
docker run ghcr.io/basecamp/kamal:latest
{{< /tab >}}
{{< /tabs >}}

{{< kbd >}}⌘K{{< /kbd >}} — open search

{{< version added="2.1" >}}
```


## Adding content

### New blog post

```bash
hugo new content en/blog/my-post.md
```

Front matter:

```yaml
title: "My Post Title"
date: 2025-01-15
author: "Author Name"
description: "One-sentence description for cards and meta."
tags: ["guide", "rails"]
featured: false          # set true for ONE post to be the hero
```

### New showcase entry

```bash
hugo new content en/showcase/my-company.md
```

Front matter:

```yaml
title: "My Company"
description: "What they do and why they use Kamal."
site_url: "https://example.com"
color: "#0369a1"          # avatar background color
logo_char: "M"            # initial shown in avatar
tags: ["saas", "rails"]
featured: false
stats:
  - label: "Users"
    value: "50K+"
  - label: "Deploy time"
    value: "90 sec"
```

### New docs page

Create the Markdown file, add `nav_order` front matter, and register it in `data/en/docs_nav.yaml`:

```yaml
- title: My New Page
  url: /docs/my-section/my-page/
  children:               # optional
    - title: Sub-topic
      url: /docs/my-section/my-page/sub-topic/
```


## Updating the version badge

```yaml
# hugo.yaml
params:
  version: "2.11.0"
  versionURL: "https://github.com/basecamp/kamal/releases/tag/v2.11.0"
```


## Deployment

[Hugo Documentation](https://gohugo.io/host-and-deploy/host-on-cloudflare/)


## Local dev notes

- Search (`⌘K`) requires a Pagefind index. Run `npm run build` once, then use `npm run dev` for live reload.
- `enableGitInfo: true` requires a git repository. The first `git init && git add . && git commit -m "init"` will enable last-modified dates.
- Google Fonts load from CDN; add `--offline` to hugo flags or replace with local fonts for fully offline dev.


## Additional shortcodes (added later)

### `{{< steps >}}`
Numbered visual steps with a connecting line. Use `{{% steps %}}` (with `%`) so inner markdown is processed.
```markdown
{{% steps %}}
### Step title
Content, code blocks, callouts…
{{% /steps %}}
```
> **Note:** Do not nest `{{< filetree >}}` inside `{{% steps %}}`. Keep them adjacent, not nested.

### `{{< filetree >}}`
Visual file tree with icons, tree lines, and annotations.
```markdown
{{< filetree/container >}}
  {{< filetree/folder name="config" >}}
    {{< filetree/file name="deploy.yml" annotation="// edit this" >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name=".kamal" open="false" >}}
    {{< filetree/file name="secrets" annotation="// gitignored" >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}
```
File icon colours: `.yml/.yaml` → orange, `.rb` → red, `.go` → cyan, `.js/.ts` → yellow, `.md` → blue, `.sh` → green, `.toml/.json` → purple, `.env` → emerald, `Dockerfile` → sky.

### `{{< cards >}}` + `{{< card >}}`
Responsive card grid for feature lists and navigation.
```markdown
{{< cards cols="3" >}}
{{< card title="Installation" icon="download" href="/docs/installation/" >}}
Get up and running in minutes.
{{< /card >}}
{{< /cards >}}
```
Supported icons: `book`, `docs`, `download`, `install`, `cog`, `settings`, `server`, `database`, `terminal`, `command`, `lock`, `security`, `rocket`, `deploy`, `check`, `globe`, `bolt`, `code`, `github`, `warning`, `info`, `hook`, `accessory`, `proxy`, `builder`

### `{{< details >}}`
Collapsible accordion section.
```markdown
{{< details title="Why not Kubernetes?" >}}
Kubernetes is powerful but overkill for most teams...
{{< /details >}}

{{< details title="Open by default" open="true" >}}
This one starts expanded.
{{< /details >}}
```

### `{{< mermaid >}}`
Mermaid diagrams — flowcharts, sequence diagrams, Gantt charts. Dark-mode aware.
```markdown
{{< mermaid >}}
graph LR
  A[kamal deploy] --> B[Build] --> C[Push] --> D[Deploy]
{{< /mermaid >}}
```
Requires internet (loads `mermaid.min.js` from jsDelivr CDN).

## 🌲 Project tree

```text
.
├── hugo.yaml                    # Site config, menus, taxonomies, params
├── tailwind.config.js           # dark mode, kamal-* palette, prose overrides
├── postcss.config.js            # Tailwind + Autoprefixer
│
├── assets/css/main.css          # All component classes + dark mode + print
│
├── i18n/
│   ├── en.yaml                  # All UI strings (English)
│   └── fr.yaml                  # All UI strings (French)
│
├── data/
│   ├── en/docs_nav.yaml         # English 3-level sidebar nav
│   └── fr/docs_nav.yaml         # French 3-level sidebar nav
│
├── layouts/
│   ├── index.html               # Homepage
│   ├── 404.html                 # 404 with search
│   ├── _default/
│   │   ├── baseof.html          # Shell: skip-link, header, dark-mode init, all JS
│   │   ├── single.html          # Generic page
│   │   ├── taxonomy.html        # Tag/category index
│   │   └── rss.xml              # RSS feed template
│   ├── blog/
│   │   ├── list.html            # Blog index: featured hero + paginated grid
│   │   └── single.html          # Post: cover, meta, progress bar, social share, related
│   ├── docs/
│   │   ├── list.html            # /docs/ redirect
│   │   └── single.html          # 3-level sidebar + TOC + breadcrumb + edit link
│   ├── showcase/
│   │   ├── list.html            # JS-filtered card grid
│   │   └── single.html          # Company profile
│   ├── tags/
│   │   ├── list.html            # Posts for a tag
│   │   └── taxonomy.html        # All tags
│   ├── v1/
│   │   └── list.html            # v1 docs (with upgrade banner)
│   └── partials/
│       ├── head.html            # Meta, OG, hreflang, CSS, JSON-LD, manifest
│       ├── header.html          # Sticky nav: logo, search, dark toggle, lang switcher
│       ├── footer.html          # 37signals brands
│       ├── search.html          # Pagefind search modal (⌘K)
│       ├── lang-switcher.html   # EN/FR toggle pill
│       ├── version-banner.html  # Amber banner on /v1/ pages
│       └── jsonld.html          # Schema.org structured data
│
├── layouts/shortcodes/
│   ├── callout.html             # {{< callout type="warning" >}}...{{< /callout >}}
│   ├── code.html                # {{< code file="deploy.yml" lang="yaml" >}}...{{< /code >}}
│   ├── tabs.html + tab.html     # {{< tabs >}}{{< tab label="Ruby" >}}...{{< /tabs >}}
│   ├── kbd.html                 # {{< kbd >}}⌘K{{< /kbd >}}
│   └── version.html             # {{< version added="2.1" >}}
│
├── content/
│   ├── en/                      # English content
│   │   ├── _index.md            # Homepage front matter
│   │   ├── 404.md
│   │   ├── blog/                # 6 blog posts
│   │   ├── showcase/            # 10 company profiles
│   │   ├── docs/                # 57 documentation pages
│   │   └── v1/                  # v1 legacy docs
│   └── fr/                      # French translations (mirrors en/ structure)
│
├── static/
│   ├── _headers                 # Cloudflare Pages security headers
│   ├── _redirects               # /docs/ → /docs/installation/
│   └── site.webmanifest         # Web app manifest
│
└── .github/workflows/
   └── release-please.yml               # GitHub Actions → Release--Please
```

## Suggestions and improvements are welcome

Pull requests are welcome :grin:

For major changes, please open an issue first to discuss what you would like to change. Refer to the [contribution guidelines](.github/CONTRIBUTING.md) and adhere to this [project's code of conduct](./.github/CODE_OF_CONDUCT.md).

## License

Copyright (c) 2026 Benoît H. Dicaire and licensed under the [MIT license](https://choosealicense.com/licenses/mit/). See [LICENSE.md](.github/LICENSE.md) for more information.
