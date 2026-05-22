---
aside: false
title: "Vue d'ensemble"
description: "Ce qu'il faut avant de configurer un redirecteur vanityURLs et comment le premier déploiement s'articule."
nav_order: 1
---

vanityURLs est une solution open source pour exploiter votre propre domaine de liens courts marqué comme du code.

Le chemin de setup ci-dessous est volontairement étroit : obtenir d'abord une instance simple qui fonctionne sur Cloudflare Workers, puis ajuster la marque et la configuration une fois le redirecteur en ligne.

Le chemin heureux est :

1. Choisir un domaine court
2. Placer ce domaine sur Cloudflare DNS
3. Créer un dépôt GitHub avec le code vanityURLs
4. Configurer les réglages dans votre terminal
5. Laisser Cloudflare déployer le Worker
6. Tester vos premiers liens courts

## Ce qu'il faut

Avant de commencer, assurez-vous d'avoir ces éléments prêts :

- **Un domaine court enregistré** que vous utiliserez seulement pour les redirections, comme `ex.am`. Si vous n'en avez pas encore choisi, lisez [Choisir un domaine court pour les redirections](/blog/choosing-a-short-domain-for-redirects/)
- **Un compte GitHub** pour le dépôt qui stocke vos liens et l'historique de déploiement. Le dépôt peut être public, ou privé si vous ne voulez pas montrer tous vos liens courts. Le guide GitHub pour [créer un compte](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) est le meilleur point de départ si GitHub est nouveau pour vous
- **Un compte Cloudflare** pour les services DNS et Workers. Vous pouvez utiliser un compte existant ou en créer un nouveau; référez-vous à la [documentation Cloudflare](https://developers.cloudflare.com/fundamentals/account/create-account/) lors de la création du compte
  - **DNS Cloudflare autoritatif pour le domaine court**. vanityURLs s'attend à ce que Cloudflare gère la zone DNS utilisée par la route Worker ou le domaine custom. Le [guide de configuration complète](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) de Cloudflare explique comment ajouter un domaine et changer les serveurs de noms chez votre registraire
  - **Domaine d'équipe Cloudflare Access**. L'installateur le demande pendant le setup; trouvez-le dans **Zero Trust** > **Settings** sous **Team domain**, comme `<team>.cloudflareaccess.com`. Voir [Contrôle d'accès](/fr/docs/access-control/) pour la configuration complète Zero Trust
- **Un poste local** sous Linux, macOS ou Windows avec Git, Node.js 20 ou plus récent, npm, `jq` et votre éditeur de texte préféré
- **Un gestionnaire de mots de passe** pour stocker les informations sensibles comme les identifiants de compte Cloudflare, jetons API, secrets Worker, identifiants analytics et informations de récupération
- **Analytics optionnels**. Les solutions supportées sont [Fathom](https://usefathom.com/) et [Umami](https://umami.is/). Vous pouvez les activer pendant la phase de personnalisation, par exemple en phase 2. Lisez [Choisir des analytics respectueux de la vie privée pour les liens courts](/blog/choosing-privacy-friendly-analytics-for-short-links/) avant de créer un compte analytics

[Quickstart](/fr/docs/quickstart/) vise à faire fonctionner le redirecteur, donc utilisez des réponses simples; vous pourrez les raffiner pendant la [personnalisation](/fr/docs/customize-overview/).
