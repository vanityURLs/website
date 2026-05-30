---
title: "Cloudflare Access is not a checkbox"
date: 2026-05-26
description: "When to review Cloudflare Access settings and where to look when private vanityURLs paths are blocked"
tags: ["cloudflare", "access", "operations"]
---

The failure mode is ordinary. Someone opens `/_stats` from a private browser window and sees the dashboard instead of the Cloudflare Access login page.

That is the whole problem. Public redirects should stay public. Operational pages should not.

For vanityURLs, [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/) has one narrow job: keep `/_stats`, `/_tests`, and similar operator surfaces private before the Worker serves them. Treat it as an access boundary, not a setup souvenir.

## Review It When Ownership Changes

Review the Access application when:

- a maintainer joins or leaves
- the short domain moves to a new Cloudflare account
- the Access team domain changes
- the identity provider changes from one-time PIN to GitHub, Google, or a corporate IdP
- a screenshot, log, issue, or repository exposes Access configuration values

For a personal instance, that may be a quarterly look. For a team instance, put it on the same access-review rhythm as the rest of the operational tooling.

## Debug At The Right Layer

Traffic blocked by Access never reaches the Worker.

That means Umami and Fathom will not show those blocked requests. Worker logs will not explain failed Access logins. The right evidence lives in Cloudflare Access logs and [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/).

This is not a missing metric. It is the control working at the correct layer. The Worker should not decide whether an unauthenticated person can read the link inventory.

## Keep The Sensitive Values Out Of Git

The Access team domain in `wrangler.toml` is not a secret.

The Application Audience (AUD) tag is operationally sensitive. Store it as a Worker secret:

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

Do not commit Access audiences, OAuth client secrets, service tokens, or screenshots that contain those values. Keep them in Cloudflare and in a password manager.

## The Small Start Is Fine

Start with one-time PIN and named email addresses.

Then test the thing that matters:

1. Open a signed-out or private browser profile.
2. Visit `https://<short-domain>/_stats`.
3. Confirm Cloudflare Access appears before the dashboard.
4. Repeat for `/_tests`.

Move to GitHub, Google, or a corporate IdP when the team or workflow justifies it. Replace long individual allowlists with maintained groups when offboarding becomes a real concern.

The setup steps live in [Access control](/docs/customize/access-control/). The provider tradeoffs live in [Choosing an Identity Provider](/blog/choosing-identity-provider/).
