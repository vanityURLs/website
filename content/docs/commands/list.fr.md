---
title: "lnk list"
description: "Lister les règles de redirection de static.lnk et dynamic.lnk."
nav_order: 23
translationKey: "cmd-list"
---

Affiche les règles de redirection. Par défaut, montre toutes les règles des deux fichiers.

```bash
$ lnk list [--static|--dynamic] [/chemin]
```

## Utilisation

```bash
$ lnk list
SOURCE           DESTINATION                              CODE  FICHIER
/blog            https://blog.example.com                 301   static.lnk
/github          https://github.com/bhdicaire             301   static.lnk
/linkedin        https://linkedin.com/in/bhdicaire        301   static.lnk
/summit          https://summit.example.com/2025          302   dynamic.lnk

4 redirections (3 statiques, 1 dynamique)

$ lnk list /github
SOURCE    DESTINATION                     CODE  FICHIER
/github   https://github.com/bhdicaire   301   static.lnk
```

## Options

| Option | Description |
|--------|-------------|
| `--static` | Afficher uniquement `static.lnk` |
| `--dynamic` | Afficher uniquement `dynamic.lnk` |
| `--short` | Chemins sources uniquement |
| `--json` | Sortie JSON |
| `--count` | Compter uniquement |
