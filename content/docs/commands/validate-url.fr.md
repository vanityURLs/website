---
title: "validateURL"
description: "Le script validateURL — vérifiez qu'une URL est accessible avant de la committer comme destination de redirection."
nav_order: 27
translationKey: "validateurl"
---

`validateURL` est un script bash autonome installé avec `lnk` par `make setup`. Il effectue une vérification HTTP en direct sur n'importe quelle URL et indique si elle est accessible, le code de statut retourné et le temps de réponse.

```bash
$ validateURL https://github.com/vanityURLs
```

Il est appelé automatiquement par `lnk validate --live`, mais vous pouvez aussi l'utiliser directement sur n'importe quelle URL.

## Utilisation

```bash
$ validateURL https://github.com/vanityURLs
200 OK (87ms) ✓

$ validateURL https://summit2023.example.com
404 Not Found ✗

$ validateURL https://disparu.example.com
Connection refused ✗
```

## Options

| Option | Description |
|--------|-------------|
| `--timeout SECS` | Délai en secondes (défaut : 10) |
| `--follow`, `-L` | Suivre les chaînes de redirections |
| `--head`, `-I` | Utiliser HTTP HEAD (plus rapide, pas de corps) |
| `--quiet`, `-q` | Afficher uniquement le code de sortie |

## Codes de sortie

| Code | Signification |
|------|--------------|
| `0` | L'URL a retourné 2xx ou 3xx |
| `1` | L'URL a retourné 4xx, 5xx ou la connexion a échoué |

## Exemples

```bash
# Vérifier une URL
validateURL https://github.com/vanityURLs

# Vérification silencieuse pour scripts
if validateURL --quiet https://monsite.com; then
    echo "Site en ligne"
else
    echo "Site hors ligne — vérifier avant de déployer !"
fi

# Vérifier toutes les destinations de static.lnk
awk '{print $2}' static.lnk | grep '^https\?://' | while read url; do
    validateURL "$url"
done
```

## Patterns d'échec courants

### 404 — destination supprimée ou renommée

Mettez à jour ou supprimez la règle de redirection correspondante.

### Timeout — destination inaccessible

```bash
validateURL --timeout 5 https://api-lent.example.com
Timeout after 5s ✗
```

### Erreur de certificat — HTTPS mal configuré

```bash
validateURL https://expire.example.com
SSL certificate error ✗
```
