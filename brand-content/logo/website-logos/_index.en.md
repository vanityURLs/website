---
title: "Website logos"
description: "Favicon, app icons, social preview images, and web-specific logo assets."
type: brand
weight: 30
---

## Current files

These files are page-local brand references. The main site can keep using its global favicon and social files while the brand site documents the source set here.

<div class="brand-system">
  <section class="brand-section">
    <div class="brand-grid">
      <div class="brand-panel">
        <h3>Favicon</h3>
        <div class="brand-badge-stage brand-badge-stage-light">
          <img src="/logo/website-logos/favicon.png" alt="vanityURLs favicon">
        </div>
      </div>
      <div class="brand-panel">
        <h3>Social preview</h3>
        <div class="brand-badge-stage brand-badge-stage-light">
          <img src="/logo/website-logos/social.png" alt="vanityURLs social preview">
        </div>
      </div>
    </div>
  </section>
</div>

| Asset                  | File               | Size         |
| ---------------------- | ------------------ | ------------ |
| Favicon, light surface | `favicon.png`      | `512 x 512`  |
| Favicon, dark surface  | `favicon-dark.png` | `513 x 513`  |
| Open Graph default     | `og-default.png`   | `1200 x 630` |
| Social preview         | `social.png`       | `1280 x 641` |

## PNG export guidance

| Use                         | PNG size                     |
| --------------------------- | ---------------------------- |
| Favicon and app icon source | `512 x 512` or larger square |
| Maskable app icon           | `512 x 512` with a safe zone |
| Open Graph image            | `1200 x 630`                 |
| Square social avatar        | `1024 x 1024`                |
| Social banner               | `1500 x 500`                 |

`favicon.png` and `og-default.png` are production-sized. Re-export `favicon-dark.png` to exact `512 x 512` before using it as a production dark-surface icon.
