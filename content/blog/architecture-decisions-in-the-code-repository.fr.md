---
title: "Les decisions d'architecture vivent avec le code"
date: 2026-05-26
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs documente les decisions d'architecture produit dans le depot code plutot que d'alourdir la documentation utilisateur."
tags: ["architecture", "adr", "maintenance"]
featured: false
---

Une page de setup devrait dire a l'operateur quoi faire.

Elle ne devrait pas porter toute l'histoire du Worker, de l'installateur, du schema, de l'automatisation de release et des regles de securite runtime. Cette histoire reste importante. Elle appartient pres de l'implementation.

vanityURLs garde les decisions produit dans des architecture decision records dans le depot code. Les docs publiques restent operationnelles. Le depot code garde le raisonnement dont les futurs mainteneurs auront besoin lorsque le prochain changement semble evident, mais ne l'est pas.

## Ce Qui Merite Un ADR

Un ADR documente une decision qui serait couteuse a redecouvrir.

De bons candidats :

- l'automatisation avec [release-please](https://github.com/googleapis/release-please) et le [versionnement semantique](https://semver.org/)
- la frontiere de propriete entre `defaults/` et `custom/`
- quand `schema_version` change et quand un champ additif va seulement dans le changelog de schema
- comment setup cree les fichiers de depart
- pourquoi une regle de securite runtime a une portee etroite

Les ADR n'ont pas de standard canonique unique. vanityURLs suit la convention pratique : fichiers numerotes courts, decision, contexte qui l'a forcee, et consequence acceptee par le projet.[^adr]

## Pourquoi Le Depot Code

La decision appartient la ou l'implementation change.

Si un commit modifie `scripts/install.mjs`, `defaults/v8s-site-config.json` et une regle de schema, l'ADR peut voyager avec ce commit. Les reviewers voient le code et la raison ensemble.

Cela garde le site public plus court. Le site peut dire quoi faire. L'ADR peut conserver pourquoi le produit fonctionne ainsi.

## Ou Regarder

Les ADR vivent dans le depot code sous [`docs/adr/`](https://github.com/vanityURLs/code/tree/main/docs/adr).

Les ajouts de champs de schema sont suivis dans [`docs/schema-changelog.md`](https://github.com/vanityURLs/code/blob/main/docs/schema-changelog.md), surtout lorsque le changement est additif et ne change pas `schema_version`.

Le compromis est l'indirection. Un utilisateur peut devoir suivre un lien vers GitHub pour lire tout le raisonnement. C'est mieux que transformer chaque page de setup en couche archeologique.

[^adr]: L'organisation publique [ADR GitHub](https://adr.github.io/) est un point d'entree utile, mais les ADR du depot sont l'autorite locale.
