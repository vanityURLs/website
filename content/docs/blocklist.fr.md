---
title: "Politique blocklist"
description: "Politique anti-abus par defaut et custom pour URLs cibles, chaines de raccourcisseurs, malware, schemas risqués et overrides locaux."
---

vanityURLs utilise `defaults/v8s-blocklist.json` comme politique anti-abus upstream. La politique propre a l'instance vit dans `custom/v8s-blocklist.json` et surcharge les defaults.

L'objectif est de proteger la reputation d'un domaine court en reduisant phishing, malware, chaines de redirection, et formes d'URL risquees.

## Protections par defaut

- Protocoles non HTTP(S)
- Identifiants integres dans les URLs
- Cibles localhost, `.localhost`, et `.local`
- Reseaux prives, loopback, reserves, multicast, et IPs de documentation
- Raccourcisseurs publics connus utilises pour les chaines
- Exemples locaux de domaines leurres de phishing
- Extensions executables a haut risque comme `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, et `.jar`

## Overrides

`allow_domains` peut contourner des blocs de domaines generes ou locaux pour des domaines fiables controles par le proprietaire. Il ne contourne pas les URLs mal formees, protocoles interdits, ou URLs avec identifiants.

Les regles keyword comparent hostname, chemin et query string apres conversion en minuscules. Gardez-les specifiques pour eviter les faux positifs.

## Blocklist generee

Generez les donnees machine optionnelles avec :

```bash
npm run generate:blocklist
```

Le fichier genere est fait pour CI ou deploiement, pas pour l'edition manuelle. Revisez les grands changements de flux upstream avant de les promouvoir dans les defaults.
