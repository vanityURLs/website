---
aside: false
title: "Content authoring"
description: "Write website docs, translations, shortcodes, and UI strings for vanityURLs.link."
weight: 20
---

Use this page when you add or update website content in `content/`, `i18n/`, `data/`, or Hugo layouts.

## Repository areas

| Path | Purpose |
| ---- | ------- |
| `content/` | Markdown pages, blog posts, legal pages, showcase entries, and docs |
| `layouts/` | Hugo templates, partials, and shortcodes |
| `assets/` | Processed CSS and JavaScript that Hugo fingerprints |
| `static/` | Files copied as-is with stable public URLs |
| `data/` | Structured page data such as home, FAQ, glossary, trust, and audits |
| `i18n/` | UI strings used by templates and shortcodes |

## Content files

Use language-specific filenames:

```text
content/docs/web-site/content-authoring.en.md
content/docs/web-site/content-authoring.fr.md
```

Hugo pairs translations when the base filename and directory match. A language switcher may fall back to the language root when a sibling translation is missing.

## Add a documentation page

Create a page in the matching section:

```bash
hugo new docs/web-site/example.en.md
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
{{< callout type="warning" title="Breaking change" >}}
This option was removed in v3.
{{< /callout >}}

{{< details title="Why this matters" >}}
Longer explanation that should stay available without taking over the page.
{{< /details >}}

{{< cards cols="3" >}}
{{< card title="Setup" icon="download" href="/docs/setup/" >}}
Start here.
{{< /card >}}
{{< /cards >}}
```

Use callouts for operational warnings, safety limits, first-time setup notes, and versioned behavior changes. Keep ordinary explanatory paragraphs as prose.

## Assets

Use `assets/` when Hugo should process, fingerprint, or bundle a file. Use `static/` for files that need a stable URL.

| Put it here | When |
| ----------- | ---- |
| `assets/` | CSS, JavaScript, or media referenced by templates through Hugo resources |
| `static/` | `favicon.ico`, `social.png`, `humans.txt`, `_headers`, `_redirects`, or public files that must keep a fixed path |

## Before publishing

Run:

```bash
npm run build
npm run lint
```

Use `npm run lint:all` when the change affects many links, navigation, or generated HTML.
