---
aside: false
title: "Hosting and deployment"
description: "How vanityURLs.link is hosted, deployed, and operated on Cloudflare Workers."
weight: 30
---

The documentation site runs on Cloudflare Workers with Workers Static Assets. It is not a Cloudflare Pages project. One Worker serves the Hugo-generated static site and handles server-side analytics for HTML page views.

## Architecture

```text
GitHub: vanityURLs/website (main)
  -> Cloudflare GitHub integration
  -> build.sh
  -> Hugo build and Pagefind index
  -> wrangler deploy
  -> Worker: vanityurls-website
  -> Static Assets binding: ./public
  -> Custom domain: vanityurls.link
```

The Worker is configured so static assets bypass Worker code where possible. HTML requests pass through `src/worker.mjs`; CSS, fonts, JavaScript bundles, images, Pagefind files, and sitemaps should remain cheap static asset traffic.

## Hosting-relevant files

| File | Role |
| ---- | ---- |
| `wrangler.toml` | Worker, assets, build command, observability, compatibility date, and deploy configuration |
| `build.sh` | Cloudflare build script that pins and verifies build tools before running Hugo and Pagefind |
| `src/worker.mjs` | Runtime Worker code for HTML requests and analytics dispatch |
| `src/worker.test.mjs` | Worker test suite |
| `public/` | Hugo build output served as static assets; regenerated and not committed |
| `static/_headers` | Response headers copied into the generated site |
| `static/_redirects` | Redirect rules copied into the generated site |

{{< callout type="warning" title="wrangler.toml is the source of truth" >}}
Do not duplicate build or deploy settings in the Cloudflare dashboard unless the setting cannot live in Git, such as encrypted secrets.
{{< /callout >}}

## Cloudflare setup

To recreate the production project:

1. Open **Workers & Pages** > **Create application**
2. Choose **Connect to Git**
3. Select `vanityURLs/website`
4. Confirm the project name matches `wrangler.toml`
5. Leave build settings controlled by the repository
6. Deselect builds for non-production branches unless you intentionally want every branch deployed
7. Add the custom domain for the public site

Runtime variables and secrets belong in **Settings** > **Variables and Secrets**, not in **Settings** > **Build** > **Variables and secrets**.

| Value | Where |
| ----- | ----- |
| `UMAMI_WEBSITE_ID` | Runtime secret in Cloudflare |
| `UMAMI_ENDPOINT` | Plain `[vars]` value in `wrangler.toml` |

## Deploy flow

Day-to-day deployment is automatic:

```bash
git push origin main
```

Cloudflare picks up the push, runs the repository build, then deploys with Wrangler. Watch deployments in **Workers & Pages** > `vanityurls-website` > **Deployments**.

## Manual deploy

Use this only when the GitHub integration is unavailable or you intentionally need to test a local deployment:

```bash
npm install
npm run build
npx wrangler login
npx wrangler deploy
```

Manual deploys use the same `wrangler.toml` and runtime secrets. Cloudflare marks them as manually deployed instead of Git-backed.

## Rollback

Cloudflare keeps recent deployments. To roll back, open the previous deployment and choose **Rollback to this deployment**. Then revert or fix the matching Git commit so the next push does not redeploy the bad state.

## DNS, TLS, and canonical host

The public web site uses a Workers custom domain. Cloudflare provisions and renews TLS certificates automatically.

The canonical host is controlled by the Worker/domain setup and the site configuration. When changing hostnames, update the Cloudflare custom domain, `hugo.yml`, `wrangler.toml`, redirects, canonical links, analytics settings, and any public status or monitor configuration together.

## Operational notes

- Keep **Workers Logs** enabled for production debugging.
- Update `compatibility_date` deliberately and test Worker behavior.
- Update the Hugo version in `build.sh` deliberately and rebuild locally before deployment.
- Keep Build-time variables empty unless a future build step explicitly needs them.
- Use the deployment log first when a build fails; most failures are Hugo template errors, missing tools, or stale content references.
