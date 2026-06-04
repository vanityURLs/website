---
title: "White space and text flow"
description: "How vanityURLs uses spacing, line length, and prose rhythm to keep documentation readable."
type: brand
weight: 45
---

White space is part of the interface, not decoration. It helps readers understand what belongs together, where a section starts, and which action is most important.

## Prose flow

The documentation uses `content-flow` and `docs-flow` patterns to create steady spacing between paragraphs, headings, lists, code blocks, tables, and callouts.

Use that rhythm for long-form pages. Avoid manually stacking ad hoc margins unless a reusable component needs a new spacing rule.

## Flow pattern rules

Use `content-flow` on Markdown-style content containers that need readable prose spacing. It sets the shared body size, line height, child spacing, heading rhythm, and list-item rhythm for paragraphs, lists, quotes, tables, code blocks, highlighted code, and non-prose inserts.

Use `docs-flow` with `content-flow` on documentation and brand reference pages. It keeps docs pages aligned with the same rhythm while leaving room for docs-specific behavior in the future.

- Let direct children create the vertical rhythm; avoid putting one-off top and bottom margins on every nested element.
- Start the first visible child flush with the container by relying on the first-child reset.
- Use larger gaps before `h2` headings, medium gaps before `h3` headings, and smaller gaps between a heading and its supporting text.
- Keep paragraphs, unordered lists, and ordered lists on the shared body line height.
- Keep list items close enough to scan as one list, but separated enough that multi-line items remain readable.
- Add a reusable component rule when a new pattern needs different spacing; do not solve it with page-local margin overrides.

## Line length

Keep explanatory content in a comfortable reading column. Dense operational panels can be wider when users need to compare values, but prose should not stretch across the full viewport.

## Section rhythm

- Put related headings, descriptions, examples, and tables close together.
- Let larger gaps mark changes in topic.
- Use lists for scannable rules, not for every sentence.
- Keep cards compact; do not turn every paragraph into a panel.

## Text flow in generated surfaces

Redirect pages, badges, and fallback screens must tolerate translated strings, long aliases, and full URLs. Use wrapping, truncation with accessible labels, or stacked layouts before allowing text to overlap.
