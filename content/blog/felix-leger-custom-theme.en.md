---
title: "Making f-l.ca feel like my own"
date: 2026-06-16
author: "Félix Léger"
description: "How a full custom vanityURLs theme turns a short-link instance into part of a personal brand."
tags: ["branding", "customization", "case-study"]
featured: false
---

The regular vanityURLs look is intentionally easy to ship. You configure the domain, add the links, keep the generated public pages, and the instance already feels coherent.

For `f-l.ca`, I wanted something else. I wanted the short-link domain to feel like a small personal surface, not only a redirect utility. That is harder, because a custom theme means owning the public HTML, CSS, JavaScript, localized pages, icons, and all the little states that people only notice when they break. But it also makes the domain feel unmistakably mine.

![f-l.ca homepage with a minimal cream background, large monospace domain prefix, and a small yellow mark in the lower-left corner](/blog/felix-flca-home.png)

## The URL Is The Interface

The theme is built around one idea: the link itself should be the main object on the page.

Instead of a conventional card, logo block, and button stack, the page reads like an editable address:

```text
f-l.ca/
```

The page script fills the prefix from the current host, so the same custom files can run on my production domain and on a test instance. When someone types a slug, the circular arrow becomes the action. When a path is invalid, the same surface can show the path back to the visitor instead of changing visual systems.

That small interaction fits how I use links. Many of my redirects are compact handles for projects, games, streams, documentation, and Bonjour Arcade routes. A link like `b`, `b/*`, `plinko/*`, or `setup-mister` is not just shorter than the destination. It is a small named object I can say, remember, and reuse.

## Full Custom Mode Has A Cost

This is not the quickest path. Full custom mode means the instance provides its own public pages under `custom/public`, including English and French variants, lookup pages, status pages, trust and safety pages, icons, `flstyle.css`, and `script.js`.

That also means the theme has to behave like product code:

- the English and French pages need to stay aligned
- the lookup page needs to keep the same visual language as the homepage
- public contacts still need to be readable and trustworthy
- the theme needs to work without relying on external font or script providers
- custom files need to avoid colliding with the managed `v8s-*` assets shipped by vanityURLs

The default vanityURLs pages absorb most of that maintenance for you. A custom theme gives you more control, but it also removes some guardrails.

![f-l.ca trust and safety page using the same cream background, bold wordmark, and custom typography as the redirect surface](/blog/felix-flca-trust.png)

## Brand Is In The Small Choices

The theme is sparse on purpose. A warm background, a monospace URL, a small yellow mark in the corner, and almost no extra text. The homepage does not try to explain every feature because the domain already tells you what matters: this is a place where my links live.

The trust and safety page keeps the same tone, but it becomes more explicit where it should. Abuse and security contacts are readable. The domain stays prominent. The page still feels like `f-l.ca`, even though it is doing a more operational job.

That consistency is the real branding gain. Building an instance with the regular look and feel is easy, and for many domains it is the right answer. Building something proprietary is harder, but it can multiply the personal branding value when the links themselves are part of how you work in public.

## What I Would Keep

If I were doing it again, I would keep the same separation:

- let vanityURLs own the redirect engine, registry generation, security defaults, and managed `v8s-*` assets
- let the instance own only the custom public surface that truly needs to feel personal
- test upgrades against the custom pages instead of copying managed assets into `custom/public`
- keep the theme small enough that every state can still be reviewed

That is the useful boundary. The engine stays boring. The public surface gets personality. The links keep feeling like mine.
