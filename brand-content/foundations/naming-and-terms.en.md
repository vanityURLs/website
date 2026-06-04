---
title: "Naming and terms"
description: "How to name the project, domains, instances, product areas, and generated surfaces."
type: brand
weight: 30
---

Use consistent names so readers can tell the product, public site, brand site, and generated redirect surfaces apart.

## Project and domains

| Name                    | Use                                                      |
| ----------------------- | -------------------------------------------------------- |
| `vanityURLs`            | The project and product name                             |
| `vanityURLs.link`       | The public documentation and product domain              |
| `brand.vanityURLs.link` | The brand standards and design-system domain             |
| `v8s.link`              | Demo instance, badge examples, and compact-link examples |

Keep the lowercase `vanity` and uppercase `URLs` styling in prose. In URLs and hostnames, use the actual domain casing only when it helps recognition; DNS remains case-insensitive.

## Product terms

| Term           | Meaning                                                      |
| -------------- | ------------------------------------------------------------ |
| Redirect       | A short-link request that resolves to a configured target    |
| Alias          | The short path or keyword used to reach a target             |
| Instance       | A deployed redirector using vanityURLs defaults or overrides |
| Generated page | A page emitted by the redirector for expansion or fallback   |
| Badge          | A compact visual link that advertises or previews an alias   |
| Operator       | The person configuring, deploying, or auditing an instance   |

## Writing rules

- Prefer product terms over invented synonyms.
- Define a term the first time it appears on a beginner-facing page.
- Use code formatting for literal paths, hostnames, commands, environment variables, tokens, and file names.
- Keep legal or trademark claims factual and minimal until a formal policy exists.
