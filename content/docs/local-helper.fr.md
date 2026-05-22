---
aside: false
title: "Helper local"
description: "Utiliser le helper shell v8s en lecture seule pour ouvrir des redirections connues depuis votre terminal."
weight: 10
---

Le helper local est la commande terminal `v8s`. Il vous permet d'ouvrir un lien court connu directement depuis votre terminal au lieu de passer d'abord au navigateur, taper le domaine court et attendre la redirection. Pour le travail quotidien, cela rend les liens répétés plus rapides à atteindre.

Le helper est volontairement en lecture seule. Il lit un registre généré comme `build/v8s.json` ou `~/.v8s.json`, ouvre les slugs exacts qui existent déjà et refuse les cibles qui ne sont pas des URL web.

Le helper est séparé de la [CLI](/fr/docs/cli/). La CLI `lnk` modifie les fichiers source dans `custom/`, commit et pousse. Le helper `v8s` ouvre seulement les redirections existantes.

## Prérequis

- Un dépôt vanityURLs configuré disponible localement
- Node.js 20 ou plus récent
- npm
- Git
- [`jq`](https://jqlang.org/)
- Un shell compatible POSIX capable de sourcer `scripts/v8s.sh`, comme `sh`, Bash ou Zsh

Les shells avec des modèles de script différents, comme Fish ou PowerShell, peuvent quand même lancer les commandes du projet, mais ils ne peuvent pas sourcer `scripts/v8s.sh` directement sans couche de compatibilité.

## Installer le helper

Lancez la commande de setup poste depuis votre dépôt vanityURLs :

```bash
npm run local-install
```

La commande vérifie `jq`, installe le helper compatible POSIX depuis `scripts/v8s.sh` lorsque demandé, copie `scripts/lnk` vers le chemin local bin configuré, et enregistre les chemins dans `custom/v8s-local-config.json`.

## Configurer le registre

`npm run local-install` écrit les réglages du helper propres au poste dans `custom/v8s-local-config.json`. Ce fichier stocke le chemin d'installation du helper, le fichier rc du shell, le chemin du registre local, le chemin du dépôt et le chemin d'installation de `lnk`. Il est séparé de `custom/v8s-site-config.json`, qui stocke les réglages publics de l'instance utilisés par le site web et le Worker.

Le helper lit le chemin du registre local configuré, généralement `~/.v8s.json`. `npm run build` écrit `build/v8s.json` et le copie vers le registre local configuré seulement lorsque la configuration locale active le helper.

Si vous gardez le registre ailleurs, définissez `V8S_REGISTRY` avant de sourcer ou d'utiliser le helper :

```zsh
export V8S_REGISTRY=/path/to/YOUR-SHORT-DOMAIN/build/v8s.json
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.sh
```

## Utiliser le helper

Commandes utiles :

```zsh
v8s --list
v8s slug
v8s --print slug
v8s --path
```

| Commande | Comportement |
| --- | --- |
| `v8s --list` | Liste les slugs actifs `permanent` et `ephemeral` depuis le registre |
| `v8s slug` | Ouvre la cible pour la valeur exacte `slug` |
| `v8s --print slug` | Affiche la cible sans l'ouvrir |
| `v8s --path` | Affiche le chemin du registre actuellement utilisé |

## Limites

- Il ne crée pas, ne modifie pas, ne commit pas et ne pousse pas de liens
- Il ouvre seulement les slugs exacts qui existent déjà dans `build/v8s.json` ou le registre configuré
- Il ouvre seulement les liens dont l'état est `permanent` ou `ephemeral`
- Il refuse les cibles non web et ouvre seulement les URL `http://` ou `https://`
- Il valide l'entrée slug avant de chercher la cible

Utilisez `./scripts/lnk` lorsque vous voulez modifier l'instance. Utilisez `v8s` lorsque vous voulez un raccourci local rapide vers une redirection existante.
