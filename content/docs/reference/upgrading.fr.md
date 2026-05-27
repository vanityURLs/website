---
aside: false
title: "Mettre à jour une instance"
description: "Rafraîchir les fichiers produit vanityURLs avec npm run upgrade tout en préservant la configuration propre à l'instance."
weight: 80
aliases:
  - /docs/upgrading/

---

Utilisez `npm run upgrade` pour rafraîchir une instance vanityURLs existante. La commande met à jour les fichiers détenus par le produit et laisse vos fichiers propres à l'instance tranquilles.

Lancez-la depuis un worktree propre :

```bash
npm run upgrade
```

La commande récupère la source upstream configurée, rafraîchit les fichiers produit comme `defaults/` et `scripts/`, lance les vérifications du projet et laisse un diff Git normal à réviser.

## Ce qui reste à vous

Le workflow d'upgrade ne remplace pas :

- `custom/`
- `wrangler.toml`
- `.dev.vars`
- secrets Cloudflare
- sortie générée `build/`

Vos liens, votre marque, vos politiques, vos pages légales, votre configuration Access, vos réglages analytics et votre forme de déploiement restent donc sous votre contrôle.

## Réviser et publier

Quand la commande se termine :

```bash
git status --short
git diff
npm run check
git add defaults scripts
git commit -m "chore: upgrade vanityurls runtime"
git push
```

Si la commande s'arrête, lisez l'erreur et inspectez `git status --short` avant de réessayer. Si vous migrez une ancienne instance Cloudflare Pages `_redirects` vers le runtime Worker, lisez d'abord [Migrer des redirections Cloudflare Pages vers vanityURLs Workers](/fr/blog/migrating-from-cloudflare-pages-redirects/).
