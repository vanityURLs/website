---
title: "Fonts and typography"
heading: "Typefaces, hierarchy, and rhythm"
type: brand
weight: 20
aliases:
  - /design-language/fonts-and-typography/
---

The website self-hosts [Inter Variable](https://rsms.me/inter/) for interface and prose text, plus [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for code. Font files live under `static/fonts/` and are declared in `assets/css/main.css`.

## Hierarchy

- Use large display text only for page openings and major brand moments.
- Use smaller, tighter headings inside cards, panels, tables, and tool surfaces.
- Keep body copy direct and readable.
- Use [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for code, file paths, commands, tokens, and generated examples.

## Rhythm

Use consistent spacing between headings, descriptions, cards, and tables. Favor clear grouping over decorative density.

The documentation CSS defines fluid prose steps and line-height tokens:

| Token               | Purpose                                |
| ------------------- | -------------------------------------- |
| `--docs-step--1`    | Small supporting text                  |
| `--docs-step-0`     | Body copy                              |
| `--docs-step-1`     | Compact section headings and lead text |
| `--docs-line-body`  | Long-form reading rhythm               |
| `--docs-line-tight` | Headings and dense UI labels           |

Use a generous line height for explanatory prose and tighter line height for navigation, cards, badges, and controls.
