---
title: "Checklist de release pour une instance vanityURLs"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Une checklist production compacte pour lancer ou mettre a jour une instance vanityURLs sur Cloudflare."
tags: ["release", "operations", "cloudflare"]
featured: false
aliases:
  - /fr/docs/release-checklist/
---

Utilisez cette checklist avant de lancer une nouvelle instance ou de promouvoir une mise a jour majeure. Une instance vanityURLs est robuste, mais tout ce qui brille sur internet attire scanners, bots, et tentatives d'abus.

La meilleure posture de release est sobre : petit Worker, fichiers generes relus, exposition Cloudflare etroite, pages operationnelles protegees, et propriete claire de chaque destination.

## Depot et build

- Lancez `npm run clean` avant une release ou avant de comparer la sortie generee
- Rafraichissez `defaults/` et `scripts/` avec [Mettre a jour une instance](/fr/docs/upgrading/)
- Gardez les fichiers propres a l'instance dans `custom/`
- Gardez les changements runtime Worker dans `scripts/workers/`; traitez `src/` comme genere
- Lancez `npm run check`
- Relisez les changements de registre genere, politique runtime, configuration de site, et assets publics
- Commitez et deployez depuis un working tree propre

La CI devrait lancer `npm run check` avant le deploiement. Gardez les identifiants de deploiement hors du depot et configurez-les comme secrets GitHub ou Cloudflare.

## Worker et surfaces privees

- Confirmez que le Worker a un binding `ASSETS`
- Confirmez que le domaine custom pointe vers le Worker
- Desactivez les URL publiques `workers.dev` et preview si elles ne font pas partie du service
- Protegez `/_stats`, `/_stats/*`, `/_tests`, et `/_tests/*` avec [Controle d'acces](/fr/docs/access-control/)
- Confirmez que le Worker accepte seulement `GET`, `HEAD`, et `OPTIONS` sur les routes publiques
- Confirmez que les fichiers runtime bruts retournent 404 : `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json`
- Confirmez que les headers incluent `X-Generated-By: vanityURLs.link` sauf surcharge intentionnelle

## Controles de domaine Cloudflare

Les reglages Cloudflare sont repartis dans trois zones :

- **Zero Trust** : applications Access, politiques, fournisseurs d'identite et reglages
- **Workers & Pages** : deploiement, binding assets, variables, observabilite, domaines custom et reglages de build
- **Configuration du domaine** : AI Crawl Control, Analytics, Caching, DNS, Network, Rules, Security, SSL/TLS et WAF

Utilisez [Controle d'acces](/fr/docs/access-control/) pour les chemins operationnels prives, [Protection reseau](/fr/docs/network-protection/) pour les reglages de domaine, et [Wrangler Without Shooting Yourself in the Foot](/blog/wrangler/) pour le nom du Worker et `wrangler.toml`.

## Abus et politique

- Gardez la blocklist runtime activee comme fallback applicatif apres les controles reseau Cloudflare
- Relisez `defaults/v8s-blocklist-categories.json` quand les feeds generes changent
- Gardez la politique source editable dans `custom/v8s-policies.json`; traitez `build/v8s-blocklist.json` comme sortie generee
- N'utilisez pas le redirecteur pour phishing, malware, tracking dissimule, routage affilie non divulgue, chaines de raccourcisseurs, ou destinations qui contredisent les attentes des visiteurs

Utilisez [Politique et blocklist](/fr/docs/blocklist/) pour la politique d'instance et [Securite runtime](/fr/docs/runtime-security/) pour les protections runtime integrees.

## Analytics

- Utilisez seulement des analytics serveur; n'ajoutez pas de scripts de tracking navigateur
- Configurez Umami ou Fathom avec les variables et secrets Worker
- Confirmez que le trafic bloque par [Protection reseau](/fr/docs/network-protection/) n'est pas envoye aux analytics
- Relisez les limites de debit et quotas du fournisseur avant lancement
- Surveillez les premieres 24 heures pour le bruit scanner qui pourrait consommer du quota

Utilisez [Analytics](/fr/docs/analytics/) pour les variables, noms d'evenements, limites fournisseur, mode IP et verification.

## Fichiers publics et marque

- Publiez `robots.txt`, `llms.txt`, et `llms-full.txt` depuis `defaults/public/`, ou surchargez-les dans `custom/public/`
- Confirmez que `custom/v8s-site-config.json` liste les bonnes `supported_languages`
- Ajoutez ou personnalisez les pages conditions, confidentialite, abus et contact securite pour le proprietaire et la juridiction
- Traitez le texte legal inclus comme un brouillon, pas comme un avis juridique
- Confirmez que les badges de redirection localises existent pour les langues supportees
- Lancez `npm run optimize:badges` apres modification des SVG de badge par defaut

Utilisez [Pages legales et de confiance](/fr/docs/legal-trust-pages/), [Internationalisation](/fr/docs/i18n/), et [Marque](/fr/docs/brand/) pour les details.

## Smoke checks operationnels

- Confirmez qu'un lien court actif connu retourne la redirection attendue
- Confirmez qu'un slug cache ou absent retourne 404
- Confirmez qu'une cible bloquee echoue la validation
- Confirmez que `/_stats` et `/_tests` sont proteges
- Confirmez que les analytics serveur recoivent un evenement test si les analytics sont actives
- Confirmez que Cloudflare bloque le trafic scanner banal avant qu'il atteigne le Worker
