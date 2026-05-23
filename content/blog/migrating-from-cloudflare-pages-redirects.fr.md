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

Les premieres instances vanityURLs etaient volontairement simples : un domaine, un fichier `_redirects` et Cloudflare Pages. C'etait un bon point de depart. Les liens courts restaient faciles a garder dans Git, faciles a relire et faciles a deployer.

Le runtime actuel garde le meme esprit, mais deplace la decision de redirection dans un Cloudflare Worker. Ce changement donne a l'instance une base plus robuste : pages operationnelles protegees, politique generee, pages publiques localisees, analytics cote serveur, protection contre les probes et separation plus claire entre les defaults du produit et les fichiers propres a l'instance.

Cette migration ne reinvente pas votre domaine court. Elle deplace proprement une liste de redirections statique vers un registre Worker genere, tout en preservant les liens que les utilisateurs utilisent deja.

## Ce qui a change

- `wrangler.toml` est la source de verite du deploiement
- Les fichiers statiques sont servis via le binding Worker `ASSETS`
- Le build copie `defaults/`, applique `custom/`, et genere `build/v8s.json`, `build/v8s-blocklist.json`, et `build/v8s-site-config.json`
- `custom/v8s-links.txt` est prefere quand il existe; sinon le build utilise `defaults/v8s-links.txt`
- la politique source editable est `v8s-policies.json`; `build/v8s-blocklist.json` est une sortie runtime generee
- `/_stats` et `/_tests` sont proteges par [Cloudflare Access](/fr/docs/access-control/)
- les analytics serveur sont emis par le Worker
- les probes et destinations risquees sont bloquees par la politique runtime generee

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

Les codes HTTP deviennent des etats :

| Ancien statut | Nouvel etat |
| --- | --- |
| `301`, `308` | `permanent` |
| `302`, `303`, `307` | `ephemeral` |
| omis | `ephemeral` par defaut |

Utilisez `--default-state permanent` si les statuts omis doivent devenir permanents.

## Verifier apres migration

1. Lancez `npm run check`
2. Visitez `/`
3. Visitez un lien court valide et confirmez la redirection
4. Visitez un slug manquant et confirmez le 404 localise
5. Visitez `/expand/`
6. Visitez `/_stats` dans une fenetre privee et confirmez la connexion Cloudflare Access avec [Access control](/fr/docs/access-control/) comme configuration attendue
7. Visitez `/file.php` et confirmez que les probes sont bloquees ou retournent un 404 simple
8. Confirmez que Umami ou Fathom recoit les evenements si les analytics sont configures

## Garder une petite migration

La migration la plus sure change une couche a la fois. Convertissez la source des liens, lancez le build, confirmez le registre genere, deployez le Worker, puis ajustez la marque, les analytics, les pages legales ou les controles reseau.

Cet ordre garde la promesse importante : les liens courts existants doivent continuer a fonctionner pendant que le runtime sous-jacent devient plus facile a maintenir.
