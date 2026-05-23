---
aside: false
title: "Legal and trust pages"
description: "Understand the setup answers used to generate privacy, terms, Trust & Safety, security, and security.txt pages."
weight: 70

---

vanityURLs can publish legal and trust pages from the operator values stored in `custom/v8s-site-config.json`. These pages are part of the public posture of a short-link domain: they tell visitors, reporters, registrars, and security researchers who operates the redirector and how to reach the right contact.

This page is not legal advice. It explains what each setup question controls so you can provide simple phase-1 values, then refine them with the right internal or legal review later.

## Defer or configure now

The installer asks whether to configure privacy, terms, and security pages now. For the Quickstart, `N` is fine.

When you defer full legal pages:

- Trust & Safety still deploys so people can report abuse
- `/.well-known/security.txt` still deploys when the security contact is configured
- Privacy, terms, and the standalone security page are skipped until you configure them

Choose `Y` when you are ready to publish privacy, terms, and security language for the instance operator.

## Operator identity

| Setup question | What it means |
| :--- | :--- |
| Operator legal name | The person, company, nonprofit, team, or organization responsible for the instance |
| Operator contact email | General contact address for the redirector |
| Privacy contact | Address for privacy and data-protection questions |
| Trust & Safety contact | Address for abuse, phishing, malware, impersonation, and harmful-link reports |
| Security contact | Address for vulnerability reports and the contact published in `security.txt` |

Use role-based addresses when you can, such as `hello@`, `privacy@`, `abuse@`, and `security@` on the short domain. They are easier to hand over when ownership changes.

## Jurisdiction and governing law

Jurisdiction is the place whose laws govern the operator or the instance. For a personal redirector, this is usually where you live. For an organization, it is usually where the operating organization is established.

Governing law is the legal frame used by the terms page. It is often the same as jurisdiction. Use a narrower value, such as `Quebec, Canada`, only when that is the right legal context for the operator.

Keep the phase-1 answer simple. You can run `npm run setup` again when you are ready to refine it.

## Last updated date

The legal pages last updated date is printed on generated policy pages. Use `YYYY-MM-DD`.

Update this date when the published content changes in a meaningful way, such as:

- new analytics provider
- changed contact address
- changed jurisdiction or governing law
- material change to privacy, terms, trust, or security language

## Trust and Safety response window

The Trust & Safety response window is a good-faith expectation for reviewing reports. It is not a guaranteed service-level agreement.

Reasonable examples:

```text
5 business days
72 hours
as soon as practical
```

Avoid promises you cannot reliably keep. The purpose is to set a human expectation and show that abuse reports have a real handling path.

## Generated outputs

These setup answers feed generated public files:

| Output | Purpose |
| :--- | :--- |
| `/privacy` | Privacy notice for data handled by the redirector |
| `/terms` | Terms for using the short-link domain |
| `/trust-safety` | Abuse reporting and coordinated vulnerability disclosure |
| `/security` | Security disclosure page when full legal pages are enabled |
| `/.well-known/security.txt` | Machine-readable vulnerability disclosure contact |

If you later replace generated pages with custom HTML under `custom/public/`, keep the same contacts and public reporting paths accurate.

## Custom public pages

Replace generated pages only when you need fully custom HTML. Use these paths:

| Page | Custom file |
| :--- | :--- |
| Privacy | `custom/public/privacy.html` |
| Terms | `custom/public/terms.html` |
| Trust & Safety | `custom/public/abuse.html` |
| Security | `custom/public/security.html` |

English pages also have extension-free aliases such as `/privacy`, `/terms`, `/trust-safety`, and `/security`. Localized pages use the language directory, for example `custom/public/fr/privacy.html`.
