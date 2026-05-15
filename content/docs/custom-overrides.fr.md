---
title: "Surcharges custom"
description: "Utiliser custom/ pour marquer une instance vanityURLs tout en gardant les defaults faciles a mettre a jour."
---

Utilisez `custom/` pour les fichiers propres a l'instance. Cela garde les deploiements de type v8s.link faciles a mettre a jour, car les pages par defaut, la logique Worker et les politiques produit peuvent evoluer sans melanger tous les choix de marque locaux.

## Ordre de build

1. Copier `defaults/public/` dans `build/`
2. Appliquer `custom/public/` s'il existe
3. Copier `defaults/public/_stats/index.html`
4. Appliquer `custom/public/_stats/index.html` s'il existe
5. Construire `v8s.json` depuis `custom/v8s-links.txt` s'il existe, sinon depuis `defaults/v8s-links.txt`
6. Fusionner `defaults/v8s-blocklist.json`, `custom/v8s-blocklist.json` optionnel, et les donnees de blocklist generees

## Fichiers custom recommandes

```text
custom/v8s-links.txt
custom/v8s-schedules.json
custom/v8s-blocklist.json
custom/public/v8s-logo.svg
custom/public/v8s-redirected.svg
custom/public/favicon.svg
```

Ajoutez des surcharges HTML ou CSS seulement quand les assets de marque et les fichiers de contenu ne suffisent pas.

## Workflow de mise a jour

```bash
git pull upstream main
npm run generate:blocklist
npm run check
```

Gardez les changements de comportement hors de `defaults/functions/` sauf si vous maintenez un fork. Preferez les surcharges de configuration, politique et assets pour les instances deployables.
