---
aside: false
title: "Référence Analytics"
description: "Événements analytics serveur, payloads fournisseur, modes IP et comportement du trafic bloqué dans vanityURLs."
weight: 55
aliases:
  - /docs/reference/server-side-analytics/

---

Les analytics vanityURLs s'exécutent dans le Cloudflare Worker. Elles ne demandent pas de JavaScript de tracking navigateur, de cookies ou de compte visiteur.

Le Worker envoie les analytics avec `ctx.waitUntil()`.[^wait-until] Les redirections et les pages devraient continuer à répondre même si le fournisseur analytics est lent ou indisponible.

Les limites fournisseur dépendent du compte et du produit. Vérifiez la documentation courante du fournisseur et le plan lié à l'instance avant d'activer une collecte à fort volume.

Le Worker utilise les endpoints de collecte pour les analytics runtime. Traitez les clés API de gestion, API de reporting, scripts helper et événements de collecte comme des chemins séparés avec leurs propres limites et identifiants.

Références : [documentation API Fathom](https://usefathom.com/docs/api-reference), [documentation Umami sending stats](https://umami.is/docs/api/sending-stats), et [documentation API-key Umami Cloud](https://umami.is/docs/cloud/api-key).

## Champs de configuration

Configurez les analytics avec des variables Worker dans `wrangler.toml` et des secrets Worker lorsqu'un script helper a besoin d'un jeton API.

| Champ | Portée | Rôle |
|---|---|---|
| `ANALYTICS_PROVIDER` | Variable Worker | `disabled`, `umami`, `fathom` ou `umami,fathom` |
| `UMAMI_ENDPOINT` | Variable Worker | Endpoint de collecte Umami, habituellement `https://cloud.umami.is/api/send` |
| `UMAMI_WEBSITE_ID` | Variable Worker ou secret | Identifiant de site Umami utilisé pour la collecte |
| `UMAMI_GEO_IP_MODE` | Variable Worker | Contrôle si le Worker transmet l'information IP visiteur à Umami |
| `UMAMI_BOT_MODE` | Variable Worker | Utilisez `original` pour garder les noms d'événements originaux des bots connus au lieu de les normaliser vers `bot` |
| `FATHOM_SITE_ID` | Variable Worker ou secret | Identifiant de site Fathom utilisé pour la collecte |
| `FATHOM_ENDPOINT` | Variable Worker | Endpoint de collecte Fathom, habituellement `https://cdn.usefathom.com/` |
| `FATHOM_BOT_MODE` | Variable Worker | Utilisez `original` pour garder les noms d'événements originaux des bots connus au lieu de les normaliser vers `bot` |
| `FATHOM_API_TOKEN` | Secret local | Jeton API de gestion optionnel pour les scripts helper locaux; pas nécessaire au Worker pour la collecte |

## Événements

| Événement | Moment d'envoi |
|---|---|
| `pageview` | Une page HTML statique ou d'état est servie avec succès |
| `redirect` | Un lien court résout vers une cible |
| `short-link-miss` | Une requête ressemble à un slug de lien court, mais rien ne correspond |
| `expand` | La page `/expand` demande au Worker d'inspecter un slug via `POST /_analytics/expand` |
| `bot` | Un bot connu déclenche un événement et la normalisation bot est activée |

Les probes reconnues par la blocklist runtime retournent un `404` simple avant les analytics. Les probes PHP et WordPress courantes ne devraient pas polluer les métriques de miss.

Les requêtes bloquées par Cloudflare avant le Worker n'émettent pas d'événements analytics vanityURLs. Utilisez Cloudflare Security Events et Cloudflare analytics pour le trafic bloqué par Access, WAF, rate limiting, contrôles bot, contrôles crawler, DNS ou politique TLS.

## Payload Umami

Umami reçoit les pageviews comme pageviews natives. Les redirections, misses, recherches expand et bots normalisés sont envoyés comme événements nommés avec des données structurées.

Les payloads Umami incluent :

- identifiant du site
- URL demandée
- referrer
- premier tag de langue depuis `Accept-Language`
- user agent visiteur ou user agent de remplacement pour bot
- IP visiteur selon `UMAMI_GEO_IP_MODE`

Les données d'événements non-pageview peuvent inclure :

- type d'événement
- slug
- hostname cible
- état de cycle de vie effectif
- libellé de planification
- statut de redirection
- erreur de redirection ou résultat expand, lorsque présent
- pays et colo depuis les métadonnées Cloudflare
- correlation ID
- chemin et query demandés
- famille bot, lorsque détectée

## Payload Fathom

Fathom reçoit des requêtes de collecte natives depuis le Worker. Les pageviews sont envoyées comme pageviews; les redirections, misses, recherches expand et bots sont envoyés comme événements Fathom nommés.

Les champs de requête Fathom incluent :

- identifiant du site
- origine de page
- chemin de page
- referrer
- certains paramètres query et campagne
- client ID généré pour la requête de collecte
- nom d'événement pour les événements non-pageview
- payload d'événement pour les événements non-pageview

Les payloads d'événement Fathom peuvent inclure :

- type d'événement
- slug
- hostname cible
- état de cycle de vie effectif
- libellé de planification
- statut de redirection
- erreur de redirection ou résultat expand, lorsque présent
- pays et colo depuis les métadonnées Cloudflare
- correlation ID
- chemin et query demandés

## Mode IP

`UMAMI_GEO_IP_MODE` contrôle si le Worker transmet `CF-Connecting-IP` à Umami.

| Valeur | Comportement |
|---|---|
| `full` | Transmet l'IP complète pour des rapports géo plus précis |
| `truncated` ou omis | Transmet une IP anonymisée |
| `none` | N'envoie aucune IP |

La collecte Fathom ne demande pas de transmettre `CF-Connecting-IP` depuis le Worker. Le Worker envoie les requêtes Fathom natives avec le user agent visiteur lorsque c'est prudent, et utilise un user agent générique Worker pour le trafic bot connu.

[^wait-until]: `ctx.waitUntil()` est appelé depuis `src/worker.mjs`, l'application principale vanityURLs exécutée par Cloudflare Workers.
