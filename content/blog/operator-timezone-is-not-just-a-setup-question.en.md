---
title: "Operator timezone is not just a setup question"
date: 2026-06-01
author: "Benoît H. Dicaire"
description: "Why vanityURLs asks for an IANA operator timezone and where that value shows up after setup."
tags: ["timezones", "operations", "scheduled-links"]
featured: false
---

The operator timezone question in `npm run setup` looks like a small preference. It is more useful than that.

vanityURLs uses timezone names in places where a numeric offset is too brittle: scheduled links, generated registry metadata, and operator-facing views such as `/_stats`.

## Use a place, not an offset

Enter an IANA timezone such as `America/Toronto`, `America/New_York`, `Europe/Paris`, or `UTC`. Do not enter `-4`, `-5`, or `GMT-0400`.

An offset only describes one moment. It does not describe daylight saving time, historical transitions, or the operator's normal working context. A place-based timezone lets the JavaScript runtime handle EST/EDT or other local transitions without the instance owner updating config twice a year.

## Scheduled links need local intent

Scheduled links answer questions like "during office hours, send `/contact` here; after hours, send it there."

That kind of rule is usually written in human local time. If the operator means 09:00 to 17:00 in Toronto, the schedule should say `America/Toronto`, not the offset that happened to be true on the day the rule was written.

Inline `@schedule` rules can define their own timezone. When they do not, the registry generation and operator config still need a trustworthy timezone vocabulary.

## \_stats needs a human clock

The protected `/_stats` dashboard is an operator tool. It helps confirm what registry is deployed, when it was generated, which links are scheduled, and what metadata is present.

Those timestamps and schedule labels are more useful when they line up with the operator's normal working day. UTC is excellent for systems. A local operator timezone is better for answering "did the build I just deployed include my change?"

## The quick answer

For a personal or team instance, choose the timezone where the operator normally works. For globally operated infrastructure, choose `UTC` deliberately and document that choice in the repository.

For the accepted values, use [Timezones](/docs/reference/timezones/). For schedule examples, use [Scheduled links](/docs/reference/schedules/).
