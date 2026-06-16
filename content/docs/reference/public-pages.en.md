---
aside: false
title: "Public and status pages"
description: "Customize public HTML, shared assets, status pages, and custom page security under custom/public/."
weight: 41
aliases:
  - /docs/reference/status-pages/
  - /docs/customize/public-pages/
  - /docs/customize/status-pages/
---

Use `custom/public/` when an instance needs to replace generated public pages, add public assets, or customize link status pages. Use [Custom overrides](/docs/reference/custom-overrides/) for the broader configuration-file map.

## Public override map

{{< callout type="warning" title="Avoid replacing shared public assets casually" >}}
Default public pages share product-level assets such as `/v8s-style.css` and `/v8s-script.js`. Product-owned default CSS and JavaScript uses the `v8s-` prefix so instance assets like `/script.js`, `/style.css`, `/brand-pages.css`, or `/operator-tools.js` can coexist without replacing the shipped defaults.
{{< /callout >}}

{{< callout type="info" title="Custom HTML uses a compatibility CSP" >}}
Default product HTML keeps the strict product CSP. HTML files that come from `custom/public/` get a separate sandboxed compatibility profile that allows custom inline scripts and styles while omitting `allow-same-origin`. That keeps the page on the same visible host while preventing it from becoming a fully trusted same-origin peer of the built-in pages.
{{< /callout >}}

| Override                           | Path                                                                                                                | Details                                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Brand assets and redirected badges | `custom/public/v8s-logo.svg`, `custom/public/favicon.svg`, `custom/public/{language}/v8s-redirected.svg`            | [Brand](/docs/reference/brand/)                                                                                                      |
| Footer and legal pages             | `custom/public/privacy.html`, `custom/public/terms.html`, `custom/public/abuse.html`, `custom/public/security.html` | [Footer & pages](/docs/customize/footer-pages/)                                                                                      |
| Localized public pages             | `custom/public/fr/index.html`, `custom/public/es/404.html`, and similar language paths                              | [Internationalization](/docs/reference/i18n/)                                                                                        |
| Lookup page                        | `custom/public/lookup/index.html`                                                                                   | [Link format](/docs/reference/link-format/)                                                                                          |
| Dashboard shell                    | `custom/public/_stats/index.html`                                                                                   | [Reading your vanityURLs admin dashboard](/blog/reading-your-admin-dashboard/) and [Access control](/docs/customize/access-control/) |
| Headers                            | `custom/public/_headers`                                                                                            | [Runtime security approach](/docs/reference/runtime-security/)                                                                       |

## Status pages

The Worker serves specific files for link and routing states. To build custom status pages from scratch, place the files at these exact paths:

| File                             | Used for                              | Status |
| -------------------------------- | ------------------------------------- | ------ |
| `custom/public/404.html`         | Unknown short links and missing pages | 404    |
| `custom/public/disabled.html`    | Disabled links                        | 403    |
| `custom/public/expired.html`     | Expired links                         | 410    |
| `custom/public/maintenance.html` | Temporarily unavailable links         | 503    |

Localized versions use the [language code](/docs/reference/i18n/#supported-languages) as the first directory segment, for example `custom/public/fr/404.html`. You only need to add the localized pages you actually support. If a localized page is missing, the Worker can fall back to the default page for the requested state.

Only `404.html` has runtime placeholders. If you replace it, include these placeholders where you want runtime context to appear:

```html
<!-- {{SLUG_MESSAGE}} -->
<!-- {{REFERENCE_LINE}} -->
```

`{{SLUG_MESSAGE}}` is replaced with a safe message about the requested slug. `{{REFERENCE_LINE}}` is replaced with a correlation reference that helps with support and log review.

`disabled.html`, `expired.html`, and `maintenance.html` are served as static state pages. They do not require runtime placeholders.

## Doctor ignores

`npm run doctor` warns when copied public files look stale compared with product defaults. When a file is intentionally instance-owned, document that choice in `custom/v8s-custom-overrides.json` instead of copying more defaults just to silence the warning:

```json
{
  "schema_version": "1.0",
  "doctor": {
    "ignore": [
      {
        "path": "custom/public/404.html",
        "codes": ["html-head-assets-stale"],
        "reason": "The instance intentionally uses a custom home-style 404 page."
      }
    ]
  }
}
```

Use exact paths for single files, or `custom/public/fr/**` for a directory. Keep ignores narrow by `codes` or `fixes` so doctor still reports unrelated drift.

Use [v8s-fix](/docs/command-line-interface/v8s-fix/) for drift that should be repaired, and `custom/v8s-custom-overrides.json` for drift that documents a deliberate custom design. For example, an instance can intentionally omit `custom/public/404.html` so the default 404 behavior shakes the current custom page; that decision belongs in the override file rather than in copied default assets.

## Custom page security

During build, vanityURLs writes `build/v8s-custom-assets.json` with the final public paths that came from `custom/public/`. The Worker uses that manifest to apply the custom HTML profile even when an English custom page is copied to the root path, such as `custom/public/en/index.html` becoming `/index.html`.

Only custom HTML documents receive the sandboxed profile. Referenced CSS, JavaScript, images, fonts, and manifests are served as normal assets, while the HTML page's CSP controls what it can load.

The custom HTML profile allows:

- same-host custom CSS and JavaScript, such as `/style.css`, `/script.js`, or instance-specific names
- inline `<script>` and `<style>` for copied or hand-authored custom pages
- forms, popups, popup escape, and downloads
- public lookup calls from the sandboxed opaque origin to `POST /lookup/resolve`
- lookup analytics beacons to `POST /_analytics/lookup`

Because the sandbox does not include `allow-same-origin`, custom JavaScript should not depend on reading host cookies, host `localStorage`, or protected same-origin APIs. Ordinary links such as `<a href="/test">` and JavaScript navigation such as `window.location.href = "/test"` still go through the Worker and can redirect normally.

Only override CSP in `custom/public/_headers` when the instance deliberately accepts a different policy. If you do, keep `frame-ancestors 'none'`, `base-uri 'self'`, and the security headers from the default file unless there is a specific reason to change them. Avoid removing the sandbox for arbitrary custom HTML unless you are intentionally making those pages fully trusted peers of the product pages.

## Build-time SRI

Generating SRI after the final custom overlay is the compatible way to add integrity hashes for redirector assets. The build must copy defaults, apply `custom/public/`, hash the final files in `build/`, and write matching `integrity` attributes into the final HTML.

The risks are mostly operational:

- If the hash is generated before the custom overlay, any replaced asset will fail to load in the browser
- If HTML references are not rewritten consistently across languages and status pages, one page can pin the wrong hash
- If an operator edits built files after hashing, SRI will intentionally break that asset
- If Cloudflare rewrites script bytes or URLs, SRI can fail, which is why content-rewrite features stay off by default

Those failures are noisy and usually safe: the browser blocks the mismatched script or stylesheet instead of running changed bytes. Treat build-time SRI as worthwhile once the build owns all final HTML and assets end-to-end.
