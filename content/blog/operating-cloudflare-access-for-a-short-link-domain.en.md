---
title: "Operating Cloudflare Access for a Short-Link Domain"
date: 2026-05-26
description: "When to review Cloudflare Access settings and where to look when private vanityURLs paths are blocked"
tags: ["cloudflare", "access", "operations"]
---

Cloudflare Access is easy to treat as a one-time checkbox: protect `/_stats`, protect `/_tests`, move on. That works for day one, but access control becomes operational the moment another person can sign in, a domain moves between accounts, or someone posts a screenshot with sensitive values in it.

For vanityURLs, Access has a narrow job. Public redirects stay public. Operational paths stay private. The important work is keeping that boundary obvious.

### Review Access When Something Changes

Review your Access application when:

- A maintainer joins or leaves
- The short domain moves to a new Cloudflare account
- The Access Team domain changes
- You switch from one-time PIN to GitHub, Google, or another identity provider
- A screenshot, log, issue, or repository accidentally exposes Access configuration values

For a personal instance, this may be a quick quarterly look. For a team instance, it should follow the same access review rhythm as the rest of your operational tooling.

### Know Where Blocked Traffic Goes

Traffic blocked by Cloudflare Access never reaches the Worker. That means:

- Umami and Fathom will not show those blocked requests
- vanityURLs Worker logs will not explain Access login failures
- Cloudflare Access logs and Security Events are the right place to investigate

This is a feature, not a missing metric. The Worker should never need to decide whether an unauthenticated person can read your link inventory.

### Keep Secrets Out of Git

The Access Team domain in `wrangler.toml` is not a secret. The Application Audience (AUD) Tag is operationally sensitive and should be stored as a Worker secret:

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

Do not commit Access audiences, OAuth client secrets, service tokens, or screenshots that contain those values. Keep them in Cloudflare and in your password manager.

### Start Small, Then Tighten

The practical path is simple:

1. Start with one-time PIN and named email addresses
2. Confirm signed-out users hit Cloudflare Access before `/_stats` and `/_tests`
3. Move to GitHub, Google, or a corporate IdP when the team or workflow justifies it
4. Replace long individual allowlists with maintained groups when offboarding becomes a real concern

The setup steps live in [Access control](/docs/customize/access-control/). The provider tradeoffs live in [Choosing an Identity Provider](/blog/choosing-identity-provider/).
