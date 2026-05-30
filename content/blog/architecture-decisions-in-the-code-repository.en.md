---
title: "Architecture decisions belong with the code"
date: 2026-05-26
author: "Benoît H. Dicaire"
description: "Why vanityURLs records product-level architecture decisions as ADR files in the code repository instead of stretching user documentation."
tags: ["architecture", "adr", "maintenance"]
featured: false
---

A setup page should tell an operator what to do.

It should not carry the full history of why the Worker, installer, schema, release automation, and runtime security rules have their current shape. That history still matters. It belongs beside the implementation.

vanityURLs keeps product-level decisions as architecture decision records in the code repository. The public docs stay operational. The code repo keeps the rationale that future maintainers will need when the next change looks obvious but is not.

## What Deserves An ADR

An ADR records a decision that would be expensive to rediscover.

Good candidates include:

- release automation with [release-please](https://github.com/googleapis/release-please) and [semantic versioning](https://semver.org/)
- the `defaults/` and `custom/` ownership boundary
- when `schema_version` changes and when an additive field only needs the schema changelog
- how setup creates starter files
- why a runtime security rule is scoped narrowly

ADRs have no single canonical standard. vanityURLs follows the practical convention: short numbered files, a decision, the context that forced it, and the consequence the project accepts.[^adr]

## Why The Code Repository

The decision belongs where the implementation changes.

If a commit modifies `scripts/install.mjs`, `defaults/v8s-site-config.json`, and a schema rule, the ADR can travel with that commit. Reviewers see the code and the reason together.

That keeps the public website shorter. The website can say what to do. The ADR can preserve why the product behaves that way.

## Where To Look

ADRs live in the code repository under [`docs/adr/`](https://github.com/vanityURLs/code/tree/main/docs/adr).

Field-level schema additions are tracked in [`docs/schema-changelog.md`](https://github.com/vanityURLs/code/blob/main/docs/schema-changelog.md), especially when the change is additive and does not bump `schema_version`.

The tradeoff is indirection. A user may need to follow a link into GitHub for the full rationale. That is better than turning every setup page into an archaeological layer.

[^adr]: The public [ADR GitHub organization](https://adr.github.io/) is a useful entry point, but the repository's own ADRs are the local authority.
