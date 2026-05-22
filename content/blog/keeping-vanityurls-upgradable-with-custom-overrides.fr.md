---
title: "Garder vanityURLs facile a mettre a jour avec custom"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs separe les defaults produit des liens, de la marque, des politiques et des pages publiques propres a une instance."
tags: ["personnalisation", "mises-a-jour", "git"]
featured: false
---

La facon la plus simple de rendre un petit outil auto-heberge penible est de tout modifier en place. Cela semble rapide le premier jour, puis chaque mise a jour devient une enquete : quels fichiers viennent d'upstream, quels fichiers appartiennent a l'instance, et quels fichiers generes peuvent etre remplaces sans danger?

vanityURLs evite cela avec une frontiere simple. Les fichiers produit vivent dans `defaults/` et `scripts/`. Les fichiers propres a l'instance vivent dans `custom/`. La sortie generee vit dans `build/` et `src/`.

Cette frontiere n'est pas de la bureaucratie. C'est ce qui garde un redirecteur auto-heberge calme apres le premier deploiement.

## Defaults est la base produit

`defaults/` contient les fichiers livres avec vanityURLs : pages publiques, pages d'etat localisees, badges de redirection, liens exemples, politique par defaut, shell de tableau protege, page de tests et configuration de site.

Ces fichiers devraient etre faciles a rafraichir depuis upstream. Quand vanityURLs ameliore les pages par defaut, durcit la politique, corrige les assets generes ou change des hypotheses Worker, le proprietaire de l'instance devrait pouvoir recevoir ces changements sans chercher dans ses edits de marque locaux.

## Custom est la couche de l'instance

`custom/` contient les choix qui rendent l'instance a vous :

- inventaire de redirection
- comportement des liens planifies
- politique locale allow/block
- configuration de site et langues supportees
- surcharges de pages publiques
- logos, icones, badges et fichiers de politique lisibles par machine
- configuration des helpers locaux

Quand ces choix vivent sous `custom/`, les mises a jour deviennent une revue Git normale plutot qu'une fouille archeologique.

## La sortie generee est jetable

`build/` et le `src/` genere sont des sorties de deploiement. Ils sont importants au runtime, mais ce n'est pas la ou un operateur devrait faire des changements durables.

Modifiez la couche source, puis reconstruisez. Le Worker deploye, le registre runtime, la blocklist runtime et la configuration de site restent ainsi reproductibles depuis des fichiers revises.

## L'histoire de mise a jour

Le but de `custom/` est de rendre les mises a jour predecibles. Upstream peut rafraichir `defaults/`, `scripts/`, la logique de validation, les dependances et le comportement runtime genere pendant que l'instance garde ses liens, horaires, politiques, marque, pages publiques, reglages locaux et configuration de site.

Cela veut dire que la plupart des personnalisations devraient eviter les edits directs dans :

- `defaults/`, parce qu'upstream possede la base
- `scripts/workers/`, sauf si vous maintenez un fork du Worker
- `src/`, parce qu'il est genere pour Wrangler
- `build/`, parce que c'est une sortie de deploiement generee

Utilisez [Surcharges custom](/fr/docs/custom-overrides/) pour les chemins exacts et [Mettre a jour une instance](/fr/docs/upgrading/) pour le workflow de mise a jour.
