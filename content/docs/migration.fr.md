---
title: "Guide de migration"
description: "Migrer une ancienne instance vanityURLs Pages ou .lnk vers le runtime Cloudflare Workers actuel."
---

Utilisez ce guide pour passer de l'ancien modele Cloudflare Pages `_redirects` au modele Worker actuel utilise par v8s.link.

## Ce qui a change

- `wrangler.toml` est la source de verite du deploiement
- Les fichiers statiques sont servis via le binding Worker `ASSETS`
- Le build copie `defaults/`, applique `custom/`, et genere `build/v8s.json`, `build/v8s-blocklist.json`, et `build/v8s-site-config.json`
- `custom/v8s-links.txt` est prefere quand il existe; sinon le build utilise `defaults/v8s-links.txt`
- la politique source editable est `v8s-policies.json`; `build/v8s-blocklist.json` est une sortie runtime generee
- `/_stats` et `/_tests` sont proteges par Cloudflare Access
- Les analytics serveur sont emis par le Worker
- Les probes et destinations risquees sont bloquees par la politique runtime generee

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
|---|---|
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
6. Visitez `/_stats` dans une fenetre privee et confirmez Cloudflare Access
7. Visitez `/file.php` et confirmez que les probes sont bloquees ou retournent un 404 simple
8. Confirmez que Umami ou Fathom recoit les evenements si les analytics sont configures
