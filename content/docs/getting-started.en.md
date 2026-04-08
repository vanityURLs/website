---
title: "Installation"
description: "Set up vanityURLs on your own domain in four steps using GitHub and Cloudflare Pages."
nav_order: 1
---

vanityURLs runs entirely on infrastructure you already control — a GitHub repository, a domain name, and a free Cloudflare account. There is nothing to install on your machine beyond the optional CLI helper script.

## Quick setup

{{% steps %}}

### Create a repository from the template

From the [vanityURLs GitHub repository](https://github.com/vanityURLs/vanityURLs), click **Use this template** → **Create a new repository**.

Choose a name that reflects your short domain (e.g. `my-tiny.link`). Select **Private** — your redirect list may contain internal URLs.

### Create your Cloudflare account

If you don't have one already, follow the [Cloudflare account creation guide](https://developers.cloudflare.com/fundamentals/setup/account/create-account/). The free plan is sufficient.

### Purchase your internet domain

Log into Cloudflare and register a short domain via **Domains** → **Register**. Type your desired name, search, and complete the purchase. Enable **Auto-renew** before leaving.

You can also transfer an existing domain to Cloudflare DNS.

### Create the Cloudflare Pages site

1. In the Cloudflare dashboard, click **Add a Pages site** and connect your GitHub repository.
2. Configure the build:

{{< code file="Cloudflare Pages build settings" >}}
Framework preset:      (leave empty)
Build command:         cat static.lnk dynamic.lnk > build/_redirects
Build output directory: /build
{{< /code >}}

3. Set up a [custom domain](https://developers.cloudflare.com/pages/platform/custom-domains/) for the Pages project pointing to your purchased domain.

{{< callout type="warning" >}}
The first build will fail — that's expected. You still need to generate `static.lnk`, `dynamic.lnk`, and `build/_headers` in the next step.
{{< /callout >}}

{{% /steps %}}

## Local configuration

{{% steps %}}

### Configure vanityURLs.conf

Edit `vanityURLs.conf` in your repository (or run `make config` if you prefer `vi`):

```bash
SCRIPT_DIR=/usr/local/bin       # path where the lnk script will be installed
REPO_DIR=~/repos/my-tiny.link   # path to your local clone of the repo
MY_DOMAIN=my-tiny.link          # your short domain
MY_PAGE=my-project.pages.dev    # your Cloudflare Pages project URL
```

### Run initial setup

```bash
make setup
```

This generates:
- `build/_headers` — security and cache headers based on your domain and Pages URL
- `static.lnk` — your static redirect list (initially redirects `/` to your main site)
- `dynamic.lnk` — your dynamic redirect list (initially empty)

### Add your first redirects

Edit `static.lnk` with your preferred text editor, or use the `lnk` script:

```bash
lnk add /github https://github.com/yourname
lnk add /linkedin https://linkedin.com/in/yourname
```

### Commit and push

```bash
git add -A && git commit -m "add initial redirects" && git push
```

Cloudflare detects the push and deploys in ~15 seconds. Your links are live.

{{% /steps %}}

## Verify

Open `https://your-domain/github` in a browser — you should be redirected to your GitHub profile.
