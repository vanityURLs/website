---
title: "Validation et CI"
description: "Les controles locaux et continus qui gardent une instance v8s deployable et sure."
---

Lancez la validation avant chaque deploiement. v8s est concu pour que les erreurs de liens, les cibles dangereuses, les assets generes perimes, et les regressions Worker echouent avant qu'une nouvelle version arrive sur Cloudflare.

## Commandes locales

Utilisez le controle combine pour le travail normal :

```bash
npm run check
```

Il construit le runtime, lance le lint, et execute les tests Worker. Pour un travail cible, utilisez :

```bash
npm run lint
npm test
npm run build
npm run smoke:analytics
```

Lancez `npm run clean` avant une release ou avant de comparer la sortie generee. Cela retire le cruft de build pour que le depot montre seulement les changements source intentionnels.

## Ce que la validation detecte

Les controles verifient que :

- les lignes `v8s-links.txt` ont la forme attendue
- les URL cibles se normalisent de facon sure
- les protocoles non supportes, URL avec identifiants, localhost, IP privees, et destinations bloquees sont rejetes
- les alias splat ne masquent pas des chemins parents dangereux
- les planifications sont valides et attachees seulement aux liens exacts
- les assets runtime generes utilisent le schema `2.2`
- les assets d'implementation prives restent inaccessibles
- les chemins operationnels proteges comme `/_stats` et `/_tests` ne sont pas traites comme du contenu public ordinaire

Les avertissements doivent etre revises. Les erreurs doivent etre corrigees plutot que contournees; un redirecteur peut abimer rapidement la reputation de son domaine si de mauvaises cibles passent.

## Attentes CI

Un depot connecte a GitHub ou Cloudflare devrait lancer :

```bash
npm run check
```

avant le deploiement. Gardez les identifiants de deploiement hors du depot et configurez-les comme secrets GitHub ou Cloudflare. Le Worker genere peut fonctionner sans cles API de gestion analytics; ces cles appartiennent seulement aux helpers locaux quand elles sont necessaires.

Si la CI met a jour les donnees de blocklist generees, relisez le diff du feed avant release. Les sources generees par defaut viennent de feeds open source reputes, mais tout feed peut ajouter des faux positifs ou changer de format.

## Smoke checks operationnels

Avant de promouvoir un changement en production :

- confirmez qu'un lien court actif connu retourne la redirection attendue
- confirmez qu'un slug cache ou absent retourne 404
- confirmez qu'une cible bloquee echoue la validation
- confirmez que `/_stats` et `/_tests` sont proteges par Cloudflare Access
- confirmez que les analytics serveur recoivent un evenement test si les analytics sont actives
- confirmez que WAF et controles bot bloquent le trafic scanner banal avant qu'il atteigne le Worker

Pour les instances existantes, utilisez le workflow de mise a jour pour rafraichir `defaults/` et `scripts/` tout en preservant `custom/`, `wrangler.toml`, les secrets, et la sortie generee.
