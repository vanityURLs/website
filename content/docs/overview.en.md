---
aside: false
title: "Overview"
description: "What you need before setting up a vanityURLs redirector and how the first deployment path fits together."
nav_order: 1
---

vanityURLs is an open source solution for running your own branded short-link domain as code.

The setup path below is intentionally narrow: get a plain instance running on Cloudflare Workers first, then tinker the branding and configuration once the redirector is online.

The happy path is:

1. Choose a short domain
2. Put that domain on Cloudflare DNS
3. Create a GitHub repository with the vanityURLs code
4. Configure settings in your terminal
5. Let Cloudflare deploy the Worker
6. Test your first short links

## What you need

Before starting, make sure you have these pieces ready:

- **A registered short domain** that you will use only for redirects, such as `ex.am`. If you have not chosen one yet, read [Choosing a short domain for redirects](/blog/choosing-a-short-domain-for-redirects/)
- **A GitHub account** for the repository that stores your links and deployment history. The repository can be public, or private if you do not want to show all your short links. GitHub's guide to [creating an account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) is the best starting point if you are new to it
- **A Cloudflare account** for DNS and Workers services. You can use an existing account or create a new one; refer to [Cloudflare documentation](https://developers.cloudflare.com/fundamentals/account/create-account/) when creating an account
  - **Cloudflare authoritative DNS for the short domain**. vanityURLs expects Cloudflare to manage the DNS zone used by the Worker route or custom domain. Cloudflare's [full setup guide](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) explains how to add a domain and change nameservers at your registrar
  - **Cloudflare Access team domain**. The installer asks for it during the setup; find it in **Zero Trust** > **Settings** as the **Team domain**, such as `<team>.cloudflareaccess.com`
- **A local workstation** running Linux, macOS, or Windows with Git, Node.js 20 or newer, npm, `jq`, and your preferred text editor
- **A password manager** to store sensitive information such as the Cloudflare account IDs, API tokens, Worker secrets, analytics IDs, and recovery information
- **Optional analytics**. The supported solutions are [Fathom](https://usefathom.com/) and [Umami](https://umami.is/). You can enable it during the customization phase, such as phase 2. Read [Choosing privacy-friendly analytics for short links](/blog/choosing-privacy-friendly-analytics-for-short-links/) before creating an analytics account

[Quickstart](/docs/quickstart/) is about making the redirector work, so use simple answers; you will be able to refine them during [customization](/docs/customize-overview/).
