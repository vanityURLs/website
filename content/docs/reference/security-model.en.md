---
aside: false
title: "Security model"
description: "Trust boundaries, attacker-controlled surfaces, and where each control is enforced across build time, the Worker runtime, and the Cloudflare edge."
weight: 101
aliases:
  - /docs/security-model/
---

This page is written for security reviewers. [Runtime security](/docs/reference/runtime-security/) explains how the Worker behaves. [Network protection](/docs/customize/network-protection/) and [Access control](/docs/customize/access-control/) explain what an operator configures. This page ties those views together by naming the trust boundaries and showing where each control is enforced: build time, Worker runtime, or the Cloudflare edge.

The most common review mistake is treating an edge-enforced or build-time control as missing because it is not in the Worker source. The matrix below exists to make that split explicit.

## Defense layers

{{< mermaid >}}
flowchart LR
A["Visitor request"] --> B["Cloudflare edge<br/>TLS, WAF, rate limit,<br/>bot and Access controls"]
B --> C["vanityURLs Worker<br/>method, target, and<br/>runtime-asset checks"]
C --> D["Static assets<br/>generated from a<br/>build-validated registry"]
{{< /mermaid >}}

A request crosses three boundaries. Each later layer assumes the earlier layers may have been bypassed and re-checks what it owns, so no single layer is the sole line of defense.

## Trust boundaries

