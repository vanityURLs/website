---
title: "dynamic.lnk"
description: "Votre liste de redirections temporaires — campagnes, événements, liens éphémères."
nav_order: 9
translationKey: "dynamic-lnk"
---

`dynamic.lnk` contient vos redirections **temporaires** — conférences, campagnes marketing, inscriptions à des événements.

```
# expire : 2025-09-01
/summit2025  https://summit.example.com/2025   302

# Campagnes actives
/promo       https://boutique.example.com?p=ete 302
```

Utilisez `302` pour indiquer aux moteurs de recherche que la destination peut changer.

```bash
lnk add --dynamic /conf2025 https://conf.example.com/2025 302
```
