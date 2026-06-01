---
title: "Accents, IDN, and short-link slugs"
date: 2026-06-01
author: "Benoît H. Dicaire"
description: "Why vanityURLs keeps short-link slugs ASCII-only while allowing normal HTTP(S) destination URLs."
tags: ["urls", "i18n", "short-links", "security"]
featured: false
---

Accents belong in people names, page copy, titles, and destination websites. They do not belong in vanityURLs short-link slugs.

That sounds stricter than the modern web really is. Browsers can show internationalized domain names. URLs can carry UTF-8 characters. Search engines can crawl paths with accents. People share links in many languages every day.

The problem is not whether the internet can represent accents. It can. The problem is whether a short-link slug remains easy to type, review, compare, log, and defend when the same visible word can have more than one technical representation.

## Domains are special

Internationalized domain names use IDNA and Punycode. A browser may display `éxample.test`, while DNS stores an ASCII-compatible form that starts with `xn--`.

That translation exists because DNS has old ASCII roots. It also creates a security and usability burden: some characters look alike, some scripts can be confused, and different applications may choose different display rules.

For a short-link service, the safest domain posture is simple: use an operator-owned domain, keep DNS and Cloudflare configuration explicit, and treat IDN support as a domain registration decision rather than a slug feature.

## Paths are different

The path after the domain is not DNS. A path like `/déplier` can be encoded, decoded, copied, normalized, and displayed differently by different tools:

- Unicode can be represented in composed or decomposed forms.
- Browsers may show readable characters while logs show percent encoding.
- Shells, spreadsheets, chat tools, QR encoders, and analytics exports may preserve or rewrite the bytes differently.
- Similar-looking characters can make review harder.

That is a poor trade for a short slug whose job is to be small, visible, and boring.

## vanityURLs policy

vanityURLs keeps short-link slugs ASCII-only:

- letters `A-Z` and `a-z`
- digits `0-9`
- dot, underscore, tilde, and hyphen inside a segment
- slash only as a path separator

Localized pages may still use language-specific aliases, but those aliases should be ASCII too. For example, French can use `/fr/deplier` instead of `/fr/déplier`.

This keeps manual typing reliable, makes Git diffs and review clearer, avoids Unicode normalization surprises, and reduces the risk of confusingly similar slugs.

## Destination URLs

Destination URLs are different. They belong to the target website, not to the short-link namespace.

vanityURLs should not aggressively rewrite a valid HTTP(S) destination. The build and runtime should enforce safety properties instead:

- the URL must be absolute `http` or `https`
- it must have a hostname
- it must not include embedded credentials
- it must not contain control characters
- redirecting states are checked against the instance blocklist policy

When a destination contains Unicode, the platform URL parser may serialize the hostname through IDNA and encode path characters as needed. That is normal URL handling, not a vanityURLs slug policy.

The short version: keep slugs ASCII. Let destination owners own their URLs. Validate destinations for redirect safety rather than trying to transliterate the internet.
