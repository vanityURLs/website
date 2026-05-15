---
title: "Blocklist policy"
description: "Default and custom trust-and-safety policy for target URLs, shortener loops, malware hosts, risky schemes, and local overrides."
---

vanityURLs uses `defaults/v8s-blocklist.json` as the upstream trust-and-safety policy. Instance-specific policy lives in `custom/v8s-blocklist.json` and is merged over the defaults.

The goal is to protect the reputation of a short-link domain by reducing phishing, malware, redirect chains, and risky URL forms.

A redirect engine is powerful infrastructure. Do not use a vanityURLs instance to hide malicious destinations, bypass trust systems, launder another shortener chain, disguise affiliate or tracking links without disclosure, or route people to content they did not reasonably expect. A short-link domain earns trust slowly and can lose it very quickly.

## Default protections

- Non-HTTP(S) protocols
- Credentials embedded in URLs
- Localhost, `.localhost`, and `.local` targets
- Private, loopback, reserved, multicast, and documentation IP ranges
- Known public shorteners used for redirect chains
- Local examples of phishing lure domains
- High-risk executable download extensions such as `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, and `.jar`

The runtime also blocks common scanner probes before short-link lookup so paths such as PHP or WordPress probes do not become ordinary miss analytics.

## Configure local policy

Create `custom/v8s-blocklist.json` for instance-specific rules. The build merges it over `defaults/v8s-blocklist.json`.

```json
{
  "allow_domains": [
    "example.com",
    "docs.example.com"
  ],
  "block_domains": [
    "untrusted-example.test"
  ],
  "block_keywords": [
    "credential-harvest",
    "wallet-drain"
  ],
  "block_extensions": [
    ".exe",
    ".scr"
  ]
}
```

Run validation after changing policy:

```bash
npm run check
```

The validator checks configured links against the merged blocklist. Fix rejected links before deployment instead of bypassing the policy.

## Overrides and review

`allow_domains` can override generated and local domain blocks for trusted owner-controlled domains. It does not override malformed URLs, disallowed protocols, or credentialed URLs.

Keyword rules match the destination hostname, path, and query string after lowercasing. Keep keyword rules specific to avoid false positives.

Review the blocklist when:

- adding a new high-volume destination
- adding user-submitted or third-party links
- receiving an abuse report
- changing the instance owner, audience, or purpose
- importing links from another shortener

Keep local allow rules narrow. Prefer allowing a specific owner-controlled hostname over allowing an entire registrable domain when only one subdomain is needed.

## Generated blocklist

Generate optional machine-managed policy data with:

```bash
npm run generate:blocklist
```

The generated file is intended for CI or deployment refreshes, not hand editing. Review large upstream feed changes before promoting them into defaults.
