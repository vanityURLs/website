---
title: "Configuration-as-Code rocks"
date: 2026-05-01
author: "Benoît H. Dicaire"
description: "Configuration-as-Code beats State-in-a-Database for a small-scale short URLs engine every single time"
tags: ["release", "guide"]
featured: false 
draft: true
---
After some discussion with [Felix Léger](@Felleg), we believe that `Configuration-as-Code` beats State-in-a-Database for a small-scale short URLs engine every single time. At sub-2,000 links, a bundled json is not a compromise—it is the optimal design.

vanityURLs is optimized for:

* *Speed** Execute logic at the edge with Pages Functions
* **Simplicity** with minimal moving parts
* **Privacy**  with controlled analytics sent to a purpose-built tool

The greatest architectural sin is solving a problem you don't have yet. For vanityURLs , Configuration as Code beats State in a Database  Keep your redirects in Git, keep your analytics in a dedicated tool, and the complexity low.

At our current scale, the cost of everything—Pages Functions, JSON storage, and the Umami free tier—is effectively zero. Adding a database does not meaningfully change cost, but it **does** increase system complexity, maintenance burden, and failure surface.

## Version Control as a First-Class Feature

Your “database” is Git:

* Full audit trail
* Human-readable diffs
* Reversible changes

This is operationally superior to most lightweight database setups.

## Zero-Latency Reads

* JSON is bundled with the deployment
* No network hop
* No KV lookup
* No SQL query

Resolution happens **in-memory at the edge**.

## Atomic Deployments

Configuration and code ship together:

* No drift between runtime and data
* No “missing record” edge cases
* No synchronization layer

This eliminates an entire class of failure modes.

## Deterministic Behavior

* Same input → same output
* No race conditions
* No eventual consistency concerns

This is exactly what a URL engine should be optimized for.
