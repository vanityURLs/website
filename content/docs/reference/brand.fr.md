---
aside: false
title: "Marque"
description: "Tokens de marque vanityURLs, polices auto-hebergees, couleurs des badges de redirection, et recommandations d'assets."
weight: 20
aliases:
  - /docs/brand/

---

<div class="brand-system">
  <section class="brand-hero">
    <p class="brand-kicker">Reference de marque</p>
    <h1 class="brand-title">Systeme visuel vanityURLs</h1>
    <p class="brand-lede">Cette page documente les assets de marque, couleurs et fichiers de badges actuels. Pour le recit de personnalisation, lisez <a href="/fr/blog/branding-your-short-link-domain/">Habiller votre domaine court</a>.</p>
  </section>

  <section class="brand-section">
    <h2>Couleurs des badges</h2>
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
    <div class="brand-grid">
      <div class="brand-panel">
        <h3>Polices actuelles du site</h3>
        <p>Le site auto-heberge Inter Variable pour l'interface et les textes, puis JetBrains Mono pour le code. Les fichiers vivent sous <code>/static/fonts/</code> et sont declares dans <code>assets/css/main.css</code>.</p>
      </div>
      <div class="brand-panel">
        <h3>Reference typographique</h3>
        <p>L'implementation <code>bhdicaire-com</code> utilise Red Hat Display, Red Hat Text, Red Hat Mono et Source Serif 4 avec des tokens fluides de type Utopia. Cette page reprend seulement l'approche fluide, limitee a <code>.brand-system</code>, pour garder le reste du site stable jusqu'a la mise a jour des logos.</p>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h2>Configuration du wordmark d'instance</h2>
    <p>Les instances gerees par l'installateur peuvent stocker un wordmark en deux couleurs dans <code>custom/v8s-site-config.json</code>. La portion verte devrait utiliser le teal vanityURLs sauf si l'instance a un systeme local volontaire.</p>
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
    <h2>Surcharges d'assets d'instance</h2>
    <p>Placez les assets de marque propres a l'instance sous <code>custom/public/</code> pour qu'ils remplacent les assets publics par defaut pendant le build.</p>
    <pre class="brand-code"><code>custom/public/v8s-logo.svg
custom/public/favicon.svg
custom/public/site.webmanifest
custom/public/apple-touch-icon.png
custom/public/icon-192.png
custom/public/icon-512.png</code></pre>
  </section>

  <section class="brand-section">
    <h2>Notes d'usage</h2>
    <div class="brand-grid">
      <div class="brand-panel">
        <h3>A faire</h3>
        <p>Utilisez les badges SVG, gardez les fonds transparents, conservez le texte localise, et lancez <code>npm run optimize:badges</code> apres modification des SVG de badge par defaut dans le depot code.</p>
      </div>
      <div class="brand-panel">
        <h3>A eviter</h3>
        <p>Ne rasterisez pas les badges, n'ajoutez pas de fond opaque, ne recolorez pas une seule langue, et ne traitez pas les logos actuels comme definitifs pendant la mise a jour.</p>
      </div>
    </div>
  </section>
</div>
