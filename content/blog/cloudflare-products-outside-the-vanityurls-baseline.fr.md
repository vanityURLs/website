---
title: "Produits Cloudflare hors du baseline vanityURLs"
date: 2026-05-29
author: "Benoît H. Dicaire"
description: "Pourquoi certains produits Cloudflare visibles sont utiles a connaitre, mais ne font pas partie du setup vanityURLs par defaut."
tags: ["cloudflare", "operations", "baseline"]
featured: false
---

Cloudflare expose un large ensemble de produits utiles dans son tableau de bord. vanityURLs n'en utilise volontairement qu'un sous-ensemble etroit par defaut.

Cela ne signifie pas que les autres produits sont inadaptes a tous les deploiements. Cela signifie qu'un redirecteur de liens courts gagne a conserver un modele operationnel petit et previsible : DNS, TLS, un Worker, Access pour les surfaces operationnelles protegees et des protections edge avant que le trafic atteigne le Worker.

Certains produits Cloudflare meritent d'etre compris, mais ils ne devraient pas devenir des etapes de setup sauf si l'operateur fait un choix delibere.

## Cloudflare Web Analytics et RUM

[Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) et Real User Measurement peuvent collecter des donnees navigateur de performance et de visite.

C'est hors du baseline vanityURLs. Le redirecteur peut envoyer des evenements cote serveur depuis le Worker vers Umami ou Fathom lorsque les analytics sont activees. Ce modele evite d'ajouter un script de telemetrie navigateur aux pages publiques et correspond mieux aux questions produit de vanityURLs : redirections, misses, recherches expand, pages publiques vues et evenements bot normalises qui atteignent le Worker.

Gardez Cloudflare RUM desactive sauf si l'operateur veut explicitement de la telemetrie navigateur en plus du modele d'evenements Worker.

## Cloudflare Bulk Redirects

[Cloudflare Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) est utile pour de grandes listes de redirections statiques.

Ce n'est pas la source de verite vanityURLs basee sur le Worker. vanityURLs stocke les liens dans le depot, construit un registre runtime et resout les liens exacts, splats, horaires, etats de cycle de vie, previews expand et comportements analytics dans le Worker.

Utiliser Bulk Redirects pour les liens vanityURLs normaux creerait un deuxieme systeme de redirection. Le diagnostic devient plus difficile parce que l'operateur doit determiner si une redirection vient de Git, d'une regle Worker, d'une Page Rule legacy ou d'une liste Bulk Redirect.

## Cloudflare Cache Rules

[Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/) est puissant, mais ne fait pas partie du baseline vanityURLs.

Les decisions de redirection appartiennent au Worker. Le Worker et les en-tetes des ressources statiques decident ce qui doit etre `no-store`, `no-index` ou cacheable. Ajouter des Cache Rules ou Cache Response Rules risque de produire des redirections perimees, des etats de cycle de vie perimes, des trous analytics invisibles et des misses difficiles a expliquer.

Pour le baseline, gardez Cache Rules et Cache Response Rules vides.

## Cloudflare Turnstile

[Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) protege les formulaires et flux applicatifs interactifs contre l'abus automatise.

L'instance vanityURLs par defaut n'expose pas de formulaire public, d'API de creation de liens, de zone de commentaires, de formulaire de connexion ou de flux d'achat. Les surfaces operationnelles protegees sont gerees par Cloudflare Access.

Turnstile peut devenir pertinent si un operateur construit un flux custom de soumission publique autour de vanityURLs, mais il ne fait pas partie du redirecteur standard.

## Cloudflare Workers Analytics

[Cloudflare Workers Analytics](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/) est utile pour la revue d'infrastructure. Il peut aider les operateurs a comprendre le volume de requetes Worker, les erreurs, le temps CPU, le wall time et la duree.

Ce n'est pas un produit separe a configurer pendant le Quickstart. C'est une surface d'observabilite a consulter apres le deploiement.

Pour les evenements applicatifs, utilisez les analytics serveur vanityURLs si elles sont activees. Pour le trafic bloque avant le Worker, utilisez Cloudflare Security Events. Pour la sante d'infrastructure Worker, utilisez Workers Analytics.

## La regle

Si un produit Cloudflare ne protege pas la couche DNS/TLS, le chemin Worker, le domaine court ou les surfaces operationnelles protegees, il ne fait probablement pas partie du baseline.

Ecrivez la raison avant de l'activer. Cela garde le redirecteur petit, la documentation honnete et les futurs diagnostics moins surprenants.
