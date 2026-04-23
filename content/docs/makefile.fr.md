---
title: "Makefile"
description: "Référence des cibles du Makefile vanityURLs."
nav_order: 11
---

Le dépôt vanityURLs inclut un `Makefile` qui automatise les tâches courantes de configuration et de maintenance. Toutes les cibles lisent depuis `vanityURLs.conf`.

## Cibles disponibles

```bash
$ make help
Cibles :
  make config    — Assistant de configuration interactif
  make setup     — Configuration initiale complète : installer lnk, générer _headers, _redirects
  make headers   — Régénérer build/_headers depuis votre domaine et URL Pages
  make install   — Installer le script lnk dans SCRIPT_DIR
  make validate  — Valider la syntaxe de static.lnk et dynamic.lnk
  make deploy    — Committer tous les changements de liens et pousser vers origin
  make status    — Afficher le nombre de redirections et la date du dernier déploiement
  make clean     — Supprimer les fichiers générés
```

## Détails

### `make config`

Ouvre `vanityURLs.conf` dans votre `$EDITOR` (par défaut `vi`) :

```bash
SCRIPT_DIR=/usr/local/bin
REPO_DIR=~/repos/mon-domaine.link
MY_DOMAIN=mon-domaine.link
MY_PAGE=mon-projet.pages.dev
```

### `make setup`

Lance la séquence de configuration initiale complète :

{{% steps %}}

### Installer lnk

Copie le script `lnk` dans `SCRIPT_DIR` et le rend exécutable.

### Générer _headers

Crée `build/_headers` avec des en-têtes de sécurité adaptés à votre domaine et URL Pages.

### Créer les fichiers de liens initiaux

Crée `static.lnk` avec une redirection racine et un `dynamic.lnk` vide.

### Déploiement initial

Committe et pousse les fichiers initiaux pour déclencher le premier build Cloudflare Pages.

{{% /steps %}}

### `make status`

```
static.lnk:  12 redirections
dynamic.lnk:  3 redirections
Dernier déploiement : il y a 2 heures (commit a3f7c12)
Domaine : mon-domaine.link
Pages : mon-projet.pages.dev
```

## Exécution sans `make`

Toutes les cibles `make` sont de minces enveloppes autour des commandes `lnk`. Voir la [référence des commandes lnk](/fr/docs/commands/) pour les détails.
