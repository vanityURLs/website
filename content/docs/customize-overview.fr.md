---
title: "Vue d'ensemble custom"
description: "Comment defaults, les fichiers custom, et les sorties de build s'assemblent avant de personnaliser une instance vanityURLs."
---

La personnalisation commence avec une regle simple : les fichiers source vivent dans `defaults/` et `custom/`, mais le Worker lit les fichiers generes dans `build/`.

Pensez a `defaults/` comme la base produit et a `custom/` comme la couche propre a l'instance. Le build combine les deux dans les assets runtime deployes sur Cloudflare.

```text
defaults + custom -> build -> build/v8s.json et build/v8s-blocklist.json
```

## Fichiers source

`defaults/` inclut ces fichiers source de type configuration :

```text
defaults/v8s-links.txt
defaults/v8s-blocklist.json
defaults/v8s-blocklist-categories.json
defaults/v8s-schedules.json
```

`custom/` peut remplacer, fusionner, ou superposer certains defaults avant le build :

| Fichier custom | Comportement de build |
|---|---|
| `custom/v8s-links.txt` | Remplace `defaults/v8s-links.txt` comme source des liens. |
| `custom/v8s-blocklist.json` | Fusionne avec `defaults/v8s-blocklist.json`. |
| `custom/v8s-schedules.json` | Fusionne par-dessus `defaults/v8s-schedules.json`. |
| `custom/public/` | Se superpose a `defaults/public/`. |

Les defaults gardent une instance simple fonctionnelle. Les fichiers custom rendent l'instance deployee propre a votre domaine.

## Sorties runtime

Apres le build, le registre de redirection genere est :

```text
build/v8s.json
```

Il ne s'appelle pas `v8s-links.json`, et il n'est pas genere a la fois dans `defaults/` et `custom/`. Les fichiers de liens sont des entrees; `build/v8s.json` est la sortie runtime.

Le build ecrit aussi la blocklist runtime :

```text
build/v8s-blocklist.json
```

Cloudflare deploie la source Worker et les assets statiques generes depuis `build/`. Les changements locaux devraient etre faits dans `custom/`, puis `npm run check` ou `npm run build` regenere les fichiers runtime.

## Code de build

Le flux de build vit dans :

- [`scripts/build.mjs`](https://github.com/vanityURLs/vanityURLs/blob/main/scripts/build.mjs)
- [`scripts/build-redirect-targets.mjs`](https://github.com/vanityURLs/vanityURLs/blob/main/scripts/build-redirect-targets.mjs)

Utilisez les pages de personnalisation detaillees apres cette vue d'ensemble quand vous avez besoin des formats exacts, des exigences pour les pages de statut, des horaires, ou de la politique blocklist.
