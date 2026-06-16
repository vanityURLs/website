---
aside: false
title: "v8s-fix"
description: "Repair safe custom/public maintenance drift reported by npm run doctor."
weight: 30
---

`v8s-fix` is the repository maintenance command for `custom/public/`. It repairs fixable drift reported by `npm run doctor`, especially copied product pages or shared `v8s-*` assets that should now come from `defaults/public/`.

Use it after an upgrade when doctor recommends a fix group. It is not a replacement for reviewing custom pages, and it should not be used to overwrite intentional instance-owned design work.

## Before running it

Run doctor first:

```bash
npm run doctor
```

Then run the narrow fix group that doctor recommends. Prefer `--dry-run` before applying a change:

```bash
./scripts/v8s-fix --assets --dry-run
./scripts/v8s-fix --assets
```

Afterward, review the diff:

```bash
git status --short
git diff
```

## Fix groups

| Command                             | Use it when                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `./scripts/v8s-fix --assets`        | Remove stale `custom/public/v8s-*` shadows so defaults supply runtime CSS and JavaScript |
| `./scripts/v8s-fix --head-assets`   | Refresh shared favicon, app icon, and theme head references in custom HTML               |
| `./scripts/v8s-fix --product-pages` | Sync product-owned dashboard or QA pages that should stay vanilla                        |
| `./scripts/v8s-fix --languages`     | Remove unsupported copied language directories from `custom/public/`                     |
| `./scripts/v8s-fix --branding`      | Reapply configured branding to copied custom public HTML                                 |
| `./scripts/v8s-fix --all`           | Apply all non-destructive maintenance fix groups                                         |
| `./scripts/v8s-fix --public`        | Recreate `custom/public/` from defaults, then apply branding and language pruning        |

`--public` is intentionally broad. Use it only when you want to rebuild copied public pages from the current product defaults. It can replace local edits under `custom/public/`.

## Intentional overrides

If doctor reports a file that is intentionally different, document that decision in `custom/v8s-custom-overrides.json` instead of running a fix that would erase the custom work.

For example:

```json
{
  "schema_version": "1.0",
  "doctor": {
    "ignore": [
      {
        "path": "custom/public/404.html",
        "codes": ["html-head-assets-stale"],
        "reason": "The instance intentionally uses a custom home-style 404 page."
      }
    ]
  }
}
```

Keep ignore rules narrow. Use exact paths for single files, `custom/public/fr/**` for a directory, and `codes` or `fixes` so doctor still reports unrelated drift.

## How it fits with upgrades

`npm run update` or `npm run upgrade` refreshes product-owned files such as `defaults/`, `scripts/`, and package manifests. It does not blindly rewrite `custom/public/`, because those files may contain intentional branding or custom HTML.

`npm run doctor` identifies maintenance drift after the update. `v8s-fix` applies only the maintenance group you select, leaving the final review to Git.
