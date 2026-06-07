---
title: "FAQ"
description: "Evidence-grounded answers about running, securing, and updating a vanityURLs instance."
---

## Upgrades

### Should I run `npm run update` or `npm run update -- --ref main`?

For a normal instance, run the plain command:

```bash
npm run update
```

That resolves the latest stable vanityURLs release tag and refreshes product-owned files from that release. This is the safer default for production because the code you receive matches a published release.

Use the current `main` branch only when you intentionally want unreleased code, usually on a test instance or while validating a fix with the maintainers:

```bash
npm run update -- --ref main
```

`main` can contain fixes that are not in the latest release yet, but it can also change before release notes exist. If you upgrade from `main`, commit that choice clearly and switch back to the normal command after the next release is published.

See [Upgrading an instance](/docs/reference/upgrading/) for the full workflow.
