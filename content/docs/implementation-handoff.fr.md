---
aside: false
title: "Passation implementation"
description: "Notes courantes pour mettre a jour la documentation sur defaults, custom, l'outillage local, les politiques, les langues, les badges et les workflows d'installation."
---

Cette page consolide les decisions cote code qui doivent etre evaluees lors des mises a jour de la documentation. C'est une passation de travail pour la documentation, pas un remplacement du code source.

## Modele mental principal

`defaults/` est la base produit. Il contient les pages, actifs, politiques, horaires, liens d'exemple, configuration du site et defaults d'installation locale livres avec vanityURLs.

`custom/` appartient au proprietaire de l'instance. Il contient les liens locaux, horaires locaux, remplacement de politique locale, pages publiques personnalisees, configuration du site locale et configuration du poste de travail. Le proprietaire doit pouvoir mettre a jour `defaults/` et `scripts/` sans perdre ses choix dans `custom/`.

`build/` est une sortie generee. Il contient les actifs statiques runtime, `v8s.json`, `v8s-blocklist.json` et `v8s-site-config.json`. Il peut etre retire avec `npm run clean`.

`src/` est genere pendant le build depuis `scripts/workers/` pour la compatibilite Wrangler. La source de verite est `scripts/workers/`, pas `src/`.

Le registre runtime a deux copies locales utiles :

- `build/v8s.json` est l'artefact de build dans le depot
- Le chemin de registre poste de travail, habituellement `~/.v8s.json`, est le cache du helper local

`lnk` modifie les fichiers source dans `custom/`. Les scripts npm peuvent construire, valider, publier, installer des helpers, copier des sorties generees ou mettre a jour des chemins locaux.

## Fichiers de configuration

L'ensemble de configuration source courant est :

```text
defaults/v8s-links.txt
defaults/v8s-schedules.json
defaults/v8s-policies.json
defaults/v8s-blocklist-categories.json
defaults/v8s-site-config.json
defaults/v8s-local-config.json
```

`custom/v8s-links.txt` est le fichier de liens de l'instance. La CLI y ecrit les liens. Si le fichier n'existe pas, la CLI le cree.

`custom/v8s-policies.json` remplace le fichier de politique source par defaut pour les decisions de l'instance. Les elements retires de la politique custom ne doivent pas revenir par fusion avec les defaults. Les anciens noms `v8s-blocklist.json` sont encore reconnus par certains chemins de code pour compatibilite de migration, mais la documentation devrait preferer `v8s-policies.json`.

`build/v8s-blocklist.json` reste le nom du fichier runtime consomme par le Worker. Cette distinction est intentionnelle : la politique source est editee comme politique; la sortie runtime est servie comme artefact de blocage.

`custom/v8s-site-config.json` stocke les choix de site de l'instance, notamment les langues supportees, le branding, le slogan public et les contacts operateur.

`custom/v8s-local-config.json` stocke les choix du poste de travail comme les chemins d'installation, le registre local, le chemin du depot et les defaults de publication locale. Il est cree ou mis a jour par `npm run local-install`.

## Build

Le build copie `defaults/public/`, copie les defaults anglais a la racine publique, superpose `custom/public/` lorsqu'il contient des fichiers, retire les repertoires de langues non supportees de `build/`, construit `v8s-blocklist.json`, construit `v8s.json`, ecrit `v8s-site-config.json` et ajuste la liste des langues dans le Worker genere.

Si `custom/public/` est utilise, le proprietaire devrait definir les langues supportees dans `custom/v8s-site-config.json`. Sinon l'instance peut devenir incoherente : une ou deux langues personnalisees avec toutes les autres langues par defaut encore presentes.

Les pages de politique anglaises ont des alias sans extension comme `/privacy`, `/terms`, `/abuse` et `/security`. Les pages francaises sont servies sous `/fr/privacy.html`, `/fr/terms.html`, `/fr/abuse.html` et `/fr/security.html`.

Les pages publiques anglaises et francaises par defaut incluent maintenant des liens de bas de page vers ces politiques. Les pages espagnoles, italiennes et allemandes sont localisees pour les pages principales et d'etat, mais n'ont pas encore de pages de politique equivalentes.

## Installation d'instance

`npm run setup` lance l'installateur d'instance. Il demande maintenant :

