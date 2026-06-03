---
title: "vanityURLs' secret sauce is a JSON ledger"
date: 2026-05-29
author: "Benoît H. Dicaire"
description: "Why vanityURLs keeps a structured Cloudflare dashboard capture beside the documentation, and where to watch for Workers, domain protection, and Zero Trust changes."
tags: ["documentation", "cloudflare", "operations", "maintenance"]
featured: false
---

The problem showed up in the usual small way: a Cloudflare dashboard label moved, a setup page still named the old path, and the next maintainer had to decide whether the documentation was stale or the product guidance had changed.

vanityURLs stands on Cloudflare's shoulders. That is the point. A short-link redirector should not need a fleet of servers, a database, or a private control plane. It can run on Cloudflare's serverless architecture and let Cloudflare stop noisy traffic before the Worker executes.

When an external platform is part of the operating model, how can you tell the difference between platform drift, product decisions, and old instructions?

vanityURLs' dev team was looking for a small, structured audit ledger to keep track. As of 2026-05-29, that ledger is [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json). `Last verified: 2026-05-29`

## What The Ledger Is

The ledger is not product configuration.

It deploys nothing.

It is a structured capture of the Cloudflare dashboard surfaces seen while configuring a fresh zone. The capture keeps menu paths, default states, reference-only surfaces, and baseline decisions in JSON, where a future maintainer can diff them without trusting a screenshot or a memory.

That distinction matters. The public documentation tells an operator what to do. The ledger helps maintainers remember why the docs say it, what the dashboard looked like when the guidance was written, and which tempting settings were left out on purpose.

For example, the network protection guide tells operators not to create Cache Rules or Cache Response Rules for the baseline. The ledger records that the captured fresh zone had no cache rules, and that this is intentional.

The analytics reference says [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) and [Real User Monitoring](https://developers.cloudflare.com/speed/observatory/rum/) are not part of the baseline. The ledger records RUM as disabled and reference-only, so a future maintainer does not promote a visible dashboard card into a required setup step by accident.

That is the shape we want:

- baseline settings stay documented as baseline
- reference-only surfaces remain visible for reassessment
- dashboard labels are preserved by menu path
- screenshots are supporting evidence, not the source of truth

## Why Prose Alone Fails

Cloudflare documentation and instance documentation have different jobs.

Cloudflare needs to document what every product can do. vanityURLs needs to document the narrow posture that makes sense for a redirector: Workers, DNS, SSL/TLS, [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/), [WAF](https://developers.cloudflare.com/waf/), AI crawler controls, cache settings, URL normalization, and the places where blocked traffic can be reviewed.

Those are not the same thing.

[Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) are a useful Cloudflare product. They are also a plausible alternative for large static redirect lists. They are not the vanityURLs baseline because they bypass the repository-managed registry, lifecycle states, schedules, lookup pages, splats, and Worker-side analytics.

RUM is similar. It can help sites that need browser-side performance telemetry. vanityURLs does not use it in the baseline. The redirector already has a server-side event model, and traffic blocked by Access, WAF rules, rate limiting, or bot controls often never reaches the Worker.

Without the ledger, these distinctions blur. A maintainer sees a dashboard card, adds it to a checklist, and turns an optional diagnostic into required setup.

## The Watch List

The ledger is local memory. It is not a replacement for Cloudflare's changelogs.

The useful pattern is boring:

```yaml
cloudflare_surface:
  source_of_truth: Cloudflare docs and changelogs
  local_memory: data/cloudflare-protection-defaults.json
  operator_docs: content/docs
  decision_record: ADR when the product contract changes
```

As of 2026-05-29, these are the Cloudflare sources worth watching for vanityURLs:

| Area                                                                         | Product changelog                                                                                                                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Broad product and dashboard changes                                          | - [Cloudflare](https://developers.cloudflare.com/changelog/)                                                                                                                       |
| Worker runtime, Wrangler, Workers Builds, and Workers dashboard behavior     | - [Workers platform](https://developers.cloudflare.com/workers/platform/changelog/)<br>- [Workers product](https://developers.cloudflare.com/changelog/product/workers/)           |
| WAF managed rules and application security posture                           | - [WAF](https://developers.cloudflare.com/waf/change-log/)<br>- [Application Security](https://developers.cloudflare.com/changelog/product-group/application-security/)            |
| Rules, transforms, redirects, and URL normalization behavior                 | - [Rules](https://developers.cloudflare.com/rules/changelog/)<br>- [Rules product](https://developers.cloudflare.com/changelog/product/rules/)                                     |
| DNS zone UI, DNSSEC, proxied records, and domain routing                     | - [DNS](https://developers.cloudflare.com/dns/changelog/)                                                                                                                          |
| SSL/TLS, certificates, HSTS-adjacent controls, and edge certificate behavior | - [SSL/TLS](https://developers.cloudflare.com/ssl/changelog/)                                                                                                                      |
| Access, Zero Trust dashboard navigation, and policy behavior                 | - [Cloudflare One](https://developers.cloudflare.com/cloudflare-one/changelog/)<br>- [Cloudflare One product](https://developers.cloudflare.com/changelog/product/cloudflare-one/) |

These feeds answer different questions.

The Workers changelog can affect runtime behavior. The WAF changelog can explain new managed detections that increase [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/). The Cloudflare One changelog is where Access and Zero Trust navigation can move. The DNS changelog can change quickstart screenshots and menu paths.

For vanityURLs, the maintenance question is narrower: does the Cloudflare change alter the recommended setup, the words in the docs, or only the reference material?

## The Maintenance Loop

When Cloudflare changes something relevant, do not start by rewriting the quickstart.

First, capture the observation:

1. Update the JSON ledger if a dashboard label, default state, quota, menu path, or baseline decision changed.
2. Decide whether the public docs need an operator-facing change.
3. Move non-baseline detail to a reference page instead of bloating the quickstart.
4. Add or update an [architecture decision record](https://adr.github.io/) only when the decision affects the product contract.[^adr]

ADR 0012 records the current rule: keep the Cloudflare dashboard capture updated when it is pertinent, and use it to make future assessment easier.[^adr0012]

It does not say every Cloudflare UI twitch deserves ceremony.

It says the external platform is part of the operating model, so the project needs a durable audit trail for the parts of that platform it depends on.

## The Limit

The ledger can still rot.

JSON does not make stale data true. A dashboard capture taken from one Cloudflare account, one plan, and one fresh zone can miss controls that appear only after traffic, billing changes, beta access, or plan upgrades. The ledger is evidence. It is not authority.

That is why every implementation-specific claim above is dated, and why the Cloudflare changelogs remain the primary source.

The accepted tradeoff is small but real: vanityURLs carries one more file so the docs do not quietly absorb every dashboard novelty. That is cheap insurance for a project whose operating bias is to stay small while depending on a large platform.

[^adr]: The ADR format has several lineages rather than one canonical standard. The public [ADR GitHub organization](https://adr.github.io/) is a useful entry point; use the repository's own ADR template as the local authority.

[^adr0012]: ADR 0012 lives in the vanityURLs code repository: [Maintain Cloudflare dashboard capture](https://github.com/vanityURLs/code/blob/main/docs/adr/0012-maintain-cloudflare-dashboard-capture.md).
