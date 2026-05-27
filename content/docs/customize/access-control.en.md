---
aside: false
title: "Access control"
description: "Configure Cloudflare Access for private vanityURLs operational paths."
weight: 20
aliases:
  - /docs/access-control/

---

Use Cloudflare Access to protect the vanityURLs operational paths while keeping public redirects open. Follow this page when you are ready to secure:

- `/_stats`
- `/_stats/*`
- `/_tests`
- `/_tests/*`

The Worker validates the `Cf-Access-Jwt-Assertion` header on those paths. If Cloudflare Access is missing or the token is invalid, the protected path fails closed.

For provider strategy, read [Choosing an Identity Provider](/blog/choosing-identity-provider/). For ongoing review habits, read [Operating Cloudflare Access for a short-link domain](/blog/operating-cloudflare-access-for-a-short-link-domain/).

## 1. Find the Team domain

In Cloudflare, open **Zero Trust** > **Settings**, then copy the **Team domain**.

It looks like:

```text
<team>.cloudflareaccess.com
```

The installer stores it in `wrangler.toml`:

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "vanityurls.cloudflareaccess.com"
```

This value is not a secret, but it must match the Cloudflare account that owns the Access application.

## 2. Choose the identity provider

For phase 1, use [one-time PIN](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) unless you already have a provider ready.

| Option | Use when |
|---|---|
| One-time PIN | You want the fastest path with named email addresses |
| [GitHub](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/github/) | Maintainers already use GitHub and you want user or organization selectors |
| [Google](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google/) | Maintainers already use Gmail or Google Workspace |
| Corporate IdP | Your organization already manages workforce identities and offboarding |

If you enable multiple providers, users choose one on the Cloudflare Access login page. The policy succeeds when the selected provider returns an identity that matches the policy.

## 3. Create the Access application

In Cloudflare, open **Zero Trust** > **Access Controls** > **Applications**, then:

1. Create an application
2. Select **Self-hosted and private**
3. Continue with **Self-hosted and private**
4. Configure the destinations with *your* short domain

| Subdomain | Domain | Path |
|---|---|---|
| | `v8s.link` | `_stats` |
| | `v8s.link` | `_stats/*` |
| | `v8s.link` | `_tests` |
| | `v8s.link` | `_tests/*` |

Replace `v8s.link` with *your* short domain everywhere.

Use one Access application for the private vanityURLs operations. Public redirect paths should stay outside Access so visitors can follow short links without logging in.

Recommended settings:

| Setting | Value |
|---|---|
| Application type | Self-hosted |
| Application name | Your Worker name, such as `v8s-link` |
| Session duration | `24 hours` |
| Identity providers | One-time PIN for phase 1, or the providers you configured |
| Browser rendering | Off |

## 4. Create the Access policy

Start with a simple allow policy:

| Field | Value |
|---|---|
| Policy name | `Allow maintainers` |
| Action | `Allow` |
| Include selector | `Emails` |
| Include value | Your maintainer email addresses |
| Session duration | `24 hours` |

Use the policy tester before saving. Test one allowed email address and one address that should be denied.

For a larger team, prefer a maintained group or IdP selector over a long list of individual email addresses.

## 5. Store the Access audience

After the application is created, open **Additional settings** and copy the **Application Audience (AUD) Tag**.

Store it as a Worker secret:

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

Do not commit Access audiences, IdP client secrets, service tokens, OAuth client secrets, or screenshots that contain those values. Keep them in Cloudflare and in your password manager.

## 6. Validate the protection

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

## 7. Know the other file guards

Cloudflare Access is not the only layer that limits operational file access.

| Control | Paths | What it does |
|---|---|---|
| Worker private runtime asset guard | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Returns `404` for direct public requests |
| Static `_headers` fallback | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`, `/_stats/*`, `/expand/*` | Adds no-cache and no-index headers if static assets are served directly |
| Protected stats API | `/_stats/api/v8s.json` | Exposes the generated registry only through the protected stats surface |
| Reserved slug validation | `/_stats`, `/api`, `/_worker`, `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Prevents short links from being created under reserved operational paths |

Keep Access on `/_stats` and `/_tests`, keep the Worker runtime-file guard enabled, and keep the `_headers` runtime-file entries unless you have a deliberate public-disclosure reason.
