---
title: "lnk add"
description: "Add a redirect to static.lnk or dynamic.lnk."
nav_order: 21
---

Add a redirect rule. By default the rule goes into `static.lnk` with a `301` status. Use `--dynamic` to target `dynamic.lnk`, and pass a status code as the third argument to override the default.

```bash
$ lnk add /path https://destination [status]
```

## Usage

```bash
$ lnk add /github https://github.com/bhdicaire
Added to static.lnk: /github → https://github.com/bhdicaire  301

$ lnk add /linkedin https://linkedin.com/in/bhdicaire 301
Added to static.lnk: /linkedin → https://linkedin.com/in/bhdicaire  301

$ lnk add --dynamic /summit https://summit.example.com/2025 302
Added to dynamic.lnk: /summit → https://summit.example.com/2025  302
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--static` | ✓ | Add to `static.lnk` |
| `--dynamic` | | Add to `dynamic.lnk` instead |
| `--status CODE` | `301` | HTTP redirect status code |
| `--comment TEXT` | | Prepend a `#` comment above the rule |
| `--dry-run` | | Print what would be added without writing |

## Status codes

| Code | Name | When to use |
|------|------|-------------|
| `301` | Moved Permanently | Stable links you won't change |
| `302` | Found (temporary) | Campaign links, A/B tests |
| `307` | Temporary Redirect | Preserves request method |
| `308` | Permanent Redirect | Preserves request method permanently |

## Examples

```bash
# Add a permanent link to static.lnk
lnk add /blog https://blog.example.com

# Add a temporary campaign link to dynamic.lnk with comment
lnk add --dynamic --comment "Q2 campaign, expires 2025-06-30" \
    /summer https://store.example.com?promo=summer 302

# Preview without writing
lnk add --dry-run /test https://example.com
```

{{< callout type="tip" title="Duplicate paths" >}}
`lnk add` will warn you if the path already exists in either link file, and ask for confirmation before overwriting.
{{< /callout >}}
