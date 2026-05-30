---
aside: false
title: "Marque"
description: "Decider les valeurs de marque publiques utilisees par les pages vanityURLs gerees par l'installateur."
weight: 12
aliases:
  - /docs/brand/
  - /fr/docs/brand/
  - /docs/customize/brand/
  - /fr/docs/customize/brand/

---

La marque contrôle le wordmark public, la courte ligne sous les pages légales et de confiance générées, et les assets publics par défaut copiés dans `custom/public/` au moment du build.

Vous pouvez personnalisér pendant `npm run setup` ou en mettant à jour manuellement les fichiers dans `custom/`.

Si `operator.operator_domain` est défini dans `custom/v8s-site-config.json`, les pages générées lient le nom légal de l'opérateur dans le slogan vers ce domaine. Par exemple, `Un service de liens courts pour les projets de Example Inc.` peut lier `Example Inc.` vers `https://example.com`.

## Questions de setup

| Question de setup | Quand elle apparaît | Recommandation phase 1 | Personnalisation ultérieure | Ce que cela contrôle |
| --- | --- | --- | --- | --- |
| Configure branding now? | Toujours | Utilisez `Y` lorsque vous voulez des pages publiques gérées par l'installateur | Utilisez `N` lorsque vous maintenez déjà `custom/public/` à la main | Détermine si setup pose les questions de marque maintenant |
| Add a slogan line under the domain name on your pages...? | Lorsque la marque est activée | Utilisez `Y` lorsque vous voulez une courte ligne sous le wordmark du domaine | Utilisez `N` lorsque le wordmark du domaine doit rester seul | Détermine si les pages générées incluent une courte ligne sous le wordmark du domaine bicolore |
| Brand slogan `[language]` | Lorsque la ligne de slogan est activée | Utilisez les valeurs localisées générées lorsqu'elles conviennent | Gardez chaque slogan assez durable pour apparaître sur les pages confiance, confidentialité, conditions et sécurité | Texte localisé affiché sous le wordmark du domaine bicolore sur les pages publiques générées |
| Copy default web pages to custom/public with a split-color domain wordmark? | Lorsque la marque est activée | Utilisez `Y` pour une première instance | Utilisez `N` lorsque des pages custom existent déjà et ne doivent pas être remplacées | Détermine si setup copie les pages publiques modifiables dans `custom/public/` et applique le wordmark bicolore |
| Black wordmark portion | Lorsque les pages publiques copiées sont activées | Préfixe du domaine, comme `v8s.` | Utilisez la portion qui doit apparaître dans la couleur de marque sombre | Première partie du wordmark de la page d'accueil et des pages publiques |
| Green wordmark portion | Lorsque les pages publiques copiées sont activées | Suffixe du domaine, comme `link` | Utilisez la portion qui doit apparaître en teal vanityURLs | Deuxième partie du wordmark de la page d'accueil et des pages publiques |

Vous pouvez relancer `npm run setup` plus tard. L'installateur lit les valeurs de marque existantes et les propose comme défauts, donc vous pouvez commencer avec la séparation générée et raffiner les assets plus tard.

Les slogans localisés sont stockes dans `custom/v8s-site-config.json` sous `branding.slogan`. Les instances existantes qui ont encore un seul slogan texte continuent de fonctionner; setup écrit la map localisée lors des nouveaux passages de branding.

## Surcharges d'assets d'instance

Placez les assets de marque propres à l'instance sous `custom/public/` pour qu'ils remplacent les assets publics par défaut pendant le build. Les badges redirigés vivent aussi dans les répertoires publics localisés.

