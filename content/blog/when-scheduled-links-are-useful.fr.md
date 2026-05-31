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

Le slug et la cible normale de repli appartiennent à `v8s-links.txt`. La planification ajoute des lignes `@schedule` indentées directement sous cette ligne de lien. Si aucune règle n'est active, le Worker retombe sur la cible normale.

Cela garde la revue saine. Un petit bloc répond à la fois à "est-ce que ce slug existe?" et à "quand est-ce que la destination change?"

## Preferer la CLI

Pour la compatibilité 3.x, `lnk schedule` écrit encore le fichier JSON d'horaire hérité. Pour les nouveaux changements écrits à la main, préférez les lignes `@schedule` inline dans `v8s-links.txt`.

Utilisez [Liens planifiés](/fr/docs/reference/schedules/) pour les exemples exacts, et comparez le bloc de départ `contact` dans `defaults/v8s-links.txt` lorsque vous voulez une référence concrète.
