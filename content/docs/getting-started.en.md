---
title: "Quickstart"
description: "Create a v8s.link-style vanityURLs instance on Cloudflare Workers using the current defaults directory."
nav_order: 1
---

vanityURLs is a Git-managed short-link engine for your own domain. The current runtime deploys as a Cloudflare Worker with static assets. The build starts from `defaults/`, overlays your `custom/` files, generates `build/v8s.json`, and publishes the Worker with Wrangler.

## What you need

- A GitHub repository based on `vanityURLs/vanityURLs`
- A short domain, such as the public reference domain `v8s.link`
- A Cloudflare account with the domain in Cloudflare DNS
- Wrangler connected to the Cloudflare account that owns the Worker

## First deployment

{{% steps %}}

### Clone the repository

Create a repository from the vanityURLs template, then clone it locally.

```bash
git clone git@github.com:YOUR-ORG/YOUR-SHORT-DOMAIN.git
cd YOUR-SHORT-DOMAIN
npm install
```

### Keep local changes in custom/

Do not edit `defaults/` for your own branding or link list unless you are changing the upstream product defaults. Instance-owned files belong in `custom/`.

```text
custom/v8s-links.txt
custom/v8s-schedules.json
custom/v8s-blocklist.json
custom/public/v8s-logo.svg
custom/public/favicon.svg
```

### Add your first links

Create `custom/v8s-links.txt` with pipe-delimited rows:

```text
# slug|target|state|title|description|tags|owner|expires_at|notes
github|https://github.com/YOUR-ORG|permanent|GitHub|Organization profile|source|team||
docs|https://docs.example.com|permanent|Docs|Main documentation|docs|team||
```

Missing schemes are normalized to `https://`. Use `permanent` for stable 301 redirects and `ephemeral` for temporary 302 redirects.

### Build and validate

```bash
npm run check
```

The check command builds the Worker source, copies static assets, merges defaults and custom files, generates `build/v8s.json`, validates the registry, and checks policy files.

### Optional terminal helper

The repository includes a Zsh helper at `scripts/v8s.zsh` for opening redirect targets from your terminal. Source it from your shell profile:

```zsh
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.zsh
```

The helper reads `~/.v8s.json`, which `npm run build` creates from the generated registry. Override the path if you keep the registry somewhere else:

```zsh
export V8S_REGISTRY=/path/to/v8s.json
```

Useful commands:

```zsh
v8s --list          # list active slugs
v8s docs            # open the target for docs
v8s --print docs    # print the target without opening it
v8s --path          # show the registry path
```

`v8s.zsh` does not open arbitrary terminal input. It only opens `http://` and `https://` targets that already exist as `permanent` or `ephemeral` links in the generated registry.

### Deploy with Cloudflare Workers

Review `wrangler.toml`, set the Worker name, then deploy:

```bash
npx wrangler deploy
```

Connect your custom domain to the Worker route in Cloudflare. Every future push to GitHub can trigger the same build and deploy through your CI or Cloudflare integration.

{{% /steps %}}

## Verify

Open your home page, a known short link, `/expand/`, `/404.html`, `/expired.html`, `/disabled.html`, and `/maintenance.html`. If you configured protected views, open `/_stats` in a private browser and confirm Cloudflare Access appears before the dashboard.
