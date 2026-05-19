---
title: "Registre runtime"
description: "Comment v8s construit le registre de routage prive et les artefacts runtime utilises par le Worker Cloudflare."
---

Le Worker ne lit pas `v8s-links.txt` a chaque requete. Le build cree un registre runtime prive dans `build/v8s.json` et le publie comme asset interne.

Les requetes publiques directes vers les fichiers runtime bruts retournent 404 :

```text
/v8s.json
/v8s-blocklist.json
/v8s-site-config.json
```

## Entrees de build

Les artefacts runtime sont generes depuis :

- `defaults/v8s-links.txt`, remplace par `custom/v8s-links.txt` quand present
- `defaults/v8s-schedules.json`, avec `custom/v8s-schedules.json` fusionne par-dessus
- `defaults/v8s-policies.json`, remplace par `custom/v8s-policies.json` quand present
- `defaults/v8s-site-config.json`, avec `custom/v8s-site-config.json` fusionne pour les choix de site
- les assets statiques de `defaults/public/`, surcharges par `custom/public/`
- les donnees de feeds generees par `npm run generate:blocklist`

Utilisez `custom/` pour chaque changement propre a l'instance.

## Artefacts runtime

| Artefact | Role |
|---|---|
| `build/v8s.json` | Registre de redirection consomme par le Worker. |
| `build/v8s-blocklist.json` | Artefact de politique runtime consomme par le Worker. |
| `build/v8s-site-config.json` | Configuration de site utilisee par le build. |
| `src/worker.mjs` | Entree Worker generee depuis `scripts/workers/` pour Wrangler. |

`scripts/workers/` est la source de verite du Worker. `src/` est une sortie generee.

Le cache local du helper, habituellement `~/.v8s.json`, est separe de `build/v8s.json`.

## Forme du registre

L'objet principal contient :

- `schema_version`
- `generated_at`
- `source`
- `links`
- `splats`
- `schedules`
- `blocklist`

Une entree de lien garde l'URL cible normalisee, l'etat, le statut HTTP, le libelle, la description, les tags, le proprietaire et les metadonnees optionnelles.

## Ordre de resolution

Pour chaque requete, le Worker :

1. refuse les assets runtime bruts et les probes de scanners;
2. accepte seulement `GET`, `HEAD`, et `OPTIONS` pour les routes publiques;
3. normalise le chemin;
4. cherche un lien exact;
5. cherche un lien splat si aucun exact ne correspond;
6. applique les horaires et l'etat;
7. retourne une redirection, une page d'information, ou une 404.

Les horaires s'appliquent seulement aux liens exacts.

## Pourquoi JSON plutot qu'une base de donnees

v8s est un moteur de redirection, pas une application de contenu public. Un registre genere garde chaque release facile a auditer, reproduire et annuler. L'historique Git enregistre les changements de liens, Cloudflare deploie une version immuable du Worker, et le runtime garde tres peu d'etat mutable.
