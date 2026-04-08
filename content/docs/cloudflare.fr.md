---
title: "Cloudflare Pages"
description: "Configuration de Cloudflare Pages pour vanityURLs — hooks de déploiement, aperçus de branches, variables d'environnement et limites du plan."
nav_order: 10
translationKey: "cloudflare-pages"
---

vanityURLs est conçu pour fonctionner sur [Cloudflare Pages](https://pages.cloudflare.com/). Le plan gratuit couvre tout ce dont la plupart des déploiements personnels et des petites équipes ont besoin.

## Configuration du build

Lors de la connexion de votre dépôt dans le tableau de bord Cloudflare :

| Paramètre | Valeur |
|-----------|--------|
| Préréglage de framework | *(laisser vide)* |
| Commande de build | `cat static.lnk dynamic.lnk > build/_redirects` |
| Répertoire de sortie du build | `/build` |
| Répertoire racine | `/` |

## Domaine personnalisé

1. Dans votre projet Pages, allez à **Custom domains** → **Set up a custom domain**
2. Entrez votre domaine court (ex. `mon-domaine.link`)
3. Si votre domaine est sur Cloudflare DNS, les enregistrements nécessaires sont créés automatiquement

{{< callout type="tip" >}}
Si votre domaine est enregistré ailleurs, ajoutez un enregistrement `CNAME` pointant vers l'URL de votre projet Pages (`votre-projet.pages.dev`) et définissez son statut proxy sur **Proxied** (nuage orange).
{{< /callout >}}

## Hooks de déploiement

Pour déclencher un rebuild sans git push — depuis un cron job, un script ou un service externe :

1. Allez à **Settings** → **Builds & deployments** → **Deploy hooks**
2. Créez un hook et copiez l'URL
3. Déclenchez-le avec :

```bash
curl -X POST "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/VOTRE_HOOK_ID"
```

## Déploiements de prévisualisation de branches

Chaque push vers une branche non-`main` obtient automatiquement sa propre URL de prévisualisation :

```
https://NOM-BRANCHE.VOTRE-PROJET.pages.dev
```

Utilisez les aperçus de branches pour tester les modifications de redirections avant de fusionner vers `main`.

## Variables d'environnement

Ajoutez-les sous **Settings** → **Environment variables**. Elles sont disponibles dans le shell de build mais ne sont jamais incluses dans les fichiers servis.

Pour vanityURLs, vous n'avez généralement pas besoin de variables d'environnement — la commande de build est un simple `cat`.

## Limites du plan

| Ressource | Gratuit | Pro |
|-----------|---------|-----|
| Builds par mois | 500 | 5 000 |
| Règles de redirection | 2 000 | 100 000 |
| Domaines personnalisés | 1 | 10 |
| Bande passante | Illimitée | Illimitée |

## Documentation Cloudflare

- [Configuration du build](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Domaines personnalisés](https://developers.cloudflare.com/pages/platform/custom-domains/)
- [Hooks de déploiement](https://developers.cloudflare.com/pages/platform/deploy-hooks/)
