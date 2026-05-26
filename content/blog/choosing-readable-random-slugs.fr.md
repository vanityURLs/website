---
title: "Choisir des slugs aleatoires lisibles"
date: 2026-05-26
description: "Comment vanityURLs equilibre les slugs aleatoires courts, la lisibilite et les valeurs par defaut propres aux tags."
tags: ["links", "operations", "configuration"]
featured: false
---

Les slugs aleatoires sont pratiques lorsque le mot-cle exact n'a pas d'importance. Vous collez une longue URL, laissez `lnk` choisir le slug, puis vous continuez. Le detail important, c'est qu'un slug aleatoire reste parfois lu, tape, dicte, colle dans un ticket ou compare dans une capture d'ecran par un humain.

C'est pourquoi vanityURLs utilise un alphabet lisible plutot que tous les caracteres URL-safe possibles.

## La lisibilite avant la compacite theorique

L'alphabet par defaut est :

```text
34789abcdefghjkmnpqrstvwxy
```

Il evite volontairement les caracteres faciles a confondre dans certaines polices ou a l'oral. Il n'y a pas de `0`, `1`, `2`, `5`, `6`, `i`, `l` ou `o`. Il reste aussi en minuscules pour eviter que `abc` et `ABC` deviennent deux liens differents par accident.

Les alphabets mixtes majuscules/minuscules creent plus de combinaisons dans moins de caracteres. Cela peut etre utile a grande echelle, mais les chemins d'URL sont sensibles a la casse. Un slug mixte est plus difficile a dicter, plus facile a mal taper et moins indulgent lorsqu'une personne le copie depuis un badge imprime ou une diapositive.

## Garder l'alphabet configurable

L'alphabet appartient a la configuration parce que les equipes n'ont pas toutes la meme tolerance entre compacite, entropie et saisie humaine. La valeur produit par defaut devrait etre calme et lisible, pendant qu'une instance precise peut choisir un alphabet plus dense.

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

Vous pouvez la remplacer pour une seule commande :

```bash
./scripts/lnk https://github.com/houba/styleGuide --random-slug-length 5
```

Ou generer un lien court pour un bug avec la valeur par defaut du tag `debug` :

```bash
./scripts/lnk https://github.com/vanityURLs/code/issues/4 --tags debug
```

## Utiliser les tags lorsque l'intention change la forme du slug

Les longueurs propres aux tags permettent au type de lien de choisir l'espace necessaire au slug aleatoire.

Dans l'exemple ci-dessus, les liens `training` ont 4 caracteres parce qu'ils peuvent etre partages avec de vraies personnes et vivre un peu plus longtemps. Les liens `debug` ont 2 caracteres parce qu'ils sont volontairement temporaires et souvent limites a une investigation.

Configurez ces valeurs avec :

```bash
./scripts/lnk tag set training --random-slug-length 4
./scripts/lnk tag set debug --random-slug-length 2
```

Lorsqu'un lien possede plusieurs tags avec des longueurs configurees, `lnk` utilise la longueur la plus courte parmi les tags applicables. Le tag le plus restrictif garde donc le controle. Si vous avez besoin d'une autre longueur pour un lien precis, la valeur explicite sur la ligne de commande gagne.

L'important n'est pas que chaque instance utilise exactement le meme alphabet ou les memes longueurs. L'important est que les valeurs par defaut soient deliberees, visibles dans Git et faciles a expliquer plus tard.
