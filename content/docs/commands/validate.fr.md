---
title: "lnk validate"
description: "Valider la syntaxe du fichier de redirections et vérifier que les URLs de destination sont accessibles."
nav_order: 25
---

Validez votre configuration de redirections avant de pousser. Effectue deux niveaux de contrôle : **validation de syntaxe** (toujours) et **accessibilité HTTP des destinations** (avec `--live`).

```bash
$ lnk validate [--live] [--static|--dynamic]
```

## Ce qui est vérifié

### Validation de syntaxe (toujours exécutée)

- Chaque ligne a exactement deux ou trois champs : `source destination [code]`
- Les chemins source commencent par `/`
- Les URLs de destination sont bien formées (`https://` ou `/relatif`)
- Les codes de statut sont valides : `301`, `302`, `303`, `307`, `308`
- Pas de chemins source en double dans le même fichier
- Pas de chemins source en double entre les deux fichiers (avertissement)
- Les commentaires (`#`) et les lignes vides sont ignorés

### Accessibilité HTTP (`--live`)

- Effectue une requête HEAD à chaque URL de destination
- Signale les réponses non-2xx/3xx comme avertissements
- Signale les timeouts et erreurs DNS comme erreurs

## Utilisation

```bash
$ lnk validate
Validation de static.lnk... 4 règles OK ✓
Validation de dynamic.lnk... 2 règles OK ✓
Aucun problème trouvé.

$ lnk validate --live
Validation de static.lnk... 4 règles OK ✓
Validation de dynamic.lnk... 2 règles OK ✓
Vérification de 6 URLs de destination...
  https://github.com/bhdicaire        200 OK (41ms) ✓
  https://linkedin.com/in/bhdicaire   200 OK (87ms) ✓
  https://blog.example.com            200 OK (53ms) ✓
  https://x.com/bhdicaire             200 OK (62ms) ✓
  https://summit2023.example.com      404 Not Found  ✗
  https://boutique.example.com?p=ete  200 OK (49ms) ✓
Validation terminée : 1 erreur, 0 avertissements.
```

## Options

| Option | Description |
|--------|-------------|
| `--live`, `-l` | Effectuer des vérifications HTTP en direct |
| `--static` | Valider `static.lnk` uniquement |
| `--dynamic` | Valider `dynamic.lnk` uniquement |
| `--timeout SECS` | Délai pour les vérifications en direct (défaut : 10) |
| `--fail-on-warning` | Quitter avec erreur sur les avertissements aussi |
| `--json` | Résultats en JSON |

## Erreurs courantes

### URL malformée

```
ERREUR static.lnk:12 : URL de destination invalide "github.com/bhdicaire"
  → Les URLs de destination doivent commencer par https:// ou /
  Correction : /github  https://github.com/bhdicaire  301
```

### Code de statut invalide

```
ERREUR static.lnk:7 : code de statut invalide "200"
  → Codes valides : 301, 302, 303, 307, 308
  Correction : /ancien  https://nouveau.example.com  301
```

### Chemin en double

```
ERREUR : /github apparaît dans static.lnk (ligne 3) et dynamic.lnk (ligne 1)
  → Cloudflare utilise la première correspondance ; la deuxième règle ne sera jamais atteinte
```

### Destination inaccessible (en direct uniquement)

```
AVERTISSEMENT dynamic.lnk:2 : https://summit2023.example.com a renvoyé 404 Not Found
  → L'URL de destination existe dans votre fichier de liens mais n'est plus active
  Envisagez de supprimer ou mettre à jour cette redirection
```

{{< callout type="tip" title="Intégrez validate dans votre pipeline CI" >}}
Exécutez `lnk validate --live` dans un workflow GitHub Actions sur chaque pull request pour détecter les liens brisés avant la fusion.

```yaml
# .github/workflows/validate.yml
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: make setup && lnk validate --live
```
{{< /callout >}}
