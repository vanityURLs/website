---
aside: false
title: "Vue d'ensemble custom"
description: "Planifier la personnalisation de phase 2 apres la mise en ligne d'une premiere instance vanityURLs."
weight: 10

---

Quand le demarrage rapide fonctionne, la personnalisation est le moment ou l'instance devient la votre. Utilisez cette section quand vous etes pret a raffiner les liens, la marque, les pages publiques, la politique, le controle d'acces, les analytics et les reglages operationnels.

Pour une carte pratique des premieres zones a personnaliser, lisez [Par ou commencer la personnalisation de vanityURLs](/fr/blog/where-to-start-customizing-vanityurls/).

La regle importante est simple : modifiez `custom/`, pas les fichiers generes dans `build/`. Les defaults produit vivent dans `defaults/`; vos choix propres a l'instance vivent dans `custom/`; le build combine les deux dans les assets Worker et les JSON runtime deployes par Cloudflare.

Pour le comportement exact des fichiers, utilisez [Fichiers de configuration](/fr/docs/configuration-files/) et [Surcharges custom](/fr/docs/custom-overrides/).
