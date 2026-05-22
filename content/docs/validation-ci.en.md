---
aside: false
title: "Validation and CI"
description: "The local and continuous checks that keep a v8s instance deployable and safe."
---

Run validation before every deploy. v8s is designed so link mistakes, unsafe targets, stale generated assets, and Worker regressions fail before Cloudflare receives a new version.

## Local commands

Use the combined check for normal work:

```bash
npm run check
```

It builds the runtime, runs lint checks, and executes the Worker tests. For targeted work, use:

```bash
npm run lint
npm test
npm run build
npm run smoke:analytics
```

Run `npm run clean` before release or before comparing generated output. It removes build cruft so the repo only shows intentional source changes.

## What validation catches

The checks verify that:

- `v8s-links.txt` rows have the expected shape
- URL targets normalize safely
- unsupported protocols, credentialed URLs, localhost, private IPs, and blocked destinations are rejected
- splat aliases do not shadow unsafe parent paths
- schedules are valid and attached only to exact links
- generated runtime assets use schema `2.2`
- raw runtime assets such as `/v8s.json`, `/v8s-blocklist.json`, and `/v8s-site-config.json` stay unreachable
- generated `src/` matches the Worker source in `scripts/workers/`
- protected operational paths such as `/_stats` and `/_tests` are not treated as ordinary public content

Warnings should be reviewed. Errors should be fixed instead of bypassed; a redirector can damage its domain reputation quickly if bad targets slip through.

## CI expectations

A GitHub or Cloudflare-connected repository should run:

```bash
npm run check
```

before deployment. Keep deployment credentials out of the repo and configure them as GitHub or Cloudflare secrets. The generated Worker can run without analytics management API keys; those belong only in local helpers when they are needed.

If CI updates generated blocklist data, review the feed diff before release. Default generated sources come from reputable open-source feeds, but any feed can add false positives or change format.

`npm run local-install` is a workstation setup command, not a CI command. It installs local helper wiring, checks for `jq`, and records local paths in `custom/v8s-local-config.json`.

`npm run local-publish` is for owner workstations. It runs checks, stages configured local paths such as `custom`, commits, and pushes.

## Operational smoke checks

Before promoting a production change:

- confirm a known active short link returns the expected redirect
- confirm a hidden or missing slug returns 404
- confirm a blocked target fails validation
- confirm `/_stats` and `/_tests` are protected by [Cloudflare Access](/docs/access-control/)
- confirm server-side analytics receive one test event when analytics are enabled
- confirm WAF and bot controls block commodity scanner traffic before it reaches the Worker

For existing instances, use the upgrade workflow to refresh `defaults/` and `scripts/` while preserving `custom/`, `wrangler.toml`, secrets, and generated output.
