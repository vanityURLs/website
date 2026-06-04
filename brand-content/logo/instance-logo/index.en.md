---
title: "Instance logo and redirected images"
description: "Instance-owned logos, localized redirected images, and redirected-by badges."
type: brand
weight: 20
---

## Instance redirected images

The instance redirected images are page-local assets for documenting how an instance communicates a localized redirect. They stay in this Hugo page bundle so they are available to the brand site without being copied into the shared `static/images/` output used by the main site.

<div class="brand-system">
  <section class="brand-section">
    <div class="brand-grid">
      <div class="brand-panel">
        <h3>Light surface</h3>
        <div class="brand-badge-stage brand-badge-stage-light">
          <img src="/logo/instance-logo/v8s-redirected-en.svg" alt="Redirected by vanityURLs.link image">
        </div>
      </div>
      <div class="brand-panel">
        <h3>Dark surface</h3>
        <div class="brand-badge-stage brand-badge-stage-dark">
          <img src="/logo/instance-logo/v8s-redirected-en-dark.svg" alt="Redirected by vanityURLs.link image for dark surfaces">
        </div>
      </div>
    </div>
  </section>
</div>

## Localized redirected files

| Language | SVG light               | SVG dark                     | PNG light                               | PNG dark                                     |
| -------- | ----------------------- | ---------------------------- | --------------------------------------- | -------------------------------------------- |
| English  | `v8s-redirected-en.svg` | `v8s-redirected-en-dark.svg` | `v8s-redirected-en-1125-721.png`        | `v8s-redirected-en-dark-1125-721.png`        |
| French   | `v8s-redirected-fr.svg` | `v8s-redirected-fr-dark.svg` | `v8s-redirected-fr-1125-721.png`        | `v8s-redirected-fr-dark-1125-721.png`        |
| Spanish  | `v8s-redirected-es.svg` | `v8s-redirected-es-dark.svg` | `v8s-redirected-es-1125-721.png`        | `v8s-redirected-es-dark-1125-721.png`        |
| Italian  | `v8s-redirected-it.svg` | `v8s-redirected-it-dark.svg` | `v8s-redirected-it-1125-721.png`        | `v8s-redirected-it-dark-1125-721.png`        |
| German   | `v8s-redirected-de.svg` | `v8s-redirected-de-dark.svg` | `v8s-redirected-de-1125-721.png`        | `v8s-redirected-de-dark-1125-721.png`        |
| Preview  | n/a                     | n/a                          | `v8s-redirected-{language}-512-328.png` | `v8s-redirected-{language}-dark-512-328.png` |

All supplied SVG files use a `1125 x 721` viewBox. The canonical PNG exports are `1125 x 721`; preview PNG exports are `512 x 328`.

## Runtime redirected badges

The redirected badges use transparent SVG backgrounds. Choose the light badge for light surfaces and the dark badge for dark surfaces.

<div class="brand-system">
  <section class="brand-section">
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
</div>

## Runtime badge files

| Language | Light                           | Dark                                 |
| -------- | ------------------------------- | ------------------------------------ |
| English  | `/images/v8s-redirected-en.svg` | `/images/v8s-redirected-en-dark.svg` |
| French   | `/images/v8s-redirected-fr.svg` | `/images/v8s-redirected-fr-dark.svg` |
| Spanish  | `/images/v8s-redirected-es.svg` | `/images/v8s-redirected-es-dark.svg` |
| Italian  | `/images/v8s-redirected-it.svg` | `/images/v8s-redirected-it-dark.svg` |
| German   | `/images/v8s-redirected-de.svg` | `/images/v8s-redirected-de-dark.svg` |

## Instance override path

Instance-owned logos and badge overrides belong under `custom/public/` in the redirector repository.

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

## Brand page bundle

This brand page stores its own reference assets beside the Markdown source.

{{< filetree/container >}}
{{< filetree/folder name="brand-content" >}}
{{< filetree/folder name="logo" >}}
{{< filetree/folder name="instance-logo" annotation="page bundle" >}}
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
