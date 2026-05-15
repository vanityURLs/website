---
title: "L'architecture v8s actuelle"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "Explication brouillon du Worker actuel, des defaults, des surcharges custom, des analytics, et du modele securite Cloudflare."
tags: ["architecture", "cloudflare", "securite"]
draft: true
---

La release v8s actuelle repose sur un contrat simple : garder le runtime petit, garder la source de verite dans Git, et pousser le filtrage d'abus aussi pres de l'edge que possible.

## Le modele d'instance

Une instance a deux types de fichiers :

- `defaults/` contient les defaults du produit, les pages operationnelles publiques, les defaults de blocklist, les consignes robots et crawlers LLM, et les scripts qui doivent etre mis a jour depuis upstream.
- `custom/` contient les liens propres a l'instance, les planifications, les surcharges de politique, l'habillage, les pages legales, et les fichiers publics locaux.

Cette separation est l'histoire de mise a jour. Si les proprietaires gardent leur travail dans `custom/`, les futures releases peuvent rafraichir `defaults/` et `scripts/` sans ecraser le contenu local.

## Le runtime

Au build, v8s genere un registre schema `2.2` a partir du fichier de liens, des planifications, de la blocklist, et des assets statiques. Le Cloudflare Worker utilise ce registre genere pour resoudre les requetes.

Le Worker fait tres peu, volontairement :

1. rejeter les assets d'implementation prives et les probes scanner connus
2. accepter seulement `GET`, `HEAD`, et `OPTIONS`
3. resoudre les liens exacts avant les liens splat
4. appliquer les planifications et etats de cycle de vie
5. emettre les analytics serveur non bloquants quand ils sont actives
6. retourner une redirection, une page protegee, ou un 404

C'est une posture de securite. La simplicite n'est pas decorative; elle fait partie du modele de menace.

## Cloudflare autour du Worker

Le Worker n'est qu'une couche. Une instance production devrait aussi utiliser les outils securite du domaine Cloudflare :

- Zero Trust Access pour `/_stats` et `/_tests`
- regles WAF pour les probes scanner et methodes inattendues
- rate limiting pour les candidats de liens courts
- controles bot et controles crawler IA
- TLS Full (strict), HTTPS force, et normalisation URL
- `robots.txt`, `llms.txt`, et `llms-full.txt` custom publies depuis le depot

Le but est de rejeter l'abus evident avant qu'il consomme du CPU Worker ou du quota analytics.

## Analytics

v8s n'a pas besoin d'analytics navigateur. Les evenements de redirection peuvent etre envoyes cote serveur depuis le Worker vers Umami ou Fathom avec `ctx.waitUntil()`.

La posture confidentialite est volontairement etroite : pas de JavaScript de tracking, pas d'identifiant navigateur, et pas d'analytics pour le trafic deja bloque par Cloudflare. Les proprietaires doivent quand meme verifier les quotas et limites de compte fournisseur, car du trafic scanner peut apparaitre avant meme qu'un domaine court soit public.

## Responsabilite

Un moteur de redirection peut servir a de bons liens de documentation, alias de projets stables, pages d'evenement, et infrastructure personnelle. Il peut aussi etre detourne pour phishing, malware, tracking non divulgue, ou chaines de redirection.

Le code peut rendre l'abus plus difficile. Le proprietaire de l'instance reste responsable de chaque destination publiee.
