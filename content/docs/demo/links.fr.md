---
aside: false
title: "Liens demo"
description: "Les liens de depart utilises par l'instance demo v8s.link."
weight: 20

---

La demo v8s.link garde volontairement le meme inventaire de depart que `npm run setup` cree depuis `defaults/v8s-links.txt`.

## Liens actuels

| Slug | Lien long | Usage |
|---|---|---|
| `home` | `https://v8s.link` | Lien vers l'accueil |
| `status` | `https://status.v8s.link` | Placeholder de page de statut |
| `docs` | `https://vanityURLs.link/en/docs/` | Documentation vanityURLs |

```text
# slug|target|state|title|description|tags|owner|expires_at|notes
home|https://v8s.link|permanent|Home|Primary website|core|bhd||
status|https://status.v8s.link|ephemeral|Status|Service status page|status|bhd||
docs|https://vanityURLs.link/en/docs/|permanent|Docs|vanityURLs documentation|docs|bhd||
```

## Pourquoi la demo est petite

La demo sert a prouver que le Quickstart fonctionne, pas a devenir un grand repertoire public de liens exemples. Les inventaires plus larges, namespaces, exemples lifecycle, horaires et migrations appartiennent a des pages de documentation ou des billets de blogue plus cibles.

Lancez `./scripts/lnk list` dans votre propre instance pour voir le meme inventaire de depart apres setup.
