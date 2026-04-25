# vanityURLs — round 15 (hotfix): unbreak the build after round 13

## What broke

Cloudflare's build failed with:

```
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and
'/opt/buildhome/repo/package.json' contains "type": "module".
    at file:///opt/buildhome/repo/postcss.config.js
```

Round 13 added `"type": "module"` to `package.json` solely to silence a Node CLI warning when running `npm test`. That single line made Node treat **every** `.js` file in the project as an ES module — including `postcss.config.js` and `tailwind.config.js`, both of which are CommonJS (`module.exports = {...}`, `require()`).

The PostCSS config crash happened during Hugo's CSS build step, before the Worker deploy step ever ran. That's why the Cloudflare dashboard still showed the project as "static assets only" — the `wrangler.toml` change to add `main = 'src/worker.js'` was committed, but the build never reached the deploy phase, so it never took effect.

## The fix

Smaller blast radius than my first instinct (which would have been to rename two CJS configs to `.cjs`). Instead:

- **Drop `"type": "module"` from `package.json`** — back to the default, where `.js` files are CommonJS unless explicitly ESM.
- **Rename `src/worker.js` → `src/worker.mjs`** — `.mjs` is unambiguously ESM regardless of package config. Cloudflare Workers accept `.mjs` as the main entry point.
- **Rename `src/worker.test.js` → `src/worker.test.mjs`** — same reason. Update its `import` to point at `worker.mjs`.
- Update the `test` script and `wrangler.toml main =` accordingly.

This way:

- `postcss.config.js` and `tailwind.config.js` keep working as CJS.
- The Worker stays ESM (which it has to be — Cloudflare requires it).
- Tests still run via `node src/worker.test.mjs` with no warnings.

## Bonus: lint scripts caught up to round 8 renames

While I was in `package.json`, I noticed `lint:yaml` and `lint:spell` still referenced `*.yaml` patterns (round 8 renamed everything to `.yml`). Fixed those to match.

## Files in this patch

| File | Change |
|---|---|
| `package.json` | Removed `"type": "module"`. Updated `test` script to `worker.test.mjs`. Lint scripts updated to `.yml` patterns. |
| `src/worker.mjs` | **Renamed** from `src/worker.js`. Content unchanged. |
| `src/worker.test.mjs` | **Renamed** from `src/worker.test.js`. Updated import to `./worker.mjs`. |
| `wrangler.toml` | `main = 'src/worker.mjs'` |
| `README.md` | Project tree + Worker references updated to `.mjs` |

## Apply

Because this includes file renames, the zip alone won't tell git to delete the old paths. Use this:

```bash
cd /Volumes/Tarmac/code/vanityURLs/website

# 1. Remove the old .js worker files (round 13 added them; we're renaming)
git rm src/worker.js src/worker.test.js

# 2. Overlay the new files
unzip -o ~/Downloads/vanityurls-round15.zip

# 3. Commit
git add -A
git commit -m "fix(build): rename worker to .mjs to free postcss/tailwind from type:module"
git push
```

## After deploy

The build should now complete:

```
Total in 1262 ms
[ Hugo build succeeded ]
[ Pagefind index build succeeded ]
[ Worker uploaded ]
```

Then the Cloudflare dashboard's Settings page will show **Variables and Secrets** as available (no longer "Variables cannot be added to a Worker that only has static assets"). At that point you can finally set the secrets:

```bash
wrangler secret put UMAMI_WEBSITE_ID
wrangler secret put UMAMI_ENDPOINT
```

The Worker code already silently no-ops if the secrets aren't set, so there's no rush — pages will serve correctly with or without analytics.

## Validate after deploy

```bash
# Build succeeded
curl -sI https://vanityurls.link/en/ | head -1   # HTTP/2 200

# Worker is running (look for cf-ray header — present whether Worker runs or not, but
# you can confirm the Worker is in the request path by checking wrangler tail)
wrangler tail

# Then in another terminal:
curl https://vanityurls.link/en/docs/getting-started/

# wrangler tail should show a request log entry. If UMAMI_* secrets are set,
# you'll also see the analytics fetch in the log.
```

## What I should have done differently in round 13

Adding `"type": "module"` to silence a cosmetic Node warning was a bad tradeoff — silencing a warning at the cost of breaking the build pipeline's CJS configs. The lesson: when adding `type: module` to an established project, audit every `.js` file for module-style mismatches first. Or, more simply, never add it at all unless you're starting fresh — use `.mjs` for new ESM files instead.

This patch corrects that.
