---
title: Organize Files
weight: 3
prev: /docs/guide
---

## Directory Structure


{{< filetree/container >}}
  {{< filetree/folder name="vanityURLS" >}}
    {{< filetree/file name="_index.md" >}}
    {{< filetree/file name=".gitignore" >}}
    {{< filetree/file name="LICENSE" >}}
    {{< filetree/file name="Makefile" >}}
    {{< filetree/file name="README.md" >}}
    {{< filetree/file name="vanityURLS.conf" >}}

    {{< filetree/folder name="build" state="open" >}}
      {{< filetree/file name="_headers" >}}
    {{< /filetree/folder >}}      
    {{< filetree/folder name="scripts" state="open" >}}
      {{< filetree/file name="lnk" >}}
      {{< filetree/file name="validateURL" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}



{{< callout emoji="ℹ️">}}
  It is recommended to keep the sidebar not too deep. If you have a lot of content, consider **splitting them into multiple sections**.
{{< /callout >}}

Each of the `_index.md` files is the index page for the corresponding section. The other Markdown files are regular pages.

```
content
├── _index.md // <- /
├── docs
│   ├── _index.md // <- /docs/
│   ├── getting-started.md // <- /docs/getting-started/
│   └── guide
│       ├── _index.md // <- /docs/guide/
│       └── organize-files.md // <- /docs/guide/organize-files/
└── blog
    ├── _index.md // <- /blog/
    └── post-1.md // <- /blog/post-1/
```

## Layouts

Hextra offers three layouts for different content types:

| Layout    | Directory             | Features                                                         |
| :-------- | :-------------------- | :--------------------------------------------------------------- |
| `docs`    | `content/docs/`       | Ideal for structured documentation, same as this section.        |
| `blog`    | `content/blog/`       | For blog postings, with both listing and detailed article views. |
| `default` | All other directories | Single-page article view without sidebar.                        |

To customize a section to mirror the behavior of a built-in layout, specify the desired type in the front matter of the section's `_index.md`.

```yaml {filename="content/my-docs/_index.md"}
---
title: My Docs
cascade:
  type: docs
---
```

The above example configuration ensures that the content files inside `content/my-docs/` will be treated as documentation (`docs` type) by default.

## Sidebar Navigation

The sidebar navigation is generated automatically based on the content organization alphabetically. To manually configure the sidebar order, we can use the `weight` parameter in the front matter of the Markdown files.

```yaml {filename="content/docs/guide/_index.md"}
---
title: Guide
weight: 2
---
```

