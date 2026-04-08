---
title: "Pourquoi vanityURLs ? Le cas pour posséder vos liens courts"
date: 2025-01-20
author: "Benoît H. Dicaire"
description: "Les raccourcisseurs d'URL tiers laissent tomber leurs utilisateurs. Voici pourquoi posséder votre propre infrastructure de redirection est le bon choix."
tags: ["guide"]
featured: false
translationKey: "why-vanityurls"
---

Les raccourcisseurs d'URL ressemblent à un problème résolu. Choisissez un service gratuit, collez une longue URL, obtenez une courte. Simple. Pendant des années, des services comme bit.ly, goo.gl et TinyURL ont rendu cela trivial.

Puis bit.ly a réduit les comptes gratuits à 10 liens par mois. Google a tué goo.gl. Des millions de liens publiés — dans des livres, présentations, matériaux imprimés, signatures email — ont commencé à mourir.

Le problème n'est pas que ces services se sont dégradés. C'est qu'ils ont toujours été le mauvais choix architectural.

## Vous ne possédez pas vos liens

Quand vous raccourcissez une URL via un service tiers, vous ne créez pas un lien. Vous créez une **dépendance**. Le lien fonctionne tant que l'entreprise reste en activité, maintient votre niveau de service gratuit, et ne décomissionne pas votre format de lien.

Rien de tout cela n'est sous votre contrôle. Tout cela a échoué pour de vrais utilisateurs ces cinq dernières années.

## L'alternative est plus simple qu'il n'y paraît

vanityURLs adopte une approche différente : vos redirections vivent dans un fichier texte dans un dépôt Git. Cloudflare Pages traite le tableau de redirections. C'est tout. Pas de base de données. Pas de vendor lock-in. Pas de facture mensuelle.

## Les liens comme code offrent de vrais avantages

Une fois vos redirections dans Git, vous obtenez gratuitement tout ce que Git vous offre :

**Historique** — chaque changement est un commit. Vous savez qui a ajouté `/promo-ete`, quand, et pourquoi.

**Revue** — les équipes peuvent exiger des pull requests avant la mise en ligne des liens de campagne. Le CI valide que les destinations sont accessibles.

**Retour arrière** — un mauvais lien, c'est un `git revert` pour le corriger.

**Validation** — `lnk validate --live` vérifie chaque URL de destination avant que vous poussiez.

## La bonne question

La question n'est pas "pourquoi vanityURLs plutôt que bit.ly ?" La question est : voulez-vous que vos liens fonctionnent dans cinq ans ?

[Commencer →](/fr/docs/getting-started/)
