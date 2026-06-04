---
title: "Assets"
description: "Downloadable assets and source-of-truth locations."
type: brand
weight: 4
---

## Public assets

The current public brand assets live in the website repository under `static/`.

| Asset                  | Path                                         |
| ---------------------- | -------------------------------------------- |
| Main logo              | `/logo.svg`                                  |
| Slim light header logo | `/vanityURLs-link-logo-slim.svg`             |
| Slim dark header logo  | `/vanityURLs-link-logo-dark-slim.svg`        |
| Social image           | `/social.png`                                |
| Redirected badges      | `/images/v8s-redirected-{language}.svg`      |
| Redirected dark badges | `/images/v8s-redirected-{language}-dark.svg` |

## Instance assets

Instance-owned brand assets belong under `custom/public/` in the redirector code repository so they overlay default public assets during build.

```text
custom/
└── public/
    ├── v8s-logo.svg
    ├── favicon.svg
    ├── site.webmanifest
    ├── apple-touch-icon.png
    ├── icon-192.png
    ├── icon-512.png
    └── en/
        ├── v8s-redirected.svg
        └── v8s-redirected-dark.svg
```
