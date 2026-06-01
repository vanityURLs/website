---
title: "Start with one-time PIN, then earn the IdP"
date: 2026-05-22
description: "How to choose between One-Time PIN, GitHub, Google, and other identity providers to secure your vanityURLs operational pages"
tags: ["cloudflare", "access", "identity"]
---

The first identity decision for a short-link domain should be boring.

Protect `/en/_stats/`, other localized stats paths, and `/_tests` before the instance goes public. Do not spend the first deploy designing an enterprise identity architecture unless the enterprise already exists.

For vanityURLs, [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/) protects the operational pages before the Worker serves them. The question is not "which IdP is best?" The question is "which access path can the operator review and revoke without ceremony?"

## The Day-One Default

Use Cloudflare [One-Time PIN](https://developers.cloudflare.com/cloudflare-one/identity/one-time-pin/) for a personal instance or a small team that only needs occasional access.

It has one useful property: no external identity provider has to be configured before the dashboard is private. Cloudflare sends a login code to approved email addresses. That is enough to get the instance online without exposing the link inventory.

The tradeoff is friction. If people sign in every day, email codes become noise. That is the point where an IdP starts earning its keep.

## When To Use A Real IdP

Choose the provider that already owns the joiner and leaver process.

| Provider                                                                                                                           | Use it when                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [GitHub](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/github/)                                        | maintainers already belong to the same GitHub organization or team      |
| [Google](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/google/)                                        | the operator already uses Gmail or Google Workspace identities          |
| [Microsoft Entra ID](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/entra-id/) or another corporate IdP | access should follow existing HR, device, MFA, and offboarding controls |

The selector matters as much as the provider. A personal instance can allow named email addresses. A team instance should move toward maintained groups, GitHub organization membership, or IdP-backed selectors. Otherwise offboarding becomes a scavenger hunt.

## Multiple Providers Are Fine

The first choice does not freeze the architecture.

You can start with One-Time PIN and add GitHub, Google, or a corporate IdP later for the same Access application. If a person uses the same email address across providers, Cloudflare evaluates the identity returned by the provider they selected and then applies the Access policy.

That flexibility is useful. It is also a trap if nobody owns review. Adding providers should make access easier to govern, not harder to explain.

## The Test

After configuring the provider, test the boundary:

1. Open a signed-out or private browser profile.
2. Visit `https://<short-domain>/en/_stats/`.
3. Confirm Cloudflare Access appears before the dashboard.
4. Confirm an unauthorized identity fails.

Then write down who owns the Access policy. Future-you will not remember why `friend@example.com` was allowed.

Use [Access control](/docs/customize/access-control/) for setup steps. Use [Operating Cloudflare Access for a short-link domain](/blog/operating-cloudflare-access-for-a-short-link-domain/) for the review checklist.
