# vanityURLs Cloudflare baseline

This Terraform starter captures the Cloudflare controls that the customize docs
ask operators to configure for a vanityURLs short-link zone.

It is intentionally small:

- Cloudflare Access protects private operational paths.
- A redirect rule sends `www` traffic to the apex hostname.
- WAF custom rules block scanner probes, unexpected methods, and suspicious
  script clients before requests reach the Worker.
- A rate limiting rule protects likely short-link candidates.

The baseline uses `block`, not `managed_challenge`, for script-client rules.
Managed challenges can inject Cloudflare JavaScript into matching HTML responses,
which conflicts with repository-owned CSP and deterministic public pages.

Use Cloudflare AI Crawl Control for AI crawler blocking. The optional static
user-agent rule is disabled by default because it can drift from Cloudflare's
managed crawler inventory and can cause the AI Crawl Control dashboard to report
that the underlying WAF rule was modified outside AI Crawl Control.

Use this directory as the long-term automation path. The dashboard instructions
in the documentation remain useful for review, migration, and troubleshooting,
but Terraform should own repeatable setup.

## Install tools on macOS

Use Homebrew for local operator workstations. Choose one CLI: Terraform or
OpenTofu. You do not need both.

Install HashiCorp Terraform for the default path:

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform version
```

Or install OpenTofu as the open-source Terraform-compatible alternative:

```bash
brew install opentofu
tofu version
```

Both CLIs download the Cloudflare provider during
`terraform init` or `tofu init`. The website repo does not install these
binaries through `package.json`; npm scripts only provide consistent command
names after the binary is available.

## Usage

Copy `terraform.tfvars.example` to `terraform.tfvars`, replace the placeholders,
then run:

```bash
terraform init
terraform plan
terraform apply
```

Equivalent npm aliases are available from the website repo root:

```bash
npm run terraform:fmt:check
npm run terraform:validate
npm run tofu:fmt:check
npm run tofu:validate
```

The Cloudflare provider expects an API token with the least permissions needed
for the resources you enable. For the baseline, start with zone rules, zone
settings, and Zero Trust Access application/policy permissions for the target
account and zone.

After `terraform apply`, store the Access audience as a Worker secret in the
redirector repo:

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

## Maintenance

When the Cloudflare customize docs change, update this Terraform starter in the
same pull request. The website repo has `npm run docs:check` to catch obvious
drift between the docs and this starter.
