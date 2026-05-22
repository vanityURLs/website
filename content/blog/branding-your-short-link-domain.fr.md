---
title: "Habiller votre domaine court"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Comment penser la marque d'une instance vanityURLs sans transformer le redirecteur en projet design avant qu'il fonctionne."
tags: ["marque", "personnalisation", "liens-courts"]
featured: false
---

Un domaine court est minuscule, mais les gens le lisent quand meme comme un signal. Il apparait dans les courriels, les presentations, les profils sociaux, les codes QR, la documentation, les messages d'incident et les discussions d'equipe. Si le domaine semble intentionnel, le lien parait plus fiable avant meme le clic.

C'est la partie utile de la marque dans vanityURLs. L'objectif n'est pas de creer un systeme visuel complet le premier jour. L'objectif est de rendre le redirecteur clairement identifiable, puis de raffiner les details quand les liens fonctionnent.

## Commencer par la reconnaissance

La premiere decision de marque est le domaine court lui-meme. Un bon domaine court est facile a dire, facile a taper, et assez proche de la personne ou organisation derriere le lien pour que les destinataires n'aient pas a deviner.

Ensuite, gardez la premiere passe modeste :

- utiliser le domaine comme wordmark de la page d'accueil
- garder le badge de redirection visible sur les pages par defaut
- mettre a jour les contacts publics et les pages de politique
- eviter les changements decoratifs qui rendent les pages de support moins lisibles

Cela donne assez de contexte aux utilisateurs sans ralentir le premier deploiement.

## Le wordmark bicolore

L'installeur peut stocker un wordmark bicolore dans `custom/v8s-site-config.json`. Pour un domaine comme `v8s.link`, la premiere partie peut rester foncee et le suffixe peut utiliser le teal vanityURLs.

```json
{
  "branding": {
    "domain": "v8s.link",
    "wordmark": {
      "black": "v8s.",
      "green": "link"
    }
  }
}
```

Cette petite separation aide le domaine a se lire comme une marque sans exiger un fichier logo.

## Garder les badges volontairement simples

Le badge de redirection n'est pas decoratif. Il explique pourquoi le visiteur arrive sur une page intermediaire et qui opere le redirecteur. Les badges localises permettent d'afficher le meme message dans la langue du visiteur quand une page localisee existe.

Traitez les badges comme des assets produit :

- garder le format SVG
- garder le fond transparent
- mettre a jour toutes les langues supportees ensemble
- utiliser le badge clair sur les surfaces claires et le badge fonce sur les surfaces foncees

Les noms d'assets et les couleurs actuelles vivent dans [Marque](/fr/docs/brand/).

## Personnaliser apres que le redirecteur fonctionne

La marque est un travail de phase 2. Faites fonctionner le domaine, le Worker, la protection Access, les liens et les pages par defaut d'abord. Ensuite, raffinez la page d'accueil, les badges, les pages legales, les pages de statut, la typographie et les assets par langue.

Cet ordre garde le produit honnete : la marque soutient un redirecteur fonctionnel au lieu de cacher un redirecteur incomplet.
