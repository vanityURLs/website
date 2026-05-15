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

`scripts/v8s.zsh` est une convenience shell pour ouvrir des redirections connues depuis le registre genere :

```zsh
source /path/to/YOUR-SHORT-DOMAIN/scripts/v8s.zsh
v8s --list
v8s docs
v8s --print docs
```

Il ne cree pas de liens. Il ouvre seulement les cibles actives `http://` ou `https://` deja presentes dans `~/.v8s.json`.
