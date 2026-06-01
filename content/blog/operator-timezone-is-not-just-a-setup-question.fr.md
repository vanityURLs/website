---
title: "Le fuseau horaire de l'opérateur n'est pas seulement une question de setup"
date: 2026-06-01
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs demande un fuseau horaire IANA pour l'opérateur et où cette valeur apparaît après setup."
tags: ["fuseaux-horaires", "opérations", "liens-planifiés"]
featured: false
---

La question du fuseau horaire de l'opérateur dans `npm run setup` ressemble à une petite préférence. Elle est plus utile que ça.

vanityURLs utilise les noms de fuseaux horaires là où un décalage numérique est trop fragile : liens planifiés, métadonnées du registre généré et vues opérateur comme `/en/_stats/`.

## Utiliser un lieu, pas un décalage

Entrez un [fuseau IANA](/fr/docs/reference/timezones/) comme `America/Toronto`, `America/New_York`, `Europe/Paris` ou `UTC`. N'entrez pas `-4`, `-5` ou `GMT-0400`.

Un décalage décrit seulement un moment. Il ne décrit pas l'heure avancée, les transitions historiques ni le contexte de travail normal de l'opérateur. Un fuseau basé sur un lieu laisse le runtime JavaScript gérer EST/EDT ou les autres transitions locales sans demander au propriétaire de l'instance de modifier la configuration deux fois par année.

## Les liens planifiés ont besoin d'une intention locale

Les liens planifiés répondent à des questions comme "pendant les heures de bureau, envoyer `/contact` ici; après les heures, l'envoyer là."

Ce genre de règle est généralement écrit en heure locale humaine. Si l'opérateur veut dire 09:00 à 17:00 à Toronto, l'horaire devrait dire `America/Toronto`, pas le décalage qui était vrai le jour où la règle a été écrite.

Les règles `@schedule` inline peuvent définir leur propre fuseau horaire. Quand elles ne le font pas, la génération du registre et la configuration opérateur ont quand même besoin d'un vocabulaire de fuseaux fiable.

## \_stats a besoin d'une horloge humaine

Le tableau protégé `/en/_stats/` est un outil opérateur. Il aide à confirmer quel registre est déployé, quand il a été généré, quels liens sont planifiés et quelles métadonnées sont présentes.

Ces horodatages et libellés d'horaire sont plus utiles lorsqu'ils s'alignent avec la journée de travail normale de l'opérateur. UTC est excellent pour les systèmes. Un fuseau opérateur local est meilleur pour répondre à "est-ce que le build que je viens de déployer inclut mon changement?"

## La réponse courte

Pour une instance personnelle ou d'équipe, choisissez le fuseau où l'opérateur travaille normalement. Pour une infrastructure opérée globalement, choisissez `UTC` volontairement et documentez ce choix dans le dépôt.

Pour les valeurs acceptées, utilisez [Fuseaux horaires](/fr/docs/reference/timezones/). Pour les exemples d'horaires, utilisez [Liens planifiés](/fr/docs/reference/schedules/).
