---
title: "Outlining evolution: the 3-Year Evolution of a Short URL Engine"
date: 2026-05-01
author: "Benoît H. Dicaire"
description: "Outlining evolution: the 3-Year Evolution of a Short URL Engine"
tags: ["release", "guide"]
featured: true
draft: true
---
Building a URL shortener is often cited as the "Hello World" of system design. On the surface, it’s trivial: map a short path to a destination and return a redirect.

But as the requirements for **privacy, performance, and correctness** grow, the architecture must evolve. Over the last three years,vanityURLs has gone through five distinct phases to leverage the edge.

## Phase 1: The Native `_redirects` File (Simplicity First)
In the beginning, I used Cloudflare Pages’ built-in `_redirects` file. It’s a declarative text file that looks like this:
`/coffee  https://starbucks.com  302`

* **The Win:** It was edge-native and extremely fast. No code, no runtime, just pure HTTP 302s.
* **The Wall:** I had zero visibility. Cloudflare’s basic analytics couldn't tell me *who* was clicking or *where* they came from (the referrer). To get privacy-respecting analytics (like Umami or Plausible), I needed a way to trigger a script.

## Phase 2: Meta Refresh (The Analytics Hack)
To get analytics, I moved the redirection to the client side using a static HTML page for every link containing:
`<meta http-equiv="refresh" content="0; url=https://target">`

* **The Win:** I could finally run an analytics script before the redirect happened.
* **The Cost:** The "Visual Flash." Users would see a blank white page for a split second before being whisked away. It felt "janky" and broke the seamless feel of a real redirect.

## Phase 3: The JS + JSON Mapper (Flexibility at a Price)
I then tried to get "clever." I created a single wildcard 404 page that loaded a standard `redirects.json` file (~86KB) via JavaScript. It would parse the JSON, find the match, and run `window.location.replace()`.

* **The Problem:** This was a performance nightmare. To redirect a user, the browser had to:
    1. Load the HTML.
    2. Load the CSS/JS.
    3. Fetch the JSON file.
    4. Parse the JSON.
* **The Verdict:** Multiple network roundtrips for a simple redirect is unacceptable. Furthermore, link preview bots (like those on Slack or Twitter) saw a 404 page instead of the target content.

## Phase 4: The Per-Link HTML Generation (A Dead End)
I briefly considered generating a unique HTML file for every single link during the build process. While this allowed for per-link customization, it didn't solve the "Visual Flash" or the lack of dynamic "splat" support (e.g., `/github/*` → `github.com/*`). It added build complexity without solving the core HTTP problem.

## Phase 5: The Convergence Point (Cloudflare Pages Functions)
The architecture eventually converged on **Pages Functions**. By dropping a script into `/functions/[[path]].js`, I moved the logic from the client's browser to Cloudflare’s Edge.

### How it works:
1.  **Request hits the Edge:** The Function intercepts the path.
2.  **Mapping:** It reads a bundled `redirect-targets.json`.
3.  **Asynchronous Analytics:** It fires a server-side "ping" to Umami using `context.waitUntil()`. This ensures the analytics call doesn't delay the user’s redirect.
4.  **The Response:** It returns a clean, honest **HTTP 302**.

### Why this is the "Final Form":
* **Privacy:** The user’s browser only ever talks to my domain and the destination. I decide exactly what data (Country, Referrer) gets sent to the analytics backend.
* **Correctness:** Bots and crawlers get a real status code. No JS required.
* **Performance:** Zero visual flash. Single request.

## The Decision Matrix: `_redirects` vs. `Functions`

After three years of trial and error, the choice for any new project is now a simple binary:

| Requirement | Recommended Approach |
| :--- | :--- |
| **Simple links, no analytics** | Native `_redirects` |
| **Privacy-first analytics** | Pages Functions |
| **Custom logic / A-B testing** | Pages Functions |
| **Maximum simplicity** | Native `_redirects` |

## Lessons Learned
The evolution of this engine taught me that **the best architecture is the one that removes compromises.** We spent years moving logic to the client (Phase 2 & 3) only to realize that the "old way" of doing things—server-side redirects—was actually the correct way. 

By using **Pages Functions**, we get the best of both worlds: the simplicity of a static-site workflow with the power of an edge-compute runtime. 

If you are still using meta-refreshes or client-side JS for your redirects, it’s time to move to the Edge. Your users (and their privacy) will thank you.
