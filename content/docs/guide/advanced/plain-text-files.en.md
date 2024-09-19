---
title: Plain Text Files
linkTitle: Text Files
---
The secret sauce are two plain text files:
  * `build/_redirects` based on this [Cloudflare documentation](https://developers.Cloudflare.com/pages/platform/redirects)
  * `build/_headers` based on this [Cloudflare documentation](https://developers.Cloudflare.com/pages/platform/headers/)

## _redirects

Make sure to put all the items with placeholders or splats at the end of the `build/_redirects`.

```bash
/mail https://outlook.office.com/ 301
/github https://github.com/bhdicaire/ 301
/github/* https://github.com/bhdicaire/:splat
```

> Pages uses HTTP validation and needs to hit an HTTP endpoint during validation. If another Cloudflare product is in the way (such as Access, a redirect, a Worker, etc.), validation cannot be completed.

## _headers
I'm using the `build/_headers` to include the following items to Cloudflare Pages responses, don't forget to change the URLs for pages.dev and your custom domain:
```html
https://xyz.pages.dev/*
  X-Robots-Tag: noindex
  X-Content-Type-Options: nosniff

https://example.com/*
  X-Robots-Tag: noindex
  X-Content-Type-Options: nosniff
```
## Questions or Feedback?

{{< cards >}}
  {{< card link="https://github.com/orgs/vanityURLs/discussions" title="Discussions" icon="template">}}
  {{< card link="https://github.com/vanityURLs/vanityURLs/issues" title="Issues" icon="server">}}
{{< /cards >}}