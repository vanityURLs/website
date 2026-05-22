---
title: "Choosing privacy-friendly analytics for short links"
date: 2026-05-21
author: "Benoît H. Dicaire"
description: "How to decide whether a vanityURLs instance needs analytics, and how Fathom and Umami fit into a privacy-conscious redirect workflow."
tags: ["guide", "analytics", "privacy"]
featured: false
---

Analytics are optional in vanityURLs. A redirector can work perfectly without them. The first question is not "which analytics tool should I install?" It is "what decision will analytics help me make?"

For short links, analytics are usually useful when you need to know:

- Whether a printed QR code is being scanned
- Which campaign link is used most often
- Whether an old link is still active enough to keep
- Whether a launch link is receiving unexpected traffic
- Whether a public link is being abused

If you only need reliable redirects, skip analytics during the first installation. Add them once the instance works.

## Why third-party analytics can make sense

Self-hosting analytics is possible, but it creates another system to patch, back up, monitor, and secure. A third-party analytics service can be a better fit for a small redirector because the provider handles uptime and maintenance.

The tradeoff is that you are adding a processor for traffic metadata. Your privacy page should say which provider you use, what events you send, and how long data is retained.

## Fathom

Fathom is a hosted privacy-focused analytics service. It is a good fit when you want a managed product, a simple dashboard, and minimal operational work.

Pros:

- Managed service with very little setup
- Clear product focus on privacy-friendly web analytics
- Good fit for non-technical operators who need simple reporting

Cons:

- Paid hosted service
- Less control than self-hosting
- Data processing depends on Fathom's terms, regions, and retention options

## Umami

Umami is an open source analytics project with both hosted and self-hosted options. It is a good fit when you want the option to run analytics yourself or use a hosted service with an open source base.

Pros:

- Open source project
- Hosted and self-hosted deployment options
- Good fit for teams that may want more infrastructure control later

Cons:

- Self-hosting adds operational responsibility
- Hosted service still requires reviewing processor terms and retention settings
- More flexible deployment choices can mean more decisions

## What vanityURLs sends

vanityURLs can send server-side events from the Worker. That means no browser tracking script is required on redirect pages. Events can cover redirect traffic, public page views, misses, and expand-page activity that reaches the Worker.

Traffic stopped before the Worker, such as requests blocked by [Cloudflare Access](/docs/access-control/), WAF rules, rate limiting, or bot controls, will not appear in analytics because vanityURLs never receives it.

## A practical recommendation

For the first deployment, leave analytics off. Once the redirector works, decide whether you need reporting.

Choose Fathom when you want the simplest managed product. Choose Umami when you want an open source analytics path or may eventually self-host. Choose neither when you do not have a concrete question analytics will answer.

Whatever you choose, store the site ID, API endpoint, secrets, retention choices, and account recovery information in your password manager.
