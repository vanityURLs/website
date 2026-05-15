---
title: "Blocklist policy"
description: "Default and custom trust-and-safety policy for target URLs, shortener loops, malware hosts, risky schemes, and local overrides."
---

vanityURLs uses `defaults/v8s-blocklist.json` as the upstream trust-and-safety policy. Instance-specific policy lives in `custom/v8s-blocklist.json` and is merged over the defaults.

The goal is to protect the reputation of a short-link domain by reducing phishing, malware, redirect chains, and risky URL forms.

## Default protections

- Non-HTTP(S) protocols
- Credentials embedded in URLs
- Localhost, `.localhost`, and `.local` targets
- Private, loopback, reserved, multicast, and documentation IP ranges
- Known public shorteners used for redirect chains
- Local examples of phishing lure domains
- High-risk executable download extensions such as `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, and `.jar`

## Overrides

`allow_domains` can override generated and local domain blocks for trusted owner-controlled domains. It does not override malformed URLs, disallowed protocols, or credentialed URLs.

Keyword rules match the destination hostname, path, and query string after lowercasing. Keep keyword rules specific to avoid false positives.

## Generated blocklist

Generate optional machine-managed policy data with:

```bash
npm run generate:blocklist
```

The generated file is intended for CI or deployment refreshes, not hand editing. Review large upstream feed changes before promoting them into defaults.
