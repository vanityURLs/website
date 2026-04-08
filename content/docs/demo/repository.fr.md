---
title: "Structure du dépôt"
description: "Chaque fichier du dépôt de référence v8s.link, son rôle, et ce que vous devez modifier."
nav_order: 31
translationKey: "demo-repository"
---

Le dépôt [v8s.link](https://github.com/vanityURLs/v8s.link) a été généré depuis le modèle `vanityURLs/vanityURLs`. Voici chaque fichier, annoté.

{{< filetree/container >}}
{{< filetree/folder name="v8s.link" >}}
{{< filetree/folder name=".github" >}}
{{< filetree/folder name="workflows" >}}
{{< filetree/file name="deploy.yml" annotation="// CI/CD — se déclenche sur push vers main" >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< filetree/folder name="build" annotation="// sortie générée, mais commitée" >}}
{{< filetree/file name="_headers" annotation="// en-têtes HTTP servis par Cloudflare" >}}
{{< filetree/file name="_redirects" annotation="// généré par make build / CI" >}}
{{< /filetree/folder >}}
{{< filetree/folder name="scripts" annotation="// outils CLI installés par make setup" >}}
{{< filetree/file name="lnk" annotation="// CLI de gestion des redirections" >}}
{{< filetree/file name="validateURL" annotation="// vérificateur d'accessibilité des URLs" >}}
{{< /filetree/folder >}}
{{< filetree/file name="Makefile" annotation="// cibles setup, build, config" >}}
{{< filetree/file name="README.md" annotation="// mettre à jour pour votre domaine" >}}
{{< filetree/file name="dynamic.lnk" annotation="// liens temporaires / campagnes" >}}
{{< filetree/file name="logo.png" annotation="// branding optionnel" >}}
{{< filetree/file name="static.lnk" annotation="// liens permanents" >}}
{{< filetree/file name="vanityURLs.conf" annotation="// config locale — ne jamais committer des secrets" >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

### `build/_headers` — généré par `make setup`, puis commité

```
https://v8s-link.pages.dev/*
  X-Robots-Tag: noindex
  X-Content-Type-Options: nosniff

https://v8s.link/*
  X-Robots-Tag: noindex
  X-Content-Type-Options: nosniff
```

{{< callout type="warning" title="Mettez à jour _headers si vous changez de domaine" >}}
Exécutez `make headers` à chaque fois que `MY_DOMAIN` ou `MY_PAGE` change.
{{< /callout >}}

### `scripts/validateURL` — vérificateur d'URLs

Script compagnon qui effectue des vérifications HTTP en direct des destinations de redirection. Appelé par `lnk validate --live`. Peut aussi être utilisé directement :

```bash
validateURL https://github.com/vanityURLs
# → 200 OK (87ms) ✓
```

### `Makefile` — gestionnaire de tâches

| Cible | Action |
|-------|--------|
| `make config` | Ouvre `vanityURLs.conf` dans `$EDITOR` |
| `make setup` | Installe les scripts, génère `_headers`, crée les fichiers de liens initiaux |
| `make build` | Build local : `cat static.lnk dynamic.lnk > build/_redirects` |
| `make debug` | Affiche `MY_DOMAIN` pour vérifier que la config est chargée |
