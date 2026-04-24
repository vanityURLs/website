---
title: "Why It’s *Not* the Time to Use KV or D1 for Vanity URLs"
date: 2026-05-01
author: "Benoît H. Dicaire"
description: "edge database"
tags: ["release", "guide"]
featured: false 
draft: true
---
The appeal of an _edge database_ is strong—especially when you’re already using Workers or Pages Functions. Reaching for Cloudflare KV or Cloudflare D1 feels like the natural next step.

After some discussion with [Felix Léger](@Felleg), we're convinced that introducing a stateful infrastructure is a premature optimization. Most of VanityURLs' implementation has less than 2,000 links, thus a static, deterministic model is objectively better.

## Building an analytics system

A common justification for KV or D1 is: “I want to count how many times each link is clicked”.

That sounds simple. It is not. The moment you introduce KV or D1, you are no longer solving a redirect problem—you are building an analytics system. Storage is not analytics, A database gives you **raw data**. An analytics tool gives you **answers**.

### What You Actually Take On

* **Write-path logic**

  * Increment counters on every request
* **Edge latency considerations**

  * Writes are not free, especially under load
* **Data modeling**

  * Keys, schemas, aggregation strategy
* **Visualization**

  * Dashboards, queries, reporting
* **Lifecycle management**

  * Migrations, retention, cleanup

At that point, you’ve built a partial analytics pipeline.

By contrast, emitting a server-side event to Umami (or similar tools) gives you:

* Referrers
* Geo distribution
* Time-series trends
* Queryable history

…without building any of it.

## When KV or D1 will make sense

The correct time to introduce a database is when JSON size impacts build time and memory footprint. At this point, we are building a product and changes must be **instant**, not Git-driven.
