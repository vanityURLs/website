---
aside: false
title: "Command line interface overview"
description: "Choose between the read-only local helper and the lnk command-line interface."
weight: 5
---

vanityURLs has two local command-line tools, and they serve different jobs.

| Tool | Use it when |
| --- | --- |
| [Local helper](/docs/local-helper/) | You want to open an existing short link from your terminal |
| [LNK](/docs/cli/) | You want to change links, schedules, or source policy in `custom/` |

The local helper is read-only. It reads the generated registry and opens known redirects.

`lnk` changes the instance. It edits source files in `custom/`, runs checks, commits, and pushes successful write operations.
