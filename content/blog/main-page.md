---
title: "Adding a Main Web Page: Do We Actually Need One?"
date: 2026-05-01
author: "Félix Léger"
description: "polished landing page"
tags: ["release", "guide"]
featured: false 
draft: true
---
When building a short URL service, the instinct to add a polished landing page comes naturally. It feels incomplete without one.

But stepping back, the question is more fundamental:

> **Who actually lands on the root URL?**

Short links are not discovered—they are **clicked**.
The overwhelming majority of traffic goes directly to `/somekey`, handled by the edge Function.

The homepage is rarely part of the user journey.

---

## The Reality of Traffic

In practice, the root page serves a very small audience:

* The owner (testing, manual use)
* Someone who forgot a link
* A curious visitor who lands on the domain

Only the last group matters from a design perspective—and they arrive **without context**.

---

## The Current Approach

The current homepage is intentionally minimal:

* Monospace input mimicking a browser address bar
* Animated interactions (shake, slide-in button)
* Careful mobile handling (keyboard, viewport)
* Dark mode and visual polish

It is well-crafted and deliberate. The implementation reflects attention to detail.

However, it answers a question that most users never ask.

---

## The Core Issue: Missing Context

A first-time visitor sees:

* A prefix
* A text input
* No explanation

This creates ambiguity:

* Is this a developer tool?
* A personal shortcut system?
* A broken page?

The design leans toward an “art piece,” but the product is a utility.

This gap is not about aesthetics—it is about **orientation**.

> A single line of copy would resolve it:
>
> “A short-link service for personal projects.”

That does not compromise the design. It completes it.

---

## Structural Observations

### 1. Duplicate Logic (`index.html` and `404.html`)

Both pages render essentially the same UI.

This creates:

* Duplication of markup and behavior
* Workarounds (e.g., `sessionStorage` to pass state)
* Higher maintenance cost

With the Function now owning routing, this can be simplified:

> The 404 state is just the homepage with:
>
> * a pre-filled input
> * an error state (e.g., shake animation)

One page. One source of truth.

---

### 2. Input Filtering Is Too Aggressive

Current behavior:

* Characters outside `[a-zA-Z0-9\-_/]` are silently removed as the user types

This creates confusion:

* Pasting a string results in characters disappearing
* No explanation is given

A better model:

* Accept all input
* Validate on submit
* Provide explicit feedback

This shifts from **implicit restriction** to **explicit validation**.

---

### 3. JavaScript Complexity vs. Value

The page includes:

* Viewport calculations for mobile keyboards
* Layout adjustments for full-screen behavior
* Animation logic

It works, but it is compensating for a very specific visual design.

A simpler layout (`min-height: 100svh`) would:

* Reduce complexity
* Improve maintainability
* Preserve most of the UX

This is not a flaw—just an opportunity to rebalance effort vs. impact.

---

## The Real Decision: What Is This Page For?

The current implementation sits between two models:

### Option A — Minimalist / Artistic

* No explanation
* Exploratory interaction
* Possibly hidden features or easter eggs

### Option B — Utility / Functional

* Clear purpose
* Simple input
* Explicit instructions

Right now, it is both—and therefore neither.

This creates friction:

> “What is this?” remains unanswered.

From an accessibility perspective, this is significant:

* Even technical users rely on context
* Lack of explanation increases cognitive load

---

## A Practical Direction

The simplest improvement is also the most impactful:

### Add Minimal Context

* One line of text
* Optional bilingual support (EN/FR)

Example:

```text
A short-link service for personal projects.
Un service de liens courts pour projets personnels.
```

This preserves:

* Visual minimalism
* Intentional design

While solving:

* Orientation
* Accessibility
* First-time comprehension

---

## Secondary Improvements

* Collapse `index.html` and `404.html` into a single page
* Replace input filtering with validation on submit
* Evaluate whether all JS complexity is necessary

These are incremental refinements, not architectural changes.

---

## Bottom Line

Nothing is broken.

The page is well-designed and carefully implemented. The issue is not execution—it is positioning.

> A homepage for a short-link service does not need to be complex.
> It needs to answer one question: *what is this for?*

Once that is clear, everything else—UI, behavior, complexity—can align naturally.
