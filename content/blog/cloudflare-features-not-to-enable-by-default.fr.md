---
title: "Ne tournez pas tous les boutons Cloudflare"
date: 2026-05-28
author: "Benoît H. Dicaire"
description: "Quelles fonctionnalites du tableau de bord Cloudflare une instance vanityURLs devrait laisser de cote sans raison operationnelle precise."
tags: ["cloudflare", "securite", "operations"]
featured: false
---

Le tableau de bord Cloudflare n'est pas une checklist.

C'est la regle. Une instance vanityURLs a un travail etroit : servir des liens courts depuis un Worker, garder les pages operationnelles derriere Access et laisser Cloudflare rejeter le bruit evident avant le code applicatif. Les controles baseline sont documentes dans [Protection reseau](/fr/docs/customize/network-protection/). L'inventaire produit est documente dans [Produits Cloudflare](/fr/docs/reference/cloudflare-products/).

Ce billet documente l'espace negatif. Il nomme les boutons qui devraient rester eteints sauf si l'operateur a une raison qui survit au fait de l'ecrire.

## Garder Un Seul Systeme De Redirection

Ne configurez pas les Page Rules legacy, Bulk Redirects, modeles de redirection ou Workers Routes de zone comme chemin par defaut pour gerer les liens.

vanityURLs a deja un [registre de liens](/fr/docs/reference/glossary/#link-registry), des donnees runtime generees, des etats de cycle de vie, des horaires, des splats, des pages expand et des analytics cote Worker. Une autre surface de redirection transforme le diagnostic en archeologie.

Utilisez un deuxieme systeme de redirection seulement lorsqu'il a une limite documentee. Par exemple : une regle de migration temporaire, un hostname hors du Worker vanityURLs ou une liste statique volontairement separee du registre gere dans le depot.

## Garder Le Navigateur Hors Des Analytics

N'activez pas Cloudflare Web Analytics ou RUM par defaut.

Les deux peuvent etre utiles. Les deux font participer le navigateur du visiteur. La posture vanityURLs par defaut est l'analytics cote serveur depuis le Worker vers Umami ou Fathom, si les analytics sont activees.

Utilisez les vues d'infrastructure Cloudflare pour la sante Worker et les decisions edge. Utilisez les analytics applicatives vanityURLs pour les redirections, misses, recherches expand, pageviews et evenements bot normalises qui ont atteint le Worker.

## Eviter L'Inventaire API Sans API

Laissez Web Assets, API Discovery, Endpoint Management et Schema Validation hors du setup par defaut.

Ces outils conviennent a une application avec une vraie API publique et un schema a appliquer. La surface publique vanityURLs est surtout composee de requetes `GET` et `HEAD` vers des slugs. Bloquer le trafic de redirection contre un inventaire API ajouterait plus de mecanique que de protection.

## Garder Le Code Edge Dans Le Worker

N'ajoutez pas Cloudflare Snippets ou Cloud Connector a l'instance standard.

Le Worker est deja la frontiere de code edge. Workers Static Assets sert deja les fichiers publics livres. Un deuxieme chemin de code edge rend le comportement plus difficile a revoir et a tester.

Utilisez Snippets seulement pour une extension qui s'explique en une phrase et se teste separement.

## Garder Les Certificats Ennuyeux

Commencez avec Universal SSL, le mode Full strict, l'application HTTPS, TLS 1.3 et HSTS seulement apres que la zone soit prete.

Advanced Certificate Manager, les controles de cipher custom et les travaux similaires appartiennent aux deploiements qui ont une vraie exigence de certificat. Ils ne sont pas des prerequis pour un domaine court fonctionnel.

## La Version Courte

Si une fonctionnalite ne protege pas DNS/TLS, le chemin Worker, le domaine court ou les pages operationnelles protegees, elle ne fait pas partie du setup par defaut.

Dans la capture du tableau de bord du 2026-05-29, la liste brute des surfaces Cloudflare baseline et hors baseline vit dans [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json). `Last verified: 2026-05-29`

Le compromis est volontaire. vanityURLs renonce a un peu de commodite du tableau de bord pour garder un runtime, un registre et moins d'endroits ou l'etat perime peut se cacher.
