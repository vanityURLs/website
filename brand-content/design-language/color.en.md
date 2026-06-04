---
title: "Color"
heading: "Core color tokens and usage rules for vanityURLs surfaces"
type: brand
weight: 10
---

- Use teal as an accent, not as the whole interface.
- Keep status colors semantic and distinct from brand teal.
- Preserve badge contrast on light and dark surfaces.
- Pair brand accents with neutral gray, white, and dark ink surfaces so pages do not become one-note teal compositions.
- Test color combinations against WCAG contrast requirements before publishing.

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
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-ink"></span><code>#111827</code></span></td>
      <td>Primary text, light-surface badges, high-emphasis UI</td>
    </tr>
    <tr>
      <td>Paper</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-paper"></span><code>#FFFFFF</code></span></td>
      <td>Primary page background and dark-surface badge text</td>
    </tr>
    <tr>
      <td>vanityURLs teal</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-700"></span><code>#0F766E</code></span></td>
      <td>Brand emphasis, links, selected states, primary accents</td>
    </tr>
    <tr>
      <td>Swoop teal</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-500"></span><code>#14B8A6</code></span></td>
      <td>Secondary accent and motion or illustration detail</td>
    </tr>
    <tr>
      <td>Muted text</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-muted"></span><code>#6B7280</code></span></td>
      <td>Secondary descriptions and helper copy</td>
    </tr>
    <tr>
      <td>Line</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-line"></span><code>#E5E7EB</code></span></td>
      <td>Borders and separators</td>
    </tr>
    <tr>
      <td>Dark surface</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-ink"></span><code>#111827</code></span></td>
      <td>Dark documentation surfaces, code-adjacent panels, badge stages</td>
    </tr>
  </tbody>
</table>

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
    <tr><td>brand-50</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-50"></span><code>#f0fdfa</code></span></td></tr>
    <tr><td>brand-100</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-100"></span><code>#ccfbf1</code></span></td></tr>
    <tr><td>brand-200</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-200"></span><code>#99f6e4</code></span></td></tr>
    <tr><td>brand-300</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-300"></span><code>#5eead4</code></span></td></tr>
    <tr><td>brand-400</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-400"></span><code>#2dd4bf</code></span></td></tr>
    <tr><td>brand-500</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-500"></span><code>#14b8a6</code></span></td></tr>
    <tr><td>brand-600</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-600"></span><code>#0d9488</code></span></td></tr>
    <tr><td>brand-700</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-700"></span><code>#0f766e</code></span></td></tr>
    <tr><td>brand-800</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-800"></span><code>#115e59</code></span></td></tr>
    <tr><td>brand-900</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-900"></span><code>#134e4a</code></span></td></tr>
  </tbody>
</table>
