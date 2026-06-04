---
title: "Diagrams and code"
description: "Standards for Mermaid diagrams, syntax highlighting, examples, and technical explanations."
type: brand
weight: 60
---

vanityURLs is a technical product, so diagrams and code examples are part of the brand language. They should clarify behavior, not decorate the page.

## Mermaid diagrams

Use Mermaid for redirect flows, deployment paths, routing decisions, and lifecycle diagrams.

- Keep diagrams small enough to understand without zooming.
- Label edges with real conditions such as `alias found`, `blocked`, `expired`, or `fallback`.
- Prefer left-to-right flow for request pipelines.
- Use diagrams to explain behavior that would be harder to parse as prose.

## Code blocks

Code blocks use Chroma class-based highlighting and copy buttons. Keep examples complete enough to run or recognize.

- Use fenced code blocks with language identifiers.
- Use JetBrains Mono for commands, paths, environment variables, and configuration.
- Avoid inline styles in examples because the site is designed for a stricter content security policy.
- Keep secrets, tokens, and private identifiers out of examples.

## File trees

Use the file-tree pattern for repository structure, build outputs, and asset inventories. It is better than a plain code block when the reader needs to understand hierarchy.

## Technical diagrams and copy

Pair diagrams with a short explanation. A diagram should reduce cognitive load, and the prose should explain the decision points that matter.
