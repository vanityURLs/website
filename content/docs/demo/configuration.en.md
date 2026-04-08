---
title: "Configuration"
description: "The annotated vanityURLs.conf from the v8s.link reference deployment — every variable explained."
nav_order: 32
---

The `vanityURLs.conf` file is the single source of truth for your local environment. It is read by both the `Makefile` and the `lnk` script. Here is the complete file from v8s.link, with every variable explained.

## The full file

```bash
# This file is your config for vanityURLs to personalize and share branded URLs.
# For more info, visit https://github.com/bhdicaire/vanityURLs

# The path to your local scripts folder included in your PATH.
# Example: ~/.config/bin
SCRIPT_DIR=~/.config/bin

# The path to your local clone of this repository.
# Example: ~/repos/v8s.link
REPO_DIR="/Volumes/Tarmac/codePublic/vanityURLs/v8s.link"

# Your vanity domain served by Cloudflare.
# Example: dicai.re or felleg.xyz
MY_DOMAIN="v8s.link"

# Your Cloudflare Pages project URL (not your custom domain).
# Example: vanityURLs.pages.dev
MY_PAGE="v8s-link.pages.dev"

# How many characters long auto-generated short codes should be.
# Example: 3 gives you paths like /x7q, /mK2, /9zR
SHORTCODE_LENGTH=3

# Uncomment to test lnk commands without modifying any files.
#DRY_RUN=true
```

## Variable reference

### `SCRIPT_DIR`

Where the `lnk` and `validateURL` scripts will be installed when you run `make setup`. This directory **must be on your `$PATH`** for the commands to work without typing the full path.

```bash
# macOS common choices:
SCRIPT_DIR=~/.config/bin        # preferred (clean, user-owned)
SCRIPT_DIR=/usr/local/bin       # system-wide (requires sudo for setup)
SCRIPT_DIR=~/bin                # classic home bin

# Verify it's in your PATH:
echo $PATH | tr ':' '\n' | grep bin
```

{{< callout type="tip" title="Add to PATH if missing" >}}
If `~/.config/bin` is not in your `$PATH`, add this to your `~/.zshrc` or `~/.bashrc`:
```bash
export PATH="$HOME/.config/bin:$PATH"
```
Then reload: `source ~/.zshrc`
{{< /callout >}}

### `REPO_DIR`

The **absolute path** to your local clone of this repository. The `lnk` script uses this to know where to write changes to `static.lnk` and `dynamic.lnk`.

The v8s.link value (`/Volumes/Tarmac/...`) is an absolute macOS path specific to the maintainer's machine. **You must change this to your own path.**

```bash
# Find your path:
cd your-repo && pwd

# Typical values:
REPO_DIR=~/repos/my-tiny.link
REPO_DIR=~/projects/v8s.link
REPO_DIR=/Users/yourname/code/my-domain
```

{{< callout type="warning" title="Do not use the v8s.link path" >}}
`REPO_DIR="/Volumes/Tarmac/codePublic/vanityURLs/v8s.link"` is the maintainer's local machine path. If you use it unchanged, every `lnk` command will fail with "No such file or directory".
{{< /callout >}}

### `MY_DOMAIN`

Your vanity domain — the short domain that people will type. This is used by `make setup` to generate the correct `_headers` file and by `lnk check` to construct the full URL for live checks.

```bash
MY_DOMAIN="v8s.link"        # what v8s.link uses
MY_DOMAIN="my-tiny.link"    # your own domain
MY_DOMAIN="dicai.re"        # short .re TLD example
```

### `MY_PAGE`

Your Cloudflare Pages project URL — the `.pages.dev` URL assigned when you create the Pages project. This is **not** your custom domain. It is used to add `X-Robots-Tag: noindex` to the pages.dev URL so search engines don't index it separately from your custom domain.

```bash
MY_PAGE="v8s-link.pages.dev"          # v8s.link's pages project
MY_PAGE="my-tiny-link.pages.dev"      # your project (name chosen when creating it)
```

To find yours: Cloudflare Dashboard → Pages → Your project → the `.pages.dev` URL shown at the top.

### `SHORTCODE_LENGTH`

Controls how many characters the `lnk` script generates when you ask for a random short code instead of specifying a path manually.

```bash
SHORTCODE_LENGTH=3    # generates: /x7q, /mK2, /9zR  (50,000+ combinations)
SHORTCODE_LENGTH=4    # generates: /x7qM, /mK2p, ...  (2.8M+ combinations)
SHORTCODE_LENGTH=5    # generates: /x7qMz, ...         (150M+ combinations)
```

Length 3 is sufficient for most personal deployments (tens or hundreds of links). Increase it if you plan to generate thousands of short codes.

### `DRY_RUN`

When uncommented, `lnk` commands print what they would do without writing any files. Useful when learning the tool or testing automation scripts.

```bash
#DRY_RUN=true    # commented out → real writes (default)
DRY_RUN=true     # uncommented → preview only, nothing is modified
```

## Complete setup sequence

{{% steps %}}

### Clone the template

```bash
# From GitHub: Use this template → Create a new repository
# Then clone your new repo:
git clone git@github.com:yourname/my-tiny.link.git
cd my-tiny.link
```

### Edit vanityURLs.conf

```bash
make config   # opens in $EDITOR
# or directly: nano vanityURLs.conf
```

Set all four required variables. `SHORTCODE_LENGTH` and `DRY_RUN` are optional.

### Run setup

```bash
make setup
```

This installs `lnk` and `validateURL` to `SCRIPT_DIR`, generates `build/_headers`, and creates starter `static.lnk` and `dynamic.lnk` files.

### Verify lnk is reachable

```bash
which lnk        # should print: /your/SCRIPT_DIR/lnk
lnk --help       # should print command reference
```

If `which lnk` prints nothing, `SCRIPT_DIR` is not in your `$PATH`. See the tip in `SCRIPT_DIR` above.

{{% /steps %}}
