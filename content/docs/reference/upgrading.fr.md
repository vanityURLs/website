---
aside: false
title: "Mettre a jour une instance"
description: "Garder les fichiers locaux en securite pendant le rafraichissement des defaults et scripts vanityURLs."
weight: 100
aliases:
  - /docs/upgrading/

---

Installer une instance vanityURLs est facile. La mettre a jour proprement demande un workflow reproductible, parce que le proprietaire doit garder ses liens, sa marque, sa politique et sa configuration Cloudflare tout en recevant les nouveaux defaults, scripts, correctifs et durcissements securite.

Si vous migrez une ancienne instance Cloudflare Pages `_redirects` vers le runtime Worker actuel, utilisez [Migrer des redirections Cloudflare Pages vers vanityURLs Workers](/fr/blog/migrating-from-cloudflare-pages-redirects/).

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

Si `npm run check` echoue, l'upgrade peut deja avoir rafraichi `defaults/` et `scripts/` avant de s'arreter. Lancez `git status --short` et inspectez l'erreur avant de reessayer. Si l'echec est cause par un bogue corrige depuis upstream, relancez `npm run upgrade` apres avoir confirme que la nouvelle release ou le nouveau commit est disponible sur GitHub. Par exemple, vanityURLs 2.7.1 a corrige la compatibilite des anciens mots-cles de scanner pour les destinations PHP de confiance.

Puis revisez et commitez :

```bash
git status --short
git diff
git add defaults scripts
git commit -m "chore: upgrade vanityurls runtime"
git push
```

## Fichiers locaux proteges

L'outil d'upgrade refuse de remplacer :

- `custom/`
- `wrangler.toml`
- `.dev.vars`
- secrets Cloudflare
- sortie generee `build/`

Cela garde les liens locaux, pages legales, politique de confidentialite, politique source, marque, reglages Access, IDs analytics, chemins locaux et forme de deploiement sous controle du proprietaire de l'instance.
