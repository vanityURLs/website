---
aside: false
title: "LNK"
description: "Utiliser la commande Node lnk pour gerer les liens, les horaires et la politique source dans custom/."
weight: 20
aliases:
  - /docs/cli/

---

`lnk` est l'interface en ligne de commande du dépôt pour modifier une instance vanityURLs. Elle modifie les fichiers source dans `custom/`, lance `npm run check`, puis stage, commit et pousse les opérations d'écriture reussies.

Utilisez-la lorsque le changement doit entrer dans l'historique Git et se déployer par le workflow Worker normal. Utilisez [Helper local](/fr/docs/command-line-interface/local-helper/) lorsque vous voulez seulement ouvrir une redirection existante depuis le terminal.

## Prerequis

- Un dépôt vanityURLs configure disponible localement
- Node.js 20 ou plus recent
- npm
- Git

Lancez la commande locale au dépôt :

```bash
./scripts/lnk --help
```

Si vous avez installé les outils poste avec `npm run local-install`, vous pouvez habituellement lancer `lnk` depuis n'importe quel répertoire. Définissez `V8S_REPO` lorsqu'une commande installée doit pointer vers un dépôt local précis.

## Commandes principales

| Commande | Effet |
| --- | --- |
| `./scripts/lnk LONG_URL [SLUG]` | Ajoute un lien dans `custom/v8s-links.txt` |
| `./scripts/lnk LONG_URL --random-slug-length N` | Ajoute un lien avec un slug génère de `N` caracteres |
| `./scripts/lnk --splat LONG_URL_WITH_:splat SLUG` | Ajoute un lien splat stocke comme `SLUG/*` |
| `./scripts/lnk list [SLUG]` | Liste les entrées du registre génère depuis `build/v8s.json` |
| `./scripts/lnk tag list` | Liste les longueurs de slugs aléatoires propres aux tags |
| `./scripts/lnk tag set TAG --random-slug-length N` | Definit une longueur de slug aléatoire pour un tag |
| `./scripts/lnk tag unset TAG` | Supprime une longueur de slug propre à un tag |
| `./scripts/lnk schedule add SLUG TARGET ...` | Ajoute ou remplace une règle de cible planifiée |
| `./scripts/lnk schedule default SLUG TARGET` | Definit la cible fallback d'un horaire existant |
| `./scripts/lnk schedule list [SLUG]` | Liste les règles d'horaire |
| `./scripts/lnk block add DOMAIN ...` | Ajoute ou met à jour un domaine bloque |
| `./scripts/lnk block keyword KEYWORD ...` | Ajoute ou met à jour un mot-cle bloque |
| `./scripts/lnk block allow DOMAIN ...` | Ajoute ou met à jour un domaine autorise |
| `./scripts/lnk list policy` | Resume la politique source active |
| `./scripts/lnk list categories` | Liste les categories et sevérités de politique |
| `./scripts/lnk list domain [block\|allow]` | Liste les domaines bloques et autorises |
| `./scripts/lnk list keyword` | Liste les mots-cles bloques |
| `./scripts/lnk version` | Affiche la version du paquet |

Les commandes de liste acceptent `--format table` ou `--format json`. Table est le format par défaut.

## Details des commandes

### Ajouter des liens

```bash
./scripts/lnk https://github.com/vanityURLs github
./scripts/lnk https://www.linkedin.com/company/example social/linkedin --title LinkedIn --tags social --owner team
./scripts/lnk --splat https://docs.example.com/:splat docs
./scripts/lnk --state ephemeral --title "Launch" https://example.com campaign/launch
```

Si vous omettez le slug, `lnk` en génère un avec la longueur par défaut configuree dans `custom/v8s-site-config.json`. `npm run setup` propose `3`. Les slugs génères utilisent l'alphabet lisible configure. La valeur produit par défaut est `34789abcdefghjkmnpqrstvwxy`.

Remplacez la longueur pour une seule commande avec :

```bash
./scripts/lnk https://github.com/houba/styleGuide --random-slug-length 5
```

Vous pouvez aussi configurer des valeurs par défaut propres aux tags :

```bash
./scripts/lnk tag set social --random-slug-length 5
./scripts/lnk tag list
./scripts/lnk tag unset social
```

Lorsqu'un lien génère possède plusieurs tags avec des longueurs configurées, `lnk` utilise la longueur la plus courte parmi les tags applicables. Un `--random-slug-length` ou `--slug-length` explicite dans la commande gagne sur les valeurs par tag et sur la valeur globale.

Les valeurs produit par défaut configurent les liens `training` a 4 caracteres et les liens `debug` a 2 caracteres.

Si le slug existe déjà, `lnk` affiche l'entree actuelle et le remplacement propose, puis demande si vous voulez remplacer l'entree. Utilisez `--replace` pour remplacer sans question, ou `--no-replace` pour conserver l'entree existante.

Les états valides sont `permanent`, `ephemeral`, `expired`, `disabled`, `maintenance` et `deactivated`.

Options utiles pour les liens :

