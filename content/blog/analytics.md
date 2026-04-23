---
title: "Short URLs Analytics ≠ Page Analytics"
date: 2026-05-01
author: "Benoît H. Dicaire"
description: "Short URLs Analytics ≠ Page Analytics"
tags: ["release", "guide"]
featured: true
draft: true
---
Short URLs presents a unique architectural challenge: there is no page view. When a user clicks a short link, the transaction happens at the edge in milliseconds. Most analytics tools—built for the era of "Single Page Apps" and "Page Load" events—are fundamentally misaligned with this behavior. 

If you want to track short links without compromising on privacy or performance, you have to change your mental model from "Page Views" to "Edge Events."

> Short URL analytics is not about counting page views—it is about capturing **intent at the moment of redirection**.

There is no page lifecycle:

* No render
* No session
* No engagement metrics

Only a **single event**:

```
Request → Resolve → Redirect

    Zero Client-Side JS: No cookies, no fingerprinting, and no browser-based tracking scripts.

    Better Data Retention: Unlike Cloudflare’s 30-day window, tools like Plausible or Umami keep your data for years.

    Bot Awareness: You decide whether to filter out bots or count them—something browser-based JS can't do.

    Custom Context: You can send specific metadata, like the request.cf.country or a "Campaign" tag, that isn't available in standard logs.



## The Cloudflare Conundrum: Web vs. Zone Analytics

As we're already using Cloudflare, you might think we’re already covered with [web]() & [zone analytics]() but they're not designed for this use case.

Cloudflare Web Analytics (The Browser Beacon)
This is the standard JavaScript-based model. You drop a snippet on your site, and it tracks users.

    The Problem: Short URLs don't have a "page" to host the snippet. To make this work, you have to "fake" a page load in a Function.

    The Limits: You’re dealing with a 30-day data retention cap and significant sampling (often 10%). If you need to know how a link performed six months ago, you’re out of luck.
    

Cloudflare Zone-Level Analytics (The Edge Telemetry)

This happens at the DNS/Proxy level. It’s accurate because it sees every request, including bots.

    The Problem: It’s infrastructure telemetry, not a marketing dashboard. It knows /gh was hit 500 times, but it doesn't easily show you where those people went (the resolved target) or allow for custom event grouping (e.g., "all social media links").

The "Middle Way": Server-Side Event Tracking

The most robust model for a privacy-first engine is using Pages Functions to emit Server-Side Events to a dedicated tool like Umami, Plausible, or Fathom.

In this model, your Function acts as a proxy. When a request hits the edge:

    Resolve: The Function finds the target URL.

    Emit: The Function sends a POST request to your analytics API (e.g., /api/send).

    Wait: Using context.waitUntil(), the analytics ping happens in the background while the user is immediately redirected.

```

Short URL analytics isn't about counting page loads; it's about capturing intent at the moment of redirection. By moving tracking to the server side via a Pages Function, you align correctness with observability—getting the data you need without sacrificing the privacy of your users.
