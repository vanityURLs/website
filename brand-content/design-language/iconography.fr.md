---
title: "Iconographie"
heading: "Roles, style et regles d'usage des icones"
description: "Comment vanityURLs utilise les icones dans la documentation, les surfaces produit, les liens, les etats et les pages generees."
type: brand
weight: 55
---

L'iconographie doit clarifier le sens, pas decorer le vide. Le systeme vanityURLs suit l'approche pratique de la [fondation iconographie de Red Hat](https://ux.redhat.com/foundations/iconography/) : choisir des icones dans un ensemble connu, les utiliser de facon coherente et rendre leur role clair dans le contexte.

## Roles des icones

| Role         | Usage                                                              | Recommandation                                                                                  |
| ------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Navigation   | Identite de section, liens precedent/suivant, liens externes       | Associez au texte sauf si l'icone est universelle et nommee pour les technologies d'assistance. |
| Actions      | Copier, telecharger, rechercher, ouvrir, fermer, basculer le theme | Utilisez des symboles familiers et conservez les etats hover, presse et focus.                  |
| Statut       | Succes, avertissement, danger, bloque, expire, maintenance         | Associez a un texte visible. Ne comptez pas seulement sur la couleur ou la forme.               |
| Metadonnees  | GitHub, RSS, social, type de fichier, langue                       | Gardez petit et secondaire par rapport au libelle ou a la valeur.                               |
| Illustration | Concepts produit ou recit de marque                                | Utilisez avec retenue; la documentation doit rester utile avant d'etre expressive.              |

## Style

- Preferez un style contour coherent pour les icones d'interface.
- Utilisez les icones pleines seulement quand l'etat ou l'ensemble d'icones le demande, par exemple pour une selection ou une marque sociale.
- Equilibrez epaisseur, taille et poids optique avec le texte voisin.
- Utilisez des icones `1em` dans le texte inline et des dimensions carrees stables pour les boutons icones.
- Ne melangez pas des bibliotheques d'icones sans lien dans le meme groupe de controles.

## Accessibilite

Les icones decoratives devraient etre masquees aux technologies d'assistance. Les icones informatives ont besoin d'un nom accessible ou d'un texte voisin portant le meme sens.

- Les boutons avec icone seule ont besoin d'un libelle accessible.
- Les icones de lien externe ne remplacent pas un texte de lien clair.
- Les icones de statut ont besoin de libelles visibles comme `Bloque`, `Expire` ou `Protege`.
- Les icones dans les badges ont besoin d'un texte alternatif localise lorsqu'elles sont exportees comme images.

## Recommandations vanityURLs

Les pages de redirection generees devraient utiliser des icones seulement lorsqu'elles rendent l'etat plus rapide a comprendre. Une icone d'avertissement peut soutenir un etat expire ou bloque, mais la page a toujours besoin d'un titre clair et d'une prochaine action. Les pages de marque peuvent utiliser des exemples d'icones pour les assets et telechargements, mais evitez de transformer les listes de liens de documentation en galeries d'icones.
