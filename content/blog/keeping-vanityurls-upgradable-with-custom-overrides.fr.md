---
title: "Editez custom, laissez defaults ennuyeux"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs séparé les defaults produit des liens, de la marque, des politiques et des pages publiques propres à une instance."
tags: ["personnalisation", "mises-a-jour", "git"]
featured: false
---

La facon la plus rapide de ruiner un petit outil autohébergé est de modifier les fichiers upstream en place.

Cela fonctionne une fois. Puis la prochaine mise à jour pose une question ennuyeuse aux conséquences coûteuses : quels fichiers sont des defaults produit, quels fichiers sont des décisions locales, et quels fichiers sont une sortie générée?

vanityURLs évite cela avec trois couches :

| Couche                    | Proprietaire | Regle                      |
| ------------------------- | ------------ | -------------------------- |
| `defaults/` et `scripts/` | produit      | rafraichir depuis upstream |
| `custom/`                 | instance     | réviser et conserver       |
| `build/` et `src/` génère | build        | remplacer librement        |

Cette frontiere n'est pas de la bureaucratie. C'est ce qui empeche les mises à jour de devenir de l'archeologie.

## Defaults Est Le Baseline Produit

`defaults/` contient les fichiers livrés avec vanityURLs : pages publiques, pages d'état localisées, badges de redirection, liens exemples, politique par défaut, shell de tableau protégé, page de tests et configuration de site.

Ne les personnalisez pas.

Quand vanityURLs'améliore les pages par défaut, durcit la politique, corrige les assets ou change des hypotheses Worker, une instance devrait pouvoir accepter ces changements sans les trier parmi des edits de marque locaux.

## Custom Est La Couche Instance

`custom/` contient les décisions qui rendent l'instance à vous :

- inventaire de redirection
- comportement des liens planifiés
- politique locale allow/block
- configuration de site et langues supportées
- surcharges de pages publiques
- logos, icones, badges et fichiers de politique lisibles par machine
- configuration des helpers locaux

Quand ces choix vivent sous `custom/`, une mise à jour est une revue Git. Quand ils sont disperses dans les fichiers upstream, c'est un test de memoire.

## La Sortie Generee Est Jetable

`build/` et `src/` génère sont des sorties de déploiement.

Ils comptent au runtime. Ils restent le mauvais endroit pour des edits durables. Changez la couche source, puis reconstruisez. Le Worker, le registre runtime, la blocklist runtime et la configuration de site devraient être reproductibles depuis des fichiers revises.

## Le Compromis

La frontiere peut sembler tatillonne lorsqu'on veut changer une ligne.

Acceptez la friction. Forkez `scripts/workers/` seulement si vous comptez maintenir un fork du Worker. Editez `defaults/` seulement si vous changez le baseline produit. Mettez le comportement d'instance dans `custom/`.

Utilisez [Surcharges custom](/fr/docs/reference/custom-overrides/) pour les chemins exacts et [Mettre à jour une instance](/fr/docs/reference/upgrading/) pour le workflow de mise à jour.
