---
aside: false
title: "Scheduled links"
description: "Configure time-aware exact links with v8s-schedules.json and the generated v8s.json registry."
weight: 90

---

Scheduled links let a stable slug point somewhere different during configured time windows. Keep the normal link in `v8s-links.txt`, then add rules in `v8s-schedules.json`.

Schedules currently apply to exact links. Splat links stay path-driven.

For common schedule changes, use the Node CLI instead of hand-editing JSON:

```bash
./scripts/lnk schedule add hangout https://zoom.us/j/work --label work --days mon,tue,wed,thu,fri --from 09:00 --to 17:00 --timezone America/Toronto --default https://discord.gg/personal
./scripts/lnk schedule list hangout
```

The CLI writes `custom/v8s-schedules.json` by default. Set `V8S_SCHEDULES_FILE` or pass `--file` to use another path.

Use `schedule default` only after the slug already has at least one rule. A schedule with a default target but no active rule is invalid at build time.

## Compact form

```json
{
  "hangout": {
    "timezone": "America/Toronto",
    "9to5": "https://zoom.us/j/work",
    "default": "https://discord.gg/personal"
  }
}
```

## Full form

```json
{
  "hangout": {
    "rules": [
      {
        "label": "work",
        "timezone": "America/Toronto",
        "days": ["mon", "tue", "wed", "thu", "fri"],
        "from": "09:00",
        "to": "17:00",
        "target": "https://zoom.us/j/work"
      }
    ]
  }
}
```

Rules are checked in order. The first active rule wins. If no rule matches, the Worker uses the normal target from `v8s-links.txt`, or the schedule `default` target when provided.

Time windows are inclusive at `from` and exclusive at `to`. Overnight windows are supported.

You only need to edit `v8s-schedules.json` manually for advanced reshaping, bulk edits, or code review changes that are easier to express directly in JSON.
