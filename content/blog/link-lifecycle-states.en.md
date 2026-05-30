---
title: "Do not delete a link to change its meaning"
date: 2026-05-27
author: "Benoît H. Dicaire"
description: "Use lifecycle states to make short-link behavior explicit without deleting history or losing operational intent."
tags: ["link-states", "operations", "short-links"]
featured: false
---

A short link usually outlives the moment that created it.

Someone pastes it into a runbook. Someone prints it on a slide. Someone bookmarks it. Six months later, a destination changes and the tempting fix is to delete the row.

Do not start there. In vanityURLs, lifecycle states make the operational decision explicit in `custom/v8s-links.txt`: redirect, expire, disable, hold for maintenance, or disappear as a true not-found.

## Redirect States

Use `permanent` when the destination is stable. vanityURLs returns HTTP `301`, the permanent redirect status defined by [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110).

Use `ephemeral` when the destination works now but may change soon. vanityURLs returns HTTP `302`, also defined by RFC 9110. Launch pages, temporary campaigns, collaboration rooms, and short-lived support links usually belong here.

If the state is omitted, the builder falls back to the project default. For important links, write the state anyway. Explicit rows survive review better than implied intent.

```text
docs|https://www.vanityurls.link/en/docs/|permanent|Docs|Documentation|docs|v8s||
launch|https://example.com/spring|ephemeral|Spring launch|Temporary campaign|campaign|marketing||
```

## Non-Redirect States

Use `expired` when a link used to be valid but should now explain that its time has passed. Events, offers, hiring posts, and time-boxed access links should fail clearly instead of drifting to an unrelated destination.

Use `disabled` when the link is intentionally unavailable. The slug, owner, metadata, and review history remain visible.

Use `maintenance` when the target is expected to return. This is the "not now" state for planned outages, migrations, and temporary safety holds.

Use `deactivated` when the slug should behave as if it does not exist. vanityURLs returns a true `404`. Keep it for cases where an expired or disabled page would disclose more than the operator wants to expose.

## Expiry Is A Guardrail

The `expires_at` field can make a link effectively expired once the timestamp is in the past.

That is not a scheduler. It is a safety rail. It keeps the original row readable while letting the runtime stop routing after the deadline if nobody remembers to edit the file the next morning.

```text
event/check-in|https://example.com/check-in|ephemeral|Check-in|Event check-in|event|ops|2026-06-01T13:00:00Z|
```

## The Tradeoff

Lifecycle states add a little vocabulary. That is the cost.

The benefit is auditability. A reviewer can see whether a link is meant to redirect permanently, stay temporary, fail with an explanation, pause, or vanish. Deleting the row answers only one question: the link is gone. It does not say why.

For the exact field format and runtime behavior, read [Link format](/docs/reference/link-format/). To inspect live examples, use the [v8s.link operations page](/docs/v8s-link/operations/).
