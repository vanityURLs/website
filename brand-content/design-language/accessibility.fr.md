---
title: "Accessibilite"
description: "Expression de marque accessible pour les couleurs, textes, mises en page, actifs, pages generees et documentation."
type: brand
weight: 50
---

L'accessibilite fait partie du systeme de marque; ce n'est pas une verification de derniere minute.

Le site principal publie une [declaration d'accessibilite](https://vanityurls.link/fr/accessibility/) et un [centre de confiance](https://vanityurls.link/fr/trust/) avec la cible de conformite, les limites connues et les canaux de signalement. Le travail de marque doit conserver ces engagements.

## Exigences

- Preservez les etats de focus visibles.
- Utilisez des textes de liens explicites.
- Gardez le contraste lisible.
- Fournissez des textes alternatifs localises pour les badges et images.
- Evitez les mises en page ou le texte se superpose, se coupe ou devient trop petit pour etre lu.

## Standards du site

Le site actuel vise WCAG 2.1 niveau AA et documente publiquement une conformite partielle. Ce standard s'applique aux pages de marque, a la documentation, aux pages de redirection generees, aux badges et aux surfaces operateur.

Quand vous ajoutez un motif visuel, verifiez :

- L'acces clavier pour chaque element interactif.
- Les etats `:focus-visible` avec un anneau de focus aux couleurs de marque.
- Les titres et landmarks semantiques.
- La langue de page correcte et les alternatives localisees.
- Des textes de liens et de boutons descriptifs.
- Le contraste du texte, des icones, bordures, focus, badges et diagrammes dans les themes clair et sombre.

## Limites connues a garder visibles

Le site principal suit deja des limites comme le support de `prefers-reduced-motion`, l'annonce des resultats de recherche, les captions de tableaux et la navigation mobile dependante de JavaScript. Ne cachez pas ces limites dans le contenu de marque. Quand un motif touche une de ces zones, ameliorez l'implementation ou documentez la limite.

## Chemin de signalement

Utilisez les issues GitHub publiques pour les barrieres d'accessibilite quand c'est possible. Ajoutez l'URL, la technologie d'assistance, le navigateur, le systeme d'exploitation et les etapes de reproduction.

Les rapports sensibles a la securite doivent utiliser le canal de securite plutot qu'une issue publique.
