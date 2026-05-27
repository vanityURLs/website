---
title: "Using link lifecycle states"
date: 2026-05-27
author: "Benoît H. Dicaire"
description: "Use lifecycle states to make short-link behavior explicit without deleting history or losing operational intent."
tags: ["link-states", "operations", "short-links"]
featured: false
---

A short link is not always simply active or gone. Sometimes it should be permanent. Sometimes it should stay temporary. Sometimes it should stop routing without disappearing from history. Lifecycle states make those choices explicit in `custom/v8s-links.txt`.

That matters because a redirector is operational infrastructure. People bookmark links, paste them in docs, print them on slides, and share them in chat. Changing what a link does should be visible in code review.

## Active states

Use `permanent` when the destination is stable and you are comfortable with clients and crawlers treating the redirect as long-lived. In HTTP terms, vanityURLs returns a permanent redirect for that link.

Use `ephemeral` when the destination works now but may change soon: a launch page, a temporary campaign, a short-lived collaboration space, or any link where caching a permanent redirect would be too bold.

If the state is omitted, the builder treats the row according to the project default. For important links, write the state anyway. Explicit beats surprising.

## Holding states

Use `expired` when the link used to be valid but should now send visitors to an expiry page. This is useful for events, offers, hiring links, and temporary resources that should fail clearly instead of drifting to an unrelated destination.

Use `disabled` when the link should be intentionally unavailable. That is different from deleting it. The slug still exists, the owner and metadata still exist, and the disabled page tells operators and visitors that the link was turned off on purpose.

Use `maintenance` when the target is expected to come back. A maintenance state is helpful during planned outages, migrations, or temporary safety holds where the right answer is "not now" rather than "gone."

Use `deactivated` when the link should behave like it does not exist. vanityURLs returns a true not-found response for this state. Keep it for cases where even a disabled or expired page would reveal more than you want to expose.

## Expiry dates

The `expires_at` field can make a link effectively expired once the timestamp is in the past. That keeps the original row readable while letting the runtime apply the safer state automatically.

This is a good fit for event links and temporary access links. The intent stays in the inventory, and the expiration does not depend on someone remembering to edit the file the next morning.

## Choosing the state

Start with the operational question:

- Should browsers remember this redirect for a long time? Use `permanent`.
- Might this target change soon? Use `ephemeral`.
- Is the link over, but worth explaining? Use `expired`.
- Is the link intentionally off? Use `disabled`.
- Is the target temporarily unavailable? Use `maintenance`.
- Should the slug look absent? Use `deactivated`.

For the exact field format and runtime behavior, read [Link format](/docs/reference/link-format/). To inspect live examples, use the [v8s.link operations page](/docs/v8s-link/operations/).
