# vanityURLs — round 22: WCAG AA contrast across all flagged elements

PageSpeed Insights flagged three failing elements on `/en/`:

1. **EN language toggle** — `<a class="bg-brand-600 text-white">EN</a>`
2. **Get started CTA** — `<a class="... bg-brand-600 ... text-white">Get started →</a>`
3. **Footer copyright** — `<p>© 2026 Benoît H. Dicaire, all rights reserved</p>` inside `text-xs text-gray-400 dark:text-gray-500`

Investigating each turned up systemic issues. Fixed all of them.

## The math behind each fix

WCAG AA thresholds: **4.5:1 for normal text**, **3:1 for large text** (≥18pt or ≥14pt bold).

### Issue 1 + 2: white text on bg-brand-600

Your brand-teal palette has these contrasts with white:

| Background | vs `text-white` | Verdict |
|---|---|---|
| `bg-brand-500` (#14b8a6) | 2.49:1 | fails AA + AAA on any text |
| `bg-brand-600` (#0d9488) | 3.74:1 | fails normal text (4.5 needed); barely passes large text |
| `bg-brand-700` (#0f766e) | 5.47:1 | passes AA normal, fails AAA |
| `bg-brand-800` (#115e59) | 7.58:1 | passes AAA |

The two flagged elements are:
- "EN" on lang toggle: `text-xs font-medium` = 12px = NORMAL text → needs 4.5:1, got 3.74:1 → fail
- "Get started" CTA: `text-sm font-medium` = 14px = NORMAL text per WCAG (large requires bold OR ≥18pt) → needs 4.5:1, got 3.74:1 → fail

Both classified as normal text, both need 4.5:1.

**Fix:** shifted the entire button color pattern up one shade, preserving the dark-mode hover dance:

| Before | After |
|---|---|
| `bg-brand-600 hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600` | `bg-brand-700 hover:bg-brand-800 dark:bg-brand-800 dark:hover:bg-brand-700` |

This applied to 6 places (home CTA, 404 home button, docs CTA, showcase visit-link, language toggle active state, etc.).

### Issue 3: footer copyright text

The footer used `text-xs text-gray-400 dark:text-gray-500`. Both modes fail:

| Mode | Foreground / Background | Ratio | Status |
|---|---|---|---|
| Light | `gray-400` on `white` | 2.54:1 | **fails badly** |
| Dark | `gray-500` on `gray-900` | 3.67:1 | also fails |

PSI tested in light mode so only flagged that one. But fixing dark mode at the same time is free.

**Fix:** `text-gray-600 dark:text-gray-400`

| Mode | New ratio |
|---|---|
| Light: `gray-600` on `white` | **7.56:1** (passes AAA) |
| Dark: `gray-400` on `gray-900` | **6.99:1** (passes AAA) |

### The systemic find

While verifying the footer fix, I grepped for `text-xs text-gray-400 dark:text-gray-500` and found **13 occurrences across 8 templates**:

- `layouts/partials/footer.html` (the flagged one)
- `layouts/partials/search-modal.html` (the "Esc" keyboard hint)
- `layouts/blog/single.html` (×4: share label, byline, prev/next nav)
- `layouts/showcase/single.html` (metadata labels)
- `layouts/showcase/list.html` (URL link)
- `layouts/tags/taxonomy.html` (tag count badge)
- `layouts/shortcodes/code.html` (copy button)
- `layouts/docs/single.html` (×4: breadcrumb, pagination, prev/next labels)
- `layouts/docs/list.html` (breadcrumb)

PSI only flagged the ones rendered on `/en/`. The other 12 would have flagged on the pages where they appear (docs, blog, showcase). Bumped them all to `text-gray-600 dark:text-gray-400` in one sweep.

### Lang-switcher inactive state

While in `lang-switcher.html`, also bumped the inactive state's `text-gray-500` (4.83:1, marginal) → `text-gray-600` (7.56:1, comfortable). Same reasoning — `text-xs` is normal text, axe-core sometimes flags borderline cases at certain pixel rendering.

## Files in this patch

| File | Change |
|---|---|
| `layouts/partials/lang-switcher.html` | Active: `bg-brand-700`. Inactive: `text-gray-600` |
| `layouts/partials/footer.html` | Copyright row: `text-gray-600 dark:text-gray-400` |
| `layouts/partials/search-modal.html` | Esc kbd: same |
| `layouts/index.html` | Hero CTA: shifted brand pattern up one shade |
| `layouts/404.html` | Home button: same shift |
| `layouts/blog/single.html` | 4 small-text spots: same gray bump |
| `layouts/showcase/single.html` | Visit-link button: brand shift; metadata: gray bump |
| `layouts/showcase/list.html` | Site-link: gray bump |
| `layouts/tags/taxonomy.html` | Tag count badge: gray bump |
| `layouts/shortcodes/code.html` | Copy button: gray bump |
| `layouts/docs/single.html` | 4 small-text spots: gray bump |
| `layouts/docs/list.html` | CTA brand shift; breadcrumb gray bump |

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round22.zip
git add -A
git commit -m "a11y: WCAG AA contrast across brand buttons and small text"
git push
```

Or with the diff:

```bash
git apply ~/Downloads/vanityurls-round22.diff
```

## Validate after deploy

Re-run Lighthouse on `/en/`. Expected:

- Accessibility: 95 → **100** (3 contrast failures cleared)
- Performance: unchanged (this round doesn't touch perf)

Visual checks (the brand color buttons get slightly darker):

- Hero "Get started" button: still teal, slightly more muted
- Lang switcher active state: same
- Showcase visit-link buttons: same
- Hover states still darken further (now go to `brand-800`)

If the slightly-darker brand buttons feel too muted, the alternative would be a CSS-only fix that targets contrast without changing the visual shade — e.g. adding a 1px text-shadow for legibility — but that's hacky for a marketing site. The shade shift is cleaner.

## What's next

After this round, all 5 audited URLs should be:

- **Performance Mobile:** 85–92 (capped by 440–1170ms render-blocking CSS)
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

To push Mobile Performance past 95, the next round would be **CSS inlining** (inline the 14.4 KB main.css into `<head>`, eliminating the render-blocking request). Already scoped, ready to ship when you say go.
