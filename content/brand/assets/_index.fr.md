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

```text
custom/
└── public/
    ├── v8s-logo.svg
    ├── favicon.svg
    ├── site.webmanifest
    ├── apple-touch-icon.png
    ├── icon-192.png
    ├── icon-512.png
    └── fr/
        ├── v8s-redirected.svg
        └── v8s-redirected-dark.svg
```
