---
title: "Try Demo"
description: "v8s.link is the live reference implementation of vanityURLs — explore every configuration file to debug your own setup."
nav_order: 30
---

The best way to understand how vanityURLs works is to look at a real, running deployment. **[v8s.link](https://github.com/vanityURLs/v8s.link)** is the official reference implementation, maintained by the vanityURLs team and deployed at [v8s.link](https://v8s.link).

{{< callout type="note" title="Purposefully open" >}}
The v8s.link repository is public so you can compare it against your own setup when something isn't working. Every file is annotated here with explanations.
{{< /callout >}}

## What v8s.link demonstrates

{{< cards cols="2" >}}
{{< card title="Real vanityURLs.conf" icon="cog" href="/docs/demo/configuration/" >}}
See exactly what a production configuration file looks like, with every variable explained.
{{< /card >}}
{{< card title="Both link file types" icon="docs" href="/docs/demo/links/" >}}
Real static.lnk and dynamic.lnk in production, including a working splat redirect.
{{< /card >}}
{{< card title="DNS configuration" icon="globe" href="/docs/demo/dns/" >}}
The full DNS setup for v8s.link and vanityurls.link, with every record explained.
{{< /card >}}
{{< card title="Repository structure" icon="database" href="/docs/demo/repository/" >}}
Every file and folder in the repo, what it does, and what you need to keep or change.
{{< /card >}}
{{< /cards >}}

## Try a live redirect

These links at v8s.link are live now — click them to see redirects in action:

| Short URL | Destination | Type |
|-----------|-------------|------|
| [v8s.link/git](https://v8s.link/git) | github.com/vanityURLs/v8s.link | static, 301 |
| [v8s.link/github](https://v8s.link/github) | github.com/vanityURLs/ | static, 301 |
| [v8s.link/linkedin](https://v8s.link/linkedin) | linkedin.com/in/bhdicaire/ | static, 301 |
| [v8s.link/github/vanityURLs](https://v8s.link/github/vanityURLs) | github.com/vanityURLs/vanityURLs | splat, 302 |
| [v8s.link/blog](https://v8s.link/blog) | vanityURLs.link/en/blog | static, 301 |

The splat example is the most interesting — `v8s.link/github/ANYTHING` forwards to `github.com/vanityURLs/ANYTHING`. This pattern is defined once in `dynamic.lnk`.


## What v8s.link proves

The v8s.link deployment is evidence that the architecture works:

1. **Zero latency** — Cloudflare edge nodes process redirects before any origin request is made
2. **Zero cost** — runs entirely on the Cloudflare free tier
3. **Zero maintenance** — no server to patch, no runtime to update, no dependencies to audit
4. **Full control** — the complete redirect table is a plain text file in a public git repository
5. **Auditable** — every change, every link, every decision has a git commit and timestamp

The entire "service" is a `_redirects` file and a domain. There is no application, no database, and no binary you cannot inspect.

## What's current and what's outdated

The v8s.link repository is a working proof of concept, but not everything in it represents the ideal final state. This table helps you know what to adopt and what to improve:

| File / feature | Status | Notes |
|----------------|--------|-------|
| `vanityURLs.conf` | ✅ Good reference | All variables documented; update `REPO_DIR` to your path |
| `static.lnk` — core links | ✅ Good reference | `/git`, `/github`, `/blog`, `/linkedin` are clean patterns |
| `static.lnk` — `/ALM`, `/VVa`, `/HHU` | ⚠️ Outdated | Short test entries, not meaningful for new users |
| `dynamic.lnk` — splat redirect | ✅ Great example | The `/github/*` pattern is the best use of dynamic.lnk |
| `build/_headers` | ✅ Correct | Minimal but correct security headers |
| `Makefile` | ✅ Good reference | Shows `make setup` workflow clearly |
| `scripts/lnk` | ✅ Current | See [Commands](/docs/commands/) for full reference |
| `scripts/validateURL` | ⚠️ Undocumented | See the [validateURL reference](/docs/commands/validate/) |
| `README.md` | ⚠️ Minimal | Needs updating to reflect current docs |
| GitHub Actions (`.github/`) | ⚠️ Check workflow | Confirm the build command matches your setup |

## What new users need to add

After cloning the template and running `make setup`, the initial `static.lnk` contains placeholder links pointing to `bhdicaire.com`. Here's a checklist of what to update for your own deployment:

{{< details title="New user setup checklist" open="true" >}}
- [ ] Edit `vanityURLs.conf` — set `REPO_DIR`, `MY_DOMAIN`, `MY_PAGE`, `SHORTCODE_LENGTH`
- [ ] Replace `static.lnk` root redirect: `/ → https://YOUR-MAIN-SITE.com`
- [ ] Update social links: `/linkedin`, `/github`, `/x` to your profiles
- [ ] Remove placeholder entries: `/blog https://blog.example/`, `/mail`, `/slack`
- [ ] Clear `dynamic.lnk` splat (it points to `bhdicaire`): update to your GitHub org
- [ ] Verify DNS: CNAME/ALIAS pointing to your `YOUR-PROJECT.pages.dev`
- [ ] Confirm `build/_headers` uses your actual domain and Pages URL
- [ ] Push and check Cloudflare Pages build succeeds
- [ ] Run `lnk validate --live` to confirm all destinations are reachable
{{< /details >}}
