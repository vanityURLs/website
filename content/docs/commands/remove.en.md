---
title: "lnk remove"
description: "Remove a redirect rule from static.lnk or dynamic.lnk."
nav_order: 22
---

Remove a redirect by its source path. Searches both `static.lnk` and `dynamic.lnk` by default, and asks for confirmation if the path appears in both.

```bash
$ lnk remove /path
```

## Usage

```bash
$ lnk remove /summit
Found in dynamic.lnk: /summit → https://summit.example.com/2025  302
Remove? [y/N] y
Removed: /summit from dynamic.lnk

$ lnk remove --static /old-link
Removed: /old-link from static.lnk
```

## Options

| Option | Description |
|--------|-------------|
| `--static` | Search only `static.lnk` |
| `--dynamic` | Search only `dynamic.lnk` |
| `--force`, `-f` | Remove without asking for confirmation |
| `--dry-run` | Show what would be removed without writing |

## Examples

```bash
# Remove a link (will search both files)
lnk remove /github

# Remove specifically from dynamic.lnk
lnk remove --dynamic /old-campaign

# Remove multiple links at once
lnk remove /old-1 /old-2 /old-3

# Preview without removing
lnk remove --dry-run /github
```

{{< callout type="warning" >}}
Removing a link takes effect on the next `git push`. Until then, the redirect is still active on Cloudflare. Run `lnk deploy` immediately after removing time-sensitive links.
{{< /callout >}}
