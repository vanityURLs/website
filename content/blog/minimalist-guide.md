---
title: "The Minimalist’s Guide to a Privacy-First URL Shortener"
date: 2026-05-01
author: "Benoît H. Dicaire"
description: "The Minimalist’s Guide to a Privacy-First URL Shortener on Cloudflare Pages"
tags: ["release", "guide"]
featured: false 
draft: true
---
Most short URL implementations fall into one of two traps: they are either heavyweight monsters requiring a dedicated database and API gateway, or they are flimsy client-side "meta-refresh" hacks that break the back button and leak user data to third-party analytics.

When building my own short URL engine, I wanted a third way. I wanted something that felt like a static site but behaved like a high-performance edge application.

By leveraging **Cloudflare Pages Functions**, I built a redirect engine that is Git-driven, privacy-preserving, and requires exactly zero bytes of JavaScript on the client.

## The Architecture: Simple is Scalable

The core philosophy of this project is to avoid standing up new "infrastructure." Since I’m already using Cloudflare Pages for my site, I used **Pages Functions** to handle the routing. 

Because Functions run on the Workers runtime, you get full access to the Workers API while keeping your deployment workflow tied to your Git repository.

### The Components:
1.  **`redirect-targets.json`**: A simple JSON file in your repository acting as your "database." It maps short paths to destination URLs.
2.  **`functions/[[path]].js`**: A wildcard Cloudflare Function that intercepts every request, checks the JSON, and decides where to send the user.
3.  **Server-Side Analytics**: Instead of a tracking pixel or a heavy JS snippet, the Function itself "pings" the analytics backend (like Umami, Fathom, or Plausible) before the user even lands on the destination.

## Why This Wins on Privacy

The underrated win here isn't just speed—it’s the privacy posture. 

In a standard setup, client-side tracking (like Google Analytics or even client-side Umami) forces the user’s browser to talk directly to a tracking server. This exposes the user's IP, screen size, language settings, and full browser fingerprint.

In this **Server-Side Tracking** model:
* The user’s browser only ever communicates with **your domain** and the **destination**.
* The Cloudflare Function acts as a privacy proxy. It extracts only the data *you* want to share—like the country (`request.cf.country`) and the referrer—and sends it to your analytics backend via a server-to-server POST request.
* **No consent banners required.** Since you aren't dropping cookies or harvesting PII, you stay in the "functional" lane of web browsing.

## The Workflow: Configuration as Code

Adding a new link is as simple as a Git commit. 

```json
// redirect-targets.json
{
  "blog": "https://myplace.com/posts/latest",
  "twitter": "https://twitter.com/myhandle",
  "promo/*": "https://store.com/discount/$1"
}
```

The Function reads this file, resolves the mapping (including "splat" support for dynamic paths), and issues a **proper HTTP 302 redirect**. 

This is "honest" HTTP. There is no "flash" of a loading screen, no "Redirecting you now..." text, and no broken link previews. Bots, archive.org, and social media scrapers see a standard redirect and follow it perfectly.

## Handling Failure (and Success) Gracefully

A common fear with edge functions is: *"What if the analytics call slows down the redirect?"*

Cloudflare’s `context.waitUntil()` is the secret weapon here. It allows the Function to send the redirect response to the user immediately, while keeping the "thread" alive in the background just long enough to finish the analytics ping.

And if the analytics server is down? The system **fails open**. The user still gets their redirect, even if the "ping" fails. Observability should never be a single point of failure for your users.

## Does it Scale?

For most people, a bundled `redirect-targets.json` is more than enough. 
* **At ~800 links:** The JSON file is tiny and fast.
* **At 5,000+ links:** If you find your JSON file is getting too large to bundle, you can effortlessly migrate the logic to **Cloudflare KV** or **D1**. 

But until you hit that scale, don't over-engineer. The "JSON-in-Git" approach gives you a perfect audit log of every link ever created.

## Summary

This approach turns Cloudflare Pages into a powerhouse redirect engine without the "enterprise" overhead. You get:
* **Instant Redirects:** No client-side JS.
* **Git-Driven:** No database to manage.
* **Better Data:** Capture bots and no-JS clients that standard analytics miss.
* **Privacy-First:** You control exactly what data leaves the edge.

If you’re looking for a way to manage links without the privacy baggage of third-party shorteners, the edge is the place to be.
