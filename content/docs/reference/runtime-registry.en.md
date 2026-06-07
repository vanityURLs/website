---
title: "Runtime link registry"
description: "The generated build/v8s.json schema 3.0 link registry consumed by the vanityURLs Worker."
weight: 35
aside: false
---

`build/v8s.json` is the generated runtime link registry consumed by the Worker. It is not the file humans edit.

Humans edit the source link registry, normally `custom/v8s-links.txt`. The build validates that source file, reads inline `@schedule` rules and policy files, then compiles the result into this runtime shape. For the human-editable source format, read [Link format](/docs/reference/link-format/).

## Cleanup Path

The 3.x direction is:

1. Keep `custom/v8s-links.txt` flat and human-readable.
2. Compile it during `npm run build` into a tree-first runtime link registry.
3. Treat `tree` as the canonical runtime lookup shape.
4. Keep `links[]` as a derived compatibility and dashboard view during the 3.x series.
5. Validate that `tree` and `links[]` agree before deployment.

Exact and splat source entries can share the same base slug. For example, `docs` and `docs/*` are valid together: `/docs` should resolve the exact link, while `/docs/install` should resolve the splat link. The runtime tree stores those separately as `link` and `splat_link`.

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

Each tree node has a `children` object, may have an exact `link`, and may have a `splat_link`. Each link object keeps the same fields exposed in `links[]`, including `slug`, `match`, `target`, `state`, metadata, and optional `schedule`.

## Compatibility

The Worker prefers `tree` when present and falls back to `links[]` when absent. That keeps rollback safe across the 2.x to 3.x boundary and lets local tools continue using the compatibility array during the 3.x series.

`links[]` remains part of the 3.x compatibility contract, but it is not the runtime source of truth when `tree` is present. Removing it would require a future major release.

## Validation

`npm run check` builds the runtime link registry and validates:

- required routing states
- tree shape
- compatibility `links[]`
- agreement between exact and splat source links and their runtime tree representation
- safe redirect targets
- splat target placeholders
- schedule rule shape
- blocklist policy violations

The implementation contract lives in the code repository generator and validator.
