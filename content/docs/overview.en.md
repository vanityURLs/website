---
title: "Overview"
description: "What you need before setting up a vanityURLs redirector and how the first deployment path fits together."
nav_order: 1
---

vanityURLs is a self-hosted short-link redirector for a domain you control. The setup path is intentionally narrow: get a plain instance running on Cloudflare Workers first, then come back for branding, analytics, policy pages, access control, and other customization once the redirector is online.

The happy path is:

1. Choose a short domain
2. Put that domain on Cloudflare DNS
3. Create a GitHub repository with the content of vanityURLs code
4. Configure the few required values in your terminal
5. Let Cloudflare deploy the Worker
6. Test your first short links

## What you need

Before starting, make sure you have these pieces ready:

- **A registered short domain** that you will use only for redirects, such as `ex.am` or another compact domain you control. If you have not chosen one yet, read [Choosing a short domain for redirects](/blog/choosing-a-short-domain-for-redirects/)
- **A GitHub account** for the repository that stores your links and deployment history. The repository can be public, or private if you do not want to share your short links. GitHub's guide to [creating an account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) is the best starting point if you are new to it
- **A Cloudflare account** for DNS and Workers. You can use an existing account or create a new one; refer to [Cloudflare documentation](https://developers.cloudflare.com/fundamentals/account/create-account/) when creating an account
  - **Cloudflare authoritative DNS for the short domain**. vanityURLs expects Cloudflare to manage the DNS zone used by the Worker route or custom domain. Cloudflare's [full setup guide](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) explains how to add a domain and change nameservers at your registrar
  - **Cloudflare Access team domain**. The installer asks for `CF_ACCESS_TEAM_DOMAIN`; find it in **Zero Trust** > **Settings** as the **Team domain**, such as `<team>.cloudflareaccess.com`
- **A local workstation** running Linux, macOS, or Windows with Git, Node.js 20 or newer, npm, `jq`, and your preferred text editor
- **A password manager** or other secure notes system for Cloudflare account IDs, API tokens, Worker secrets, analytics IDs, and recovery information
- **Optional analytics**. You only need [Fathom](https://usefathom.com/) or [Umami](https://umami.is/) if you want analytics during the customization phase. Read [Choosing privacy-friendly analytics for short links](/blog/choosing-privacy-friendly-analytics-for-short-links/) before creating an analytics account

Phase 1 is about making the redirector work. During phase 1, use simple answers; you will be able to refine them during customization in phase 2.

## Demo Instance

The Quickstart uses `v8s.link` as a demo instance. It is configured and documented as an inspiration point while you build and debug your own instance.

The values in the Quickstart are examples, not required values. Replace the short domain, GitHub account, repository name, Cloudflare team domain, and email addresses with the values for your own instance.

Detailed `v8s.link` configuration will live in the [v8s.link reference](/docs/demo/) section as the reference instance matures.
