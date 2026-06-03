---
title: "Setup"
description: "What you need before setting up a vanityURLs redirector"
weight: 10
aliases:
  - /docs/overview/
aside: false
show_section_pages: false
---

Let's manage redirected short links with _your_ vanityURLs engine. An instance can be up and running in 10 minutes, once you have the prerequisites listed below.

[Quickstart](/docs/setup/quickstart/) focuses on that happy path:

1. Choose a short domain
2. Put that domain on Cloudflare DNS
3. Create a GitHub repository with the vanityURLs code
4. Configure settings in your terminal
5. Let Cloudflare deploy the Worker
6. Test your first short links

## What you need

Before starting, make sure you have these pieces ready:

{{% steps %}}

### Register a short domain

Use a domain that you will use only for redirects, such as `ex.am`. If you have not chosen one yet, read [Choosing a short domain for redirects](/blog/choosing-a-short-domain-for-redirects/).

### Prepare a GitHub account

Use GitHub for the repository that stores your links and deployment history. The repository can be public, or private if you do not want to show all your short links. GitHub's guide to [creating an account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) is the best starting point if you are new to it.

### Prepare Cloudflare

Use a Cloudflare account for DNS and Workers services. You can use an existing account or create a new one; refer to [Cloudflare documentation](https://developers.cloudflare.com/fundamentals/account/create-account/) when creating an account.

- **Cloudflare authoritative DNS for the short domain**. vanityURLs expects Cloudflare to manage the DNS zone used by the Worker route or custom domain. Cloudflare's [full setup guide](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) explains how to add a domain and change nameservers at your registrar
- **Cloudflare Access team domain**. The installer asks for it during the setup; find it in **Zero Trust** > **Settings** as the **Team domain**, such as `<team>.cloudflareaccess.com`. See [Access control](/docs/customize/access-control/) for the full Zero Trust setup

### Prepare a local workstation

Use Linux, macOS, or Windows with Git, Node.js 20 or newer, npm, jq, and your preferred text editor.

### Use a password manager

{{< callout type="warning" title="Keep operational secrets out of Git" >}}
Store sensitive information such as Cloudflare account IDs, API tokens, Worker secrets, analytics IDs, Access audiences, IdP client secrets, service tokens, OAuth client secrets, and recovery information. Do not commit those values, or screenshots that contain them, to the repository.
{{< /callout >}}

{{% /steps %}}
