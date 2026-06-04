---
aside: false
type: brand
title: "Web site"
description: "Contributor documentation for maintaining the vanityURLs Hugo web site."
weight: 60
show_section_pages: false
aliases:
  - /docs/web-site/
  - /docs/website/
---

Use this section when you are contributing to the [vanityURLs/website](https://github.com/vanityURLs/website) repository rather than configuring a redirector instance.

The web site is a Hugo documentation site deployed through Workers Static Assets with Cloudflare Workers. Contributors usually work in three areas:

| Area                                                                                  | Start here                                      |
| ------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Local setup, build tools, tests, and common failures                                  | [Local development](./local-development/)       |
| Writing docs, translations, shortcodes, and UI strings                                | [Content authoring](./content-authoring/)       |
| Workers Static Assets with Cloudflare Workers hosting, custom domain, and deploy flow | [Hosting and deployment](./hosting-deployment/) |
| Server-side Umami analytics and troubleshooting                                       | [Website analytics](./analytics/)               |
| Release notes, versioning, and release-please expectations                            | [Releases](./releases/)                         |

The redirector application lives in the [vanityURLs/code](https://github.com/vanityURLs/code) repository. Use the main [Setup](/docs/setup/), [Customize](/docs/customize/), and [Reference](/docs/reference/) sections when you are operating a vanityURLs instance.
