---
title: "Checklist de release pour une instance vanityURLs"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Une checklist production compacte pour lancer ou mettre à jour une instance vanityURLs sur Cloudflare."
tags: ["release", "opérations", "cloudflare"]
featured: false
aliases:
  - /fr/docs/release-checklist/
---

Utilisez cette checklist avant de lancer une nouvelle instance ou de promouvoir une mise à jour majeure. Une instance vanityURLs est robuste, mais tout ce qui brille sur internet attire scanners, bots, et tentatives d'abus.

Le dépôt de code garde la liste d'activités exécutable dans [`RELEASE_CHECKLIST.md`](https://github.com/vanityURLs/code/blob/main/RELEASE_CHECKLIST.md). Ce billet explique pourquoi ces contrôles comptent et ajoute le contexte opérationnel pour Cloudflare et les propriétaires d'instance.

La meilleure posture de release est sobre : petit Worker, fichiers génères relus, exposition Cloudflare etroite, pages opérationnelles protégées, et propriété claire de chaque destination.

## Depot et build

- Lancez `npm run clean` avant une release ou avant de comparer la sortie générée
- Rafraichissez `defaults/` et `scripts/` avec [Mettre à jour une instance](/fr/docs/reference/upgrading/)
- Gardez les fichiers propres à l'instance dans `custom/`
- Gardez les changements runtime Worker dans `scripts/workers/`; traitez `src/` comme génère
- Lancez `npm run check`
- Lancez `npm run validate:targets` lorsque vous voulez inclure la joignabilité des cibles dans la gate de release
- Confirmez que `build/v8s-release-manifest.json` existe et relisez ses hashes
- Relisez les changements de registre génère, politique runtime, configuration de site, et assets publics
- Commitez et déployéz depuis un working tree propre

La CI devrait lancer `npm run check` avant le déploiement. Utilisez les commandes groupées pour une confiance ciblée : `npm run test`, `npm run validate`, et `npm run smoke` lancent tout leur groupe, tandis que `test:worker`, `validate:targets`, et `smoke:analytics` lancent une seule couche. Gardez les identifiants de déploiement hors du dépôt et configurez-les comme secrets GitHub ou Cloudflare.

## Worker et surfaces privées

- Confirmez que le Worker à un binding `ASSETS`
- Confirmez que le domaine custom pointe vers le Worker
- Desactivez les URL publiques `workers.dev` et preview si elles ne font pas partie du service
- Protegez `*/_stats`, `*/_stats/*`, `/_tests`, et `/_tests/*` avec [Contrôle d'accès](/fr/docs/customize/access-control/)
- Confirmez que le Worker accepte seulement `GET`, `HEAD`, et `OPTIONS` sur les routes publiques, plus `POST /lookup/resolve` et `POST /_analytics/lookup`
- Confirmez que les fichiers runtime bruts retournent 404 : `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json`
- Confirmez que les headers incluent `X-Generated-By: vanityURLs.link` sauf surcharge intentionnelle

## Contrôles de domaine Cloudflare

Les réglages Cloudflare sont repartis dans trois zones :

- **Zero Trust** : applications Access, politiques, fournisseurs d'identité et réglages
- **Workers & Pages** : déploiement, binding assets, variables, observabilite, domaines custom et réglages de build
- **Configuration du domaine** : AI Crawl Control, Analytics, Caching, DNS, Network, Rules, Security, SSL/TLS et WAF

Utilisez [Contrôle d'accès](/fr/docs/customize/access-control/) pour les chemins opérationnels privés, [Protection réseau](/fr/docs/customize/network-protection/) pour les réglages de domaine, et [Wrangler Without Shooting Yourself in the Foot](/blog/wrangler/) pour le nom du Worker et `wrangler.toml`.

## Abus et politique

- Gardez la blocklist runtime activee comme fallback applicatif après les contrôles réseau Cloudflare
- Relisez `defaults/v8s-blocklist-categories.json` quand les feeds génères changent
- Gardez la politique source éditable dans `custom/v8s-policies.json`; traitez `build/v8s-blocklist.json` comme sortie générée
- N'utilisez pas le redirecteur pour phishing, malware, tracking dissimule, routage affilie non divulgue, chaines de raccourcisseurs, ou destinations qui contredisent les attentes des visiteurs

Utilisez [Politique et blocklist](/fr/docs/customize/blocklist/) pour la politique d'instance et [Sécurité runtime](/fr/docs/reference/runtime-security/) pour les protections runtime intégrées.

## Analytics

- Utilisez seulement des analytics serveur; n'ajoutez pas de scripts de tracking navigateur
- Configurez Umami ou Fathom avec les variables et secrets Worker
- Confirmez que le trafic bloque par [Protection réseau](/fr/docs/customize/network-protection/) n'est pas envoyé aux analytics
- Relisez les limites de debit et quotas du fournisseur avant lancement
- Surveillez les premières 24 heures pour le bruit scanner qui pourrait consommer du quota

Utilisez [Analytics](/fr/docs/customize/analytics/) pour les variables, noms d'événements, limites fournisseur, mode IP et verification.

## Fichiers publics et marque

- Publiez `robots.txt`, `llms.txt`, et `llms-full.txt` depuis `defaults/public/`, ou surchargez-les dans `custom/public/`
- Confirmez que `custom/v8s-site-config.json` liste les bonnes `supported_languages`
- Ajoutez ou personnalisez les pages conditions, confidentialité, abus et contact sécurité pour le propriétaire et la juridiction
- Traitez le texte légal inclus comme un brouillon, pas comme un avis juridique
- Confirmez que les badges de redirection localisés existent pour les langues supportées
- Lancez `npm run optimize:badges` après modification des SVG de badge par défaut

Utilisez [Pied de page et pages](/fr/docs/customize/footer-pages/), [Internationalisation](/fr/docs/reference/i18n/), et [Marque](/fr/docs/reference/brand/) pour les details.

## Smoke checks opérationnels

- Confirmez qu'un lien court actif connu retourne la redirection attendue
- Confirmez qu'un slug cache ou absent retourne 404
- Confirmez qu'une cible bloquee échoue la validation
- Confirmez que `/en/_stats/`, un autre chemin stats localisé et `/_tests` sont protégés
- Confirmez que les analytics serveur recoivent un événement test si les analytics sont actifs
- Confirmez que Cloudflare bloque le trafic scanner banal avant qu'il atteigne le Worker

## Rollback versus migration

Les instructions de migration expliquent comment avancer. Une note de rollback explique comment reculer proprement lorsque le trafic de production révèle un problème après déploiement. Pour vanityURLs, le rollback devrait rester sobre : revenir au commit Git ou au déploiement Cloudflare précédent, confirmer que le Worker lit le registre runtime des liens déployé, puis relancer les smoke checks.
