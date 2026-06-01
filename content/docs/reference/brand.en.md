---
aside: false
title: "Brand"
description: "Decide the public branding values applied to vanityURLs pages at build time."
weight: 12
aliases:
  - /docs/brand/
  - /docs/customize/brand/
---

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

## vanityURLs visual system

The vanityURLs visual system currently covers badge colors, localized badge files, typography notes, instance wordmark configuration, and instance-owned asset overrides. For the customization narrative, read [Branding your short-link domain](/blog/branding-your-short-link-domain/).

<div class="brand-system">
  <section class="brand-section">
    <h3>Badge color tokens</h3>
    <p>The redirected badges use transparent backgrounds. Choose the light badge for light surfaces and the dark badge for dark surfaces.</p>
    <div class="brand-grid brand-grid-3">
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-redirected-light" aria-hidden="true"></div>
        <h4>Redirected, light badge</h4>
        <p><code>#111827</code></p>
      </div>
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-vanity" aria-hidden="true"></div>
        <h4>vanityURLs</h4>
        <p><code>#0F766E</code></p>
      </div>
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-swoop" aria-hidden="true"></div>
        <h4>Swoop</h4>
        <p><code>#14B8A6</code></p>
      </div>
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-redirected-dark" aria-hidden="true"></div>
        <h4>Redirected, dark badge</h4>
        <p><code>#FFFFFF</code></p>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h3>Badge examples</h3>
    <div class="brand-grid">
      <div class="brand-panel">
        <h4>Light surface</h4>
        <div class="brand-badge-stage brand-badge-stage-light">
          <img src="/images/v8s-redirected-en.svg" alt="Redirected by vanityURLs.link badge">
        </div>
      </div>
      <div class="brand-panel">
        <h4>Dark surface</h4>
        <div class="brand-badge-stage brand-badge-stage-dark">
          <img src="/images/v8s-redirected-en-dark.svg" alt="Redirected by vanityURLs.link badge for dark surfaces">
        </div>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h3>Localized badge files</h3>
    <p>The website mirrors the redirector badge SVGs from the code repository under <code>/static/images/</code>. The source of truth for deployed user instances remains <code>defaults/public/{language}/</code> in the code repository.</p>
    <div class="brand-asset-grid">
      <div class="brand-asset">
        <img src="/images/v8s-redirected-en.svg" alt="English redirected badge">
        <code>v8s-redirected-en.svg</code>
        <code>v8s-redirected-en-dark.svg</code>
      </div>
      <div class="brand-asset">
        <img src="/images/v8s-redirected-fr.svg" alt="French redirected badge">
        <code>v8s-redirected-fr.svg</code>
        <code>v8s-redirected-fr-dark.svg</code>
      </div>
      <div class="brand-asset">
        <img src="/images/v8s-redirected-es.svg" alt="Spanish redirected badge">
        <code>v8s-redirected-es.svg</code>
        <code>v8s-redirected-es-dark.svg</code>
      </div>
      <div class="brand-asset">
        <img src="/images/v8s-redirected-it.svg" alt="Italian redirected badge">
        <code>v8s-redirected-it.svg</code>
        <code>v8s-redirected-it-dark.svg</code>
      </div>
      <div class="brand-asset">
        <img src="/images/v8s-redirected-de.svg" alt="German redirected badge">
        <code>v8s-redirected-de.svg</code>
        <code>v8s-redirected-de-dark.svg</code>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h3>Typography</h3>
    <h4>Current website fonts</h4>
    <p>The website currently self-hosts Inter Variable for interface and prose text, plus JetBrains Mono for code. The files live under <code>/static/fonts/</code> and are declared in <code>assets/css/main.css</code>.</p>
    <h4>Reference typography</h4>
    <p>The <code>bhdicaire-com</code> implementation uses Red Hat Display, Red Hat Text, Red Hat Mono, and Source Serif 4 with Utopia-style fluid type and spacing tokens. This brand page adopts the fluid token approach only, scoped to <code>.brand-system</code>, so the broader website typography stays stable until the logo refresh lands.</p>
  </section>

  <section class="brand-section">
    <h3>Instance wordmark configuration</h3>
    <p>Installer-managed instances can store a split-color wordmark in <code>custom/v8s-site-config.json</code>. The green portion should use the vanityURLs brand teal unless the instance has a deliberate local brand system.</p>
    <p>When branding is enabled, the installer stores localized slogans and the split-color wordmark in <code>custom/v8s-site-config.json</code>. The build applies those values to generated public pages without requiring copied templates in <code>custom/public</code>.</p>
    <pre class="brand-code"><code>{
  "branding": {
    "domain": "example.link",
    "slogan": {
      "en": "A short-link service for Example Inc.'s projects",
      "fr": "Un service de liens courts pour les projets de Example Inc."
    },
    "wordmark": {
      "black": "example.",
      "green": "link"
    }
  }
}</code></pre>
    <p><img src="/images/docs/split-color-domain-wordmark.svg" alt="Split-color domain wordmark example"></p>
  </section>

  <section class="brand-section">
    <h3>Usage notes</h3>
    <ul>
      <li>Use SVG badges.</li>
      <li>Keep badge backgrounds transparent.</li>
      <li>Preserve the localized badge text.</li>
      <li>Run <code>npm run optimize:badges</code> after editing default badge SVGs in the code repository.</li>
      <li>Do not rasterize the badges.</li>
      <li>Do not add opaque backgrounds.</li>
      <li>Do not recolor only one language.</li>
      <li>Do not treat the current logo set as final while the logo refresh is still underway.</li>
    </ul>
  </section>
</div>
