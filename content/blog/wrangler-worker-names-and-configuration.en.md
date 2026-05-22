---
title: "Wrangler without shooting yourself in the foot"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "How to keep wrangler.toml boring, align Worker names with GitHub and local directories, and avoid painful Cloudflare Worker rebuilds"
tags: ["cloudflare", "wrangler", "configuration"]
featured: false
---

Wrangler is Cloudflare's command-line tool for Workers. `wrangler.toml` is the configuration file that tells Cloudflare what Worker you are deploying, where the Worker code lives, which static assets are published, and which runtime values are part of the deployment.

That sounds like a place to design a beautiful platform abstraction. Resist the urge. For a vanityURLs instance, `wrangler.toml` should be boring enough that your future self can open it in six months and immediately understand what is deployed.

## The Worker name is not just decoration

The `name` field in `wrangler.toml` identifies the Worker in Cloudflare. With Git-connected Workers Builds, Cloudflare expects the Worker name in the dashboard to match the `name` in the Wrangler configuration file. Cloudflare documents this in [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) and in the [build troubleshooting guide](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/).

The console does not currently let you rename an existing Worker after it is created. If you created the Worker with the wrong name and need the dashboard Worker name to match `wrangler.toml`, the practical path is:

1. Confirm the correct Worker name in `wrangler.toml`
2. Remove the route or custom domain from the old Worker
3. Delete the old Worker to free the route or custom domain
4. Create or connect a new Worker with the correct name
5. Reattach the route or custom domain
6. Push a small change and confirm the build deploys to the new Worker

Do not delete the old Worker until you know which route or custom domain it owns. The painful part is rarely the Worker script itself; it is losing track of what hostname was attached to which dashboard object.

## Pick one name and reuse it

Lowercase letters, numbers, and hyphens work best for Worker names. For a single vanityURLs instance, a simple naming habit saves real time:

```text
local directory: v8s-link
GitHub repository: v8s-link
Cloudflare Worker name: v8s-link
```

The names do not technically have to match, but matching names help when you are tired, debugging a failed deployment, or reading an old note in your password manager.

Avoid clever names like `redirector-prod-final-v2`. They feel precise when you create them and become fog later. A short domain turned into a filesystem-safe name is usually enough:

```text
v8s.link -> v8s-link
dicai.re -> dicai-re
go.example.com -> go-example-com
```

## Keep wrangler.toml close to the deployment boundary

`wrangler.toml` should describe Cloudflare deployment behavior, not every business decision about your redirector. In vanityURLs, most instance-specific content belongs in `custom/`, especially:

- `custom/v8s-links.txt` for human-authored short links
- `custom/v8s-site-config.json` for branding, languages, operator contacts, and legal-page choices
- `custom/v8s-policies.json` for source policy rules
- `custom/public/` for public page overrides

Keep `wrangler.toml` focused on the Cloudflare side:

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-22"

[assets]
directory = "./build"
binding = "ASSETS"
```

If you are tempted to add a second environment, a second route strategy, several branch-specific names, and a matrix of build behaviors before the first redirect works, pause. Phase 1 only needs one Worker, one repository, one short domain, and one successful deployment.

## Secrets do not belong in wrangler.toml

It is fine for `wrangler.toml` to contain non-secret values required by the Worker. It is not a password manager.

Store secrets with Wrangler or in the Cloudflare dashboard, then keep the values in your password manager:

```sh
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

This matters because your vanityURLs repository may be public, and even a private repository is still a poor place for API tokens, Access audience tags, analytics secrets, or recovery information.

## Do not over-engineer the first deployment

The first deployment should answer one question: can Cloudflare build and serve your redirector on the short domain?

For that first pass, prefer:

- One `main` branch
- One Worker name
- One Cloudflare account
- One short domain
- One plain `wrangler.toml`
- One small set of starter links

Once that works, customization can be deliberate. Add analytics, legal-page refinements, localized content, stronger Access policies, and lifecycle workflows after the redirector is online.

The boring setup is not a lack of ambition. It is how you keep the operational surface small enough to understand when something breaks.
