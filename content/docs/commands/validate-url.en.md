---
title: "validateURL"
description: "The validateURL script — check that a URL is reachable before committing it as a redirect destination."
nav_order: 27
---

`validateURL` is a standalone bash script installed alongside `lnk` by `make setup`. It performs a live HTTP check against any URL and reports whether it is reachable, what status code it returns, and how long it took.

```bash
$ validateURL https://github.com/vanityURLs
```

It is called automatically by `lnk validate --live`, but you can also run it directly on any URL — not just redirect destinations.

## Usage

```bash
$ validateURL https://github.com/vanityURLs
200 OK (87ms) ✓

$ validateURL https://summit2023.example.com
404 Not Found ✗

$ validateURL https://gone.example.com
Connection refused ✗
```

## Options

| Option | Description |
|--------|-------------|
| `--timeout SECS` | Request timeout in seconds (default: 10) |
| `--follow`, `-L` | Follow redirect chains; report final destination |
| `--head`, `-I` | Use HTTP HEAD instead of GET (faster, no body) |
| `--quiet`, `-q` | Print only exit code — 0 for success, 1 for failure |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | URL returned 2xx or 3xx |
| `1` | URL returned 4xx, 5xx, or connection failed |

## Examples

```bash
# Check a single URL
validateURL https://github.com/vanityURLs

# Follow redirects (e.g. http → https)
validateURL --follow http://github.com/vanityURLs
http://github.com/vanityURLs
  → 301 → https://github.com/vanityURLs  (12ms)
  → 200 OK  (91ms) ✓

# Silent check for use in scripts
if validateURL --quiet https://mysite.com; then
    echo "Site is up"
else
    echo "Site is down — check before deploying!"
fi

# Check all destinations in static.lnk
awk '{print $2}' static.lnk | grep '^https\?://' | while read url; do
    validateURL "$url"
done
```

## Integration with lnk validate

`lnk validate --live` calls `validateURL` on every destination URL in your link files and aggregates the results:

```bash
$ lnk validate --live
Validating static.lnk... OK ✓
Checking 7 destination URLs via validateURL...
  https://vanityURLs.link/            200 OK (43ms) ✓
  https://vanityURLs.link/en/blog     200 OK (51ms) ✓
  https://github.com/vanityURLs/      200 OK (87ms) ✓
  https://github.com/vanityURLs/v8s.link  200 OK (89ms) ✓
  https://gitlab.com/bhdicaire/       200 OK (112ms) ✓
  https://linkedin.com/in/bhdicaire/  200 OK (156ms) ✓
  https://x.com/BHDicaire/            200 OK (71ms) ✓
All URLs reachable. ✓
```

## Common failure patterns

### 404 — destination deleted or renamed

```bash
validateURL https://summit2023.example.com
404 Not Found ✗
```

The redirect destination no longer exists. Update or remove the redirect rule.

### Timeout — destination unreachable

```bash
validateURL --timeout 5 https://slow-api.example.com
Timeout after 5s ✗
```

The server is not responding. Check if the URL is correct, or increase the timeout.

### Certificate error — HTTPS misconfigured

```bash
validateURL https://expired.example.com
SSL certificate error ✗
```

The destination has an expired or invalid TLS certificate. The redirect will still work for most browsers (they show a warning), but consider updating the destination.
