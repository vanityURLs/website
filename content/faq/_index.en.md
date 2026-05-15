---
title: "FAQ"
description: "Frequently asked questions about running, securing, and updating a vanityURLs instance."
---

## Should FAQ live in docs or as its own section?

It should be a standalone website section. Documentation is for procedures and references; the FAQ is for decision support, tradeoffs, and quick answers that link back to the docs.

## Do I still need to edit `v8s-schedules.json` manually?

Usually no. Use `./scripts/lnk schedule add`, `./scripts/lnk schedule default`, and `./scripts/lnk schedule list` for common schedule work. You can set a fallback target while adding a rule with `--default`. Manual JSON edits are still useful for bulk changes or review-heavy changes.

## Does the CLI require Bash?

No. The primary CLI, `./scripts/lnk`, is Node-based and works on macOS, Linux, Windows, and CI environments with Node and Git. The optional `scripts/v8s.zsh` helper requires Zsh, but it is only a convenience for opening existing redirects.

## Why not write the CLI in Go?

Go may make sense later for a standalone packaged binary. Today Node is the better fit because the repo already depends on Node for build, validation, tests, and Wrangler workflows. A Node CLI avoids maintaining two implementations while the project is still moving quickly.

## Is v8s a hosted shortener?

No. v8s is software for running your own short-link engine on your own domain and Cloudflare account. Your Git repo, Cloudflare Worker, DNS zone, legal pages, and destinations remain your responsibility.

## Why use a generated JSON registry instead of a database?

The runtime should stay small. A generated registry is easy to validate, audit, diff, roll back, and deploy. A database can be added later only if delegated editing becomes worth the operational cost.

## Is the public `v8s.link` instance ready?

Not yet. The current work is preparing the code, defaults, security model, docs, upgrade process, and abuse controls so a public instance can launch with a responsible baseline.

## What Cloudflare menus matter?

There are three places to know:

- Zero Trust for Access applications, policies, identity providers, and Zero Trust settings
- Workers & Pages for the Worker, assets binding, variables, observability, domains, and build settings
- the domain configuration area for DNS, SSL/TLS, WAF, Security, AI Crawl Control, Rules, Network, Caching, and analytics

## Why are WAF and bot controls necessary for a quiet personal instance?

Short domains receive scanner and bot traffic even when nobody has announced them. Blocking obvious abuse before the Worker protects CPU, analytics quota, reputation, and logs.

## Does v8s use client-side analytics?

No. The recommended model is server-side analytics from the Worker to Umami or Fathom. Do not add browser tracking scripts unless your own legal/privacy posture explicitly allows it.

## Can I use v8s for affiliate links or campaign tracking?

Only if the destination and disclosure are honest. Do not use a redirector to hide malicious destinations, launder another shortener chain, disguise tracking, or route people somewhere they would not reasonably expect.

## Who is responsible for terms and privacy pages?

The instance owner. The repo can provide draft pages and structure, but it is not legal advice. Owners should adapt terms, privacy, abuse, and security contact pages for their audience and jurisdiction.

## How do I keep my instance updated?

Keep local files in `custom/`, run `npm run clean`, use the upgrade workflow to refresh `defaults/` and `scripts/`, then run `npm run check` before deploying.

## What should I commit?

Commit source files and `custom/` changes. Do not commit generated `build/`, `src/`, or `functions/` output. The clean command removes those generated directories.
