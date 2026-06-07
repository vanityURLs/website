---
aside: false
title: "Source link registry format"
description: "The human-edited v8s-links.txt source link registry format for exact links, splat links, states, metadata, and expiry."
weight: 70
aliases:
  - /docs/link-format/
---

`v8s-links.txt` is the source link registry: the human-authored source of truth for links. Each non-empty, non-comment row is pipe-delimited:

```text
slug|target|state|title|description|tags|owner|expires_at|notes
```

The Worker does not read this file directly at request time. `npm run build` compiles it into the generated runtime link registry, `build/v8s.json`, documented in [Runtime link registry](/docs/reference/runtime-registry/).

| Field         | Required    | Description                                                                   |
| ------------- | ----------- | ----------------------------------------------------------------------------- |
| `slug`        | yes         | Slash-delimited alias path, without leading `/`                               |
| `target`      | yes         | Absolute `http` or `https` URL, or a hostname normalized to `https://`        |
| `state`       | no          | `permanent`, `ephemeral`, `expired`, `disabled`, `maintenance`, `deactivated` |
| `title`       | no          | Dashboard title                                                               |
| `description` | no          | Human-readable purpose                                                        |
| `tags`        | no          | Comma-separated tags                                                          |
| `owner`       | recommended | Accountability label                                                          |
| `expires_at`  | no          | ISO date or timestamp                                                         |
| `notes`       | no          | Internal notes                                                                |

## Exact links

```text
social/x|https://x.com/vanityURLs|permanent|X / Twitter|Social profile|social,x|v8s||
```

The link resolves only `/social/x`.

## Inline schedules

Exact links can include indented `@schedule` directives directly below the link row:

```text
office|https://example.com/closed|permanent|Office|Business hours|ops|team||
  @schedule timezone=America/Toronto
  @schedule rule=workdays days=mon,tue,wed,thu,fri from=09:00 to=17:00 target=https://example.com/open
```

The link target remains the fallback target. Schedule rules only choose another target during matching windows.

## Splat links

Append `/*` to the slug and include `:splat` in the target:

```text
github/*|https://github.com/vanityURLs/:splat|permanent|GitHub|Repo namespace|git|v8s||
```

`/github/website` redirects to `https://github.com/vanityURLs/website`.

An exact link and a splat link can share the same base slug:

```text
docs|https://docs.example.com|permanent|Docs|Docs home|docs|team||
docs/*|https://docs.example.com/:splat|permanent|Docs pages|Docs namespace|docs|team||
```

`/docs` resolves the exact link. `/docs/install` resolves the splat link.

## States

| State         | Runtime behavior       |
| ------------- | ---------------------- |
| `permanent`   | 301 to the link target |
| `ephemeral`   | 302 to the link target |
| `expired`     | 302 to `/expired`      |
| `disabled`    | 302 to `/disabled`     |
| `maintenance` | 302 to `/maintenance`  |
| `deactivated` | true 404               |

If `expires_at` is earlier than the current time, the effective state becomes `expired`.

## Slug rules

- No leading or trailing slash
- No empty segment
- No query string or fragment
- Each segment starts with a letter or digit
- Segment characters are ASCII only: letters, digits, `.`, `_`, `~`, and `-`

Reserved top-level slugs include `admin`, `404`, `expired`, `disabled`, `maintenance`, `deactivated`, `assets`, and `v8s.json`.
