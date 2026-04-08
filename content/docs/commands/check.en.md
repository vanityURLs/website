---
title: "lnk check"
description: "Perform a live HTTP check to verify a redirect is working."
nav_order: 24
---

Make a live HTTP request to verify that a short link redirects correctly. Reports the status code, final destination, and response time.

```bash
$ lnk check /path
```

## Usage

```bash
$ lnk check /github
Checking https://my-tiny.link/github...
301 → https://github.com/bhdicaire  (43ms) ✓

$ lnk check /broken
Checking https://my-tiny.link/broken...
404 Not Found ✗
```

## Options

| Option | Description |
|--------|-------------|
| `--follow`, `-L` | Follow the full redirect chain and show each hop |
| `--timeout SECS` | Request timeout in seconds (default: 10) |
| `--all` | Check every redirect in both link files |
| `--fail-only` | When used with `--all`, only report failures |

## Examples

```bash
# Check a single redirect
lnk check /github

# Follow the full chain (useful for multi-hop redirects)
lnk check --follow /docs
Checking https://my-tiny.link/docs...
302 → https://vanityurls.link/en/docs  (38ms)
200 OK  (112ms) ✓

# Check all redirects and report only broken ones
lnk check --all --fail-only
Checking 6 redirects...
/old-summit → https://summit2023.example.com  (404 Not Found) ✗
1 failure found

# Check with a longer timeout (for slow destinations)
lnk check --timeout 30 /slow-api
```

{{< callout type="note" title="Requires a live deployment" >}}
`lnk check` hits your actual Cloudflare-hosted domain, not a local server. The redirect must already be deployed to get a meaningful result. To preview a redirect before pushing, use `lnk list /path` to inspect the rule locally.
{{< /callout >}}
