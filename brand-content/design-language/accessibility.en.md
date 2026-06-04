---
title: "Accessibility"
description: "Accessible brand expression across color, copy, layout, assets, generated pages, and documentation."
type: brand
weight: 50
---

Accessibility is part of the brand system, not an afterthought.

The main website publishes an [Accessibility Statement](https://vanityurls.link/en/accessibility/) and a [Trust Center](https://vanityurls.link/en/trust/) with the current conformance target, known gaps, and reporting channels. Brand work should preserve those commitments instead of treating them as a separate compliance page.

## Requirements

- Preserve visible focus states.
- Use meaningful link text.
- Keep color contrast readable.
- Provide localized alternative text for badges and images.
- Avoid layouts where text overlaps, clips, or becomes too small to read.

## Site standards

The current website targets WCAG 2.1 Level AA and documents partial conformance publicly. That standard applies to brand pages, documentation, generated redirect pages, badges, and operator-facing product surfaces.

When adding a visual pattern, verify:

- Keyboard access for every interactive element.
- Visible `:focus-visible` states with a brand-colored ring.
- Semantic headings and landmarks.
- Correct page language and localized alternatives.
- Descriptive link text and button labels.
- Contrast for text, icons, borders, focus rings, badges, and diagrams in both light and dark themes.

## Known gaps to keep visible

The main site currently tracks accessibility gaps such as reduced-motion support, search-result announcements, table captions, and JavaScript-dependent mobile navigation. Do not hide those gaps in brand copy. When a brand pattern affects one of those areas, either improve the implementation or document the limitation.

## Reporting path

Use public GitHub issues for accessibility barriers when possible. Include the page URL, assistive technology, browser, operating system, and reproduction steps.

Security-sensitive reports should use the security reporting path instead of a public issue.
