---
title: "Les decisions d'architecture vivent avec le code"
date: 2026-05-26
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs documente les decisions d'architecture produit dans le depot code plutot que d'alourdir la documentation utilisateur."
tags: ["architecture", "adr", "maintenance"]
featured: false
---

La documentation utilisateur doit aider quelqu'un a exploiter un domaine de liens courts. Elle ne devrait pas forcer chaque page de setup a porter toute l'histoire du Worker, de l'installateur, des schemas et du processus de release.

Cette histoire reste importante. Quand une personne maintient le produit et change un champ de schema, reecrit le setup ou decide qu'une politique custom remplace un default produit, la prochaine personne doit trouver la raison pres du code.

C'est le role des Architecture Decision Records, ou ADR, dans vanityURLs.

## Ce qui va dans un ADR

Un ADR documente une decision produit qui serait couteuse a redecouvrir plus tard.

De bons candidats sont :

- l'automatisation release-please et le versionnement semantique
- la frontiere de propriete entre `defaults/` et `custom/`
- les regles de versionnement de schema
- la facon dont setup cree les fichiers de depart
- pourquoi une regle de securite runtime a une portee precise

L'ADR ne remplace pas la documentation, les tests ou les commentaires. Il repond a une autre question : pourquoi avons-nous choisi cette forme?

## Pourquoi le depot code

La decision appartient la ou l'implementation change. Si un commit modifie `scripts/install.mjs`, `defaults/v8s-site-config.json` et une regle de schema, l'ADR peut voyager dans le meme commit.

Cela garde le site public plus court. Le site peut dire quoi faire. L'ADR peut garder pourquoi le produit fonctionne ainsi.

## Ou regarder

Les ADR vivent dans le depot code sous [`docs/adr/`](https://github.com/vanityURLs/code/tree/main/docs/adr).

Les ajouts de champs de schema sont suivis dans [`docs/schema-changelog.md`](https://github.com/vanityURLs/code/blob/main/docs/schema-changelog.md), surtout quand le changement est additif et ne change pas `schema_version`.

Quand une page de documentation pointe vers un ADR, ce devrait etre parce que la raison d'implementation compte. La plupart des utilisateurs n'ont pas besoin de l'historique ADR; les mainteneurs et les operateurs curieux, parfois oui.
