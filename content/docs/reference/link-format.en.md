---
aside: false
title: "Link format"
description: "The v8s-links.txt source format for exact links, splat links, states, metadata, expiry, and generated v8s.json."
weight: 60
aliases:
  - /docs/link-format/

---

`v8s-links.txt` is the human-authored source of truth for links. Each non-empty, non-comment row is pipe-delimited:

```text
slug|target|state|title|description|tags|owner|expires_at|notes
```

| Field | Required | Description |
|---|---|---|
| `slug` | yes | Slash-delimited alias path, without leading `/` |
| `target` | yes | Absolute `http` or `https` URL, or a hostname normalized to `https://` |
| `state` | no | `permanent`, `ephemeral`, `expired`, `disabled`, `maintenance`, `deactivated` |
| `title` | no | Dashboard title |
| `description` | no | Human-readable purpose |
| `tags` | no | Comma-separated tags |
| `owner` | recommended | Accountability label |
| `expires_at` | no | ISO date or timestamp |
| `notes` | no | Internal notes |

## Exact links

```text
social/x|https://x.com/vanityURLs|permanent|X / Twitter|Social profile|social,x|v8s||
```

The link resolves only `/social/x`.

## Splat links

Append `/*` to the slug and include `:splat` in the target:

```text
github/*|https://github.com/vanityURLs/:splat|permanent|GitHub|Repo namespace|git|v8s||
```

`/github/website` redirects to `https://github.com/vanityURLs/website`.

## States

| State | Runtime behavior |
|---|---|
| `permanent` | 301 to the link target |
| `ephemeral` | 302 to the link target |
| `expired` | 302 to `/expired` |
| `disabled` | 302 to `/disabled` |
| `maintenance` | 302 to `/maintenance` |
| `deactivated` | true 404 |

If `expires_at` is earlier than the current time, the effective state becomes `expired`.

## Slug rules

- No leading or trailing slash
- No empty segment
- No query string or fragment
- Each segment starts with a letter or digit
- Segment characters can include letters, digits, `.`, `_`, `~`, and `-`

Reserved top-level slugs include `admin`, `404`, `expired`, `disabled`, `maintenance`, `deactivated`, `assets`, and `v8s.json`.
