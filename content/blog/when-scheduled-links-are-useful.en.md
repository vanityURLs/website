---
title: "When scheduled links are useful"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Use scheduled links when a stable short link should point somewhere different during known time windows."
tags: ["scheduled-links", "operations", "short-links"]
featured: false
---

Most short links should be boring: one slug, one destination, one clear owner. Scheduled links are for the moments when the slug should stay stable but the destination needs to change with time.

That is a narrower feature than it first appears. It is not a campaign automation platform. It is a small way to make one known link behave correctly during predictable windows.

## Good use cases

Scheduled links are useful when people already know the slug:

- a recurring meeting link that points to the work room during office hours and a community room after hours
- an event link that points to registration before the event and a recording afterward
- a launch link that points to a waiting page before release time and the live page afterward
- a support link that points to a maintenance notice during a planned outage

In each case, the human memory stays stable. The route changes underneath it.

## Keep the normal link

The normal target still belongs in `v8s-links.txt`. The schedule adds time windows in `v8s-schedules.json`. If no schedule rule is active, the Worker can fall back to the normal target or to a schedule-specific default.

That keeps the link understandable in code review. The slug exists in the link inventory, and the schedule explains only the time-based exception.

## Prefer the CLI

For normal edits, use `lnk schedule` instead of hand-editing JSON. It keeps the file shape consistent and makes simple changes easier to review.

Use [Scheduled links](/docs/schedules/) for the exact command examples and JSON forms.
