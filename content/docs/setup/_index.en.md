---
aside: false
title: "Setup"
description: "What you need before setting up a vanityURLs redirector and how the first deployment path fits together."
weight: 10
aliases:
  - /docs/overview/

---

The pages in this setup section are for operators who want to build and run their own vanityURLs instance from the code available in the [vanityURLs/code](https://github.com/vanityURLs/code) repository.

The objective is to get a plain instance running on Cloudflare Workers in about 20 minutes once you have the prerequisites listed below. Quickstart focuses on that happy path: get the redirector deployed first, then refine branding, legal pages, analytics, access control, and link inventory during customization.

That happy path is:

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
  - **Cloudflare Access team domain**. The installer asks for it during the setup; find it in **Zero Trust** > **Settings** as the **Team domain**, such as `<team>.cloudflareaccess.com`. See [Access control](/docs/customize/access-control/) for the full Zero Trust setup
- **A local workstation** running Linux, macOS, or Windows with Git, Node.js 20 or newer, npm, `jq`, and your preferred text editor
- **A password manager** to store sensitive information such as the Cloudflare account IDs, API tokens, Worker secrets, analytics IDs, and recovery information
- **Optional analytics**. The supported solutions are [Fathom](https://usefathom.com/) and [Umami](https://umami.is/). You can enable it during the customization phase, such as phase 2. Read [Choosing privacy-friendly analytics for short links](/blog/choosing-privacy-friendly-analytics-for-short-links/) before creating an analytics account

If you get stuck while setting up your instance, compare your work with the public demo instance in [vanityURLs/v8s.link](https://github.com/vanityURLs/v8s.link). Then continue through [Quickstart](/docs/setup/quickstart/) with simple answers; you can refine them during [customization](/docs/customize/).
