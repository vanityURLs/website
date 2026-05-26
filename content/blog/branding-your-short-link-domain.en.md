---
title: "Branding your short-link domain"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "How to think about branding a vanityURLs instance without turning the redirector into a design project before it works."
tags: ["branding", "customization", "short-links"]
featured: false
---

A short-link domain is tiny, but people still read it as a signal. It appears in emails, slides, social profiles, QR codes, documentation, incident updates, and chat messages. If the domain looks intentional, the link feels safer before anyone clicks it.

That is the useful part of branding vanityURLs. The goal is not to create a full design system on day one. The goal is to make the redirector obviously yours, then refine the visual details once the links are working.

## Start with recognition

The first brand decision is the short domain itself. A good short domain is easy to say, easy to type, and close enough to the organization or person behind it that recipients do not have to guess who sent the link.

After that, keep the first pass modest:

- use the domain as the homepage wordmark
- keep the redirected badge visible on default pages
- update the public contact links and policy pages
- avoid decorative changes that make support pages harder to read

This gives users enough context without slowing the first deployment.

## The split-color wordmark

The installer can store a split-color wordmark in `custom/v8s-site-config.json`. For a domain like `v8s.link`, the first part can stay dark and the suffix can use the vanityURLs teal.

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

That small split helps the domain read as a brand without requiring a logo file.

## Keep badges boring in the best way

The redirected badge is not decoration. It tells visitors why they landed on an intermediate page and who runs the redirector. Localized badges help the same message appear in the visitor's language when a localized page exists.

Treat badges as product assets:

- keep them SVG
- keep the background transparent
- update every supported language together
- use the light badge on light surfaces and the dark badge on dark surfaces

The exact current asset names and color tokens live in [Brand](/docs/customize/brand/).

## Brand after the redirector works

Branding is phase 2 work. Get the domain, Worker, Access protection, links, and default pages working first. Then refine the homepage, badges, legal pages, status pages, typography, and language-specific assets.

That sequence keeps the product honest: the brand supports a working redirector instead of hiding an unfinished one.
