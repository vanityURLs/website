---
title: "Les slugs aleatoires ont encore des lecteurs humains"
date: 2026-05-26
description: "Comment vanityURLs equilibre les slugs aleatoires courts, la lisibilite et les valeurs par defaut propres aux tags."
tags: ["links", "operations", "configuration"]
featured: false
---

Les slugs aleatoires servent aux moments ou le mot-cle n'a pas d'importance.

Vous collez une longue URL. `lnk` choisit le slug. Vous continuez. Le piege : un slug aleatoire peut quand meme etre lu depuis une diapositive, tape depuis un badge, dicte en appel, colle dans un ticket ou compare dans une capture d'ecran.

Depuis vanityURLs `2.7.0`, la generation de slugs aleatoires est configurable. Les instances existantes peuvent l'obtenir avec le [workflow de mise a niveau](/fr/docs/reference/upgrading/), incluant `npm run upgrade`.

Le defaut optimise pour l'humain dans cette boucle.

## Utiliser Un Alphabet Lisible

L'alphabet par defaut est :

```text
34789abcdefghjkmnpqrstvwxy
```

Il evite les caracteres faciles a confondre dans les polices courantes ou les instructions orales. Il n'y a pas de `0`, `1`, `2`, `5`, `6`, `i`, `l` ou `o`. Il reste aussi en minuscules pour eviter que `abc` et `ABC` deviennent deux liens differents par accident.

Les alphabets mixtes majuscules/minuscules creent plus de combinaisons dans moins de caracteres. Cela peut etre utile a grand volume, mais les chemins d'URL sont sensibles a la casse en pratique et traites comme donnees de chemin sous [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986). Un slug mixte est plus difficile a dicter et plus facile a mal taper.

Le compromis est la densite. Un alphabet lisible exige plus de caracteres qu'un alphabet dense pour le meme espace de collision. vanityURLs choisit la lisibilite par defaut et laisse la densite configurable.

## Garder Le Choix Dans Git

La section pertinente de `custom/v8s-site-config.json` est :

```json
{
  "links": {
    "random_slug_length": 3,
    "random_slug_alphabet": "34789abcdefghjkmnpqrstvwxy",
    "tag_random_slug_lengths": {
      "training": 4,
      "debug": 2
    }
  }
}
```

La valeur globale `random_slug_length` est utilisee par `lnk` lorsque vous omettez le slug :

```bash
./scripts/lnk https://github.com/houba/styleGuide
```

Remplacez-la pour une commande lorsque le lien a besoin de plus de place :

```bash
./scripts/lnk https://github.com/houba/styleGuide --random-slug-length 5
```

Ou laissez un tag choisir la longueur :

```bash
./scripts/lnk https://github.com/vanityURLs/code/issues/4 --tags debug
```

## Laisser L'Usage Fixer La Longueur

Les longueurs propres aux tags permettent au type de lien de choisir la forme du slug.

Les liens `training` peuvent vivre plus longtemps et etre lus par de vraies personnes, donc 4 caracteres est raisonnable. Les liens `debug` sont temporaires et locaux a une investigation, donc 2 caracteres peuvent suffire.

Configurez ces valeurs avec :

```bash
./scripts/lnk tag set training --random-slug-length 4
./scripts/lnk tag set debug --random-slug-length 2
```

Lorsqu'un lien a plusieurs tags avec des longueurs configurees, `lnk` utilise la longueur la plus courte parmi les tags applicables. Le tag le plus restrictif gagne. Si un lien a besoin d'un comportement different, la valeur explicite en ligne de commande gagne.

Le but n'est pas un alphabet universel. Le but est une decision visible : assez court pour servir, assez lisible pour survivre aux humains, et stocke la ou les reviewers peuvent la voir.
