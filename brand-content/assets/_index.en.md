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

{{< filetree/container >}}
{{< filetree/folder name="custom" >}}
{{< filetree/folder name="public" annotation="instance-owned public asset overrides" >}}
{{< filetree/file name="v8s-logo.svg" >}}
{{< filetree/file name="favicon.svg" >}}
{{< filetree/file name="site.webmanifest" >}}
{{< filetree/file name="apple-touch-icon.png" >}}
{{< filetree/file name="icon-192.png" >}}
{{< filetree/file name="icon-512.png" >}}
{{< filetree/folder name="en" annotation="localized badge overrides" >}}
{{< filetree/file name="v8s-redirected.svg" >}}
{{< filetree/file name="v8s-redirected-dark.svg" >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}
