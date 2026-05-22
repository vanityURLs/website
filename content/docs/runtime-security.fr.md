---
aside: false
title: "Approche securite du runtime"
description: "Comment le Worker vanityURLs reste petit, deterministe et defensif a la peripherie."
weight: 60

---

Le runtime vanityURLs est volontairement simple. Ce n'est pas un service public de soumission de liens, pas une application avec base de donnees, et pas un framework web generaliste. C'est un moteur de redirection construit depuis Git : valider le registre, deployer les assets statiques, lire `v8s.json`, puis retourner un petit nombre de resultats possibles.

La simplicite fait partie du modele de securite. Le Worker a moins de pieces mobiles qu'un raccourcisseur classique : pas d'API d'ecriture publique, pas de comptes visiteurs, pas de cookies, pas d'analytics cote client, pas de couche de requete base de donnees, et pas de serveur d'origine derriere Cloudflare.

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

L'idee importante n'est pas que le code serait magiquement invulnerable. L'idee est que le runtime est assez petit pour etre raisonne, teste, et entoure de controles edge.

## Garde-fous de build

`npm run check` construit les memes assets que le deploiement, valide le registre genere, valide les fichiers de politique, lint le depot, et execute les tests Worker.

Pour un travail local cible, utilisez :

```bash
npm run lint
npm test
npm run build
npm run smoke:analytics
```

La validation verifie que les lignes de liens ont la forme attendue, que les URL cibles se normalisent de facon sure, que les cibles dangereuses sont rejetees, que les alias splat ne masquent pas des chemins parents dangereux, que les planifications sont valides, que les assets runtime generes utilisent le schema attendu, que les assets runtime bruts restent inaccessibles, et que le `src/` genere correspond a la source Worker dans `scripts/workers/`.

Les avertissements doivent etre revises. Les erreurs doivent etre corrigees plutot que contournees; un redirecteur peut abimer rapidement la reputation de son domaine si de mauvaises cibles passent.

Le registre genere et la politique runtime sont traites comme des donnees, pas comme du code executable. Les changements propres a l'instance vivent dans `custom/`; les defaults produit restent dans `defaults/`; la source canonique du Worker reste dans `scripts/workers/`; `src/` est genere seulement pour Wrangler. Cela garde les mises a jour revues et rend le rollback normal dans Git.

Les headers par defaut incluent `X-Generated-By: vanityURLs.link`. Si vous surchargez `_headers`, gardez cette identite de generation et les blocages des fichiers runtime bruts sauf raison explicite.

## Controles edge Cloudflare

Cloudflare devrait rejeter les abus courants avant que le Worker s'execute. Utilisez [Protection reseau](/fr/docs/network-protection/) pour les WAF custom rules, rate limiting, Bot Fight Mode, controles crawler IA, Browser Integrity Check, managed rules, et les reglages de domaine associes. Utilisez [Controle d'acces](/fr/docs/access-control/) pour les chemins operationnels prives.

Cette separation compte :

- Cloudflare Security Events montre les decisions WAF, bot, crawler, Access, et rate-limit
- les analytics Worker montrent les evenements applicatifs qui ont atteint le runtime
- Umami ou Fathom ne doivent pas etre la source principale pour le trafic bloque a l'edge

Gardez la blocklist Worker comme fallback, pas comme premiere ligne de defense contre les abus a fort volume. Les recommandations canoniques pour WAF, crawlers IA, Rules, Network, DNS, SSL/TLS, Security, Caching, et analytics Cloudflare vivent dans [Protection reseau](/fr/docs/network-protection/).
