---
title: "Say Goodbye to Third-Party URL Shorteners: Introducing VanityURLs"
date: 2024-08-16
authors:
  - name: Félix Léger
    link: https://github.com/felleg
    image: https://github.com/felleg.png
#excludeSearch: true
---

For years, URL shortening services like bit.ly, goo.gl, and tinyurl
have been go-to tools for anyone needing to shorten long URLs for
easier sharing. These services have been free and convenient, offering
features like custom domains and tracking, but the landscape is
changing—and not for the better.

# The Problem with Relying on Third-Party Services

In January 2024, Bitly, the leading URL shortener since 2008, made a
significant change: accounts created after 2018 were suddenly limited
to creating just 10 links per month. For those who had relied on the
previous limit of 10,000 free links per month, this was a major blow.
What was once a useful tool for marketers, bloggers, and small
businesses became almost unusable overnight.

But Bitly isn’t the only service to disappoint its users. Goo.gl,
Google’s URL shortening service, was deprecated in 2019, and it was
announced in July 2024 that all goo.gl links will stop working on
August 25, 2025. The potential impact of this change is enormous, with
a subset of the internet's links potentially breaking overnight.

These changes highlight a critical issue: we’ve been relying on free
services from third-party vendors who, ultimately, have no obligation
to provide reliable, long-term solutions. We trusted them with our
links, and now many are paying the price.

# Introducing VanityURLs: Your Own URL Shortening Service

Enter VanityURLs—a new type of URL shortener that puts you in control.
With VanityURLs (also known as **V8S**), you don’t have to rely on a third-party provider like
Bitly or TinyURL. Instead, you bring your links with you, hosted on
your own domain. Here’s how it works:

1. **Buy a Domain:** Start by purchasing your own domain.
1. **Host a redirect File**: Set up a repository that contains a
   redirect file with all your shortened links.
1. **Link with Cloudflare Worker**: Use a Cloudflare worker to connect
   your domain to your `_redirect` file.

And that’s it! You now have a fully functional URL
shortening service that you control. No more worrying
about policy changes, deprecation, or broken links. With
V8S, your links are always yours.

To summarize, V8S is *not* a new vendor that will provide hosting
for your links. Instead, it is a set of instructions for
combining a list of redirects, your existing domain, and a
web hosting service of your choice (e.g. Cloudflare). At all times,
you will stay in control of your links. You can even migrate them to a
new domain, if you want.

# Why VanityURLs?

With so many free URL shortening providers out
there—Bitly, Rebrandly, Dub, TinyURL, BL.INK, Zapier,
Short.io, T.ly, Cutt.ly, and more—you might wonder why you
should switch to V8S. The answer is simple: control
and reliability. V8S ensures that your links remain
intact and functional, no matter what changes happen in
the world of third-party services.

# Getting Started

Setting up V8S is straightforward, and to make it
even easier, we provide scripts to automate the process. Access our docimentation by clicking the link below:

[Click here to access VanityURLs (V8S) Documentation](https://vanityurls.link/en/docs)

Don’t let your links fall victim to the whims of
third-party providers. Take control with V8S.