- le domaine court
- le nom du Worker
- le libelle proprietaire
- le fournisseur d'analytics
- le domaine Cloudflare Access
- les langues supportees
- s'il faut copier les pages par defaut dans `custom/public`
- les portions noire et verte du wordmark

Lorsque le proprietaire accepte les pages marquees, l'installateur copie `defaults/public/` vers `custom/public/`, remplace le wordmark `Vanity` + `URLs` par les portions configurees, met a jour les libelles et liens de marque pertinents, puis retire les repertoires de langues non supportees.

L'installateur stocke ces decisions dans `custom/v8s-site-config.json` pour garder le processus idempotent. Si `custom/public/` contient deja des fichiers et n'a pas ete marque comme gere par l'installateur, l'installateur refuse de le remplacer sauf avec `--force`.

## Installation locale et publication

`npm run local-install` configure l'outillage local. Il verifie `jq`; si `jq` manque, il affiche des commandes d'installation par plateforme et s'arrete. Il peut installer le helper shell et copier `scripts/lnk` vers le chemin bin configure.

Le helper shell principal est neutre avec `scripts/v8s.sh`; l'ancien wrapper Zsh est une compatibilite. La documentation ne devrait plus presenter le helper comme strictement Zsh.

`npm run build` ecrit `build/v8s.json`. Il copie aussi ce registre vers le chemin local configure seulement lorsque la configuration locale active le helper et qu'un fichier custom de configuration locale existe.

`npm run update` est un alias pratique vers le workflow d'upgrade. `npm run upgrade` reste la commande sous-jacente.

`npm run local-publish` lance les checks, stage les chemins configures, commit et push. Le chemin par defaut est `custom`, et le message par defaut est `chore: update local vanityURLs configuration`.

## CLI

`scripts/lnk` est la CLI qui edite les sources pour liens, horaires et politiques.

Comportements importants :

- `scripts/lnk --help` et `scripts/lnk version` lisent la version dans `package.json`
- `lnk` ecrit les liens dans `custom/v8s-links.txt`, en creant le fichier si necessaire
- `V8S_REPO` pointe la CLI installee vers le depot local
- `V8S_LINKS_OWNER` est la variable d'environnement proprietaire; l'ancien alias `LNK_OWNER` a ete retire
- `lnk list` affiche les liens; `lnk list SLUG` filtre un slug
- `lnk list policy`, `lnk list categories`, `lnk list domain`, `lnk list domain block`, `lnk list domain allow` et `lnk list keyword` inspectent les politiques

Le modele voulu : `lnk` edite les sources, puis le proprietaire lance `npm run build`, `npm run check` ou `npm run local-publish` pour valider et publier.

## Branding et badges

Les badges localises `v8s-redirected.svg` et `v8s-redirected-dark.svg` vivent sous `defaults/public/{en,fr,es,it,de}/`. Les actifs anglais sont aussi copies a la racine du build pour garder les references existantes.

Traductions utilisees par les badges :

- Anglais : `redirected by vanityURLs.link`
- Francais : `redirigé par vanityURLs.link`
- Espagnol : `redirigido por vanityURLs.link`
- Italien : `reindirizzato da vanityURLs.link`
- Allemand : `weitergeleitet von vanityURLs.link`

`npm run optimize:badges` reproduit le nettoyage SVGO sur tous les badges par defaut.

## En-tetes et identite de generation

`_headers` inclut maintenant :

```text
X-Generated-By: vanityURLs.link
```

Les fichiers runtime bruts comme `/v8s.json`, `/v8s-blocklist.json` et `/v8s-site-config.json` doivent rester bloques en acces public direct.

## Points a evaluer dans la documentation

Revoir toute page qui dit encore :

- que la politique source est `v8s-blocklist.json` plutot que `v8s-policies.json`
- que la source Worker vit dans `scripts/src/` plutot que `scripts/workers/`
- que le helper shell est seulement Zsh
- que la politique custom fusionne avec les defaults au lieu de remplacer la politique source
- que toutes les langues par defaut devraient rester visibles apres personnalisation partielle
- que les pages de politique existent seulement comme exemples custom
- que `lnk` ecrit dans defaults si le fichier custom n'existe pas

La documentation devrait toujours distinguer les fichiers source, les fichiers runtime generes et les fichiers locaux du poste de travail.
