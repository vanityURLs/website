---
title: "Assets"
description: "Assets telechargeables et emplacements de reference."
type: brand
weight: 4
---

## Assets publics

Les assets publics actuels de marque vivent dans le depot du site sous `static/`.

| Asset                        | Chemin                                       |
| ---------------------------- | -------------------------------------------- |
| Logo principal               | `/logo.svg`                                  |
| Logo d'entete clair compact  | `/vanityURLs-link-logo-slim.svg`             |
| Logo d'entete sombre compact | `/vanityURLs-link-logo-dark-slim.svg`        |
| Image sociale                | `/social.png`                                |
| Badges rediriges             | `/images/v8s-redirected-{language}.svg`      |
| Badges rediriges sombres     | `/images/v8s-redirected-{language}-dark.svg` |

## Assets d'instance

Les assets de marque propres a une instance doivent vivre sous `custom/public/` dans le depot code du redirecteur pour remplacer les assets publics par defaut pendant le build.

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
