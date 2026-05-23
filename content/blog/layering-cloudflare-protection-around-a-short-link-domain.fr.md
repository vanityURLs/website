---
title: "Ajouter des couches de protection Cloudflare autour d'un domaine court"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi une instance vanityURLs devrait utiliser les controles edge Cloudflare avant que le trafic atteigne le Worker."
tags: ["cloudflare", "securite", "reseau"]
featured: false
---

Un redirecteur de liens courts semble simple de l'exterieur : recevoir un slug, chercher une destination, rediriger. Internet ne le traite pas avec autant de douceur. Meme un domaine court discret peut recevoir des probes scanner, methodes etranges, bots, crawlers et misses repetes avant meme d'etre annonce.

C'est pourquoi vanityURLs utilise des couches. Le Worker devrait rester petit et deterministe, pendant que Cloudflare gere le bruit edge qui ne devrait jamais consommer du CPU Worker ou du quota analytics.

## Bloquer le bruit avant le Worker

Le Worker peut rejeter les destinations dangereuses et les probes scanner connues, mais le bruit a fort volume est mieux gere plus tot. Les regles WAF Cloudflare, rate limiting, Bot Fight Mode, Browser Integrity Check et managed rules peuvent rejeter les abus courants avant le code applicatif.

Cette separation rend les operations plus faciles a comprendre :

- Cloudflare Security Events montre les decisions WAF, bot, crawler, Access et rate-limit
- les analytics Worker montrent les requetes qui ont atteint le runtime applicatif
- Umami ou Fathom montre les evenements applicatifs envoyes par vanityURLs apres filtrage runtime

Si une requete est bloquee a l'edge, elle ne devrait pas apparaitre comme un miss de lien court ni consommer le quota du fournisseur analytics.

## Garder la politique crawler applicable

`robots.txt`, `llms.txt` et `llms-full.txt` sont utiles pour la transparence. Ils decrivent l'intention du proprietaire du site. Ce ne sont pas des mecanismes d'application.

Pour un domaine court prive, familial, d'equipe ou interne, il peut etre raisonnable de bloquer toutes les familles de crawlers sauf celles que vous voulez explicitement. Reproduisez la politique dans les fichiers publics pour la transparence, mais appliquez-la avec Cloudflare AI Crawl Control ou des regles WAF sur user-agent.

Gardez la liste exacte des crawlers dans Cloudflare plutot que dans la documentation publique. Les noms de crawlers, comportements de produits et choix de politique peuvent changer vite.

## Traiter les redirections comme dynamiques

Les decisions de redirection peuvent dependre des etats de cycle de vie, horaires, misses, analytics et politiques runtime. Cachez les assets statiques, mais soyez tres prudent avec le caching des reponses de redirection. Une redirection stale peut conserver la mauvaise destination apres expiration, changement d'horaire ou desactivation d'un lien.

Pour la plupart des instances, la strategie cache la plus sure est simple : laissez le Worker prendre les decisions de redirection et laissez les headers d'assets gerer les fichiers statiques.

## Utiliser le tableau qui correspond a la couche

Cloudflare analytics et Security Events servent aux questions d'infrastructure : DNS, TLS, WAF, rate limiting, bots, blocages crawler IA, connexions Access, CPU Worker et erreurs Worker.

Les analytics vanityURLs servent aux questions applicatives : redirections, misses, recherches expand, pageviews et evenements bot normalises qui ont atteint le Worker.

Les deux vues comptent, mais elles ne repondent pas aux memes questions. Les melanger transforme le trafic scanner en comportement produit et peut cacher le travail utile que Cloudflare fait deja avant le Worker.

Utilisez [Protection reseau](/fr/docs/customize/network-protection/) pour la checklist Cloudflare et [Securite runtime](/fr/docs/reference/runtime-security/) pour les controles cote Worker.
