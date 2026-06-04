---
title: "Espace blanc et flux du texte"
description: "Comment vanityURLs utilise l'espacement, la longueur de ligne et le rythme de lecture."
type: brand
weight: 45
---

L'espace blanc fait partie de l'interface. Il aide a comprendre ce qui va ensemble, ou commence une section et quelle action compte le plus.

## Flux de lecture

La documentation utilise les motifs `content-flow` et `docs-flow` pour creer un espacement regulier entre paragraphes, titres, listes, blocs de code, tableaux et encadres.

Utilisez ce rythme pour les pages longues. Evitez d'empiler des marges manuelles sauf si un composant reutilisable a besoin d'une nouvelle regle d'espacement.

## Regles des motifs de flux

Utilisez `content-flow` sur les conteneurs de contenu de style Markdown qui ont besoin d'un espacement de prose lisible. Il definit la taille de corps partagee, la hauteur de ligne, l'espacement des enfants, le rythme des titres et le rythme des elements de liste pour les paragraphes, listes, citations, tableaux, blocs de code, code avec coloration et inserts hors prose.

Utilisez `docs-flow` avec `content-flow` sur les pages de documentation et de reference de marque. Il garde les pages docs alignees sur le meme rythme tout en laissant de la place pour des comportements propres aux docs plus tard.

- Laissez les enfants directs creer le rythme vertical; evitez les marges ponctuelles en haut et en bas sur chaque element imbrique.
- Commencez le premier enfant visible au ras du conteneur avec la remise a zero du premier enfant.
- Utilisez des espaces plus grands avant les titres `h2`, des espaces moyens avant les titres `h3` et des espaces plus petits entre un titre et son texte d'appui.
- Gardez les paragraphes, listes non ordonnees et listes ordonnees sur la hauteur de ligne de corps partagee.
- Gardez les elements de liste assez proches pour etre lus comme une seule liste, mais assez separes pour que les elements sur plusieurs lignes restent lisibles.
- Ajoutez une regle de composant reutilisable quand un nouveau motif a besoin d'un espacement different; ne le resolvez pas avec des marges locales a une page.

## Longueur de ligne

Gardez le contenu explicatif dans une colonne de lecture confortable. Les panneaux operationnels peuvent etre plus larges lorsqu'il faut comparer des valeurs, mais la prose ne doit pas couvrir toute la largeur de l'ecran.

## Rythme des sections

- Gardez les titres, descriptions, exemples et tableaux lies proches les uns des autres.
- Utilisez des espaces plus grands pour marquer un changement de sujet.
- Utilisez les listes pour les regles a parcourir, pas pour chaque phrase.
- Gardez les cartes compactes; chaque paragraphe n'a pas besoin d'un panneau.

## Flux dans les surfaces generees

Les pages de redirection, badges et ecrans de repli doivent accepter les textes traduits, alias longs et URLs completes. Utilisez le retour a la ligne, la troncature avec libelle accessible ou des mises en page empilees avant de laisser le texte se chevaucher.
