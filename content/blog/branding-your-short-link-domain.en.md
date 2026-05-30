---
title: "Make the short domain look owned"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "How to think about branding a vanityURLs instance without turning the redirector into a design project before it works."
tags: ["branding", "customization", "short-links"]
featured: false
---

A short-link domain is tiny, but people still read it as a signal.

It appears in emails, slides, social profiles, QR codes, documentation, incident updates, and chat messages. If the domain looks intentional, the link feels safer before anyone clicks it.

This is the useful part of branding vanityURLs: make the redirector obviously yours without turning the first deployment into a design project.

![v8s.link homepage with split-color wordmark, search field, and redirected by vanityURLs.link badge](/blog/v8s-link-homepage.png)

## Start With The Domain

The first brand decision is the short domain itself. It should be easy to say, easy to type, and close enough to the person or organization behind it that recipients do not have to guess who sent the link.

For a first pass, keep the surface small:

- use the domain as the homepage wordmark
- keep the redirect badge visible on default pages
- update the public contact links and policy pages
- avoid decorative changes that make support pages harder to read

The screenshot above is enough brand for phase 1. The domain is visible. The input tells visitors what the page does. The badge explains why an intermediate page exists.

## Use The Split-Color Wordmark

The installer can store a split-color wordmark in `custom/v8s-site-config.json`. For `v8s.link`, the first part stays dark and the suffix uses the vanityURLs teal.

```json
{
  "branding": {
    "domain": "v8s.link",
    "slogan": {
      "en": "A short-link service for Example Inc.'s projects",
      "fr": "Un service de liens courts pour les projets de Example Inc."
    },
    "wordmark": {
      "black": "v8s.",
      "green": "link"
    }
  }
}
```

That split makes the domain read as a brand without requiring a logo file.

## Keep The Badge Boring

The redirected badge is not decoration. It tells visitors why they landed on an intermediate page and who runs the redirector. Localized badges help the same message appear in the visitor's language when a localized page exists.

Treat badges as product assets:

- keep them SVG
- keep the background transparent
- update every supported language together
- use the light badge on light surfaces and the dark badge on dark surfaces

The exact asset names and color tokens live in [Brand](/docs/reference/brand/).

## Know Where Branding Stops

Branding is phase 2 work. Get the domain, Worker, Access protection, links, and default pages working first.

Then refine the homepage, badges, legal pages, status pages, typography, and language-specific assets. The tradeoff is deliberate: a plain working redirector beats a polished one that has not proved it can redirect.
