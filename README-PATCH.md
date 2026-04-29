# vanityURLs — round 17: fix broken tag term pages + sitemap cleanup

Two related fixes addressing broken UX and SEO clutter.

## What was wrong

Four tag URLs in your sitemap rendered as empty pages:

- `/en/tags/guide/`
- `/en/tags/release/`
- `/en/tags/tutorial/`
- `/en/tags/personal/`

(Plus all four FR equivalents.)

Each rendered as `<h1>Tags</h1>` followed by an empty `<div>`. No post listings, no useful content. Anyone clicking a tag link from a blog post landed on a dead page.

### Why it was broken

Hugo 0.146 changed taxonomy template lookup behavior:

> "Since 0.146, terms with default html output format are using the taxonomy.html template." — [Hugo Discourse](https://discourse.gohugo.io/t/terms-using-taxonomy-templates-for-html-since-0-146/54317)

Your repo had:
- `layouts/tags/taxonomy.html` — a tag cloud (intended for the index page `/tags/`)
- `layouts/tags/list.html` — a card grid of posts (intended for term pages `/tags/<term>/`)

But Hugo 0.146+ matches `tags/taxonomy.html` to BOTH the index AND the term pages — `tags/list.html` was never reached. So the cloud rendered everywhere, and `.Data.Terms.ByCount` returns nothing on a term page (it's a method that only populates on the taxonomy index), giving you the empty cloud.

You wouldn't have caught this in Hugo 0.123 because the lookup behavior was different — meaning the bug surfaced when production upgraded to 0.158+.

### How sitemap pollution made it worse

Your sitemap included `/en/categories/` even though no content uses the `category` taxonomy — Hugo auto-generates the taxonomy index whether or not it has terms. That's a low-quality URL exposed to search engines.

## The fix

### 1. Rename `layouts/tags/list.html` → `layouts/tags/term.html`

Hugo's lookup priority for term pages (Hugo 0.146+):

1. `tags/term.html` ← winner (most specific, matches the page kind)
2. `_default/term.html`
3. `tags/taxonomy.html`
4. `_default/taxonomy.html`
5. `tags/list.html`
6. `_default/list.html`

By naming the file `term.html`, it's the most specific match and Hugo picks it first. The `tags/taxonomy.html` (cloud) only matches the taxonomy index page, which is what we want.

While renaming, I also added:
- `{{ if .Pages }}…{{ else }}…{{ end }}` empty-state branch — so a tag with zero published posts shows a friendly message instead of an empty grid
- `.Pages.ByPublishDate.Reverse` — sort newest-first
- `i18n "term_empty"` for the empty-state message

### 2. Drop the unused `categories` taxonomy

`hugo.yml` declared `category: categories`, but no content uses it. Removed the line. Result: `/en/categories/` and `/fr/categories/` no longer exist, sitemap drops from 42 → 41 URLs per language.

### 3. Add `term_empty` to i18n (EN + FR)

Used by the empty-state branch in `term.html`. EN: `"No posts yet."`. FR: `"Aucun article pour le moment."`

## What you'll see after deploy

Click any tag from a blog post (e.g., the `Release` or `Guide` tag on `/en/blog/introducing-v8s/`). You should now land on a page with:

- Heading: `#Release` (or whatever tag)
- Subtitle: `1 post` / `3 posts` (with proper plural per language — already in your i18n)
- A grid of card-style links to the posts, with cover styling (`blog-cover-release`, `blog-cover-guide`, etc.)

The tag cloud at `/en/tags/` is unchanged — still shows tag names with counts.

## Files in this patch

| File | Change |
|---|---|
| `layouts/tags/term.html` | **Renamed** from `layouts/tags/list.html`, with empty-state and date sort added |
| `layouts/tags/taxonomy.html` | Unchanged (now correctly only matches the taxonomy index) |
| `hugo.yml` | Dropped the unused `category: categories` taxonomy |
| `i18n/en.yml` | Added `term_empty: "No posts yet."` |
| `i18n/fr.yml` | Added `term_empty: "Aucun article pour le moment."` |

Note: this patch involves a **file rename** (`list.html` → `term.html`). Use git workflow for a clean diff:

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
git rm layouts/tags/list.html
unzip -o ~/Downloads/vanityurls-round17.zip
git add -A
git commit -m "fix(tags): repair term pages broken since Hugo 0.146; drop unused categories taxonomy"
git push
```

## Validate after deploy

```bash
# Term page should show post grid
curl -s https://vanityurls.link/en/tags/guide/ | grep -oE '<h2[^>]*blog-card-title[^>]*>[^<]+' | head

# Index should still show cloud
curl -s https://vanityurls.link/en/tags/ | grep -oE 'href=[^>]*tags/[^/]+/[^>]*>#[A-Za-z]+' | head

# /categories/ should 404
curl -sI https://vanityurls.link/en/categories/ | head -1
# HTTP/2 404
```

In Umami, watch for spike in visits to `/en/tags/<term>/` URLs once these pages start showing useful content again.

## What's next

From the deferred list:
- **Showcase color CSS** sanity check (round 9 leftover at `assets/css/showcase-colors.css` template)
- **Trust page** claims accuracy verification against `_headers`
- **Publish/audit** the 9 draft blog posts
- **UTM parameter capture** in the Worker
