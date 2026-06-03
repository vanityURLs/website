---
aside: false
title: "Analytics"
description: "Configurer des analytics serveur pour redirections, misses, bots, previews expand et pageviews vanityURLs."
aliases:
  - /docs/analytics/
  - /docs/server-side-analytics/
  - /fr/docs/server-side-analytics/
weight: 10
---

Utilisez les analytics serveur lorsque vous voulez mesurer les redirections et les pages sans ajouter de JavaScript de tracking dans le navigateur. vanityURLs envoie les événements depuis le Worker avec `ctx.waitUntil()`, donc une panne fournisseur ne devrait pas ralentir les redirections.

Pour le choix du fournisseur et les compromis de confidentialité, lisez [Choisir des analytics respectueux de la vie privée pour les liens courts](/fr/blog/choosing-privacy-friendly-analytics-for-short-links/). Pour les noms d'événements, payloads fournisseur, traitement IP et comportement du trafic bloqué, lisez la [référence Analytics](/fr/docs/reference/analytics/).

{{% steps %}}

### Décider si les analytics sont nécessaires

Laissez les analytics désactivées pendant la première installation sauf si vous savez déjà à quelle question les rapports doivent répondre. Un redirecteur fonctionnel sans analytics est un choix de production valide.

Activez les analytics lorsque vous devez mesurer des liens de campagne, codes QR imprimés, lancements, anciens liens, recherches expand ou misses réalistes.

### Choisir un fournisseur

Définissez `ANALYTICS_PROVIDER` dans `wrangler.toml`.

| Valeur         | Utilisation                                                       |
| -------------- | ----------------------------------------------------------------- |
| `disabled`     | Vous ne voulez pas que vanityURLs envoie des événements analytics |
| `umami`        | Vous voulez des propriétés d'événements structurées dans Umami    |
| `fathom`       | Vous voulez des pageviews et événements nommés Fathom             |
| `umami,fathom` | Vous migrez de fournisseur ou comparez temporairement les deux    |

{{< callout type="warning" title="Gardez la collecte double temporaire" >}}
Ne gardez pas une collecte double plus longtemps que nécessaire; elle double le trafic de collecte.
{{< /callout >}}

### Configurer la solution analytics

Configurez Umami ou Fathom dans `wrangler.toml`.

Pour Umami, configurez le fournisseur, l'endpoint, l'identifiant du site et le mode IP :

```toml
[vars]
ANALYTICS_PROVIDER = "umami"
UMAMI_ENDPOINT = "https://cloud.umami.is/api/send"
UMAMI_WEBSITE_ID = "<umami website id>"
UMAMI_GEO_IP_MODE = "truncated"
```

{{< callout type="tip" title="Préférez moins de détail de localisation" >}}
Pour un déploiement public orienté confidentialité, utilisez `truncated` ou `none` pour `UMAMI_GEO_IP_MODE` sauf besoin opérationnel précis pour une géolocalisation complète.
{{< /callout >}}

OU

Pour Fathom, configurez le fournisseur, l'identifiant de site et l'endpoint de collecte :

```toml
[vars]
ANALYTICS_PROVIDER = "fathom"
FATHOM_SITE_ID = "<fathom site id>"
FATHOM_ENDPOINT = "https://cdn.usefathom.com/"
```

Le Worker n'a pas besoin de la clé API de gestion Fathom pour la collecte. Utilisez des secrets seulement pour les clés API nécessaires aux scripts locaux.

### Garder la protection edge devant

Les requêtes bloquées par Cloudflare avant le Worker n'émettent pas d'événements analytics vanityURLs. Consultez les décisions WAF, rate limiting, bot et crawler IA avec [Protection réseau](/fr/docs/customize/network-protection/), et les décisions Access avec [Contrôle d'accès](/fr/docs/customize/access-control/).

Traitez les contrôles réseau Cloudflare et la blocklist runtime comme une protection de quota analytics, pas seulement comme des fonctions de sécurité.

### Vérifier localement

Avant de déployer, lancez :

```bash
npm run smoke:analytics
```

Le smoke test bâtit l'instance et intercepte les appels analytics localement. Il vérifie le chemin d'événement sans envoyér de données au fournisseur.

### Vérifier après déploiement

1. Visitez `https://v8s.link/expand` et confirmez les pageviews dans le dashboard analytics
2. Visitez un lien court valide; confirmez un événement `redirect`
3. Visitez un slug manquant réaliste; confirmez un événement `short-link-miss`
4. Visitez `/file.php`; confirmez le blocage sans événement miss
5. Vérifiez Workers Logs pour umami ou fathom tracking failed

Les dashboards fournisseur peuvent avoir du retard. Utilisez Workers Logs en premier pour diagnostiquer l'ingestion.

{{% /steps %}}
