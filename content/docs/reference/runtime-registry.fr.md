---
title: "Registre runtime des liens"
description: "Le registre de liens build/v8s.json génère, schéma 3.0, consomme par le Worker vanityURLs."
weight: 35
aside: false
---

`build/v8s.json` est le registre runtime des liens génère et consomme par le Worker. Ce n'est pas le fichier modifie par les humains.

Les humains modifient le registre source des liens, normalement `custom/v8s-links.txt`. Le build valide ce fichier source, lit les règles `@schedule` inline et les fichiers de politique, puis compile le résultat vers cette forme runtime. Pour le format source éditable, consultez [Format des liens](/fr/docs/reference/link-format/).

## Chemin de nettoyage

La direction 3.x est :

1. garder `custom/v8s-links.txt` plat et lisible par les humains;
2. le compiler pendant `npm run build` en registre runtime des liens, d'abord arborescent;
3. traiter `tree` comme la forme canonique de résolution runtime;
4. garder `links[]` comme vue dérivée de compatibilité et de tableau de bord pendant la série 3.x;
5. valider que `tree` et `links[]` concordent avant le déploiement.

Les entrées source exactes et splat peuvent partager le même slug de base. Par exemple, `docs` et `docs/*` sont valides ensemble : `/docs` doit résoudre le lien exact, tandis que `/docs/install` doit résoudre le lien splat. L'arbre runtime les stocke séparément comme `link` et `splat_link`.

## Schéma 3.0

Le schéma `3.0` est d'abord arborescent :

| Champ                | Rôle                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `schema_version`     | Version du contrat du registre runtime, actuellement `3.0`                                |
| `generated_at`       | Horodatage du build                                                                       |
| `generated_timezone` | Fuseau horaire opérateur utilisé par les tableaux protégés pour afficher l'heure de build |
| `default_state`      | État de cycle de vie par défaut, normalement `permanent`                                  |
| `routing`            | Carte état-vers-résultat utilisée par le Worker                                           |
| `tree`               | Structure imbriquée canonique pour la résolution runtime                                  |
| `links[]`            | Tableau de compatibilité pour tableaux de bord, helpers locaux et revue                   |

Chaque noeud de `tree` contient un objet `children`, peut contenir un `link` exact, et peut contenir un `splat_link`. Chaque objet de lien garde les mêmes champs que dans `links[]`, dont `slug`, `match`, `target`, `state`, les métadonnées et un `schedule` optionnel.

## Compatibilite

Le Worker préfère `tree` lorsqu'il est present et revient à `links[]` lorsqu'il est absent. Cela garde le rollback sûr entre 2.x et 3.x et permet aux outils locaux de continuer à utiliser le tableau de compatibilité pendant la série 3.x.

`links[]` reste inclus dans le contrat de compatibilité 3.x, mais ce n'est pas la source de vérité runtime lorsque `tree` est présent. Le retirer demanderait une future release majeure.

## Validation

`npm run check` construit le registre runtime des liens et valide :

- les états de routage requis
- la forme de `tree`
- le tableau de compatibilité `links[]`
- la concordance entre les liens source exacts et splat et leur représentation dans l'arbre runtime
- la sûreté des cibles de redirection
- les placeholders de cibles splat
- la forme des règles de planification
- les violations de politique de blocklist

Le contrat d'implémentation vit dans le générateur et le validateur du dépôt de code.
