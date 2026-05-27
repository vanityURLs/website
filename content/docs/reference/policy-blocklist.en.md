---
aside: false
title: "Policy and blocklist reference"
description: "Source policy files, runtime blocklist artifacts, categories, generated feeds, and validation behavior in vanityURLs."
weight: 57
aliases:
  - /docs/blocklist-policy/
  - /docs/reference/blocklist/

---

vanityURLs edits source policy as `v8s-policies.json` and deploys runtime policy as `build/v8s-blocklist.json`.

The names are intentionally described as source policy and runtime blocklist artifact throughout the docs because the current filenames are easy to confuse. A future breaking cleanup should use clearer paired names for source and generated policy files.

Built-in runtime protections are documented in [Runtime security](/docs/reference/runtime-security/). Use [Policy and blocklist](/docs/customize/blocklist/) when you need the operator workflow for changing instance policy.

## Source Selection

The source policy file is selected before build:[^legacy-policy]

| File | Role |
|---|---|
| `defaults/v8s-policies.json` | Upstream trust-and-safety source policy |
| `custom/v8s-policies.json` | Instance-owned replacement source policy |

`custom/v8s-policies.json` is not merged over the default source policy. If an instance owns policy, it owns the replacement. This prevents removed custom policy decisions from reappearing through an upstream merge.

## Categories And Sources

`defaults/v8s-blocklist-categories.json` defines the category and severity labels used by source policy and generated policy data. Categories explain why something is blocked; severities describe risk to visitor safety and short-domain reputation.

The current defaults include:

| Category | Used for |
|---|---|
| `phishing` | Credential theft, fake login pages, wallet-draining lures, and brand impersonation |
| `malware` | Malware distribution, exploit delivery, payload hosting, and command-and-control infrastructure |
| `shortener-loop` | Public shorteners that can hide the final destination or create redirect chains |
| `scanner-probe` | Automated vulnerability scanner paths that should never resolve as short links |
| `temporary-file-host`, `disposable`, `adult`, `gambling`, `social`, `custom` | Instance-owned policy categories for elevated-risk or owner-selected blocks |

Generated feeds reduce obvious abuse risk, but they can still have false positives. Review source changes before promoting them into a release.

Every enabled generated source should have a category, severity, URL, and clear reason to trust the upstream.

## Field Behavior

| Field | Behavior |
|---|---|
| `allow_domains` | Allows trusted owner-controlled domains and can override generated or local domain blocks |
| `block_domains` | Blocks destination hostnames that match the configured domain or a subdomain |
| `block_keywords` | Blocks destination hostname, path, and query matches after lowercasing |
| `block_extensions` | Blocks risky destination file extensions |

`allow_domains` does not override malformed URLs, disallowed protocols, or credentialed URLs.

Keep keyword rules specific to avoid false positives.

## Runtime Artifact

The build writes the runtime artifact here:

```text
build/v8s-blocklist.json
```

This file is consumed by the Worker and blocked from direct public access as `/v8s-blocklist.json`. It is a generated runtime artifact, not the file an instance owner should edit by hand.

[^legacy-policy]: Legacy `v8s-blocklist.json` source files may still be recognized for migration compatibility, but new docs and new instances should use `v8s-policies.json`.
