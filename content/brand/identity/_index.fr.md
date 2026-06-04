---
title: "Identite"
description: "Logo, couleurs, typographie, badges et usage des assets."
type: brand
weight: 2
---

<div class="brand-system">
  <section class="brand-section">
    <h2>Couleurs</h2>
    <p>Les badges de redirection utilisent des fonds transparents. Utilisez le badge clair sur une surface claire et le badge sombre sur une surface sombre.</p>
    <div class="brand-grid brand-grid-3">
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-redirected-light" aria-hidden="true"></div>
        <h3>Redirected, badge clair</h3>
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
        <h3>Redirected, badge sombre</h3>
        <p><code>#FFFFFF</code></p>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h2>Exemples de badges</h2>
    <div class="brand-grid">
      <div class="brand-panel">
        <h3>Surface claire</h3>
        <div class="brand-badge-stage brand-badge-stage-light">
          <img src="/images/v8s-redirected-fr.svg" alt="Badge redirige par vanityURLs.link">
        </div>
      </div>
      <div class="brand-panel">
        <h3>Surface sombre</h3>
        <div class="brand-badge-stage brand-badge-stage-dark">
          <img src="/images/v8s-redirected-fr-dark.svg" alt="Badge redirige par vanityURLs.link pour surfaces sombres">
        </div>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h2>Fichiers de badges localises</h2>
    <p>Le site met en miroir les SVG de badge depuis le depot code sous <code>/static/images/</code>. La source de verite pour les instances deployees reste <code>defaults/public/{language}/</code> dans le depot code.</p>
    <div class="brand-asset-grid">
      <div class="brand-asset">
        <img src="/images/v8s-redirected-en.svg" alt="Badge anglais">
        <code>v8s-redirected-en.svg</code>
        <code>v8s-redirected-en-dark.svg</code>
      </div>
      <div class="brand-asset">
        <img src="/images/v8s-redirected-fr.svg" alt="Badge francais">
        <code>v8s-redirected-fr.svg</code>
        <code>v8s-redirected-fr-dark.svg</code>
      </div>
      <div class="brand-asset">
        <img src="/images/v8s-redirected-es.svg" alt="Badge espagnol">
        <code>v8s-redirected-es.svg</code>
        <code>v8s-redirected-es-dark.svg</code>
      </div>
      <div class="brand-asset">
        <img src="/images/v8s-redirected-it.svg" alt="Badge italien">
        <code>v8s-redirected-it.svg</code>
        <code>v8s-redirected-it-dark.svg</code>
      </div>
      <div class="brand-asset">
        <img src="/images/v8s-redirected-de.svg" alt="Badge allemand">
        <code>v8s-redirected-de.svg</code>
        <code>v8s-redirected-de-dark.svg</code>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h2>Typographie</h2>
    <h3>Polices actuelles du site</h3>
    <p>Le site auto-heberge Inter Variable pour l'interface et les textes, puis JetBrains Mono pour le code. Les fichiers vivent sous <code>/static/fonts/</code> et sont declares dans <code>assets/css/main.css</code>.</p>
    <h3>Reference typographique</h3>
    <p>La surface de marque actuelle utilise des tokens fluides de type et d'espacement. Gardez les grands titres pour les ouvertures de page et utilisez des titres plus serres dans les panneaux, tableaux de bord et surfaces de documentation.</p>
  </section>

  <section class="brand-section">
    <h2>Notes d'usage</h2>
    <ul>
      <li>Utilisez les badges SVG.</li>
      <li>Gardez les fonds de badge transparents.</li>
      <li>Conservez le texte localise.</li>
      <li>Ne rasterisez pas les badges.</li>
      <li>N'ajoutez pas de fond opaque.</li>
      <li>Ne recolorez pas une seule langue.</li>
    </ul>
  </section>
</div>
