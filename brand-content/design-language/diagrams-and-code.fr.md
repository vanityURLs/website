---
title: "Diagrammes et code"
description: "Standards pour les diagrammes Mermaid, la coloration syntaxique, les exemples et les explications techniques."
type: brand
weight: 60
---

vanityURLs est un produit technique; les diagrammes et exemples de code font donc partie du langage de marque. Ils doivent clarifier le comportement, pas decorer la page.

## Diagrammes Mermaid

Utilisez Mermaid pour les flux de redirection, chemins de deploiement, decisions de routage et cycles de vie.

- Gardez les diagrammes assez courts pour etre compris sans zoomer.
- Libellez les transitions avec de vraies conditions comme `alias found`, `blocked`, `expired` ou `fallback`.
- Preferez un flux de gauche a droite pour les pipelines de requete.
- Utilisez un diagramme quand le comportement serait plus difficile a comprendre en prose.

## Blocs de code

Les blocs de code utilisent Chroma avec des classes CSS et des boutons de copie. Les exemples doivent etre assez complets pour etre executes ou reconnus.

- Utilisez des blocs fences avec identifiant de langage.
- Utilisez JetBrains Mono pour commandes, chemins, variables d'environnement et configuration.
- Evitez les styles inline dans les exemples, car le site vise une politique de securite de contenu plus stricte.
- N'incluez pas de secrets, jetons ou identifiants prives dans les exemples.

## Arborescences

Utilisez le motif d'arborescence pour la structure du depot, les sorties de build et les inventaires d'actifs. Il est preferable a un simple bloc de code quand le lecteur doit comprendre la hierarchie.

## Diagrammes techniques et texte

Accompagnez chaque diagramme d'une courte explication. Le diagramme doit reduire la charge cognitive; le texte doit expliquer les decisions importantes.
