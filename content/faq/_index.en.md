---
title: "FAQ"
description: "Frequently asked questions about running, securing, and updating a vanityURLs instance."
---

## Do I still need to edit `v8s-schedules.json` manually?

Usually no. Use `./scripts/lnk schedule add`, `./scripts/lnk schedule default`, and `./scripts/lnk schedule list` for common schedule work. You can set a fallback target while adding a rule with `--default`. Manual JSON edits are still useful for bulk changes or review-heavy changes.

## Does the CLI require Bash?

No. The primary CLI, `./scripts/lnk`, is Node-based and works on macOS, Linux, Windows, and CI environments with Node and Git. The optional `scripts/v8s.zsh` helper requires Zsh, but it is only a convenience for opening existing redirects.

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

## Why do English and French have more footer links than other languages?

English and French currently include default privacy, terms, abuse, and security pages. Spanish, Italian, and German include localized home, expand, and status pages, but do not yet include equivalent policy pages. The build only links to policy pages that exist for that language.

## How do I choose which languages my instance supports?

Set `i18n.supported_languages` in `custom/v8s-site-config.json`. This matters as soon as you customize `custom/public/`, because otherwise visitors may see a mixed instance where one language is customized and other default language folders are still present.

The build uses this list to patch the Worker language routing, build the protected tests page, and prune unsupported language directories from generated output.

## What happens when setup copies default pages into `custom/public`?

`npm run setup` can ask for your short domain, supported languages, and split-color wordmark. If you accept the branded-page option, it copies `defaults/public/` into `custom/public/`, rewrites the wordmark, updates relevant brand labels and links, prunes unsupported language folders, and stores those decisions in `custom/v8s-site-config.json`.

If `custom/public/` already contains owner edits and was not marked as installer-managed, setup refuses to overwrite it unless you pass `--force`.

## Why is the source policy file named `v8s-policies.json` but the runtime file named `v8s-blocklist.json`?

The source file is named for the broader policy model: blocked domains, allowed domains, keyword rules, scanner controls, and related trust-and-safety decisions. The Worker runtime still consumes a generated `build/v8s-blocklist.json` artifact because it is optimized for runtime blocking.

Use `defaults/v8s-policies.json` and `custom/v8s-policies.json` for source edits. Treat `build/v8s-blocklist.json` as generated output.

## Does `custom/v8s-policies.json` merge with the default policy?

No. The custom source policy replaces the default source policy for instance policy decisions. This prevents removed custom policy items from quietly reappearing through a default merge. Legacy `v8s-blocklist.json` names may still be recognized for migration, but new documentation and new instances should use `v8s-policies.json`.

## Where do the localized redirected badges live?

The default badges live under `defaults/public/{en,fr,es,it,de}/` as `v8s-redirected.svg` and `v8s-redirected-dark.svg`. English is also copied to the public root at build time for compatibility with root-level pages.

Run `npm run optimize:badges` to reproduce the SVGO cleanup for those SVGs.

## What is the difference between `build/v8s.json` and `~/.v8s.json`?

`build/v8s.json` is the repository-local generated registry. It is removed by `npm run clean`.

`~/.v8s.json`, or the configured local registry path, is a workstation cache used by the optional shell helper. It can survive `npm run clean` because it is outside the repository build output.

## What files does `lnk` edit?

`lnk` edits source files under `custom/`. Link commands write to `custom/v8s-links.txt`, creating it if needed. Policy commands write to `custom/v8s-policies.json`.

After editing with `lnk`, run `npm run build`, `npm run check`, or `npm run local-publish` to validate and publish the change.

## What is `npm run local-publish` for?

`npm run local-publish` is the local convenience workflow for validated instance changes. It runs checks, stages configured paths, commits, and pushes. By default it focuses on `custom/`, so generated `build/`, `src/`, and `functions/` output should stay out of Git.

## How do I keep my instance updated?

Keep local files in `custom/`, run `npm run clean`, use the upgrade workflow to refresh `defaults/` and `scripts/`, then run `npm run check` before deploying.

## What should I commit?

Commit source files and `custom/` changes. Do not commit generated `build/`, `src/`, or `functions/` output. The clean command removes those generated directories.
