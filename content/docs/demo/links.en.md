---
title: "Link Examples"
description: "The real static.lnk and dynamic.lnk from v8s.link, fully annotated."
nav_order: 33
---

These are the actual redirect files from the [v8s.link repository](https://github.com/vanityURLs/v8s.link), annotated to explain every rule — including what to keep, what to update, and which patterns are worth copying.

## static.lnk

```
/ https://vanityURLs.link/

/blog     https://vanityURLs.link/en/blog

/github   https://github.com/vanityURLs/
/git      https://github.com/vanityURLs/v8s.link

/gitlab   https://gitlab.com/bhdicaire/

/linkedin https://linkedin.com/in/bhdicaire/
/x        https://twitter.com/BHDicaire/

/ALM      https://brew.sh
/VVa      https://github.com/vanityURL
/HHU      https://github.com/vanityURLs/vanityURLs/issues/21
```

### Line-by-line

**`/ → vanityURLs.link`** — The root redirect is the most important rule. Anyone who visits `v8s.link/` (with no path) is redirected to the main site. For your deployment, set this to your main personal or project website.

{{< callout type="note" title="No status code = 301" >}}
None of the rules in this file include an explicit status code. Cloudflare Pages defaults to `301` (permanent) when the code is omitted. That's correct for `static.lnk`.
{{< /callout >}}

**`/blog → vanityURLs.link/en/blog`** — A useful pattern: short links into subsections of another site. Note the `/en/blog` path — this is language-specific. If you manage a bilingual site, consider `/blog-en` and `/blog-fr` variants.

**`/github` and `/git`** — Two separate links to two different things: the GitHub organisation and this specific repository. This is intentional — `v8s.link/github` gives a tour of all vanityURLs projects, `v8s.link/git` goes directly to the repo for this domain.

**`/gitlab → gitlab.com/bhdicaire/`** — An example of linking to a different code host. You can link to any URL, not just GitHub.

**`/linkedin` and `/x`** — Standard social profile links. Copy this pattern for any social platform you use.

**`/ALM`, `/VVa`, `/HHU`** — These are stale test entries that don't follow naming conventions. `/ALM` points to Homebrew (unrelated), `/VVa` has a typo (should be `vanityURLs`), and `/HHU` points to a specific GitHub issue. These are fine in a private repo but confusing in a reference. **Don't copy these patterns** — use descriptive paths like `/homebrew`, `/issues/21`.

### What to use in your own static.lnk

A clean starter template:

```
# Social profiles
/github    https://github.com/YOURNAME                    301
/linkedin  https://linkedin.com/in/YOURNAME               301
/x         https://x.com/YOURNAME                         301
/mastodon  https://mastodon.social/@YOURNAME              301

# Main destinations
/           https://YOURWEBSITE.com                       301
/blog       https://YOURWEBSITE.com/blog                  301
/resume     https://YOURWEBSITE.com/cv.pdf                301

# Project links
/project1   https://github.com/YOURNAME/project1          301
```

## dynamic.lnk

```
/github/*  https://github.com/vanityURLs/:splat
```

This single line is the most powerful pattern in the v8s.link deployment. It uses a **splat redirect** to forward any path under `/github/` to the corresponding path under `github.com/vanityURLs/`.

### How splats work

```
Request:  v8s.link/github/vanityURLs
Redirect: github.com/vanityURLs/vanityURLs  302

Request:  v8s.link/github/website
Redirect: github.com/vanityURLs/website     302

Request:  v8s.link/github/v8s.link
Redirect: github.com/vanityURLs/v8s.link    302
```

The `*` matches everything after `/github/`. The `:splat` inserts that captured value into the destination URL.

### Why `dynamic.lnk` for a splat?

The splat here acts like a namespace — all vanityURLs repositories are accessible under `v8s.link/github/`. Because the destination (GitHub org membership) changes more frequently than stable personal links, it belongs in `dynamic.lnk`. If the org ever moves or renames repos, updating one line deploys the change everywhere.

### More splat patterns worth using

```
# Forward all docs subsections:
/docs/*    https://vanityurls.link/en/docs/:splat   302

# Forward blog posts by slug:
/posts/*   https://yourblog.com/posts/:splat         302

# Namespace your GitHub repos:
/gh/*      https://github.com/YOURNAME/:splat        302

# Namespace conference talks by year:
/talks/*   https://slides.example.com/:splat         302
```

{{< callout type="warning" title="Splat order matters" >}}
Cloudflare evaluates `_redirects` rules top to bottom. If you have `/github` (static, from `static.lnk`) and `/github/*` (splat, from `dynamic.lnk`), the static rule takes priority over the splat for the exact path `/github` — and the splat handles everything longer. This is the correct behaviour, but be aware of it when combining both.
{{< /callout >}}

## The merged `build/_redirects`

After `cat static.lnk dynamic.lnk > build/_redirects`, the final file looks like this:

```
/ https://vanityURLs.link/
/blog https://vanityURLs.link/en/blog
/github https://github.com/vanityURLs/
/git https://github.com/vanityURLs/v8s.link
/gitlab https://gitlab.com/bhdicaire/
/linkedin https://linkedin.com/in/bhdicaire/
/x https://twitter.com/BHDicaire/
/ALM https://brew.sh
/VVa https://github.com/vanityURL
/HHU https://github.com/vanityURLs/vanityURLs/issues/21
/github/* https://github.com/vanityURLs/:splat
```

Cloudflare Pages reads this file and processes it entirely at the edge — no origin server involved.
