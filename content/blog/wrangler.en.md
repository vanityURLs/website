---
title: "Wrangler Without Shooting Yourself in the Foot"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "How to keep wrangler.toml boring, align Worker names with GitHub and local directories, and avoid painful Cloudflare Worker rebuilds"
tags: ["cloudflare", "wrangler", "configuration"]
featured: false
---
[Wrangler](https://developers.cloudflare.com/workers/wrangler/) is Cloudflare's command-line tool for Workers. `wrangler.toml` is the configuration file that tells Cloudflare exactly what Worker you are deploying, where your code lives, which static assets to publish, and which runtime values are part of the deployment.

It might be tempting to use this file to build a beautiful platform abstraction layer. **Resist that urge.** For a vanityURLs instance, `wrangler.toml` should be boring enough that your future self can open it in six months and immediately understand exactly what is deployed.

## The Worker Name is Not Just Decoration

The `name` field in `wrangler.toml` explicitly identifies the Worker inside Cloudflare. When using Git-connected Workers Builds, Cloudflare expects the Worker name in the dashboard to precisely match the `name` defined in your configuration file. Cloudflare highlights this requirement in its [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) documentation and [build troubleshooting guide](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/).

Because the Cloudflare dashboard doesn't currently allow you to rename an existing Worker after it's created, changing a mismatch requires a deliberate teardown. If you need the dashboard to match `wrangler.toml`, the safest path forward is:

1. **Verify** the correct Worker name in your `wrangler.toml`.
2. **Remove** the route or custom domain from the old Worker.
3. **Delete** the old Worker to completely free up that route or custom domain.
4. **Create or connect** a new Worker using the correct name.
5. **Reattach** your route or custom domain.
6. **Push** a small change to Git to confirm the build successfully deploys to the new Worker.

> ⚠️ **Important:** Never delete an old Worker until you are 100% sure which routes or custom domains it owns. The painful part of this process isn't redeploying the script itself—it's losing track of which hostname was attached to which dashboard object.
> 
> *Of course, you could just rename the Worker inside `wrangler.toml` to match the dashboard, but where is the fun in that?*

## Pick One Name and Reuse It

Stick to lowercase letters, numbers, and hyphens for Worker names. For a single vanityURLs instance, establishing a consistent naming habit early on saves an immense amount of time down the road:

```text
Local directory:        v8s-link
GitHub repository:      v8s-link
Cloudflare Worker name: v8s-link
```

While these names don't technically *have* to match, matching them will save your sanity when you are exhausted, debugging a failed CI/CD deployment, or cross-referencing an old note in your password manager.

Avoid overly clever or temporary names like `redirector-prod-final-v2`. They feel precise the moment you create them, but quickly devolve into mental fog later. Instead, turning your short domain into a filesystem-safe string is usually the cleanest approach:

* `v8s.link` $\rightarrow$ `v8s-link`
* `dicai.re` $\rightarrow$ `dicai-re`
* `go.example.com` $\rightarrow$ `go-example-com`

## Keep wrangler.toml Close to the Deployment Boundary

Your `wrangler.toml` should describe Cloudflare's deployment behavior—not every granular business decision behind your redirector.

Keep the configuration lean and tightly focused on the infrastructure:

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-22"

[assets]
directory = "./build"
binding = "ASSETS"
```
If you find yourself tempted to engineer multiple environments, complex routing strategies, branch-specific names, and a dense matrix of build behaviors before a single redirect even works: **pause.** Phase 1 only requires one Worker, one repository, one short domain, and one successful deployment.

## Secrets Do Not Belong in wrangler.toml

It is perfectly fine to keep non-sensitive configuration values required by your Worker inside `wrangler.toml`. However, remember that it is not a password manager.

Always store true secrets securely using Wrangler CLI or via the Cloudflare dashboard, and keep the master copies in your password manager:

```sh
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

This is vital because your vanityURLs repository might be public. Even if it's currently private, a git repository is a poor place to store API tokens, Access audience tags, analytics secrets, or recovery keys.

## Do Not Over-Engineer the First Deployment

The primary goal of your first deployment is to answer a single question: *Can Cloudflare build and serve your redirector on the short domain?*

For that initial pass, lean heavily into simplicity:

* **One** main branch
* **One** Worker name
* **One** Cloudflare account
* **One** short domain
* **One** plain, boring `wrangler.toml`
* **One** small set of starter links

Once that baseline successfully handles traffic, you can customize deliberately. Layer on your analytics, legal-page refinements, localized content, strict Cloudflare Access policies, and advanced lifecycle workflows *after* the core redirector is safely online.

A boring setup isn't a lack of ambition. It's how you keep your operational surface small enough to actually troubleshoot when something goes wrong.
