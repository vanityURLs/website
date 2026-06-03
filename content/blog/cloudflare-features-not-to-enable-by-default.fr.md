---
title: "Ne tournez pas tous les boutons Cloudflare"
date: 2026-05-28
author: "Benoît H. Dicaire"
description: "Quelles fonctionnalites du tableau de bord Cloudflare une instance vanityURLs devrait laisser de côté sans raison opérationnelle précise."
tags: ["cloudflare", "sécurité", "opérations"]
featured: false
---

Le tableau de bord Cloudflare n'est pas une checklist.

C'est la règle. Une instance vanityURLs à un travail etroit : servir des liens courts depuis un Worker, garder les pages opérationnelles derrière Access et laisser Cloudflare rejétér le bruit évident avant le code applicatif. Les contrôles baseline sont documentes dans [Protection réseau](/fr/docs/customize/network-protection/). L'inventaire produit est documente dans [Produits Cloudflare](/fr/docs/reference/cloudflare-products/).

Ce billet documente l'espace negatif. Il nomme les boutons qui devraient rester étéints sauf si l'opérateur à une raison qui survit au fait de l'écrire.

## Garder Un Seul Systeme De Redirection

Ne configurez pas les Page Rules legacy, Bulk Redirects, modèles de redirection ou Workers Routes de zone comme chemin par défaut pour gerer les liens.

vanityURLs a dejà un [registre de liens](/fr/docs/reference/glossary/#link-registry), des données runtime générées, des états de cycle de vie, des horaires, des splats, des pages de consultation et des analytics côté Worker. Une autre surface de redirection transforme le diagnostic en archeologie.

Utilisez un deuxieme système de redirection seulement lorsqu'il à une limite documentee. Par exemple : une règle de migration temporaire, un hostname hors du Worker vanityURLs ou une liste statique volontairement séparée du registre gere dans le dépôt.

## Garder Le Navigateur Hors Des Analytics

N'activez pas Cloudflare Web Analytics ou RUM par défaut.

Les deux peuvent être utiles. Les deux font participer le navigateur du visiteur. La posture vanityURLs par défaut est l'analytics côté serveur depuis le Worker vers Umami ou Fathom, si les analytics sont activées.

Utilisez les vues d'infrastructure Cloudflare pour la sante Worker et les décisions edge. Utilisez les analytics applicatives vanityURLs pour les redirections, misses, consultations, pageviews et événements bot normalises qui ont atteint le Worker.

## Eviter L'Inventaire API Sans API

Laissez Web Assets, API Discovery, Endpoint Management et Schema Validation hors du setup par défaut.

Ces outils conviennent à une application avec une vraie API publique et un schéma a appliquer. La surface publique vanityURLs est surtout composee de requêtes `GET` et `HEAD` vers des slugs. Bloquer le trafic de redirection contre un inventaire API ajouterait plus de mecanique que de protection.

## Garder Le Code Edge Dans Le Worker

N'ajoutez pas Cloudflare Snippets ou Cloud Connector à l'instance standard.

Le Worker est dejà la frontiere de code edge. Workers Static Assets sert déjà les fichiers publics livres. Un deuxieme chemin de code edge rend le comportement plus difficile a revoir et a tester.

Utilisez Snippets seulement pour une extension qui s'explique en une phrase et se teste séparément.

## Garder Les Certificats Ennuyeux

Commencez avec Universal SSL, le mode Full strict, l'application HTTPS, TLS 1.3 et HSTS seulement après que la zone soit prété.

Advanced Certificate Manager, les contrôles de cipher custom et les travaux similaires appartiennent aux déploiements qui ont une vraie exigence de certificat. Ils ne sont pas des prérequis pour un domaine court fonctionnel.

## La Version Courte

Si une fonctionnalite ne protège pas DNS/TLS, le chemin Worker, le domaine court ou les pages opérationnelles protégées, elle ne fait pas partie du setup par défaut.

Dans la capture du tableau de bord du 2026-05-29, la liste brute des surfaces Cloudflare baseline et hors baseline vit dans [`data/cloudflare-protection-defaults.json`](/fr/docs/customize/network-protection/). `Last verified: 2026-05-29`

Le compromis est volontaire. vanityURLs renonce à un peu de commodite du tableau de bord pour garder un runtime, un registre et moins d'endroits ou l'état perime peut se cacher.
