---
aside: false
title: "Décisions de setup"
description: "Comprendre les réponses de setup qu'il est sécuritaire de différer jusqu'à la phase de personnalisation."
nav_order: 2
---

Le Quickstart garde la phase 1 concentrée sur un redirecteur fonctionnel. Certaines réponses de setup sont requises opérationnellement, tandis que d'autres sont mieux raffinées après le premier déploiement.

## Pages légales

L'installateur peut différer les pages confidentialité, conditions et sécurité à la phase 2. Si vous les différez, vanityURLs déploie quand même Trust & Safety et `security.txt` afin que les gens aient un endroit pour signaler les abus ou vulnérabilités.

Voir [Pages légales et de confiance](/fr/docs/legal-trust-pages/) pour les questions de setup sur l'identité opérateur, la juridiction, le droit applicable, les dates de dernière mise à jour et les fenêtres de réponse Trust & Safety.

## Analytics

Utilisez `disabled` pour la phase 1. Une fois les redirections fonctionnelles, décidez si les analytics répondent à une question opérationnelle concrète.

Si les analytics restent désactivés, le setup ignore les questions de divulgation et de rétention analytics. Si vous activez Fathom ou Umami, le setup pose ces questions parce que la page de confidentialité générée doit expliquer ce qui est activé et combien de temps le fournisseur analytics garde les données.

Voir [Analytics](/fr/docs/analytics/) pour les détails de configuration.

## Valeurs par défaut dérivées

Certaines valeurs par défaut du setup sont dérivées des réponses précédentes afin que l'installateur ne demande pas deux fois la même idée. Par exemple, le domaine court opérateur est dérivé du domaine court, et les adresses de contact utilisent par défaut des parties locales utiles sur ce domaine.

Vous pouvez lancer `npm run setup` aussi souvent que vous voulez. L'installateur est idempotent : il lit votre configuration existante, affiche vos réponses précédentes comme valeurs par défaut et met à jour les mêmes fichiers générés sans exiger un nouveau clone.
