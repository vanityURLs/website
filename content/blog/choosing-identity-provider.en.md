---
title: "Choosing an Identity Provider"
date: 2026-05-22
description: "How to choose between One-Time PIN, GitHub, Google, and other identity providers to secure your vanityURLs operational pages"
tags: ["cloudflare", "access", "identity"]
---

Choosing an identity provider (IdP) to manage digital identities for a URL shortener can initially feel like buying a vault for a garden shed. However, it quickly makes sense when you realize that certain URLs can reveal your entire link inventory and expose critical runtime details. Your short-link domain essentially becomes public infrastructure the moment it appears in an email signature.

To prevent unauthorized exposure—even during your initial deployment—vanityURLs uses [Cloudflare Access](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/secure-with-access/) to protect your dashboard.

### The Quickstart Option: One-Time PIN

For a fast setup, the simplest path is Cloudflare's [One-Time PIN (OTP)](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/). This feature allows Cloudflare to send a login code (or "magic link") directly to approved email addresses, completely bypassing the need to configure an external identity provider like Google or Okta.

While this is highly effective for low-frequency applications, I generally recommend setting up a dedicated IdP for tools you use daily to avoid "email fatigue." It takes about 20 minutes to configure your first IdP on Cloudflare, and only about 5 minutes for subsequent ones. It is well worth the time.

### Selecting the Right IdP

When deciding on an identity provider, ask yourself: *Who needs access today? Who will need access once the instance scales? How difficult will it be to offboard someone later?*

- **[GitHub](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/github/):** A perfect fit if your entire team already has accounts. Cloudflare allows you to write Access policies based on specific users, email addresses, or GitHub organization membership
- **[Google](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google/):** A no-brainer if your team utilizes standard Gmail or Google Workspace accounts
- **Corporate IdPs, such as [Microsoft Entra ID](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/entra-id/):** Cloudflare One supports most major enterprise solutions. Integrating your corporate IdP allows you to inherit existing security policies and streamline user offboarding

### Flexibility by Design

You can easily start with a One-Time PIN and configure identity providers for the same application later; your first choice doesn't have to define your permanent architecture.

Furthermore, if a user shares the same email address across multiple identity providers, Cloudflare handles it seamlessly with no technical conflicts:

1. The user selects their preferred identity provider on the login screen.
2. Cloudflare validates the identity returned by that specific provider.
3. If an Access policy allows `user@example.com`, the login succeeds as long as the chosen provider verifies that email address.

### Secure Today, Scale Tomorrow

Don't let analysis paralysis stall your deployment. If you are just getting vanityURLs off the ground, start with the **One-Time PIN** setup to lock down your dashboard immediately. As your team grows or your workflow changes, you can layer on GitHub or Google authentication in minutes without breaking a thing.

Ready to lock down your setup? Head over to your Cloudflare Zero Trust dashboard and follow the [Access control](/docs/access-control/) documentation to get started.
