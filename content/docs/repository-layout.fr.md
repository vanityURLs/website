---
aside: false
title: "Structure du depot"
description: "Comment le depot vanityURLs est organise autour des defaults, custom, sorties generees, outillage local, et source Worker."
weight: 70

---

Le depot separe les defaults produit des changements propres a l'instance. Cette separation permet de mettre a jour `defaults/` et `scripts/` sans perdre les liens, le branding, la politique, ou les choix locaux.

```text
defaults/
  public/                         # HTML, CSS, icones, pages localisees, badges
  public/_stats/                  # shell du tableau stats
  v8s-links.txt                   # registre de demo
  v8s-schedules.json              # regles horaires optionnelles
  v8s-policies.json               # politique source par defaut
  v8s-blocklist-categories.json   # categories et severites
  v8s-site-config.json            # langues et branding par defaut
  v8s-local-config.json           # reglages locaux par defaut

custom/
  public/                         # branding et pages de l'instance
  v8s-links.txt                   # liens de l'instance
  v8s-schedules.json              # horaires de l'instance
  v8s-policies.json               # remplacement de politique
  v8s-site-config.json            # langues supportees et branding
  v8s-local-config.json           # chemins du helper et publication locale

scripts/
  workers/
    worker.mjs                    # source canonique du Worker
    worker.test.mjs               # tests du Worker
  lnk                             # CLI Node pour liens, horaires, politiques
  v8s.sh                          # helper local neutre shell
  v8s.zsh                         # wrapper de compatibilite
  build.mjs                       # build defaults + custom
  install.mjs                     # setup initial d'instance
  local-install.mjs               # setup local du poste
  local-publish.mjs               # valider, commit, pousser les chemins locaux
  upgrade.mjs                     # rafraichir depuis upstream

src/
  worker.mjs                      # genere depuis scripts/workers/ pour Wrangler

build/
  v8s.json                        # registre runtime genere
  v8s-blocklist.json              # artefact runtime de politique
  v8s-site-config.json            # configuration de site generee
  ...assets statiques...
```

## Defaults

`defaults/` est la base produit. Il contient les pages publiques, pages d'etat localisees, badges localises, pages de politique, icones, shell stats protege, liens exemples, politique source, horaires, configuration de site, et defaults locaux.

## Custom

`custom/` appartient au proprietaire de l'instance. Placez ici les assets de marque, pages surchargees, listes de liens, horaires, configuration de site, configuration locale et remplacement de politique.

Le build prefere `custom/v8s-links.txt` quand il existe. Sinon il utilise `defaults/v8s-links.txt`, ce qui permet a un clone frais de produire une demo.

`custom/v8s-policies.json` remplace la politique source par defaut. Il ne fusionne pas avec `defaults/v8s-policies.json`.

## Sorties generees

`build/v8s.json` est le registre runtime. Il contient les regles de routage, timestamps, cibles normalisees, etats, metadonnees et horaires.

`build/v8s-blocklist.json` est l'artefact de politique consomme par le Worker.

`build/v8s-site-config.json` garde la configuration de site du build, incluant `i18n.supported_languages` et le branding. Le build retire aussi de `build/` les repertoires de langues non supportees.

`src/` est genere pendant `npm run build` pour que Wrangler deploie `src/worker.mjs`. Ce n'est pas la source de verite. Modifiez `scripts/workers/`, puis laissez le build copier dans `src/`. `npm run clean` retire `build/`, `src/`, et les anciennes sorties de compatibilite.
