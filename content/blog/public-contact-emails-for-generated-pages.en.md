---
title: "Public contact emails for generated pages"
date: 2026-05-28
author: "Benoît H. Dicaire"
description: "Why setup asks you to review public contact email addresses, where vanityURLs publishes them, and when the defaults are enough."
featured: false
---

The setup question **Review public contact emails for generated pages?** controls whether the installer pauses on the contact addresses that vanityURLs publishes in generated public pages. These addresses are not visitor accounts and they are not used for click tracking. They are operational contacts that help people report abuse, disclose security issues, or ask the operator about published legal pages.

The rule is simple: do not publish a mailbox you do not operate.

For a phase-1 instance, role-based defaults are enough only when the operator controls mail for that domain or has forwarding in place. If you leave the operator contact domain blank, setup derives addresses from the short domain, such as `abuse@example.link` and `security@example.link`. If you enter an operator domain, such as `example.com`, setup derives the same roles on that domain instead.

## What each address is for

The Trust & Safety contact is the public reporting path for abusive, harmful, phishing, malware, impersonation, or otherwise problematic short links. vanityURLs publishes it on generated trust and safety pages, together with the expected human response window.

The Security contact is for vulnerability reports that affect the short-link instance itself. It is published in the generated security page and in [`/.well-known/security.txt`](https://www.rfc-editor.org/rfc/rfc9116), so security researchers and automated tools can find the correct private disclosure path.

When full legal pages are enabled, setup also uses an Operator contact email and a Privacy contact. The operator contact appears on generated terms pages. The privacy contact appears on generated privacy pages and is the address visitors should use for privacy questions about the instance.

## Why role-based addresses work better

Role-based addresses are easier to keep stable than personal mailboxes. `abuse@`, `security@`, `privacy@`, and `hello@` can be routed to the right person today and transferred later when ownership changes.

They also make the generated pages easier to understand. A registrar, hosting provider, abuse desk, security researcher, or destination owner can recognize the purpose of the mailbox without knowing the operator personally.

## When to review the defaults

Answer `Y` during setup when public reports should go to a domain other than the short-link domain, when an organization already has established abuse or security mailboxes, or when full legal pages are being published immediately.

Answer `N` when you are getting the instance online and the derived defaults are acceptable for now.

You can rerun `npm run setup` later; it reads the existing values and offers them back as defaults. You can also edit `custom/v8s-site-config.json` directly. The relevant keys are `operator.contact_email`, `operator.privacy_contact`, `operator.abuse_contact`, and `operator.security_contact`.
