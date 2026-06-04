---
title: "Mode sombre et themes"
description: "Comment les themes clair et sombre preservent l'identite, la lisibilite et la coherence d'implementation."
type: brand
weight: 80
---

Le site utilise le mode sombre par classe de Tailwind. Le changement de theme doit ressembler au meme systeme sous une autre lumiere, pas a une marque separee.

## Comportement du theme

- Initialisez le theme choisi avant l'affichage quand c'est possible.
- Conservez les etats actifs, focus, hover et selectionnes dans les deux themes.
- Gardez la coloration du code lisible sur fonds clairs et sombres.
- Evitez le contenu propre a un theme sauf si l'actif exige une version claire ou sombre.

## Couleur en mode sombre

Utilisez les accents teal avec retenue sur les surfaces sombres. Le teal de marque doit identifier les liens, etats selectionnes et accents importants; il ne doit pas devenir le fond de chaque panneau.

## Variantes d'actifs

Fournissez des variantes claires et sombres des logos ou badges lorsqu'un seul actif ne peut pas conserver le contraste. Documentez l'arriere-plan prevu pour chaque fichier dans l'inventaire.

## Verifications d'accessibilite

Testez le contraste dans les deux themes. Un composant qui reussit en mode clair mais echoue en mode sombre n'est pas termine.
