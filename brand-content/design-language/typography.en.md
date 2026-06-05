---
title: "Fonts and typography"
heading: "Typefaces, hierarchy, and rhythm"
type: brand
weight: 20
aliases:
  - /design-language/fonts-and-typography/
---

The website self-hosts [Inter Variable](https://rsms.me/inter/) for interface and prose text, plus [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for code. Font files live under `static/fonts/` and are declared in `assets/css/main.css`.

The typographic model takes inspiration from the [Red Hat font-family foundation](https://ux.redhat.com/foundations/typography/font-family/): use one family for expressive and readable text, and one monospaced family for code and technical identifiers. vanityURLs uses Inter instead of Red Hat Display/Text, but keeps the same separation between human-readable prose and technical material.

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
- Do not scale type by viewport width. Use the defined fluid steps and responsive layout instead.
- Keep letter spacing at normal tracking unless an existing logo asset requires otherwise.
- Prefer sentence case for documentation headings unless a formal product or page title already uses title case.

## Typeface roles

| Typeface       | Role                                                         | Guidance                                                                                                                                    |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Inter Variable | Interface, documentation, navigation, buttons, tables, prose | Use for almost everything a visitor reads.                                                                                                  |
| JetBrains Mono | Code, commands, file paths, tokens, short technical values   | Use when the string is meant to be copied, compared, or read as syntax.                                                                     |
| Logo artwork   | Product and instance marks                                   | Use exported logo assets rather than re-creating marks with live text unless the generated public page explicitly supports split wordmarks. |

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

## Technical text

vanityURLs pages often mix prose with URLs, domains, file paths, JSON keys, and commands. Make those strings inspectable.

- Keep domains and URLs in code style when they are examples or values.
- Use natural-language link text when the URL is not the object being explained.
- Avoid tiny technical text in cards and tables; dense does not mean miniature.
- Let long URLs wrap safely instead of overflowing their containers.
