---
title: "Components and patterns"
description: "Reusable documentation and product patterns already present in the vanityURLs website."
type: brand
weight: 50
---

The brand system should reuse existing components before creating new ones. Shared patterns keep pages predictable and reduce CSS drift.

## Documentation patterns

Use existing Hugo shortcodes and CSS components for:

- Callouts and notices.
- Steps and ordered setup flows.
- File trees and repository structure.
- Code blocks with copy buttons.
- Tables for tokens, assets, and compatibility notes.
- Details sections for secondary explanation.
- Cards for repeated navigation items or downloads.

## Product patterns

Generated redirect and operator-facing surfaces should feel related to the documentation without becoming documentation pages.

- Use compact headers and clear status labels.
- Keep primary actions visually distinct.
- Prefer tables, definition lists, and short panels for operational data.
- Show full technical values when verification matters.
- Avoid decorative cards inside other cards.

## Pattern decisions

Create a new component only when an existing pattern cannot express the content clearly. If a component appears on more than one page, document its purpose and constraints here before it spreads.
