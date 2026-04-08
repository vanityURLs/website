---
title: "lnk validate"
description: "Validate redirect file syntax and optionally verify that destination URLs are reachable."
nav_order: 25
---

Validate your redirect configuration before pushing. Runs two levels of checks: **syntax validation** (always) and **live URL reachability** (with `--live`).

```bash
$ lnk validate [--live] [--static|--dynamic]
```

## What it checks

### Syntax validation (always runs)

- Every line has exactly two or three fields: `source destination [code]`
- Source paths start with `/`
- Destination URLs are well-formed (`https://` or `/relative`)
- Status codes are valid HTTP redirect codes: `301`, `302`, `303`, `307`, `308`
- No duplicate source paths within the same file
- No duplicate source paths across both files (warns, does not fail)
- Comments (`#`) and blank lines are ignored

### Live URL reachability (`--live` flag)

- Makes an HTTP HEAD request to each destination URL
- Reports non-2xx/3xx responses as warnings
- Reports connection timeouts and DNS failures as errors

## Usage

```bash
$ lnk validate
Validating static.lnk... 4 rules OK ✓
Validating dynamic.lnk... 2 rules OK ✓
No issues found.

$ lnk validate --live
Validating static.lnk... 4 rules OK ✓
Validating dynamic.lnk... 2 rules OK ✓
Checking 6 destination URLs...
  https://github.com/bhdicaire        200 OK (41ms) ✓
  https://linkedin.com/in/bhdicaire   200 OK (87ms) ✓
  https://blog.example.com            200 OK (53ms) ✓
  https://x.com/bhdicaire             200 OK (62ms) ✓
  https://summit.example.com/2025     404 Not Found  ✗
  https://store.example.com?promo=s…  200 OK (49ms) ✓
Validation complete: 1 error, 0 warnings.
```

## Options

| Option | Description |
|--------|-------------|
| `--live`, `-l` | Also perform live HTTP reachability checks |
| `--static` | Validate `static.lnk` only |
| `--dynamic` | Validate `dynamic.lnk` only |
| `--timeout SECS` | Timeout for live checks (default: 10) |
| `--fail-on-warning` | Exit non-zero on warnings as well as errors |
| `--json` | Output results as JSON |

## Example: catching errors before they deploy

```bash
# Typical pre-push workflow
lnk validate && lnk deploy "update links"

# Full check with live validation
lnk validate --live --fail-on-warning
```

## Common errors

### Malformed URL

```
ERROR static.lnk:12: invalid destination URL "github.com/bhdicaire"
  → Destination URLs must start with https:// or /
  Fix: /github  https://github.com/bhdicaire  301
```

### Invalid status code

```
ERROR static.lnk:7: invalid redirect status code "200"
  → Valid codes: 301, 302, 303, 307, 308
  Fix: /old  https://new.example.com  301
```

### Duplicate path

```
ERROR: /github appears in both static.lnk (line 3) and dynamic.lnk (line 1)
  → Cloudflare uses the first match; the second rule will never be reached
```

### Destination not reachable (live only)

```
WARNING dynamic.lnk:2: https://summit2023.example.com returned 404 Not Found
  → The destination URL exists in your link file but is no longer live
  Consider removing or updating this redirect
```

{{< callout type="tip" title="Add validate to your CI pipeline" >}}
Run `lnk validate --live` in a GitHub Actions workflow on every pull request to catch broken links before they merge to `main`.

```yaml
# .github/workflows/validate.yml
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: make setup && lnk validate --live
```
{{< /callout >}}
