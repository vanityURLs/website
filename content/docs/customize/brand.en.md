---
aside: false
title: "Brand"
description: "Decide the public branding values used by installer-managed vanityURLs pages."
weight: 35
aliases:
  - /docs/brand/
  - /docs/reference/brand/

---

Branding controls the public wordmark, the short line under generated legal and trust pages, and the default public assets copied into `custom/public/` at build time.

You can customize during `npm run setup` or by manually updating files in `custom/`.

If `operator.operator_domain` is set in `custom/v8s-site-config.json`, generated pages link the operator legal name inside the slogan to that domain. For example, `A short-link service for Example Inc.'s projects` can link `Example Inc.` to `https://example.com`.

| Decision | Phase 1 recommendation | Later customization |
| --- | --- | --- |
| Configure branding now? | Use `Y` when you want installer-managed public pages | Use `N` when you already maintain `custom/public/` by hand |
| Slogan line | Use `Y` when you want a short line under the domain wordmark | Use `N` when the domain wordmark should stand alone |
| Brand slogan per language | Use the generated localized defaults when they fit | Keep each slogan durable enough to appear on trust, privacy, terms, and security pages |
| Copy default web pages to `custom/public`? | Use `Y` for a first instance | Use `N` when custom pages already exist and should not be overwritten |
| Black wordmark portion | Domain prefix, such as `v8s.` | Use the portion that should render in the dark brand color |
| Green wordmark portion | Domain suffix, such as `link` | Use the portion that should render in vanityURLs teal |

## Setup questions

| Setup question | When it appears | What it controls |
| --- | --- | --- |
| Configure branding now? | Always | Whether setup asks the branding questions now |
| Add a slogan line under the domain name on your pages...? | When branding is enabled | Whether generated pages include a short slogan below the split-color domain wordmark |
| Brand slogan `[language]` | When the slogan line is enabled | Localized text shown below the split-color domain wordmark on generated public pages |
| Copy default web pages to custom/public with a split-color domain wordmark? | When branding is enabled | Whether setup copies editable public pages into `custom/public/` and applies the wordmark split |
| Black wordmark portion | When copied public pages are enabled | First part of the homepage and public-page wordmark |
| Green wordmark portion | When copied public pages are enabled | Second part of the homepage and public-page wordmark |

You can run `npm run setup` again later. The installer reads existing branding values and offers them as defaults, so it is fine to start with the generated split and refine the assets later.

Localized slogans are stored in `custom/v8s-site-config.json` under `branding.slogan`. Existing instances that still have a single slogan string continue to work; setup writes the localized map for new branding runs.

When branding is enabled, the installer can copy editable public pages into `custom/public`, optionally set a localized slogan below generated public-page wordmarks, and split the homepage domain wordmark into a dark prefix and a green suffix:

![Split-color domain wordmark example](/images/docs/split-color-domain-wordmark.svg)

## vanityURLs visual system

<div class="brand-system">
  <section class="brand-hero">
    <p class="brand-kicker">Brand reference</p>
    <p class="brand-title">vanityURLs visual system</p>
    <p class="brand-lede">This page records current brand assets, color tokens, and badge files. For the customization narrative, read <a href="/en/blog/branding-your-short-link-domain/">Branding your short-link domain</a>.</p>
  </section>

  <section class="brand-section">
    <h2>Badge color tokens</h2>
    <p>The redirected badges use transparent backgrounds. Choose the light badge for light surfaces and the dark badge for dark surfaces.</p>
    <div class="brand-grid brand-grid-3">
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-redirected-light" aria-hidden="true"></div>
        <h3>Redirected, light badge</h3>
        <p><code>#111827</code></p>
      </div>
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-vanity" aria-hidden="true"></div>
        <h3>vanityURLs</h3>
        <p><code>#0F766E</code></p>
      </div>
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-swoop" aria-hidden="true"></div>
        <h3>Swoop</h3>
        <p><code>#14B8A6</code></p>
      </div>
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-redirected-dark" aria-hidden="true"></div>
        <h3>Redirected, dark badge</h3>
        <p><code>#FFFFFF</code></p>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h2>Badge examples</h2>
    <div class="brand-grid">
      <div class="brand-panel">
        <h3>Light surface</h3>
        <div class="brand-badge-stage brand-badge-stage-light">
          <img src="/images/v8s-redirected-en.svg" alt="Redirected by vanityURLs.link badge">
        </div>
      </div>
      <div class="brand-panel">
        <h3>Dark surface</h3>
        <div class="brand-badge-stage brand-badge-stage-dark">
          <img src="/images/v8s-redirected-en-dark.svg" alt="Redirected by vanityURLs.link badge for dark surfaces">
        </div>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h2>Localized badge files</h2>
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
    <h2>Typography</h2>
    <div class="brand-grid">
      <div class="brand-panel">
        <h3>Current website fonts</h3>
        <p>The website currently self-hosts Inter Variable for interface and prose text, plus JetBrains Mono for code. The files live under <code>/static/fonts/</code> and are declared in <code>assets/css/main.css</code>.</p>
      </div>
      <div class="brand-panel">
        <h3>Reference typography</h3>
        <p>The <code>bhdicaire-com</code> implementation uses Red Hat Display, Red Hat Text, Red Hat Mono, and Source Serif 4 with Utopia-style fluid type and spacing tokens. This brand page adopts the fluid token approach only, scoped to <code>.brand-system</code>, so the broader website typography stays stable until the logo refresh lands.</p>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h2>Instance wordmark configuration</h2>
    <p>Installer-managed instances can store a split-color wordmark in <code>custom/v8s-site-config.json</code>. The green portion should use the vanityURLs brand teal unless the instance has a deliberate local brand system.</p>
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
  </section>

  <section class="brand-section">
    <h2>Instance asset overrides</h2>
    <p>Put instance-owned brand assets under <code>custom/public/</code> so they overlay the default public assets during build.</p>
    <pre class="brand-code"><code>custom/public/v8s-logo.svg
custom/public/favicon.svg
custom/public/site.webmanifest
custom/public/apple-touch-icon.png
custom/public/icon-192.png
custom/public/icon-512.png</code></pre>
  </section>

  <section class="brand-section">
    <h2>Usage notes</h2>
    <div class="brand-grid">
      <div class="brand-panel">
        <h3>Do</h3>
        <p>Use SVG badges, keep backgrounds transparent, preserve the localized badge text, and run <code>npm run optimize:badges</code> after editing default badge SVGs in the code repository.</p>
      </div>
      <div class="brand-panel">
        <h3>Do not</h3>
        <p>Do not rasterize the badges, add opaque backgrounds, recolor only one language, or treat the current logo set as final while the logo refresh is still underway.</p>
      </div>
    </div>
  </section>
</div>
