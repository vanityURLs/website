---
aside: false
title: "Setup decisions"
description: "Understand the setup answers that are safe to defer until the customization phase."
nav_order: 2
---

The Quickstart keeps phase 1 focused on a working redirector. Some setup answers are operationally required, while others are better refined after the first deployment works.

## Legal Pages

The installer can defer privacy, terms, and security pages to phase 2. If you defer them, vanityURLs still deploys Trust & Safety and `security.txt` so people have a place to report abuse or vulnerabilities.

See [Legal and trust pages](/docs/legal-trust-pages/) for the setup questions about operator identity, jurisdiction, governing law, last-updated dates, and Trust & Safety response windows.

## Analytics

Use `disabled` for phase 1. Once redirects work, decide whether analytics answer a concrete operational question.

If analytics stay disabled, setup skips analytics disclosure and retention questions. If you enable Fathom or Umami, setup asks those questions because the generated privacy page needs to explain what is enabled and how long the analytics provider keeps data.

See [Analytics](/docs/analytics/) for configuration details.

## Derived Defaults

Some setup defaults are derived from previous answers so the installer does not ask for the same idea twice. For example, the operator short domain is derived from the short domain, and contact addresses default to useful local parts at that domain.

You can run `npm run setup` as often as you like. The installer is idempotent: it reads your existing configuration, shows previous answers as defaults, and updates the same generated files instead of requiring a fresh clone.
