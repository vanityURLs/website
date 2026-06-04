---
title: "Logo d'instance et images de redirection"
description: "Logos propres a une instance, images de redirection localisees et badges redirected-by."
type: brand
weight: 20
---

## Images de redirection d'instance

Les images de redirection d'instance sont des assets locaux a cette page pour documenter comment une instance communique une redirection localisee. Elles restent dans ce bundle de page Hugo afin d'etre disponibles sur le site de marque sans etre copiees dans le dossier `static/images/` partage avec le site principal.

<div class="brand-system">
  <section class="brand-section">
    <div class="brand-grid">
      <div class="brand-panel">
        <h3>Surface claire</h3>
        <div class="brand-badge-stage brand-badge-stage-light">
          <img src="/logo/instance-logo/v8s-redirected-fr.svg" alt="Image redirige par vanityURLs.link">
        </div>
      </div>
      <div class="brand-panel">
        <h3>Surface sombre</h3>
        <div class="brand-badge-stage brand-badge-stage-dark">
          <img src="/logo/instance-logo/v8s-redirected-fr-dark.svg" alt="Image redirige par vanityURLs.link pour surfaces sombres">
        </div>
      </div>
    </div>
  </section>
</div>

## Fichiers de redirection localises

| Langue   | SVG clair               | SVG sombre                   | PNG clair                               | PNG sombre                                   |
| -------- | ----------------------- | ---------------------------- | --------------------------------------- | -------------------------------------------- |
| Anglais  | `v8s-redirected-en.svg` | `v8s-redirected-en-dark.svg` | `v8s-redirected-en-1125-721.png`        | `v8s-redirected-en-dark-1125-721.png`        |
| Francais | `v8s-redirected-fr.svg` | `v8s-redirected-fr-dark.svg` | `v8s-redirected-fr-1125-721.png`        | `v8s-redirected-fr-dark-1125-721.png`        |
| Espagnol | `v8s-redirected-es.svg` | `v8s-redirected-es-dark.svg` | `v8s-redirected-es-1125-721.png`        | `v8s-redirected-es-dark-1125-721.png`        |
| Italien  | `v8s-redirected-it.svg` | `v8s-redirected-it-dark.svg` | `v8s-redirected-it-1125-721.png`        | `v8s-redirected-it-dark-1125-721.png`        |
| Allemand | `v8s-redirected-de.svg` | `v8s-redirected-de-dark.svg` | `v8s-redirected-de-1125-721.png`        | `v8s-redirected-de-dark-1125-721.png`        |
| Apercu   | n/a                     | n/a                          | `v8s-redirected-{language}-512-328.png` | `v8s-redirected-{language}-dark-512-328.png` |

Tous les SVG fournis utilisent un viewBox de `1125 x 721`. Les exports PNG canoniques mesurent `1125 x 721`; les exports PNG d'apercu mesurent `512 x 328`.

## Badges de redirection d'execution

Les badges de redirection utilisent des fonds SVG transparents. Utilisez le badge clair sur les surfaces claires et le badge sombre sur les surfaces sombres.

<div class="brand-system">
  <section class="brand-section">
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
</div>

## Fichiers de badges d'execution

| Langue   | Clair                           | Sombre                               |
| -------- | ------------------------------- | ------------------------------------ |
| Anglais  | `/images/v8s-redirected-en.svg` | `/images/v8s-redirected-en-dark.svg` |
| Francais | `/images/v8s-redirected-fr.svg` | `/images/v8s-redirected-fr-dark.svg` |
| Espagnol | `/images/v8s-redirected-es.svg` | `/images/v8s-redirected-es-dark.svg` |
| Italien  | `/images/v8s-redirected-it.svg` | `/images/v8s-redirected-it-dark.svg` |
| Allemand | `/images/v8s-redirected-de.svg` | `/images/v8s-redirected-de-dark.svg` |

## Chemin de surcharge d'instance

Les logos et badges propres a une instance doivent vivre sous `custom/public/` dans le depot du redirecteur.

{{< filetree/container >}}
{{< filetree/folder name="custom" >}}
{{< filetree/folder name="public" annotation="surcharges d'assets publics propres a l'instance" >}}
{{< filetree/file name="v8s-logo.svg" >}}
{{< filetree/file name="favicon.svg" >}}
{{< filetree/file name="site.webmanifest" >}}
{{< filetree/file name="apple-touch-icon.png" >}}
{{< filetree/file name="icon-192.png" >}}
{{< filetree/file name="icon-512.png" >}}
{{< filetree/folder name="fr" annotation="surcharges de badges localises" >}}
{{< filetree/file name="v8s-redirected.svg" >}}
{{< filetree/file name="v8s-redirected-dark.svg" >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

## Bundle de page de marque

Cette page de marque garde ses assets de reference a cote de la source Markdown.

{{< filetree/container >}}
{{< filetree/folder name="brand-content" >}}
{{< filetree/folder name="logo" >}}
{{< filetree/folder name="instance-logo" annotation="bundle de page" >}}
{{< filetree/file name="index.en.md" >}}
{{< filetree/file name="index.fr.md" >}}
{{< filetree/file name="v8s-redirected-en.svg" >}}
{{< filetree/file name="v8s-redirected-en-dark.svg" >}}
{{< filetree/file name="v8s-redirected-en-1125-721.png" >}}
{{< filetree/file name="v8s-redirected-en-512-328.png" >}}
{{< filetree/file name="v8s-redirected-fr.svg" >}}
{{< filetree/file name="v8s-redirected-fr-dark.svg" >}}
{{< filetree/file name="v8s-redirected-es.svg" >}}
{{< filetree/file name="v8s-redirected-es-dark.svg" >}}
{{< filetree/file name="v8s-redirected-it.svg" >}}
{{< filetree/file name="v8s-redirected-it-dark.svg" >}}
{{< filetree/file name="v8s-redirected-de.svg" >}}
{{< filetree/file name="v8s-redirected-de-dark.svg" >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}
