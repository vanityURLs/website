---
aside: false
title: "Personnaliser"
description: "Planifier la personnalisation de phase 2 après la mise en ligne d'une première instance vanityURLs."
weight: 20
aliases:
  - /docs/customize-overview/
---

Quand le demarrage rapide fonctionne, la personnalisation est le moment ou l'instance devient la votre. Utilisez cette section quand vous êtes prêt a raffiner les liens, la marque, les pages publiques, la politique, le contrôle d'accès, les analytics et les réglages opérationnels.

Pour une carte pratique des premières zones a personnalisér, lisez [Par ou commencer la personnalisation de vanityURLs](/fr/blog/where-to-start-customizing-vanityurls/).

La règle importante est simple : modifiez `custom/`, pas les fichiers génères dans `build/`. Les defaults produit vivent dans `defaults/`; vos choix propres à l'instance vivent dans `custom/`; le build combine les deux dans les assets Worker et les JSON runtime déployés par Cloudflare.
