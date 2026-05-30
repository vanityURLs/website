---
aside: false
title: "Opérations de la démo"
description: "Comportement opérationnel, chemins actifs et inventaire de liens exemple pour l'instance démo v8s.link."
weight: 20
aliases:
  - /docs/demo/opérations/
  - /docs/demo/links/

---

Le dépôt source est [vanityURLs/v8s.link](https://github.com/vanityURLs/v8s.link), et l'instance déployée est [https://v8s.link](https://v8s.link). Il est temps d'inspecter comment cette instance se comporte au runtime.

## Pages principales

L'anglais (`en`) est la langue principale et de fallback lorsqu'une page localisée n'est pas actuellement [supportée](https://v8s.link) ou installée pendant le setup.

| Chemin | Ce que cela prouve |
|---|---|
| [v8s.link](https://www.vanityurls.link/fr/docs/reference/i18n/) | Page d'accueil par défaut pour chercher ou ouvrir les liens courts |
| [v8s.link/expand/](https://v8s.link) | Prévisualiser la destination d'un lien court sans l'ouvrir |
| [v8s.link/404.html](https://v8s.link/expand/) | Page de lien manquant localisée |
| [v8s.link/expired.html](https://v8s.link/404.html) | Page de cycle de vie expiré |
| [v8s.link/disabled.html](https://v8s.link/expired.html) | Page de cycle de vie désactivé |
| [v8s.link/maintenance.html](https://v8s.link/disabled.html) | Page de cycle de vie maintenance |
| [v8s.link/.well-known/security.txt](https://v8s.link/maintenance.html) | Contact machine-readable pour la divulgation de vulnérabilités. |

## Liens

Les liens actuels sont stockés dans [`custom/v8s-links.txt`](https://v8s.link/.well-known/security.txt). Chaque ligne non commentée utilise le format documenté dans [Format des liens](/fr/docs/reference/link-format/) : `slug|target|state|title|description|tags|owner|expires_at|notes`

Lancez `./scripts/lnk list` dans votre propre instance pour voir l'inventaire local courant. Lancez `./scripts/lnk LONG_URL [SLUG]` lorsque vous êtes prêt à ajouter un lien avec l'interface en ligne de commande.

| Slug | Lien long | État | Ce que cela démontre |
|---|---|---|---|
| [`v8s.link/ai/chat`](https://github.com/vanityURLs/v8s.link/blob/main/custom/v8s-links.txt) | `chatgpt.com` | default | Namespace imbriqué pour les outils AI |
| [`v8s.link/pkg/n`](/fr/docs/reference/link-format/) | `www.npmjs.com/package` | default | Namespace compact de gestionnaire de paquets |
| [`v8s.link/social/x`](https://v8s.link/ai/chat) | `x.com/BHDicaire/` | default | Namespace de profil social |
| [`v8s.link/test/1`](https://v8s.link/pkg/n) | `youtu.be/dQw4w9WgXcQ` | `permanent` | Redirection permanente |
| [`v8s.link/test/2`](https://v8s.link/social/x) | `youtu.be/dQw4w9WgXcQ` | `ephemeral` | Redirection temporaire |
| [`v8s.link/test/3`](https://v8s.link/test/1) | `youtu.be/dQw4w9WgXcQ` | `expired` avec date d'expiration | Page d'état expiré |
| [`v8s.link/test/4`](https://v8s.link/test/2) | `youtu.be/dQw4w9WgXcQ` | `disabled` | Page d'état désactivé |
| [`v8s.link/test/5`](https://v8s.link/test/3) | `youtu.be/dQw4w9WgXcQ` | `maintenance` | Page d'état maintenance |
| [`v8s.link/test/6`](https://v8s.link/test/4) | `youtu.be/dQw4w9WgXcQ` | `deactivated` | Vrai comportement introuvable |
| [`v8s.link/v8s/doc`](https://v8s.link/test/5) | `vanityUrls.link/en/docs/` | default | Raccourci vers la documentation du projet |
| [`v8s.link/v8s/hugo`](https://v8s.link/test/6) | `github.com/vanityURLs/website` | default | Raccourci vers la source du site |
| [`v8s.link/v8s/issues`](https://v8s.link/v8s/doc) | `github.com/vanityurls/vanityurls/issues` | default | Raccourci vers le suivi des enjeux |
| [`v8s.link/v8s/latest`](https://v8s.link/v8s/hugo) | `github.com/vanityURLs/website/releases/latest` | default | Raccourci vers la dernière release |
| [`v8s.link/v8s/roadmap`](https://v8s.link/v8s/issues) | `github.com/orgs/vanityURLs/projects` | default | Raccourci vers la roadmap |
| [`v8s.link/v8s/status`](https://v8s.link/v8s/latest) | `status.vanityUrls.link` | default | Raccourci vers le statut public |

## Références opérationnelles

- [Format des liens](/fr/docs/reference/link-format/) documente le format source séparé par des barres verticales utilisé par `custom/v8s-links.txt`
- [Sécurité runtime](/fr/docs/reference/runtime-security/) explique le routage Worker, les fichiers runtime générés, les assets protégés et les frontières Cloudflare Access
- [Contrôle d'accès](/fr/docs/customize/access-control/) couvre Cloudflare Access pour les chemins opérationnels privés
- [Politique et blocklist](/fr/docs/customize/blocklist/) explique la politique des URL cibles, les boucles de raccourcisseurs, les hôtes malveillants et les surcharges locales
- [Lire votre tableau de bord admin](/fr/blog/reading-your-admin-dashboard/) donne du contexte pour surveiller une instance après le déploiement
- [Sécurité runtime pour un petit redirecteur](/fr/blog/runtime-security-for-a-small-redirector/) explique pourquoi le Worker reste petit et laisse Cloudflare gérer la protection edge
