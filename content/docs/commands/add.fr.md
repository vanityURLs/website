---
title: "lnk add"
description: "Ajouter une règle de redirection à static.lnk ou dynamic.lnk."
nav_order: 21
translationKey: "cmd-add"
---

Ajoute une règle de redirection. Par défaut la règle va dans `static.lnk` avec un statut `301`. Utilisez `--dynamic` pour cibler `dynamic.lnk`.

```bash
$ lnk add /chemin https://destination [statut]
```

## Utilisation

```bash
$ lnk add /github https://github.com/bhdicaire
Ajouté à static.lnk : /github → https://github.com/bhdicaire  301

$ lnk add --dynamic /summit https://summit.example.com/2025 302
Ajouté à dynamic.lnk : /summit → https://summit.example.com/2025  302
```

## Options

| Option | Défaut | Description |
|--------|--------|-------------|
| `--static` | ✓ | Ajouter à `static.lnk` |
| `--dynamic` | | Ajouter à `dynamic.lnk` |
| `--status CODE` | `301` | Code de statut HTTP |
| `--comment TEXTE` | | Ajouter un commentaire `#` au-dessus |
| `--dry-run` | | Afficher sans écrire |

## Codes de statut

| Code | Nom | Usage |
|------|-----|-------|
| `301` | Déplacé de façon permanente | Liens stables |
| `302` | Trouvé (temporaire) | Campagnes, tests A/B |
| `307` | Redirection temporaire | Préserve la méthode HTTP |
| `308` | Redirection permanente | Idem, de façon permanente |

{{< callout type="tip" title="Chemins en double" >}}
`lnk add` vous avertit si le chemin existe déjà dans l'un des fichiers, et demande confirmation avant d'écraser.
{{< /callout >}}
