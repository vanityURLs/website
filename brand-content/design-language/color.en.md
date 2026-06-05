---
title: "Color"
heading: "Core color tokens and usage rules for surfaces"
type: brand
weight: 10
---

- Use teal as an accent, not as the whole interface.
- Keep status colors semantic and distinct from brand teal.
- Preserve badge contrast on light and dark surfaces.
- Pair brand accents with neutral gray, white, and dark ink surfaces so pages do not become one-note teal compositions.
- Test color combinations against WCAG contrast requirements before publishing.

The vanityURLs palette follows the same intent as the [Red Hat color foundation](https://ux.redhat.com/foundations/color/): color is a practical system for brand expression, hierarchy, state, and accessibility. Treat the palette as a set of named decisions, not a drawer of interchangeable decoration.

## Usage principles

- Use semantic names in implementation when a color describes purpose: text, surface, border, link, selected, success, warning, danger, and disabled.
- Use hard-coded palette values only at the token layer or in one-off asset production notes.
- Keep pure black out of large UI surfaces. Use the ink token for dark text and dark panels so contrast stays strong without harsh visual vibration.
- Reserve the brighter teal steps for accents, illustrations, focus rings, hover details, and active states.
- Do not use brand teal for error, danger, or abuse states. Those states need their own semantic colors.
- Check light and dark theme combinations before publishing, especially badges, link text, focus rings, and charts.

## Core palette

<table class="brand-color-table">
  <colgroup>
    <col class="brand-color-table-token">
    <col class="brand-color-table-value">
    <col class="brand-color-table-use">
  </colgroup>
  <thead>
    <tr>
      <th>Token</th>
      <th>Value</th>
      <th>Use</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ink</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-ink"></span>#111827</span></td>
      <td>Primary text, light-surface badges, high-emphasis UI</td>
    </tr>
    <tr>
      <td>Paper</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-paper"></span>#FFFFFF</span></td>
      <td>Primary page background and dark-surface badge text</td>
    </tr>
    <tr>
      <td>vanityURLs teal</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-700"></span>#0F766E</span></td>
      <td>Brand emphasis, links, selected states, primary accents</td>
    </tr>
    <tr>
      <td>Swoop teal</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-500"></span>#14B8A6</span></td>
      <td>Secondary accent and motion or illustration detail</td>
    </tr>
    <tr>
      <td>Muted text</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-muted"></span>#6B7280</span></td>
      <td>Secondary descriptions and helper copy</td>
    </tr>
    <tr>
      <td>Line</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-line"></span>#E5E7EB</span></td>
      <td>Borders and separators</td>
    </tr>
    <tr>
      <td>Dark surface</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-ink"></span>#111827</span></td>
      <td>Dark documentation surfaces, code-adjacent panels, badge stages</td>
    </tr>
  </tbody>
</table>

## Semantic mapping

| Role           | Preferred token                                | Guidance                                                                                        |
| -------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Page canvas    | Paper                                          | Use for normal reading surfaces and generated public pages.                                     |
| Primary text   | Ink                                            | Use for headings, body copy, labels, and high-emphasis values.                                  |
| Secondary text | Muted text                                     | Use for helper copy, metadata, and table descriptions.                                          |
| Borders        | Line                                           | Use for separators, table borders, card edges, and subdued rules.                               |
| Links          | vanityURLs teal                                | Use for inline links and selected navigation. Preserve underline or another visible affordance. |
| Focus          | vanityURLs teal or high-contrast semantic ring | Make focus visible against the surrounding surface.                                             |
| Dark surfaces  | Dark surface plus Paper text                   | Use sparingly for code-adjacent panels, badge previews, and high-contrast brand moments.        |

## Status colors

Status colors should communicate meaning before brand. A blocked link, expired redirect, abuse warning, maintenance state, or security notice must remain understandable if the visitor ignores color entirely.

- Pair every status color with text, iconography, or a clear label.
- Keep success, warning, danger, and informational states visually distinct from brand teal.
- Use muted borders or backgrounds for low-severity notices; use stronger treatment only when the state changes what the visitor should do next.
- Test status colors in both themes and against adjacent links.

## Tailwind scale

The website extends Tailwind with a teal `brand` scale. Use these values when designing new surfaces so accents match the site implementation.

<table class="brand-color-table">
  <colgroup>
    <col class="brand-color-table-token">
    <col class="brand-color-table-value-wide">
  </colgroup>
  <thead>
    <tr>
      <th>Token</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>brand-50</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-50"></span>#f0fdfa</span></td></tr>
    <tr><td>brand-100</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-100"></span>#ccfbf1</span></td></tr>
    <tr><td>brand-200</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-200"></span>#99f6e4</span></td></tr>
    <tr><td>brand-300</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-300"></span>#5eead4</span></td></tr>
    <tr><td>brand-400</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-400"></span>#2dd4bf</span></td></tr>
    <tr><td>brand-500</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-500"></span>#14b8a6</span></td></tr>
    <tr><td>brand-600</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-600"></span>#0d9488</span></td></tr>
    <tr><td>brand-700</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-700"></span>#0f766e</span></td></tr>
    <tr><td>brand-800</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-800"></span>#115e59</span></td></tr>
    <tr><td>brand-900</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-900"></span>#134e4a</span></td></tr>
  </tbody>
</table>
