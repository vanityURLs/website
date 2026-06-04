---
aside: false
type: brand
title: "Analytics du site"
description: "Comment vanityURLs.link envoie des analytics côté serveur respectueuses de la vie privée depuis le Worker du site."
weight: 40
aliases:
  - /fr/docs/web-site/analytics/
---

Le site utilise Umami pour les analytics visiteurs. Les événements sont envoyés côté serveur depuis le Worker Cloudflare plutôt qu'avec un script JavaScript dans le navigateur.

## Modèle de confidentialité

Le setup analytics du site est volontairement limité :

- aucun cookie analytics
- aucun script analytics côté navigateur
- aucun `localStorage` ou `sessionStorage` pour le tracking
- pas de fingerprinting navigateur
- pas d'adresse IP visiteur complète envoyée à Umami

Le Worker tronque les adresses IP avant de transmettre les données analytics : IPv4 en `/24` et IPv6 en `/48`. Cela garde une géographie approximative tout en retirant la précision au niveau d'un foyer.

{{< callout type="warning" title="Gardez les pages de confidentialité synchronisées" >}}
Lorsque le comportement analytics change, mettez à jour les pages de confidentialité publiques et cette documentation ensemble.
{{< /callout >}}

## Pourquoi côté serveur

| Sujet                          | Script analytics navigateur             | Analytics côté Worker                                    |
| ------------------------------ | --------------------------------------- | -------------------------------------------------------- |
| Script tiers                   | Nécessaire                              | Non nécessaire                                           |
| Cookies ou stockage navigateur | Souvent présent                         | Non utilisé                                              |
| Impact CSP                     | Demande des exceptions script et réseau | Pas d'exception analytics côté navigateur                |
| Bloqueurs de publicité         | Bloque souvent le script                | Le navigateur ne fait jamais la requête analytics        |
| Comportement des bots          | Dépend de l'exécution JavaScript        | Le Worker peut taguer les crawlers connus volontairement |

Le compromis est que le comportement analytics vit dans le code Worker et doit être testé.

## Flux de requête

{{< mermaid >}}
flowchart LR
A["Requête<br/>visiteur"] --> B{"Type de requête"}
B -->|"Requête page<br/>HTML"| C["Worker<br/>récupère HTML"]
C --> D["Réponse HTML<br/>et fichier retournés"]
C --> E["Module<br/>analytics"]
E --> F["Umami enregistre<br/>l'événement"]
B -->|"Requête asset<br/>statique"| G["Aucun événement<br/>analytics"]
{{< /mermaid >}}

Les requêtes HTML passent par `src/worker.mjs`, qui utilise `ctx.waitUntil(...)` pour envoyer les analytics sans retarder la réponse visiteur. Les requêtes d'assets statiques ne devraient pas produire d'événements analytics.

## Noms d'événements

| Événement       | Quand il apparait                                      |
| --------------- | ------------------------------------------------------ |
| Pageview simple | Requête HTML normale                                   |
| `404`           | La réponse générée a le statut 404                     |
| `bot`           | Le user-agent correspond à un pattern de crawler connu |
| `campaign`      | L'URL contient des paramètres standards `utm_*`        |

Les paramètres UTM sont retirés de l'URL de page enregistrée et déplacés dans les données d'événement afin que la vue Pages ne soit pas fragmentée par plusieurs variantes de query string.

## Configuration requise

| Variable            | Emplacement                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `UMAMI_WEBSITE_ID`  | Secret runtime Cloudflare pour le site principal                                                                    |
| `UMAMI_WEBSITE_ID2` | Secret runtime Cloudflare pour `brand.vanityurls.link`; utilise `UMAMI_WEBSITE_ID` en fallback lorsqu'il est absent |
| `UMAMI_ENDPOINT`    | `[vars]` dans `wrangler.toml`                                                                                       |

{{< callout type="warning" title="Utilisez les secrets runtime, pas les secrets de build" >}}
Cloudflare a deux écrans Variables and Secrets qui se ressemblent. Le Worker voit seulement les variables runtime dans **Settings** > **Variables and Secrets**.
{{< /callout >}}

## Débogage

Lorsque les événements disparaissent :

1. Confirmez que le dernier Worker est déployé.
2. Confirmez que `UMAMI_WEBSITE_ID` est présent comme secret runtime.
3. Confirmez que `UMAMI_WEBSITE_ID2` est présent lorsque vous déboguez `brand.vanityurls.link` comme site Umami séparé.
4. Confirmez que `UMAMI_ENDPOINT` pointe vers le bon endpoint Umami.
5. Consultez **Workers Logs** dans Cloudflare pour la requête HTML.
6. Testez depuis un navigateur qui n'est pas connecté au tableau de bord Umami.
7. Comparez les événements nommés dans l'onglet **Events** d'Umami avant de supposer que les chiffres Pages sont incorrects.

Si des logs de diagnostic sont ajoutés temporairement dans `src/worker.mjs`, retirez-les avant le nettoyage de production. Les logs peuvent exposer des détails opérationnels et ajouter du bruit à chaque requête de diagnostic.

## Changer le comportement analytics

Lorsque vous changez la gestion UTM, la détection de bots, la forme du payload ou le comportement de confidentialité :

1. Modifiez `src/worker.mjs`.
2. Ajoutez ou mettez à jour les tests dans `src/worker.test.mjs`.
3. Lancez `npm test`.
4. Lancez `npm run build`.
5. Déployez par le flux Git normal.
6. Surveillez Cloudflare Workers Logs après le déploiement.