| Option | Role |
| --- | --- |
| `--state STATE` | Definit l'état de cycle de vie |
| `--title TEXT` | Ajoute un titre lisible |
| `--description TEXT` | Ajoute une description lisible |
| `--tags TAGS` | Ajoute des tags séparés par des virgules |
| `--owner OWNER` | Definit le libellé de responsabilité |
| `--expires-at DATE` | Definit une date ISO ou un timestamp |
| `--notes TEXT` | Ajoute des notes internes |
| `--random-slug-length N` | Definit la longueur du slug génère pour cette commande |
| `--slug-length N` | Alias de `--random-slug-length` |
| `--replace` | Remplace un slug existant sans question |
| `--no-replace` | Conserve un slug existant |
| `--splat` | Stocke le slug comme `SLUG/*` et exige `:splat` dans la cible |

### Lister les liens

```bash
./scripts/lnk list
./scripts/lnk list social/linkedin
./scripts/lnk list --format json
```

`lnk list` lit le registre génère. Si `build/v8s.json` n'existe pas, la commande lance d'abord `npm run build`.

### Gerer les horaires

```bash
./scripts/lnk schedule add hangout https://zoom.us/j/work --label work --days mon,tue,wed,thu,fri --from 09:00 --to 17:00 --timezone America/Toronto --default https://discord.gg/personal
./scripts/lnk schedule default hangout https://discord.gg/personal --timezone America/Toronto
./scripts/lnk schedule list hangout
```

Les règles d'horaire sont écrites dans `custom/v8s-schedules.json`. `schedule add` exige `--label`, `--days`, `--from` et `--to`. Les heures utilisent `HH:MM`; les jours utilisent `mon`, `tue`, `wed`, `thu`, `fri`, `sat` et `sun`.

Utilisez `--dry-run` sur les commandes d'horaire pour afficher le JSON mis à jour sans écrire, verifier, commit ou pousser.

### Gerer la politique source

```bash
./scripts/lnk list policy
./scripts/lnk list categories
./scripts/lnk list domain block
./scripts/lnk list keyword --format json
./scripts/lnk block add example-bad.test --category phishing --severity high --reason "Fake login page"
./scripts/lnk block keyword wallet-drain --category phishing --severity high --reason "Credential theft lure"
./scripts/lnk block allow example.com --reason "Domaine controle par le proprietaire"
```

Les commandes de politique ecrivent `custom/v8s-policies.json`. Le build transforme la politique source en `build/v8s-blocklist.json`. Les categories et sevérités sont validees avec `defaults/v8s-blocklist-categories.json`.

Utilisez `--dry-run` sur les commandes de politique pour afficher le JSON mis à jour sans écrire, verifier, commit ou pousser.

## Variables d'environnement

| Variable | Role |
| --- | --- |
| `DRY_RUN=true` | Affiche le changement prevu sans écrire, verifier, commit ou pousser |
| `V8S_REPO=PATH` | Pointe une commande `lnk` installee vers un dépôt vanityURLs local |
| `V8S_LINKS_OWNER=OWNER` | Definit la valeur owner par défaut pour les nouveaux liens |
| `V8S_LINKS_FILE=FILE` | Remplace le fichier de liens |
| `V8S_SCHEDULES_FILE=FILE` | Remplace le fichier des horaires |
| `V8S_POLICY_FILE=FILE` | Remplace le fichier de politique |

Sur Windows PowerShell :

```powershell
$env:V8S_REPO="C:\path\to\YOUR-SHORT-DOMAIN"
$env:V8S_LINKS_OWNER="team"
node ./scripts/lnk https://example.com example
```

## Comportement d'écriture

Les opérations d'écriture reussies pour les liens, horaires et politiques lancent :

```text
npm run check
git add FILE
git commit -m OPERATION_MESSAGE
git push
```

Les commandes d'écriture directes de `lnk` utilisent des commits conventionnels propres à l'opération, comme `feat(links): add SLUG`, `feat(schedules): update SLUG`, `feat(policies): block DOMAIN`, et `feat(policies): allow DOMAIN`.

Pour une publication locale plus large, `npm run local-publish` selectionne les messages depuis `local_publish.commit_messages` dans `defaults/v8s-local-config.json`, fusionne avec `custom/v8s-local-config.json`. Les cles par défaut sont :

| Cle | Utilisee quand |
| --- | --- |
| `links` | Seulement `custom/v8s-links.txt` est stage |
| `policies` | Seulement `custom/v8s-policies.json` ou `custom/v8s-blocklist.json` est stage |
| `site_config` | Seulement `custom/v8s-site-config.json` est stage |
| `mixed` | Plusieurs fichiers ou les chemins de publication configures sont stages |

Remplacez le message local-publish selectionne avec :

```bash
npm run local-publish -- --message "chore: update short-link configuration"
```

Cela rend `lnk` volontairement opinionated : la commande sert aux changements que vous êtes prêt a valider et publier. Utilisez `DRY_RUN=true` ou le `--dry-run` propre à la commande lorsque vous voulez previsualiser d'abord.
