---
aside: false
title: "Access control"
description: "Configure Cloudflare Access for private vanityURLs operational paths."
weight: 10
aliases:
  - /docs/access-control/
---

Use Cloudflare Access to protect the vanityURLs operational paths while keeping public redirects open. Follow this page when you are ready to secure localized stats pages such as `/en/_stats/` and `/fr/_stats/`, plus `/_tests`.

The Worker validates the `Cf-Access-Jwt-Assertion` header on those paths; refer to [Store the Access audience](#store-the-access-audience) below. If the secret is missing or invalid, the protected path fails closed.

![protected path fails closed](../cf-access-not-configured.png)

Do not commit sensitive information such as Access audiences, IdP client secrets, service tokens, OAuth client secrets, or screenshots that contain those values.

{{% steps %}}

### Find the Team domain

In Cloudflare, open **Zero Trust** > **Settings**, then copy the **Team domain**.

The installer stores it in `wrangler.toml` during `npm run setup`:

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "vanityurls.cloudflareaccess.com"
```

This value is not a secret, but it must match the Cloudflare account that owns the Access application.

### Choose the identity provider

For phase 1, use [one-time PIN](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) unless you already have a provider ready. For provider strategy, read [Choosing an Identity Provider](/blog/choosing-identity-provider/).

| Option                                                                                             | Use when                                                                   |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [GitHub](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/github/) | Maintainers already use GitHub and you want user or organization selectors |
| [Google](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google/) | Maintainers already use Gmail or Google Workspace                          |
| [Corporate IdP](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/) | Your organization already manages workforce identities and offboarding     |

If you enable multiple providers, users choose one on the Cloudflare Access login page. The policy succeeds when the selected provider returns an identity that matches the policy.

### Create the Access application

In Cloudflare, open **Zero Trust** > **Access Controls** > **Applications**, then:

1. Create an application
2. Select **Self-hosted and private**
3. Continue with **Self-hosted and private**
4. Configure the destinations with _your_ short domain ← replace `v8s.link` with _your_ short domain everywhere

| Subdomain | Domain     | Path         |
| --------- | ---------- | ------------ |
|           | `v8s.link` | `*/_stats`   |
|           | `v8s.link` | `*/_stats/*` |
|           | `v8s.link` | `_tests`     |
|           | `v8s.link` | `_tests/*`   |

Cloudflare Access supports wildcards in the path field. The `*/_stats` entries cover localized dashboard paths such as `/en/_stats/` and `/fr/_stats/` while leaving ordinary public short links outside Access. Legacy `/_stats` requests redirect to `/en/_stats/`; they do not need separate Access destinations.

Use one Access application for the private vanityURLs operations. Public redirect paths should stay outside Access so visitors can follow short links without logging in.

Recommended settings:

| Setting            | Value                                                     |
| ------------------ | --------------------------------------------------------- |
| Application type   | Self-hosted                                               |
| Application name   | Your Worker name, such as `v8s-link`                      |
| Session duration   | `24 hours`                                                |
| Identity providers | One-time PIN for phase 1, or the providers you configured |
| Browser rendering  | Off                                                       |

### Create the Access policy

Start with a simple allow policy:

| Field            | Value                           |
| ---------------- | ------------------------------- |
| Policy name      | `Allow maintainers`             |
| Action           | `Allow`                         |
| Include selector | `Emails`                        |
| Include value    | Your maintainer email addresses |
| Session duration | `24 hours`                      |

Use the policy tester before saving. Test one allowed email address and one address that should be denied.

For a larger team, prefer a maintained group or IdP selector over a long list of individual email addresses.

### Store the Access audience

After the application is created, open **Additional settings** and copy the **Application Audience (AUD) Tag**.

Store it as a Worker secret:

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

### Validate the protection

Before release:

1. Use the Cloudflare policy tester to confirm an allowed identity succeeds
2. Use the policy tester to confirm a denied identity fails
3. Visit `/en/_stats/` from a signed-out or private browser profile
4. Visit one other localized stats path, for example `/fr/_stats/`
5. Visit `/_tests` from a signed-out or private browser profile
6. Confirm Cloudflare Access appears before the dashboard or test page
7. Sign in with an allowed identity and confirm the page loads

Run the local checks before pushing configuration changes:

```bash
npm run check
```

After deployment, repeat the signed-out browser test against the real short domain.

For your information: Cloudflare Access is not the only layer that limits operational file access. For the complete guard table, read [Runtime security](/docs/reference/runtime-security/). For ongoing review, read [Operating Cloudflare Access for a short-link domain](/blog/operating-cloudflare-access-for-a-short-link-domain/).

Keep controlled access on localized stats paths such as `/en/_stats/` and `/fr/_stats/`, plus `/_tests`, the `_headers` runtime-file entries, and the Worker runtime-file guard enabled unless you have a **deliberate public-disclosure reason**. This is a design note, not a separate setup activity.

{{% /steps %}}
