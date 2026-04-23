---
title: "Commandes"
description: "Référence complète de toutes les commandes lnk CLI."
nav_order: 20
---

Le script `lnk` est l'interface principale pour gérer vos redirections vanityURLs en ligne de commande. Exécutez `lnk --help` pour voir toutes les commandes disponibles.

```bash
$ lnk --help
Commands:
  lnk add      /chemin https://destination [code]   # Ajouter une redirection
  lnk remove   /chemin                              # Supprimer une redirection
  lnk list     [--static|--dynamic] [/chemin]       # Lister les redirections
  lnk check    /chemin                              # Vérification HTTP en direct
  lnk validate [--live]                             # Valider la syntaxe et les destinations
  lnk deploy   ["message de commit"]                # Committer, pousser et déployer
  lnk help     [COMMANDE]                           # Aide sur une commande
  lnk version                                       # Version de lnk
```

## Options globales

| Option | Description |
|--------|-------------|
| `--static` | Cibler `static.lnk` (défaut pour la plupart des commandes) |
| `--dynamic` | Cibler `dynamic.lnk` |
| `--quiet`, `-q` | Supprimer la sortie non-erreur |
| `--verbose`, `-v` | Afficher une sortie détaillée |
| `--help`, `-h` | Afficher l'aide |

## Commandes

{{< cards cols="2" >}}
{{< card title="lnk add" icon="bolt" href="/fr/docs/commands/add/" >}}
Ajouter une redirection à static.lnk ou dynamic.lnk.
{{< /card >}}
{{< card title="lnk remove" icon="warning" href="/fr/docs/commands/remove/" >}}
Supprimer une redirection par son chemin source.
{{< /card >}}
{{< card title="lnk list" icon="docs" href="/fr/docs/commands/list/" >}}
Lister toutes les redirections ou filtrer par fichier.
{{< /card >}}
{{< card title="lnk check" icon="check" href="/fr/docs/commands/check/" >}}
Effectuer une vérification HTTP en direct.
{{< /card >}}
{{< card title="lnk validate" icon="security" href="/fr/docs/commands/validate/" >}}
Valider la syntaxe et les destinations.
{{< /card >}}
{{< card title="lnk deploy" icon="deploy" href="/fr/docs/commands/deploy/" >}}
Committer et pousser pour déclencher un déploiement.
{{< /card >}}
{{< /cards >}}
