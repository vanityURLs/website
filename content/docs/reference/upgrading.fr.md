---
aside: false
title: "Mettre à jour une instance"
description: "Rafraîchir les fichiers produit vanityURLs avec npm run upgrade tout en préservant la configuration propre à l'instance."
weight: 120
aliases:
  - /docs/upgrading/
---

Utilisez `npm run upgrade` pour rafraîchir une instance vanityURLs existante. La commande met à jour les fichiers détenus par le produit et laisse vos fichiers propres à l'instance tranquilles.

Lancez-la depuis un worktree propre :

```bash
npm run upgrade
```

La commande récupère la source upstream configurée, rafraîchit les fichiers produit comme `defaults/` et `scripts/`, lance les vérifications du projet et laisse un diff Git normal à réviser. Si les définitions de dépendances changent pendant le rafraîchissement, l'upgrade lance `npm install` avant la validation afin que l'outillage local corresponde aux fichiers produit mis à jour.

## Source de release

Par défaut, `npm run upgrade` résout le dernier tag de release stable upstream, comme `v3.3.1`, et rafraîchit les fichiers produit depuis ce tag. Il ne devrait pas récupérer les commits non publiés de `main` sauf si vous le demandez.

Utilisez une release explicite lorsque vous voulez épingler une mise à jour :

```bash
npm run upgrade -- --ref v3.3.1
```

Utilisez `main` seulement pour les instances de test ou la validation mainteneur :

```bash
npm run upgrade -- --ref main
```

{{< callout type="note" title="Les valeurs par défaut sont héritées" >}}
Vous n'avez pas besoin de relancer setup seulement pour recevoir de nouvelles valeurs par défaut produit. Le build fusionne `defaults/v8s-site-config.json` avec `custom/v8s-site-config.json`, donc les champs additifs absents héritent de la base produit. Relancez `npm run setup` seulement lorsque vous voulez changer des réponses propres à l'instance.
{{< /callout >}}

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
git add defaults scripts package.json package-lock.json .npmrc .prettierignore
git commit -m "chore: upgrade vanityurls runtime"
git push
```

Si la commande s'arrête, lisez l'erreur et inspectez `git status --short` avant de réessayer. Si vous migrez une ancienne instance Cloudflare Pages `_redirects` vers le runtime Worker, lisez d'abord [Migrer des redirections Cloudflare Pages vers vanityURLs Workers](/fr/blog/migrating-from-cloudflare-pages-redirects/).
