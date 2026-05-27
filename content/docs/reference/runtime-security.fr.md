---
aside: false
title: "Approche securite du runtime"
description: "Comment le Worker vanityURLs reste petit, deterministe et defensif a la peripherie."
weight: 20
aliases:
  - /docs/runtime-security/

---

Le runtime vanityURLs est volontairement petit : valider le registre genere, servir les assets statiques, lire `v8s.json`, puis retourner un petit nombre de resultats possibles.

Pour le raisonnement de design, lisez [Securite runtime pour un petit redirecteur](/fr/blog/runtime-security-for-a-small-redirector/). Cette page est la reference compacte des controles a conserver.

## Runtime defensif

Le Worker garde un chemin runtime etroit :

- seules les requetes publiques `GET`, `HEAD`, et `OPTIONS` silencieuses sont acceptees, plus le beacon dedie `POST /_analytics/expand`
- l'acces direct a `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json` retourne 404
- les redirections acceptent seulement les cibles `http:` et `https:`
- les cibles avec identifiants, hostname manquant, caracteres de controle, ou protocoles non supportes echouent ferme
- les valeurs splat sont encodees segment par segment avant insertion
- les etats de cycle de vie passent par des regles de routage explicites
- les chemins operationnels proteges verifient les JWT Cloudflare Access et echouent ferme si Access n'est pas configure
- les probes scanner retournent un 404 simple no-store avant lookup ou analytics
- les analytics sont envoyes avec `ctx.waitUntil()` pour qu'une panne fournisseur ne ralentisse pas les redirections

Les protections runtime par defaut incluent :

- protocoles non HTTP(S)
- identifiants dans les URLs
- cibles localhost, `.localhost`, et `.local`
- plages IP privees, loopback, reservees, multicast, et documentation
- shorteners publics utilises pour cacher la destination finale
- exemples locaux de domaines de phishing
- extensions de telechargement a haut risque comme `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, et `.jar`

## Ordre de resolution

Pour chaque requete, le Worker suit un chemin volontairement etroit :

1. refuse les assets runtime bruts et les probes de scanners
2. accepte seulement `GET`, `HEAD`, et `OPTIONS` pour les routes publiques
3. normalise le chemin entrant
4. cherche un lien exact
5. cherche un lien splat si aucun exact ne correspond
6. applique les horaires et l'etat
7. retourne une redirection, une page d'information, ou une 404

Les horaires s'appliquent seulement aux liens exacts. Les liens splat sont utiles pour les namespaces stables, mais ne devraient pas etre utilises pour des redirections sensibles au temps.

## Garde-fous de build

`npm run check` construit les memes assets que le deploiement, valide le registre genere, valide les fichiers de politique, lint le depot, et execute les tests Worker.

La validation verifie que les lignes de liens ont la forme attendue, que les URL cibles se normalisent de facon sure, que les cibles dangereuses sont rejetees, que les alias splat ne masquent pas des chemins parents dangereux, que les planifications sont valides, que les assets runtime generes utilisent le schema attendu, que les assets runtime bruts restent inaccessibles, et que le `src/` genere correspond a la source Worker dans `scripts/workers/`.

Le registre genere et la politique runtime sont traites comme des donnees, pas comme du code executable. Les changements propres a l'instance vivent dans `custom/`; les defaults produit restent dans `defaults/`; la source canonique du Worker reste dans `scripts/workers/`; `src/` est genere seulement pour Wrangler. Cela garde les mises a jour revues et rend le rollback normal dans Git.

Les headers par defaut incluent `X-Generated-By: vanityURLs.link`. Si vous surchargez `custom/public/_headers`, gardez cette identite de generation, des regles cache et securite compatibles, et les blocages des fichiers runtime bruts sauf raison explicite.

## Gardes des fichiers operationnels

Cloudflare Access n'est pas la seule couche qui limite l'acces aux fichiers operationnels. Gardez l'acces controle sur `/_stats` et `/_tests`, les entrees de fichiers runtime dans `_headers` et le garde Worker des fichiers runtime actives, sauf si vous avez une raison deliberee de divulgation publique.

| Controle | Chemins | Ce qu'il fait |
|---|---|---|
| Garde Worker des assets runtime prives | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Retourne `404` pour les requetes publiques directes |
| Fallback statique `_headers` | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`, `/_stats/*`, `/expand/*` | Ajoute des en-tetes no-cache et no-index si des assets statiques sont servis directement |
| API stats protegee | `/_stats/api/v8s.json` | Expose le registre genere seulement a travers la surface stats protegee |
| Validation des slugs reserves | `/_stats`, `/api`, `/_worker`, `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Empeche la creation de liens courts sous les chemins operationnels reserves |

## Controles edge Cloudflare

Cloudflare devrait rejeter les abus courants avant que le Worker s'execute. Utilisez [Protection reseau](/fr/docs/customize/network-protection/) pour le flux operateur autour des WAF custom rules, rate limiting, Bot Fight Mode, controles crawler IA, Browser Integrity Check, managed rules, et reglages de domaine associes. Utilisez [Controle d'acces](/fr/docs/customize/access-control/) pour les chemins operationnels prives.

Gardez la blocklist Worker comme fallback, pas comme premiere ligne de defense contre les abus a fort volume. Les reglages canoniques pour WAF, crawlers IA, Rules, Network, DNS, SSL/TLS, Security, Caching, et analytics Cloudflare vivent dans [Protection reseau](/fr/docs/reference/network-protection/).
