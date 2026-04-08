---
title: "static.lnk"
description: "Your permanent redirect list — the links that don't change."
nav_order: 8
---

`static.lnk` contains your **permanent** redirects. These are links you expect to be stable long-term: social profiles, portfolio URLs, project homepages.

## Format

Plain text, one redirect per line, using the [Cloudflare `_redirects` syntax](/docs/build/_redirects/):

```
# Profile links
/github     https://github.com/yourname           301
/linkedin   https://linkedin.com/in/yourname      301
/twitter    https://x.com/yourname               301

# Projects
/myapp      https://myapp.example.com             301
/portfolio  https://portfolio.example.com         301

# Root — redirect bare domain to your main site
/           https://yourname.example.com          301
```

## Guidelines

- Use `301` (permanent) for links you won't change
- Put the root catchall (`/`) at the **end** of the file, as the last rule in the merged `_redirects` will match first
- Comment with `#` to group related links

## Adding links

Use the `lnk` CLI script:

```bash
lnk add /github https://github.com/yourname
```

Or edit the file directly and commit:

```bash
echo "/github  https://github.com/yourname  301" >> static.lnk
git add static.lnk && git commit -m "add github link" && git push
```

## Organisation tips

{{< callout type="tip" title="Use comments liberally" >}}
Comments (`#`) are fully supported. Group your links by category — social, projects, resources — so the file stays readable as it grows.
{{< /callout >}}

```
# === Social profiles ===
/github   https://github.com/yourname       301
/linkedin https://linkedin.com/in/yourname  301

# === Projects ===
/myapp    https://myapp.example.com         301
```

{{< callout type="note" title="Rule limit" >}}
The Cloudflare Pages free plan supports up to **2,000** redirect rules across your merged `_redirects` file. The Pro plan raises this to 100,000. Most personal and small-team deployments fit comfortably in the free tier.
{{< /callout >}}
