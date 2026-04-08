---
title: "Makefile"
description: "Reference for the vanityURLs Makefile targets."
nav_order: 11
---

The vanityURLs repository ships with a `Makefile` that automates common setup and maintenance tasks. All targets read from `vanityURLs.conf`.

## Available targets

```bash
$ make help
Targets:
  make config    — Interactive configuration wizard (opens vanityURLs.conf in $EDITOR)
  make setup     — Full initial setup: install lnk, generate _headers, _redirects
  make headers   — Regenerate build/_headers from your domain and Pages URL
  make install   — Install the lnk script to SCRIPT_DIR
  make validate  — Validate static.lnk and dynamic.lnk syntax
  make deploy    — Commit all link changes and push to origin
  make status    — Show current redirect counts and last deploy time
  make clean     — Remove generated files (build/_redirects, build/_headers)
```

## Details

### `make config`

Opens `vanityURLs.conf` in your `$EDITOR` (defaults to `vi`). The file has four settings:

```bash
SCRIPT_DIR=/usr/local/bin         # where lnk will be installed
REPO_DIR=~/repos/my-tiny.link     # path to your local repo clone
MY_DOMAIN=my-tiny.link            # your vanity domain
MY_PAGE=my-project.pages.dev      # Cloudflare Pages project URL
```

### `make setup`

Runs the full first-time setup sequence:

{{% steps %}}

### Install lnk

Copies the `lnk` script to `SCRIPT_DIR` and makes it executable.

### Generate _headers

Creates `build/_headers` with security headers tuned to your domain and Cloudflare Pages URL. The `X-Robots-Tag: noindex` rule is applied to the `.pages.dev` URL only.

### Create initial link files

Creates `static.lnk` with a root redirect (`/ → https://your-main-site.com 301`) and an empty `dynamic.lnk`.

### Run initial deploy

Commits and pushes the initial files to trigger the first Cloudflare Pages build.

{{% /steps %}}

### `make validate`

Runs `lnk validate` — syntax check only. For live URL checks, use `lnk validate --live` directly.

### `make status`

Shows a summary:

```
static.lnk:  12 redirects
dynamic.lnk:  3 redirects
Last deploy: 2 hours ago (commit a3f7c12)
Domain: my-tiny.link
Pages: my-project.pages.dev
```

## Running without `make`

All `make` targets are thin wrappers around `lnk` commands and shell scripts. If you prefer not to use `make`, you can run the underlying commands directly — see the [lnk command reference](/docs/commands/) for details.
