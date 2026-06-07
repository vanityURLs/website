---
title: "Registre runtime des liens"
description: "Le registre de liens build/v8s.json génère, schéma 3.1, consomme par le Worker vanityURLs."
weight: 35
aside: false
---

`build/v8s.json` est le registre runtime des liens génère et consomme par le Worker. Ce n'est pas le fichier modifie par les humains.

Les humains modifient le registre source des liens, normalement `custom/v8s-links.txt`. Le build valide ce fichier source, lit les règles `@schedule` inline et les fichiers de politique, puis compile le résultat vers cette forme runtime. Pour le format source éditable, consultez [Format des liens](/fr/docs/reference/link-format/).

## Chemin de nettoyage

La direction de nettoyage est :

1. garder `custom/v8s-links.txt` plat et lisible par les humains;
2. le compiler pendant `npm run build` en registre runtime des liens, d'abord arborescent;
3. traiter `tree` comme la forme canonique de résolution runtime;
4. aplatir `tree` seulement dans les outils qui ont besoin d'une vue tabulaire;
5. ne pas émettre une deuxième forme runtime des liens.

Les entrées source exactes et splat peuvent partager le même slug de base. Par exemple, `docs` et `docs/*` sont valides ensemble : `/docs` doit résoudre le lien exact, tandis que `/docs/install` doit résoudre le lien splat. L'arbre runtime les stocke séparément comme `link` et `splat_link`.

## Schéma 3.1

Le schéma `3.1` est uniquement arborescent :

| Champ                | Rôle                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `schema_version`     | Version du contrat du registre runtime, actuellement `3.1`                                |
| `generated_at`       | Horodatage du build                                                                       |
| `generated_timezone` | Fuseau horaire opérateur utilisé par les tableaux protégés pour afficher l'heure de build |
| `default_state`      | État de cycle de vie par défaut, normalement `permanent`                                  |
| `routing`            | Carte état-vers-résultat utilisée par le Worker                                           |
| `tree`               | Structure imbriquée canonique pour la résolution runtime                                  |

Chaque noeud de `tree` contient un objet `children`, peut contenir un `link` exact, et peut contenir un `splat_link`. Chaque objet de lien contient `slug`, `match`, `target`, `state`, les métadonnées et un `schedule` optionnel.

## Outils

Le Worker lit `tree` directement. Les tableaux, helpers locaux, validateurs et scripts de maintenance aplatissent `tree` lorsqu'ils ont besoin d'une liste. Cela garde le registre runtime généré unique tout en conservant des workflows de revue et de tableau pratiques.

## Validation

`npm run check` construit le registre runtime des liens et valide :

- les états de routage requis
- la forme de `tree`
- les liens source exacts et splat et leur représentation dans l'arbre runtime
- la sûreté des cibles de redirection
- les placeholders de cibles splat
- la forme des règles de planification
- les violations de politique de blocklist

Le contrat d'implémentation vit dans le générateur et le validateur du dépôt de code.
