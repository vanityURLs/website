---
aside: false
title: "Mettre a jour une instance"
description: "Garder les fichiers locaux en securite pendant le rafraichissement des defaults et scripts vanityURLs."
---

Installer une instance vanityURLs est facile. La mettre a jour proprement demande un workflow reproductible, parce que le proprietaire doit garder ses liens, sa marque, sa politique et sa configuration Cloudflare tout en recevant les nouveaux defaults, scripts, correctifs et durcissements securite.

La regle est simple :

- les fichiers propres a l'instance vivent dans `custom/`
- les reglages de deploiement Cloudflare vivent dans `wrangler.toml`
- la sortie generee est jetable
- les fichiers produit upstream vivent dans `defaults/` et `scripts/`
- l'entree Worker generee vit dans `src/`

## Commande d'upgrade

Lancez depuis un worktree propre :

```bash
npm run upgrade
```

`npm run update` est un alias pratique pour le meme workflow.

La commande :

1. refuse de s'executer si des changements locaux sont presents
2. lance `npm run clean` en premier
3. recupere la ref upstream configuree
4. remplace les chemins produit, actuellement `defaults/` et `scripts/`
5. lance `npm run check`
6. laisse un diff Git normal pour revue

Puis revisez et commitez :

```bash
git status --short
git diff
git add defaults scripts
git commit -m "chore: upgrade vanityurls runtime"
git push
```

## Remote upstream

Pour une instance durable, ajoutez un remote upstream qui pointe vers la source du runtime vanityURLs :

```bash
git remote add upstream https://github.com/vanityurls/v8s.git
npm run upgrade -- --remote upstream --ref main
```

Remplacez `https://github.com/vanityurls/v8s.git` par l'URL du depot Git que vous utilisez comme upstream produit pour votre propre instance. Si vous utilisez un fork ou un miroir du runtime, pointez `upstream` vers ce fork ou ce miroir.

Vous pouvez aussi utiliser une URL directement :

```bash
npm run upgrade -- --remote https://github.com/vanityurls/v8s.git --ref main
```

Pour une repetition sans changement :

```bash
npm run upgrade -- --source HEAD --dry-run
```

## Fichiers locaux proteges

L'outil d'upgrade refuse de remplacer :

- `custom/`
- `wrangler.toml`
- `.dev.vars`
- secrets Cloudflare
- sortie generee `build/`

Cela garde les liens locaux, pages legales, politique de confidentialite, politique source, marque, reglages Access, IDs analytics, chemins locaux et forme de deploiement sous controle du proprietaire de l'instance.

## Installation locale et publication

Lancez le setup local quand vous voulez le helper shell ou la commande `lnk` installee :

```bash
npm run local-install
```

La commande verifie `jq`, installe le helper neutre shell depuis `scripts/v8s.sh` si demande, copie `scripts/lnk` vers le chemin bin configure, et enregistre les chemins dans `custom/v8s-local-config.json`.

Utilisez la publication locale quand le proprietaire veut valider, stage, commit et pousser les chemins configures :

```bash
npm run local-publish
```

Le chemin par defaut est `custom`, et le message de commit par defaut est `chore: update local vanityURLs configuration`.

## Pourquoi pas Homebrew maintenant

Homebrew pourra etre utile plus tard pour une CLI autonome `v8s`. Il ne resout pas le probleme difficile aujourd'hui : rafraichir proprement une instance geree dans Git sans ecraser les fichiers locaux. Une commande locale au depot est plus facile a inspecter, tester et adapter pendant que le runtime evolue encore vite.
