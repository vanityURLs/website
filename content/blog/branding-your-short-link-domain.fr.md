---
title: "Faire paraitre le domaine court possede"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Comment penser la marque d'une instance vanityURLs sans transformer le redirecteur en projet design avant qu'il fonctionne."
tags: ["marque", "personnalisation", "liens-courts"]
featured: false
---

Un domaine court est minuscule, mais les gens le lisent quand meme comme un signal.

Il apparait dans les courriels, les presentations, les profils sociaux, les codes QR, la documentation, les messages d'incident et les discussions d'equipe. Si le domaine semble intentionnel, le lien parait plus fiable avant meme le clic.

C'est la partie utile de la marque dans vanityURLs : rendre le redirecteur clairement a vous sans transformer le premier deploiement en projet design.

![Page d'accueil v8s.link avec wordmark bicolore, champ de recherche et badge redirected by vanityURLs.link](/blog/v8s-link-homepage.png)

## Commencer Par Le Domaine

La premiere decision de marque est le domaine court lui-meme. Il devrait etre facile a dire, facile a taper, et assez proche de la personne ou organisation derriere le lien pour que les destinataires n'aient pas a deviner qui l'a envoye.

Pour une premiere passe, gardez la surface petite :

- utiliser le domaine comme wordmark de la page d'accueil
- garder le badge de redirection visible sur les pages par defaut
- mettre a jour les contacts publics et les pages de politique
- eviter les changements decoratifs qui rendent les pages de support moins lisibles

La capture ci-dessus suffit comme marque pour la phase 1. Le domaine est visible. Le champ de saisie dit aux visiteurs ce que fait la page. Le badge explique pourquoi une page intermediaire existe.

## Utiliser Le Wordmark Bicolore

L'installeur peut stocker un wordmark bicolore dans `custom/v8s-site-config.json`. Pour `v8s.link`, la premiere partie reste foncee et le suffixe utilise le teal vanityURLs.

```json
{
  "branding": {
    "domain": "v8s.link",
    "slogan": {
      "en": "A short-link service for Example Inc.'s projects",
      "fr": "Un service de liens courts pour les projets de Example Inc."
    },
    "wordmark": {
      "black": "v8s.",
      "green": "link"
    }
  }
}
```

Cette separation aide le domaine a se lire comme une marque sans exiger un fichier logo.

## Garder Le Badge Ennuyeux

Le badge de redirection n'est pas decoratif. Il explique pourquoi le visiteur arrive sur une page intermediaire et qui opere le redirecteur. Les badges localises permettent d'afficher le meme message dans la langue du visiteur quand une page localisee existe.

Traitez les badges comme des assets produit :

- garder le format SVG
- garder le fond transparent
- mettre a jour toutes les langues supportees ensemble
- utiliser le badge clair sur les surfaces claires et le badge fonce sur les surfaces foncees

Les noms d'assets et les couleurs actuelles vivent dans [Marque](/fr/docs/reference/brand/).

## Savoir Ou La Marque S'Arrete

La marque est un travail de phase 2. Faites fonctionner le domaine, le Worker, la protection Access, les liens et les pages par defaut d'abord.

Ensuite, raffinez la page d'accueil, les badges, les pages legales, les pages de statut, la typographie et les assets par langue. Le compromis est volontaire : un redirecteur simple qui fonctionne vaut mieux qu'un redirecteur poli qui n'a pas encore prouve qu'il peut rediriger.
