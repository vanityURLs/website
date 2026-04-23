---
title: "lnk remove"
description: "Supprimer une règle de redirection de static.lnk ou dynamic.lnk."
nav_order: 22
---

Supprime une redirection par son chemin source. Recherche dans les deux fichiers par défaut.

```bash
$ lnk remove /chemin
```

## Utilisation

```bash
$ lnk remove /summit
Trouvé dans dynamic.lnk : /summit → https://summit.example.com/2025  302
Supprimer ? [o/N] o
Supprimé : /summit de dynamic.lnk

$ lnk remove --static /ancien-lien
Supprimé : /ancien-lien de static.lnk
```

## Options

| Option | Description |
|--------|-------------|
| `--static` | Chercher uniquement dans `static.lnk` |
| `--dynamic` | Chercher uniquement dans `dynamic.lnk` |
| `--force`, `-f` | Supprimer sans confirmation |
| `--dry-run` | Afficher sans supprimer |

{{< callout type="warning" >}}
La suppression prend effet au prochain `git push`. Exécutez `lnk deploy` immédiatement après la suppression de liens sensibles au temps.
{{< /callout >}}
