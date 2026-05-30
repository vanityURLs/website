---
title: "Gardez le trafic scanner hors du Worker"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi une instance vanityURLs devrait utiliser les controles edge Cloudflare avant que le trafic atteigne le Worker."
tags: ["cloudflare", "securite", "reseau"]
featured: false
---

Un redirecteur de liens courts semble simple : recevoir un slug, chercher une destination, rediriger.

Internet fournit le reste. Probes PHP. Chemins WordPress. Methodes etranges. Bots. Crawlers. Misses repetes pour des slugs que personne n'a crees.

Le Worker ne devrait pas etre le premier endroit ou ce bruit devient couteux. vanityURLs garde le Worker petit et deterministe, puis utilise les controles edge Cloudflare pour le trafic qui ne devrait jamais consommer du CPU Worker ou du quota analytics.

## Bloquer Avant Le Runtime

Le Worker valide toujours les destinations et la politique runtime. C'est la derniere ligne de defense, pas la premiere.

Utilisez les regles WAF Cloudflare, rate limiting, Bot Fight Mode, Browser Integrity Check, managed rules et Access lorsque cela correspond a la couche. L'abus courant devrait s'arreter avant le code applicatif.

Cette separation garde les preuves propres :

- [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/) montre les decisions WAF, bot, crawler, Access et rate-limit
- les analytics Worker montrent les requetes qui ont atteint le runtime
- Umami ou Fathom montre les evenements applicatifs emis apres le filtrage vanityURLs

Si une requete est bloquee a l'edge, elle ne devrait pas ressembler a du comportement produit ni consommer le quota du fournisseur analytics.

## Rendre La Politique Crawler Applicable

`robots.txt`, `llms.txt` et `llms-full.txt` sont utiles pour la transparence. Ce ne sont pas des mecanismes d'application.

Pour un domaine court prive, familial, d'equipe ou interne, bloquer la plupart des familles de crawlers peut etre raisonnable. Reproduisez la politique dans les fichiers publics pour rendre l'intention visible. Appliquez-la avec Cloudflare AI Crawl Control ou des regles WAF sur user-agent.

Gardez la liste exacte des crawlers dans Cloudflare. Les noms de crawlers, comportements de produits et politiques locales peuvent changer plus vite que la documentation publique.

## Traiter Les Redirections Comme Dynamiques

Les decisions de redirection peuvent dependre des etats de cycle de vie, horaires, misses, analytics et politiques runtime.

Cachez les assets statiques. Soyez prudent avec les reponses de redirection. Une redirection stale peut conserver la mauvaise destination apres expiration, changement d'horaire ou desactivation d'un lien.

Pour la plupart des instances, le defaut sur est simple : laissez le Worker decider les redirections et laissez les headers d'assets gerer les fichiers statiques.

## Utiliser Le Bon Tableau De Bord

Cloudflare analytics et Security Events repondent aux questions d'infrastructure : DNS, TLS, WAF, rate limiting, bots, blocages crawler IA, connexions Access, CPU Worker et erreurs Worker.

Les analytics vanityURLs repondent aux questions applicatives : redirections, misses, recherches expand, pageviews et evenements bot normalises qui ont atteint le Worker.

Les deux vues comptent. Les melanger transforme le trafic scanner en comportement utilisateur et cache une protection edge utile.

Utilisez [Protection reseau](/fr/docs/customize/network-protection/) pour la checklist Cloudflare et [Securite runtime](/fr/docs/reference/runtime-security/) pour les controles cote Worker.
