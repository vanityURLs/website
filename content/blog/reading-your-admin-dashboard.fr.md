---
title: "Lire le tableau admin vanityURLs"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Utiliser le tableau _stats protege pour inspecter les routes, les etats de cycle de vie et la qualite des metadonnees sans transformer vanityURLs en CMS."
tags: ["admin", "operations", "cloudflare-access"]
featured: false
aliases:
  - /docs/admin-dashboard/
  - /docs/reference/admin-dashboard/
---

Le tableau `/_stats` est volontairement modeste. Il ne modifie pas les liens, ne publie pas de changements et ne remplace pas la revue Git. Il donne a l'operateur une vue protegee en lecture seule de ce que le Worker fera avec le registre genere.

C'est utile dans les moments ou un fichier texte est un peu trop silencieux : apres un deploiement, avant un nettoyage, quand un lien expire, ou quand quelqu'un demande si un slug est exact, splat, permanent, desactive, ou incomplet.

![Apercu du tableau admin vanityURLs protege](/images/admin-dashboard-preview.svg)

## Quoi verifier

Utilisez le tableau pour repondre aux questions operationnelles :

- combien de routes sont deployees
- quels slugs sont exacts et lesquels sont splat
- quels liens sont expires, desactives, ephemeres ou permanents
- quelles entrees manquent de titre, description, tags, owner ou notes
- quels liens expirent bientot et demandent une decision humaine

C'est le plan routage et cycle de vie. Les analytics restent dans Umami, Fathom ou Cloudflare Analytics.

## Pourquoi lecture seule

vanityURLs traite Git comme la source de verite. Le tableau lit `/_stats/api/v8s.json`, qui derive du registre runtime genere. Modifier depuis le tableau creerait une deuxieme source de verite, exactement la ou les petits outils deviennent surprenants.

Le design en lecture seule garde le workflow simple :

1. modifier `custom/v8s-links.txt`
2. lancer la validation
3. commiter le changement
4. pousser pour deployer
5. utiliser `/_stats` pour confirmer le resultat deploye

## Le proteger

Le tableau devrait etre derriere Cloudflare Access. Protegez `/_stats`, `/_stats/*`, `/_tests`, et `/_tests/*`, puis utilisez [Controle d'acces](/fr/docs/customize/access-control/) comme configuration attendue.

Pour les details de configuration autour de la protection de `/_stats`, utilisez [Controle d'acces](/fr/docs/customize/access-control/).
