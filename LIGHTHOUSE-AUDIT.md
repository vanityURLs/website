# Lighthouse Audit Plan

A run-it-yourself guide for measuring performance, accessibility, best practices, and SEO on vanityurls.link after the round 19 changes (Mermaid self-hosted, CSP tightened, UTM capture in Worker).

## Pages to test

Pick a representative cross-section. Don't bother running every URL — these five capture the meaningful variation:

| URL | Why it matters |
|---|---|
| `https://vanityurls.link/en/` | Homepage. Most-visited. Touches Tailwind, fonts, theme toggle. |
| `https://vanityurls.link/en/docs/getting-started/` | Typical docs page. Code blocks (light + dark chroma), nav sidebar, prose. |
| `https://vanityurls.link/en/blog/introducing-v8s/` | Long-form blog post. Cover image, longer DOM. |
| `https://vanityurls.link/fr/docs/cloudflare/` | French localized. Real user traffic per the round 13–14 dashboard. Catches anything that's only broken on FR pages. |
| `https://vanityurls.link/en/showcase/` | Loads `showcase-colors.css`. Card layout. After round 18, this CSS no longer loads on the home page. |

## How to run

Three options, in order of recommended:

### 1. PageSpeed Insights (no setup, runs from Google's infrastructure)

Open <https://pagespeed.web.dev/>, paste each URL, click Analyze. You get separate Mobile and Desktop scores. Mobile is the more demanding test — focus there.

PSI results are public-shareable URLs, so you can save the report links into the round 19 commit notes for future comparison.

### 2. Chrome DevTools Lighthouse tab

Open the page, F12, Lighthouse panel, click Analyze. Tests YOUR network (so DSL/cellular conditions affect results). Useful for replicating reported issues but not for absolute scoring.

### 3. CLI (most reproducible)

```bash
npm install -g lighthouse
lighthouse https://vanityurls.link/en/ \
  --output html --output-path ~/Desktop/vanity-en-home.html \
  --preset desktop \
  --chrome-flags="--headless"
```

Use `--preset desktop` for the easier scoring scale, drop it for the default mobile scale.

## What to look for

### Performance (the four Web Vitals)

| Metric | Good | Concern threshold |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | > 4.0s |
| **CLS** (Cumulative Layout Shift) | < 0.1 | > 0.25 |
| **INP** (Interaction to Next Paint) | < 200ms | > 500ms |
| **TBT** (Total Blocking Time) | < 200ms | > 600ms |

Specific risks given recent changes:

- **Worker latency (round 13).** Every HTML request now hops through `src/worker.mjs` before the asset handler responds. The Worker fetches the asset and returns it unchanged — adds a few ms of edge runtime. Analytics is `ctx.waitUntil()` so it doesn't block. Should be invisible in Lighthouse. If you see degraded TTFB on HTML pages vs. assets, this is where to look first.
- **Self-hosted fonts (round 6).** Four `.woff2` files preloaded via `<link rel=preload>` in head.html. Should help LCP. If Lighthouse complains "Preload key requests" you may need to verify the preload `as="font"` matches what you actually load.
- **Pagefind WASM.** Only triggers when a user opens `/search/`. Won't hit Lighthouse on pages we test above.
- **Mermaid (round 19).** 3.3 MB self-hosted bundle, but only loaded on pages with `{{< mermaid >}}` shortcode — currently no published page uses it. Won't appear in Lighthouse for the URLs above.

### Accessibility

| What to check | Why |
|---|---|
| **Color contrast in dark mode** | Round 16 shipped `chroma-dark.css` — code blocks use the github-dark palette. Some token colors may have insufficient contrast against `#0d1117`. Lighthouse runs axe-core which catches WCAG AA contrast failures. |
| **Heading hierarchy** | No skipped levels (h1 → h3 with no h2 in between). Especially worth checking on docs pages where shortcodes can mess this up. |
| **`aria-current` on language switcher** | The EN/FR toggle should mark the current language with `aria-current=true`. Already in the rendered HTML — confirm Lighthouse sees it. |
| **`aria-current` on nav** | Same for the nav links — current page should be marked. |
| **Form labels** | The site has no forms except possibly the search input. Confirm Pagefind's input has a proper `<label>` or `aria-label`. |

### Best Practices

Most should pass automatically:

| What | Status |
|---|---|
| HTTPS everywhere | ✓ Cloudflare-enforced |
| No mixed content | ✓ CSP `'self'` blocks it |
| Console errors | Check for stray errors from `worker.mjs` (e.g., umami tracking failure surfacing). |
| `<doctype html>` | ✓ Hugo emits it |
| Image aspect ratios | Confirm `<img>` tags include `width`/`height` attributes to prevent CLS — especially on the showcase page. |

### SEO

| Item | Status |
|---|---|
| `<meta name=description>` | ✓ in head.html |
| `hreflang` tags | ✓ self-reference + alternate (round 12) |
| `sitemap.xml` | ✓ Hugo default |
| `robots.txt` | ✓ Hugo default with `enableRobotsTXT: true` |
| Structured data | Worth running through Schema.org Validator. Currently no `application/ld+json` blocks emitted — possible future improvement (BlogPosting, Article schemas). |
| Canonical URL | ✓ in head.html |

## Scoring expectations

For a static Hugo site with no client-side JS frameworks, you should expect:

| Category | Realistic target | Floor (something is wrong if below) |
|---|---|---|
| Performance | 95+ desktop, 85+ mobile | 80 desktop, 70 mobile |
| Accessibility | 95+ | 85 |
| Best Practices | 100 | 90 |
| SEO | 100 | 95 |

If any of the test pages score significantly lower than these floors, that's a real finding worth investigating.

## After running

Capture the four scores per page in a table like this for the commit notes:

| Page | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| `/en/` |  |  |  |  |
| `/en/docs/getting-started/` |  |  |  |  |
| `/en/blog/introducing-v8s/` |  |  |  |  |
| `/fr/docs/cloudflare/` |  |  |  |  |
| `/en/showcase/` |  |  |  |  |

Open issues for any specific failures, especially any "Issue" entries Lighthouse flags (these are concrete machine-readable problems, not just score deductions).
