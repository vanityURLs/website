---
title: "lnk list"
description: "List redirect rules from static.lnk and dynamic.lnk."
nav_order: 23
---

Display redirect rules. By default shows all rules from both files, with their source, destination, status code, and origin file.

```bash
$ lnk list [--static|--dynamic] [/path]
```

## Usage

```bash
$ lnk list
SOURCE           DESTINATION                              CODE  FILE
/blog            https://blog.example.com                 301   static.lnk
/github          https://github.com/bhdicaire             301   static.lnk
/linkedin        https://linkedin.com/in/bhdicaire        301   static.lnk
/twitter         https://x.com/bhdicaire                 301   static.lnk
/summit          https://summit.example.com/2025          302   dynamic.lnk
/promo           https://store.example.com?promo=summer   302   dynamic.lnk

6 redirects (4 static, 2 dynamic)
```

## Options

| Option | Description |
|--------|-------------|
| `--static` | Show only `static.lnk` entries |
| `--dynamic` | Show only `dynamic.lnk` entries |
| `--short` | Show source paths only, one per line |
| `--json` | Output as JSON |
| `--count` | Print total count only |

## Examples

```bash
# All redirects
lnk list

# Only static redirects
lnk list --static

# Only dynamic redirects
lnk list --dynamic

# Check if a specific path exists
lnk list /github
SOURCE    DESTINATION                     CODE  FILE
/github   https://github.com/bhdicaire   301   static.lnk

# Count total redirects
lnk list --count
6

# Machine-readable output
lnk list --json
[
  {
    "source": "/github",
    "destination": "https://github.com/bhdicaire",
    "status": 301,
    "file": "static.lnk"
  },
  ...
]

# Pipe to grep for filtering
lnk list --short | grep promo
/promo
```
