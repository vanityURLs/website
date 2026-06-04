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

## Line length

Keep explanatory content in a comfortable reading column. Dense operational panels can be wider when users need to compare values, but prose should not stretch across the full viewport.

## Section rhythm

- Put related headings, descriptions, examples, and tables close together.
- Let larger gaps mark changes in topic.
- Use lists for scannable rules, not for every sentence.
- Keep cards compact; do not turn every paragraph into a panel.

## Text flow in generated surfaces

Redirect pages, badges, and fallback screens must tolerate translated strings, long aliases, and full URLs. Use wrapping, truncation with accessible labels, or stacked layouts before allowing text to overlap.
