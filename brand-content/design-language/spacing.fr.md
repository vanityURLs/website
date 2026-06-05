---
title: "Espacement"
heading: "Echelle d'espacement et recommandations de densite"
type: brand
weight: 40
---

L'espacement doit rendre l'interface facile a parcourir. Utilisez un espacement plus serre pour les outils operationnels et plus genereux pour les ouvertures de page, resumes de marque et apercus d'assets.

Le site utilise des tokens d'espacement de documentation fluides dans `assets/css/main.css`, de `--docs-space-2xs` a `--docs-space-l`. Utilisez ces relations de tokens lorsque vous ajoutez de nouveaux composants de documentation.

Le modele d'espacement suit la [fondation espacement de Red Hat](https://ux.redhat.com/foundations/spacing/) : une petite echelle nommee garde le rythme coherent entre composants, motifs et mises en page. vanityURLs applique cette idee a la prose documentaire, aux interfaces produit compactes, aux pages generees et aux apercus d'assets.

## Echelle

| Token              | Usage                                                                               |
| ------------------ | ----------------------------------------------------------------------------------- |
| `--docs-space-2xs` | Rythme de liste serre, metadonnees compactes, petits ecarts dans l'interface dense. |
| `--docs-space-xs`  | Ecarts de texte de soutien, distance libelle-controle, interieur de carte compact.  |
| `--docs-space-s`   | Rythme normal des paragraphes et petits groupes de contenu.                         |
| `--docs-space-m`   | Interieur de section, cartes groupees, tableaux et callouts.                        |
| `--docs-space-l`   | Separation majeure entre sections et rythme d'ouverture de page.                    |

## Regles

- Gardez les controles lies proches les uns des autres.
- Separez les groupes sans lien avec un espacement vertical plus grand.
- N'utilisez pas le vide comme decoration lorsque la structure serait plus claire.
- Preservez assez de marge autour des badges et logos pour eviter qu'ils soient serres par le texte voisin.
- Laissez le flux du texte definir le rythme vertical. Evitez les grands espaces forces entre paragraphes uniquement pour creer un moment de marque.

## Densite

La documentation peut respirer davantage que les outils operationnels. Les surfaces de redirection et d'administration devraient etre plus denses, car les utilisateurs verifient souvent une URL, lisent un etat ou modifient une configuration.

- Utilisez un espacement genereux autour des explications de marque, apercus de logo et assets telechargeables.
- Utilisez un espacement de ligne plus serre pour les tableaux, journaux d'audit, listes de politiques et exemples de commande.
- Gardez les controles de formulaire pres de leurs libelles et textes d'aide.
- Evitez les grands ecarts verticaux entre un avertissement et l'action qu'il explique.

## Espacement de mise en page

Utilisez les gouttieres de grille pour la structure et les tokens d'espacement pour les relations a l'interieur d'un composant. Quand l'espacement semble incorrect, determinez d'abord si le probleme vient de la hierarchie, du regroupement ou de la longueur de ligne. Ajouter du vide n'est pas toujours la solution.
