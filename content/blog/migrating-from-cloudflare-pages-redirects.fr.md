---
title: "Migrer des redirections Cloudflare Pages vers vanityURLs Workers"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Migrer une ancienne instance vanityURLs de Cloudflare Pages _redirects vers le runtime Cloudflare Workers actuel sans perdre l'inventaire de liens."
tags: ["migration", "cloudflare", "workers"]
featured: false
aliases:
  - /fr/docs/migration/
---

Les premières instances vanityURLs étaient volontairement simples : un domaine, un fichier `_redirects` et Cloudflare Pages. C'était un bon point de départ. Les liens courts restaient faciles à garder dans Git, faciles à relire et faciles à déployer.

Le runtime actuel garde le même esprit, mais déplace la décision de redirection dans un Cloudflare Worker. Ce changement donne à l'instance une base plus robuste : pages opérationnelles protégées, politique générée, pages publiques localisées, analytics côté serveur, protection contre les probes et séparation plus claire entre les defaults du produit et les fichiers propres à l'instance.

Cette migration ne reinvente pas votre domaine court. Elle déplace proprement une liste de redirections statique vers un registre Worker génère, tout en preservant les liens que les utilisateurs utilisent déjà.

## Ce qui a changé

- `wrangler.toml` est la source de vérité du déploiement
- Les fichiers statiques sont servis via le binding Worker `ASSETS`
- Le build copie `defaults/`, applique `custom/`, et génère `build/v8s.json`, `build/v8s-blocklist.json`, et `build/v8s-site-config.json`
- `custom/v8s-links.txt` est préfère quand il existe; sinon le build utilise `defaults/v8s-links.txt`
- la politique source éditable est `v8s-policies.json`; `build/v8s-blocklist.json` est une sortie runtime générée
- `/_stats` et `/_tests` sont protégés par [Cloudflare Access](/fr/docs/customize/access-control/)
- les analytics serveur sont émis par le Worker
- les probes et destinations risquées sont bloquées par la politique runtime générée

## Convertir les anciens fichiers .lnk

Les anciennes lignes ressemblaient a ceci :

```text
/github https://github.com/vanityURLs 302 "GitHub"
/docs/* https://docs.example.com/:splat 302 "Docs passthrough"
```

Le nouveau format est :

```text
slug|target|state|title|description|tags|owner|expires_at|notes
```

Lancez le convertisseur :

```bash
npm run convert:lnk -- .lnk custom/v8s-links.txt --owner v8s --force
```

Les codes HTTP deviennent des états :

| Ancien statut       | Nouvel état            |
| ------------------- | ---------------------- |
| `301`, `308`        | `permanent`            |
| `302`, `303`, `307` | `ephemeral`            |
| omis                | `ephemeral` par défaut |

Utilisez `--default-state permanent` si les statuts omis doivent devenir permanents.

## Verifier après migration

1. Lancez `npm run check`
2. Visitez `/`
3. Visitez un lien court valide et confirmez la redirection
4. Visitez un slug manquant et confirmez le 404 localisé
5. Visitez `/expand/`
6. Visitez `/_stats` dans une fenêtre privée et confirmez la connexion Cloudflare Access avec [Access control](/fr/docs/customize/access-control/) comme configuration attendue
7. Visitez `/file.php` et confirmez que les probes sont bloquées ou retournent un 404 simple
8. Confirmez que Umami ou Fathom recoit les événements si les analytics sont configures

## Garder une petite migration

La migration la plus sure change une couche à la fois. Convertissez la source des liens, lancez le build, confirmez le registre génère, déployéz le Worker, puis ajustez la marque, les analytics, les pages légales ou les contrôles réseau.

Cet ordre garde la promesse importante : les liens courts existants doivent continuer a fonctionner pendant que le runtime sous-jacent devient plus facile a maintenir.
