---
title: "Do We Need an Admin Page?"
date: 2026-05-01
author: "Benoît H. Dicaire"
description: "Do We Need an Admin Page"
tags: ["release", "guide"]
featured: true
draft: true
---
Short answer:

> **Yes—but not for creating links.**

The instinct when building a short URL service is to add a web-based admin panel to “manage everything.” That usually leads to duplication, complexity, and eventually two competing sources of truth.

A better framing changes the design entirely.

---

## Reframe the Problem

The CLI (`lnk`) already does link creation extremely well:

* Generates shortcodes
* Validates collisions
* Updates `.lnk` files
* Commits and deploys via Git

That workflow is:

* Fast
* Deterministic
* Version-controlled

Rebuilding that in a web form adds:

* Duplicate validation logic
* Another write path
* More failure modes

> **Creation is solved. The admin page is not for creation.**

---

## What the Admin Page Is Actually For

The real gap is not creating links—it’s **operating on the 800+ links that already exist**.

Examples:

* “Which links haven’t been clicked in 6 months?”
* “What does `/gromus` point to again?”
* “Which targets are broken or expired?”
* “Which prefixes (`/github/*`) get the most usage?”

These are **read-heavy, exploratory tasks**.

They are difficult in Bash. They are natural in a UI.

---

## Start With the Right Scope

> **TL;DR: start with a read-only dashboard.**

Before building edit or delete capabilities, validate that the admin page is actually useful.

A simple table already provides value:

| shortcode | target | description | clicks (7d) | clicks (all time) | last clicked |
| --------- | ------ | ----------- | ----------- | ----------------- | ------------ |

If you don’t open that page regularly, adding write operations won’t fix it.

---

## Authentication: Solve It at the Edge

Use Cloudflare Access.

* Protect `/admin/*` routes
* Choose identity provider:

  * GitHub OAuth
  * Email one-time PIN
* Free for small teams

### Result

* No login system to build
* No sessions to manage
* No password storage

Your Function simply reads:

```text
Cf-Access-Authenticated-User-Email
```

Authentication is handled **before your code runs**.

---

## Persistence: Stay on Git

The admin page should not introduce a new data store.

> The “Save” button should behave exactly like `lnk`.

### Mechanism

* Admin UI calls:

  ```
  PUT /admin/api/links/:shortcode
  ```
* Function updates `.lnk`
* Commit via GitHub Contents API
* Cloudflare Pages rebuilds automatically

### UX

```text
Saving… → Deploying… → Live ✓
```

Latency: ~30–60 seconds.
For an admin tool used occasionally, this is acceptable.

---

## Why Not KV or D1?

Using Cloudflare KV or Cloudflare D1 creates a new problem:

* Two sources of truth:

  * Git-based links
  * Database overrides

This leads to:

* Debugging ambiguity (“which one wins?”)
* Export/sync complexity
* Drift between environments

> Unless you have a clear requirement for runtime mutability, this is unnecessary.

---

## Where KV *Does* Make Sense

One exception: **ephemeral links**.

Use KV when links need:

* Expiration (TTL)
* Temporary usage (events, previews)

### Model

* Git-backed links → permanent
* KV-backed links → temporary

Resolution order in the Function:

```text
Git (JSON) → KV (ephemeral) → 404
```

This keeps concerns clean and avoids mixing lifecycles.

---

## The Real Value: Analytics Integration

The admin page becomes genuinely useful when it answers:

> “What is actually being used?”

By integrating with Umami:

* Fetch click data server-side
* Join with link definitions
* Expose as a single dataset

### Example Output

| shortcode | target         | clicks (7d) | last clicked |
| --------- | -------------- | ----------- | ------------ |
| /github   | github.com/... | 42          | 2h ago       |
| /b        | blog/...       | 3           | 4 months ago |

This enables:

* Identifying stale links
* Cleaning up unused entries
* Understanding usage patterns

This is the **primary reason** the admin page exists.

---

## Minimal Architecture

```text
functions/
  [[path]].js                  # redirect engine
  admin/api/links.js           # GET: list + analytics
  admin/api/links/[code].js    # PUT/DELETE (optional)

build/
  admin/index.html             # simple UI
```

### Secrets

Stored via Pages:

* `GITHUB_TOKEN` (repo write access)
* `UMAMI_API_KEY`

### Access Control

* `/admin/*` protected by Cloudflare Access

---

## Implementation Strategy

### Phase 1 — Read-Only Dashboard

* List all links
* Show analytics data
* Sort/filter

**Goal:** validate usage

---

### Phase 2 — Optional Write Features

* Edit target
* Delete link
* Rename shortcode

Only build this if Phase 1 proves valuable.

## Keep It Simple

The biggest risk is overbuilding:

* Full CRUD UI
* Database-backed state
* Complex workflows

None of this is required initially.

> The admin page is a **lens**, not a control plane.

---

## Bottom Line

* Creation belongs in Bash (`lnk`)
* State belongs in Git
* Authentication belongs at the edge
* Analytics belongs in a dedicated tool

The admin page exists to **make your link inventory visible and understandable**.

> Start with read-only.
> If you use it, extend it.
> If you don’t, stop there.
