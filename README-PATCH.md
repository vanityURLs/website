# vanityURLs — round 21: hotfix for round-20 mistakes

Two of round 20's fixes had problems. Apologies — both deserve correction.

## What round 20 got right

- **Font preloads now actually emit.** This is real progress. Render-blocking dropped 2,090 ms on `/en/` and 2,520 ms on `/en/docs/getting-started/`. Mobile docs Perf went 77 → 85.
- **Reading-progress rAF wrapping.** Forced reflow finding gone on the blog page.

## What round 20 got wrong

### Mistake 1 — I set the hero subtitle to a darker gray when the hero is always dark

`layouts/index.html` line 8 hero section:
```html
<section class="... bg-gradient-to-br from-gray-900 via-brand-900 to-gray-900 text-white">
```

The hero **always renders on a dark gradient**, regardless of theme. I read round 20's contrast finding and assumed light/dark theme switching applied. I changed `text-gray-400` → `text-gray-600 dark:text-gray-400`. Result: dark-mode users still got `gray-400` (fine), but light-mode users got `gray-600` on a dark green-teal gradient — **way worse than the original**.

Your screenshot caught this. The subtitle was practically illegible.

### Mistake 2 — Lighthouse re-flagged the contrast issue (because mistake 1)

`/en/` Accessibility stayed at 95 because the original Lighthouse contrast finding was now even *more* failing than before. My round-20 fix made the problem worse, not better.

## Fix 1: hero subtitle uses gray-300 (correct for dark background)

```html
<p class="text-xl text-gray-300 mb-10 max-w-2xl">
```

WCAG contrast math (AA needs 4.5:1 normal, 3:1 large; `text-xl` is large):

| Color | vs `gray-900` (darkest stop) | vs `brand-900` (mid stop) | Verdict |
|---|---|---|---|
| `gray-400` (original) | 6.99:1 | 3.73:1 | Borderline — Lighthouse flagged |
| `gray-600` (round 20, wrong) | 2.35:1 | 1.25:1 | **Fails AA** — your screenshot |
| `gray-300` (round 21) | 12.04:1 | 6.43:1 | **AAA on both** |

`gray-300` passes AAA against every stop in the gradient. Subtitle is clearly readable. Lighthouse contrast finding should clear.

The earlier `dark:` modifier is gone because the hero doesn't change with theme.

## Fix 2: empty block between "How it works" and footer

You spotted this. Cause:

- `<section class="py-16 ...">` (How it works section) has 4rem bottom padding
- `<footer class="... mt-16">` had 4rem top margin

Stacked: 64px + 64px = 128px of empty space. With the section having a colored background and the footer having white, the gap was clearly visible.

Fix: drop `mt-16` from `<footer>`. The section's `py-16` already provides the bottom space, the footer has its own internal `py-12`, and `border-t` is the visual separator. No reason for the extra margin.

```diff
- <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-16 transition-colors duration-200">
+ <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-200">
```

## Files in this patch

| File | Change |
|---|---|
| `layouts/index.html` | Hero subtitle: `text-gray-300` (was wrongly `text-gray-600 dark:text-gray-400`) |
| `layouts/partials/footer.html` | Removed `mt-16` to eliminate doubled vertical spacing before footer |

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round21.zip
git add -A
git commit -m "fix: hero subtitle contrast on dark gradient; tighten footer spacing"
git push
```

Or with the diff:

```bash
git apply ~/Downloads/vanityurls-round21.diff
```

## Validate after deploy

**Visual checks:**
- Open `/en/` — hero subtitle should be clearly readable (light gray on dark gradient)
- Scroll to bottom — no empty white block between "How it works" and the footer
- Toggle dark mode — hero subtitle stays the same (always dark hero); footer transitions correctly

**Lighthouse:**
Re-run on `/en/`. Expected: Accessibility 95 → 100. Performance probably unchanged (this round doesn't touch perf).

## On the remaining Lighthouse findings

After round 20+21, the Mobile Performance ceiling on a typical page should be around 90. The remaining ~440–1,170 ms render-blocking is **the CSS bundle itself**, not fonts. Two paths to push past 95:

1. **Critical CSS inlining.** Inline ~5–10 KB of above-the-fold CSS into `<head>`, async-load the rest. Eliminates the render-blocking CSS request entirely. Real benefit on slow-3G but adds build complexity.

2. **Tailwind purge tightening.** The "Reduce unused CSS 11–12 KiB" finding suggests Tailwind is shipping classes you don't use. Tightening the `content` glob in `tailwind.config.js` could help. Smaller CSS = faster download = lower render-blocking time.

Neither is needed unless you specifically want to chase 95+ mobile. For a content site at 85–90 mobile, you're in the green zone for Web Vitals and search ranking. Defer until business demands it.

## Apologies for the round-20 misstep

I should have looked at the hero section's actual styling before "fixing" the contrast. The pattern of `text-gray-500 dark:text-gray-400` works on neutral page backgrounds, not on permanently-dark hero gradients. Round 21 corrects that.
