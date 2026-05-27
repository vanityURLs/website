---
title: "Configuration"
description: "Ce qu'il faut avant de configurer un redirecteur vanityURLs"
weight: 10
aliases:
  - /docs/overview/
aside: false
---

Gerons les liens courts rediriges avec _votre_ moteur vanityURLs. Une instance peut etre operationnelle en 10 minutes, une fois les prerequis ci-dessous reunis.

[Demarrage rapide](/fr/docs/setup/quickstart/) se concentre sur ce chemin heureux :

1. Choisir un domaine court
2. Placer ce domaine sur Cloudflare DNS
3. Créer un dépôt GitHub avec le code vanityURLs
4. Configurer les réglages dans votre terminal
5. Laisser Cloudflare déployer le Worker
6. Tester vos premiers liens courts

## Ce qu'il faut

Avant de commencer, assurez-vous d'avoir ces éléments prêts :

{{% steps %}}

### Enregistrer un domaine court

Utilisez un domaine que vous reserverez seulement aux redirections, comme `ex.am`. Si vous n'en avez pas encore choisi, lisez [Choisir un domaine court pour les redirections](/en/blog/choosing-a-short-domain-for-redirects/).

### Preparer un compte GitHub

Utilisez GitHub pour le depot qui stocke vos liens et l'historique de deploiement. Le depot peut etre public, ou prive si vous ne voulez pas montrer tous vos liens courts. Le guide GitHub pour [creer un compte](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) est le meilleur point de depart si GitHub est nouveau pour vous.

### Preparer Cloudflare

Utilisez un compte Cloudflare pour les services DNS et Workers. Vous pouvez utiliser un compte existant ou en creer un nouveau; referez-vous a la [documentation Cloudflare](https://developers.cloudflare.com/fundamentals/account/create-account/) lors de la creation du compte.

- **DNS Cloudflare autoritatif pour le domaine court**. vanityURLs s'attend a ce que Cloudflare gere la zone DNS utilisee par la route Worker ou le domaine custom. Le [guide de configuration complete](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) de Cloudflare explique comment ajouter un domaine et changer les serveurs de noms chez votre registraire
- **Domaine d'equipe Cloudflare Access**. L'installateur le demande pendant le setup; trouvez-le dans **Zero Trust** > **Settings** sous **Team domain**, comme `<team>.cloudflareaccess.com`. Voir [Controle d'acces](/fr/docs/customize/access-control/) pour la configuration complete Zero Trust

### Preparer un poste local

Utilisez Linux, macOS ou Windows avec Git, Node.js 20 ou plus recent, npm, jq et votre editeur de texte prefere.

### Preparer un gestionnaire de mots de passe

Stockez les informations sensibles comme les identifiants de compte Cloudflare, jetons API, secrets Worker, identifiants analytics et informations de recuperation.

{{% /steps %}}
