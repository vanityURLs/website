---
title: "Demarrage rapide"
description: "Creer une instance vanityURLs de type v8s.link sur Cloudflare Workers avec le repertoire defaults actuel."
nav_order: 1
---

vanityURLs est un moteur de liens courts gere dans Git pour votre propre domaine. Le runtime actuel se deploie comme Worker Cloudflare avec assets statiques. Le build part de `defaults/`, applique vos fichiers `custom/`, genere `build/v8s.json`, puis publie le Worker avec Wrangler.

## Prerequis

- Un depot GitHub base sur `vanityURLs/vanityURLs`
- Un domaine court, comme le domaine public de reference `v8s.link`
- Un compte Cloudflare avec le domaine dans Cloudflare DNS
- Wrangler connecte au compte Cloudflare qui possede le Worker

## Premier deploiement

{{% steps %}}

### Cloner le depot

Creez un depot depuis le template vanityURLs, puis clonez-le localement.

```bash
git clone git@github.com:YOUR-ORG/YOUR-SHORT-DOMAIN.git
cd YOUR-SHORT-DOMAIN
npm install
```

### Garder vos changements dans custom/

Ne modifiez pas `defaults/` pour votre marque ou votre liste de liens, sauf si vous changez les defaults du produit. Les fichiers propres a votre instance vont dans `custom/`.

```text
custom/v8s-links.txt
custom/v8s-schedules.json
custom/v8s-blocklist.json
custom/public/v8s-logo.svg
custom/public/favicon.svg
```

### Ajouter les premiers liens

Creez `custom/v8s-links.txt` avec des lignes separees par des pipes :

```text
# slug|target|state|title|description|tags|owner|expires_at|notes
github|https://github.com/YOUR-ORG|permanent|GitHub|Profil organisation|source|team||
docs|https://docs.example.com|permanent|Docs|Documentation principale|docs|team||
```

Les schemas manquants sont normalises vers `https://`. Utilisez `permanent` pour les redirections 301 stables et `ephemeral` pour les redirections 302 temporaires.

### Construire et valider

```bash
npm run check
```

La commande construit le Worker, copie les assets, fusionne defaults et custom, genere `build/v8s.json`, valide le registre et verifie les politiques.

### Helper terminal optionnel

Le depot inclut un helper Zsh dans `scripts/v8s.zsh` pour ouvrir des cibles de redirection depuis le terminal. Sourcez-le depuis votre profil shell :

```zsh
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.zsh
```

Le helper lit `~/.v8s.json`, que `npm run build` cree depuis le registre genere. Remplacez le chemin si vous gardez le registre ailleurs :

```zsh
export V8S_REGISTRY=/path/to/v8s.json
```

Commandes utiles :

```zsh
v8s --list          # lister les slugs actifs
v8s docs            # ouvrir la cible de docs
v8s --print docs    # afficher la cible sans l'ouvrir
v8s --path          # afficher le chemin du registre
```

`v8s.zsh` n'ouvre pas n'importe quelle entree du terminal. Il ouvre seulement les cibles `http://` et `https://` qui existent deja comme liens `permanent` ou `ephemeral` dans le registre genere.

### Deployer avec Cloudflare Workers

Revisez `wrangler.toml`, definissez le nom du Worker, puis deployez :

```bash
npx wrangler deploy
```

Connectez votre domaine au route du Worker dans Cloudflare. Chaque futur push GitHub peut declencher le meme build et deploiement via votre CI ou integration Cloudflare.

{{% /steps %}}

## Verifier

Ouvrez la page d'accueil, un lien court connu, `/expand/`, `/404.html`, `/expired.html`, `/disabled.html`, et `/maintenance.html`. Si les vues protegees sont configurees, ouvrez `/_stats` dans une fenetre privee et confirmez que Cloudflare Access apparait avant le tableau de bord.
