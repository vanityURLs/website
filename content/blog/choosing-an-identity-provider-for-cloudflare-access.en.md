---
title: "Choosing an identity provider for Cloudflare Access"
date: 2026-05-22
description: "How to decide between one-time PIN, GitHub, Google, and other identity providers for protected vanityURLs operational pages."
tags: ["cloudflare", "access", "identity"]
---

vanityURLs uses Cloudflare Access to protect operational paths such as `/_stats` and `/_tests`. Those pages should not be public, even during the first deployment.

For phase 1, the simplest path is Cloudflare One-time PIN. It lets Cloudflare send a login code to approved email addresses without configuring a separate identity provider. That is often enough for a personal instance or a small team that only needs to protect a dashboard.

GitHub is a good fit when the same people who manage the repository should access the operational pages. You can write Access policies around specific users, email addresses, or organization membership.

Google or another workforce identity provider is a better fit when access should follow company accounts, offboarding, device posture, or existing security policy.

The decision is mostly operational:

- Use one-time PIN when you want the fastest safe setup
- Use GitHub when repository maintainers and operational users are the same group
- Use a workforce identity provider when access should follow company identity management

You can start with one-time PIN and add a stronger identity provider later. Cloudflare Access can offer multiple login methods for the same protected application.
