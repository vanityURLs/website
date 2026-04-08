---
title: "Commands"
description: "Complete reference for all lnk CLI commands."
nav_order: 20
---

The `lnk` script is the primary interface for managing your vanityURLs redirects from the command line. Run `lnk --help` to see all available commands.

```bash
$ lnk --help
Commands:
  lnk add      /path https://destination [code]   # Add a redirect to static.lnk
  lnk remove   /path                              # Remove a redirect
  lnk list     [--static|--dynamic] [/path]       # List redirects
  lnk check    /path                              # Live HTTP check of a redirect
  lnk validate [--live]                           # Validate syntax and destinations
  lnk deploy   ["commit message"]                 # Commit, push, and deploy
  lnk help     [COMMAND]                          # Show help for a command
  lnk version                                     # Show lnk version
```

## Global flags

| Flag | Description |
|------|-------------|
| `--static` | Target `static.lnk` (default for most commands) |
| `--dynamic` | Target `dynamic.lnk` |
| `--quiet`, `-q` | Suppress non-error output |
| `--verbose`, `-v` | Show detailed output |
| `--help`, `-h` | Show help |

## Commands

{{< cards cols="2" >}}
{{< card title="lnk add" icon="bolt" href="/docs/commands/add/" >}}
Add a redirect to static.lnk or dynamic.lnk.
{{< /card >}}
{{< card title="lnk remove" icon="warning" href="/docs/commands/remove/" >}}
Remove a redirect by its source path.
{{< /card >}}
{{< card title="lnk list" icon="docs" href="/docs/commands/list/" >}}
List all redirects, or filter by file or path.
{{< /card >}}
{{< card title="lnk check" icon="check" href="/docs/commands/check/" >}}
Perform a live HTTP check on a redirect.
{{< /card >}}
{{< card title="lnk validate" icon="security" href="/docs/commands/validate/" >}}
Validate redirect file syntax and destinations.
{{< /card >}}
{{< card title="lnk deploy" icon="deploy" href="/docs/commands/deploy/" >}}
Commit changes and push to trigger a deployment.
{{< /card >}}
{{< /cards >}}
