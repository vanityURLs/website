---
title: "CLI"
description: "Utiliser la CLI v8s basee sur Node pour gerer liens, planifications, et blocklist sans Bash."
---

La CLI locale au depot est `./scripts/lnk`. C'est un executable Node, donc il fonctionne sur macOS, Linux, Windows, et les environnements CI ou Node et Git sont disponibles.

Bash n'est pas requis pour gerer les liens. Le helper Zsh reste optionnel et separe.

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

Par defaut, la CLI ecrit dans `custom/v8s-links.txt` quand ce fichier existe. Pour forcer un autre chemin :

```bash
V8S_LINKS_FILE=custom/v8s-links.txt ./scripts/lnk https://example.com example
```

Sur Windows PowerShell :

```powershell
$env:V8S_LINKS_FILE="custom/v8s-links.txt"
node ./scripts/lnk https://example.com example
```

La CLI ajoute la ligne, lance `git add`, commit avec `feat(links): add SLUG`, puis pousse. Utilisez `DRY_RUN=true` pour afficher la ligne sans ecrire.

## Ajouter des planifications

```bash
./scripts/lnk schedule add hangout https://zoom.us/j/work --label work --days mon,tue,wed,thu,fri --from 09:00 --to 17:00 --timezone America/Toronto --default https://discord.gg/personal
./scripts/lnk schedule list hangout
```

Les commandes de planification ecrivent `custom/v8s-schedules.json` par defaut, commit avec `feat(schedules): update SLUG`, puis poussent. Utilisez `--dry-run` pour inspecter le JSON.

Utilisez `schedule default` plus tard si vous devez mettre a jour la cible de fallback pour un slug qui a deja au moins une regle de planification.

## Gerer la blocklist

```bash
./scripts/lnk block categories
./scripts/lnk block add example-bad.test --category phishing --severity high --reason "Fake login page"
./scripts/lnk block keyword wallet-drain --category phishing --severity high --reason "Credential theft lure"
./scripts/lnk block allow example.com --reason "Domaine controle par le proprietaire"
```

Les commandes blocklist ecrivent `custom/v8s-blocklist.json`.

## Helper Zsh optionnel

`scripts/v8s.zsh` est une aide shell optionnelle pour ouvrir des redirections connues depuis le terminal. Elle est separee de `./scripts/lnk` : la CLI Node modifie les fichiers source, tandis que le helper Zsh lit seulement le registre runtime genere.

```zsh
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.zsh
```

Le helper lit `~/.v8s.json` par defaut. `npm run build` peut synchroniser le `build/v8s.json` genere a cet endroit sur un poste macOS local. Si vous gardez le registre ailleurs, definissez `V8S_REGISTRY` avant de sourcer ou d'utiliser le helper :

```zsh
export V8S_REGISTRY=/path/to/YOUR-SHORT-DOMAIN/build/v8s.json
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.zsh
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

Le helper demande `jq`, car il lit `links[]` dans le registre JSON genere. Sur macOS, installez-le avec Homebrew :

```bash
brew install jq
```

Le helper est volontairement limite :

- Il ne cree pas, ne modifie pas, ne commit pas, et ne pousse pas de liens.
- Il ouvre seulement les slugs exacts qui existent deja dans `build/v8s.json` ou le registre configure.
- Il ouvre seulement les liens dont l'etat est `permanent` ou `ephemeral`.
- Il refuse les cibles non web et ouvre seulement les URL `http://` ou `https://`.
- Il valide le slug avant de chercher la cible.

Utilisez `./scripts/lnk` pour modifier l'instance. Utilisez `v8s` pour ouvrir rapidement une redirection existante depuis votre terminal.
