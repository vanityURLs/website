---
aside: false
title: "Hébergement et déploiement"
description: "Comment vanityURLs.link est hébergé, déployé et opéré sur Workers Static Assets avec Cloudflare Workers."
weight: 30
---

Le site de documentation fonctionne sur Workers Static Assets avec Cloudflare Workers. Ce n'est pas un projet Cloudflare Pages. Un Worker sert le site statique généré par Hugo et gère les analytics côté serveur pour les pages HTML.

## Architecture

{{< mermaid >}}
flowchart LR
  A[Branche main<br/>GitHub]
  B[Intégration GitHub<br/>Cloudflare]
  C[build.sh]
  D[Build Hugo<br/>et index Pagefind]
  E[wrangler deploy]
  F[Worker<br/>vanityurls-website]
  G[Binding Static Assets<br/>./public]
  H[Domaine custom<br/>vanityurls.link]

  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
  F --> G
  F --> H
{{< /mermaid >}}

Le Worker est configuré pour que les requêtes HTML passent par `src/worker.mjs`; tout le reste est du trafic d'assets statiques peu coûteux, comme CSS, fontes, bundles JavaScript, images, fichiers Pagefind et sitemaps, qui évite le code Worker.

## Fichiers importants pour l'hébergement

| Fichier | Rôle |
| ------- | ---- |
| `wrangler.toml` | Worker, assets, commande de build, observabilité, compatibility date et configuration de déploiement |
| `build.sh` | Script de build Cloudflare qui épingle et vérifie les outils avant Hugo et Pagefind |
| `src/worker.mjs` | Code Worker runtime pour les requêtes HTML et l'envoi analytics |
| `src/worker.test.mjs` | Suite de tests Worker |
| `public/` | Sortie de build Hugo servie comme assets statiques; régénérée et non commitée |
| `static/_headers` | En-têtes de réponse copiés dans le site généré |
| `static/_redirects` | Règles de redirection copiées dans le site généré |

`static/_redirects` n'est pas la seule source de redirections. Hugo peut aussi générer des redirections à partir des `aliases` dans le front matter du contenu, ce qui est utile lorsqu'une page est déplacée mais doit conserver une ancienne URL publique.

{{< callout type="warning" title="wrangler.toml est la source de vérité" >}}
Ne dupliquez pas les réglages de build ou de déploiement dans le tableau de bord Cloudflare sauf si le réglage ne peut pas vivre dans Git, comme les secrets chiffrés.
{{< /callout >}}

## Setup Cloudflare

Pour recréer le projet de production :

1. Ouvrez **Workers & Pages** > **Create application**
2. Choisissez **Connect to Git**
3. Sélectionnez `vanityURLs/website`
4. Confirmez que le nom de projet correspond à `wrangler.toml`
5. Laissez les réglages de build contrôlés par le dépôt
6. Désélectionnez les builds pour les branches non production sauf si vous voulez déployer chaque branche

Les variables et secrets runtime appartiennent à **Settings** > **Variables and Secrets**, pas à **Settings** > **Build** > **Variables and secrets**.

| Valeur | Emplacement |
| ------ | ----------- |
| `UMAMI_WEBSITE_ID` | Secret runtime dans Cloudflare |
| `UMAMI_ENDPOINT` | Valeur simple `[vars]` dans `wrangler.toml` |

## Flux de déploiement

Le déploiement quotidien est automatique :

```bash
git push origin main
```

Cloudflare détecte le push, lance le build du dépôt, puis déploie avec Wrangler. Suivez les déploiements dans **Workers & Pages** > `vanityurls-website` > **Deployments**.

Utilisez les conseils de [style des commits](/fr/docs/web-site/local-development/#style-des-commits) avant de pousser afin que release-please produise des notes de release utiles. Si l'intégration GitHub est indisponible ou si vous devez tester volontairement un déploiement local, utilisez [Déploiement local pendant les tests](/fr/docs/web-site/local-development/#déploiement-local-pendant-les-tests).

## Rollback

Cloudflare garde les déploiements récents. Pour revenir en arrière, ouvrez le déploiement précédent et choisissez **Rollback to this deployment**. Ensuite, révertissez ou corrigez le commit Git correspondant afin que le prochain push ne redéploie pas le mauvais état.

## DNS, TLS et hôte canonique

Le site public utilise un domaine custom Workers. Cloudflare provisionne et renouvelle les certificats TLS automatiquement.

L'hôte canonique est contrôlé par le setup Worker/domaine et la configuration du site. Lors d'un changement de hostname, mettez à jour ensemble le domaine custom Cloudflare, `hugo.yml`, `wrangler.toml`, les redirections, les liens canoniques, les réglages analytics et toute configuration de statut ou monitoring public.

## Notes opérationnelles

- Gardez **Workers Logs** activé pour le débogage de production.
- Mettez `compatibility_date` à jour délibérément et testez le comportement Worker.
- Mettez la version Hugo dans `build.sh` à jour délibérément et reconstruisez localement avant déploiement.
- Gardez les variables de build vides sauf si une future étape de build en a explicitement besoin.
- Consultez le log de déploiement en premier lorsqu'un build échoue; la plupart des erreurs viennent d'un template Hugo, d'un outil manquant ou d'une référence de contenu obsolète.
