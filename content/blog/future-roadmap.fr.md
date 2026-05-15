---
title: "La suite pour v8s.link"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "Roadmap brouillon pour rendre v8s plus facile a installer, mettre a jour, et operer sans alourdir le runtime."
tags: ["roadmap", "operations"]
draft: true
---

Le prochain defi n'est pas la premiere installation. Une nouvelle instance v8s peut deja etre creee rapidement.

Le probleme plus difficile est la possession a long terme : comment une instance recoit-elle les ameliorations upstream de `defaults/` et `scripts/` tout en preservant tout ce qui vit dans `custom/`?

## Le principe de mise a jour

Le projet devrait garder un contrat simple :

- les fichiers du produit vivent dans `defaults/` et `scripts/`
- les fichiers propres a l'instance vivent dans `custom/`
- la sortie generee peut etre reconstruite
- les secrets restent dans Cloudflare ou dans le stockage secret local
- la documentation vit sur le site web, pas dupliquee dans chaque depot d'instance

Ce contrat rend possible un futur outil de mise a jour sans imposer un gestionnaire de paquets des le premier jour.

## Outillage court terme

La direction actuelle est un workflow de mise a jour scripté :

1. lancer `npm run clean`
2. recuperer la release upstream
3. previsualiser les changements de `defaults/` et `scripts/`
4. garder `custom/`, `wrangler.toml`, et les secrets intacts
5. lancer `npm run check`
6. montrer au proprietaire exactement ce qui a change avant le deploiement

C'est plus important qu'une formule Homebrew maintenant. Un gestionnaire de paquets peut installer un outil, mais il ne remplace pas une politique de merge prudente.

## CLI et terminal

Le helper `v8s.zsh` devrait rester concentre : inspecter le registre genere, ouvrir ou copier des redirections connues, et refuser les cibles terminal arbitraires. C'est une couche pratique au-dessus du registre valide, pas une deuxieme source de verite.

Cela donne aux utilisateurs avances un workflow terminal rapide sans affaiblir le modele runtime.

## Instance publique plus tard

L'instance publique `v8s.link` devrait arriver avec les lecons operationnelles deja integrees :

- responsabilites claires de conditions et confidentialite
- politique blocklist et signalement d'abus
- analytics serveur seulement
- guide WAF et protection bot
- fichiers publics sobres par defaut pour robots et crawlers LLM
- documentation qui indique exactement ou vivent les reglages Cloudflare

Le projet devrait grandir en rendant le chemin simple plus sur, pas en transformant le Worker en plateforme applicative.
