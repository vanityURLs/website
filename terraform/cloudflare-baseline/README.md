# vanityURLs Cloudflare baseline

This Terraform starter captures the Cloudflare controls that the customize docs
ask operators to configure for a vanityURLs short-link zone.

It is intentionally small:

- Cloudflare Access protects private operational paths.
- A redirect rule sends `www` traffic to the apex hostname.
- WAF custom rules block scanner probes, unexpected methods, and selected
  crawler traffic before requests reach the Worker.
- A rate limiting rule protects likely short-link candidates.

Use this directory as the long-term automation path. The dashboard instructions
in the documentation remain useful for review, migration, and troubleshooting,
but Terraform should own repeatable setup.

## Usage

Copy `terraform.tfvars.example` to `terraform.tfvars`, replace the placeholders,
then run:

```bash
terraform init
terraform plan
terraform apply
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
