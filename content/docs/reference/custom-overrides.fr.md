---
aside: false
title: "Surcharges custom"
description: "Associer les fichiers propres à l'instance sous custom/ aux surfaces de configuration et de pages publiques vanityURLs."
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

| Fichier ou chemin                  | Utilisation                                                            | Détails                                                                                                                                                                                                                    |
| ---------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `custom/v8s-links.txt`             | Inventaire de redirection                                              | [Format des liens](/fr/docs/reference/link-format/) et [LNK](/fr/docs/command-line-interface/lnk/)                                                                                                                         |
| `custom/v8s-schedules.json`        | Règles d'horaire héritées pour compatibilité 3.x                       | [Liens planifiés](/fr/docs/reference/schedules/)                                                                                                                                                                           |
| `custom/v8s-policies.json`         | Politique allow/block de l'instance                                    | [Politique et blocklist](/fr/docs/customize/blocklist/)                                                                                                                                                                    |
| `custom/v8s-site-config.json`      | Réglages de site écrits par setup                                      | [Fichiers de configuration](/fr/docs/reference/configuration-files/)                                                                                                                                                       |
| `custom/v8s-local-config.json`     | Chemins de helper propres au poste                                     | [Helper local](/fr/docs/command-line-interface/local-helper/)                                                                                                                                                              |
| `custom/v8s-custom-overrides.json` | Exceptions de maintenance volontaires pour les fichiers publics custom | [Pages publiques et pages de statut](/fr/docs/reference/public-pages/#ignorer-doctor-volontairement/) et [v8s-fix](/fr/docs/command-line-interface/v8s-fix/)                                                               |
| `custom/public/`                   | Surcharges de pages publiques, assets, pages de statut et headers      | [Pages publiques et pages de statut](/fr/docs/reference/public-pages/), [Marque](/fr/docs/reference/brand/), [Pied de page et pages](/fr/docs/customize/footer-pages/) et [Internationalisation](/fr/docs/reference/i18n/) |
| `custom/public/_headers`           | Surcharges avancées des headers publics et de la CSP                   | [Approche sécurité du runtime](/fr/docs/reference/runtime-security/#content-security-policy/)                                                                                                                              |

## Pages publiques

Utilisez [Pages publiques et pages de statut](/fr/docs/reference/public-pages/) pour les chemins exacts sous `custom/public/`, les placeholders de pages de statut, les avertissements sur les assets partagés et la guidance CSP pour le HTML custom.

Utilisez `custom/public/_headers` seulement lorsque l'instance accepte volontairement une politique de headers ou de CSP différente. Les headers Worker et statiques par défaut fournissent déjà la CSP stricte des pages produit, la CSP sandboxée des pages custom, les règles no-index, HSTS, referrer policy, permissions policy et les blocages des fichiers runtime bruts.

Utilisez `custom/v8s-custom-overrides.json` seulement pour des exceptions de maintenance volontaires. Il indique à `npm run doctor` qu'un fichier custom précis est volontairement différent, afin de ne pas lancer [v8s-fix](/fr/docs/command-line-interface/v8s-fix/) contre un travail qui appartient à l'instance.
