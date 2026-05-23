---
title: "Vous n'avez pas besoin de repartir de zéro"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Comment npm run upgrade et npm run setup permettent de mettre a jour une instance vanityURLs existante sans la reconstruire depuis zero."
tags: ["mises-a-jour", "operations", "git"]
featured: false
---

Quand un outil evolue rapidement, le reflexe tentant mais epuisant est de repartir de zero chaque fois que l'installateur s'ameliore. Supprimer l'instance, cloner de nouveau, repondre aux questions, recopier les fichiers custom, puis esperer que rien de subtil n'a ete perdu.

Ce n'est pas le workflow attendu avec vanityURLs.

Une instance est concue pour garder son identite locale pendant que la couche produit s'ameliore autour d'elle. Vos liens, horaires, politiques, marque, pages publiques, reglages Cloudflare et configuration des helpers vivent dans la couche de l'instance. Les fichiers produit upstream vivent dans `defaults/` et `scripts/`. La sortie generee peut etre reconstruite.

## Les deux commandes importantes

`npm run upgrade` rafraichit les fichiers appartenant au produit depuis upstream. C'est la commande qui apporte les nouveaux defaults, scripts, validations, comportements de pages generees et durcissements runtime.

`npm run setup` reapplique la configuration de l'instance avec le comportement actuel de l'installateur. L'installateur est idempotent : il lit les valeurs existantes, les propose comme valeurs par defaut et met a jour la configuration generee au lieu d'exiger un nouveau clone.

Cela veut dire qu'une instance existante peut adopter un meilleur installateur sans perdre ses choix locaux.

## Une sequence de mise a jour pratique

Pour l'instance `v8s.link`, le chemin de mise a jour est :

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

La meme sequence fonctionne pour une autre instance avec son propre nom de depot, nom de Worker, domaine court et fichiers custom.

## Quoi reviser avant de pousser

Traitez le resultat comme tout autre changement operationnel. Revisez le diff Git, surtout les changements sous `custom/`, `wrangler.toml` et les pages publiques generees.

Si le diff reflete seulement le nouveau comportement produit et les reponses attendues pour votre instance, commitez et poussez. Cloudflare reconstruira depuis GitHub et votre instance continuera d'avancer sans rituel de reconstruction depuis zero.

Utilisez [Mettre a jour une instance](/fr/docs/reference/upgrading/) pour la reference des commandes et [Surcharges custom](/fr/docs/customize/custom-overrides/) pour la frontiere entre defaults produit et changements propres a l'instance.
