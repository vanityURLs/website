---
title: "Custom overrides"
description: "Use custom/ to brand a vanityURLs instance while keeping upstream defaults easy to update."
---

Use `custom/` for instance-owned files. This keeps v8s.link-style deployments upgradable because default pages, Worker logic, and product policy can move forward without mixing in every local brand choice.

## Build order

1. Copy `defaults/public/` into `build/`
2. Overlay `custom/public/` when it exists
3. Copy the default `defaults/public/_stats/index.html`
4. Overlay `custom/public/_stats/index.html` when it exists
5. Build `v8s.json` from `custom/v8s-links.txt` when it exists, otherwise from `defaults/v8s-links.txt`
6. Merge `defaults/v8s-blocklist.json`, optional `custom/v8s-blocklist.json`, and optional generated blocklist data

## Recommended custom files

```text
custom/v8s-links.txt
custom/v8s-schedules.json
custom/v8s-blocklist.json
custom/public/v8s-logo.svg
custom/public/v8s-redirected.svg
custom/public/favicon.svg
```

Only add HTML or CSS overrides when brand assets and content files are not enough.

## Legal and policy pages

Every public instance owner is responsible for their own terms, privacy notice, abuse contact, and security contact. The defaults and examples are not legal advice. They are placeholders and product patterns, not a lawyer-reviewed policy for every jurisdiction or use case.

Use `custom/public/` to publish instance-specific pages, for example:

```text
custom/public/terms.html
custom/public/privacy.html
custom/public/abuse.html
custom/public/security.html
custom/public/robots.txt
custom/public/llms.txt
custom/public/llms-full.txt
```

For most vanityURLs deployments, keep `robots.txt` restrictive. A short-link instance is a redirect engine, not a public content site, and the default policy is designed to discourage bulk harvesting.

Update legal and policy pages when the instance audience, analytics provider, abuse workflow, or data retention practices change.

## Upgrade workflow

```bash
git pull upstream main
npm run generate:blocklist
npm run check
```

Keep runtime behavior changes out of `defaults/functions/` unless you intend to maintain a fork. Prefer configuration, policy, and asset overrides for deployable instances.
