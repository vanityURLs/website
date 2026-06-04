---
title: "Color"
description: "Core color tokens and usage rules for vanityURLs surfaces."
type: brand
weight: 10
---

## Core palette

| Token           | Value     | Use                                                             |
| --------------- | --------- | --------------------------------------------------------------- |
| Ink             | `#111827` | Primary text, light-surface badges, high-emphasis UI            |
| Paper           | `#FFFFFF` | Primary page background and dark-surface badge text             |
| vanityURLs teal | `#0F766E` | Brand emphasis, links, selected states, primary accents         |
| Swoop teal      | `#14B8A6` | Secondary accent and motion or illustration detail              |
| Muted text      | `#6B7280` | Secondary descriptions and helper copy                          |
| Line            | `#E5E7EB` | Borders and separators                                          |
| Dark surface    | `#111827` | Dark documentation surfaces, code-adjacent panels, badge stages |

## Tailwind scale

The website extends Tailwind with a teal `brand` scale. Use these values when designing new surfaces so accents match the site implementation.

| Token       | Value     |
| ----------- | --------- |
| `brand-50`  | `#f0fdfa` |
| `brand-100` | `#ccfbf1` |
| `brand-200` | `#99f6e4` |
| `brand-300` | `#5eead4` |
| `brand-400` | `#2dd4bf` |
| `brand-500` | `#14b8a6` |
| `brand-600` | `#0d9488` |
| `brand-700` | `#0f766e` |
| `brand-800` | `#115e59` |
| `brand-900` | `#134e4a` |

## Usage

- Use teal as an accent, not as the whole interface.
- Keep status colors semantic and distinct from brand teal.
- Preserve badge contrast on light and dark surfaces.
- Pair brand accents with neutral gray, white, and dark ink surfaces so pages do not become one-note teal compositions.
- Test color combinations against WCAG contrast requirements before publishing.
