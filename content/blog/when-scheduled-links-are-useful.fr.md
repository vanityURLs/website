---
title: "Quand les liens planifies sont utiles"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Utiliser les liens planifies quand un seul lien court stable doit pointer ailleurs pendant des plages horaires connues."
tags: ["liens-planifies", "operations", "liens-courts"]
featured: false
---

La plupart des liens courts devraient rester simples : un slug, une destination, un proprietaire clair. Les liens planifies servent aux rares cas ou le slug doit rester stable, mais la destination doit changer pendant une fenetre previsible.

L'instance de depart inclut un exemple `/contact` volontairement leger. Pendant la fenetre 9 a 5 configuree, il peut pointer vers "9 to 5" de Dolly Parton; hors de cette fenetre, il retombe vers "Never Gonna Give You Up" de Rick Astley. Le sujet n'est pas le gout musical, aussi defendable soit-il. Le sujet est qu'un seul lien court memorable peut avoir une destination normale et une exception horaire.

## Bons cas d'usage

Les liens planifies sont utiles quand les gens connaissent deja le slug :

- un lien de rencontre recurrent qui pointe vers la salle de travail pendant les heures de bureau et vers une salle communautaire apres
- un lien d'evenement qui pointe vers l'inscription avant l'evenement et vers l'enregistrement apres
- un lien de lancement qui pointe vers une page d'attente avant l'heure de publication et vers la page active ensuite
- un lien de support qui pointe vers un avis de maintenance pendant une interruption planifiee

Dans chaque cas, la memoire humaine reste stable. La route change dessous.

## Garder l'inventaire lisible

Le slug appartient encore a `v8s-links.txt`. La planification ajoute les fenetres dans `v8s-schedules.json`. Si aucune regle n'est active, le Worker peut retomber sur la cible normale ou sur une cible par defaut propre a la planification.

Cela garde la revue saine. L'inventaire de liens repond a "est-ce que ce slug existe?", tandis que l'horaire repond a "quand est-ce que la destination change?"

## Preferer la CLI

Pour les edits normaux, utilisez `lnk schedule` au lieu de modifier le JSON a la main. Cela garde la forme du fichier coherente et rend les changements simples plus faciles a reviser.

Utilisez [Liens planifies](/fr/docs/reference/schedules/) pour les exemples de commandes et les formes JSON exactes, et comparez l'horaire de depart `contact` dans `defaults/v8s-schedules.json` lorsque vous voulez une reference concrete.
