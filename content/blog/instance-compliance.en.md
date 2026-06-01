---
title: "Instance compliance"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "Good-faith public pages and disclosures for a vanityURLs instance without over-promising legal compliance."
tags: ["roadmap", "operations"]
---

> I built an open-source URL shortener, available at https://www.VanityURLS.link, https://github.com/vanityURLs/code, and https://github.com/vanityURLs/website.

For example, the official demo redirector is at https://vanityurls.link and my personal instance is at dicai.re.

I will copy a zip of both public repositories so you have the context.

The user chooses an available short domain, copies the Git repository locally, runs setup, creates a Worker in their Cloudflare account, and deploys it to the Internet.

It is their instance of the open-source solution, and they are responsible for ethical behavior. Like building a website with Hugo. It is only a tool.

We do not know where users are located, their jurisdiction, the national laws that include privacy, or whether their redirector serves personal, nonprofit, or commercial use.

Which statements or pages, including content, are required on their redirector instance to act in good faith without overextending their liability?

At the moment, it seems that Privacy, Terms, Abuse, and Security pages can work, even if that is only intuition, and some content can probably be consolidated onto a single page.

## Worker Visitor Data And Analytics Paths

Keep Privacy and Terms separate. They do two different legal jobs: Privacy is a disclosure under data-protection regimes ([PIPEDA](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/), [Law 25](https://www.quebec.ca/gouvernement/ministere/cybersecurite-numerique/publications/loi-modernisant-dispositions-legislatives-protection-renseignements-personnels), [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj), CCPA); Terms is a unilateral contract that limits liability and reserves the operator's right to disable links. Mixing them weakens both, and tools that scan domains for compliance, such as registrars enforcing their AUP, look for named pages. Abuse and Security can reasonably merge into a "Report" or "Trust & Safety" page if the deployer wants consolidation; they are both inbound reporting channels with different severities. The only reason to keep `/security` as a separate URL is that `security.txt` already points there via the `Policy:` field, and CERT-style scanners expect a stable path. So my recommendation: keep all four for any public instance, and allow a documented `/legal` bundle with `#privacy`, `#terms`, `#abuse`, and `#security` anchors for personal or non-commercial deployments.

What each page needs to be in good faith without overextending liability. Here is the minimum I would require from deployers, phrased to work across jurisdictions.

Privacy: operator identity and contact channel; an honest list of what is processed (IP, UA, country, path, timestamp); purposes (redirect delivery, abuse prevention, diagnostics); retention expressed as ranges, not promises ("Cloudflare access logs according to their retention; analytics events up to N months if enabled"); subprocessors (Cloudflare always, Umami/Fathom if active) with links to their policies; international transfers acknowledged with a sentence about Cloudflare's global network; a generic rights paragraph ("where applicable law provides rights of access, correction, or deletion, the operator will respond to verified requests") instead of enumerating GDPR articles the operator may not be able to honor; an explicit "no cookies set by this redirector" line if true; children notice ("not intended for children under 13"); last-updated date. The current template is close: add retention, named subprocessors, and dated review, and it lands.

Terms: as-is / no warranty; explicit liability cap, even symbolic ("to the maximum extent permitted by law"); acceptable-use list (phishing, malware, illegal content, intellectual-property infringement); operator right to disable any link at any time without notice; non-endorsement clause (link does not equal endorsement of destination); governing-law placeholder for the operator to fill; dispute clause. Avoid SLAs, uptime promises, and named compliance claims ("GDPR-compliant") you have not audited.

Abuse: contact channel; what a report should contain; categories handled directly by the operator (phishing, malware, copyright, defamation) versus escalation (CSAM -> NCMEC/IWF/local police; name them so reporters do not waste time); good-faith response window, never a guaranteed SLA; actions the operator may take. This is where the deployer gains a safe-harbor posture even in jurisdictions that do not formally offer one: a documented takedown process is the universal signal of good faith.

Security: VDP scope (this domain + Worker code) and explicit exclusions (Cloudflare infrastructure, GitHub); contact, optional PGP; safe-harbor sentence ("good-faith research within scope will not be subject to legal action"); coordinated disclosure expectation (90 days is standard). Mirror it in `/.well-known/security.txt` per [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116), which you already do.

Some items are not pages but belong in the same conversation. `security.txt` (done) and `robots.txt` (done) are part of the trust surface. Quebec Law 25 specifically requires a publicly identified person responsible for personal information; if the deployer is in Quebec, that name or title belongs on the Privacy page. The EU DSA imposes a single point of contact and clear terms on intermediary services; a Quebec deployer with European visitors should treat the Abuse contact as a DSA point of contact. `noindex,nofollow` on templates is good defensive hygiene to avoid unedited defaults polluting search engines.

Two precise risks of overextension in the current templates. First, "The operator may disable or remove links that appear unsafe" in Terms is a right, so it is correct. But no page currently includes a "no warranty / limitation of liability" clause, which is what financially protects the deployer. Second, the Privacy template lists what may be processed without naming Cloudflare as a subprocessor or indicating retention; it is enough for a friendly reader but not for a regulator. Both are fixed with one paragraph.

Concrete suggestion for the project itself: consider adding a `v8s-operator.json` or extending `v8s-site-config.json` with fields required by the build before deployment: `operator.legal_name`, `operator.jurisdiction`, `operator.contact_email`, `operator.privacy_contact`, and `operator.last_updated`. The build should refuse to ship if one is empty or still default. Then the four templates render from these values. That turns "template to adapt", which deployers will forget, into a deployment gate. It is the same pattern as chezmoi discipline: opinionated defaults that fail loudly when they are not configured.
