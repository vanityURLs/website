---
title: "Architecture decisions belong with the code"
date: 2026-05-26
author: "Benoît H. Dicaire"
description: "Why vanityURLs records product-level architecture decisions as ADR files in the code repository instead of stretching user documentation."
tags: ["architecture", "adr", "maintenance"]
featured: false
---

User documentation should help someone run a short-link domain. It should not make every setup page carry the full history of why the Worker, installer, schema, and release process behave the way they do.

That history still matters. When a maintainer changes a schema field, rewrites setup behavior, or decides that a custom policy replaces a product default, the next maintainer needs the reason close to the code.

That is what Architecture Decision Records, or ADRs, are for in vanityURLs.

## What goes in an ADR

An ADR records a product-level decision that would be expensive to rediscover later.

Good ADR candidates include:

- release automation and semantic versioning
- the `defaults/` and `custom/` ownership boundary
- schema versioning rules
- how setup creates starter files
- why a runtime security rule is scoped a certain way

The ADR does not replace documentation, tests, or comments. It answers a different question: why did we choose this shape?

## Why the code repository

The decision belongs where the implementation changes. If a commit changes `scripts/install.mjs`, `defaults/v8s-site-config.json`, and a schema rule, the ADR can travel with that same commit.

That keeps the public website shorter. The website can say what to do. The ADR can preserve why the product behaves that way.

## Where to look

ADRs live in the code repository under [`docs/adr/`](https://github.com/vanityURLs/code/tree/main/docs/adr).

Field-level schema additions are tracked in [`docs/schema-changelog.md`](https://github.com/vanityURLs/code/blob/main/docs/schema-changelog.md), especially when the change is additive and does not bump `schema_version`.

When a documentation page links to an ADR, it should be because the implementation reason matters. Most users do not need the ADR trail; maintainers and curious operators sometimes do.
