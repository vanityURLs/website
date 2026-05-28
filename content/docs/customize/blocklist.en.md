---
aside: false
title: "Policy and blocklist"
description: "Configure instance allow and block policy for target URLs, shortener loops, malware hosts, risky schemes, and local overrides."
weight: 70
aliases:
  - /docs/blocklist/

---

Use policy and blocklist customization when your instance needs local trust-and-safety decisions beyond the product defaults.

For the trust-and-safety rationale, read [Protecting the reputation of a short-link domain](/blog/protecting-the-reputation-of-a-short-link-domain/). For source file selection, categories, generated feeds, runtime artifacts, and field behavior, read [Policy and blocklist](/docs/reference/policy-blocklist/).

{{% steps %}}

### Decide whether you need local policy

In your instance repository, review `defaults/v8s-policies.json` before creating an override. Start with the default policy unless you have a concrete reason to replace it. Common reasons include:

- allowing an owner-controlled domain that a generated feed blocks
- blocking a risky destination family before a public campaign
- responding to an abuse report
- importing links from another shortener
- changing the instance owner, audience, or purpose

### Create the custom policy file

In your instance repository, create `custom/v8s-policies.json` when the instance needs its own rules:

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

`custom/v8s-policies.json` replaces the default source policy. It is not merged over `defaults/v8s-policies.json`.

### Keep allow rules narrow

In `custom/v8s-policies.json`, use `allow_domains` only for trusted owner-controlled domains. Prefer allowing a specific hostname over allowing an entire registrable domain when only one subdomain is needed.

Allow rules can override generated and local domain blocks. They do not override malformed URLs, disallowed protocols, or credentialed URLs.

### Validate before deployment

In your terminal at the instance repository root, run validation after changing policy:

```bash
npm run check
```

The validator checks configured links against the generated runtime blocklist. Fix rejected links before deployment instead of bypassing the policy.

### Review after incidents

In your instance repository, review `custom/v8s-policies.json` after an abuse report, a high-volume destination change, a generated feed update, or a new public campaign.

Run optional generated policy updates only when you are ready to review the results:

```bash
npm run generate:blocklist
```

{{% /steps %}}
