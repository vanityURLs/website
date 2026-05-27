---
aside: false
title: "Custom overrides"
description: "Map instance-owned files under custom/ to the vanityURLs pages that document each customization surface."
weight: 50
aliases:
  - /docs/custom-overrides/

---

Use `custom/` for instance-owned files. This keeps your deployment upgradable because default pages, Worker logic, source policy, and local helper settings can move forward without mixing in every local choice.

For the upgrade rationale, read [Keeping vanityURLs upgradable with custom overrides](/blog/keeping-vanityurls-upgradable-with-custom-overrides/). For the build order and generated artifacts, read [Configuration files](/docs/reference/configuration-files/).

## Defaults versus custom

`defaults/` is the product baseline. `custom/` is your instance overlay. Files in `custom/` either replace specific defaults or provide instance data that should survive upstream updates.

Keep product changes in `defaults/` only when you are contributing back to vanityURLs. Keep instance changes in `custom/` when the change is only for your short domain.

## Custom file map

| File or path | Use it for | Details |
| --- | --- | --- |
| `custom/v8s-links.txt` | Redirect inventory | [Link format](/docs/reference/link-format/) and [LNK](/docs/command-line-interface/lnk/) |
| `custom/v8s-schedules.json` | Scheduled link state changes | [Scheduled links](/docs/reference/schedules/) |
| `custom/v8s-policies.json` | Instance allow and block policy | [Policy and blocklist](/docs/customize/blocklist/) |
| `custom/v8s-site-config.json` | Site settings written by setup | [Configuration files](/docs/reference/configuration-files/) |
| `custom/v8s-local-config.json` | Workstation helper paths | [Local helper](/docs/command-line-interface/local-helper/) |
| `custom/public/` | Public page and asset overrides | [Brand](/docs/customize/brand/), [Footer & pages](/docs/customize/footer-pages/), and [Internationalization](/docs/reference/i18n/) |

## Public override map

| Override | Path | Details |
| --- | --- | --- |
| Brand assets and redirected badges | `custom/public/v8s-logo.svg`, `custom/public/favicon.svg`, `custom/public/{language}/v8s-redirected.svg` | [Brand](/docs/customize/brand/) |
| Footer and legal pages | `custom/public/privacy.html`, `custom/public/terms.html`, `custom/public/abuse.html`, `custom/public/security.html` | [Footer & pages](/docs/customize/footer-pages/) |
| Localized public pages | `custom/public/fr/index.html`, `custom/public/es/404.html`, and similar language paths | [Internationalization](/docs/reference/i18n/) |
| Expand page | `custom/public/expand/index.html` | [Link format](/docs/reference/link-format/) |
| Dashboard shell | `custom/public/_stats/index.html` | [Reading your vanityURLs admin dashboard](/blog/reading-your-admin-dashboard/) and [Access control](/docs/customize/access-control/) |
| Headers | `custom/public/_headers` | [Runtime security approach](/docs/reference/runtime-security/) |

## Status pages

The Worker serves specific files for link and routing states. To build custom status pages from scratch, place the files at these exact paths:

| File | Used for | Status |
| --- | --- | --- |
| `custom/public/404.html` | Unknown short links and missing pages | 404 |
| `custom/public/disabled.html` | Disabled links | 403 |
| `custom/public/expired.html` | Expired links | 410 |
| `custom/public/maintenance.html` | Temporarily unavailable links | 503 |

Localized versions use the [language code](/docs/reference/i18n/#supported-languages) as the first directory segment, for example `custom/public/fr/404.html`. You only need to add the localized pages you actually support. If a localized page is missing, the Worker can fall back to the default page for the requested state.

If you replace `404.html`, include these placeholders where you want runtime context to appear:

```html
<!-- {{SLUG_MESSAGE}} -->
<!-- {{REFERENCE_LINE}} -->
```

`{{SLUG_MESSAGE}}` is replaced with a safe message about the requested slug. `{{REFERENCE_LINE}}` is replaced with a correlation reference that helps with support and log review.
