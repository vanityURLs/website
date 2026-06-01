---
title: "Lire le tableau admin vanityURLs"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Utiliser le tableau _stats protège pour inspecter les routes, les états de cycle de vie et la qualite des metadonnées sans transformer vanityURLs en CMS."
tags: ["admin", "opérations", "cloudflare-access"]
featured: false
aliases:
  - /docs/admin-dashboard/
  - /docs/référence/admin-dashboard/
---

Le tableau `/en/_stats/` est volontairement modeste. Il ne modifie pas les liens, ne publie pas de changements et ne remplace pas la revue Git. Il donne à l'opérateur une vue protégée en lecture seule de ce que le Worker fera avec le registre génère. Les autres langues prises en charge utilisent le même modèle localisé, comme `/fr/_stats/`.

C'est utile dans les moments ou un fichier texte est un peu trop silencieux : après un déploiement, avant un nettoyage, quand un lien expire, ou quand quelqu'un demande si un slug est exact, splat, permanent, désactive, ou incomplet.

![Aperçu du tableau admin vanityURLs protégé](/images/admin-dashboard-preview.svg)

## Quoi verifier

Utilisez le tableau pour répondre aux questions opérationnelles :

- combien de routes sont déployées
- quels slugs sont exacts et lesquels sont splat
- quels liens sont expires, désactifs, ephemeres ou permanents
- quelles entrées manquent de titre, description, tags, owner ou notes
- quels liens expirent bientôt et demandent une décision humaine
- si l'horodatage du registre déployé correspond au changement que vous venez de pousser

Les cartes de métriques de la première rangée sont des filtres rapides. Cliquez un état de cycle de vie comme Permanent ou Éphémère pour filtrer le tableau, cliquez plusieurs états pour afficher l'un ou l'autre de ces états, et utilisez la recherche en même temps pour une vue plus étroite état plus texte. Cliquez Total pour effacer les filtres du tableau.

C'est le plan routage et cycle de vie. Les analytics restent dans Umami, Fathom ou Cloudflare Analytics.

## Pourquoi lecture seule

vanityURLs traite Git comme la source de vérité. Le tableau lit `/en/_stats/api/v8s.json` ou l'API stats localisée correspondante, qui derive du registre runtime génère. Modifier depuis le tableau créerait une deuxieme source de vérité, exactement la ou les petits outils deviennent surprenants.

Le design en lecture seule garde le workflow simple :

1. modifier `custom/v8s-links.txt`
2. lancer la validation
3. commiter le changement
4. pousser pour déployer
5. utiliser `/en/_stats/` pour confirmer l'horodatage du registre déployé et le résultat

## Le protéger

Le tableau devrait être derrière Cloudflare Access. Protegez `*/_stats`, `*/_stats/*`, `/_tests`, et `/_tests/*`, puis utilisez [Contrôle d'accès](/fr/docs/customize/access-control/) comme configuration attendue. Les anciennes requêtes `/_stats` redirigent vers `/en/_stats/`.

Pour les details de configuration autour de la protection des chemins stats localisés, utilisez [Contrôle d'accès](/fr/docs/customize/access-control/).
