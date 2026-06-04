---
aside: false
title: "Custom overrides"
description: "Map instance-owned files under custom/ to the vanityURLs configuration and public override surfaces."
weight: 40
aliases:
  - /docs/custom-overrides/
  - /docs/customize/custom-overrides/
---

Use `custom/` for instance-owned files. This keeps your deployment upgradable because default pages, Worker logic, source policy, and local helper settings can move forward without mixing in every local choice.

For the upgrade rationale, read [Keeping vanityURLs upgradable with custom overrides](/blog/keeping-vanityurls-upgradable-with-custom-overrides/). For the build order and generated artifacts, read [Configuration files](/docs/reference/configuration-files/).

## Defaults versus custom

`defaults/` is the product baseline. `custom/` is your instance overlay. Files in `custom/` either replace specific defaults or provide instance data that should survive upstream updates.

Keep product changes in `defaults/` only when you are contributing back to vanityURLs. Keep instance changes in `custom/` when the change is only for your short domain.

## Custom file map

| File or path                   | Use it for                                            | Details                                                                                                                                                                                             |
| ------------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `custom/v8s-links.txt`         | Redirect inventory                                    | [Link format](/docs/reference/link-format/) and [LNK](/docs/command-line-interface/lnk/)                                                                                                            |
| `custom/v8s-schedules.json`    | Legacy scheduled link rules for 3.x compatibility     | [Scheduled links](/docs/reference/schedules/)                                                                                                                                                       |
| `custom/v8s-policies.json`     | Instance allow and block policy                       | [Policy and blocklist](/docs/customize/blocklist/)                                                                                                                                                  |
| `custom/v8s-site-config.json`  | Site settings written by setup                        | [Configuration files](/docs/reference/configuration-files/)                                                                                                                                         |
| `custom/v8s-local-config.json` | Workstation helper paths                              | [Local helper](/docs/command-line-interface/local-helper/)                                                                                                                                          |
| `custom/public/`               | Public page, asset, status-page, and header overrides | [Public pages and status pages](/docs/reference/public-pages/), [Brand](/docs/reference/brand/), [Footer & pages](/docs/customize/footer-pages/), and [Internationalization](/docs/reference/i18n/) |

## Public pages

Use [Public pages and status pages](/docs/reference/public-pages/) for the exact `custom/public/` paths, status-page placeholders, shared asset cautions, and CSP guidance for custom HTML.
