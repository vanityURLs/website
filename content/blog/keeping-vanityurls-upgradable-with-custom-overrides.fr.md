---
title: "Editez custom, laissez defaults ennuyeux"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs separe les defaults produit des liens, de la marque, des politiques et des pages publiques propres a une instance."
tags: ["personnalisation", "mises-a-jour", "git"]
featured: false
---

La facon la plus rapide de ruiner un petit outil autoheberge est de modifier les fichiers upstream en place.

Cela fonctionne une fois. Puis la prochaine mise a jour pose une question ennuyeuse aux consequences couteuses : quels fichiers sont des defaults produit, quels fichiers sont des decisions locales, et quels fichiers sont une sortie generee?

vanityURLs evite cela avec trois couches :

| Couche | Proprietaire | Regle |
| --- | --- | --- |
| `defaults/` et `scripts/` | produit | rafraichir depuis upstream |
| `custom/` | instance | reviser et conserver |
| `build/` et `src/` genere | build | remplacer librement |

Cette frontiere n'est pas de la bureaucratie. C'est ce qui empeche les mises a jour de devenir de l'archeologie.

## Defaults Est Le Baseline Produit

`defaults/` contient les fichiers livres avec vanityURLs : pages publiques, pages d'etat localisees, badges de redirection, liens exemples, politique par defaut, shell de tableau protege, page de tests et configuration de site.

Ne les personnalisez pas.

Quand vanityURLs ameliore les pages par defaut, durcit la politique, corrige les assets ou change des hypotheses Worker, une instance devrait pouvoir accepter ces changements sans les trier parmi des edits de marque locaux.

## Custom Est La Couche Instance

`custom/` contient les decisions qui rendent l'instance a vous :

- inventaire de redirection
- comportement des liens planifies
- politique locale allow/block
- configuration de site et langues supportees
- surcharges de pages publiques
- logos, icones, badges et fichiers de politique lisibles par machine
- configuration des helpers locaux

Quand ces choix vivent sous `custom/`, une mise a jour est une revue Git. Quand ils sont disperses dans les fichiers upstream, c'est un test de memoire.

## La Sortie Generee Est Jetable

`build/` et `src/` genere sont des sorties de deploiement.

Ils comptent au runtime. Ils restent le mauvais endroit pour des edits durables. Changez la couche source, puis reconstruisez. Le Worker, le registre runtime, la blocklist runtime et la configuration de site devraient etre reproductibles depuis des fichiers revises.

## Le Compromis

La frontiere peut sembler tatillonne lorsqu'on veut changer une ligne.

Acceptez la friction. Forkez `scripts/workers/` seulement si vous comptez maintenir un fork du Worker. Editez `defaults/` seulement si vous changez le baseline produit. Mettez le comportement d'instance dans `custom/`.

Utilisez [Surcharges custom](/fr/docs/reference/custom-overrides/) pour les chemins exacts et [Mettre a jour une instance](/fr/docs/reference/upgrading/) pour le workflow de mise a jour.
