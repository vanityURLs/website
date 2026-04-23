---
title: "Installation"
description: "Configurez vanityURLs sur votre propre domaine en quatre étapes avec GitHub et Cloudflare Pages."
nav_order: 1
---

vanityURLs fonctionne entièrement sur l'infrastructure que vous contrôlez déjà — un dépôt GitHub, un nom de domaine, et un compte Cloudflare gratuit. Il n'y a rien à installer sur votre machine en dehors du script CLI optionnel.

## Mise en place rapide

{{% steps %}}

### Créer un dépôt depuis le modèle

Depuis le [dépôt GitHub vanityURLs](https://github.com/vanityURLs/vanityURLs), cliquez sur **Use this template** → **Create a new repository**.

Choisissez un nom qui reflète votre domaine court (p. ex. `mon-domaine.link`). Sélectionnez **Privé** — votre liste de redirections peut contenir des URL internes.

### Créer votre compte Cloudflare

Si vous n'en avez pas encore, suivez le [guide de création de compte Cloudflare](https://developers.cloudflare.com/fundamentals/setup/account/create-account/). Le plan gratuit est suffisant.

### Acheter votre domaine internet

Connectez-vous à Cloudflare et enregistrez un domaine court via **Domaines** → **Enregistrer**. Tapez le nom souhaité, recherchez et finalisez l'achat. Activez le **Renouvellement automatique** avant de quitter.

### Créer le site Cloudflare Pages

1. Dans le tableau de bord Cloudflare, cliquez sur **Ajouter un site Pages** et connectez votre dépôt GitHub.
2. Configurez la compilation :

{{< code file="Paramètres de compilation Cloudflare Pages" >}}
Framework preset:      (laisser vide)
Build command:         cat static.lnk dynamic.lnk > build/_redirects
Build output directory: /build
{{< /code >}}

3. Configurez un [domaine personnalisé](https://developers.cloudflare.com/pages/platform/custom-domains/) pour le projet Pages pointant vers votre domaine.

{{< callout type="warning" >}}
Le premier build échouera — c'est normal. Vous devez encore générer `static.lnk`, `dynamic.lnk` et `build/_headers` à l'étape suivante.
{{< /callout >}}

{{% /steps %}}

## Configuration locale

{{% steps %}}

### Configurer vanityURLs.conf

Éditez `vanityURLs.conf` à la racine de votre dépôt (ou lancez `make config` si vous préférez `vi`) :

```bash
SCRIPT_DIR=/usr/local/bin         # chemin où le script lnk sera installé
REPO_DIR=~/repos/mon-domaine.link # chemin vers votre clone local du dépôt
MY_DOMAIN=mon-domaine.link        # votre domaine court
MY_PAGE=mon-projet.pages.dev      # URL de votre projet Cloudflare Pages
```

### Lancer la configuration initiale

```bash
make setup
```

Cela génère :
- `build/_headers` — en-têtes de sécurité basés sur votre domaine et votre URL Pages
- `static.lnk` — votre liste de redirections statiques (redirige `/` vers votre site principal)
- `dynamic.lnk` — votre liste de redirections dynamiques (initialement vide)

### Ajouter vos premières redirections

Éditez `static.lnk` avec votre éditeur de texte préféré, ou utilisez le script `lnk` :

```bash
lnk add /github https://github.com/votrenom
lnk add /linkedin https://linkedin.com/in/votrenom
```

### Committer et pousser

```bash
git add -A && git commit -m "ajout des redirections initiales" && git push
```

Cloudflare détecte le push et déploie en ~15 secondes. Vos liens sont actifs.

{{% /steps %}}

## Vérification

Ouvrez `https://votre-domaine/github` dans un navigateur — vous devriez être redirigé vers votre profil GitHub.
