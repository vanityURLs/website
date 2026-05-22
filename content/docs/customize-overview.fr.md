---
aside: false
title: "Vue d'ensemble custom"
description: "Comment defaults, custom, les sorties generees, et les fichiers locaux s'assemblent avant de personnaliser une instance vanityURLs."
---

La personnalisation commence avec une regle simple : les fichiers source vivent dans `defaults/` et `custom/`, mais le Worker deploye lit les fichiers runtime generes dans `build/`.

Pensez a `defaults/` comme la base produit et a `custom/` comme la couche du proprietaire d'instance. Le build combine les deux dans les assets statiques et les JSON runtime deployes sur Cloudflare.

```text
defaults + custom -> build -> build/v8s.json, build/v8s-blocklist.json et build/v8s-site-config.json
```

## Fichiers source

`defaults/` inclut ces fichiers de type configuration :

```text
defaults/v8s-links.txt
defaults/v8s-schedules.json
defaults/v8s-policies.json
defaults/v8s-blocklist-categories.json
defaults/v8s-site-config.json
defaults/v8s-local-config.json
```

`custom/` peut remplacer, fusionner, ou superposer certains defaults avant le build :

| Fichier custom | Comportement de build |
|---|---|
| `custom/v8s-links.txt` | Remplace `defaults/v8s-links.txt` comme source des liens. |
| `custom/v8s-schedules.json` | Fusionne par-dessus `defaults/v8s-schedules.json`. |
| `custom/v8s-policies.json` | Remplace `defaults/v8s-policies.json` comme politique source. |
| `custom/v8s-site-config.json` | Fusionne les choix de site comme `i18n.supported_languages` et le branding. |
| `custom/public/` | Se superpose a `defaults/public/`. |

L'ancien nom source `v8s-blocklist.json` peut encore etre reconnu pour la compatibilite de migration, mais les nouvelles instances et la documentation devraient utiliser `v8s-policies.json`.

## Sorties runtime

Apres le build, le registre de redirection genere est :

```text
build/v8s.json
```

Il ne s'appelle pas `v8s-links.json`, et il n'est pas genere a la fois dans `defaults/` et `custom/`. Les fichiers de liens sont des entrees; `build/v8s.json` est la sortie runtime.

Le build ecrit aussi :

```text
build/v8s-blocklist.json
build/v8s-site-config.json
```

`build/v8s-blocklist.json` est l'artefact runtime consomme par le Worker. `build/v8s-site-config.json` garde la configuration de site utilisee au build, incluant les langues supportees et le branding.

La source de verite du Worker vit dans `scripts/workers/`. Pendant le build, vanityURLs la copie dans `src/` genere pour Wrangler et ajuste la liste des langues depuis `v8s-site-config.json`.

## Fichiers du poste de travail

`npm run local-install` peut installer les helpers locaux et configurer un chemin de registre local. Le registre runtime du depot est `build/v8s.json`; le cache du helper local est habituellement `~/.v8s.json`.

| Fichier | Role |
|---|---|
| `build/v8s.json` | Artefact de build deploye avec les assets Worker. |
| `~/.v8s.json` | Cache local optionnel utilise par le helper shell. |

Les changements locaux devraient etre faits dans `custom/`, puis `npm run check`, `npm run build`, ou `npm run local-publish` regenere et valide les fichiers runtime.

## Code de build

Le flux de build vit dans :

- [`scripts/build.mjs`](https://github.com/vanityURLs/vanityURLs/blob/main/scripts/build.mjs)
- [`scripts/build-redirect-targets.mjs`](https://github.com/vanityURLs/vanityURLs/blob/main/scripts/build-redirect-targets.mjs)

Utilisez les pages de personnalisation detaillees apres cette vue d'ensemble quand vous avez besoin des formats exacts, des exigences pour les pages de statut, des horaires, de la politique, ou du branding.
