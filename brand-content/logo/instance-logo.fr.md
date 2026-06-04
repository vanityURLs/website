---
title: "Logo d'instance et badges de redirection"
description: "Logos propres a une instance et badges localises redirected-by."
type: brand
weight: 20
---

## Badges de redirection

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

## Fichiers de badges localises

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
