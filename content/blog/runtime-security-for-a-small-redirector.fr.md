---
title: "Securite runtime pour un petit redirecteur"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs garde le Worker petit, bloque les fichiers runtime bruts, et utilise les controles Cloudflare autour du chemin de redirection."
tags: ["securite", "runtime", "cloudflare"]
featured: false
---

Les domaines de liens courts sont de petites cibles avec de grandes consequences. Une mauvaise redirection peut abimer la confiance rapidement, et le trafic scanner peut arriver avant meme que le domaine soit public. C'est pourquoi vanityURLs traite la simplicite comme une caracteristique de securite, pas comme une preference esthetique.

Le runtime n'est pas un service public de soumission de liens. Ce n'est pas une application web avec base de donnees. C'est un moteur de redirection construit depuis Git : valider le registre, deployer les assets statiques, lire les donnees generees, puis retourner une redirection, une page protegee, une page desactivee, une page expiree, ou un 404 localise.

## Moins de pieces mobiles

Le Worker evite les parties qui rendent souvent un raccourcisseur plus difficile a raisonner :

- pas d'API d'ecriture publique
- pas de comptes visiteurs
- pas de cookies
- pas d'analytics cote client
- pas de couche de requete base de donnees
- pas de serveur d'origine derriere Cloudflare

Cela ne rend pas le code invulnerable. Cela rend le runtime assez petit pour etre teste et entoure de controles Cloudflare.

## Echouer ferme

Le Worker accepte seulement un ensemble etroit de requetes. Les fichiers runtime bruts sont bloques, les cibles de redirection doivent utiliser `http:` ou `https:`, les valeurs splat sont encodees avant insertion, et les routes operationnelles protegees verifient Cloudflare Access avant d'afficher les vues privees.

Les probes scanner retournent un 404 simple no-store avant lookup ou analytics. Les pannes fournisseur analytics ne ralentissent pas les redirections parce que les evenements sont envoyes avec `ctx.waitUntil()`.

Cette posture est volontairement pratique : rejeter le bruit evident tot, garder la resolution deterministe, et rendre les echecs silencieux.

## Garde-fous de build

`npm run check` fait partie de l'histoire securite. Il construit les assets deployables, valide les donnees runtime generees, valide les fichiers de politique, lance le lint, et execute les tests Worker.

Le registre genere et la politique sont traites comme des donnees. Les changements de l'instance vivent dans `custom/`, les defaults produit vivent dans `defaults/`, la source canonique du Worker vit dans `scripts/workers/`, et `src/` genere existe pour Wrangler.

Cette separation garde les mises a jour lisibles et rend le rollback normal dans Git.

## Cloudflare compte encore

Le Worker ne devrait pas etre le premier endroit ou les abus a fort volume sont geres. Utilisez Cloudflare WAF, rate limiting, controles bot, controles crawler IA, DNS, SSL/TLS, et politiques Access pour rejeter les abus courants avant le runtime.

Utilisez [Protection reseau](/fr/docs/customize/network-protection/) pour les controles edge et [Securite runtime](/fr/docs/reference/runtime-security/) pour la reference runtime compacte.
