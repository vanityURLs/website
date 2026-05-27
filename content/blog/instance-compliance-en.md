---
title: Instance compliance
date: 2026-05-15
author: "Benoit H. Dicaire"
description: ""
tags: ["roadmap", "operations"]
draft: true
---
> I built an open source url shortener, it's available on https://www.VanityURLS.link, https://github.com/vanityURLs/code and https://github.com/vanityURLs/website.

For example, the official redirector example is at https://vanityurls.link and my personal instance at dicai.re

I'll copy a zip of both public repo so you'll have the context.

User will pick a short domain available on the market, copy the git code repository locally, execute the installation, create a workers in their cloudflare account and deploy it on the internet.

This is their instance of the open source solution and they're responsible for an ethical behavior. Just like when you're building a web site with Hugo. It's only a tool.

We don't know where the users are located, the jurisdiction, country laws including privacy. We have no clues if their redirector is for personal use, non-profit, and/or commercial.

What are the statements / pages including content requires on their redirector instance to be of good faith without over extending their liability?

Currently, it seems like Privacy, Terms ,Abuse, and Security pages might works although it's only based on gut feeling and some content can probably be consolidated on one page.

## Worker visitor data and analytics paths

Keep Privacy and Terms separate. They do different legal jobs — Privacy is a disclosure under data-protection regimes (PIPEDA, Law 25, GDPR, CCPA), Terms is a unilateral contract limiting liability and reserving the operator's right to disable links. Conflating them weakens both, and tools that scan domains for compliance (and registrars enforcing their AUP) look for the named pages. Abuse and Security can defensibly merge into a single "Report" or "Trust & Safety" page if the deployer wants to consolidate — they're both inbound reporting channels with different severities. The only reason to keep /security as its own URL is that security.txt already points at it via the Policy: field, and CERT-style scanners expect a stable path. So my recommendation: keep all four for any public-facing instance, allow a /legal bundle (with #privacy, #terms, #abuse, #security anchors) as a documented mode for personal/non-commercial deployers.

What each page needs to be good-faith without over-extending. Below is the minimum I'd hold deployers to, written to work across jurisdictions:
Privacy — Operator identity and a contact channel; an honest list of what's processed (IP, UA, country, path, timestamp); purposes (redirect delivery, abuse prevention, debugging); retention stated as ranges, not promises ("Cloudflare access logs per their retention; analytics events up to N months if enabled"); sub-processors (Cloudflare always, Umami/Fathom if turned on) with links to their policies; international transfers acknowledged via the Cloudflare global network sentence; a generic rights paragraph ("where applicable law provides rights of access, correction, or deletion, the operator will respond to verified requests") instead of enumerating GDPR Articles you can't actually fulfil; an explicit "no cookies set by this redirector" line if true; a children's notice ("not directed at children under 13"); a last-updated date. The current template is close — add retention, sub-processors-by-name, and a dated revision and it lands.
Terms — As-is / no warranty; explicit liability cap (even if symbolic — "to the maximum extent permitted by law"); acceptable-use list (phishing, malware, illegal content, IP infringement); the operator's right to disable any link at any time without notice; a non-endorsement clause (linking ≠ endorsing the destination); governing law placeholder for the operator to fill; a dispute clause. Avoid SLAs, uptime promises, and naming compliance frameworks ("GDPR-compliant") you haven't audited.
Abuse — Contact channel; what a report should contain; what categories the operator handles directly (phishing, malware, copyright, defamation) vs. escalates (CSAM → NCMEC/IWF/local LE — name them so reporters don't waste time); a good-faith effort response window, never a guaranteed SLA; what action the operator may take. This is where the deployer earns safe-harbor posture even in jurisdictions that don't formally offer one — documented takedown process is the universal good-faith signal.
Security — VDP scope (this domain + Worker code) and explicit out-of-scope (Cloudflare's infrastructure, GitHub); contact, optionally PGP; a safe-harbor sentence ("good-faith research within scope will not be subject to legal action"); coordinated-disclosure expectation (90 days is standard). Mirror in /.well-known/security.txt per RFC 9116 — you already do.
A few things that aren't pages but belong in the same conversation. security.txt (✓ shipped) and robots.txt (✓ shipped) are part of the trust surface. Quebec Law 25 specifically requires a publicly identified Person Responsible for personal information — if the deployer is in Quebec, that name/title belongs on the Privacy page. The EU DSA imposes a single point of contact and plain-language T&Cs on intermediary services; a Quebec deployer with EU visitors should treat the Abuse contact as the DSA point of contact. The noindex,nofollow you set on the templates is good defensive hygiene against unedited defaults polluting search.
Two specific over-extension risks in the current templates. First, "The operator may disable or remove links that appear unsafe" in Terms is a right — fine. But none of the pages currently include a "no warranty / limit of liability" clause, which is what actually protects the deployer financially. Second, the Privacy template lists what may be processed without naming Cloudflare as a sub-processor or stating retention; that's enough for a friendly reader but not for a regulator. Both are one-paragraph fixes.
Concrete suggestion for the project itself. Consider adding a v8s-operator.json (or extending v8s-site-config.json) with fields the build step requires before deploy: operator.legal_name, operator.jurisdiction, operator.contact_email, operator.privacy_contact, operator.last_updated. The build refuses to ship if any are empty or still default. Then the four templates render from those values. That converts "template to adapt" — which deployers will forget — into a deploy gate. It's the same pattern as your chezmoi discipline: opinionated defaults that fail loud when unconfigured.
