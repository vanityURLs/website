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
Default public pages share product-level assets such as `/style.css` and `/script.js`. If you add JavaScript or CSS for custom pages, use instance-specific filenames such as `/custom-home.css`, `/brand-pages.css`, or `/operator-tools.js` instead of replacing `style.css` or `script.js` casually. Replacing shared files affects every default page you have not overridden yet.
{{< /callout >}}

{{< callout type="warning" title="Custom pages must fit the CSP" >}}
Default pages use external JavaScript and CSS so the shipped Content Security Policy can omit `'unsafe-inline'`. If a custom page uses inline `<script>`, inline `<style>`, event-handler attributes such as `onclick`, or `style=""` attributes, move that code to custom external files or ship a deliberate `custom/public/_headers` CSP override for the affected instance.
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

## Custom page security

The default CSP protects custom pages too unless `custom/public/_headers` changes it. That is intentional: a custom status page can otherwise become the easiest place to accidentally add XSS-prone HTML.

Prefer these patterns:

- Put custom CSS in a file such as `custom/public/brand-pages.css` and link it with `<link rel="stylesheet" href="/brand-pages.css">`
- Put custom JavaScript in a file such as `custom/public/operator-tools.js` and load it with `<script src="/operator-tools.js" defer></script>`
- Replace `onclick`, `onload`, and similar attributes with event listeners in the external script
- Replace `style=""` attributes with classes from the custom stylesheet

Only loosen CSP in `custom/public/_headers` when the instance deliberately accepts that weaker policy. If you do, keep `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, and the security headers from the default file unless there is a specific reason to change them.

## Build-time SRI

Generating SRI after the final custom overlay is the compatible way to add integrity hashes for redirector assets. The build must copy defaults, apply `custom/public/`, hash the final files in `build/`, and write matching `integrity` attributes into the final HTML.

The risks are mostly operational:

- If the hash is generated before the custom overlay, any replaced asset will fail to load in the browser
- If HTML references are not rewritten consistently across languages and status pages, one page can pin the wrong hash
- If an operator edits built files after hashing, SRI will intentionally break that asset
- If Cloudflare rewrites script bytes or URLs, SRI can fail, which is why content-rewrite features stay off by default

Those failures are noisy and usually safe: the browser blocks the mismatched script or stylesheet instead of running changed bytes. Treat build-time SRI as worthwhile once the build owns all final HTML and assets end-to-end.
