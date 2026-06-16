---
aside: false
type: brand
title: "Content authoring"
description: "Write website docs, translations, shortcodes, and UI strings for vanityURLs.link."
weight: 20
aliases:
  - /docs/web-site/content-authoring/
---

Use this page when you add or update website content in `content/`, `i18n/`, `data/`, or Hugo `layouts/`.

## Repository areas

| Path       | Purpose                                                             |
| ---------- | ------------------------------------------------------------------- |
| `content/` | Pages, blog posts, showcase entries, and documentation              |
| `layouts/` | Hugo templates, partials, and shortcodes                            |
| `assets/`  | Processed CSS and JavaScript that Hugo fingerprints                 |
| `static/`  | Files copied as-is with stable public URLs                          |
| `data/`    | Structured page data such as home, FAQ, glossary, trust, and audits |
| `i18n/`    | UI strings used by templates and shortcodes                         |

## Content files

Use language-specific filenames:

```text
brand-content/web-site/content-authoring.en.md
brand-content/web-site/content-authoring.fr.md
```

Hugo pairs translations when the base filename and directory match. A language switcher may fall back to the language root when a sibling translation is missing.

## Add a documentation page

Create a page in the matching section:

```bash
hugo new web-site/example.en.md --config hugo.brand.yml
```

Then set front matter:

```yaml
---
aside: false
title: "Example"
description: "Short description for SEO and social cards."
weight: 30
---
```

Documentation navigation is section-driven. The section `_index` controls where the section appears, and each page `weight` controls the page order inside that section.

## Add a blog post

```bash
hugo new blog/my-new-post.en.md
```

Use front matter like:

```yaml
---
title: "My new post"
description: "Short description for search and social cards."
date: 2026-06-03
tags: [hugo, cloudflare]
draft: true
---
```

Create the French translation as `content/blog/my-new-post.fr.md` when the translated content is ready.

Blog posts are sorted by their original `date`. Keep that date stable after publication. Use `lastmod` only when a visible "last modified" signal is useful; the single-post layout keeps the publication date near the title and shows `lastmod` in the footer.

The blog index groups posts into editorial categories derived from existing tags unless a post provides an explicit `category`. Prefer one of these category IDs when you need to override the derived category:

```yaml
category: customization
```

Current categories are `getting-started`, `releases`, `comparisons`, `operations`, `customization`, `security`, `cloudflare`, and `architecture`. Tags can stay more specific; categories should stay broad enough for the archive page. Releases and comparisons are matched before broader operational or Cloudflare tags, so a post can still carry practical secondary tags without losing its archive bucket.

Authors should use a stable display name. Add recurring authors to `data/authors.yml` so templates and structured data can include profile URLs when available.

## Add UI text

Add template labels to both i18n files:

```yaml
# i18n/en.yml
my_new_string: "Continue"
```

```yaml
# i18n/fr.yml
my_new_string: "Continuer"
```

Use it in a template with:

```go-html-template
{{ i18n "my_new_string" }}
```

{{< callout type="warning" title="Do not hardcode reusable UI labels" >}}
Buttons, badges, navigation labels, shortcode labels, and repeated template text should go through `i18n/` so English and French pages stay aligned.
{{< /callout >}}

## Use shortcodes

Common documentation shortcodes include:

```markdown
{{</* callout type="warning" title="Breaking change" */>}}
This option was removed in v3.
{{</* /callout */>}}

{{</* details title="Why this matters" */>}}
Longer explanation that should stay available without taking over the page.
{{</* /details */>}}

{{</* cards cols="3" */>}}
{{</* card title="Setup" icon="download" href="/docs/setup/" */>}}
Start here.
{{</* /card */>}}
{{</* /cards */>}}
```

Use callouts for operational warnings, safety limits, first-time setup notes, and versioned behavior changes. Keep ordinary explanatory paragraphs as prose.

Blog posts can use the same callout shortcode, but use it more sparingly than in reference documentation. Good blog callouts highlight practical cautions, reader decisions, or "do this before you copy the pattern" notes. Avoid callouts for ordinary emphasis; blog posts should still read like essays.

The source directory remains named `content/` because it is Hugo's conventional content root and is already mirrored by the brand site's `brand-content/`. Do not rename it to `website-content/` unless the whole build, links, contributor docs, and Cloudflare deployment flow are migrated together.

## Page images

Keep images beside the page or blog post they support when possible. This keeps the Markdown and its media together when the content moves, and makes it easier to review page-specific assets.

For a blog post with local images, create a page bundle by moving the Markdown file into a directory and renaming it `_index.md`:

```text
content/blog/my-new-post/
├── _index.en.md
├── _index.fr.md
└── hero.png
```

Then reference the image with a relative Markdown path:

```markdown
![Alt text](hero.png)
```

Use `static/` when an image needs a stable public URL, is shared across many pages, or must be referenced outside the content bundle:

```text
static/images/docs/cloudflare-dashboard.png
```

Reference static images from the site root:

```markdown
![Alt text](/images/docs/cloudflare-dashboard.png)
```

## Assets

Use `assets/` when Hugo should process, fingerprint, or bundle a file. Use `static/` for files that need a stable URL.

{{< mermaid >}}
flowchart LR
A[New file<br/>or old URL]
B{Should Hugo process<br/>or fingerprint it?}
C[Use assets]
D{Needs a stable<br/>public path?}
E[Use static]
F{Moved<br/>content<br/>page?}
G[Use front<br/>matter aliases]
H[Keep beside<br/>the page bundle]

A --> B
B -->|Yes| C
B -->|No| D
D -->|Yes| E
D -->|No| F
F -->|Yes| G
F -->|No| H
{{< /mermaid >}}

| Put it here | When                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `assets/`   | CSS, JavaScript, or media referenced by templates through Hugo resources                                         |
| `static/`   | `favicon.ico`, `social.png`, `humans.txt`, `_headers`, `_redirects`, or public files that must keep a fixed path |

Use `static/_redirects` for redirect rules that belong in a fixed static file. It is not the only redirect mechanism: content pages can also define `aliases` in front matter when an old URL should redirect to a moved page.

## Before publishing

Run:

```bash
npm run build
npm run lint
```

Use `npm run lint:all` when the change affects many links, navigation, or generated HTML.

When the content change is ready to commit, use the [Commit style](/web-site/local-development/#commit-style) guidance so release-please can classify the work correctly.
