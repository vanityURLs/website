---
title: "Accessibility Statement"
description: "Our commitment to making vanityURLs.link usable by everyone, current WCAG 2.1 conformance status, and how to report accessibility issues."
aliases:
  - a11y
---

*Last reviewed: April 2026. This statement applies only to vanityURLs.link, not to self-hosted vanityURLs deployments.*

We're committed to making this site usable by as many people as possible, regardless of ability or assistive technology. This statement explains what we've implemented, what we know is imperfect, and how to test or report accessibility issues.

## Conformance status

We target **WCAG 2.1 Level AA** and the site is **partially conformant** — the majority of criteria are met, with a small number of known gaps documented below.

The four WCAG principles ([POUR](https://www.w3.org/WAI/WCAG22/Understanding/intro#understanding-the-four-principles-of-accessibility)) and their status here:

- **Perceivable** — content can be presented in ways users can perceive, regardless of sensory ability. Mostly met. See known gaps below.
- **Operable** — every interactive element is reachable and usable. Mostly met. See known gaps below.
- **Understandable** — content is readable, and the interface behaves predictably. Met.
- **Robust** — content works with current and future assistive technologies. Met.

The most recent automated audit (April 2026) returned a Lighthouse Accessibility score of **100/100** for the home page on both mobile and desktop. Automated tools catch roughly 30–40% of WCAG failures, so this score isn't proof of full conformance — it's a useful signal alongside the manual checks described below.

## What we have implemented

### Keyboard navigation

Every interactive element — navigation links, buttons, the documentation sidebar, the search modal, the language switcher — is reachable and operable using a keyboard alone.

A **skip-to-content link** appears on focus, letting keyboard users bypass the header navigation. The **Source Code dropdown menu** is fully keyboard-operable: `Enter` or `Space` opens it, `ArrowDown`/`ArrowUp` move between items, and `Escape` closes it and returns focus to the trigger button. The **search modal** opens on `Cmd+K` (macOS) / `Ctrl+K` (Windows, Linux), traps focus while open, and releases focus on `Escape`.

All focus states are visible via `:focus-visible` with a 2px brand-coloured ring. Focus rings appear on keyboard navigation but not on mouse clicks, which avoids visual noise without sacrificing keyboard usability.

### Semantic structure

The site uses correct HTML landmark elements (`<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`, `<article>`) and maintains a proper heading hierarchy (`h1` → `h2` → `h3`) without skipping levels.

The page `lang` attribute is set correctly: `en-CA` for English pages, `fr-CA` for French pages. The active language in the language switcher is marked with `aria-current="true"` so screen readers announce it as the current selection.

### ARIA usage

ARIA roles, properties, and states are used where HTML semantics alone are insufficient:

- The Source Code dropdown uses `aria-haspopup`, `aria-expanded`, `aria-controls`, and `role="menu"`.
- The search modal uses `role="dialog"`, `aria-modal="true"`, and `aria-label`.
- The dark-mode toggle, search trigger, and mobile menu trigger all use `aria-label` for non-textual context.
- Decorative SVG icons carry `aria-hidden="true"`.
- The logo uses `alt=""` (correctly empty for a decorative image displayed alongside the visible "vanityURLs" wordmark).

### Colour and contrast

Body text (`text-gray-900` on white) reaches **17.74:1** in light mode — well above WCAG AAA. Inverted on dark backgrounds (`text-gray-100` on `bg-gray-900`), it reaches similar ratios.

Documentation text links use `brand-700` (#0f766e) on white, giving **5.47:1** — meeting WCAG AA for normal text. In dark mode, links use `brand-400` (#2dd4bf) on `bg-gray-900`, giving **9.53:1** — exceeding AAA.

The hero subtitle uses `text-gray-300` over a dark gradient. Worst-case contrast (over `bg-brand-900`) is **6.43:1**, exceeding AAA. Over `bg-gray-900` it reaches **12.04:1**.

UI components such as badges and the hero call-to-action button were verified during the April 2026 audit to meet the 3:1 AA threshold for non-text elements.

### Assistive technology support

We have not yet conducted formal screen reader testing on this site. Reports from people who use VoiceOver, NVDA, JAWS, TalkBack, Narrator, or any other assistive technology are very welcome — see [Reporting accessibility issues](#reporting-accessibility-issues) below. Concrete reproduction steps are especially useful.

## Known gaps

These are real shortcomings we've identified and not yet addressed. We list them honestly rather than claim conformance we don't have.

- **No `prefers-reduced-motion` support.** The site uses CSS transitions on color, transform, and opacity properties. Users who set "reduce motion" in their operating system don't currently get a reduced version. Impact: low — animations are subtle (150ms colour and opacity changes, no parallax, no auto-play). Priority: medium.
- **Search results don't announce result counts to screen readers.** The Pagefind-powered search modal updates results as the user types but doesn't include an `aria-live` region, so screen reader users don't hear "5 results" announced. Impact: medium for screen reader users. Priority: medium.
- **Documentation tables don't have `<caption>` elements.** Markdown tables are rendered without captions, so screen readers announce the table structure without a summary. Impact: low — surrounding prose typically describes the table. Priority: low.
- **Mobile navigation menu requires JavaScript.** The mobile menu toggle uses JS for the open/close behaviour. WCAG 2.1 doesn't require sites to function without JavaScript, but if you've disabled JS, the mobile menu will not open. Desktop navigation works without JS. Priority: low.

## How to test this site

### Automated checks (start here)

Automated tools catch a meaningful portion of WCAG failures and are the fastest starting point. None of them detect everything — pair them with the manual checks below.

| Tool | Access | What it checks |
|------|--------|----------------|
| axe DevTools | [Chrome extension](https://chromewebstore.google.com/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd) → DevTools → axe tab | WCAG 2.1 A and AA |
| WAVE | [wave.webaim.org](https://wave.webaim.org) or [browser extension](https://wave.webaim.org/extension/) | Structure, contrast, ARIA |
| Lighthouse | Chrome DevTools → Lighthouse tab → Accessibility | Score plus issues list |
| PageSpeed Insights | [pagespeed.web.dev](https://pagespeed.web.dev) | Lighthouse audit + Core Web Vitals |
| IBM Equal Access Checker | [Chrome extension](https://chromewebstore.google.com/detail/ibm-equal-access-accessib/lkcagbfjnkomcinoddgooolagloogehp) | WCAG 2.1 plus IBM guidelines |

### Keyboard testing

Set your mouse aside and navigate using only:

- `Tab` — move forward through focusable elements
- `Shift+Tab` — move backward
- `Enter` / `Space` — activate buttons and links
- `Escape` — close modals and dropdowns
- `Arrow keys` — navigate within the documentation sidebar dropdown menu
- `Cmd+K` / `Ctrl+K` — open the search modal

Every interactive element should be reachable, have a visible focus indicator, and be activatable without a mouse.

### Colour contrast

Useful tools when verifying contrast manually:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [TPGi Color Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) (desktop app)
- Chrome DevTools → Elements panel → Computed → contrast indicator

Targets: **4.5:1** for normal text, **3:1** for large text (18pt or 14pt bold) and UI components.

### Screen reader testing

| Screen reader | OS | Browser |
|---------------|-----|---------|
| VoiceOver | macOS (`Cmd+F5`) | Safari |
| NVDA | Windows (free) | Firefox |
| TalkBack | Android | Chrome |
| Narrator | Windows | Edge |

Things worth checking: the page title is announced, headings are navigable using the `H` key, link text is descriptive (avoid "click here"), the language switcher announces the active language, and the search modal announces itself when opened.

### Browser-level checks

- Zoom to 200% — content should reflow without horizontal scrolling.
- Forced colours mode (Windows High Contrast) — content should remain readable, focus rings should remain visible.
- Disable CSS — page structure and reading order should remain logical.

## Open source — audit the implementation

The site is open source. You can inspect every accessibility decision directly:

- Templates and ARIA: [github.com/vanityURLs/website/tree/main/layouts](https://github.com/vanityURLs/website/tree/main/layouts)
- CSS, including focus styles: [github.com/vanityURLs/website/blob/main/assets/css/main.css](https://github.com/vanityURLs/website/blob/main/assets/css/main.css)
- JavaScript, including the keyboard handlers: [github.com/vanityURLs/website/blob/main/assets/js/app.js](https://github.com/vanityURLs/website/blob/main/assets/js/app.js)

## Reporting accessibility issues

If you encounter a barrier on this site, please tell us:

- [GitHub Issues](https://github.com/vanityURLs/website/issues) — preferred, since it allows public tracking
- [GitHub Discussions](https://github.com/orgs/vanityURLs/discussions)

Please include the page URL, a description of the barrier, the assistive technology and browser you were using, and steps to reproduce.

We aim to acknowledge reports within **7 days** and to resolve confirmed issues within **30 days**.
