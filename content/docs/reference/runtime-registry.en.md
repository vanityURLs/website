---
title: "Runtime registry"
description: "The generated v8s.json schema 3.0 registry consumed by the vanityURLs Worker."
weight: 35
aside: false
---

`build/v8s.json` is the generated runtime registry consumed by the Worker. Humans edit source files such as `custom/v8s-links.txt`; the build validates and compiles those files into this runtime shape.

## Schema 3.0

Schema `3.0` is tree-first:

| Field                | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `schema_version`     | Runtime registry contract version, currently `3.0`                        |
| `generated_at`       | Build timestamp                                                           |
| `generated_timezone` | Operator timezone used by protected dashboards when displaying build time |
| `default_state`      | Fallback lifecycle state, normally `permanent`                            |
| `routing`            | State-to-outcome map used by the Worker                                   |
| `tree`               | Canonical nested lookup structure for runtime resolution                  |
| `links[]`            | Compatibility array for dashboards, local helpers, and review workflows   |

Each tree node has a `children` object and may have a `link`. Each `link` keeps the same fields exposed in `links[]`, including `slug`, `match`, `target`, `state`, metadata, and optional `schedule`.

## Compatibility

The Worker prefers `tree` when present and falls back to `links[]` when absent. That keeps rollback safe across the 2.x to 3.x boundary and lets local tools continue using the compatibility array during the 3.x series.

`links[]` remains part of the 3.x compatibility contract. Removing it would require a future major release.

## Validation

`npm run check` builds the registry and validates:

- required routing states
- tree shape
- compatibility `links[]`
- safe redirect targets
- splat target placeholders
- schedule rule shape
- blocklist policy violations

The implementation contract lives in the code repository generator and validator.
