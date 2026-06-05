---
title: "Grid"
heading: "Layout grids, page width, and responsive structure"
type: brand
weight: 30
---

Use a centered content column for documentation and reference pages. Keep long-form reading surfaces narrow enough to scan comfortably.

The standard documentation layout uses a left navigation, a main reading column, and an optional table of contents. Brand pages should reuse that layout unless the page is a special-purpose asset preview.

The grid approach is based on the [Red Hat grid foundation](https://ux.redhat.com/foundations/grid/): a predictable structure with responsive columns, margins, gutters, and constrained line length. vanityURLs keeps the same discipline but adapts it to a compact documentation site and generated redirect pages.

## Page structure

| Surface                  | Structure                                           | Guidance                                                                            |
| ------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Brand documentation      | Sidebar, reading column, optional table of contents | Keep prose readable and avoid full-width paragraphs.                                |
| Reference tables         | Reading column with horizontal resilience           | Prefer tables for dense comparisons, but make cell copy concise.                    |
| Asset previews           | Constrained preview area plus supporting details    | Let the asset be inspectable without wrapping it in decorative page chrome.         |
| Generated redirect pages | Single focused column                               | Show destination, state, and next action without competing sidebars.                |
| Operator tools           | Dense, organized grid                               | Favor easy scanning, stable controls, and repeated rows over marketing composition. |

## Responsive behavior

- Single-column layouts are the default on mobile.
- Two-column grids work for related panels and comparison content.
- Three-column grids work for high-level navigation and short summaries.
- Avoid nested cards and decorative containers around whole page sections.
- Keep page sections unframed. Use cards for repeated items, asset downloads, and compact summaries.
- Use two columns on mobile only for very small, equal items such as swatches or icon samples.
- Let the table of contents drop away before the reading column becomes cramped.

## Line length

Long-form body text should stay narrow enough to read comfortably. On desktop, keep prose near the main reading column instead of spanning the full 12-column page width. If content needs more horizontal space, make the content type earn it: tables, diagrams, image previews, and code blocks can break out more than paragraphs.

## Stable dimensions

Define stable dimensions for repeated UI elements such as cards, swatches, icon buttons, counters, and preview tiles so content changes do not shift the layout.

## Grid decisions

- Align related content to the same left edge across a page.
- Keep gutters consistent within a section.
- Use explicit minimum and maximum constraints or fixed aspect ratios for repeated preview tiles.
- Avoid centering every small block. Left alignment makes technical documentation easier to scan.
- When a page mixes prose and dense UI, let prose introduce the decision and let the grid carry the comparison.
