---
title: "La suite pour v8s.link"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "Roadmap pour rendre v8s plus facile à installer, mettre à jour et opérer sans alourdir le runtime."
tags: ["roadmap", "opérations"]
---

Le prochain defi n'est pas la première installation. Une nouvelle instance v8s peut déjà être creee rapidement.

Le probleme plus difficile est la possession a long terme : comment une instance recoit-elle les ameliorations upstream de `defaults/` et `scripts/` tout en preservant tout ce qui vit dans `custom/`?

## Le principe de mise à jour

Le projet devrait garder un contrat simple :

- les fichiers du produit vivent dans `defaults/` et `scripts/`
- les fichiers propres à l'instance vivent dans `custom/`
- la sortie générée peut être reconstruite
- les secrets restent dans Cloudflare ou dans le stockage secret local
- la documentation vit sur le site web, pas dupliquee dans chaque dépôt d'instance

Ce contrat rend possible un futur outil de mise à jour sans imposer un gestionnaire de paquets des le premier jour.

## Outillage court terme

La direction actuelle est un workflow de mise à jour scripté :

1. lancer `npm run clean`
2. recuperer la release upstream
3. previsualiser les changements de `defaults/` et `scripts/`
4. garder `custom/`, `wrangler.toml`, et les secrets intacts
5. lancer `npm run check`
6. montrer au propriétaire exactement ce qui a changé avant le déploiement

C'est plus important qu'une formule Homebrew maintenant. Un gestionnaire de paquets peut installer un outil, mais il ne remplace pas une politique de merge prudente.

## CLI et terminal

Le helper `v8s.zsh` devrait rester concentre : inspecter le registre génère, ouvrir ou copier des redirections connues, et refuser les cibles terminal arbitraires. C'est une couche pratique au-dessus du registre valide, pas une deuxieme source de vérité.

Cela donne aux utilisateurs avances un workflow terminal rapide sans affaiblir le modèle runtime.

## Instance publique plus tard

L'instance publique `v8s.link` devrait arriver avec les leçons opérationnelles déjà intégrées :

- responsabilités claires de conditions et confidentialité
- politique blocklist et signalement d'abus
- analytics serveur seulement
- guide WAF et protection bot
- fichiers publics sobres par défaut pour robots et crawlers LLM
- documentation qui indique exactement ou vivent les réglages Cloudflare

Le projet devrait grandir en rendant le chemin simple plus sur, pas en transformant le Worker en plateforme applicative.
