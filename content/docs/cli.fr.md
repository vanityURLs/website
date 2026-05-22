---
aside: false
title: "CLI"
description: "Utiliser la CLI v8s basee sur Node pour gerer liens, horaires, et politique source."
---

La CLI locale au depot est `./scripts/lnk`. C'est un executable Node, donc il fonctionne sur macOS, Linux, Windows, et les environnements CI ou Node et Git sont disponibles.

La CLI modifie les fichiers source dans `custom/`. Apres les changements, lancez `npm run build`, `npm run check`, ou `npm run local-publish` pour regenerer et publier les artefacts runtime.

## Prerequis

- Node.js 20 ou plus recent
- npm
- Git
- Wrangler pour les commandes de deploiement
- Un compte Cloudflare seulement pour deployer ou gerer les secrets Worker

Sur Windows, lancez les commandes depuis PowerShell, Windows Terminal, ou un shell qui voit Git. La CLI ne demande pas WSL.

## Ajouter des liens

```bash
./scripts/lnk https://github.com/vanityURLs github
./scripts/lnk https://www.linkedin.com/company/example social/linkedin --title LinkedIn --tags social --owner team
./scripts/lnk --splat https://docs.example.com/:splat docs
```

Par defaut, la CLI ecrit dans `custom/v8s-links.txt` et cree le fichier si necessaire. Pour pointer une CLI installee vers le depot et definir l'owner par defaut :

```bash
V8S_REPO=/path/to/YOUR-SHORT-DOMAIN V8S_LINKS_OWNER=team ./scripts/lnk https://example.com example
```

Sur Windows PowerShell :

```powershell
$env:V8S_REPO="C:\path\to\YOUR-SHORT-DOMAIN"
$env:V8S_LINKS_OWNER="team"
node ./scripts/lnk https://example.com example
```

`V8S_REPO` pointe vers le depot local. `V8S_LINKS_OWNER` definit la valeur owner par defaut pour les nouveaux liens.

La CLI ajoute la ligne, lance `git add`, commit avec `feat(links): add SLUG`, puis pousse. Utilisez `DRY_RUN=true` pour afficher la ligne sans ecrire.

## Ajouter des planifications

```bash
./scripts/lnk schedule add hangout https://zoom.us/j/work --label work --days mon,tue,wed,thu,fri --from 09:00 --to 17:00 --timezone America/Toronto --default https://discord.gg/personal
./scripts/lnk schedule list hangout
```

Les commandes de planification ecrivent `custom/v8s-schedules.json` par defaut, commit avec `feat(schedules): update SLUG`, puis poussent. Utilisez `--dry-run` pour inspecter le JSON.

Utilisez `schedule default` plus tard si vous devez mettre a jour la cible de fallback pour un slug qui a deja au moins une regle de planification.

## Gerer la politique source

```bash
./scripts/lnk list policy
./scripts/lnk list categories
./scripts/lnk block add example-bad.test --category phishing --severity high --reason "Fake login page"
./scripts/lnk block keyword wallet-drain --category phishing --severity high --reason "Credential theft lure"
./scripts/lnk block allow example.com --reason "Domaine controle par le proprietaire"
```

Les commandes de politique ecrivent `custom/v8s-policies.json`. Le build transforme la politique source selectionnee en artefact runtime `build/v8s-blocklist.json`.

## Helper shell optionnel

`scripts/v8s.sh` est un helper neutre shell pour ouvrir des redirections connues depuis le terminal. `scripts/v8s.zsh` reste un wrapper de compatibilite. Le helper est separe de `./scripts/lnk` : la CLI Node modifie les fichiers source, tandis que le helper lit seulement le registre runtime genere.

```zsh
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.sh
```

Le helper lit le chemin de registre local configure, habituellement `~/.v8s.json`. `npm run build` ecrit `build/v8s.json` et le copie au registre local seulement quand la configuration locale active le helper. Lancez `npm run local-install` pour le configurer.

Si vous gardez le registre ailleurs, definissez `V8S_REGISTRY` avant de sourcer ou d'utiliser le helper :

```zsh
export V8S_REGISTRY=/path/to/YOUR-SHORT-DOMAIN/build/v8s.json
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.sh
```

Commandes utiles :

```zsh
v8s --list
v8s docs
v8s --print docs
v8s --path
```

| Commande | Comportement |
|---|---|
| `v8s --list` | Liste les slugs actifs `permanent` et `ephemeral` depuis le registre. |
| `v8s docs` | Ouvre la cible du slug exact `docs`. |
| `v8s --print docs` | Affiche la cible sans l'ouvrir. |
| `v8s --path` | Affiche le chemin du registre utilise. |

Le helper demande `jq`, car il lit `links[]` dans le registre JSON genere. `npm run local-install` verifie `jq` et affiche des suggestions d'installation par plateforme. Sur macOS :

```bash
brew install jq
```

Le helper est volontairement limite :

- Il ne cree pas, ne modifie pas, ne commit pas, et ne pousse pas de liens
- Il ouvre seulement les slugs exacts qui existent deja dans `build/v8s.json` ou le registre configure
- Il ouvre seulement les liens dont l'etat est `permanent` ou `ephemeral`
- Il refuse les cibles non web et ouvre seulement les URL `http://` ou `https://`
- Il valide le slug avant de chercher la cible

Utilisez `./scripts/lnk` pour modifier l'instance. Utilisez `v8s` pour ouvrir rapidement une redirection existante depuis votre terminal.
