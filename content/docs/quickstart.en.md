---
title: "Quickstart"
description: "Launch a plain vanityURLs redirector on your own short domain in about 10 minutes, then customize it once the first deployment works."
nav_order: 2
aside: false
---

This Quickstart is the hands-on setup sequence for a plain vanityURLs instance. Start with the simple path, get the redirector deployed, then refine branding, legal pages, analytics, access control, and link inventory during customization.

The activities below use example values from the `v8s.link` demo instance. It is configured and documented as an inspiration point while you build and debug your own instance. Replace the short domain, GitHub account, repository name, Cloudflare team domain, and email addresses with the values for your own instance. Detailed `v8s.link` configuration will live in the [v8s.link reference](/docs/demo/) section as the reference instance matures.

| Assumption | Example used below |
| :--- | :--- |
| Short domain | `v8s.link` |
| Local directory | `redirector` |
| GitHub account name | `your-github-account` |
| GitHub repository name | `v8s.link` |
| Cloudflare Access team domain | `team.cloudflareaccess.com` |
| Operator contact domain | `v8s.link` |

Use simple answers during the Quickstart. You can run `npm run setup` as often as you like; the installer is idempotent, reads your existing configuration, shows previous answers as defaults, and updates the same generated files instead of requiring a fresh clone.

{{% steps %}}

### Start your terminal

Open a terminal and move to the directory where you keep source code. For example:

```bash
cd ~/code
```

Use whatever local structure already works for you. The important part is that the vanityURLs instance lives in a directory you can find again.

### Confirm GitHub authentication

Make sure your GitHub account is configured for either [SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) or [HTTPS](https://docs.github.com/get-started/getting-started-with-git/caching-your-github-credentials-in-git) before you push your own repository.

Create a new public or private GitHub repository for your redirector before the final push step. Do not initialize it with a README, license, or `.gitignore`; the local instance will provide the initial content.

### Clone the vanityURLs code

```bash
git clone https://github.com/vanityURLs/code.git redirector
cd redirector
```

You can use any directory name instead of `redirector`. Choose a name that will still make sense if you later align it with your GitHub repository name.

### Detach the clone from the upstream project

Run the detach helper before creating your own Git history. It removes upstream project metadata that is useful for vanityURLs development but not for your personal instance:

```bash
npm run detach
```

### Confirm required tools are available on the workstation

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

The interactive installer asks these questions:

| Question | Sample answer | Rationale and acceptable answers |
| :--- | :--- | :--- |
| Short domain | `v8s.link` | The domain that will serve your short links |
| Worker name | `v8s-link` | Cloudflare Worker project name. Lowercase letters, numbers, and hyphens work best |
| Owner label | `team` | Short internal label to identify the person or team that made the change. See [Owner labels for short-link change history](/blog/owner-labels-for-short-link-change-history/) |
| Analytics provider | `disabled` | Use `disabled` for phase 1. See [Server-side analytics](/docs/server-side-analytics/) during customization |
| Cloudflare Access team domain | `team.cloudflareaccess.com` | The value for `CF_ACCESS_TEAM_DOMAIN`; find it in **Zero Trust** > **Settings** as the **Team domain** |
| Supported languages | `en,fr,es,it,de` | Comma-separated language codes for English, French, Spanish, Italian, and German. See [Languages](/docs/i18n/) |
| Configure privacy, terms, and security pages now? | `N` | Use `N` for phase 1 if you want to defer jurisdiction and legal-page customization |
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

Some defaults are derived from your previous answers so the installer does not ask for the same idea twice. Setup also skips related questions when you disable a section, such as analytics or full legal pages.

When the installer asks for a split-color domain wordmark, it means the homepage logo can be split into a dark prefix and a green suffix:

![Split-color domain wordmark example](/images/docs/split-color-domain-wordmark.svg)

### Install local helpers

```bash
npm run local-install
```

The installation script copies local tools to the expected path on your workstation. The `v8s` shell module lets you open a known short link directly from your terminal instead of switching to a browser first. The command line interface `lnk` lets you manage the content of `v8s-links.txt` and `v8s-schedules.json` without using a text editor. See [Local helper](/docs/local-helper/) and [CLI](/docs/cli/) for more information.

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
git remote add origin git@github.com:your-github-account/v8s.link.git
git push -u origin main
```

or

```bash
git remote add origin https://github.com/your-github-account/v8s.link.git
git push -u origin main
```

### Connect the repository to Workers & Pages

In Cloudflare, open **Workers & Pages** from the account main menu, then:

1. Create an application
2. Continue with GitHub
3. Select your redirector repository
4. Confirm Cloudflare is using the project name written by setup in `wrangler.toml`
5. Leave the **Build** and **Deploy** fields as-is so `wrangler.toml` remains authoritative
6. Deselect builds for non-production branches unless you want every branch to deploy

### Configure Access control

Protect `/_stats` and `/_tests` with Cloudflare Access before treating the instance as production. For phase 1, use one-time PIN with approved email addresses. You can switch to GitHub, Google, or another identity provider later.

Follow [Access control](/docs/access-control/) to create the Zero Trust application, configure the policy, and copy the **Application Audience (AUD) Tag**.

In your local terminal, store the Access audience as a Worker secret:

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

The setup command already writes the Access team domain to `wrangler.toml`. Confirm that it matches the Team domain from Cloudflare Zero Trust:

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

### Optional: test locally

Before pushing the Access secret commit, you can run the Worker locally:

```bash
npm run dev
```

Wrangler starts a local development server so you can check the homepage, generated pages, and basic redirects before Cloudflare deploys from GitHub.

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

If `custom/v8s-links.txt` does not exist, setup creates a small starter file with `home`, `status`, and `docs` links. It does not copy `defaults/v8s-links.txt`; `custom/` is your instance-owned layer, while `defaults/` stays the upstream product baseline.

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

Use [Custom overrides](/docs/custom-overrides/) to replace default branding, public assets, policy pages, status pages, and localized pages without editing `defaults/`. Use [Access control](/docs/access-control/) for Zero Trust applications, policies, and identity-provider settings. Use the Cloudflare guide when you need the longer dashboard checklist for DNS, security rules, and observability.
