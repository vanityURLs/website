---
title: "Cloudflare Pages"
description: "Cloudflare Pages configuration for vanityURLs — deploy hooks, branch previews, environment variables, and plan limits."
nav_order: 10
translationKey: "cloudflare-pages"
---

vanityURLs is designed to run on [Cloudflare Pages](https://pages.cloudflare.com/). The free plan covers everything most personal and small-team deployments need.

## Build configuration

When connecting your repository in the Cloudflare dashboard, use these settings:

| Setting | Value |
|---------|-------|
| Framework preset | *(leave empty)* |
| Build command | `cat static.lnk dynamic.lnk > build/_redirects` |
| Build output directory | `/build` |
| Root directory | `/` |

## Custom domain

1. In your Pages project, go to **Custom domains** → **Set up a custom domain**
2. Enter your vanity domain (e.g. `my-tiny.link`)
3. If your domain is on Cloudflare DNS, the required records are created automatically

{{< callout type="tip" >}}
If your domain is registered elsewhere, add a `CNAME` record pointing to your Pages project URL (`your-project.pages.dev`) and set its proxy status to **Proxied** (orange cloud).
{{< /callout >}}

## Deploy hooks

To trigger a rebuild without a git push — from a cron job, script, or external service — create a Deploy Hook:

1. Go to **Settings** → **Builds & deployments** → **Deploy hooks**
2. Create a hook and copy the URL
3. Trigger it with:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/YOUR_HOOK_ID"
```

This is useful for link lists that depend on external data refreshed on a schedule, or for publishing workflows that don't go through Git.

## Branch preview deployments

Every push to a non-`main` branch automatically gets its own preview URL:

```
https://BRANCH-NAME.YOUR-PROJECT.pages.dev
```

Use branch previews to test redirect changes before merging to `main`. The preview URL respects the full `_redirects` configuration, so you can test splat patterns and redirect chains end-to-end.

## Environment variables

If your build process needs secrets or configuration values, add them under **Settings** → **Environment variables**. They are available in the build shell but are never included in served files.

For vanityURLs, you typically don't need environment variables — the build command is a simple `cat`. This is a feature, not a limitation: there is nothing secret about a redirect table.

## Plan limits

| Resource | Free | Pro |
|----------|------|-----|
| Builds per month | 500 | 5,000 |
| Redirect rules (`_redirects`) | 2,000 | 100,000 |
| Custom domains | 1 | 10 |
| Bandwidth | Unlimited | Unlimited |
| Build timeout | 20 min | 20 min |

The 500 free builds per month is generous — each `git push` is one build, and a typical active deployment uses fewer than 30 per month.

## Cloudflare documentation

- [Cloudflare Pages: Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages: Custom domains](https://developers.cloudflare.com/pages/platform/custom-domains/)
- [Cloudflare Pages: Deploy hooks](https://developers.cloudflare.com/pages/platform/deploy-hooks/)
