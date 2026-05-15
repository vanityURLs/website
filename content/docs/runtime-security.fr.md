---
title: "Approche securite du runtime"
description: "Comment le Worker vanityURLs reste petit, deterministe et defensif a la peripherie."
---

Le runtime vanityURLs est volontairement simple. Ce n'est pas un service public de soumission de liens, pas une application avec base de donnees, et pas un framework web generaliste. C'est un moteur de redirection construit depuis Git : valider le registre, deployer les assets statiques, lire `v8s.json`, puis retourner un petit nombre de resultats possibles.

La simplicite fait partie du modele de securite. Le Worker a moins de pieces mobiles qu'un raccourcisseur classique : pas d'API d'ecriture publique, pas de comptes visiteurs, pas de cookies, pas d'analytics cote client, pas de couche de requete base de donnees, et pas de serveur d'origine derriere Cloudflare.

## Runtime defensif

Le Worker garde un chemin runtime etroit :

- seules les requetes publiques `GET`, `HEAD`, et `OPTIONS` silencieuses sont acceptees, plus le beacon dedie `POST /_analytics/expand`
- l'acces direct a `v8s.json`, `redirect-targets.json`, et `v8s-blocklist.json` retourne 404
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

Le registre genere est traite comme des donnees, pas comme du code executable. Les changements propres a l'instance vivent dans `custom/`; les defaults produit restent dans `defaults/`. Cela garde les mises a jour revues et rend le rollback normal dans Git.

## Controles edge Cloudflare

Cloudflare devrait rejeter les abus courants avant que le Worker s'execute. Utilisez WAF custom rules, rate limiting, Bot Fight Mode, controles crawler IA, Browser Integrity Check, managed rules, et Access comme couche externe.

Cette separation compte :

- Cloudflare Security Events montre les decisions WAF, bot, crawler, Access, et rate-limit
- les analytics Worker montrent les evenements applicatifs qui ont atteint le runtime
- Umami ou Fathom ne doivent pas etre la source principale pour le trafic bloque a l'edge

## Notes de saisie des regles WAF

Le rule builder visuel de Cloudflare peut etre difficile pour les expressions imbriquees. Pour les regles WAF vanityURLs, utilisez l'editeur d'expression pour la regle finale, collez une expression complete a la fois, validez-la, sauvegardez la regle desactivee si vous la calibrez encore, puis activez-la apres verification dans Security Events.

Bonnes premieres regles :

- bloquer les probes scanner comme `.php`, `/wp-`, `/.env`, chemins admin, et probes de frameworks
- bloquer les methodes inattendues sur le hostname public de redirection
- managed-challenge pour les clients suspects en excluant `/_stats`, `/_tests`, assets statiques, `robots.txt`, et bots verifies
- bloquer les crawlers IA indesires tout en autorisant `/robots.txt`
- rate-limit les candidats liens courts et misses repetes

Gardez la blocklist Worker comme fallback, pas comme premiere ligne de defense contre les abus a fort volume.
