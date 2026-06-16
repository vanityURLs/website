---
title: "Making f-l.ca feel like mine"
date: 2026-06-16
author: "Felix Leger"
description: "What a full custom vanityURLs theme buys, what it costs, and how to keep the instance upgradeable."
tags: ["branding", "customization", "case-study"]
featured: false
---
I have been [using vanityURLs since 2024](/showcase/f-l-ca/). That is the useful boundary. The engine stays boring and the public surface gets personality.

For [f-l.ca](https://f-l.ca/), I wanted something else, the engine stays boring and the public surface feel unmistakably mine.

{{< carousel label="Felix custom page screenshots" >}}
/blog/felix-en-home.png|English home page using the custom redirect shell|English home page
/blog/felix-en-lookup.png|English lookup page using the same custom shell|English lookup page
/blog/felix-en-not-found.png|English 404 page using the home-style fallback shell|English 404 fallback
/blog/felix-en-expired.png|English expired-link status page using the custom shell|English expired status
/blog/felix-en-disabled.png|English disabled-link status page using the custom shell|English disabled status
/blog/felix-en-maintenance.png|English maintenance status page using the custom shell|English maintenance status
/blog/felix-fr-home.png|French home page using the custom redirect shell|French home page
/blog/felix-fr-lookup.png|French lookup page using the same custom shell|French lookup page
/blog/felix-fr-not-found.png|French 404 page using the home-style fallback shell|French 404 fallback
/blog/felix-fr-expired.png|French expired-link status page using the custom shell|French expired status
/blog/felix-fr-disabled.png|French disabled-link status page using the custom shell|French disabled status
/blog/felix-fr-maintenance.png|French maintenance status page using the custom shell|French maintenance status
{{< /carousel >}}

For the mechanical path, see [Brand](/docs/reference/brand/) and [Custom overrides](/docs/reference/custom-overrides/).

## The url is the interface

My theme is built around one concept: the link itself should be the main object on the page.

When someone types a slug, the circular arrow becomes the action.

When a path is invalid, the screen _shake_ & show the path back to the visitor instead of changing visual systems.

## Full custom mode has a cost

This is not the quickest path, you can ask my co-maintainer {{< emoji name="smiling" decorative="true" >}}. Full custom mode means the instance provides its own public pages under `custom/public`, including English and French variants, lookup pages, and status pages.


That makes reading [internationalization](/docs/reference/i18n/) part of the theme work. Localized pages need to stay equivalent, not merely translated once.

It also means the theme has to behave like product code:

- English and French pages need to stay aligned
- Every pages needs to keep the same visual language as the homepage
- custom HTML needs a deliberate [Content Security Policy](https://www.w3.org/TR/CSP3/) posture
- custom files need to avoid collisions with assets shipped by vanityURLs
- protected operator pages[^operator-pages] such as `_stats` and `_tests` need an explicit decision: customize them, or leave them product-owned

The default vanityURLs pages absorb most of that maintenance. A custom theme gives more control. It also removes guardrails.

## Keep product names out of custom files

One line I would not cross is file naming. That boundary matters at build time.

The custom pages use names like `flstyle.css` and `flscript.js`, because those are instance-owned. I would not create custom files named like product-managed assets in `defaults/public`, especially `v8s-style.css`, `v8s-script.js`, `v8s-status.css`, `v8s-lookup.js`, or `v8s-theme.js`.

The build copies `defaults/public` first, then overlays `custom/public`.[^overlay] If a custom file shadows a managed `v8s-*` file, things will get weird while pages that stay vanilla continue expecting the current default CSS and JavaScript.

The split is plain: give custom web and status pages their own asset names, and let pages that remain vanilla keep using the managed `v8s-*` files.

## It's a different trust boundary

As of June 16, 2026, the vanityURLs public-pages documentation says custom HTML receives a sandboxed compatibility CSP profile, while referenced CSS, JavaScript, images, fonts, and manifests are served as normal assets.[^csp]

That is the right default for copied or hand-authored pages. It permits same-host CSS and JavaScript without granting product-page trust.

It also has a cost. Custom JavaScript should not depend on host cookies, host `localStorage`, or protected same-origin APIs when the sandbox omits `allow-same-origin`. Fortunately, vanityURLs does not use those capabilities.

## Brand Lives In The Small Choices

The brand work is not the slug form. That belongs to the interface.

The brand work is the restraint around it: a warm background, a monospace URL, a small yellow mark in the corner, and almost no explanatory copy. The page should look owned without asking to be admired.

My theme supports light and dark mode, but it does it differently from the default vanityURLs pages. I uses CSS variables with [`prefers-color-scheme`](https://www.w3.org/TR/mediaqueries-5/#prefers-color-scheme) directly in `flstyle.css`. It's good enough.


The default pages use the product `v8s-theme.js` helper so QA links can force previews with `?theme=light` and `?theme=dark`; see [Custom overrides](/docs/reference/custom-overrides/) and [Access control](/docs/customize/access-control/) when testing protected `_tests` previews. You can see below the default QA Links.

![Protected vanityURLs test matrix showing page and status checks for a short-link instance](/blog/v8s-link-tests.png)

I did not customize the operator pages: `_stats` and `_tests`. They are not public brand surfaces.

## Tell maintenance what is intentional

The maintenance file is `custom/v8s-custom-overrides.json`. vanityURLs uses that JSON so [npm run doctor](/docs/reference/public-pages/#doctor-ignores)[^doctor] and [v8s-fix](/docs/reference/repository-layout/#instance-files) know which custom differences should not be fixed back to `/defaults`.

That record matters because the 404 experience is not a separate default-looking error document. It is the same redirect surface. When a path is not found, the page can show the entered path and shake the form. 

Without the override record, maintenance tooling has to treat those differences as possible drift, the current manifest is explicit:

```json
{
  "schema_version": "1.0",
  "doctor": {
    "ignore": [
      {
        "paths": [
          "custom/public/en/404.html",
          "custom/public/en/abuse.html",
          "custom/public/en/disabled.html",
          "custom/public/en/expired.html",
          "custom/public/en/index.html",
          "custom/public/en/lookup/index.html",
          "custom/public/en/maintenance.html",
          "custom/public/fr/404.html",
          "custom/public/fr/abuse.html",
          "custom/public/fr/disabled.html",
          "custom/public/fr/expired.html",
          "custom/public/fr/index.html",
          "custom/public/fr/lookup/index.html",
          "custom/public/fr/maintenance.html"
        ],
        "codes": ["html-head-assets-stale", "branding-stale"],
        "reason": "Felix intentionally uses a custom single-screen theme, including the home-style 404 fallback."
      },
      {
        "paths": [
          "custom/public/android-chrome-192x192.png",
          "custom/public/android-chrome-512x512.png",
          "custom/public/apple-touch-icon.png",
          "custom/public/favicon-16x16.png",
          "custom/public/favicon-32x32.png",
          "custom/public/favicon.ico",
          "custom/public/en/android-chrome-192x192.png",
          "custom/public/en/android-chrome-512x512.png",
          "custom/public/en/apple-touch-icon.png",
          "custom/public/en/favicon-16x16.png",
          "custom/public/en/favicon-32x32.png",
          "custom/public/en/favicon-48x48.png",
          "custom/public/en/favicon.svg",
          "custom/public/en/site.webmanifest",
          "custom/public/en/v8s-redirected-dark.svg",
          "custom/public/en/v8s-redirected.svg",
          "custom/public/fonts/intervariable.woff2",
          "custom/public/fonts/jetbrainsmono.woff2",
          "custom/public/flstyle.css",
          "custom/public/fr/v8s-redirected-dark.svg",
          "custom/public/fr/v8s-redirected.svg",
          "custom/public/_tests/index.html",
          "custom/public/icon.png",
          "custom/public/logo.png",
          "custom/public/logo.svg",
          "custom/public/lookup.css",
          "custom/public/lookup.js",
          "custom/public/flscript.js",
          "custom/public/site.webmanifest"
        ],
        "codes": ["shared-asset-stale"],
        "reason": "Felix intentionally owns these theme and identity assets."
      },
      {
        "paths": ["custom/public/_tests/index.html"],
        "codes": ["product-page-stale"],
        "reason": "Felix intentionally uses a themed QA page for the full custom mode test instance."
      }
    ]
  }
}
```

That is the fine line in full custom mode: document the differences you mean to own, link back to the product docs for the defaults you still rely on, and let the tooling keep helping everywhere else.


[^overlay]: See the vanityURLs [Internationalization](/docs/reference/i18n/) documentation for the build behavior: default public assets are copied, `custom/public` is overlaid, and unsupported language directories are removed from `build/`.

[^csp]: [Content Security Policy Level 3](https://www.w3.org/TR/CSP3/) was a W3C Working Draft dated May 5, 2026 when this post was prepared. For the vanityURLs implementation, see [Runtime security approach](/docs/reference/runtime-security/) and [Public and status pages](/docs/reference/public-pages/#custom-page-security). The custom-page behavior is an implementation detail, not a CSP requirement.

[^doctor]: See [Public and status pages](/docs/reference/public-pages/#doctor-ignores) for the `doctor.ignore` shape. For asset integrity, refer to [W3C Subresource Integrity](https://www.w3.org/TR/SRI/) handling.

[^operator-pages]: `_stats` is the protected read-only dashboard; `_tests` is the protected runtime test matrix. See [Reading your vanityURLs admin dashboard](/blog/reading-your-admin-dashboard/) and [Access control](/docs/customize/access-control/).

