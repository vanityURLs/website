---
title: "Evolving the Command Line Interface (CLI)"
date: 2026-05-01
author: "Benoît H. Dicaire"
description: "Command Line Interface (CLI) evolution"
tags: ["release", "guide"]
featured: true
draft: true
---
There is a recurring instinct in engineering: once a small tool becomes *useful*, rewrite it. Our `lnk` CLI is a good example of why that instinct is often misplaced.

Originally written in ~20 minutes, it still performs its job reliably with ~140 lines of Bash orchestrating `grep` and `git`.

## Why We’re Not Rewriting It

A small script that has worked unchanged for years is not a liability—it is a sign that the abstraction is correct.

The CLI succeeds because its scope is intentionally narrow:

* Minimal dependencies
* Deterministic behavior
* Tight integration with Git
* Low cognitive overhead

Rewriting it in Go, Node, or Python would not change what it does:

* Generate (or accept) a shortcode
* Detect collisions
* Prompt for metadata
* Append to `.lnk` files
* Commit and push via Git

It would only introduce:

* Installation friction (toolchains, runtimes)
* More code for identical behavior
* Ongoing maintenance overhead

## Why Bash Still Fits

The CLI is executed infrequently. Its core operation is simple:

```text
append line → git commit → git push
```

The `.lnk` format is equally simple:

* Two columns
* Whitespace-separated
* Comments with `#`

This is exactly where Bash is effective:

* **Zero dependencies** — clone and run
* **Native Git workflow** — no abstraction layer
* **Direct file manipulation** — no parsing complexity

When something goes wrong, the fallback remains explicit and reliable:

```bash
vi static.lnk && git commit
```

## What We Are Improving

We are not rewriting the CLI. We are **hardening it**.

### Focus Areas

* Fail fast on errors (no silent failures)
* Tighten collision detection (avoid false matches)
* Validate against both static and dynamic rules
* Improve Git error handling (clean recovery on push failure)
* Fix quoting and path edge cases

These are small, targeted changes that improve reliability without altering the workflow.

## Where Bash Starts to Creak

Some design choices remain appropriate:

* `$RANDOM` is sufficient for shortcode generation

  * Collisions are detected and retried
  * No need for cryptographic randomness

The pressure comes from new capabilities such as:

* `lnk stats /github` → query analytics APIs
* `lnk list --unused --since 6mo` → correlate usage data
* Bulk imports (CSV, bookmarks)
* Post-deploy validation (HTTP checks)
* Smarter collision detection across patterns

Individually, these are feasible in Bash. Together, they introduce:

* Complex `curl` + `jq` pipelines
* Authentication and pagination handling
* Reduced readability and maintainability

## Strategic Direction

The objective is to extend capabilities in Node companion scripts.

* Keep `lnk` in Bash for:

  * Link creation
  * Core workflow
* Add advanced features as *

shortcodes:

* Not cryptographically secure
* Does not need to be
* Collisions are detected and retried

The architectural shift to edge functions and analytics introduces new categories of functionality to implement:

* `lnk stats /github` → query analytics APIs
* `lnk list --unused --since 6mo` → correlate links with usage
* Smarter collision detection (static + dynamic rules)
* Bulk import (CSV, bookmarks)
* Post-deploy validation (HTTP checks)

Individually, these are doable in Bash. Collectively, they become:

* Verbose (`curl` + `jq` pipelines)
* Hard to maintain
* Error-prone with auth, pagination, and JSON parsing

## Strategic Direction

The goal is not keep `lnk` in Bash to create and manage links and add advanced capabilities as Node companion scripts. We are extending capability without expanding complexity.
