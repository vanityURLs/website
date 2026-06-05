---
title: "L'architecture v8s actuelle"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "Comment le Worker actuel, les defaults, les surcharges custom, les analytics et le modèle de sécurité Cloudflare s'assemblent."
tags: ["architecture", "cloudflare", "sécurité"]
---

La release v8s actuelle repose sur un contrat simple : garder le runtime petit, garder la source de vérité dans Git, et pousser le filtrage d'abus aussi pres de l'edge que possible.

## Le modèle d'instance

Une instance a deux types de fichiers :

- `defaults/` contient les defaults du produit, les pages opérationnelles publiques, les defaults de blocklist, les consignes robots et crawlers LLM, et les scripts qui doivent être mis à jour depuis upstream
- `custom/` contient les liens propres à l'instance, les planifications, les surcharges de politique, l'habillage, les pages légales, et les fichiers publics locaux

Cette séparation est l'histoire de mise à jour. Si les propriétaires gardent leur travail dans `custom/`, les futures releases peuvent rafraichir `defaults/` et `scripts/` sans écraser le contenu local.

## Le runtime

Au build, v8s génère un registre schéma `3.0` à partir du fichier de liens, des planifications, de la blocklist, et des assets statiques. Le Cloudflare Worker utilise ce registre génère pour resoudre les requêtes.

Le Worker fait tres peu, volontairement :

1. rejétér les assets d'implementation privés et les probes scanner connus
2. accepter seulement `GET`, `HEAD`, et `OPTIONS`, plus les endpoints `POST` publics de lookup
3. resoudre les liens exacts avant les liens splat
4. appliquer les planifications et états de cycle de vie
5. émettre les analytics serveur non bloquants quand ils sont actifs
6. retourner une redirection, une page protégée, ou un 404

C'est une posture de sécurité. La simplicité n'est pas decorative; elle fait partie du modèle de menace.

## Cloudflare autour du Worker

Le Worker n'est qu'une couche. Une instance production devrait aussi utiliser les outils sécurité du domaine Cloudflare :

- Zero Trust Access pour les chemins stats localisés comme `/en/_stats/` et pour `/_tests`
- règles WAF pour les probes scanner et methodes inattendues
- rate limiting pour les candidats de liens courts
- contrôles bot et contrôles crawler IA
- TLS Full (strict), HTTPS force, et normalisation URL
- `robots.txt`, `llms.txt`, et `llms-full.txt` custom publies depuis le dépôt

Le but est de rejétér l'abus évident avant qu'il consomme du CPU Worker ou du quota analytics.

## Analytics

v8s n'a pas besoin d'analytics navigateur. Les événements de redirection peuvent être envoyés côté serveur depuis le Worker vers Umami ou Fathom avec `ctx.waitUntil()`.

La posture confidentialité est volontairement etroite : pas de JavaScript de tracking, pas d'identifiant navigateur, et pas d'analytics pour le trafic déjà bloque par Cloudflare. Les propriétaires doivent quand même verifier les quotas et limites de compte fournisseur, car du trafic scanner peut apparaitre avant même qu'un domaine court soit public.

## Responsabilite

Un moteur de redirection peut servir a de bons liens de documentation, alias de projets stables, pages d'événement, et infrastructure personnelle. Il peut aussi être detourne pour phishing, malware, tracking non divulgue, ou chaines de redirection.

Le code peut rendre l'abus plus difficile. Le propriétaire de l'instance reste responsable de chaque destination publiée.
