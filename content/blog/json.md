---
title: "Do We Really Need JSON in This Architecture"
date: 2026-05-01
author: "Benoît H. Dicaire"
description: "Short URLs Analytics ≠ Page Analytics"
tags: ["release", "guide"]
featured: false 
draft: true
---
When building a short URL engine on Cloudflare Pages, the question inevitably comes up:

> Do we actually need JSON, or can we just use `.lnk` directly?

At first glance, JSON looks like an extra step—a transformation layer between your source files and your runtime. In reality, it plays a very specific role in aligning **developer ergonomics** with **edge execution constraints**.

## The Role of JSON in This System

The CLI (`lnk`) writes to simple `.lnk` files:

```text
/github https://github.com/...
/b/*     https://myblog.com/*
```

This format is intentionally optimized for **humans**:

* Easy to read
* Easy to edit
* Git-friendly

However, your runtime—the Cloudflare Pages Function—operates in a different context:

* It expects **structured data**
* It runs at the edge with strict performance constraints
* It benefits from **fast, predictable parsing**

JSON is the bridge between these two worlds.


## The Three Architectural Options

There are three viable approaches. Each has different trade-offs.

### Option 1 — Keep JSON (Current Model)

```text
.lnk → JSON → Pages Function
```

A small script (~25 lines) converts `.lnk` files into `redirect-targets.json`.

The Function:

* Fetches the JSON at cold start
* Parses it once
* Caches it in module scope

#### Why This Works Well

* Separation of concerns:

  * `.lnk` → authoring format
  * JSON → runtime format
* No parsing complexity in the Function
* Compatible with Cloudflare Pages deployment model

#### Cost

* One lightweight build step
* Negligible overhead at your scale

### Option 2 — Parse `.lnk` Directly in the Function

```text
.lnk → Pages Function (runtime parsing)
```

On paper, this is cleaner:

* `.lnk` becomes the single source of truth
* No transformation step

#### The Practical Problem

Cloudflare Pages does **not deploy arbitrary repo files by default**.

* Your `.lnk` files live at the repo root
* The Function only sees the build output

To make this work, you must:

* Move `.lnk` into the build directory **or**
* Add a build step (`cp static.lnk build/`)

At that point:

> You have reintroduced a build step—just a less explicit one.

#### Additional Downsides

* You now parse text formats at runtime
* More logic inside the Function
* Harder to evolve the `.lnk` format safely

### Option 3 — Bundle at Build Time (JS Module)

```text
.lnk → JS module → imported by Function
```

The script generates a JavaScript file:

```javascript
export const redirects = { ... }
```

The Function imports it directly.

#### Advantages

* No fetch at runtime
* No parsing step
* Slightly faster cold starts

#### Trade-offs

* Tighter coupling between build and runtime
* More moving parts in the build pipeline
* Harder to inspect/debug outside the codebase

At your scale, the performance gain is negligible.

## Why JSON Is the Right Balance

JSON is not about performance—it is about **clarity and alignment**.

### 1. Clean Separation

* `.lnk` → human-friendly input
* JSON → machine-friendly representation

Each layer does one thing well.

### 2. Minimal Runtime Complexity

The Function:

* Reads structured data
* Resolves paths
* returns a redirect

No parsing logic, no format ambiguity.

### 3. Predictable Deployment

* JSON is part of the build output
* Always available to the Function
* No implicit file-copy assumptions

### 4. Low Cognitive Overhead

The transformation step is trivial:

> ~25 lines of code, stable, rarely touched

Replacing it does not remove complexity—it just moves it elsewhere.

## What This Is *Not*

This is not a data pipeline.

* No schema evolution
* No transformation logic
* No enrichment

It is simply:

```text
text → structured data
```

Trying to eliminate this step does not simplify the system in a meaningful way.

## When Would JSON Stop Making Sense?

You would revisit this decision if:

* `.lnk` format becomes complex (YAML/metadata/etc.)
* You introduce dynamic link creation (API-driven)
* You need runtime mutability (database-backed)

At that point, JSON is no longer the boundary—**a database is**.

## Bottom Line

You don’t need JSON because the system is complex.
You need JSON because the system is **intentionally simple**.

It provides:

* A clean boundary between authoring and execution
* A predictable deployment artifact
* A minimal, explicit transformation step

> The 25-line script is not overhead.
> It is the smallest possible layer that keeps everything else simple.
