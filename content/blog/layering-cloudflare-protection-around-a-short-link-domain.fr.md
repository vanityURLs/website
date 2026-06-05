---
title: "Gardez le trafic scanner hors du Worker"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi une instance vanityURLs devrait utiliser les contrôles edge Cloudflare avant que le trafic atteigne le Worker."
tags: ["cloudflare", "sécurité", "réseau"]
featured: false
---

Un redirecteur de liens courts semble simple : recevoir un slug, chercher une destination, rediriger.

Internet fournit le reste. Probes PHP. Chemins WordPress. Methodes etranges. Bots. Crawlers. Misses repêtes pour des slugs que personne n'a crees.

Le Worker ne devrait pas être le premier endroit ou ce bruit devient couteux. vanityURLs garde le Worker petit et détérministe, puis utilise les contrôles edge Cloudflare pour le trafic qui ne devrait jamais consommer du CPU Worker ou du quota analytics.

## Bloquer Avant Le Runtime

Le Worker valide toujours les destinations et la politique runtime. C'est la dernière ligne de defense, pas la première.

Utilisez les règles WAF Cloudflare, rate limiting, Bot Fight Mode, Browser Integrity Check, managed rules, Turnstile et Access lorsque cela correspond à la couche. L'abus courant devrait s'arrétér avant le code applicatif.

Cette séparation garde les preuves propres :

- [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/) montre les décisions WAF, bot, crawler, Access et rate-limit
- les analytics Worker montrent les requêtes qui ont atteint le runtime
- Umami ou Fathom montre les événements applicatifs émis après le filtrage vanityURLs

Si une requête est bloquee à l'edge, elle ne devrait pas ressembler a du comportement produit ni consommer le quota du fournisseur analytics.

Turnstile correspond à la couche lookup publique, pas au chemin de redirection. Utilisez-le pour `/lookup` et `POST /lookup/resolve` afin que les visiteurs puissent prévisualiser une destination exacte, tandis que les redirections `/{slug}` restent rapides et sans challenge. Le raisonnement propre à lookup est dans [Protéger le lookup public sans challenger les redirections](/fr/blog/protecting-public-lookup-with-turnstile/).

## Rendre La Politique Crawler Applicable

`robots.txt`, `llms.txt` et `llms-full.txt` sont utiles pour la transparence. Ce ne sont pas des mecanismes d'application.

Pour un domaine court privé, familial, d'équipe ou interne, bloquer la plupart des familles de crawlers peut être raisonnable. Reproduisez la politique dans les fichiers publics pour rendre l'intention visible. Appliquez-la avec Cloudflare AI Crawl Control ou des règles WAF sur user-agent.

Gardez la liste exacte des crawlers dans Cloudflare. Les noms de crawlers, comportements de produits et politiques locales peuvent changer plus vite que la documentation publique.

## Traiter Les Redirections Comme Dynamiques

Les décisions de redirection peuvent dependre des états de cycle de vie, horaires, misses, analytics et politiques runtime.

Cachez les assets statiques. Soyez prudent avec les réponses de redirection. Une redirection stale peut conserver la mauvaise destination après expiration, changement d'horaire ou désactivation d'un lien.

Pour la plupart des instances, le défaut sur est simple : laissez le Worker decider les redirections et laissez les headers d'assets gerer les fichiers statiques.

## Utiliser Le Bon Tableau De Bord

Cloudflare analytics et Security Events répondent aux questions d'infrastructure : DNS, TLS, WAF, rate limiting, bots, blocages crawler IA, résultats Turnstile, connexions Access, CPU Worker et erreurs Worker.

Les analytics vanityURLs répondent aux questions applicatives : redirections, misses, consultations, pageviews et événements bot normalises qui ont atteint le Worker.

Les deux vues comptent. Les melanger transforme le trafic scanner en comportement utilisateur et cache une protection edge utile.

Utilisez [Protection réseau](/fr/docs/customize/network-protection/) pour la checklist Cloudflare et [Sécurité runtime](/fr/docs/reference/runtime-security/) pour les contrôles côté Worker.