| Surface                                                     | Input controlled by                      | Runs where                                          | Notes                                                                                                                                                                 |
| ----------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public redirect and page requests                           | Anyone                                   | Worker, at the edge                                 | The primary attacker-facing surface. Method, path, headers, and slug are all untrusted.                                                                               |
| Redirect targets and link registry (`v8s.json`)             | Operator                                 | Built locally or in CI, served read-only at runtime | Targets are static data, validated before deployment. There is no runtime write path, stored-injection surface, or authenticated create endpoint.                     |
| Policy and blocklist (`v8s-policies.json`, generated feeds) | Operator, plus pinned upstream feed URLs | Build time                                          | Generated feeds can only add blocks. The generator hardcodes an empty allow list, so a compromised feed cannot whitelist a malicious target.                          |
| Protected operational paths (`/<lang>/_stats`, `/_tests`)   | Authenticated maintainer                 | Worker, behind Cloudflare Access                    | Fails closed: `503` when Access is unconfigured, `403` without a valid JWT.                                                                                           |
| Local and CI scripts (`scripts/`)                           | Operator                                 | Operator machine or CI runner                       | Not network-exposed. Subprocess calls use argument arrays; Windows npm fallback is centralized for path compatibility. The installer handles no secrets.              |
| Upstream product files (`npm run upgrade`)                  | Upstream maintainers, over HTTPS         | Operator machine                                    | Replaces product-owned paths only; `custom/`, `wrangler.toml`, and `.dev.vars` are protected. See the upgrade trust note in [Supply chain](#supply-chain).            |
| Cloudflare dashboard controls                               | Operator                                 | Cloudflare edge                                     | Used for controls that cannot reasonably live in Git, such as Access, WAF, rate limits, TLS, bot controls, and runtime secrets. Repository-owned duplicates stay off. |

## Enforcement matrix

A check mark means the layer actively enforces the control. A dash means it does not, by design.

| Control                                                                                                                               |     Build time     |         Worker runtime          |                         Cloudflare edge                          |
| ------------------------------------------------------------------------------------------------------------------------------------- | :----------------: | :-----------------------------: | :--------------------------------------------------------------: |
| Redirect protocol allowlist (`http:`/`https:`)                                                                                        |       check        |              check              |                                -                                 |
| Open-redirect hygiene: no credentials, no control chars, hostname required                                                            |       check        |              check              |                                -                                 |
| Unsafe-target screening: localhost, `.local`, private/reserved/multicast/doc IP ranges, executable extensions, phishing-lure examples |       check        |                -                |                                -                                 |
| Domain and keyword blocklist: shorteners, disposable hosts, custom policy                                                             |       check        |                -                |                                -                                 |
| Splat values URL-encoded per segment                                                                                                  |         -          |              check              |                                -                                 |
| HTTP method allowlist (`GET`/`HEAD`/`OPTIONS`)                                                                                        |         -          |              check              |                              check                               |
| Private runtime assets hidden (`v8s.json`, blocklist, site config)                                                                    |         -          |          check (`404`)          |          check (`_headers` no-index/no-store fallback)           |
| Protected operational paths require authentication                                                                                    |         -          | check (JWT verify, fail closed) |                    check (Cloudflare Access)                     |
| Scanner-probe blocking                                                                                                                |         -          |        check (fallback)         |                     check (WAF, first line)                      |
| Reserved-slug protection: no links under `/_stats`, `/api`, raw runtime assets, and related prefixes                                  |       check        |   check (routing precedence)    |                                -                                 |
| Lookup anti-harvesting controls                                                                                                       |         -          |  exact-match only, no listing   | check (explicit `/_lookup` and `/_analytics/lookup` rate limits) |
| Rate limiting                                                                                                                         |         -          |                -                |                              check                               |
| Bot and AI-crawler controls                                                                                                           |         -          |                -                |                              check                               |
| Transport security: Always HTTPS, minimum TLS, HSTS                                                                                   |         -          |       check (HSTS header)       |                check (TLS and HTTPS enforcement)                 |
| Content, cache, and robots headers: `nosniff`, `X-Robots-Tag`, `Cache-Control`, CSP, referrer, permissions, framing                   | check (`_headers`) |    check (dynamic responses)    |                   check (served header policy)                   |
| Generated `src/` matches `scripts/workers/`                                                                                           |       check        |                -                |                                -                                 |

Two consequences matter during review:

- **Target safety is primarily a build-time property.** Targets are static and validated before deploy, so the Worker re-checks only the safety properties that matter at request time: protocol, credentials, control characters, and hostname presence. Reviewing target safety means reviewing `validate-registry.mjs`, `blocklist-policy.mjs`, `constants.mjs`, and `defaults/v8s-policies.json`, not only the Worker.
- **A large share of the posture lives at the edge.** TLS, HTTPS enforcement, rate limiting, bot controls, Access, and first-line scanner blocking are Cloudflare settings. They are documented in [Network protection](/docs/customize/network-protection/) and tracked in `data/cloudflare-protection-defaults.json`, but they are not application code.

## Secrets and sensitive data

- Worker secrets live in Cloudflare runtime secrets, such as `CF_ACCESS_AUD` when Access is enabled. `CF_ACCESS_TEAM_DOMAIN` is a non-secret runtime variable.
- The installer never reads, writes, or logs secrets. Analytics scripts read provider keys from environment variables only, and diagnostic output redacts the `Authorization` header.
- Local secrets live in `.dev.vars`, which is git-ignored. Workstation helper paths live in `custom/v8s-local-config.json`.
- At request time, the Worker forwards a truncated visitor IP to analytics by default (IPv4 to `/24`, IPv6 to `/48`), plus user agent, country, and colo. Full-IP mode is opt-in. No visitor identifier is stored by the redirector itself.

## Supply chain

- The Worker package has no runtime npm dependencies. Development dependencies are build and formatting tools.
- `npm run upgrade` fetches product-owned files from the upstream Git remote over HTTPS, then runs the build and tests on the fetched code before the operator reviews the diff.
- The upgrade flow replaces product-owned paths only. `custom/`, `wrangler.toml`, `.dev.vars`, and local instance configuration remain protected.
- The default upgrade source is a branch ref, not a verified release artifact. Treat the upstream remote and operator transport as part of the trust base. Pin a release tag with `--ref` when that assumption is too broad.

## Review order

Read in this order; each step assumes the threat model from the step before.

1. This page: trust boundaries and the enforcement matrix
2. The network-exposed surface: `scripts/workers/worker.mjs` and `scripts/workers/worker.test.mjs`
3. The trust-enforcement layer, where unsafe targets are defined: `validate-registry.mjs`, `blocklist-policy.mjs`, `constants.mjs`, and `defaults/v8s-policies.json`
4. Configuration and supply chain: `wrangler.toml`, `defaults/public/_headers`, `package.json`, and [ADR 0014](https://github.com/vanityURLs/code/blob/main/docs/adr/0014-prefer-repository-owned-configuration.md)
5. The edge configuration docs: [Network protection](/docs/customize/network-protection/), [Access control](/docs/customize/access-control/), and `data/cloudflare-protection-defaults.json`

## Review notes

These are not known exploitable issues; they are places reviewers often ask about.

- Access keysets are cached per Worker isolate and can refresh when an unknown key id is seen. Review `loadAccessJwks` in `worker.mjs` when tuning key-rotation behavior.
- Lookup is public by design, but exact-match only. It does not list links or autocomplete slugs. Treat enumeration pressure as an edge rate-limiting concern, not a Worker inventory endpoint.
- Repository-owned security headers intentionally stay in the Worker and `_headers` files. Cloudflare's broad security-header transform stays off so application policy has one source of truth.
