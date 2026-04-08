---
title: "Exemples de liens"
description: "Les vrais static.lnk et dynamic.lnk de v8s.link, entièrement annotés."
nav_order: 33
translationKey: "demo-links"
---

Ce sont les vrais fichiers de redirection du [dépôt v8s.link](https://github.com/vanityURLs/v8s.link), annotés pour expliquer chaque règle.

## static.lnk

```
/ https://vanityURLs.link/

/blog     https://vanityURLs.link/en/blog

/github   https://github.com/vanityURLs/
/git      https://github.com/vanityURLs/v8s.link

/gitlab   https://gitlab.com/bhdicaire/

/linkedin https://linkedin.com/in/bhdicaire/
/x        https://twitter.com/BHDicaire/

/ALM      https://brew.sh
/VVa      https://github.com/vanityURL
/HHU      https://github.com/vanityURLs/vanityURLs/issues/21
```

{{< callout type="note" title="Pas de code de statut = 301" >}}
Aucune règle de ce fichier n'inclut de code de statut explicite. Cloudflare Pages utilise `301` (permanent) par défaut.
{{< /callout >}}

**`/ALM`, `/VVa`, `/HHU`** — Ce sont des entrées de test obsolètes. `/ALM` pointe vers Homebrew (non lié), `/VVa` contient une coquille, `/HHU` pointe vers une issue GitHub spécifique. **Ne copiez pas ces patterns** — utilisez des chemins descriptifs comme `/homebrew`, `/issues/21`.

### Modèle pour votre propre static.lnk

```
# Profils sociaux
/github    https://github.com/VOTRENOM       301
/linkedin  https://linkedin.com/in/VOTRENOM  301
/x         https://x.com/VOTRENOM           301

# Destinations principales
/           https://VOTRESITE.com            301
/blog       https://VOTRESITE.com/blog       301

# Projets
/projet1    https://github.com/VOTRENOM/projet1  301
```

## dynamic.lnk

```
/github/*  https://github.com/vanityURLs/:splat
```

Cette ligne utilise une **redirection splat** pour transmettre tout chemin sous `/github/` au chemin correspondant sous `github.com/vanityURLs/`.

```
v8s.link/github/vanityURLs  →  github.com/vanityURLs/vanityURLs
v8s.link/github/website     →  github.com/vanityURLs/website
```

### Autres patterns splat utiles

```
/docs/*    https://vanityurls.link/en/docs/:splat   302
/gh/*      https://github.com/VOTRENOM/:splat        302
/talks/*   https://slides.example.com/:splat         302
```

{{< callout type="warning" title="L'ordre des règles est important" >}}
Cloudflare évalue `_redirects` de haut en bas. Une règle statique `/github` dans `static.lnk` a priorité sur le splat `/github/*` pour le chemin exact `/github` — c'est le comportement correct.
{{< /callout >}}
