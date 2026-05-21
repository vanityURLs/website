---
title: "Quickstart"
description: "Launch a plain vanityURLs redirector on your own short domain in about 10 minutes, then customize it once the first deployment works."
nav_order: 1
aside: false
---

vanityURLs is a self-hosted short-link redirector for a domain you control. This Quickstart is intentionally narrow: get a plain instance running on Cloudflare Workers first, then come back for branding, analytics, policy pages, access control, and other customization once the redirector is online.

The happy path is:

1. Choose a short domain
2. Put that domain on Cloudflare DNS
3. Create a GitHub repository with the content of vanityURLs code
4. Configure the few required values in your terminal
5. Let Cloudflare deploy the Worker
6. Test your first short links

## What you need

Before starting, make sure you have these pieces ready:

- **A registered short domain** that you will use only for redirects, such as `ex.am` or another compact domain you control. If you have not chosen one yet, read [Choosing a short domain for redirects](/blog/choosing-a-short-domain-for-redirects/)
- **A GitHub account** for the repository that stores your links and deployment history. The repository can be public, or private if you do not want to share your short links. GitHub's guide to [creating an account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) is the best starting point if you are new to it
- **A Cloudflare account** for DNS and Workers. You can use an existing account or create a new one; refer to [Cloudflare documentation](https://developers.cloudflare.com/fundamentals/account/create-account/) when creating an account
  - **Cloudflare authoritative DNS for the short domain**. vanityURLs expects Cloudflare to manage the DNS zone used by the Worker route or custom domain. Cloudflare's [full setup guide](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) explains how to add a domain and change nameservers at your registrar
  - **Cloudflare Access team domain**. The installer asks for `CF_ACCESS_TEAM_DOMAIN`; find it in **Zero Trust** > **Settings** as the **Team domain**, such as `<team>.cloudflareaccess.com`
- **A local workstation** running Linux, macOS, or Windows with Git, Node.js 20 or newer, npm, and your preferred text editor
- **A password manager** or other secure notes system for Cloudflare account IDs, API tokens, Worker secrets, analytics IDs, and recovery information
- **Optional analytics**. You only need [Fathom](https://usefathom.com/) or [Umami](https://umami.is/) if you want analytics during the customization phase. Read [Choosing privacy-friendly analytics for short links](/blog/choosing-privacy-friendly-analytics-for-short-links/) before creating an analytics account

Phase 1 is about making the redirector work. In phase 2, customize the branding, homepage, legal pages, status pages, analytics, and other public details.

## Phase 1: first deployment

{{% steps %}}

### Start your terminal

Open a terminal and move to the directory where you keep source code. For example:

```bash
cd ~/code
```

Use whatever local structure already works for you. The important part is that the vanityURLs instance lives in a directory you can find again.

### Confirm GitHub authentication

Make sure your GitHub account is configured for either SSH or HTTPS before you push your own repository. GitHub documents both paths:

- [Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Caching your GitHub credentials in Git](https://docs.github.com/get-started/getting-started-with-git/caching-your-github-credentials-in-git)

Create a new public or private GitHub repository for your redirector before the final push step. Do not initialize it with a README, license, or `.gitignore`; the local instance will provide the initial content.

### Clone the vanityURLs code

```bash
git clone https://github.com/vanityURLs/code.git redirector
cd redirector
```

You can use any directory name instead of `redirector`. Choose a name that will still make sense if you later align it with your GitHub repository name.

### Detach the clone from the upstream project

Run the detach helper before creating your own Git history:

```bash
npm run detach
```

The helper removes upstream project metadata that is useful for vanityURLs development but not for your personal instance:

```text
.git
.github/
.all-contributorsrc
.release-please-manifest.json
CHANGELOG.txt
package-lock.json
release-please-config.json
```

### Confirm required tools are available

```bash
which npm node git jq
```

If any command is missing, install it before continuing. `jq` is required when you install the [Local helper](/docs/local-helper/) later in this Quickstart.

### Install dependencies

```bash
npm install
```

### Configure a plain instance

Run the installer:

```bash
npm run setup
```

You can run `npm run setup` as often as you like. The installer is designed to be idempotent: it reads your existing configuration, shows previous answers as defaults, and updates the same generated files instead of requiring a fresh clone.

The interactive installer asks these questions:

| Question | Sample answer | Rationale and acceptable answers |
| :--- | :--- | :--- |
| Short domain | `v8s.link` | The domain that will serve your short links. Values shown in parentheses are defaults; rerunning setup offers your previous answer |
| Worker name | `v8s-link` | Cloudflare Worker project name. Lowercase letters, numbers, and hyphens work best |
| Owner label | `team` | Short internal label written beside starter links. Use your name, team, or organization slug |
| Analytics provider | `disabled` | Use `disabled` for phase 1. Later, use `fathom`, `umami`, or a comma-separated value if you configure analytics |
| Cloudflare Access team domain | `team.cloudflareaccess.com` | The value for `CF_ACCESS_TEAM_DOMAIN`; find it in **Zero Trust** > **Settings** as the **Team domain** |
| Supported languages | `en,fr` | Comma-separated language codes. Keep `en` unless you have a specific reason to remove other generated pages later |
| Operator legal name | `Example Inc.` | The person or organization responsible for the instance and its legal pages |
| Operator jurisdiction, for example Canada | `Canada` | The place whose laws govern your instance. Usually where you or the operating organization are established |
| Governing law | `Canada` | Usually the same as jurisdiction. Use a narrower value, such as `Quebec, Canada`, only when that is the right legal context |
| Operator contact email | `hello@v8s.link` | General contact. Defaults to `hello@<short-domain>` |
| Privacy contact | `privacy@v8s.link` | Privacy requests and data-protection questions. Defaults to `privacy@<short-domain>` |
| Trust & Safety contact | `abuse@v8s.link` | Abuse reports, phishing, malware, impersonation, and harmful links. Defaults to `abuse@<short-domain>` |
| Security contact | `security@v8s.link` | Vulnerability reports and the address published in `security.txt`. Defaults to `security@<short-domain>` |
| Legal pages last updated date | `2026-05-21` | Date used on generated legal pages. Use `YYYY-MM-DD` |
| Trust & Safety response window | `5 business days` | Good-faith response expectation, not a guaranteed service-level agreement |
| Copy default web pages to custom/public with a split-color domain wordmark? | `Y` | Copies editable public pages into `custom/public` and applies the wordmark split |
| Black wordmark portion | `v8s.` | First part of the homepage wordmark |
| Green wordmark portion | `link` | Second part of the homepage wordmark |

Values shown in parentheses are defaults. If you run `npm run setup` again, the installer reads your previous answers and offers them as the new defaults.

The operator short domain is derived from the short domain, so the installer does not ask for it twice. When analytics is disabled, the installer also skips analytics disclosure and retention prompts. If you enable Fathom or Umami, those analytics questions are shown because the generated privacy page needs to explain what is enabled and how long the analytics provider keeps data.

For jurisdiction, use the place whose laws govern your instance. For a personal or organizational redirector, that is usually where you or the operating organization are established. For governing law, use the same value unless you have a specific legal reason to choose something narrower, such as `Quebec, Canada`.

For phase 1, prefer simple answers. You can refine the legal pages, supported languages, and branding in phase 2.

If `custom/v8s-links.txt` does not exist, setup creates a small starter file with `home`, `status`, and `docs` links. It does not copy `defaults/v8s-links.txt`; `custom/` is your instance-owned layer, while `defaults/` stays the upstream product baseline.

When the installer asks for a split-color domain wordmark, it means the homepage logo can be split into a dark prefix and a green suffix:

![Split-color domain wordmark example](/images/docs/split-color-domain-wordmark.svg)

### Install local helpers

```bash
npm run local-install
```

This installs the local `v8s` shell helper, local `lnk` command wiring, and workstation registry configuration used by the instance. See [Local helper](/docs/local-helper/) for the read-only terminal helper, and [CLI](/docs/cli/) for the source-editing `lnk` command.

### Create your first commit

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
```

### Push to your GitHub repository

Use the repository URL from the GitHub repository you created for your instance:

```bash
git remote add origin git@github.com:[account name]/[repository name]
git push -u origin main
```

If you configured HTTPS instead of SSH, use the HTTPS remote URL GitHub provides.

### Connect the repository to Workers & Pages

In Cloudflare, open **Workers & Pages** from the account main menu, then:

1. Create an application
2. Continue with GitHub
3. Select your redirector repository
4. Confirm the project name matches the `name` value in `wrangler.toml`
5. Leave the **Build** and **Deploy** fields as-is so `wrangler.toml` remains authoritative
6. Deselect builds for non-production branches unless you want every branch to deploy

### Set up an identity provider

Cloudflare Access needs an identity provider before it can protect private paths. You can configure an [identity provider](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/) or use Cloudflare One's [one-time PIN](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) option with approved email addresses.

One-time PIN needs no provider setup. Add the user's email address to an [Access policy](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/) and to the group that allows your team to reach the application.

You can configure one-time PIN and several identity providers at the same time. If a user has the same email address in multiple providers, there is no technical conflict, but the login flow changes:

- The user selects an identity provider on the login page
- Cloudflare validates the identity returned by that provider
- A policy that allows `user@example.com` passes when the chosen provider returns that email address

### Optional: GitHub identity provider

Follow Cloudflare's [GitHub identity provider instructions](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/github/).

The GitHub integration is not restricted to organizations. You can use it with any GitHub account, including individual accounts. In your Access policy, control who gets in by filtering for specific GitHub usernames, email addresses, or organization memberships.

Useful Access selectors include:

- `GitHub Organization` to restrict access to members of a specific GitHub organization
- Email selectors when GitHub returns the email address you expect
- WARP posture checks when users must have the Cloudflare WARP client connected
- `IP Ranges` to restrict access to specific networks or office IPs
- `Country` to restrict access based on geographic location

Some GitHub users do not disclose a public email address through the GitHub API. For example, `https://api.github.com/users/USERNAME` may return `"email": null`.

### Optional: Google identity provider

Follow Cloudflare's [Google identity provider instructions](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google/).

### Create the Access application

In Cloudflare, open **Zero Trust** > **Access Controls** > **Applications**, then:

1. Create an application
2. Select the **Self-hosted and private** tab
3. Continue with **Self-hosted and private**
4. Open **Application details**
5. Add these destinations, replacing `vanityURL.link` with your short domain:

| Subdomain | Domain | Path |
| :--- | :--- | :--- |
| | `vanityURL.link` | `_stats` |
| | `vanityURL.link` | `_stats/*` |
| | `vanityURL.link` | `_tests` |
| | `vanityURL.link` | `_tests/*` |

1. Choose the identity providers available for this application
2. Create an Access policy:

| Field | Value |
| :--- | :--- |
| Policy name | `Allow emails` |
| Action | `Allow` |
| Session duration | `24 hours` |
| Include selector | `Emails` |
| Include value | `yourEmailAddress.domain.com` |

1. Use the policy tester to confirm your email address is allowed
2. Open the **Additional settings** tab
3. Copy the **Application Audience (AUD) Tag** value
4. Save the policy

### Store the Access audience secret

In your local terminal, add the Access audience as a Worker secret:

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

The setup command already writes the Access team domain to `wrangler.toml`. Confirm that it matches the Team domain from Cloudflare Zero Trust:

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

### Validate and push

```bash
npm run check
git add .
git commit -m "configure Cloudflare Access"
git push
```

Cloudflare should deploy from GitHub after the push.

### Test the deployment

Open the home page, `/expand/`, `/404.html`, `/expired.html`, `/disabled.html`, and `/maintenance.html`.

The installer creates these initial custom links in `custom/v8s-links.txt`:

| Slug | Long link |
| :--- | :--- |
| `home` | `https://<short-domain>` |
| `status` | `https://status.<short-domain>` |
| `docs` | `https://vanityURLs.link/en/docs/` |

The upstream default link file has a larger set of examples. Once setup creates `custom/v8s-links.txt`, your instance uses the custom starter links above instead of these defaults, but the defaults are useful examples while learning the file format:

| Slug | Long link |
| :--- | :--- |
| `ai/chat` | `https://chatgpt.com` |
| `ai/claude` | `https://claude.ai` |
| `ai/g` | `https://gemini.google.com/` |
| `v8s/doc` | `https://vanityURLs.link/en/docs/` |
| `test/1` | `https://youtu.be/dQw4w9WgXcQ` |
| `test/4` | `https://youtu.be/dQw4w9WgXcQ` |

Test at least one initial custom link, such as `https://<short-domain>/docs`, and confirm that it redirects to the long link shown in the table.

Then test `/_stats` and `/_tests` from a signed-out or private browser profile. You should see Cloudflare Access before the protected dashboard or test page.

{{% /steps %}}

## After the plain instance works

Use [Custom overrides](/docs/custom-overrides/) to replace default branding, public assets, policy pages, status pages, and localized pages without editing `defaults/`. Use the Cloudflare guide when you need the longer dashboard checklist for DNS, Access, identity providers, security rules, and observability.
