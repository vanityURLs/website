---
title: "Quand les liens planifiés sont utiles"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Utiliser les liens planifiés quand un seul lien court stable doit pointer ailleurs pendant des plages horaires connues."
tags: ["liens-planifiés", "opérations", "liens-courts"]
featured: false
---

La plupart des liens courts devraient rester simples : un slug, une destination, un propriétaire clair. Les liens planifiés servent aux rares cas ou le slug doit rester stable, mais la destination doit changer pendant une fenêtre prévisible.

L'instance de départ inclut un exemple `/contact` volontairement leger. Pendant la fenêtre 9 a 5 configuree, il peut pointer vers "9 to 5" de Dolly Parton; hors de cette fenêtre, il retombe vers "Never Gonna Give You Up" de Rick Astley. Le sujet n'est pas le gout musical, aussi defendable soit-il. Le sujet est qu'un seul lien court memorable peut avoir une destination normale et une exception horaire.

## Bons cas d'usage

Les liens planifiés sont utiles quand les gens connaissent déjà le slug :

- un lien de rencontre récurrent qui pointe vers la salle de travail pendant les heures de bureau et vers une salle communautaire après
- un lien d'événement qui pointe vers l'inscription avant l'événement et vers l'enregistrement après
- un lien de lancement qui pointe vers une page d'attente avant l'heure de publication et vers la page active ensuite
- un lien de support qui pointe vers un avis de maintenance pendant une interruption planifiée

Dans chaque cas, la memoire humaine reste stable. La route change dessous.

## Garder l'inventaire lisible

Le slug appartient encore a `v8s-links.txt`. La planification ajoute les fenêtres dans `v8s-schedules.json`. Si aucune règle n'est active, le Worker peut retomber sur la cible normale ou sur une cible par défaut propre à la planification.

Cela garde la revue saine. L'inventaire de liens répond a "est-ce que ce slug existe?", tandis que l'horaire répond a "quand est-ce que la destination change?"

## Preferer la CLI

Pour les edits normaux, utilisez `lnk schedule` au lieu de modifier le JSON à la main. Cela garde la forme du fichier coherente et rend les changements simples plus faciles a réviser.

Utilisez [Liens planifiés](/fr/docs/reference/schedules/) pour les exemples de commandes et les formes JSON exactes, et comparez l'horaire de départ `contact` dans `defaults/v8s-schedules.json` lorsque vous voulez une référence concrété.
