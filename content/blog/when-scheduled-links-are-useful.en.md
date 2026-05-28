---
title: "When scheduled links are useful"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Use scheduled links when one stable short link should point somewhere different during known time windows."
tags: ["scheduled-links", "operations", "short-links"]
featured: false
---

Most short links should be boring: one slug, one destination, one clear owner. Scheduled links are for the few cases where the slug should stay stable but the destination needs to change during a predictable time window.

The starter instance includes a deliberately silly `/contact` example. During the configured 9-to-5 window, it can point to Dolly Parton's "9 to 5"; outside that window, it falls back to Rick Astley and "Never Gonna Give You Up." The point is not the music taste, heroic as it may be. The point is that one memorable short link can have a normal destination and a time-based exception.

## Good use cases

Scheduled links are useful when people already know the slug:

- a recurring meeting link that points to the work room during office hours and a community room after hours
- an event link that points to registration before the event and a recording afterward
- a launch link that points to a waiting page before release time and the live page afterward
- a support link that points to a maintenance notice during a planned outage

In each case, the human memory stays stable. The route changes underneath it.

## Keep the link inventory readable

The slug still belongs in `v8s-links.txt`. The schedule adds time windows in `v8s-schedules.json`. If no schedule rule is active, the Worker can fall back to the normal target or to a schedule-specific default.

That keeps review sane. The link inventory answers "does this slug exist?", while the schedule answers "when does the destination change?"

## Prefer the CLI

For normal edits, use `lnk schedule` instead of hand-editing JSON. It keeps the file shape consistent and makes simple changes easier to review.

Use [Scheduled links](/docs/reference/schedules/) for the exact command examples and JSON forms, and compare the starter `contact` schedule in `defaults/v8s-schedules.json` when you want a concrete reference.
