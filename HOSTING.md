# Hosting

This site is hosted on Cloudflare's Workers platform using **Workers Static Assets**, a single Worker serves a Hugo-generated static site, with a small JavaScript runtime that fires server-side analytics events for HTML page views. There is no separate static-host product (it isn't Cloudflare Pages); everything runs through one Worker.

The architecture matters because it explains why some operational details are different from a typical Hugo + Cloudflare Pages setup.

## Architecture overview

```
GitHub: vanityURLs/website  (main branch)
        │
        │  push to main
        ▼
Cloudflare's GitHub integration  ◄─── auto-deploys on push
        │
        │  runs build.sh → hugo build → pagefind index → wrangler deploy
        ▼
Worker: vanityurls-website
        │
        ├── Static Assets binding (./public from build)
        │   ├── HTML pages (Hugo output)
        │   ├── CSS, JS, fonts, images
        │   └── Pagefind search index
        │
        ├── Worker code (src/worker.mjs)
        │   ├── HTML requests: passes through assets, fires Umami event
        │   ├── 404 responses: tagged in Umami with name="404"
        │   ├── UTM URLs: promoted to Umami events with name="campaign"
        │   └── All asset requests: bypass Worker entirely (free)
        │
        └── Custom domain: vanityurls.link
```

The Worker is configured to fire **only on HTML requests** via the `run_worker_first` pattern in `wrangler.toml`. Static assets (CSS, fonts, JS bundles, Pagefind WASM, images, sitemaps) bypass the Worker entirely. This matters for two reasons: cost (Worker invocations are billed against your free-tier quota; asset fetches are free) and performance (asset requests don't pay the Worker's startup cost, ~0.5–1ms).

## Repository structure

The full layout is documented in `DEVELOPMENT.md`. The hosting-relevant parts:

| Path | Role |
|---|---|
| `wrangler.toml` | Worker configuration. Source of truth — Cloudflare dashboard build settings should be left empty. |
| `build.sh` | Build script run by Cloudflare. Pins Hugo, Node, Go, Dart Sass versions. |
| `src/worker.mjs` | The Worker code (analytics tracking). |
| `src/worker.test.mjs` | Test suite (25 tests, runs via `npm test`). |
| `public/` | Hugo build output. Served as static assets. Gitignored. |
| `static/_redirects` | URL redirects (e.g., `/` → `/en/`). Hugo copies this to `public/_redirects`. |
| `static/_headers` | HTTP response headers (CSP, security, caching). |

## Cloudflare account setup

If you're recreating this from scratch (or onboarding to an existing account), here's the canonical setup. Most of these steps happen once.

### 1. Create the Worker

Log into the Cloudflare dashboard → **Workers & Pages** → **Create application** → **Connect to Git**. Select the GitHub repository (`vanityURLs/website` in our case). Cloudflare will detect `wrangler.toml` and propose a default deploy command.

Set the build configuration to:

