---
aside: false
title: "Format des liens"
description: "Le format v8s-links.txt pour liens exacts, splat, etats, metadonnees, expiration et v8s.json genere."
weight: 70
aliases:
  - /docs/link-format/

---

`v8s-links.txt` est la source de verite humaine pour les liens. Chaque ligne non vide et non commentee est separee par des pipes :

```text
slug|target|state|title|description|tags|owner|expires_at|notes
```

| Champ | Requis | Description |
|---|---|---|
| `slug` | oui | Chemin sans `/` initial |
| `target` | oui | URL `http` ou `https`, ou hostname normalise vers `https://` |
| `state` | non | `permanent`, `ephemeral`, `expired`, `disabled`, `maintenance`, `deactivated` |
| `title` | non | Titre pour le dashboard |
| `description` | non | Usage humain du lien |
| `tags` | non | Tags separes par virgules |
| `owner` | recommande | Etiquette de responsabilite |
| `expires_at` | non | Date ou timestamp ISO |
| `notes` | non | Notes internes |

## Liens exacts

```text
social/x|https://x.com/vanityURLs|permanent|X / Twitter|Profil social|social,x|v8s||
```

Le lien resout seulement `/social/x`.

## Liens splat

Ajoutez `/*` au slug et incluez `:splat` dans la cible :

```text
github/*|https://github.com/vanityURLs/:splat|permanent|GitHub|Namespace|git|v8s||
```

`/github/website` redirige vers `https://github.com/vanityURLs/website`.

## Etats

| Etat | Comportement runtime |
|---|---|
| `permanent` | 301 vers la cible |
| `ephemeral` | 302 vers la cible |
| `expired` | 302 vers `/expired` |
| `disabled` | 302 vers `/disabled` |
| `maintenance` | 302 vers `/maintenance` |
| `deactivated` | vrai 404 |

Si `expires_at` est passe, l'etat effectif devient `expired`.

## Regles de slug

- Pas de slash initial ou final
- Pas de segment vide
- Pas de query string ou fragment
- Chaque segment commence par une lettre ou un chiffre
- Les segments peuvent contenir lettres, chiffres, `.`, `_`, `~`, et `-`

Les slugs reserves incluent `admin`, `404`, `expired`, `disabled`, `maintenance`, `deactivated`, `assets`, et `v8s.json`.
