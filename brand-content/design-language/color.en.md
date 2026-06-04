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

| Token           | Value                                                                                   | Use                                                             |
| --------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Ink             | <span class="brand-color-token" style="--brand-color-token: #111827;"></span> `#111827` | Primary text, light-surface badges, high-emphasis UI            |
| Paper           | <span class="brand-color-token" style="--brand-color-token: #FFFFFF;"></span> `#FFFFFF` | Primary page background and dark-surface badge text             |
| vanityURLs teal | <span class="brand-color-token" style="--brand-color-token: #0F766E;"></span> `#0F766E` | Brand emphasis, links, selected states, primary accents         |
| Swoop teal      | <span class="brand-color-token" style="--brand-color-token: #14B8A6;"></span> `#14B8A6` | Secondary accent and motion or illustration detail              |
| Muted text      | <span class="brand-color-token" style="--brand-color-token: #6B7280;"></span> `#6B7280` | Secondary descriptions and helper copy                          |
| Line            | <span class="brand-color-token" style="--brand-color-token: #E5E7EB;"></span> `#E5E7EB` | Borders and separators                                          |
| Dark surface    | <span class="brand-color-token" style="--brand-color-token: #111827;"></span> `#111827` | Dark documentation surfaces, code-adjacent panels, badge stages |

## Tailwind scale

The website extends Tailwind with a teal `brand` scale. Use these values when designing new surfaces so accents match the site implementation.

| Token       | Value                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- |
| `brand-50`  | <span class="brand-color-token" style="--brand-color-token: #f0fdfa;"></span> `#f0fdfa` |
| `brand-100` | <span class="brand-color-token" style="--brand-color-token: #ccfbf1;"></span> `#ccfbf1` |
| `brand-200` | <span class="brand-color-token" style="--brand-color-token: #99f6e4;"></span> `#99f6e4` |
| `brand-300` | <span class="brand-color-token" style="--brand-color-token: #5eead4;"></span> `#5eead4` |
| `brand-400` | <span class="brand-color-token" style="--brand-color-token: #2dd4bf;"></span> `#2dd4bf` |
| `brand-500` | <span class="brand-color-token" style="--brand-color-token: #14b8a6;"></span> `#14b8a6` |
| `brand-600` | <span class="brand-color-token" style="--brand-color-token: #0d9488;"></span> `#0d9488` |
| `brand-700` | <span class="brand-color-token" style="--brand-color-token: #0f766e;"></span> `#0f766e` |
| `brand-800` | <span class="brand-color-token" style="--brand-color-token: #115e59;"></span> `#115e59` |
| `brand-900` | <span class="brand-color-token" style="--brand-color-token: #134e4a;"></span> `#134e4a` |
