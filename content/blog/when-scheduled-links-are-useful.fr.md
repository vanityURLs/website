---
title: "Quand les liens planifies sont utiles"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Utiliser les liens planifies quand un lien court stable doit pointer ailleurs pendant des plages horaires connues."
tags: ["liens-planifies", "operations", "liens-courts"]
featured: false
---

La plupart des liens courts devraient rester simples : un slug, une destination, un proprietaire clair. Les liens planifies servent aux moments ou le slug doit rester stable, mais la destination doit changer selon le temps.

C'est une fonctionnalite plus etroite qu'elle en a l'air. Ce n'est pas une plateforme d'automatisation marketing. C'est une petite facon de faire en sorte qu'un lien connu se comporte correctement pendant des fenetres previsibles.

## Bons cas d'usage

Les liens planifies sont utiles quand les gens connaissent deja le slug :

- un lien de rencontre recurrent qui pointe vers la salle de travail pendant les heures de bureau et vers une salle communautaire apres
- un lien d'evenement qui pointe vers l'inscription avant l'evenement et vers l'enregistrement apres
- un lien de lancement qui pointe vers une page d'attente avant l'heure de publication et vers la page active ensuite
- un lien de support qui pointe vers un avis de maintenance pendant une interruption planifiee

Dans chaque cas, la memoire humaine reste stable. La route change dessous.

## Garder le lien normal

La cible normale appartient encore a `v8s-links.txt`. La planification ajoute les fenetres dans `v8s-schedules.json`. Si aucune regle n'est active, le Worker peut retomber sur la cible normale ou sur une cible par defaut propre a la planification.

Cela garde le lien comprehensible en code review. Le slug existe dans l'inventaire de liens, et la planification explique seulement l'exception temporelle.

## Preferer la CLI

Pour les edits normaux, utilisez `lnk schedule` au lieu de modifier le JSON a la main. Cela garde la forme du fichier coherente et rend les changements simples plus faciles a reviser.

Utilisez [Liens planifies](/fr/docs/reference/schedules/) pour les exemples de commandes et les formes JSON exactes.