{{< filetree/container >}}
{{< filetree/folder name="custom" >}}
  {{< filetree/folder name="public" annotation="surcharges d'assets publics propres à l'instance" >}}
    {{< filetree/file name="v8s-logo.svg" >}}
    {{< filetree/file name="favicon.svg" >}}
    {{< filetree/file name="site.webmanifest" >}}
    {{< filetree/file name="apple-touch-icon.png" >}}
    {{< filetree/file name="icon-192.png" >}}
    {{< filetree/file name="icon-512.png" >}}
    {{< filetree/folder name="fr" annotation="surcharges de badges localisés" >}}
      {{< filetree/file name="v8s-redirected.svg" >}}
      {{< filetree/file name="v8s-redirected-dark.svg" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

## Pages publiques gerees par l'installateur

`npm run setup` peut copier `defaults/public/` vers `custom/public/`, remplacer le wordmark `Vanity` + `URLs` par les portions noire et verte configurées, mettre à jour les libellés et liens de marque, puis retirer les langues non supportées.

L'installateur enregistre ces choix dans `custom/v8s-site-config.json` pour que les executions repétées restent prévisibles. Si `custom/public/` contient dejà des fichiers et n'est pas marque comme gere par l'installateur, setup refuse de le remplacer sauf avec `--force`.

Lorsque vous utilisez `custom/public/`, gardez `i18n.supported_languages` aligné avec les pages localisées que vous supportez vraiment. Voir [Internationalisation](/fr/docs/reference/i18n/) pour les règles de répertoires de langue.

## Systeme visuel vanityURLs

Le système visuel vanityURLs couvre actuellement les couleurs de badges, les fichiers de badges localisés, les notes de typographie, la configuration du wordmark d'instance et les surcharges d'assets propres à l'instance. Pour le récit de personnalisation, lisez [Habiller votre domaine court](/fr/blog/branding-your-short-link-domain/).

<div class="brand-system">
  <section class="brand-section">
    <h3>Couleurs des badges</h3>
    <p>Les badges de redirection utilisent des fonds transparents. Utilisez le badge clair sur une surface claire et le badge sombre sur une surface sombre.</p>
    <div class="brand-grid brand-grid-3">
      <div class="brand-panel">
        <div class="brand-swatch brand-swatch-redirected-light" aria-hidden="true"></div>
        <h4>Redirected, badge clair</h4>
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
        <h4>Redirected, badge sombre</h4>
        <p><code>#FFFFFF</code></p>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h3>Exemples de badges</h3>
    <div class="brand-grid">
      <div class="brand-panel">
        <h4>Surface claire</h4>
        <div class="brand-badge-stage brand-badge-stage-light">
          <img src="/images/v8s-redirected-fr.svg" alt="Badge redirige par vanityURLs.link">
        </div>
      </div>
      <div class="brand-panel">
        <h4>Surface sombre</h4>
        <div class="brand-badge-stage brand-badge-stage-dark">
          <img src="/images/v8s-redirected-fr-dark.svg" alt="Badge redirige par vanityURLs.link pour surfaces sombres">
        </div>
      </div>
    </div>
  </section>

  <section class="brand-section">
    <h3>Fichiers de badges localisés</h3>
    <p>Le site met en miroir les SVG de badge depuis le dépôt code sous <code>/static/images/</code>. La source de vérité pour les instances déployées reste <code>defaults/public/{language}/</code> dans le dépôt code.</p>
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
    <h3>Typographie</h3>
    <h4>Polices actuelles du site</h4>
    <p>Le site auto-héberge Inter Variable pour l'interface et les textes, puis JetBrains Mono pour le code. Les fichiers vivent sous <code>/static/fonts/</code> et sont déclarés dans <code>assets/css/main.css</code>.</p>
    <h4>Référence typographique</h4>
    <p>L'implémentation <code>bhdicaire-com</code> utilise Red Hat Display, Red Hat Text, Red Hat Mono et Source Serif 4 avec des tokens fluides de type Utopia. Cette page reprend seulement l'approche fluide, limitée à <code>.brand-system</code>, pour garder le reste du site stable jusqu'à la mise à jour des logos.</p>
  </section>

  <section class="brand-section">
    <h3>Configuration du wordmark d'instance</h3>
    <p>Les instances gerees par l'installateur peuvent stocker un wordmark en deux couleurs dans <code>custom/v8s-site-config.json</code>. La portion verte devrait utiliser le teal vanityURLs sauf si l'instance à un système local volontaire.</p>
    <p>Lorsque la marque est activée, l'installateur peut copier les pages publiques modifiables dans <code>custom/public</code>, ajouter un slogan localisé sous les wordmarks des pages publiques générées et séparer le wordmark du domaine en un préfixe foncé et un suffixe vert.</p>
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
    <p><img src="/images/docs/split-color-domain-wordmark.svg" alt="Exemple de wordmark de domaine bicolore"></p>
  </section>

  <section class="brand-section">
    <h3>Notes d'usage</h3>
    <ul>
      <li>Utilisez les badges SVG.</li>
      <li>Gardez les fonds de badge transparents.</li>
      <li>Conservez le texte localisé.</li>
      <li>Lancez <code>npm run optimize:badges</code> après modification des SVG de badge par défaut dans le dépôt code.</li>
      <li>Ne rasterisez pas les badges.</li>
      <li>N'ajoutez pas de fond opaque.</li>
      <li>Ne recolorez pas une seule langue.</li>
      <li>Ne traitez pas les logos actuels comme définitifs pendant la mise à jour.</li>
    </ul>
  </section>
</div>
