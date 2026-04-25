---
title: "Privacy"
description: "vanityURLs.link privacy policy — no cookies, no client-side trackers, minimal aggregate analytics handled at the edge."
---

{{< callout type="note" title="Last reviewed: April 2026" >}}
This policy applies only to the current website (e.g., `vanityURLs.link`), not to sites built with vanityURLs.
{{< /callout >}}

vanityURLs.link is a documentation website for an open-source project. We take your privacy seriously.

### No cookies, no client-side trackers

This website sets no cookies. It does not use tracking pixels, browser fingerprinting, or any JavaScript-based analytics. Your browser talks only to `vanityurls.link` — never to a third-party analytics server.

### Aggregate analytics handled at the edge

We count page views to understand which documentation pages are useful. This is done server-side, at the Cloudflare edge, using [Umami](https://umami.is/) (open source, EU-hosted). For each HTML page you load, our edge Worker emits a single event to Umami containing:

- the page URL (path only, no query string from your browser's address bar is persisted beyond what's in the URL),
- the referring URL, if your browser sent one,
- your `Accept-Language` header's first value (e.g., `fr-CA`),
- a derived country from your IP (the IP is sent to Umami so it can derive the country; Umami hashes IPs rather than storing them).

No unique identifier, cookie, or session ID is set in your browser. No event is fired for asset requests (CSS, fonts, images, search index chunks).

### No third-party scripts

We do not load third-party analytics, advertising, or social tracking scripts in your browser. Fonts are served directly from `vanityurls.link` — no external typography requests, no data shared with Google.

### Cloudflare

The site is hosted on Cloudflare Workers Static Assets. Cloudflare may collect standard access logs (IP address, request path, timestamp) as part of their infrastructure operation. This data is governed by [Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/).

### Search

The site's search feature uses [Pagefind](https://pagefind.app/), a client-side search library. All search queries are processed locally in your browser; they are never sent to any server.

### Contact

If you have questions about privacy, open an issue in the [website repository](https://github.com/vanityURLs/website).
