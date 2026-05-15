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

## Pages legales et politiques

Chaque proprietaire d'instance publique est responsable de ses propres conditions, avis de confidentialite, contact abus, et contact securite. Les defaults et exemples ne sont pas des conseils juridiques. Ce sont des placeholders et des patterns produit, pas une politique relue par un avocat pour chaque juridiction ou usage.

Utilisez `custom/public/` pour publier les pages propres a l'instance, par exemple :

```text
custom/public/terms.html
custom/public/privacy.html
custom/public/abuse.html
custom/public/security.html
custom/public/robots.txt
custom/public/llms.txt
custom/public/llms-full.txt
```

Pour la plupart des deploiements vanityURLs, gardez `robots.txt` restrictif. Une instance de liens courts est un moteur de redirection, pas un site de contenu public, et la politique par defaut vise a decourager la recolte en masse.

Mettez a jour les pages legales et politiques quand l'audience, le fournisseur analytics, le workflow abus, ou les pratiques de retention de donnees changent.

## Workflow de mise a jour

```bash
git pull upstream main
npm run generate:blocklist
npm run check
```

Gardez les changements de comportement hors de `defaults/functions/` sauf si vous maintenez un fork. Preferez les surcharges de configuration, politique et assets pour les instances deployables.
