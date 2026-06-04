---
aside: false
title: "Approche sécurité du runtime"
description: "Comment le Worker vanityURLs reste petit, détérministe et defensif à la peripherie."
weight: 100
aliases:
  - /docs/runtime-security/
---

Le runtime vanityURLs est volontairement petit : valider le registre génère, servir les assets statiques, lire `v8s.json`, puis retourner un petit nombre de résultats possibles.

Pour le raisonnement de design, lisez [Sécurité runtime pour un petit redirecteur](/fr/blog/runtime-security-for-a-small-redirector/). Cette page est la référence compacte des contrôles a conserver.

## Runtime defensif

Le Worker garde un chemin runtime etroit :

- seules les requêtes publiques `GET`, `HEAD`, et `OPTIONS` silencieuses sont acceptees, plus le beacon dedie `POST /_analytics/lookup`
- l'accès direct a `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json` retourne 404
- les redirections acceptent seulement les cibles `http:` et `https:`
- les cibles avec identifiants, hostname manquant, caracteres de contrôle, ou protocoles non supportes échouent ferme
- les valeurs splat sont encodees segment par segment avant insertion
- les états de cycle de vie passent par des règles de routage explicites
- les chemins opérationnels protégés verifient les JWT Cloudflare Access et échouent ferme si Access n'est pas configure
- les probes scanner retournent un 404 simple no-store avant lookup ou analytics
- les analytics sont envoyés avec `ctx.waitUntil()` pour qu'une panne fournisseur ne ralentisse pas les redirections

Les protections runtime par défaut incluent :

- protocoles non HTTP(S)
- identifiants dans les URLs
- cibles localhost, `.localhost`, et `.local`
- plages IP privées, loopback, réservees, multicast, et documentation
- shorteners publics utilises pour cacher la destination finale
- exemples locaux de domaines de phishing
- extensions de telechargement a haut risque comme `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, et `.jar`

## Ordre de résolution

Pour chaque requête, le Worker suit un chemin volontairement etroit :

1. refuse les assets runtime bruts et les probes de scanners
2. accepte seulement `GET`, `HEAD`, et `OPTIONS` pour les routes publiques
3. normalise le chemin entrant
4. cherche un lien exact
5. cherche un lien splat si aucun exact ne correspond
6. applique les horaires et l'état
7. retourne une redirection, une page d'information, ou une 404

Les horaires s'appliquent seulement aux liens exacts. Les liens splat sont utiles pour les namespaces stables, mais ne devraient pas être utilises pour des redirections sensibles au temps.

## Garde-fous de build

`npm run check` construit les mêmes assets que le déploiement, valide le registre génère, valide les fichiers de politique, lint le dépôt, et exécute les tests Worker.

La validation verifie que les lignes de liens ont la forme attendue, que les URL cibles se normalisent de facon sure, que les cibles dangereuses sont rejétées, que les alias splat ne masquent pas des chemins parents dangereux, que les planifications sont valides, que les assets runtime génères utilisent le schéma attendu, que les assets runtime bruts restent inaccessibles, et que le `src/` génère correspond à la source Worker dans `scripts/workers/`.

Le registre génère et la politique runtime sont traites comme des données, pas comme du code executable. Les changements propres à l'instance vivent dans `custom/`; les defaults produit restent dans `defaults/`; la source canonique du Worker reste dans `scripts/workers/`; `src/` est génère seulement pour Wrangler. Cela garde les mises à jour revues et rend le rollback normal dans Git.

Les headers par défaut incluent `X-Generated-By: vanityURLs.link`, des règles no-index, HSTS limité à l'hôte, `nosniff`, une protection contre le clickjacking, des politiques referrer et permissions, et une CSP qui bloque le JavaScript inline et le CSS inline. Si vous surchargez `custom/public/_headers`, gardez cette identité de génération, des règles cache et sécurité compatibles, et les blocages des fichiers runtime bruts sauf raison explicite.

## Gardes des fichiers opérationnels

Cloudflare Access n'est pas la seule couche qui limite l'accès aux fichiers opérationnels. Gardez l'accès contrôle sur les chemins stats localisés comme `/en/_stats/` et `/fr/_stats/`, ainsi que `/_tests`, les entrées de fichiers runtime dans `_headers` et le garde Worker des fichiers runtime actifs, sauf si vous avez une raison délibérée de divulgation publique.

| Contrôle                               | Chemins                                                                                 | Ce qu'il fait                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Garde Worker des assets runtime privés | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`                             | Retourne `404` pour les requêtes publiques directes                                      |
| Fallback statique `_headers`           | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`, `/*/_stats/*`, `/lookup/*` | Ajoute des en-têtes no-cache et no-index si des assets statiques sont servis directement |
| API stats protégée                     | `/en/_stats/api/v8s.json`, `/<lang>/_stats/api/v8s.json`                                | Expose le registre génère seulement a travers la surface stats protégée                  |
| Validation des slugs réserves          | `/_stats`, `/<lang>/_stats`, `/api`, `/_worker`, `/v8s.json`, `/v8s-blocklist.json`     | Empeche la création de liens courts sous les chemins opérationnels réserves              |

## Contrôles edge Cloudflare

Cloudflare devrait rejétér les abus courants avant que le Worker s'execute. Utilisez [Protection réseau](/fr/docs/customize/network-protection/) pour le flux opérateur autour des WAF custom rules, rate limiting, Bot Fight Mode, contrôles crawler IA, Browser Integrity Check, managed rules, et réglages de domaine associes. Utilisez [Contrôle d'accès](/fr/docs/customize/access-control/) pour les chemins opérationnels privés.

Gardez la blocklist Worker comme fallback, pas comme première ligne de defense contre les abus a fort volume. Les réglages canoniques pour WAF, crawlers IA, Rules, Network, DNS, SSL/TLS, Security, Caching, et analytics Cloudflare vivent dans [Protection réseau](/fr/docs/customize/network-protection/).
