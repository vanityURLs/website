---
title: "Fonts and typography"
heading: "Typefaces, hierarchy, and rhythm"
type: brand
weight: 20
aliases:
  - /design-language/fonts-and-typography/
---

The website self-hosts [Inter Variable](https://rsms.me/inter/) for interface and prose text, plus [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for code. Font files live under `static/fonts/` and are declared in `assets/css/main.css`.

## Typeface samples

<div class="brand-type-samples not-prose">
  <section class="brand-type-sample">
    <h3>Inter Variable</h3>
    <p class="brand-type-specimen brand-type-inter">Aa vanityURLs</p>
    <p class="brand-type-line brand-type-inter">Interface text, documentation prose, navigation, buttons, tables, and product surfaces.</p>
  </section>
  <section class="brand-type-sample">
    <h3>JetBrains Mono</h3>
    <p class="brand-type-specimen brand-type-mono">Aa v8s.link</p>
    <p class="brand-type-line brand-type-mono">Code, file paths, commands, tokens, generated examples, and technical identifiers.</p>
  </section>
</div>

## Hierarchy

- Use large display text only for page openings and major brand moments.
- Use smaller, tighter headings inside cards, panels, tables, and tool surfaces.
- Keep body copy direct and readable.
- Use [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for code, file paths, commands, tokens, and generated examples.

## Rhythm

Use consistent spacing between headings, descriptions, cards, and tables. Favor clear grouping over decorative density.

The documentation CSS defines fluid prose steps, line-height tokens, and spacing tokens:

| Token               | Purpose                                | Metric                       |
| ------------------- | -------------------------------------- | ---------------------------- |
| `--docs-step--1`    | Small supporting text                  | `0.9375rem` to `1rem`        |
| `--docs-step-0`     | Body copy                              | `1rem` to `1.125rem`         |
| `--docs-step-1`     | Compact section headings and lead text | `1.125rem` to `1.25rem`      |
| `--docs-space-2xs`  | List-item rhythm                       | `0.5rem` to `0.625rem`       |
| `--docs-space-xs`   | Small heading support gap              | `0.75rem` to `0.875rem`      |
| `--docs-space-s`    | Paragraph and block spacing            | `1rem` to `1.125rem`         |
| `--docs-space-m`    | Medium section spacing                 | `1.5rem` to `1.75rem`        |
| `--docs-space-l`    | Major section spacing                  | `2rem` to `2.5rem`           |
| `--docs-line-body`  | Long-form reading rhythm               | `1.7` line-height multiplier |
| `--docs-line-tight` | Headings and dense UI labels           | `1.3` line-height multiplier |

Use a generous line height for explanatory prose and tighter line height for navigation, cards, badges, and controls.
