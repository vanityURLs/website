---
aside: false
title: "Surcharges custom"
description: "Transformer une instance vanityURLs simple en instance marquee en ajoutant des fichiers dans custom/ tout en gardant les defaults faciles a mettre a jour."
---

Utilisez `custom/` pour les fichiers propres a l'instance. Cela garde les deploiements faciles a mettre a jour pendant que les pages par defaut, la logique Worker, la politique source et les reglages locaux evoluent.

## Defaults versus custom

`defaults/` est la base produit. Il contient les pages publiques, pages d'etat localisees, badges localises, logos, shell stats protege, page de tests, politiques, liens exemples, configuration de site et assets runtime.

`custom/` est la couche de l'instance. Les fichiers dans `custom/` remplacent ou completent certains defaults avant le build.

Le build :

1. copie `defaults/public/` dans `build/`;
2. copie les defaults anglais a la racine publique;
3. applique `custom/public/` lorsqu'il existe;
4. retire les repertoires de langues non supportees selon `v8s-site-config.json`;
5. construit `v8s.json` depuis `custom/v8s-links.txt` ou `defaults/v8s-links.txt`;
6. construit `v8s-blocklist.json` depuis `custom/v8s-policies.json` ou `defaults/v8s-policies.json`;
7. ecrit `v8s-site-config.json` et genere `src/` depuis `scripts/workers/`

## Fichiers custom courants

```text
custom/v8s-links.txt
custom/v8s-schedules.json
custom/v8s-policies.json
custom/v8s-site-config.json
custom/v8s-local-config.json
custom/public/v8s-logo.svg
custom/public/favicon.svg
custom/public/site.webmanifest
custom/public/robots.txt
custom/public/security.txt
custom/public/llms.txt
custom/public/llms-full.txt
```

Utilisez `custom/v8s-links.txt` pour l'inventaire de redirection, `custom/v8s-schedules.json` pour les horaires, et `custom/v8s-policies.json` pour les regles allow/block propres a l'instance.

Utilisez `custom/v8s-site-config.json` pour les choix de site, incluant les langues supportees et le wordmark en deux couleurs :

```json
{
  "i18n": {
    "default_language": "en",
    "supported_languages": ["en", "fr"]
  },
  "branding": {
    "domain": "example.link",
    "custom_public": true,
    "wordmark": {
      "black": "example.",
      "green": "link"
    }
  }
}
```

## Pages gerees par l'installateur

`npm run setup` peut copier `defaults/public/` vers `custom/public/`, remplacer le wordmark `Vanity` + `URLs` par les portions noire et verte configurees, mettre a jour les libelles et liens de marque, puis retirer les langues non supportees.

L'installateur enregistre ces choix dans `custom/v8s-site-config.json`. Si `custom/public/` contient deja des fichiers et n'est pas marque comme gere par l'installateur, setup refuse de le remplacer sauf avec `--force`.

Lorsque vous utilisez `custom/public/`, definissez `i18n.supported_languages` dans `custom/v8s-site-config.json`.

## Pages et assets personnalisables

Personnalisez les assets de marque sous `custom/public/`, comme `v8s-logo.svg`, `favicon.svg`, les PNG et `site.webmanifest`.

Personnalisez les pages de politique sous `custom/public/`, comme `privacy.html`, `terms.html`, `abuse.html` et `security.html`. Les pages anglaises ont des alias sans extension comme `/privacy`; les pages francaises sont servies sous `/fr/privacy.html`, `/fr/terms.html`, `/fr/abuse.html`, et `/fr/security.html`.

Les pages publiques anglaises et francaises par defaut incluent des liens de pied de page vers ces politiques. Les pages espagnoles, italiennes et allemandes sont localisees pour les pages principales et d'etat, mais n'incluent pas encore de pages de politique equivalentes.

Remplacez la page expand avec `custom/public/expand/index.html`. Les variantes localisees utilisent des repertoires de langue, par exemple `custom/public/fr/expand/index.html`.

Remplacez le shell stats avec `custom/public/_stats/index.html` seulement si vous avez besoin d'une page statique differente. Gardez `/_stats` et `/_tests` proteges par Cloudflare Access.

Si vous surchargez `_headers`, gardez les regles de securite et de cache compatibles. Les headers par defaut incluent `X-Generated-By: vanityURLs.link` et bloquent `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json`.

## Pages de statut custom

Placez les pages a ces chemins exacts :

```text
custom/public/404.html
custom/public/disabled.html
custom/public/expired.html
custom/public/maintenance.html
```

Les versions localisees utilisent le code langue :

```text
custom/public/fr/404.html
custom/public/fr/disabled.html
custom/public/fr/expired.html
custom/public/fr/maintenance.html
```

Le code HTTP vient du Worker, pas du fichier HTML. `404.html` peut inclure `{{SLUG_MESSAGE}}` et `{{REFERENCE_LINE}}` pour afficher le slug demande et une reference de correlation.

## Badges rediriges

Les badges localises vivent sous `defaults/public/{en,fr,es,it,de}/` avec `v8s-redirected.svg` et `v8s-redirected-dark.svg`. Les badges anglais sont aussi copies a la racine du build.

Apres une modification des SVG de badge par defaut, lancez :

```bash
npm run optimize:badges
```

## Workflow de mise a jour

```bash
git pull upstream main
npm run generate:blocklist
npm run check
```

Gardez les changements runtime hors de `scripts/workers/` et du `src/` genere sauf si vous maintenez un fork. Preferez les surcharges de configuration, politique et assets.
