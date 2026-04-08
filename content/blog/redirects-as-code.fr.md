---
title: "Les redirections comme code : gérer les liens courts à la façon GitOps"
date: 2025-03-10
author: "Benoît H. Dicaire"
description: "Que se passe-t-il quand vous traitez vos redirections d'URL comme de l'infrastructure — versionnée, revue et déployée via CI/CD ?"
tags: ["guide", "tutorial"]
featured: false
translationKey: "redirects-as-code"
---

La plupart des raccourcisseurs d'URL sont des boîtes noires. Vous vous connectez via une interface web, créez un lien, et espérez que le service continue de fonctionner. Quand quelque chose tourne mal, il n'y a pas de trace d'audit, pas de retour arrière, aucun moyen de savoir qui a modifié quoi et quand.

vanityURLs adopte une approche différente : vos redirections vivent dans un fichier texte, dans un dépôt Git, déployé via Cloudflare Pages. C'est le GitOps appliqué à la gestion d'URL.

## Le fichier est la source de vérité

Toute votre table de redirections tient en deux fichiers :

```
# static.lnk — liens permanents
/github      https://github.com/bhdicaire         301
/linkedin    https://linkedin.com/in/bhdicaire    301

# dynamic.lnk — liens temporaires
/devconf     https://devconf.cz/talk/2025         302
```

Ces fichiers sont fusionnés au moment du build :

```bash
cat static.lnk dynamic.lnk > build/_redirects
```

C'est tout le pipeline. Aucune base de données. Aucune API. Aucun serveur.

## Chaque changement est un commit

Quand vous ajoutez un lien avec `lnk add` :

```bash
lnk add /github https://github.com/bhdicaire
lnk deploy "ajout du lien github"
```

Vous disposez d'une trace complète :
- **Qui** a fait le changement (auteur Git)
- **Quand** c'est arrivé (horodatage du commit)
- **Ce qui** a changé (diff)
- **Pourquoi** (message de commit)

## Pull requests pour la revue des liens

Pour les équipes, vous pouvez exiger une approbation de pull request avant qu'une redirection soit mise en ligne :

```yaml
# .github/branch-protection.yml
main:
  required_pull_request_reviews: 1
  require_status_checks:
    - lnk validate --live
```

## Le retour arrière, c'est juste `git revert`

Avec vanityURLs, revenir en arrière est immédiat :

```bash
git revert a3f7c12 --no-edit && git push
# Cloudflare déploie la correction en 15 secondes
```

## L'étape de validation

Avant tout déploiement, `lnk validate` détecte les erreurs courantes :

```bash
$ lnk validate --live
Validation de static.lnk... OK ✓
Validation de dynamic.lnk...
  AVERTISSEMENT : /ancien-summit → https://summit2023.example.com  (404 Not Found)
1 avertissement trouvé.
```

C'est le même principe que `terraform plan` avant `terraform apply`.

[Lire la référence complète des commandes →](/fr/docs/commands/)
