---
title: "lnk deploy"
description: "Committer et pousser pour déclencher un déploiement Cloudflare."
nav_order: 26
translationKey: "cmd-deploy"
---

Committe vos modifications en attente et les pousse vers le dépôt distant. Cloudflare Pages détecte le push et déploie vos redirections mises à jour en environ 15 secondes.

```bash
$ lnk deploy ["message de commit"]
```

## Utilisation

```bash
$ lnk deploy "ajout des liens github et linkedin"
Validation des redirections... OK ✓
Commit des modifications...
  modifié : static.lnk
  modifié : dynamic.lnk
[main a3f7c12] ajout des liens github et linkedin
  2 fichiers modifiés, 3 insertions(+), 1 suppression(-)
Push vers origin/main...
Fait. Déploiement déclenché sur Cloudflare Pages.
Vos liens seront actifs dans ~15 secondes.
```

## Options

| Option | Description |
|--------|-------------|
| `--no-validate` | Ignorer la validation pré-déploiement |
| `--dry-run` | Afficher sans pousser |
| `--branch BRANCHE` | Pousser vers une branche spécifique (défaut : `main`) |
| `--message TEXTE`, `-m` | Message de commit |

## Ce que lnk deploy fait

{{% steps %}}

### Valider

Exécute `lnk validate` automatiquement. Si la validation échoue, le déploiement est annulé.

### Indexer les modifications

Exécute `git add static.lnk dynamic.lnk build/_redirects`.

### Committer

Crée un commit git avec votre message. Si aucun message n'est fourni, lnk en demande un.

### Pousser

Exécute `git push origin HEAD`. Cloudflare Pages démarre un nouveau build immédiatement.

{{% /steps %}}

{{< callout type="note" title="Validation automatique" >}}
`lnk validate --live` s'exécute automatiquement sauf si vous passez `--no-validate`. Si une destination ne répond pas correctement, le déploiement est bloqué.
{{< /callout >}}
