---
title: "Identity"
description: "Logo, color, typography, badges, and asset usage."
type: brand
weight: 2
---

<div class="brand-system">
  <section class="brand-section">
    <h2>Color tokens</h2>
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
    <h3>Current website fonts</h3>
    <p>The website self-hosts Inter Variable for interface and prose text, plus JetBrains Mono for code. The files live under <code>/static/fonts/</code> and are declared in <code>assets/css/main.css</code>.</p>
    <h3>Reference typography</h3>
    <p>The current brand surface uses scoped fluid type and spacing tokens. Keep display text reserved for major page openings and use tighter headings inside panels, dashboards, and docs surfaces.</p>
  </section>

  <section class="brand-section">
    <h2>Usage notes</h2>
    <ul>
      <li>Use SVG badges.</li>
      <li>Keep badge backgrounds transparent.</li>
      <li>Preserve localized badge text.</li>
      <li>Do not rasterize badges.</li>
      <li>Do not add opaque backgrounds.</li>
      <li>Do not recolor only one language.</li>
    </ul>
  </section>
</div>
