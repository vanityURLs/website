---
title: "Instance logo and redirected badges"
description: "Instance-owned logos and localized redirected-by badges."
type: brand
weight: 20
---

## Redirected badges

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

## Localized badge files

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
