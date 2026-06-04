---
aside: false
title: "Brand"
description: "Configure instance branding values and use the dedicated brand standards site."
weight: 12
aliases:
  - /docs/brand/
  - /docs/customize/brand/
---

The vanityURLs brand standards now live at [brand.vanityurls.link](https://brand.vanityurls.link/). Use that site for logo, color, typography, badge, product UI, and asset guidance.

Branding controls the public wordmark and the short line under generated public pages. These values live in `custom/v8s-site-config.json` and are applied at build time, so a normal branded instance does not need to copy default pages into `custom/public/`.

You can customize during `npm run setup` or by manually updating files in `custom/`.

If `operator.operator_domain` is set in `custom/v8s-site-config.json`, generated pages link the operator legal name inside the slogan to that domain. For example, `A short-link service for Example Inc.'s projects` can link `Example Inc.` to `https://example.com`.

## Setup questions

| Setup question                                                            | When it appears                 | Phase 1 recommendation                                                  | Later customization                                                                    | What it controls                                                                     |
| ------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Configure branding now?                                                   | Always                          | Use `Y` when you want setup-managed wordmark and slogan values          | Use `N` when you already maintain branding config by hand                              | Whether setup asks the branding questions now                                        |
| Add a slogan line under the domain name on your pages...?                 | When branding is enabled        | Use `Y` when you want a short line under the domain wordmark            | Use `N` when the domain wordmark should stand alone                                    | Whether generated pages include a short slogan below the split-color domain wordmark |
| Brand slogan `[language]`                                                 | When the slogan line is enabled | Enter the English slogan first, then each additional supported language | Keep each slogan durable enough to appear on trust, privacy, terms, and security pages | Localized text shown below the split-color domain wordmark on generated public pages |
| Copy full default web pages to custom/public for manual template editing? | When branding is enabled        | Use `N` unless you plan to edit default HTML templates                  | Use `Y` only when you intentionally want full page overrides under `custom/public/`    | Whether setup copies editable public pages into `custom/public/`                     |
| Black wordmark portion                                                    | When branding is enabled        | Domain prefix, such as `v8s.`                                           | Use the portion that should render in the dark brand color                             | First part of the homepage and public-page wordmark                                  |
| Green wordmark portion                                                    | When branding is enabled        | Domain suffix, such as `link`                                           | Use the portion that should render in vanityURLs teal                                  | Second part of the homepage and public-page wordmark                                 |

You can run `npm run setup` again later. The installer reads existing branding values and offers them as defaults, so it is fine to start with the generated split and refine the assets later.

Localized slogans are stored in `custom/v8s-site-config.json` under `branding.slogan`. Existing instances that still have a single slogan string continue to work; setup writes the localized map for new branding runs. English is always collected first because it is the fallback language for generated pages.

## Instance asset overrides

Put instance-owned brand assets under `custom/public/` so they overlay the default public assets during build. Redirected badges also live under localized public directories.

{{< filetree/container >}}
{{< filetree/folder name="custom" >}}
{{< filetree/folder name="public" annotation="instance-owned public asset overrides" >}}
{{< filetree/file name="v8s-logo.svg" >}}
{{< filetree/file name="favicon.svg" >}}
{{< filetree/file name="site.webmanifest" >}}
{{< filetree/file name="apple-touch-icon.png" >}}
{{< filetree/file name="icon-192.png" >}}
{{< filetree/file name="icon-512.png" >}}
{{< filetree/folder name="en" annotation="localized badge overrides" >}}
{{< filetree/file name="v8s-redirected.svg" >}}
{{< filetree/file name="v8s-redirected-dark.svg" >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

## Build-time branding and copied pages

By default, setup records the wordmark, localized slogans, and brand domain in `custom/v8s-site-config.json`. During `npm run build`, vanityURLs copies `defaults/public/` into `build/` and applies those branding values there. This keeps unmodified pages in `defaults/`, where upstream updates can refresh them.

Only copy full pages into `custom/public/` when you intend to manually edit HTML templates. In that mode, `npm run setup` can copy `defaults/public/` into `custom/public/`, rewrite the default `Vanity` + `URLs` wordmark into the configured black and green wordmark portions, update brand labels and links, and prune unsupported language directories.

The installer records those choices in `custom/v8s-site-config.json` so repeated setup runs are predictable. If `custom/public/` already contains files and was not marked as setup-managed, setup refuses to replace it unless you pass `--force`.

When you use `custom/public/`, keep `i18n.supported_languages` aligned with the localized pages you actually support. See [Internationalization](/docs/reference/i18n/) for the language directory rules.

## Visual standards

For the current color tokens, localized badge files, typography notes, product UI rules, and downloadable asset paths, use [brand.vanityurls.link](https://brand.vanityurls.link/).

For the customization narrative, read [Branding your short-link domain](/blog/branding-your-short-link-domain/).
