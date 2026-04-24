---
title: "Accessibility Statement"
description: "Our commitment to making vanityURLs.link usable by everyone, current WCAG 2.1 compliance status, and how to report accessibility issues."
aliases:
  - a11y
---
{{< callout type="note" title="Last reviewed: April 2026" >}}
it applies only to the current website (e.g., `vanityURLs.link`) and not to self-hosted vanityURLs deployments. 
{{< /callout >}}

We're committed to making this site usable by as many people as possible, regardless of ability or assistive technology. This statement explains what we've implemented, what we know is imperfect, and how to test or report accessibility issues.

We target **WCAG 2.1 Level AA** and the site is **partially conformant**. The majority of criteria are met, and we are working on the remaining gaps described below.

WCAG 2.1 is organized around four principles:

| Principle || Status |
|--|--|--|
| **Operable**|All UI is keyboard-navigable | Mostly met, see known issues |
| **Perceivable**|Information is presentable to all users | Mostly met, see known issues |
| **Robust**|Compatible with assistive technologies | Compliant |
| **Understandable**|Content is readable and predictable | Compliant |

   
## What we have implemented

### Keyboard navigation

- Every interactive elements (e.g., navigation links, buttons, sidebar, search modal) are reachable and operable using a keyboard alone
- A visible **skip-to-content link** appears on focus, letting keyboard users bypass the header navigation
- **Arrow keys** navigate the documentation sidebar. **Enter** and **Space** activate expandable sections
- The **Source Code dropdown menu** is operable by keyboard: `Enter` or `Space` opens it, `ArrowDown`/`ArrowUp` move between items, `Escape` closes it and returns focus to the trigger
- The **search modal** traps focus correctly when open and releases it on `Escape`
- All focus states are visible with a consistent 2px brand-coloured ring using `:focus-visible` (not shown on mouse clicks, only on keyboard navigation)

### Semantic structure

- Correct HTML landmark elements: `<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`, `<article>`
- Heading hierarchy is maintained (`h1` → `h2` → `h3`) on all pages without skipping levels
- The page `lang` attribute is set correctly for both English (`en-US`) and French (`fr-FR`)
- All pages have a unique, descriptive `<title>`

### Images and icons

- Decorative SVG icons carry `aria-hidden="true"` and are invisible to screen readers
- The logo image uses `alt=""` (correctly empty for decorative images) alongside the visible "vanityURLs" text label
- Content images, where they appear, include descriptive alt text

### Colour and contrast

- Body text (`gray-800` on white) exceeds WCAG AA at **12.6:1**
- Documentation text links use `brand-700` (#0f766e) which achieves **5.47:1** on white — meeting AA
- Dark mode uses `brand-400` (#2dd4bf) for links on `gray-900`, achieving **9.53:1** — exceeding AAA
- UI components (badges, icons) use either `brand-700` or contextual colours verified to meet the 3:1 AA threshold for non-text elements

### Assistive technology support

- Tested with **VoiceOver** (macOS Safari) and **NVDA** (Windows Firefox)
- ARIA roles, properties, and states are used where HTML semantics alone are **insufficient**: `role="dialog"`, `aria-modal`, `aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-label`
- Form controls (search input) are labelled via `aria-label`

### Reduced motion

The site uses minimal animation. CSS transitions are short (150ms) and used only on opacity/visibility. No auto-playing video, parallax, or flashing content is present.

## Known limitations (not yet resolved)

| Issue | Impact | Priority |
|-------|--------|----------|
| `brand-500` (#14b8a6, 2.49:1) used in the hero badge background gradient | Low — decorative only, no text in that colour at body size | Medium |
| Search results from Pagefind may not announce result counts to screen readers | Some screen reader users may not know how many results were returned | Medium |
| Mobile navigation menu uses JavaScript toggle — requires JS to be enabled | Users with JS disabled cannot open the mobile menu | Low (modern browsers enable JS by default) |
| Tables in documentation pages do not have `<caption>` elements | Screen readers announce the table without a summary | Low |

## How to test this website

### Automated tools (start here)

These tools catch 30–40% of WCAG failures automatically and are the fastest starting point:

| Tool | How to access | What it checks |
|------|--------------|----------------|
| **axe DevTools** | [Chrome extension](https://chromewebstore.google.com/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd) — open DevTools → axe tab | Comprehensive WCAG 2.1 A and AA |
| **WAVE** | [wave.webaim.org](https://wave.webaim.org) — enter the URL, or [browser extension](https://wave.webaim.org/extension/) | Structure, contrast, ARIA |
| **Lighthouse** | Chrome DevTools → Lighthouse tab → check Accessibility | Quick score + issues list |
| **IBM Equal Access Checker** | [Chrome extension](https://chromewebstore.google.com/detail/ibm-equal-access-accessib/lkcagbfjnkomcinoddgooolagloogehp) | WCAG 2.1 + IBM guidelines |

### Keyboard testing (catches interaction issues)

Close your mouse and navigate the page using only:

| Key | Action |
|-----|--------|
| `Tab` | Move forward through focusable elements |
| `Shift+Tab` | Move backward |
| `Enter` / `Space` | Activate buttons and links |
| `Escape` | Close modals and dropdowns |
| `Arrow keys` | Navigate menus and sidebar |

Everything interactive should be reachable, have a visible focus indicator, and be activatable without a mouse.

### Colour contrast testing

| Tool | URL |
|------|-----|
| WebAIM Contrast Checker | [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) |
| Colour Contrast Analyser (desktop app) | [paciellogroup.com](https://www.tpgi.com/color-contrast-checker/) |
| Chrome DevTools | DevTools → Elements → Accessibility panel → Computed |

Target: **4.5:1** for normal text, **3:1** for large text (18pt / 14pt bold) and UI components.

### Screen reader testing

| Screen reader | OS | Browser |
|---------------|----|----|
| **VoiceOver** | macOS (built-in: `Cmd+F5`) | Safari |
| **NVDA** | Windows (free download) | Firefox |
| **TalkBack** | Android (built-in) | Chrome |
| **Narrator** | Windows (built-in) | Edge |

Key things to check: page title is announced, headings are navigable by `H` key, links have descriptive text (not "click here"), and the search modal announces itself correctly when opened.

### Browser-level checks

- **Zoom to 200%** in your browser — content should reflow without horizontal scrolling (we use responsive Tailwind layouts).
- **Forced colours / Windows High Contrast Mode** — the site should remain readable (focus rings and UI states should be visible).
- **Disable CSS** — page structure and reading order should remain logical.

## Open source — audit the implementation

Because this site is fully open source, you can inspect every accessibility decision directly:

- **Templates and ARIA**: [github.com/vanityURLs/website/layouts](https://github.com/vanityURLs/website/tree/main/layouts)
- **CSS including focus styles**: [github.com/vanityURLs/website/assets/css/main.css](https://github.com/vanityURLs/website/blob/main/assets/css/main.css)
- **Keyboard navigation JS**: in `layouts/_default/baseof.html`

## Reporting accessibility issues

If you encounter an accessibility barrier on this site, please tell us:

- **GitHub Issues**: [github.com/vanityURLs/website/issues](https://github.com/vanityURLs/website/issues) — preferred, as it allows public tracking
- **GitHub Discussions**: [github.com/orgs/vanityURLs/discussions](https://github.com/orgs/vanityURLs/discussions)

Please include: the page URL, a description of the barrier, the assistive technology and browser you were using, and steps to reproduce.