# vanityURLs — round 7: homepage i18n (data-driven features & steps)

Moves the hardcoded English feature tiles and how-it-works steps from `layouts/index.html` into per-language data files. Adds French translations. Also translates the hero badge and "View on GitHub" CTA.

## Answer to "does this pattern exist on other pages?"

**No.** `layouts/index.html` is the only page with hardcoded strings inside `range slice (dict ...)`. I scanned every layout in the project.

- `layouts/partials/footer.html` uses `range slice "col2" "col3" "col4"` — looks similar but isn't the same problem. It ranges over string keys and looks the actual content up from `.Site.Params.footer`, which is already defined per-language in `hugo.yaml` (separate `languages.en.params.footer` and `languages.fr.params.footer` blocks). No fix needed there.
- Nothing else has hardcoded English phrases in layouts.

## What changed

| File | Change |
|---|---|
| `data/home.en.yml` | **Expanded** — added `hero_badge`, `cta_view_github`, `features[]` (12 items), `steps[]` (4 items) |
| `data/home.fr.yml` | **Expanded** — French translations of everything in `home.en.yml` |
| `layouts/index.html` | Replaced two `range slice (dict ...)` blocks with `range $data.features` and `range $data.steps`. Hero badge and GitHub CTA now read from `$data.hero_badge` and `$data.cta_view_github`. Went from 176 → 129 lines. |

The SVG `icon` path strings are kept in the data file alongside each feature. They're not translated (SVG paths are language-neutral), but keeping them next to the title/desc means adding a new feature is a single-place edit rather than having to touch both the layout and the data.

## Applying

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o vanityurls-round7.zip
```

Or with the diff:

```bash
git apply vanityurls-round7.diff
```

## Validation

After deploy, load both language homepages and check:

- **`/en/`** — 12 feature tiles with English titles, 4 how-it-works steps with English titles
- **`/fr/`** — same grid/steps structure, French titles: `Liens en code`, `CLI d'abord`, `Historique Git`, `Livraison à l'edge`, `Domaines personnalisés`, `Déploiement automatique`, `Contrôle du dépôt`, `URLs structurées`, `Infrastructure en code`, `Zéro lock-in`, `Conception sécurisée`, `Coût minimal`
- Hero badge says `Open Source · MIT License` (EN) / `Open Source · Licence MIT` (FR)
- Second CTA button says `View on GitHub` (EN) / `Voir sur GitHub` (FR)

## French translations — notes

I took small liberties with the translations to make them read naturally rather than literally:

- `"Link as Code"` → `"Liens en code"` (matches the established pattern `hero_title2: "en code"`)
- `"CLI First"` → `"CLI d'abord"` — direct translation
- `"No Lock-In"` → `"Zéro lock-in"` — your existing copy keeps "lock-in" as the English loanword (see `features_subtitle` in the original `home.fr.yml`)
- Review them and change anything that doesn't match your voice. The YAML is the single source of truth — no template edits needed.
