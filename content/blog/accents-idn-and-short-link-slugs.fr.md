---
title: "Accents, IDN et slugs de liens courts"
date: 2026-06-01
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs garde les slugs de liens courts en ASCII, tout en acceptant les URL de destination HTTP(S) normales."
tags: ["urls", "i18n", "liens-courts", "sécurité"]
featured: false
---

Les accents ont leur place dans les noms, les textes, les titres et les sites de destination. Ils n'ont pas leur place dans les slugs de liens courts vanityURLs.

Ce choix peut sembler plus strict que le Web moderne. Les navigateurs peuvent afficher des noms de domaine internationalisés. Les URL peuvent transporter des caractères UTF-8. Les moteurs de recherche savent explorer des chemins avec accents. Les gens partagent des liens dans plusieurs langues tous les jours.

Le problème n'est pas de savoir si l'internet peut représenter les accents. Il le peut. Le problème est de savoir si un slug de lien court reste facile à taper, relire, comparer, journaliser et protéger quand le même mot visible peut avoir plus d'une représentation technique.

## Les domaines sont un cas particulier

Les noms de domaine internationalisés utilisent IDNA et Punycode. Un navigateur peut afficher `éxample.test`, pendant que DNS stocke une forme compatible ASCII qui commence par `xn--`.

Cette traduction existe parce que DNS a des racines ASCII anciennes. Elle ajoute aussi une charge de sécurité et d'utilisabilité : certains caractères se ressemblent, certains scripts peuvent être confondus, et les applications ne choisissent pas toujours les mêmes règles d'affichage.

Pour un service de liens courts, la posture la plus sûre est simple : utiliser un domaine contrôlé par l'opérateur, garder la configuration DNS et Cloudflare explicite, et traiter le support IDN comme une décision d'enregistrement de domaine plutôt qu'une fonction de slug.

## Les chemins sont différents

Le chemin après le domaine n'est pas DNS. Un chemin comme `/résumé` peut être encodé, décodé, copié, normalisé et affiché différemment selon les outils :

- Unicode peut être représenté en forme composée ou décomposée.
- Les navigateurs peuvent afficher des caractères lisibles pendant que les journaux montrent de l'encodage pour cent.
- Les shells, tableurs, outils de clavardage, encodeurs QR et exports analytics peuvent préserver ou réécrire les octets différemment.
- Des caractères visuellement proches peuvent rendre la revue plus difficile.

C'est un mauvais compromis pour un slug court, dont le travail est d'être petit, visible et prévisible.

## La politique vanityURLs

vanityURLs garde les slugs de liens courts en ASCII :

- lettres `A-Z` et `a-z`
- chiffres `0-9`
- point, soulignement, tilde et trait d'union à l'intérieur d'un segment
- barre oblique seulement comme séparateur de chemin

Les pages localisées peuvent quand même utiliser des alias propres à chaque langue, mais ces alias devraient aussi rester en ASCII. Par exemple, le français peut utiliser `/fr/consultation` plutôt qu'un slug accentué.

Cette règle rend la saisie manuelle fiable, clarifie les diffs Git et la revue, évite les surprises de normalisation Unicode et réduit le risque de slugs visuellement ambigus.

## URL de destination

Les URL de destination sont différentes. Elles appartiennent au site cible, pas à l'espace de noms du lien court.

vanityURLs ne devrait pas réécrire agressivement une destination HTTP(S) valide. Le build et le runtime devraient plutôt imposer des propriétés de sécurité :

- l'URL doit être absolue en `http` ou `https`
- elle doit avoir un nom d'hôte
- elle ne doit pas contenir d'identifiants intégrés
- elle ne doit pas contenir de caractères de contrôle
- les états qui redirigent sont vérifiés par la politique de blocage de l'instance

Quand une destination contient de l'Unicode, le parseur d'URL de la plateforme peut sérialiser le nom d'hôte avec IDNA et encoder les caractères du chemin au besoin. C'est un traitement normal d'URL, pas une politique de slug vanityURLs.

La version courte : gardez les slugs en ASCII. Laissez les propriétaires de destinations contrôler leurs URL. Validez les destinations pour la sécurité des redirections plutôt que de translittérer l'internet.
