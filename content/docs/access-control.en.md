---
aside: false
title: "Access control"
description: "Configure Cloudflare Access, identity providers, policies, and Worker secrets for private vanityURLs operational paths."
---

vanityURLs keeps public redirects open and protects operational paths with Cloudflare Access. The protected paths expose link inventory, runtime diagnostics, and test surfaces, so they should require authentication before the Worker serves them.

Use this page as the canonical setup for:

- `/_stats`
- `/_stats/*`
- `/_tests`
- `/_tests/*`

The Worker validates the `Cf-Access-Jwt-Assertion` header on protected paths. If Cloudflare Access is not configured or the token is missing, those paths fail closed.

## What to decide first

Before creating the Access application, decide who should be allowed in:

| Decision | Phase 1 recommendation | Later customization |
| :--- | :--- | :--- |
| Authentication method | One-time PIN with named emails | GitHub, Google, Okta, Entra ID, or another account-managed provider |
| Policy selector | Emails | Emails, groups, GitHub organization, device posture, country, or network selectors |
| Session duration | 24 hours | Shorter for sensitive teams, longer for low-risk personal instances |
| MFA | Follow global Zero Trust setting | Require MFA directly in the policy when the IdP supports it |
| Secrets storage | Cloudflare secrets plus password manager | Same model, with rotation notes and owner documentation |

For the identity-provider tradeoffs, read [Choosing an Identity Provider](/blog/choosing-identity-provider/). For phase 1, one-time PIN is usually enough because it protects private paths without creating GitHub, Google, or workforce IdP credentials first.

## Team domain

Find the Cloudflare Access team domain in **Zero Trust** > **Settings**. It looks like:

```text
<team>.cloudflareaccess.com
```

The installer writes this value to `wrangler.toml` as `CF_ACCESS_TEAM_DOMAIN`:

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

This value is not a secret, but it should still match the Cloudflare account that owns the Access application.

## Identity providers

Cloudflare Access can authenticate maintainers with one-time PIN, GitHub, Google, Okta, Entra ID, or multiple providers at the same time. Configure providers in **Zero Trust** > **Integrations** > **Identity providers**.

Common options:

| Provider | When it fits | Notes |
| :--- | :--- | :--- |
| [One-time PIN](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) | Personal instances, small teams, phase 1 setup | Cloudflare emails approved users a code; no external IdP setup is required |
| [GitHub](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/github/) | Maintainers already use GitHub | Access policies can use specific users, email addresses, or GitHub organization membership |
| [Google](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google/) | Users already have Gmail or Google Workspace accounts | Store OAuth client secrets outside the repository |
| Corporate IdP | Organizations already manage workforce identities | Use the existing joiner, mover, and leaver process instead of maintaining a separate allowlist |

If more than one identity provider is enabled, users choose a provider on the Cloudflare Access login page. The Access policy is satisfied when the selected provider returns an identity that matches the policy, such as an allowed email, group, or organization membership.

## Create the Access application

In Cloudflare, open **Zero Trust** > **Access Controls** > **Applications**, then create a **Self-hosted and private** application.

Configure the destinations with your short domain:

| Subdomain | Domain | Path |
| :--- | :--- | :--- |
| | `v8s.link` | `_stats` |
| | `v8s.link` | `_stats/*` |
| | `v8s.link` | `_tests` |
| | `v8s.link` | `_tests/*` |

Use one Access application for the private vanityURLs operations. The public redirect paths should stay outside Access so visitors can follow short links without logging in.

Recommended application settings:

| Setting | Recommendation |
| :--- | :--- |
| Application type | Self-hosted |
| Public hostnames | `v8s.link/_stats`, `v8s.link/_stats/*`, `v8s.link/_tests`, `v8s.link/_tests/*` |
| Session duration | 24 hours |
| Identity providers | One-time PIN for phase 1, or account-managed providers such as GitHub, Google, Okta, or Entra ID |
| Browser rendering | Off |

Replace `v8s.link` with your short domain everywhere.

## Create the Access policy

Start with a simple allow policy:

| Field | Value |
| :--- | :--- |
| Policy name | `Allow maintainers` |
| Action | `Allow` |
| Include selector | `Emails` |
| Include value | Your maintainer email addresses |
| Session duration | `24 hours` |

Use the policy tester before saving. Test at least one allowed email address and one address that should be denied.

For a larger team, prefer a maintained group or identity-provider selector over a long list of individual email addresses. That makes access review part of the normal team offboarding process.

## Store the Access audience

After the application is created, open **Additional settings** and copy the **Application Audience (AUD) Tag**.

Store it as a Worker secret:

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

Do not commit Access audiences, IdP client secrets, service tokens, OAuth client secrets, or screenshots that contain those values. Keep them in Cloudflare and in your password manager.

## Validate the protection

Before release:

1. Use the Cloudflare policy tester to confirm an allowed identity succeeds
2. Use the policy tester to confirm a denied identity fails
3. Visit `/_stats` from a signed-out or private browser profile
4. Visit `/_tests` from a signed-out or private browser profile
5. Confirm Cloudflare Access appears before the dashboard or test page
6. Sign in with an allowed identity and confirm the page loads

Run the local checks before pushing configuration changes:

```bash
npm run check
```

After deployment, repeat the signed-out browser test against the real short domain.

## Operations notes

Review Access settings when:

- A maintainer joins or leaves
- The short domain moves to a new Cloudflare account
- The Access team domain changes
- You switch from one-time PIN to GitHub, Google, or another IdP
- A screenshot, log, or repository accidentally exposes Access configuration values

Traffic blocked by Cloudflare Access never reaches the Worker. Review those decisions in Cloudflare Access logs or Security Events, not in Umami or Fathom.
