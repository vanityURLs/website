---
title: "Registre runtime"
description: "Comment v8s genere le registre de routage prive schema 2.2 utilise par le Worker Cloudflare."
---

Le Worker ne lit pas `v8s-links.txt` a chaque requete. Le build cree un registre runtime prive dans `build/v8s.json` et le publie comme asset interne. Les requetes publiques directes vers `v8s.json`, `redirect-targets.json`, et les assets de blocklist retournent 404.

Le registre est volontairement simple : un fichier JSON genere, schema version `2.2`, valide avant deploiement, consomme par un seul Worker.

## Entrees du build

Le registre est genere a partir de :

- `defaults/v8s-links.txt`, puis `custom/v8s-links.txt`
- `defaults/v8s-schedules.json`, puis `custom/v8s-schedules.json`
- `defaults/v8s-blocklist.json`, les donnees blocklist generees, et `custom/v8s-blocklist.json`
- les assets statiques de `defaults/public/`, surcharges par `custom/public/`

Utilisez `custom/` pour chaque changement propre a une instance. Les mises a jour futures restent simples : upstream peut rafraichir `defaults/` et `scripts/`, pendant que l'instance garde ses liens, sa politique, son habillage, ses pages legales, et ses secrets generes.

## Structure du registre

L'objet principal contient :

- `schema_version` : actuellement `2.2`
- `generated_at` : horodatage du build
- `source` : fichier source utilise pour generer les liens actifs
- `links` : regles exactes indexees par chemin
- `splats` : regles wildcard comme `docs/*`
- `schedules` : fenetres temporelles optionnelles pour les liens exacts
- `blocklist` : politique de securite runtime fusionnee

Une entree de lien stocke l'URL cible normalisee, l'etat de redirection, le statut HTTP, le libelle, la description, les tags, le proprietaire, et des metadonnees optionnelles. Les entrees splat gardent le prefixe parent et ajoutent le suffixe capture a la destination quand le lien est actif.

## Ordre de resolution

Pour chaque requete, le Worker suit un chemin volontairement etroit :

1. Rejeter les assets d'implementation prives et les probes scanner connus.
2. Accepter seulement `GET`, `HEAD`, et `OPTIONS`.
3. Normaliser le chemin entrant.
4. Chercher un lien exact.
5. Si aucun lien exact ne correspond, chercher un lien splat.
6. Appliquer la planification et l'etat de cycle de vie.
7. Retourner une redirection, une page informative, ou un 404.

Les planifications s'appliquent seulement aux liens exacts. Les liens splat sont utiles pour des espaces de noms stables, mais ils ne devraient pas servir aux redirections sensibles au temps.

## Etats des liens

Le runtime supporte des etats stables :

| Etat | Comportement |
|---|---|
| `permanent` | redirection 301 |
| `ephemeral` | redirection 302 |
| `scheduled` | redirection seulement pendant les fenetres configurees |
| `inactive` | page inactive |
| `deprecated` | page deprecation |
| `hidden` | 404 |

La validation detecte les etats non supportes, les URL mal formees, les cibles dangereuses, les alias dupliques, les parents splat risques, et les erreurs de planification avant le deploiement du Worker.

## Pourquoi JSON plutot qu'une base de donnees

v8s est un moteur de redirection, pas une application de contenu publique. Un registre genere garde la release facile a auditer, reproduire, et restaurer. L'historique Git enregistre chaque changement de lien, Cloudflare deploie une version immuable du Worker, et le runtime a tres peu d'etat mutable a attaquer.

Si une future instance publique demande de l'edition deleguee, la surface admin devrait ecrire les changements dans des fichiers revises ou une source de verite aussi auditable. Le runtime doit rester petit.
