---
aside: false
title: "Vue d'ensemble de l'interface en ligne de commande"
description: "Choisir entre le helper local en lecture seule et l'interface en ligne de commande lnk."
weight: 5
---

vanityURLs fournit deux outils locaux en ligne de commande, avec des roles differents.

| Outil | Utilisez-le quand |
| --- | --- |
| [Helper local](/fr/docs/local-helper/) | Vous voulez ouvrir un lien court existant depuis le terminal |
| [LNK](/fr/docs/cli/) | Vous voulez modifier les liens, horaires ou politiques source dans `custom/` |

Le helper local est en lecture seule. Il lit le registre genere et ouvre des redirections connues.

`lnk` modifie l'instance. Il edite les fichiers source dans `custom/`, lance les validations, commit et pousse les operations d'ecriture reussies.
