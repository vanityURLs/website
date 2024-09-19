---
title: Everything you always wanted to know about URL redirection (but were afraid to ask)
linkTitle: Concept
weight: 1
prev: /docs/install
next: /docs/houba
---
HTTP is a [protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP/Resources_and_specifications) for fetching resources such as HTML documents. You can [redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections#Overview) at the service level, within a page or via JavaScript if enabled.

The simplest way to redirect to another URL is to use an HTML `<meta>` Tag[^1] with the http-equiv parameter set to _refresh_. The content attribute sets the delay before the browser redirects the user to the new web page.

To redirect immediately, set this parameter to zero second for the content attribute.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url='https://github.com/bhdicaire'" />
  </head>
  <body>
    <p>You will be redirected to BH Dicaire's Github soon!</p>
  </body>
</html>
```

However HTTP redirects always execute first thus using Cloudflare page `serverless` component is more elegant. I don't need build a static html page per URL either manually or via a static site generator such as [Hugo](https://gohugo.io/).

## How does it work?
The secret sauce are two plain text files:
  * `build/_redirects` based on this [Cloudflare documentation](https://developers.Cloudflare.com/pages/platform/redirects)
  * `build/_headers` based on this [Cloudflare documentation](https://developers.Cloudflare.com/pages/platform/headers/)

### References
{{< cards >}}
  {{< card link="../advanced/plain-text-files/" title="Plain Text Files" icon="warning" icon="collection">}}
{{< /cards >}}


[^1]: [HTML `<meta>` Tag](https://www.w3docs.com/learn-html/html-meta-tag.html) 