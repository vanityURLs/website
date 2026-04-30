# vanityURLs — round 26: Canadian language codes

Switches the site's `languageCode` from `en-US` / `fr-FR` to `en-CA` / `fr-CA`, and updates the accessibility statements in both languages to match.

## Why

You're in Montreal, your audience is largely Canadian, and the previous codes were defaults rather than correct values. Quebec French in particular differs meaningfully from `fr-FR` — different vocabulary ("courriel" vs "email"), different conventions for date and number formatting. Browsers also pick up `lang` for spell-check dictionary selection (so `en-CA` triggers "colour" not "color"). Search engines use it as a regional targeting signal.

This is metadata-only. URL structure, content, layouts, i18n string lookup, and translations are all unaffected. The change shows up in:

- `<html lang="en-CA">` (was `lang="en-US"`)
- `<html lang="fr-CA">` (was `lang="fr-FR"`)
- RSS feed `<language>` element
- Sitemap hreflang attributes
- Some browser/screen reader behaviour around dictionaries and pronunciation

What it does NOT change:
- URLs (`/en/` and `/fr/` stay the same)
- Hugo's i18n string lookup (uses `Lang`, not `LanguageCode`)
- Translation file naming (`accessibility.en.md` / `.fr.md` still work)
- Any layout or content

## What changed

| File | Change |
|---|---|
| `hugo.yml` | `languageCode: en-US` → `languageCode: en-CA` |
| `hugo.yml` | `languageCode: fr-FR` → `languageCode: fr-CA` |
| `content/accessibility.en.md` | "`en-US` for English pages, `fr-FR` for French pages" → "`en-CA` for English pages, `fr-CA` for French pages" |
| `content/accessibility.fr.md` | Same fix in French phrasing |

The accessibility statements explicitly named the old codes as evidence of correct setup. Updating `hugo.yml` without updating the statements would have made round 25's accessibility statement immediately inaccurate.

I also verified there are no other hardcoded references to `en-US` or `fr-FR` anywhere in templates, content, or config — they were the only two places the strings appeared. The privacy pages (EN and FR) already use `fr-CA` as an example value, so this change actually brings the whole site into consistency.

## What I deliberately did NOT change

`_redirects` — your existing pattern of two lines per route (`/security` and `/security/`) is correct and necessary in your specific case.

The reason: Cloudflare Workers Static Assets has an `html_handling` setting that auto-canonicalizes trailing slashes — but only when the target asset exists. Your Hugo build only generates `/en/security/index.html` and `/fr/security/index.html`. There's no `/security/index.html` for Cloudflare to redirect TO, so its auto-canonicalization doesn't fire. Both `/security` and `/security/` fall through to `_redirects`, which matches literally. Both lines are needed.

If you ever want to handle paths under those routes (`/security/something` → `/en/security/something`), the cleanest single-line addition would be:

```
/security      /en/security/         301
/security/*    /en/security/:splat   301
```

Same line count, but the splat-with-`:splat` preserves any path suffix. For now, your current setup is fine — keep it.

## Apply

```bash
cd /Volumes/Tarmac/code/vanityURLs/website
unzip -o ~/Downloads/vanityurls-round26.zip
git add -A
git commit -m "feat(i18n): switch to Canadian language codes (en-CA, fr-CA)"
git push
```

## Quick verification post-deploy

1. Visit `https://vanityurls.link/en/` and view source — should show `<html lang="en-CA"`
2. Visit `https://vanityurls.link/fr/` and view source — should show `<html lang="fr-CA"`
3. Visit `https://vanityurls.link/en/feed.xml` (or wherever your RSS lives) — should show `<language>en-CA</language>` if you have RSS enabled
4. Visit `/accessibility/` and confirm it now references `en-CA` / `fr-CA` (matching reality)
5. Confirm /fr/accessibilite/ likewise

## Audit cycle (rounds 17-26)

- 17: Tag term pages
- 18: Showcase CSS scope, trust accuracy
- 19: UTM capture, Mermaid self-host, CSP tightening
- 20: Lighthouse Mobile Perf 67-90 → 91
- 21: Hotfix for round 20 mistakes
- 22: WCAG AA contrast (A11y → 100)
- 23: Umami diagnostic + bot-UA bypass
- 24: Diagnostic cleanup, secrets-location ops note
- 25: Accessibility statement audit + rewrite
- **26: Canadian language codes** ← this round
