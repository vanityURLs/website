---
aside: false
title: "Documentation"
description: "Trouver les pages de setup, personnalisation, ligne de commande, demo et référence vanityURLs."
---

- [Setup](/fr/docs/setup/) liste les prérequis et les décisions à prendre avant l'installation.
- [Demarrage rapide](/fr/docs/setup/quickstart/) suit le chemin simple depuis la création du dépôt jusqu'à la première redirection déployée.
- [v8s.link](/fr/docs/v8s-link/) est l'instance demo officielle a comparer lorsque des valeurs de setup ou des comportements runtime différent.
- [Web site](/fr/docs/web-site/) couvre la maintenance de ce site de documentation Hugo et son déploiement Cloudflare Workers.

## Utiliser la ligne de commande

- [Ligne de commande](/fr/docs/command-line-interface/) explique le helper local et l'outil `lnk`.
- [LNK](/fr/docs/command-line-interface/lnk/) modifie les liens, horaires et politiques source dans `custom/`.
- [Helper local](/fr/docs/command-line-interface/local-helper/) ouvre des liens courts existants depuis votre terminal.

## Personnaliser une instance

- [Personnaliser](/fr/docs/customize/) organise le travail après le premier déploiement.
- [Marque](/fr/docs/reference/brand/) couvre les wordmarks, slogans, badges, la marque appliquée au build et les surcharges d'assets publics.
- [Pied de page et pages](/fr/docs/customize/footer-pages/) couvre les pages publiques légales et de confiance.
- [Contrôle d'accès](/fr/docs/customize/access-control/) protège les chemins opérationnels avec Cloudflare Access.
- [Analytics](/fr/docs/customize/analytics/), [Politique et blocklist](/fr/docs/customize/blocklist/) et [Protection réseau](/fr/docs/customize/network-protection/) couvrent la visibilité du trafic et les contrôles anti-abus.

## Verifier le comportement exact

- [Reference](/fr/docs/reference/) documente les fichiers, artefacts runtime, comportements sécurité, formats de liens, horaires et mises à jour.
- [Structure du dépôt](/fr/docs/reference/repository-layout/) montre ou vivent les fichiers source, custom, génères et Worker.
- [Surcharges custom](/fr/docs/reference/custom-overrides/) associe les fichiers propres à l'instance aux surfaces qu'ils remplacent.
- [Mettre à jour une instance](/fr/docs/reference/upgrading/) garde une instance existante à jour.

## Maintenir le site web

- [Web site](/fr/docs/web-site/) documente le dépôt `vanityURLs/website` pour les contributeurs.
- [Développement local](/fr/docs/web-site/local-development/) couvre Hugo, Node.js, les builds, tests et erreurs locales courantes.
- [Rédaction de contenu](/fr/docs/web-site/content-authoring/) couvre les pages docs, traductions, shortcodes, assets et chaînes i18n.
- [Hébergement et déploiement](/fr/docs/web-site/hosting-deployment/), [Analytics du site](/fr/docs/web-site/analytics/) et [Releases](/fr/docs/web-site/releases/) couvrent le déploiement Cloudflare Workers, l'intégration Umami et le flux release-please.
