---
title: "Configuration"
description: "Ce qu'il faut avant de configurer un redirecteur vanityURLs"
weight: 10
aliases:
  - /docs/overview/
aside: false
show_section_pages: false
---

Gerons les liens courts redirigés avec _votre_ moteur vanityURLs. Une instance peut être opérationnelle en 10 minutes, une fois les prérequis ci-dessous reunis.

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

Utilisez un domaine que vous réserverez seulement aux redirections, comme `ex.am`. Si vous n'en avez pas encore choisi, lisez [Choisir un domaine court pour les redirections](/en/blog/choosing-a-short-domain-for-redirects/).

### Preparer un compte GitHub

Utilisez GitHub pour le dépôt qui stocke vos liens et l'historique de déploiement. Le dépôt peut être public, ou privé si vous ne voulez pas montrer tous vos liens courts. Le guide GitHub pour [créer un compte](/fr/docs/setup/quickstart/) est le meilleur point de départ si GitHub est nouveau pour vous.

### Preparer Cloudflare

Utilisez un compte Cloudflare pour les services DNS et Workers. Vous pouvez utiliser un compte existant ou en créer un nouveau; referez-vous à la [documentation Cloudflare](/en/blog/choosing-a-short-domain-for-redirects/) lors de la création du compte.

- **DNS Cloudflare autoritatif pour le domaine court**. vanityURLs s'attend à ce que Cloudflare gere la zone DNS utilisee par la route Worker ou le domaine custom. Le [guide de configuration complété](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) de Cloudflare explique comment ajouter un domaine et changer les serveurs de noms chez votre registraire
- **Domaine d'équipe Cloudflare Access**. L'installateur le demande pendant le setup; trouvez-le dans **Zero Trust** > **Settings** sous **Team domain**, comme `<team>.cloudflareaccess.com`. Voir [Contrôle d'accès](/fr/docs/customize/access-control/) pour la configuration complété Zero Trust

### Preparer un poste local

Utilisez Linux, macOS ou Windows avec Git, Node.js 20 ou plus recent, npm, jq et votre editeur de texte préfère.

### Preparer un gestionnaire de mots de passe

Stockez les informations sensibles comme les identifiants de compte Cloudflare, les jetons API, les secrets Worker, les identifiants analytics, les audiences Access, les secrets client IdP, les jetons de service, les secrets client OAuth et les informations de récupération. Ne commitez pas ces valeurs, ni les captures d'écran qui les contiennent, dans le dépôt.

{{% /steps %}}
