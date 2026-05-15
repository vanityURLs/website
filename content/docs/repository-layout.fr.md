---
title: "Structure du depot"
description: "Organisation du depot vanityURLs actuel autour des defaults, surcharges custom, sortie generee et source Worker."
---

Le depot separe les defaults du produit des changements propres a une instance. Cette separation rend v8s.link utile comme implementation de reference et permet de mettre a jour le code upstream sans perdre la marque locale.

```text
defaults/
  public/                 # HTML, CSS, icones et pages localisees par defaut
  public/_stats/          # shell du tableau stats en lecture seule
  v8s-links.txt           # registre demo/par defaut
  v8s-schedules.json      # regles de planification optionnelles
  v8s-blocklist.json      # politique anti-abus par defaut
  v8s-blocklist-categories.json

custom/
  public/                 # marque et pages propres a l'instance
  v8s-links.txt           # liens de l'instance
  v8s-schedules.json      # planifications de l'instance
  v8s-blocklist.json      # politique locale allow/block

scripts/
  src/
    worker.mjs            # source canonique du Worker runtime
    worker.test.mjs       # tests du Worker runtime
  lnk                     # CLI Node pour liens et planifications
  build.mjs               # build defaults + custom vers la sortie deploy
  clean.mjs               # supprime la sortie generee
  upgrade.mjs             # rafraichit les fichiers produit depuis upstream

build/
  v8s.json                # registre runtime genere
  v8s-blocklist.json      # politique anti-abus generee
  ...assets statiques...
```

## Defaults

`defaults/` est la base du produit. L'instance publique v8s.link utilise ces fichiers pour montrer un raccourcisseur fonctionnel avec page d'accueil de recherche, page expand, pages d'etat localisees, icones, shell stats protege, et liens exemples.

## Custom

`custom/` appartient au proprietaire de l'instance. Placez ici les assets de marque, favicons, pages surchargees, listes de liens, planifications et politiques locales.

Le build prefere `custom/v8s-links.txt` quand il existe. Sinon, il utilise `defaults/v8s-links.txt`, ce qui permet a un clone frais de produire une demo utilisable.

## Sortie generee

`build/v8s.json` est le registre runtime. Il contient schema `2.2`, regles de routage, horodatage, cibles normalisees, etats, metadonnees, et blocs de planification optionnels.

Cloudflare sert les pages statiques depuis `build/`; le Worker lit `v8s.json` pour resoudre les liens courts.

`src/` est genere pendant `npm run build` pour que Wrangler puisse deployer `src/worker.mjs`. Ce n'est pas la source de verite. Modifiez `scripts/src/worker.mjs`, puis laissez le build le copier au bon endroit. `npm run clean` supprime les sorties generees `build/`, `src/`, et `functions/`.
