---
title: "Timezones"
description: "Choose the operator and schedule timezone values accepted by vanityURLs setup and link schedules."
weight: 55
---

vanityURLs accepts IANA timezone names, plus `UTC`. Do not enter numeric offsets such as `-4`, `-5`, or `GMT-0400`; offsets do not describe daylight saving time.

Use the place-based timezone that matches the operator or scheduled link. For example, Eastern Time should usually be `America/Toronto` or `America/New_York`. The JavaScript `Intl` timezone database handles the switch between EST and EDT.

## Common choices

| Region                 | Choices                                                                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UTC                    | `UTC`                                                                                                                                                      |
| Canada                 | `America/Toronto`, `America/Montreal`, `America/Halifax`, `America/Winnipeg`, `America/Regina`, `America/Edmonton`, `America/Vancouver`                    |
| United States          | `America/New_York`, `America/Chicago`, `America/Denver`, `America/Phoenix`, `America/Los_Angeles`, `America/Anchorage`, `Pacific/Honolulu`                 |
| Europe                 | `Europe/London`, `Europe/Dublin`, `Europe/Paris`, `Europe/Berlin`, `Europe/Rome`, `Europe/Madrid`, `Europe/Amsterdam`, `Europe/Stockholm`, `Europe/Zurich` |
| Latin America          | `America/Mexico_City`, `America/Bogota`, `America/Lima`, `America/Santiago`, `America/Argentina/Buenos_Aires`, `America/Sao_Paulo`                         |
| Africa and Middle East | `Africa/Casablanca`, `Africa/Johannesburg`, `Africa/Cairo`, `Asia/Jerusalem`, `Asia/Dubai`, `Asia/Riyadh`                                                  |
| Asia                   | `Asia/Kolkata`, `Asia/Bangkok`, `Asia/Singapore`, `Asia/Hong_Kong`, `Asia/Shanghai`, `Asia/Tokyo`, `Asia/Seoul`                                            |
| Oceania                | `Australia/Perth`, `Australia/Adelaide`, `Australia/Brisbane`, `Australia/Sydney`, `Pacific/Auckland`                                                      |

## Complete local list

The exact accepted list comes from the JavaScript runtime used by setup, build, the Worker, and the browser. To print the complete list supported by your local Node.js runtime:

```bash
node -e 'console.log(["UTC", ...Intl.supportedValuesOf("timeZone")].join("\n"))'
```

If setup rejects a timezone, choose one from that command's output. Keep `UTC` only when you intentionally want generated timestamps and default schedule behavior to use Coordinated Universal Time.
