---
aside: false
title: "Liens demo"
description: "Exemples annotes depuis l'inventaire de liens de l'instance de reference v8s.link."
weight: 20

---

Le fichier de depart produit `defaults/v8s-links.txt` est volontairement petit : `home`, `status`, et `docs`. L'instance demo v8s.link peut porter un inventaire `custom/v8s-links.txt` plus large pour montrer les conventions de nommage, namespaces, etats lifecycle et liens projet.

## Exemples namespaces

L'inventaire demo groupe les liens par zone d'usage :

| Prefixe | Exemples | Usage |
|---|---|---|
| `ai/` | `ai/chat`, `ai/claude`, `ai/hf` | Outils IA et ressources modeles |
| `edu/` | `edu/a`, `edu/d`, `edu/s` | Recherche et references academiques |
| `g/` | `g/cal`, `g/drive`, `g/meet` | Surfaces productivite Google |
| `meet/` | `meet/g`, `meet/t`, `meet/z` | Alias de salles de reunion |
| `pkg/` | `pkg/d`, `pkg/n`, `pkg/p`, `pkg/r` | Registres de packages |
| `social/` | `social/fb`, `social/ig`, `social/x` | Profils sociaux |
| `v8s/` | `v8s/code`, `v8s/doc`, `v8s/status` | Liens du projet vanityURLs |

Le namespacing garde l'espace racine propre tout en permettant des URLs memorables comme `v8s.link/social/x`.

## Liens de test lifecycle

L'inventaire demo inclut des liens qui testent chaque etat runtime :

| Slug | Etat | Comportement attendu |
|---|---|---|
| `test/1` | `permanent` | 301 vers la cible |
| `test/2` | `ephemeral` | 302 vers la cible |
| `test/3` | `expired` | 302 vers `/expired` |
| `test/4` | `disabled` | 302 vers `/disabled` |
| `test/5` | `maintenance` | 302 vers `/maintenance` |
| `test/6` | `deactivated` | vrai 404 |

Ces liens servent a la validation. Remplacez-les dans votre `custom/v8s-links.txt` sauf si vous voulez des probes lifecycle publics sur votre domaine.

## Liens projet

Le namespace `v8s/` montre comment une instance publique peut se documenter :

```text
v8s/code|github.com/vanityURLs/vanityURLs||V8S web site|documentation|v8s,git|bhd|||
v8s/doc|vanityUrls.link/en/docs/||VanityURLs documentation||v8s,git|bhd|||
v8s/status|status.vanityUrls.link||Uptime monitoring|status page|v8s,web|bhd|||
```

L'etat omis retombe sur le default du registre. Le build normalise les hostnames nus vers `https://`.

## Ce qu'il faut changer

Pour une nouvelle instance, gardez la structure mais remplacez les lignes exemples par vos propres liens, owners et tags. Ajoutez `custom/v8s-schedules.json` seulement pour les liens qui ont besoin de destinations horaires.
