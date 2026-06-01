---
aside: false
title: "Jurisdiction"
description: "Decide the operator, jurisdiction, governing law, and trust contacts used by generated vanityURLs public pages."
weight: 50
aliases:
  - /docs/jurisdiction/
---

vanityURLs asks a few operator questions so generated public pages have a real owner, a reporting path, and a legal context. Use this page before or during `npm run setup` when you are deciding what to enter.

This page is not legal advice. It explains what the fields control and gives phase-1 answers that are practical enough to get an instance online. Use [Footer & pages](/docs/customize/footer-pages/) when you need generated output paths, footer links, aliases, and custom page overrides.

For the rationale behind the generated email addresses, see [Public contact emails for generated pages](/blog/public-contact-emails-for-generated-pages/).

{{% steps %}}

### Identify the operator

In `npm run setup`, answer **Operator legal name** with the person, team, company, or organization responsible for the instance. Align the wording with the entity that owns the domain and repository.

### Review public contact emails

In `npm run setup`, answer **Review public contact emails for generated pages?** with `Y` when you want to inspect or change the public email addresses printed on generated pages and `/.well-known/security.txt`.

When you review them, setup asks for **Operator domain for contact emails**. Use the domain that should receive role-based contact addresses. Leave it blank when contacts should use the short domain.

If the operator contact domain is blank, setup defaults role-based addresses to the short domain, such as `abuse@example.link`. If you enter an operator domain, such as `example.com`, setup defaults role-based addresses to that domain instead, such as `abuse@example.com`.

### Set reporting contacts

If you answer `N`, setup keeps existing public contact values or derives practical defaults from the short domain. When you do review the values, use role-based addresses when you can. They are easier to transfer when ownership changes and easier for visitors, registrars, and researchers to recognize.

| Setup question         | Phase 1 recommendation    | What it controls                                                                     |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| Trust & Safety contact | `abuse@<short-domain>`    | Public address for abuse, phishing, malware, impersonation, and harmful-link reports |
| Security contact       | `security@<short-domain>` | Address for vulnerability reports and `/.well-known/security.txt`                    |
| Operator contact email | `hello@<short-domain>`    | General contact address when full legal pages are enabled                            |
| Privacy contact        | `privacy@<short-domain>`  | Privacy and data-protection contact when full legal pages are enabled                |

### Decide the legal context

In `npm run setup`, enable full legal pages when you are ready to publish privacy, terms, and standalone security pages. These questions appear only when full legal pages are enabled:

| Setup question                | Phase 1 recommendation                         | What it controls                                             |
| ----------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| Operator jurisdiction         | Country, province/state, or operating location | Place whose laws govern the operator or instance             |
| Governing law                 | Usually the same as jurisdiction               | Legal frame used by the generated terms page                 |
| Legal pages last updated date | Current review date in `YYYY-MM-DD` format     | Date printed on generated privacy, terms, and security pages |

For a personal redirector, jurisdiction is usually where you live. For an organization, it is usually where the operating organization is established. Use a narrower governing law value, such as `Quebec, Canada`, only when that is the right legal context for the operator.

### Set the response window

In `npm run setup`, answer **Trust & Safety response window** with a realistic human review expectation, not a guaranteed service-level agreement.

Reasonable examples:

```text
5 business days
72 hours
as soon as practical
```

The generated pages localize the common built-in examples above. Other custom wording is reused verbatim in every generated language, so choose text that is acceptable on all localized Trust & Safety pages or replace the generated localized pages with custom copy.

Avoid promises you cannot reliably keep. The purpose is to set a human expectation and show that abuse reports have a real handling path.

### Revisit when public commitments change

Run `npm run setup` again when the published content changes in a meaningful way, such as:

- new analytics provider
- changed contact address
- changed jurisdiction or governing law
- material change to privacy, terms, trust, or security language

The installer reads existing values and offers them as defaults, so it is fine to use simple phase-1 answers and refine them during customization.

{{% /steps %}}
