---
title: "Analytics serveur"
description: "Configurer des analytics serveur pour redirections, misses, bots, previews expand et pageviews vanityURLs."
---

vanityURLs enregistre les analytics depuis le Worker, pas depuis du JavaScript navigateur. Les redirections peuvent etre mesurees meme quand le visiteur ne charge jamais de page HTML, et les pages publiques n'ont pas besoin de script de tracking client.

Les analytics sont non bloquants. Le Worker envoie les evenements avec `ctx.waitUntil()`, donc la latence des redirections ne depend pas de la disponibilite de Umami, Fathom, ou autre fournisseur.

## Fournisseurs

Definissez un ou plusieurs fournisseurs avec `ANALYTICS_PROVIDER` :

```toml
[vars]
ANALYTICS_PROVIDER = "umami"
UMAMI_ENDPOINT = "https://cloud.umami.is/api/send"
UMAMI_WEBSITE_ID = "<umami website id>"
UMAMI_GEO_IP_MODE = "truncated"
```

```toml
[vars]
ANALYTICS_PROVIDER = "fathom"
FATHOM_SITE_ID = "<fathom site id>"
FATHOM_ENDPOINT = "https://cdn.usefathom.com/"
```

Pendant une migration, envoyez aux deux :

```toml
[vars]
ANALYTICS_PROVIDER = "umami,fathom"
```

Utilisez des secrets pour les cles API necessaires seulement aux scripts locaux. Le Worker n'a pas besoin de la cle API de gestion Fathom pour la collecte.

## Evenements

| Evenement | Moment d'envoi |
|---|---|
| `pageview` | Une page HTML statique ou d'etat est servie |
| `redirect` | Un lien court resout vers une cible |
| `short-link-miss` | Une requete ressemble a un slug mais rien ne correspond |
| `expand` | La page `/expand` demande au Worker d'inspecter un slug |
| `bot` | Un bot connu declenche un evenement et la normalisation bot est active |

Les probes reconnues par la blocklist runtime retournent un `404` simple avant analytics. Cela garde les chemins PHP et WordPress hors des metriques de miss.

Les requetes bloquees par Cloudflare avant le Worker n'emettent pas d'evenements analytics vanityURLs. Consultez WAF, rate limiting, Access, bot, et les decisions crawler IA dans Cloudflare Security Events ou le dashboard Cloudflare pertinent.

## Modele Umami

Umami recoit des proprietes comme :

- slug
- hostname cible
- etat effectif
- libelle de planification
- statut de redirection
- pays et colo depuis Cloudflare
- correlation ID
- chemin et query demandes
- famille bot, si detectee

Umami est le meilleur choix si vous voulez des proprietes structurees dans l'interface analytics, car le Worker envoie les metadonnees de redirection, miss, expand, et bot comme donnees d'evenement.

## Modele Fathom

Fathom recoit des requetes de collecte natives depuis le Worker. Les pageviews sont envoyees comme pageviews; les redirects, misses, expands, et evenements bot sont envoyes comme evenements Fathom nommes.

Les champs de requete Fathom incluent :

- site ID
- origine de page
- chemin de page
- referrer
- certains parametres query et campagne
- client ID genere pour la requete de collecte
- nom d'evenement pour les evenements non-pageview
- payload d'evenement pour les evenements non-pageview

Les payloads d'evenement Fathom incluent :

- type d'evenement
- slug
- hostname cible
- etat effectif
- libelle de planification
- statut de redirection
- erreur de redirection ou resultat expand, si present
- pays et colo depuis Cloudflare
- correlation ID
- chemin et query demandes

Utilisez Fathom si vous voulez des rapports de trafic et d'evenements simples, orientes confidentialite, sans JavaScript navigateur. Utilisez Umami si vous avez besoin de filtrage plus riche sur des proprietes custom.

## Mode IP

`UMAMI_GEO_IP_MODE` controle si le Worker transmet `CF-Connecting-IP` :

| Valeur | Comportement |
|---|---|
| `full` | Transmet l'IP complete pour de meilleurs rapports geo |
| `truncated` ou omis | Transmet une IP anonymisee |
| `none` | N'envoie aucune IP |

Pour un deploiement public oriente confidentialite, utilisez `truncated` ou `none` sauf besoin operationnel precis.

La collecte Fathom ne demande pas de transmettre `CF-Connecting-IP` depuis le Worker. Le Worker envoie les requetes Fathom natives avec le user agent visiteur quand c'est prudent, et utilise un user agent generique Worker pour le trafic bot connu.

## Verification

Avant de deployer :

```bash
npm run smoke:analytics
```

Apres deploiement :

1. Visitez `/`, `/terms`, et `/expand`; confirmez les pageviews.
2. Visitez un lien court valide; confirmez un evenement `redirect`.
3. Visitez un slug manquant realiste; confirmez `short-link-miss`.
4. Visitez `/file.php`; confirmez le blocage sans evenement miss.
5. Verifiez Workers Logs pour `umami tracking failed` ou `fathom tracking failed`.

Umami peut avoir quelques minutes de retard. Utilisez Workers Logs en premier pour diagnostiquer l'ingestion.
