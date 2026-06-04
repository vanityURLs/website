---
title: "Dark mode and themes"
description: "How light and dark themes preserve brand identity, readability, and implementation consistency."
type: brand
weight: 80
---

The website uses Tailwind's class-based dark mode. Theme changes should feel like the same system under different lighting, not like a separate brand.

## Theme behavior

- Initialize the selected theme before paint when possible.
- Preserve active navigation, focus, hover, and selected states in both themes.
- Keep code highlighting readable on light and dark backgrounds.
- Avoid theme-specific content unless the asset itself requires a light or dark version.

## Color in dark mode

Use teal accents sparingly on dark surfaces. Brand teal should identify links, selected states, and important accents; it should not become the background for every panel.

## Asset variants

Provide light and dark logo or badge variants when a single asset cannot preserve contrast. Document the intended background for each file in the asset inventory.

## Accessibility checks

Test contrast in both themes. A component that passes in light mode but fails in dark mode is unfinished.
