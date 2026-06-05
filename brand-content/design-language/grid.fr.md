---
title: "Grille"
heading: "Grilles de mise en page, largeur des pages et structure responsive"
type: brand
weight: 30
---

Utilisez une colonne de contenu centree pour les pages de documentation et de reference. Gardez les surfaces de lecture assez etroites pour rester faciles a parcourir.

La mise en page de documentation standard utilise une navigation a gauche, une colonne de lecture principale et une table des matieres optionnelle. Les pages de marque devraient reutiliser cette mise en page sauf lorsqu'une page sert specifiquement de previsualisation d'assets.

L'approche de grille s'appuie sur la [fondation grille de Red Hat](https://ux.redhat.com/foundations/grid/) : une structure previsible avec colonnes, marges, gouttieres et longueur de ligne responsive. vanityURLs garde cette discipline et l'adapte a un site de documentation compact et aux pages de redirection generees.

## Structure des pages

| Surface                       | Structure                                                          | Recommandation                                                                  |
| ----------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Documentation de marque       | Barre laterale, colonne de lecture, table des matieres optionnelle | Gardez la prose lisible et evitez les paragraphes pleine largeur.               |
| Tableaux de reference         | Colonne de lecture avec resilience horizontale                     | Preferez les tableaux pour les comparaisons denses, avec des cellules concises. |
| Apercus d'assets              | Zone d'apercu contrainte et details de soutien                     | L'asset doit rester inspectable sans chrome decoratif.                          |
| Pages de redirection generees | Colonne unique focalisee                                           | Montrez destination, etat et prochaine action sans barre laterale concurrente.  |
| Outils operateur              | Grille dense et organisee                                          | Priorisez le balayage visuel, les controles stables et les lignes repetees.     |

## Comportement responsive

- La mise en page en une colonne est le defaut sur mobile.
- Les grilles en deux colonnes conviennent aux panneaux lies et aux comparaisons.
- Les grilles en trois colonnes conviennent a la navigation de haut niveau et aux resumes courts.
- Evitez les cartes imbriquees et les conteneurs decoratifs autour de sections entieres.
- Utilisez deux colonnes sur mobile seulement pour de tres petits elements egaux, comme des nuanciers ou exemples d'icones.
- Laissez la table des matieres disparaitre avant que la colonne de lecture devienne trop etroite.

## Longueur de ligne

Le texte courant doit rester assez etroit pour etre lu confortablement. Sur desktop, gardez la prose proche de la colonne de lecture principale au lieu de l'etendre sur toute la largeur. Si un contenu a besoin de plus d'espace horizontal, son type doit le justifier : tableaux, diagrammes, apercus d'image et blocs de code peuvent s'etendre plus que les paragraphes.

## Dimensions stables

Definissez des dimensions stables pour les elements repetes comme les cartes, nuanciers, boutons icones, compteurs et tuiles de previsualisation afin que le contenu ne deplace pas la mise en page.

## Decisions de grille

- Alignez les contenus lies sur le meme bord gauche.
- Gardez les gouttieres coherentes dans une section.
- Utilisez `minmax` ou des ratios fixes pour les tuiles de previsualisation repetees.
- Evitez de centrer chaque petit bloc. L'alignement a gauche facilite le balayage de la documentation technique.
- Quand une page melange prose et interface dense, laissez la prose introduire la decision et laissez la grille porter la comparaison.
