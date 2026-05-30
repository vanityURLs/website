---
title: "Vous n'avez pas besoin de repartir de zéro"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Comment npm run upgrade et npm run setup permettent de mettre à jour une instance vanityURLs existante sans la reconstruire depuis zero."
tags: ["mises-a-jour", "opérations", "git"]
featured: false
---

Quand un outil évolue rapidement, le reflexe tentant mais epuisant est de repartir de zero chaque fois que l'installateur s'améliore. Supprimer l'instance, cloner de nouveau, répondre aux questions, recopier les fichiers custom, puis esperer que rien de subtil n'a été perdu.

Ce n'est pas le workflow attendu avec vanityURLs.

Une instance est conçue pour garder son identité locale pendant que la couche produit s'améliore autour d'elle. Vos liens, horaires, politiques, marque, pages publiques, réglages Cloudflare et configuration des helpers vivent dans la couche de l'instance. Les fichiers produit upstream vivent dans `defaults/` et `scripts/`. La sortie générée peut être reconstruite.

## Les deux commandes importantes

`npm run upgrade` rafraîchit les fichiers appartenant au produit depuis upstream. C'est la commande qui apporte les nouveaux defaults, scripts, validations, comportements de pages générées et durcissements runtime.

`npm run setup` réapplique la configuration de l'instance avec le comportement actuel de l'installateur. L'installateur est idempotent : il lit les valeurs existantes, les propose comme valeurs par défaut et met à jour la configuration générée au lieu d'exiger un nouveau clone.

Cela veut dire qu'une instance existante peut adopter un meilleur installateur sans perdre ses choix locaux.

## Une sequence de mise à jour pratique

Pour l'instance `v8s.link`, le chemin de mise à jour est :

```bash
git pull
npm run upgrade
npm run setup
npm run check
git status
git add .
git commit -m "chore: update v8s.link instance"
git push
```

La même sequence fonctionne pour une autre instance avec son propre nom de dépôt, nom de Worker, domaine court et fichiers custom.

## Quoi réviser avant de pousser

Traitez le résultat comme tout autre changement opérationnel. Révisez le diff Git, surtout les changements sous `custom/`, `wrangler.toml` et les pages publiques générées.

Si le diff reflété seulement le nouveau comportement produit et les réponses attendues pour votre instance, commitez et poussez. Cloudflare reconstruira depuis GitHub et votre instance continuera d'avancer sans rituel de reconstruction depuis zero.

Utilisez [Mettre à jour une instance](/fr/docs/reference/upgrading/) pour la référence des commandes et [Surcharges custom](/fr/docs/reference/custom-overrides/) pour la frontiere entre defaults produit et changements propres à l'instance.
