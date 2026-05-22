---
aside: false
title: "Tableau admin"
description: "Tableau operationnel en lecture seule pour inventaire, etats effectifs, qualite metadata et stats protegees."
---

Le tableau admin est volontairement en lecture seule. C'est une vue operationnelle du registre genere, pas un CMS.

Il lit :

```text
/_stats/api/v8s.json
```

L'acces public direct aux fichiers runtime bruts comme `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json` doit rester bloque.

## Ce qu'il montre

- Inventaire des routes
- Etat effectif
- Routage exact vs splat
- Revue des expirations
- Qualite des metadonnees
- Comportement de la table de routage
- Filtres expire bientot et metadata manquante

Les analytics restent dans Umami ou Fathom. Le dashboard est le plan routage et cycle de vie; les outils analytics sont le plan mesure.

## Protection

Protegez `/_stats`, `/_stats/*`, `/_tests`, et `/_tests/*` avec Cloudflare Access. Le Worker valide l'assertion Access et reste ferme si la protection est incomplete.

## Build recommande

Utilisez la commande complete pour Cloudflare et CI :

```bash
npm run check
```

Gardez le repertoire de sortie :

```text
build
```
