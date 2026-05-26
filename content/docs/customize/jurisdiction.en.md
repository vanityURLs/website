---
aside: false
title: "Jurisdiction"
description: "Decide the operator, jurisdiction, governing law, and trust contacts used by generated vanityURLs public pages."
weight: 70
aliases:
  - /docs/jurisdiction/

---

vanityURLs asks a few operator questions so the generated public pages have a real owner, a reporting path, and a legal context. Use this page before or during `npm run setup` when you are deciding what to enter.

This page is not legal advice. It explains what the fields control and gives phase-1 answers that are practical enough to get an instance online.

## What to decide first

Before configuring the public pages, decide who operates the instance and who handles reports.

| Decision | Phase 1 recommendation | Later customization |
| --- | --- | --- |
| Operator identity | Person, team, company, or organization responsible for the instance | Align the wording with the entity that owns the domain and repository |
| Operator contact domain | Leave blank when contacts should use the short domain | Use the operator's primary domain when contacts live somewhere else |
| Jurisdiction | Country, province/state, or operating location | Refine with internal or legal review if the instance is organizational |
| Governing law | Usually the same as jurisdiction | Use a narrower value only when that is the right legal context |
| General contact | `hello@<short-domain>` | Route to the team that owns the redirector |
| Privacy contact | `privacy@<short-domain>` | Route to the person or team handling privacy questions |
| Trust & Safety contact | `abuse@<short-domain>` | Route to abuse, phishing, malware, impersonation, and harmful-link reports |
| Security contact | `security@<short-domain>` | Route to vulnerability reports and publish through `/.well-known/security.txt` |
| Response window | `5 business days` | Use a realistic human response expectation, not a guaranteed SLA |

Use role-based addresses when you can. They are easier to transfer when ownership changes and easier for visitors, registrars, and researchers to recognize.

If the operator contact domain is blank, setup defaults role-based addresses to the short domain, such as `abuse@example.link`. If you enter an operator domain, such as `example.com`, setup defaults role-based addresses to that domain instead, such as `abuse@example.com`.

## Setup questions

The Quickstart can defer full privacy, terms, and standalone security pages. Trust & Safety and `security.txt` can still publish with a smaller set of answers.

| Setup question | When it appears | What it controls |
| --- | --- | --- |
| Configure privacy, terms, and security pages now? | Always | Whether full privacy, terms, and standalone security pages are generated now |
| Operator legal name | Always | Public operator identity shown on generated trust and legal pages |
| Operator domain for contact emails | Always | Domain used for default role-based contact emails; blank uses the short domain |
| Trust & Safety contact | Always | Public address for abuse and harmful-link reports |
| Trust & Safety response window | Always | Good-faith expectation for reviewing reports |
| Security contact | Always | Address for vulnerability reports and `/.well-known/security.txt` |
| Operator jurisdiction, for example Canada | Only when full legal pages are enabled | Place whose laws govern the operator or instance |
| Governing law | Only when full legal pages are enabled | Legal frame used by the generated terms page |
| Operator contact email | Only when full legal pages are enabled | General contact address for the redirector |
| Privacy contact | Only when full legal pages are enabled | Address for privacy and data-protection questions |
| Legal pages last updated date | Only when full legal pages are enabled | Date printed on generated privacy, terms, and security pages |

You can run `npm run setup` again later. The installer reads existing values and offers them as defaults, so it is fine to use simple phase-1 answers and refine them during customization.

## Jurisdiction and governing law

Jurisdiction is the place whose laws govern the operator or the instance. For a personal redirector, this is usually where you live. For an organization, it is usually where the operating organization is established.

Governing law is the legal frame used by the terms page. It is often the same as jurisdiction. Use a narrower value, such as `Quebec, Canada`, only when that is the right legal context for the operator.

## Last updated date

The legal pages last updated date is printed on generated policy pages. Use `YYYY-MM-DD`.

Update this date when the published content changes in a meaningful way, such as:

- new analytics provider
- changed contact address
- changed jurisdiction or governing law
- material change to privacy, terms, trust, or security language

## Response window

The Trust & Safety response window is a good-faith expectation for reviewing reports. It is not a guaranteed service-level agreement.

Reasonable examples:

```text
5 business days
72 hours
as soon as practical
```

Avoid promises you cannot reliably keep. The purpose is to set a human expectation and show that abuse reports have a real handling path.

## Related pages

Use [Footer & pages](/docs/customize/footer-pages/) for the generated output paths, footer links, aliases, and custom page overrides.
