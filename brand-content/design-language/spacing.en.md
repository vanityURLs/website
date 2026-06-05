---
title: "Spacing"
heading: "Spacing scale and density guidance"
type: brand
weight: 40
---

Spacing should make the interface easy to scan. Use tighter spacing for operational tools and more generous spacing for page openings, brand summaries, and asset previews.

The website uses fluid documentation spacing tokens in `assets/css/main.css`, from `--docs-space-2xs` through `--docs-space-l`. Use those token relationships when adding new documentation components.

The spacing model follows the [Red Hat spacing foundation](https://ux.redhat.com/foundations/spacing/): a small, named scale keeps rhythm consistent across components, patterns, and layouts. vanityURLs maps that idea to documentation prose, compact product UI, generated pages, and asset previews.

## Scale

| Token              | Use                                                                     |
| ------------------ | ----------------------------------------------------------------------- |
| `--docs-space-2xs` | Tight list rhythm, compact metadata, small gaps inside dense UI.        |
| `--docs-space-xs`  | Supporting text gaps, label-to-control spacing, compact card internals. |
| `--docs-space-s`   | Normal paragraph rhythm and small content groups.                       |
| `--docs-space-m`   | Section internals, grouped cards, tables, and callouts.                 |
| `--docs-space-l`   | Major section separation and page-opening rhythm.                       |

## Rules

- Keep related controls close together.
- Separate unrelated groups with larger vertical spacing.
- Do not use blank space as decoration when structure would be clearer.
- Preserve enough padding around badges and logos so they are not crowded by surrounding text.
- Let text flow define vertical rhythm. Avoid forcing large gaps between paragraphs just to create a brand moment.

## Density

Documentation can breathe more than operational tools. Redirect and admin surfaces should be denser because users are often verifying a URL, reading a state, or changing configuration.

- Use generous section spacing around brand explanations, logo previews, and downloadable assets.
- Use tighter row spacing for tables, audit trails, policy lists, and command examples.
- Keep form controls close to their labels and helper text.
- Avoid large vertical gaps between a warning and the action it explains.

## Layout spacing

Use grid gutters for layout structure and spacing tokens for relationships inside a component. When spacing feels wrong, first decide whether the problem is hierarchy, grouping, or line length. More blank space is not always the fix.
