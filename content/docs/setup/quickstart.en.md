---
title: "Quickstart"
description: "Launch a plain vanityURLs redirector on your own short domain, then customize it once the first deployment works."
weight: 20
aside: false
aliases:
  - /docs/quickstart/

---
Let's get things done. Do you have the prerequisites from [Setup](/docs/setup/)? No rush; this page can wait with unusual patience.

<p>
  An <dfn id="idempotent-installer">idempotent installer</dfn> can be run repeatedly without requiring a fresh clone. Use simple answers during the Quickstart; <code>npm run setup</code> reads your existing configuration, shows previous answers as defaults, and updates the same generated files. See the <a href="/en/docs/reference/glossary/#idempotent">glossary definition</a>.
</p>

The maintainers insisted that the steps below use a pertinent stuff instead of a pile of `example.com` placeholders that leave everyone perplexed and in need of a drink. So we spun up a demo instance named [v8s.link](/docs/demo/) to demonstrate what works without ambiguity.

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
git clone https://github.com/vanityURLs/code.git v8s-link
cd v8s-link
```

You can use any directory name instead of `v8s-link`. Choose a name that will still make sense if you later align it with your GitHub repository and Worker name.

### Detach the clone from the upstream project

Run the detach helper before creating your own Git history. It removes upstream project metadata that is useful for vanityURLs development but not for your personal instance:

```bash
npm run detach
```

### Confirm required tools are available on the workstation

```bash
which npm node git jq
```

If any command is missing, install it before continuing. `jq` is required when you install the [Local helper](/docs/command-line-interface/local-helper/) later in this Quickstart.

### Install dependencies

```bash
npm install
```

### Configure a plain instance

Run the installer:

```bash
npm run setup
```

For phase 1, focus on these installer answers. The installer also asks operator, trust, and legal-context questions; use simple values and refer to [Jurisdiction](/docs/customize/jurisdiction/) for the full decision table.

| Question | Sample answer | How to answer |
| --- | --- | --- |
| Short domain | `v8s.link` | The domain that will serve your short links |
| Worker name | `v8s-link` | Cloudflare Worker project name. Lowercase letters, numbers, and hyphens work best |
| Owner label | `team` | Label to identify the person or team that made the change. Refer to [Owner labels for short-link change history](/blog/owner-labels-for-short-link-change-history/) |
| Random slug length | `3` | Default character count when `lnk` generates a slug. You can override it per command or per tag later. See [Choosing readable random slugs](/blog/choosing-readable-random-slugs/) |
| Analytics provider | `disabled` | Stay disabled for phase 1. Refer to [Analytics](/docs/customize/analytics/) during customization |
| Cloudflare Access team domain | `vanityurls.cloudflareaccess.com` | The value for `CF_ACCESS_TEAM_DOMAIN`; find it in **Zero Trust** > **Settings** as the **Team domain** |
| Supported languages | `de,en,es,fr,it` | Comma-separated ISO language codes. English (`en`) is the main and fallback language when a localized page is unavailable. See [Languages](/docs/reference/i18n/) |
| Configure jurisdiction, privacy, terms, and security pages now? | `N` | Stay disabled for phase 1. Refer to [Jurisdiction](/docs/customize/jurisdiction/) during customization |
| Operator legal name | `Benoît H. Dicaire` | Simple operator name for phase 1. Refer to [Jurisdiction](/docs/customize/jurisdiction/) during customization |
| Operator domain for contact emails | `vanityurls.link` | Domain used for default contact addresses such as `abuse@vanityurls.link` and `security@vanityurls.link` |
| Trust & Safety contact | `abuse@vanityurls.link` | Email used for abuse and trust reports |
| Security contact | `security@vanityurls.link` | Email published for security reports and `security.txt` |
| Configure branding now? | `N` | Stay disabled for phase 1. Refer to [Brand](/docs/customize/brand/) during customization |

Some defaults are derived from your previous answers so the installer does not ask for the same idea twice. Setup also skips related questions when you disable a section, such as analytics or full legal pages.

### Install local helpers

```bash
npm run local-install
```

The installation script copies local tools to the expected path on your workstation. The `v8s` shell module lets you open a known short link directly from your terminal instead of switching to a browser first. The command line interface `lnk` lets you manage the content of `v8s-links.txt` and `v8s-schedules.json` without using a text editor. See [Local helper](/docs/command-line-interface/local-helper/) and [LNK](/docs/command-line-interface/lnk/) for more information.

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
git remote add origin git@github.com:your-github-account/v8s-link.git
git push -u origin main
```

or

```bash
git remote add origin https://github.com/your-github-account/v8s-link.git
git push -u origin main
```

### Connect the repository to Workers & Pages

In Cloudflare, open **Build** > **Compute** > **Workers & Pages** from the account main menu, then:

1. Create an application with the Worker name from `wrangler.toml`, such as `v8s-link`. The Cloudflare console does not rename Workers after creation, so see [Wrangler Without Shooting Yourself in the Foot](/blog/wrangler/#pick-one-name-and-reuse-it) for why this name should match your local directory and GitHub repository
2. Continue with GitHub
3. Select your redirector repository
4. Confirm Cloudflare is using the project name written by setup in `wrangler.toml`
5. Leave the **Build** and **Deploy** fields as-is so `wrangler.toml` remains authoritative
6. Deselect builds for non-production branches unless you want every branch to deploy

### Configure Access control

Protect `/_stats` and `/_tests` with Cloudflare Access before treating the instance as production. For phase 1, use one-time PIN with approved email addresses. You can switch to GitHub, Google, or another identity provider later.

Follow [Access control](/docs/customize/access-control/) to create the Zero Trust application, configure the policy, and copy the **Application Audience (AUD) Tag**.

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

If `custom/v8s-links.txt` does not exist, setup creates it from `defaults/v8s-links.txt`, then adapts the starter `home`, `status`, and `docs` links for your short domain and owner label.

| Slug | Long link |
| --- | --- |
| `home` | `https://<short-domain>` |
| `status` | `https://status.<short-domain>` |
| `docs` | `https://vanityURLs.link/en/docs/` |

Test at least one initial custom link, such as `https://<short-domain>/docs`, and confirm that it redirects to the long link shown in the table.

Then test `/_stats` and `/_tests` from a signed-out or private browser profile. You should see Cloudflare Access before the protected dashboard or test page.

{{% /steps %}}
