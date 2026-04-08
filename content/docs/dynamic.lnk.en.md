---
title: "dynamic.lnk"
description: "Your temporary redirect list — campaign links, event URLs, and short-lived shortcuts."
nav_order: 9
---

`dynamic.lnk` contains your **temporary** redirects: conference talks, marketing campaigns, event registrations, and anything time-bound.

## Format

Same syntax as `static.lnk`:

```
# 2025 conference talks
/devconf     https://devconf.cz/schedule/talk/12345   302
/rustconf    https://slides.example.com/rustconf25    302

# Active campaigns
/summer-sale https://store.example.com?promo=summer   302
/newsletter  https://newsletter.example.com/subscribe 302
```

Use `302` (temporary) to signal to search engines and caches that the destination may change.

## Maintenance discipline

`dynamic.lnk` tends to accumulate stale entries. A good habit is to add an expiry comment when you create a link:

```
# expires: 2025-09-01
/summit2025  https://summit.example.com/2025  302
```

Review and clean up the file quarterly. Removing a line from `dynamic.lnk` and pushing is all it takes to retire a link — Cloudflare will return 404 for that path after the next deploy.

## Adding links via CLI

```bash
lnk add --dynamic /devconf https://devconf.cz/talk/12345 302
```

## Maintenance discipline

`dynamic.lnk` tends to accumulate stale entries. Add an expiry comment when you create a time-bound link:

```
# expires: 2025-09-01
/summit2025  https://summit.example.com/2025  302
```

Review quarterly. Removing a line and pushing is all it takes to retire a link — Cloudflare returns `404` for that path after the next deploy.

{{< callout type="tip" >}}
Run `lnk validate --live` before each review to surface any destinations that have already gone dead.
{{< /callout >}}