- **Build command:** *None* (the build is handled by `build.sh` which is invoked by `wrangler.toml`'s `[build] command`)
- **Deploy command:** `npx wrangler deploy`
- **Root directory:** `/`
- **Production branch:** `main`

### 2. Connect the custom domain

Workers & Pages → `vanityurls-website` → **Settings** → **Domains & Routes** → **+ Add** → **Custom domain** → enter `vanityurls.link`. Cloudflare provisions a TLS certificate automatically. The `workers.dev` and `*.workers.dev` preview URLs can be left **Inactive** to keep the bare custom domain as the only public surface.

### 3. Configure secrets **IMPORTANT**

Cloudflare's dashboard exposes "Variables and Secrets" in two places that look identical but have different scopes:

| Path | Scope | Where the Worker sees them |
|---|---|---|
| Settings → **Variables and Secrets** | Runtime | `env.UMAMI_*` ← **use this one** |
| Settings → **Build** → Variables and secrets | Build-time only | NOT in `env` at runtime |

The Worker reads `env.UMAMI_WEBSITE_ID` and `env.UMAMI_ENDPOINT` at runtime. If they're configured in the Build section, the Worker silently sees them as `undefined` and skips analytics — no error, no warning, just zero data in Umami.

**Correct setup:** Settings → Variables and Secrets → **+ Add** with `Type: Secret` (encrypted, locked icon) for both:

- `UMAMI_WEBSITE_ID` — UUID from Umami → Settings → Websites → click site → ID field
- `UMAMI_ENDPOINT` — full POST URL, typically `https://cloud.umami.is/api/send` for Umami Cloud, or your self-hosted instance's `/api/send` endpoint

The Worker auto-restarts whenever Variables and Secrets are added/changed. No deploy needed for secret changes.

### 4. Enable observability (logs)

>It's already defined in the `wrangler.toml`

Settings → **Observability** → **Workers Logs** → **Enable**. This is required for the `[diag]` debugging mode (see `ANALYTICS.md`) and generally useful for any future debugging. Workers Traces can stay disabled — it's a separate, more expensive feature.

### 5. Verify

After deploy, hit the live URL and check the Cloudflare dashboard's **Observability** tab. You should see one log event per request, with origin `fetch` and trigger `GET /...`. Wall time will be `~10–20ms` for a normal HTML page (Worker runs in parallel with the `ctx.waitUntil` analytics fetch — the visitor's response isn't blocked on Umami).

## Deploy flow

Day-to-day deploy is automatic:

```bash
git add .
git commit -m "doc: updated XYZ page"
git push origin main
```

Cloudflare's GitHub integration picks up the push, runs `build.sh` (installs Hugo + tools, builds the site, builds the Pagefind search index), and runs `npx wrangler deploy`. Total time end-to-end is typically 60–90 seconds.

You can watch the build live: Cloudflare dashboard → Workers & Pages → `vanityurls-website` → **Deployments**. Failed builds show their full log; usually it's a Hugo template error or a missing dependency.

### Manual deploy from your laptop

If you need to deploy without going through git (e.g., the GitHub integration is broken, or you want to test a local change without committing):

```bash
# One-time setup
npm install
npx wrangler login   # opens browser, authenticates against Cloudflare account

# Build and deploy
npm run build         # runs hugo + pagefind, outputs to ./public/
npx wrangler deploy   # uploads to Cloudflare
```

Manual deploy uses the same `wrangler.toml`, so it goes to the same custom domain and uses the same secrets. Cloudflare's deployment list will mark this as "Manually deployed" rather than showing a git commit.

### Rolling back

Cloudflare keeps the last ~10 deployments. To roll back: dashboard → `vanityurls-website` → **Deployments** → click the previous deployment → **Rollback to this deployment**. Takes a few seconds. You'll want to also revert the matching git commit (or `git revert <sha>`) so the next push doesn't reapply the bad version.

## SEO basics

The site emits everything search engines need without per-page configuration:

- **`<html lang>`** — set per-language (`en-CA`, `fr-CA`) from `hugo.yml` `languageCode`
- **`<meta charset>`, viewport** — emitted by `layouts/partials/head.html`
- **Open Graph / Twitter Card meta** — page-specific, with fallback to site description
- **JSON-LD structured data** — site/article schemas from `layouts/partials/structured-data.html`
- **Canonical URLs** — `<link rel="canonical">` per page
- **Hreflang** — bilingual pairs (`/en/foo/` ↔ `/fr/foo/`) declared in head
- **`sitemap.xml`** — auto-generated by Hugo per language
- **`robots.txt`** — generated by Hugo (`enableRobotsTXT: true` in `hugo.yml`)
- **OG image** — `/social.png`, 1200×630, served from `static/`
- **`humans.txt`** — courtesy file in `static/`

What you don't need to do:
- Submit to Google Search Console manually (the sitemap link in robots.txt handles discovery)
- Add per-page meta tags (head.html builds them from frontmatter)
- Worry about JS-blocking — Hugo emits server-rendered HTML

What you might want to do:
- Periodically check **Google Search Console** for crawl errors, indexing status, and Core Web Vitals
- Verify ownership for **Bing Webmaster Tools** if Bing traffic matters to you
- Run **PageSpeed Insights** quarterly (`https://pagespeed.web.dev/?url=https://vanityurls.link/en/`)
- Audit **Lighthouse Accessibility** quarterly — current target is 100/100 (see `content/Accessibility.en.md`)

## DNS and TLS

Cloudflare manages everything. The custom domain is added as a Workers Custom Domain, which:

- Provisions a TLS certificate via Let's Encrypt
- Sets the necessary DNS records (CNAME flattening at the apex)
- Renews the cert automatically

The domain (`vanityurls.link`) is registered with [Porkbun](https://porkbun.com/). The only requirement for this setup is to point the nameservers at Cloudflare. 

SSL/TLS Edge certificate use a shared Cloudflare universal SSL certificate and a corresponding backup certificate in the dashboard (Domains → SSL/TLS → Edge Certificates). Always Use HTTPS is enabled, minimum TLS version is TLS 1.3, opportunistic encryption is enabled, TLS 1.3 is enabled, and automatic HTTPS rewrites is enabled.

Control AI crawlers are defined as "Do not block (allow crawlers)" and Manage your robots.txt as "Content Signals Policy" in the dashboard (Domains → Overview).

## Cost

> If you exceed the free tier (>100k req/day), Workers Paid is $5/month for 10M requests. Static asset traffic stays free.

The site fits within Cloudflare's free tier:

- **Workers**: 100,000 requests/day free. Current usage is ~3–10k requests/day → ~95%+ headroom.
- **Static Assets**: free (no per-request charge)
- **Custom domain + TLS**: free
- **Bandwidth**: free at this scale
- **Logs**: free for the dashboard's Observability tab; paid only if you forward to external analytics

## Operational notes

- **`wrangler.toml` is the source of truth.** Don't set anything in the Cloudflare dashboard that isn't also in `wrangler.toml`, with the exception of secrets (which can't be in version control). If both are set, `wrangler.toml` wins on each deploy and the dashboard value is silently overwritten.
- **The Build → Variables and secrets section should be empty** for this project. Build-time variables aren't needed; the build just runs Hugo.
- **`compatibility_date` in `wrangler.toml`** pins the Workers runtime to a specific date. Update it deliberately — it changes runtime API behavior. Don't leave it to grow stale beyond ~12 months without testing.
- **Hugo version is pinned in `build.sh`** (currently `0.160.1`). Update it deliberately — Hugo template syntax changes between versions (we hit a breaking change between 0.123 and 0.146 around taxonomy templates, see `CHANGELOG.md`).
