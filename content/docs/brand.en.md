---
aside: false
title: "Brand"
description: "Current vanityURLs brand tokens, self-hosted fonts, redirected badge colors, and badge asset guidance."
---

<div class="brand-system">
  <section class="brand-hero">
    <p class="brand-kicker">Brand reference</p>
    <h1 class="brand-title">vanityURLs visual system</h1>
    <p class="brand-lede">This page records the current public brand decisions for the website and self-hosted redirector badges. Logo work is still in progress, so treat logo placement as provisional and badge color tokens as the stable reference.</p>
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
    "wordmark": {
      "black": "example.",
      "green": "link"
    }
  }
}</code></pre>
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
