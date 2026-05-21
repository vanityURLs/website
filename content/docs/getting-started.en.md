---
title: "Quickstart"
description: "Launch a plain vanityURLs redirector on your own short domain in about 10 minutes, then customize it once the first deployment works."
nav_order: 1
---

vanityURLs is a self-hosted short-link redirector for a domain you control. This Quickstart is intentionally narrow: get a plain instance running on Cloudflare Workers first, then come back for branding, analytics, policy pages, access control, and other customization once the redirector is online.

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
- **A local workstation** running Linux, macOS, or Windows with Git, Node.js 20 or newer, npm, and your preferred text editor
- **A password manager** or other secure notes system for Cloudflare account IDs, API tokens, Worker secrets, analytics IDs, and recovery information
- **Optional analytics**. You only need [Fathom](https://usefathom.com/) or [Umami](https://umami.is/) if you want analytics during the customization phase. Read [Choosing privacy-friendly analytics for short links](/blog/choosing-privacy-friendly-analytics-for-short-links/) before creating an analytics account

Phase 1 is about making the redirector work. In phase 2, customize the branding, homepage, legal pages, status pages, analytics, and other public details.

## First deployment

{{% steps %}}

### Get a short domain

Choose a domain that is short enough to be useful in messages, slides, QR codes, and documentation. Add the domain to Cloudflare and follow Cloudflare's nameserver instructions at your registrar.

Wait until Cloudflare shows the domain as active before attaching the Worker. Keep DNS-only records for mail, ownership verification, DKIM, DMARC, and MTA-STS unless the service explicitly requires proxying.

### Create the GitHub repository

Create a repository from the vanityURLs template, then clone it locally.

```bash
git clone git@github.com:YOUR-ORG/YOUR-SHORT-DOMAIN.git
cd YOUR-SHORT-DOMAIN
npm install
```

Review `wrangler.toml` and set the Worker name, account details, route, and custom domain for your short domain. Keep `workers_dev = false` and `preview_urls = false` for a production instance unless you intentionally want public preview hostnames.

### Configure a plain instance

A plain instance uses upstream defaults with only the required local configuration:

```text
wrangler.toml
custom/v8s-links.txt
custom/v8s-policies.json
custom/v8s-site-config.json
```

Do not edit `defaults/` for your own instance. Defaults are the product baseline. Your deployable instance belongs in `custom/`, which overlays the defaults during the build.

Add your first links with the CLI or by editing `custom/v8s-links.txt`:

```bash
./scripts/lnk https://github.com/YOUR-ORG github --title GitHub --description "Organization profile" --tags source --owner team
./scripts/lnk https://docs.example.com docs --title Docs --description "Main documentation" --tags docs --owner team
```

The generated registry accepts only validated `http://` and `https://` targets. Use `permanent` for stable 301 redirects and `ephemeral` for temporary 302 redirects.

If you want the installer to generate branded pages, run:

```bash
npm run setup
```

The setup flow can copy `defaults/public/` into `custom/public/`, configure supported languages, and rewrite the default split-color wordmark into your own domain parts.

### Validate locally

```bash
npm run check
```

The check command copies Worker source from `scripts/workers/` into generated `src/`, copies static assets, overlays `custom/`, generates `build/v8s.json`, validates the registry, and checks policy files.

### Configure Cloudflare Workers

In Cloudflare, open **Workers & Pages**, create an application, continue with GitHub, and select your repository. Confirm that the project name matches the name in `wrangler.toml`.

Leave the Cloudflare build and deploy command fields to the repository configuration so `wrangler.toml` and the package scripts stay authoritative. Disable non-production branch builds unless you want every branch to deploy.

Attach the short domain as a Worker Custom Domain. The Worker should be the origin for the hostname; avoid keeping a legacy synthetic `AAAA 100::` record for the same hostname after the Custom Domain is active.

### Protect operational paths

Before publishing a public instance, protect the private paths with Cloudflare Access:

```text
/_stats
/_stats/*
/_tests
/_tests/*
```

In Zero Trust, configure at least one identity provider, such as one-time PIN, GitHub, Google, or Okta. Then create a self-hosted Access application for those paths and allow only maintainer emails or a maintained identity group.

Set the Access team domain as a Worker variable and the Access audience as a secret:

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

### Optional: configure Umami analytics

If you want server-side analytics, create a website in Umami for the public hostname, then add the website ID as a Worker secret:

```bash
npx wrangler secret put UMAMI_WEBSITE_ID --config wrangler.toml
```

For Umami Cloud, keep the endpoint variable in `wrangler.toml`:

```toml
[vars]
UMAMI_ENDPOINT = "https://cloud.umami.is/api/send"
```

No browser tracking script is required. The Worker sends redirect, pageview, miss, and expand events for traffic that reaches the Worker.

### Deploy

Push the repository to GitHub and let the Cloudflare Git integration deploy it, or deploy manually from the repository:

```bash
npx wrangler deploy --config wrangler.toml
```

### Test the instance

Open the home page, a known short link, `/expand/`, `/404.html`, `/expired.html`, `/disabled.html`, and `/maintenance.html`.

Then test `/_stats` and `/_tests` from a signed-out or private browser profile. You should see Cloudflare Access before the protected dashboard or test page.

If Umami is enabled, load a few public paths from a second browser profile and confirm that events appear in Umami. Traffic blocked by Cloudflare Access, WAF rules, AI Crawl Control, or rate limiting will not appear in Umami because it never reaches the Worker.

{{% /steps %}}

## After the plain instance works

Use [Custom overrides](/docs/custom-overrides/) to replace default branding, public assets, policy pages, status pages, and localized pages without editing `defaults/`. Use the Cloudflare guide when you need the longer dashboard checklist for DNS, Access, identity providers, security rules, and observability.

Use `npm run local-install` after the instance works if you want the local `v8s` shell helper, local `lnk` command wiring, and a configured workstation registry such as `~/.v8s.json`.
