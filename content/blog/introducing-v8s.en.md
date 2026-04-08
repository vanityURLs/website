---
title: "Say Goodbye to Third-Party URL Shorteners: Introducing VanityURLs"
date: 2024-08-16
author: "Félix Léger"
description: "Third-party URL shorteners are failing their users. vanityURLs puts you back in control of your links."
tags: ["release", "guide"]
featured: true
---

For years, URL shortening services like bit.ly, goo.gl, and tinyurl have been go-to tools for anyone needing to share compact links. These services were free and convenient — but the landscape is changing, and not for the better.

## The Problem with Relying on Third-Party Services

In January 2024, Bitly — the leading URL shortener since 2008 — made a significant change: accounts created after 2018 were suddenly limited to just **10 links per month**. For those who had relied on the previous limit of 10,000 free links per month, this was a major blow.

But Bitly isn't the only service to disappoint. Goo.gl was deprecated in 2019, and in July 2024 Google announced all goo.gl links will stop working on **August 25, 2025**. A subset of the internet's links could break overnight.

These changes highlight a critical issue: we've been relying on free services from third-party vendors who have no obligation to provide reliable, long-term solutions.

## Introducing VanityURLs: Your Own URL Shortening Service

Enter **VanityURLs** — also known as **v8s** — an open-source URL shortener that puts you in control. With v8s, you don't rely on a third-party provider. Instead, you bring your links with you, hosted on your own domain. Here's how it works:

1. **Buy a domain** — any short domain you like
2. **Host a redirect file** — a plain-text file with your short link mappings in a GitHub repository
3. **Connect via Cloudflare Pages** — a free serverless platform that processes redirects at the edge

That's it. You now have a fully functional URL shortening service that you control. No more worrying about policy changes, deprecation, or broken links.

v8s is *not* a new vendor that will host your links. It is a set of instructions for combining a list of redirects, your existing domain, and Cloudflare Pages. **Your links are always yours.** You can even migrate them to a new domain if you want.

## Why VanityURLs?

With so many free URL shortening providers out there — Bitly, Rebrandly, Dub, TinyURL, BL.INK, Short.io, T.ly, Cutt.ly, and more — you might wonder why you should switch to v8s.

The answer is simple: **control and reliability**. v8s ensures that your links remain intact and functional, no matter what changes happen in the world of third-party services. You own your domain. You own your redirect file. You own your links.

## Getting Started

Setting up v8s is straightforward, and we provide scripts to automate the process.

[Read the installation guide →](/docs/getting-started/)

Don't let your links fall victim to the whims of third-party providers. Take control with v8s.
