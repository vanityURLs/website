---
title: "lnk check"
description: "Effectuer une vérification HTTP en direct pour valider qu'une redirection fonctionne."
nav_order: 24
---

Effectue une requête HTTP en direct pour vérifier qu'un lien court redirige correctement. Rapporte le code de statut, la destination finale et le temps de réponse.

```bash
$ lnk check /chemin
```

## Utilisation

```bash
$ lnk check /github
Vérification de https://mon-domaine.link/github...
301 → https://github.com/bhdicaire  (43ms) ✓

$ lnk check /brise
Vérification de https://mon-domaine.link/brise...
404 Not Found ✗
```

## Options

| Option | Description |
|--------|-------------|
| `--follow`, `-L` | Suivre toute la chaîne de redirections |
| `--timeout SECS` | Délai en secondes (défaut : 10) |
| `--all` | Vérifier toutes les redirections |
| `--fail-only` | Avec `--all`, ne rapporter que les échecs |

{{< callout type="note" title="Nécessite un déploiement actif" >}}
`lnk check` interroge votre domaine Cloudflare en production. La redirection doit être déployée pour obtenir un résultat significatif.
{{< /callout >}}
