---
title: "From redirect file to Worker runtime"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "How vanityURLs evolved from a simple redirect list into a Cloudflare Worker runtime."
tags: ["history", "architecture"]
---

vanityURLs started with a deliberately small idea: a short domain, a text file, and redirects that could be reviewed in Git.

That first version mattered because it proved the core principle. A link shortener does not need to be a platform you rent from somebody else. It can be infrastructure you own.

## The early shape

The earliest implementation leaned on Cloudflare Pages and static redirect behavior. That was enough for simple aliases, but it also exposed the first limits:

- limited operational visibility
- no clean way to represent lifecycle states
- no server-side analytics without adding more runtime behavior
- no structured validation beyond file syntax
- no good place for protected operational pages

The project moved through experiments with generated files, HTML pages, client-side ideas, and Pages Functions. Each step solved one problem while making another tradeoff more visible.

## Why the Worker became the center

The current major release moves the runtime into a Cloudflare Worker backed by static assets and a generated schema `3.1` runtime link registry.

That change is not about making the system bigger. It is about making the simple version stronger:

- the link registry is generated and validated before deploy
- the Worker accepts only the narrow request surface it needs
- operational pages such as `/en/_stats/`, other localized stats paths, and `/en/_tests/` can be protected with [Cloudflare Access](/docs/customize/access-control/)
- server-side analytics can be emitted without browser JavaScript
- blocklist checks, lifecycle states, and schedules run consistently at the edge
- the same code can power a private instance today and a public instance later

The important design decision is that the Worker remains boring. It reads a static registry, returns redirects or pages, and refuses private implementation assets. There is no public database to mutate during a request.

## What stayed the same

The project still treats Git as the source of truth. Links are still reviewed text. An instance still owns its domain, its `custom/` directory, its Cloudflare account, and its legal obligations.

The architecture changed because real traffic arrived, including scanner traffic on a personal instance nobody had announced. The lesson was clear: even a quiet redirector needs WAF rules, bot controls, a runtime blocklist, and a release checklist.

The future public instance, `v8s.link`, should keep that lesson visible. A redirect engine should be easy to run, but never casual about abuse.
