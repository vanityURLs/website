---
title: "The JSON audit ledger behind the Cloudflare setup docs"
date: 2026-05-29
author: "Benoît H. Dicaire"
description: "Why vanityURLs keeps a structured Cloudflare dashboard capture beside the documentation, and where to watch for Workers, domain protection, and Zero Trust changes."
tags: ["documentation", "cloudflare", "operations", "maintenance"]
featured: false
---

Cloudflare is one of the reasons vanityURLs can stay small. The redirector does not need a fleet of servers, a database, or a private control plane. It can run as a Worker, publish static operational pages, and let Cloudflare stop a lot of noisy traffic before the Worker ever executes.

That simplicity comes with a documentation problem: Cloudflare moves quickly.

Menu labels change. Settings move between sections. New toggles appear. Defaults shift. Product groups get renamed. Some dashboard pages expose useful status, while others look like activities but are really just optional information. A setup guide that was accurate last month can become quietly confusing after a dashboard refresh.

For a project like vanityURLs, that matters. We are not documenting an abstract Cloudflare account. We are documenting the concrete shape of a short-link domain: Workers, DNS, SSL/TLS, Access, WAF rules, AI crawler controls, cache settings, URL normalization, and the places where blocked traffic can be reviewed.

So the documentation now has a companion: a JSON audit ledger.

## What the ledger is

The ledger lives in the website repository as [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json).

It is not product configuration. It does not deploy anything. It is a structured capture of the Cloudflare dashboard surfaces seen while configuring a fresh zone.

That distinction is important. The public documentation should tell an operator what to do. The ledger helps maintainers remember why the docs say that, what the dashboard looked like when the guidance was written, and which tempting settings were deliberately left out.

For example, the network protection guide says not to create Cache Rules or Cache Response Rules for the baseline. The ledger records that the captured fresh zone had no cache rules, and that this is intentional. The analytics reference says Cloudflare Web Analytics and Real User Measurement are not part of the baseline. The ledger records RUM as disabled and reference-only, so a future maintainer does not turn it into a required step by accident.

That is the shape we want:

- baseline settings are documented as baseline
- reference-only surfaces remain visible for future reassessment
- dashboard labels are preserved by menu path
- screenshots and memory are not the only source of truth

## Why prose alone is fragile

Cloudflare documentation is good, but product documentation and instance documentation have different jobs.

Cloudflare needs to document what every product can do. vanityURLs needs to document the narrow posture that makes sense for a redirector.

Those are not the same thing.

Bulk Redirects are a good example. Cloudflare Bulk Redirects are a real product and a useful one. They are also a plausible alternative for large static redirect lists. But they are not the vanityURLs baseline, because they bypass the repository-managed registry, lifecycle states, schedules, expand pages, splats, and Worker-side analytics.

Cloudflare RUM is another example. It can be useful for sites that need browser-side performance telemetry. vanityURLs does not plan to use it in the baseline. The redirector already has a server-side event model, and blocked traffic often never reaches the Worker at all.

Without the ledger, these distinctions tend to blur. A maintainer sees a dashboard card, adds it to a checklist, and suddenly an optional diagnostic looks like required setup.

## Where Cloudflare documents changes

The ledger is not a replacement for Cloudflare's own changelogs. It is the local memory that lets us compare Cloudflare's changes against the vanityURLs posture.

These are the official places worth watching:

| Area we care about | Product change log |
| --- | --- |
| Broad product and dashboard changes | - [Cloudflare](https://developers.cloudflare.com/changelog/) |
| Worker runtime, Wrangler, Workers Builds, and Workers dashboard changes | - [Workers platform](https://developers.cloudflare.com/workers/platform/changelog/)<br>- [Workers product](https://developers.cloudflare.com/changelog/product/workers/) |
| WAF managed rules and application security posture | - [WAF](https://developers.cloudflare.com/waf/change-log/)<br>- [Application Security](https://developers.cloudflare.com/changelog/product-group/application-security/) |
| Rules, transforms, redirects, and URL normalization behavior | - [Rules](https://developers.cloudflare.com/rules/changelog/)<br>- [Rules product](https://developers.cloudflare.com/changelog/product/rules/) |
| DNS zone UI, DNSSEC, proxied records, and domain routing details | - [DNS](https://developers.cloudflare.com/dns/changelog/) |
| SSL/TLS, certificates, HSTS-adjacent controls, and edge certificate behavior | - [SSL/TLS](https://developers.cloudflare.com/ssl/changelog/) |
| Cloudflare Access, Zero Trust dashboard navigation, and Access policy behavior | - [Cloudflare One](https://developers.cloudflare.com/cloudflare-one/changelog/)<br>- [Cloudflare One product](https://developers.cloudflare.com/changelog/product/cloudflare-one/) |

Those feeds do not all answer the same question. The Workers changelog can tell us about runtime and deployment behavior. The WAF changelog can explain new managed detections that suddenly increase Security Events. The Cloudflare One changelog is where Access and Zero Trust navigation can move under our feet. The DNS changelog is where UI changes can affect quickstart screenshots and menu paths.

For vanityURLs, the maintenance question is always: does this change alter the recommended setup, the words in the docs, or only the reference material?

## The workflow we want

When Cloudflare changes something relevant, we should not immediately rewrite the setup guide.

First, capture the observation:

1. Update the JSON ledger if the dashboard label, default, quota, menu path, or baseline decision changed.
2. Decide whether the public docs need an operator-facing change.
3. Move non-baseline detail to a reference page instead of bloating the quickstart.
4. Add or update an ADR only when the decision affects the product contract, not every time a paragraph changes.

That last point matters. The code repository now has [ADR 0012](https://github.com/vanityURLs/code/blob/main/docs/adr/0012-maintain-cloudflare-dashboard-capture.md), which records the rule: keep the Cloudflare dashboard capture updated when it is pertinent, and use it to ease future assessment.

The ADR does not say every Cloudflare UI twitch deserves ceremony. It says the project needs a durable audit trail because the external platform is part of the operating model.

## The payoff

This is not glamorous documentation work. It is mostly disciplined housekeeping.

But it pays off when someone installs a new instance and says, "this menu is not where the docs say it is," or "why are we not enabling this shiny toggle?" Instead of answering from memory, we can compare the current dashboard, the ledger, the reference page, and the ADR.

That gives us a calmer maintenance loop:

- quickstart stays short
- network protection stays actionable
- reference pages keep nuance
- ADRs preserve product decisions
- JSON captures the moving Cloudflare surface

vanityURLs is intentionally small. Keeping it small requires a little machinery around the docs, because the platform around it is not small at all.
