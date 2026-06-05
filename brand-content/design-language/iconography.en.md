---
title: "Iconography"
heading: "Icon roles, style, and usage rules"
description: "How vanityURLs uses icons across documentation, product surfaces, links, status states, and generated pages."
type: brand
weight: 55
---

Iconography should clarify meaning, not decorate empty space. The vanityURLs system follows the practical shape of the [Red Hat iconography foundation](https://ux.redhat.com/foundations/iconography/): choose icons from a known set, use them consistently, and make their purpose clear in context.

## Icon roles

| Role         | Use                                                     | Guidance                                                                                        |
| ------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Navigation   | Section identity, previous/next cues, external links    | Pair with text unless the icon is universally understood and labelled for assistive technology. |
| Actions      | Copy, download, search, open, close, theme toggle       | Use familiar symbols and preserve hover, pressed, and focus states.                             |
| Status       | Success, warning, danger, blocked, expired, maintenance | Pair with visible text. Do not rely on color or icon shape alone.                               |
| Metadata     | GitHub, RSS, social, file type, language                | Keep small and subordinate to the label or value.                                               |
| Illustration | Product concepts or brand storytelling                  | Use sparingly; documentation should remain useful before it becomes expressive.                 |

## Style

- Prefer a consistent outline style for interface icons.
- Use filled icons only when the state or icon set requires it, such as selected status or social marks.
- Keep icon stroke, size, and optical weight balanced with adjacent text.
- Use `1em` icons inside inline text and stable square dimensions for icon buttons.
- Do not mix unrelated icon libraries in the same control group.

## Accessibility

Decorative icons should be hidden from assistive technology. Informative icons need an accessible name or nearby text that carries the same meaning.

- Icon-only buttons need an accessible label.
- External-link icons should not replace clear link text.
- Status icons need visible labels such as `Blocked`, `Expired`, or `Protected`.
- Icons in badges need localized alternative text when exported as images.

## vanityURLs-specific guidance

Generated redirect pages should use icons only when they make the state faster to understand. A warning icon can support an expired or blocked state, but the page still needs a plain-language heading and next action. Brand pages may use icon samples for assets and downloads, but avoid turning lists of documentation links into icon galleries.
