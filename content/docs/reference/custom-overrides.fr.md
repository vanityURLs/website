---
aside: false
title: "Surcharges custom"
description: "Associer les fichiers propres à l'instance sous custom/ aux pages vanityURLs qui documentent chaque surface de personnalisation."
weight: 40
aliases:
  - /docs/custom-overrides/
  - /fr/docs/custom-overrides/
  - /docs/customize/custom-overrides/
  - /fr/docs/customize/custom-overrides/

---

Utilisez `custom/` pour les fichiers propres à l'instance. Cela garde les déploiements faciles à mettre à jour pendant que les pages par défaut, la logique Worker, la politique source et les réglages locaux évoluent.

Pour le raisonnement de mise à jour, lisez [Garder vanityURLs facile à mettre à jour avec custom](/fr/blog/keeping-vanityurls-upgradable-with-custom-overrides/). Pour l'ordre de build et les artefacts générés, lisez [Fichiers de configuration](/fr/docs/reference/configuration-files/).

## Defaults versus custom

`defaults/` est la base produit. `custom/` est la couche de l'instance. Les fichiers dans `custom/` remplacent certains defaults ou fournissent des données propres à l'instance qui doivent survivre aux mises à jour upstream.

Gardez les changements produit dans `defaults/` seulement lorsque vous contribuez à vanityURLs. Gardez les changements d'instance dans `custom/` lorsque le changement appartient seulement à votre domaine court.

## Carte des fichiers custom

| Fichier ou chemin | Utilisation | Détails |
| --- | --- | --- |
| `custom/v8s-links.txt` | Inventaire de redirection | [Format des liens](/fr/docs/reference/link-format/) et [LNK](/fr/docs/command-line-interface/lnk/) |
| `custom/v8s-schedules.json` | Changements d'état planifiés | [Liens planifiés](/fr/docs/reference/schedules/) |
| `custom/v8s-policies.json` | Politique allow/block de l'instance | [Politique et blocklist](/fr/docs/customize/blocklist/) |
| `custom/v8s-site-config.json` | Réglages de site écrits par setup | [Fichiers de configuration](/fr/docs/reference/configuration-files/) |
| `custom/v8s-local-config.json` | Chemins de helper propres au poste | [Helper local](/fr/docs/command-line-interface/local-helper/) |
| `custom/public/` | Surcharges de pages publiques et d'assets | [Marque](/fr/docs/reference/brand/), [Pied de page et pages](/fr/docs/customize/footer-pages/) et [Internationalisation](/fr/docs/reference/i18n/) |

## Carte des surcharges publiques

| Surcharge | Chemin | Détails |
| --- | --- | --- |
| Assets de marque et badges redirigés | `custom/public/v8s-logo.svg`, `custom/public/favicon.svg`, `custom/public/{language}/v8s-redirected.svg` | [Marque](/fr/docs/reference/brand/) |
| Pied de page et pages légales | `custom/public/privacy.html`, `custom/public/terms.html`, `custom/public/abuse.html`, `custom/public/security.html` | [Pied de page et pages](/fr/docs/customize/footer-pages/) |
| Pages publiques localisées | `custom/public/fr/index.html`, `custom/public/es/404.html`, et chemins de langue similaires | [Internationalisation](/fr/docs/reference/i18n/) |
| Page expand | `custom/public/expand/index.html` | [Format des liens](/fr/docs/reference/link-format/) |
| Shell du tableau admin | `custom/public/_stats/index.html` | [Lire le tableau admin vanityURLs](/fr/blog/reading-your-admin-dashboard/) et [Contrôle d'accès](/fr/docs/customize/access-control/) |
| Headers | `custom/public/_headers` | [Approche sécurité du runtime](/fr/docs/reference/runtime-security/) |

## Pages de statut

Le Worker sert des fichiers précis pour les états de lien et de routage. Pour créer des pages de statut custom, placez les fichiers à ces chemins exacts :

| Fichier | Utilisé pour | Statut |
| --- | --- | --- |
| `custom/public/404.html` | Liens courts inconnus et pages manquantes | 404 |
| `custom/public/disabled.html` | Liens désactivés | 403 |
| `custom/public/expired.html` | Liens expirés | 410 |
| `custom/public/maintenance.html` | Liens temporairement indisponibles | 503 |

Les versions localisées utilisent le [code langue](/fr/docs/reference/i18n/#langues-supportees) comme premier segment de répertoire, par exemple `custom/public/fr/404.html`. Vous devez seulement ajouter les pages localisées que vous supportez vraiment. Si une page localisée manque, le Worker peut revenir à la page par défaut pour l'état demandé.

Seul `404.html` a des placeholders runtime. Si vous le remplacez, incluez ces placeholders ou vous voulez afficher le contexte runtime :

```html
<!-- {{SLUG_MESSAGE}} -->
<!-- {{REFERENCE_LINE}} -->
```

`{{SLUG_MESSAGE}}` est remplacé par un message sécuritaire au sujet du slug demandé. `{{REFERENCE_LINE}}` est remplacé par une référence de corrélation utile pour le support et la revue des logs.

`disabled.html`, `expired.html` et `maintenance.html` sont servis comme pages d'etat statiques. Ils ne demandent pas de placeholders runtime.
