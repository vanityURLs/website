---
title: "Making f-l.ca feel like my own"
date: 2026-06-16
author: "Félix Léger"
description: "How a full custom vanityURLs theme turns a short-link instance into part of a personal brand."
tags: ["branding", "customization", "case-study"]
featured: false
---

I have been [using vanityURLs since 2024](/showcase/f-l-ca/), the _regular_ vanityURLs look is intentionally easy to ship. That is the useful boundary. The engine stays boring and the public surface gets personality.

For [f-l.ca](f-l.ca), I wanted something else. I wanted the short-link domain to feel like a small personal surface, not only a redirect utility. That is harder, because a custom theme means owning the public HTML and all the little items that people only notice when your localized pages break. But it also makes the domain feel unmistakably mine.

{{< carousel label="Félix custom page screenshots" >}}
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

Too long, did not read? Check [Brand](/docs/reference/brand/) and [Custom overrides](/docs/reference/custom-overrides/) to customize your instance's public surface.

## The URL Is The Interface

My theme is built around one concept: the link itself should be the main object on the page. Instead of a conventional card, logo block, and button stack, the page reads like an editable address.

When someone types a slug, the circular arrow becomes the action.

When a path is invalid, the same surface _shake_ the screen and show the path back to the visitor instead of changing visual systems.

## Full Custom Mode Has A Cost

This is not the quickest path, you can ask my co-maintainer. Full custom mode means the instance provides its own public pages under `custom/public`, including English and French variants, lookup pages, and status pages. 

I was a big user of the [Internationalization](/docs/reference/i18n/) documentation because localized pages need to stay equivalent, not merely translated once. That also means the theme has to behave like product code:

- the English and French pages need to stay aligned
- the lookup page needs to keep the same visual language as the homepage
- the theme needs to work without relying on external font or script providers to support Content Security Policy
- custom files need to avoid colliding with the assets shipped by vanityURLs

The default vanityURLs pages absorb most of that maintenance for you. A custom theme gives you more control, but it also removes some guardrails.

## Keep Product Names Out Of Custom Files

One line I would not cross is file naming. That boundary matters at build time.

My custom pages use names like `flstyle.css` and `flscript.js`, because those are mine. I would not create custom files named like the product-managed assets in `defaults/public`, especially the CSS and JavaScript files such as `v8s-style.css`, `v8s-script.js`, `v8s-status.css`, `v8s-lookup.js`, or `v8s-theme.js`.

The build copies `defaults/public` first, then overlays `custom/public`. If a custom file shadows a managed `v8s-*` file, it can accidentally freeze an old runtime asset while pages that stay vanilla continue expecting the current default CSS and JavaScript. The right split is: give custom web and status pages their own asset names, and let pages that remain vanilla keep using the managed `v8s-*` files.

## Brand Is In The Small Choices

My theme is sparse on purpose. A warm background, a monospace URL, a small yellow mark in the corner, and almost no extra text. The homepage does not try to explain every feature because the domain already tells you what matters: this is a place where my links live.

That consistency is the real branding gain. Building an instance with the regular look and feel is easy, and for many domains it is the right answer. Building something proprietary is harder, but it can multiply the personal branding value when the links themselves are part of how you work in public.

The theme also supports light and dark mode, but it does it differently from the default vanityURLs pages. The default pages use the product `v8s-theme.js` helper so QA links can force previews with `?theme=light` and `?theme=dark`; see [Custom overrides](/docs/reference/custom-overrides/) and [Access control](/docs/customize/access-control/) when testing protected `_tests` previews.

Félix's theme uses CSS variables with `prefers-color-scheme` directly in `flstyle.css`. That is less featureful for product QA, but it is exactly right for a small personal interface that should follow the visitor's system preference without extra theme controls.

## Tell Maintenance What Is Intentional

The other important file is `custom/v8s-custom-overrides.json`. vanityURLs uses that JSON file so `npm run doctor` and `v8s-fix` know which custom differences should not be _fixed_ back to defaults.

For this theme, the file says that the custom single-screen pages, the themed identity assets, and the home-style 404 fallback are deliberate. That matters because the 404 experience is not a separate default-looking error document. It is the same redirect surface: when a path is not found, the page can show the entered path and shake the screen. Without the override record, maintenance tooling would keep bothering the maintainer to refresh files that are intentionally different.

That is the fine line in full custom mode: document the differences you mean to own, link back to the product docs for the defaults you still rely on, and let the tooling keep helping everywhere else.

## What I Would Keep

If I were doing it again, I would keep the same separation:

- let vanityURLs own the redirect engine, registry generation, security defaults, and managed `v8s-*` assets
- let the instance own only the custom public surface that truly needs to feel personal
- test upgrades against the custom pages instead of copying managed assets into `custom/public`
- keep the theme small enough that every state can still be reviewed
