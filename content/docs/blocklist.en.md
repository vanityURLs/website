---
title: "Policy and blocklist"
description: "Source policy and generated runtime blocklist behavior for target URLs, shortener loops, malware hosts, risky schemes, and local overrides."
---

vanityURLs edits source policy as `v8s-policies.json` and deploys runtime policy as `build/v8s-blocklist.json`.

The source policy file is selected before build:

- `defaults/v8s-policies.json` is the upstream trust-and-safety source policy.
- `custom/v8s-policies.json` replaces the default source policy for an instance.
- Legacy `v8s-blocklist.json` source files may still be recognized for migration compatibility, but new docs and new instances should use `v8s-policies.json`.

`custom/v8s-policies.json` is not merged over the default source policy. If an instance owns policy, it owns the replacement. This prevents removed custom policy decisions from reappearing through an upstream merge.

The goal is to protect the reputation of a short-link domain by reducing phishing, malware, redirect chains, and risky URL forms.

A redirect engine is powerful infrastructure. Do not use a vanityURLs instance to hide malicious destinations, bypass trust systems, launder another shortener chain, disguise affiliate or tracking links without disclosure, or route people to content they did not reasonably expect.

## Default protections

- Non-HTTP(S) protocols
- Credentials embedded in URLs
- Localhost, `.localhost`, and `.local` targets
- Private, loopback, reserved, multicast, and documentation IP ranges
- Known public shorteners used for redirect chains
- Local examples of phishing lure domains
- High-risk executable download extensions such as `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, and `.jar`

The runtime also blocks common scanner probes before short-link lookup so paths such as PHP or WordPress probes do not become ordinary miss analytics.

## Categories and generated sources

`defaults/v8s-blocklist-categories.json` defines the category and severity labels used by source policy and generated policy data. Categories explain why something is blocked; severities describe risk to visitor safety and the short-domain reputation.

The current defaults include:

| Category | Used for |
|---|---|
| `phishing` | Credential theft, fake login pages, wallet-draining lures, and brand impersonation |
| `malware` | Malware distribution, exploit delivery, payload hosting, and command-and-control infrastructure |
| `shortener-loop` | Public shorteners that can hide the final destination or create redirect chains |
| `scanner-probe` | Automated vulnerability scanner paths that should never resolve as short links |
| `temporary-file-host`, `disposable`, `adult`, `gambling`, `social`, `custom` | Instance-owned policy categories for elevated-risk or owner-selected blocks |

Generated feeds reduce obvious abuse risk, but they can still have false positives. Review source changes before promoting them into a release, and keep `allow_domains` entries narrow when you intentionally override a generated block for an owner-controlled hostname.

## Configure instance policy

Create `custom/v8s-policies.json` for instance-specific rules:

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

The validator checks configured links against the generated runtime blocklist. Fix rejected links before deployment instead of bypassing the policy.

## Overrides and review

`allow_domains` can override generated and local domain blocks for trusted owner-controlled domains. It does not override malformed URLs, disallowed protocols, or credentialed URLs.

Keyword rules match the destination hostname, path, and query string after lowercasing. Keep keyword rules specific to avoid false positives.

Review the policy when:

- adding a new high-volume destination
- adding user-submitted or third-party links
- receiving an abuse report
- changing the instance owner, audience, or purpose
- importing links from another shortener

Keep local allow rules narrow. Prefer allowing a specific owner-controlled hostname over allowing an entire registrable domain when only one subdomain is needed.

## Generated runtime blocklist

Generate optional machine-managed policy data with:

```bash
npm run generate:blocklist
```

The build writes the runtime artifact here:

```text
build/v8s-blocklist.json
```

This file is consumed by the Worker and blocked from direct public access as `/v8s-blocklist.json`. It is a generated runtime artifact, not the file an instance owner should edit by hand.

Every enabled generated source should have a category, severity, URL, and clear reason to trust the upstream. A redirector is attractive to scanners even when nobody has announced the domain, so feed quality matters: noisy sources can break legitimate links, while missing obvious abuse sources can burn reputation quickly.
