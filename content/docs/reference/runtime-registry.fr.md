---
title: "Registre runtime"
description: "Le registre v8s.json génère, schéma 3.0, consomme par le Worker vanityURLs."
weight: 35
aside: false
---

`build/v8s.json` est le registre runtime génère et consomme par le Worker. Les humains modifient les fichiers source comme `custom/v8s-links.txt`; le build valide et compile ces fichiers vers cette forme runtime.

## Schéma 3.0

Le schéma `3.0` est d'abord arborescent :

| Champ | Rôle |
| --- | --- |
| `schema_version` | Version du contrat du registre runtime, actuellement `3.0` |
| `generated_at` | Horodatage du build |
| `generated_timezone` | Fuseau horaire opérateur utilisé par les tableaux protégés pour afficher l'heure de build |
| `default_state` | État de cycle de vie par défaut, normalement `permanent` |
| `routing` | Carte état-vers-résultat utilisée par le Worker |
| `tree` | Structure imbriquée canonique pour la résolution runtime |
| `links[]` | Tableau de compatibilite pour tableaux de bord, helpers locaux et revue |

Chaque noeud de `tree` contient un objet `children` et peut contenir un `link`. Chaque `link` garde les mêmes champs que dans `links[]`, dont `slug`, `match`, `target`, `state`, les metadonnées et un `schedule` optionnel.

## Compatibilite

Le Worker préfère `tree` lorsqu'il est present et revient à `links[]` lorsqu'il est absent. Cela garde le rollback sûr entre 2.x et 3.x et permet aux outils locaux de continuer à utiliser le tableau de compatibilite pendant la série 3.x.

`links[]` reste inclus dans le contrat de compatibilite 3.x. Le retirer demanderait une future release majeure.

## Validation

`npm run check` construit le registre et valide :

- les états de routage requis
- la forme de `tree`
- le tableau de compatibilite `links[]`
- la sûreté des cibles de redirection
- les placeholders de cibles splat
- la forme des règles de planification
- les violations de politique de blocklist

Le contrat d'implémentation vit dans le générateur et le validateur du dépôt de code.
