---
title: "Choosing a short domain for redirects"
date: 2026-05-21
author: "Benoît H. Dicaire"
description: "How to choose and register a short domain for a vanityURLs redirector without painting yourself into an operational corner."
tags: ["guide", "domains"]
featured: false
---

A short-link domain has one job: be easy to type, trust, scan, and remember. It does not need to explain your whole organization. It needs to make links like `go.example/launch`, `v8s.link/docs`, or `bn.to/event` feel intentional.

## Start with trust, not only length

The shortest available domain is not automatically the best one. A redirect domain appears in emails, QR codes, conference slides, printed material, social posts, and support replies. People will decide whether to click it in a fraction of a second.

Prefer a domain that is:

- Related to your name, product, brand, or community
- Easy to say out loud
- Hard to confuse with another word or organization
- Free from awkward punctuation when lowercased
- Short enough that the slug still has room to breathe

For example, `go.example.com` is longer than a two-letter country-code domain, but it may be more recognizable for a company that already owns `example.com`.

## Decide between an apex domain and a subdomain

You can run vanityURLs on either:

- A dedicated apex domain, such as `v8s.link`
- A subdomain of a domain you already own, such as `go.example.com`

A dedicated apex domain is memorable and portable. It is also one more domain to renew, secure, and monitor.

A subdomain is often faster to approve inside a team because the organization already owns the parent domain. It is less compact, but it inherits trust from the existing brand.

## Check registrar and DNS constraints

Before buying, confirm that the domain can use Cloudflare authoritative DNS. With Cloudflare's primary DNS setup, you add the domain to Cloudflare and then change the domain's nameservers at the registrar.

Also check:

- Renewal price, not just first-year price
- Whether the registry has special eligibility rules
- Whether domain privacy is available
- Whether DNS security signing is supported
- Whether the registrar gives you direct nameserver control

Cloudflare Registrar is convenient for supported top-level domains because domains purchased there already use Cloudflare DNS. For unsupported domains, any registrar is fine as long as you can change the authoritative nameservers.

## Avoid domains that look disposable

Shorteners are abused across the internet, so trust signals matter. Avoid domains that look like throwaway campaign infrastructure unless that is truly the use case.

Be careful with:

- Random strings that do not connect to your identity
- Look-alike characters or spellings that imitate another brand
- TLDs with a reputation for abuse in your audience
- Domains that are cute but impossible to say over the phone
- Domains that depend on a joke you will not want in five years

The best redirect domains are boring in the right way: compact, owned by you, and durable.

## Plan the first few links

Before you install vanityURLs, write down five links you expect to create first. This helps you test whether the domain feels good in real examples.

Good first links might be:

```text
/github
/docs
/contact
/slides
/status
```

If those links look natural beside your domain, you probably have a good candidate.

## Keep renewal boring

Put the domain renewal date, registrar account, DNS provider, and recovery email in a password manager. A short-link domain becomes infrastructure as soon as you print or share it. Losing the domain later breaks every link you have published.
