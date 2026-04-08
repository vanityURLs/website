---
title: "Why vanityURLs? The case for owning your short links"
date: 2025-01-20
author: "Benoît H. Dicaire"
description: "Third-party URL shorteners are failing their users. Here's why owning your own redirect infrastructure is the right move — and why it's easier than you think."
tags: ["guide"]
featured: false
---

URL shorteners look like a solved problem. Pick a free service, paste a long URL, get a short one. Done. For years, services like bit.ly, goo.gl, and TinyURL made this trivially easy and free.

Then bit.ly slashed free accounts to 10 links per month. Google killed goo.gl. Millions of published links — in books, presentations, printed materials, email footers — started dying.

The problem isn't that these services got worse. It's that they were always the wrong architectural choice.

## You don't own your links

When you shorten a URL through a third-party service, you're not creating a link. You're creating a **dependency**. The link works as long as:

- The company stays in business
- They keep your tier of service free
- They don't deprecate your link format
- They don't get acquired and shut down
- Their infrastructure stays up

None of these are under your control. All of them have failed for real users in the past five years.

## The alternative is simpler than it sounds

vanityURLs takes a different approach: your redirects live in a plain text file in a Git repository. A Cloudflare Pages build command (`cat static.lnk dynamic.lnk > build/_redirects`) generates the redirect table. Cloudflare's edge network processes it.

That's it. The entire "service" is:

1. A text file you own
2. A domain you own
3. A Cloudflare Pages project (free tier)

No database. No vendor lock-in. No monthly bill. And if Cloudflare ever disappoints you, the text file moves — your links redirect to whatever host you configure next.

## Links as code has real benefits

Once your redirects are in Git, you get everything Git gives you for free:

**History** — every redirect change is a commit. You know who added `/promo-summer`, when, and why. You can `git log static.lnk` and see every decision ever made.

**Review** — teams can require pull requests before campaign links go live. CI validates that destinations are reachable. Nothing broken ships.

**Rollback** — a bad redirect is one `git revert` away from being fixed. No support ticket, no UI fumbling, no waiting.

**Validation** — `lnk validate --live` checks every destination URL before you push. It's the equivalent of `terraform plan` for your link table.

## The right question

The question isn't "why vanityURLs instead of bit.ly?" The question is: do you want your links to work in five years?

If yes, own the infrastructure. It costs nothing, takes an afternoon to set up, and you'll never think about it again — except when a redirect needs updating, which takes 30 seconds and a `git push`.

[Get started →](/docs/getting-started/)
