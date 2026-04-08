---
title: "Configuration"
description: "Le vanityURLs.conf annoté du déploiement de référence v8s.link — chaque variable expliquée."
nav_order: 32
translationKey: "demo-configuration"
---

Le fichier `vanityURLs.conf` est la source de vérité pour votre environnement local. Il est lu par le `Makefile` et le script `lnk`. Voici le fichier complet de v8s.link, avec chaque variable expliquée.

## Le fichier complet

```bash
SCRIPT_DIR=~/.config/bin
REPO_DIR="/Volumes/Tarmac/codePublic/vanityURLs/v8s.link"   # ← à modifier
MY_DOMAIN="v8s.link"
MY_PAGE="v8s-link.pages.dev"
SHORTCODE_LENGTH=3
#DRY_RUN=true
```

## Référence des variables

### `SCRIPT_DIR`

Où les scripts `lnk` et `validateURL` seront installés lors de `make setup`. Ce répertoire **doit être dans votre `$PATH`**.

```bash
SCRIPT_DIR=~/.config/bin        # recommandé
SCRIPT_DIR=/usr/local/bin       # système (nécessite sudo)
```

{{< callout type="tip" >}}
Ajoutez à votre `~/.zshrc` ou `~/.bashrc` : `export PATH="$HOME/.config/bin:$PATH"`
{{< /callout >}}

### `REPO_DIR`

Le **chemin absolu** vers votre clone local de ce dépôt. La valeur de v8s.link (`/Volumes/Tarmac/...`) est spécifique à la machine du mainteneur. **Vous devez la changer.**

```bash
REPO_DIR=~/repos/mon-domaine.link
REPO_DIR=~/projets/v8s.link
```

{{< callout type="warning" >}}
Si vous utilisez le chemin v8s.link sans le modifier, toutes les commandes `lnk` échoueront avec "No such file or directory".
{{< /callout >}}

### `MY_DOMAIN` et `MY_PAGE`

```bash
MY_DOMAIN="v8s.link"             # votre domaine court
MY_PAGE="v8s-link.pages.dev"     # URL de votre projet Pages (pas votre domaine)
```

`MY_PAGE` se trouve dans le tableau de bord Cloudflare → Pages → votre projet.

### `SHORTCODE_LENGTH`

Contrôle la longueur des codes courts générés automatiquement.

```bash
SHORTCODE_LENGTH=3    # /x7q, /mK2 (50 000+ combinaisons)
SHORTCODE_LENGTH=4    # /x7qM, /mK2p (2,8M+ combinaisons)
```

### `DRY_RUN`

Quand décommenté, les commandes `lnk` affichent ce qu'elles feraient sans modifier aucun fichier.

```bash
#DRY_RUN=true     # commenté → écritures réelles (défaut)
DRY_RUN=true      # décommenté → aperçu uniquement
```

## Séquence de configuration

{{% steps %}}

### Cloner le modèle

```bash
git clone git@github.com:votrenom/mon-domaine.link.git
cd mon-domaine.link
```

### Modifier vanityURLs.conf

```bash
make config   # ouvre dans $EDITOR
```

### Lancer la configuration

```bash
make setup
```

### Vérifier que lnk est accessible

```bash
which lnk && lnk --help
```

{{% /steps %}}
