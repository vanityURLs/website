---
aside: false
title: "Scheduled links"
description: "Configure time-aware exact links with inline v8s-links.txt schedules and the generated v8s.json registry."
weight: 110
aliases:
  - /docs/schedules/

---

Scheduled links let a stable slug point somewhere different during configured time windows. Keep the normal target on the link row in `v8s-links.txt`, then add indented `@schedule` directives below that row.

For use cases and decision guidance, read [When scheduled links are useful](/blog/when-scheduled-links-are-useful/).

Schedules currently apply to exact links. Splat links stay path-driven.

## Inline form

```txt
hangout|https://discord.gg/personal|permanent|Hangout|Community hangout|community|team||
  @schedule timezone=America/Toronto
  @schedule rule=work days=mon,tue,wed,thu,fri from=09:00 to=17:00 target=https://zoom.us/j/work
```

The link target is the fallback target. Schedule rules only choose a temporary target during matching windows.

## Compact form

```txt
contact|https://www.youtube.com/watch?v=dQw4w9WgXcQ|permanent|Contact|Scheduled contact example|contact,schedule|owner||
  @schedule timezone=America/New_York
  @schedule 9to5=https://www.youtube.com/watch?v=UbxUSsFXYo4
```

## Legacy JSON form

The build still reads `custom/v8s-schedules.json` during the 3.x series for compatibility with existing instances and the current `lnk schedule` command. New hand-authored schedules should live inline in `v8s-links.txt`.

Rules are checked in order. The first active rule wins. If no rule matches, the Worker uses the normal target from `v8s-links.txt`.

Time windows are inclusive at `from` and exclusive at `to`. Overnight windows are supported.
