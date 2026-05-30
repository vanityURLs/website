---
title: "Sécurité runtime pour un petit redirecteur"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs garde le Worker petit, bloque les fichiers runtime bruts, et utilise les contrôles Cloudflare autour du chemin de redirection."
tags: ["sécurité", "runtime", "cloudflare"]
featured: false
---

Les domaines de liens courts sont de petites cibles avec de grandes consequences. Une mauvaise redirection peut abimer la confiance rapidement, et le trafic scanner peut arriver avant même que le domaine soit public. C'est pourquoi vanityURLs traite la simplicité comme une caracteristique de sécurité, pas comme une préférence esthetique.

Le runtime n'est pas un service public de soumission de liens. Ce n'est pas une application web avec base de données. C'est un moteur de redirection construit depuis Git : valider le registre, déployer les assets statiques, lire les données générées, puis retourner une redirection, une page protégée, une page désactivée, une page expirée, ou un 404 localisé.

## Moins de pieces mobiles

Le Worker évite les parties qui rendent souvent un raccourcisseur plus difficile a raisonner :

- pas d'API d'écriture publique
- pas de comptes visiteurs
- pas de cookies
- pas d'analytics côté client
- pas de couche de requête base de données
- pas de serveur d'origine derrière Cloudflare

Cela ne rend pas le code invulnerable. Cela rend le runtime assez petit pour être teste et entoure de contrôles Cloudflare.

## Echouer ferme

Le Worker accepte seulement un ensemble etroit de requêtes. Les fichiers runtime bruts sont bloques, les cibles de redirection doivent utiliser `http:` ou `https:`, les valeurs splat sont encodees avant insertion, et les routes opérationnelles protégées verifient Cloudflare Access avant d'afficher les vues privées.

Les probes scanner retournent un 404 simple no-store avant lookup ou analytics. Les pannes fournisseur analytics ne ralentissent pas les redirections parce que les événements sont envoyés avec `ctx.waitUntil()`.

Cette posture est volontairement pratique : rejétér le bruit évident tot, garder la résolution détérministe, et rendre les echecs silencieux.

## Garde-fous de build

`npm run check` fait partie de l'histoire sécurité. Il construit les assets déployables, valide les données runtime générées, valide les fichiers de politique, lance le lint, et exécute les tests Worker.

Le registre génère et la politique sont traites comme des données. Les changements de l'instance vivent dans `custom/`, les defaults produit vivent dans `defaults/`, la source canonique du Worker vit dans `scripts/workers/`, et `src/` génère existe pour Wrangler.

Cette séparation garde les mises à jour lisibles et rend le rollback normal dans Git.

## Cloudflare compte encore

Le Worker ne devrait pas être le premier endroit ou les abus a fort volume sont geres. Utilisez Cloudflare WAF, rate limiting, contrôles bot, contrôles crawler IA, DNS, SSL/TLS, et politiques Access pour rejétér les abus courants avant le runtime.

Utilisez [Protection réseau](/fr/docs/customize/network-protection/) pour les contrôles edge et [Sécurité runtime](/fr/docs/reference/runtime-security/) pour la référence runtime compacte.
