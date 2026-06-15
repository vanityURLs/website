---
aside: false
title: "Footer & pages"
description: "Understand the setup answers used to generate footer links, privacy, terms, Trust & Safety, security, and security.txt pages."
weight: 40
aliases:
  - /docs/footer-pages/
  - /docs/legal-trust-pages/
---

vanityURLs can publish footer links and public pages from the operator values stored in `custom/v8s-site-config.json`. These pages are part of the public posture of a short-link domain: they tell visitors, reporters, registrars, and security researchers who operates the redirector and how to reach the right contact.

Use this page to understand what files are generated, which links appear in the footer, and where to override pages when generated content is not enough. Use [Jurisdiction](/docs/customize/jurisdiction/) when you are deciding the operator, jurisdiction, governing law, and trust contacts.

{{% steps %}}

### Choose whether to defer legal pages

In `npm run setup`, answer **Configure privacy, terms, and security pages now?**. For the Quickstart, `N` is fine.

When you defer full legal pages:

- Trust & Safety still deploys so people can report abuse
- `/.well-known/security.txt` still deploys when the security contact is configured
- Privacy, terms, and the standalone security page are skipped until you configure them

Choose `Y` when you are ready to publish privacy, terms, and security language for the instance operator.

### Review generated outputs

In your instance repository, review the generated public files under `build/` after setup runs. Use `custom/public/` only when you intentionally maintain custom HTML or public assets.

| Output                      | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `/privacy`                  | Privacy notice for data handled by the redirector          |
| `/terms`                    | Terms for using the short-link domain                      |
| `/trust-safety`             | Abuse reporting and coordinated vulnerability disclosure   |
| `/security`                 | Security disclosure page when full legal pages are enabled |
| `/.well-known/security.txt` | Machine-readable vulnerability disclosure contact          |

If you later replace generated pages with custom HTML under `custom/public/`, keep the same contacts and public reporting paths accurate.

### Review footer links

In the generated or custom public pages, review the footer links for the current language. Default public pages include footer links to the policy pages that exist for that language.

When privacy and terms are configured, the footer is a natural place to add concise expectation text, for example:

```text
By continuing, you agree to the Terms and conditions, including the Privacy notice.
```

If vanityURLs adds this as generated behavior, the text should only render when both destinations exist. The words `Terms and conditions` and `Privacy notice` should link to the generated or custom pages for the current language.

### Override custom public pages

In your instance repository, replace generated pages only when you need fully custom HTML. Use these paths:

| Page           | Custom file                   |
| -------------- | ----------------------------- |
| Privacy        | `custom/public/privacy.html`  |
| Terms          | `custom/public/terms.html`    |
| Trust & Safety | `custom/public/abuse.html`    |
| Security       | `custom/public/security.html` |

English pages also have extension-free aliases such as `/privacy`, `/terms`, `/trust-safety`, and `/security`. Localized pages use the language directory, for example `custom/public/fr/privacy.html`.

Custom legal and trust pages follow the same custom HTML rules as other public overrides. Before adding inline JavaScript, inline CSS, forms, or a custom `custom/public/_headers` policy, review [Public and status pages](/docs/reference/public-pages/#custom-page-security/) for the sandboxed CSP profile and what custom pages can access.

{{% /steps %}}
