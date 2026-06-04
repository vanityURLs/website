---
aside: false
type: brand
title: "Documentation contribution"
description: "How to contribute brand-site documentation, translations, and website guidance."
weight: 25
aliases:
  - /docs/web-site/contributing/
---

The main site has a short [Contribution Guide](https://vanityurls.link/en/contributing/) for code, documentation, bug reports, and community help. This page adds the brand-site expectations for documentation contributors.

## Where to contribute

| Work                    | Repository                                              |
| ----------------------- | ------------------------------------------------------- |
| Redirector code         | `github.com/vanityURLs/vanityURLs`                      |
| Main website docs       | `github.com/vanityURLs/website`, under `content/`       |
| Brand standards docs    | `github.com/vanityURLs/website`, under `brand-content/` |
| Website templates       | `github.com/vanityURLs/website`, under `layouts/`       |
| CSS and JavaScript      | `github.com/vanityURLs/website`, under `assets/`        |
| Stable public downloads | `github.com/vanityURLs/website`, under `static/`        |

## Brand documentation rules

- Keep pages practical and source-of-truth oriented.
- Base standards on existing implementation before inventing a new rule.
- Add English and French pages together when the section is bilingual.
- Use `brand-content/` for brand standards and `content/` for the main product site.
- Link back to the main site when a visitor needs product documentation, legal pages, trust pages, or community entry points.
- Use conventional commits so release-please can classify changes.

## Before opening a pull request

Run:

```bash
npm run build
npm test
npm run lint:md
npm run lint:spell
npm run lint:yaml
```

For larger documentation moves, also verify redirects, language switchers, and search indexing.

## Pull request expectations

- Keep each PR focused on one content change or one design-system change.
- Update screenshots or asset inventories when visual assets change.
- Include why the change is needed and which pages should be reviewed.
- Avoid copying external brand-system text. Use external systems as references, then write vanityURLs-specific guidance.

## Questions and large changes

Start in [GitHub Discussions](https://github.com/orgs/vanityURLs/discussions) before opening a large restructuring PR. Use issues for specific defects, broken links, inaccessible patterns, missing translations, or incorrect standards.
