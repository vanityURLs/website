---
aside: false
title: "Releases"
description: "Comment les releases, changelogs, versions package et release-please du site fonctionnent ensemble."
weight: 50
---

Le dépôt website utilise [release-please](https://github.com/googleapis/release-please) avec [GitHub Actions](https://github.com/vanityURLs/website/actions). Les releases sont pilotées par l'historique de commits et les métadonnées release-please, pas par des changements manuels de version package.

{{< mermaid >}}
flowchart LR
  A[Conventional<br/>commits]
  B[GitHub<br/>Actions]
  C[release-please]
  D[PR de release]
  E[CHANGELOG.md]
  F[Versions<br/>package]
  G[Manifest<br/>release]
  H[Release<br/>GitHub]

  A --> B
  B --> C
  C --> D
  D --> E
  D --> F
  D --> G
  D --> H
{{< /mermaid >}}

Avant de merger un changement website orienté release :

1. Lancez `npm run build`.
2. Lancez `npm run lint` ou la vérification plus ciblée pertinente.
3. Confirmez que `.release-please-manifest.json` correspond toujours à la release actuelle prévue.
4. Évitez les modifications manuelles aux notes de release générées sauf si vous corrigez les métadonnées de release.

{{< callout type="note" title="Gestion du changelog" >}}
`CHANGELOG.md` reste à la racine du dépôt parce que release-please s'attend à le trouver là. Les docs publiques devraient expliquer le processus de release et pointer vers les releases GitHub au besoin; elles ne devraient pas dupliquer le corps du changelog généré.
{{< /callout >}}

## Ce que release-please possède

| Fichier | Propriété |
| ------- | --------- |
| `CHANGELOG.md` | Historique de release généré par release-please |
| `package.json` | Version package mise à jour par release-please |
| `package-lock.json` | Version package du lockfile mise à jour avec `package.json` |
| `.release-please-manifest.json` | Baseline de release actuelle lue par release-please |
| `release-please-config.json` | Type de release, sections de changelog et bump map |

{{< callout type="warning" title="Ne changez pas la version package du site à la main" >}}
Lorsque la version du site diverge de `.release-please-manifest.json`, release-please peut proposer la mauvaise prochaine version. Laissez release-please mettre à jour les versions package sauf si vous réparez délibérément les métadonnées de release.
{{< /callout >}}

## Messages de commit

Utilisez les conventional commits. Pour le flux contributeur autour des vérifications locales et des commits, consultez [Style des commits](/fr/docs/web-site/local-development/#style-des-commits).

```text
docs: update access-control setup flow
fix(layout): prevent docs callout overflow
style: normalize documentation spacing
ci: update release-please workflow
```

Le dépôt mappe les types non-feature courants comme `docs`, `style`, `refactor`, `test`, `build`, `ci` et `chore` vers des releases patch.

## Réparer la synchronisation des versions

Faites ceci seulement lorsque les métadonnées de release sont déjà incorrectes.

1. Identifiez le tag actif :

   ```bash
   git describe --tags --abbrev=0
   ```

2. Confirmez que `.release-please-manifest.json` correspond à la baseline actuelle :

   ```json
   {
     ".": "2.16.0"
   }
   ```

3. Gardez `package.json` et l'entrée package de haut niveau dans `package-lock.json` alignés sur la même version release du site.

4. Lancez `npm run build`.

5. Commitez la réparation avec un message clair comme :

   ```text
   chore: sync release metadata
   ```
