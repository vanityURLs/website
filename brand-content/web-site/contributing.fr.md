---
aside: false
type: brand
title: "Contribution a la documentation"
description: "Comment contribuer a la documentation du site de marque, aux traductions et aux guides du site web."
weight: 25
aliases:
  - /docs/web-site/contributing/
---

Le site principal a un court [guide de contribution](https://vanityurls.link/fr/contributing/) pour le code, la documentation, les rapports de bogues et l'aide communautaire. Cette page ajoute les attentes propres au site de marque.

## Ou contribuer

| Travail                         | Depot                                                  |
| ------------------------------- | ------------------------------------------------------ |
| Code du redirecteur             | `github.com/vanityURLs/vanityURLs`                     |
| Documentation du site principal | `github.com/vanityURLs/website`, dans `content/`       |
| Standards de marque             | `github.com/vanityURLs/website`, dans `brand-content/` |
| Templates du site               | `github.com/vanityURLs/website`, dans `layouts/`       |
| CSS et JavaScript               | `github.com/vanityURLs/website`, dans `assets/`        |
| Telechargements publics stables | `github.com/vanityURLs/website`, dans `static/`        |

## Regles de documentation de marque

- Gardez les pages pratiques et proches de la source de verite.
- Basez les standards sur l'implementation existante avant d'inventer une nouvelle regle.
- Ajoutez les pages anglaises et francaises ensemble quand la section est bilingue.
- Utilisez `brand-content/` pour les standards de marque et `content/` pour le site produit principal.
- Liez vers le site principal quand un visiteur a besoin de documentation produit, pages legales, pages de confiance ou points d'entree communautaires.
- Utilisez des commits conventionnels pour que release-please classe les changements.

## Avant d'ouvrir une pull request

Executez :

```bash
npm run build
npm test
npm run lint:md
npm run lint:spell
npm run lint:yaml
```

Pour les deplacements de documentation plus grands, verifiez aussi les redirections, les selecteurs de langue et l'index de recherche.

## Attentes pour les pull requests

- Gardez chaque PR centree sur un changement de contenu ou de systeme de design.
- Mettez a jour les captures ou inventaires d'actifs quand les actifs visuels changent.
- Expliquez pourquoi le changement est necessaire et quelles pages doivent etre relues.
- Evitez de copier le texte de systemes de marque externes. Utilisez-les comme references, puis redigez une guidance propre a vanityURLs.

## Questions et grands changements

Commencez dans [GitHub Discussions](https://github.com/orgs/vanityURLs/discussions) avant d'ouvrir une PR de restructuration importante. Utilisez les issues pour les defauts precis, liens brises, motifs inaccessibles, traductions manquantes ou standards incorrects.
