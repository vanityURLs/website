---
aside: false
title: "Surcharges custom"
description: "Associer les fichiers propres a l'instance sous custom/ aux pages vanityURLs qui documentent chaque surface de personnalisation."
weight: 80
aliases:
  - /docs/custom-overrides/

---

Utilisez `custom/` pour les fichiers propres a l'instance. Cela garde les deploiements faciles a mettre a jour pendant que les pages par defaut, la logique Worker, la politique source et les reglages locaux evoluent.

Pour le raisonnement de mise a jour, lisez [Garder vanityURLs facile a mettre a jour avec custom](/fr/blog/keeping-vanityurls-upgradable-with-custom-overrides/). Pour l'ordre de build et les artefacts generes, lisez [Fichiers de configuration](/fr/docs/reference/configuration-files/).

## Defaults versus custom

`defaults/` est la base produit. `custom/` est la couche de l'instance. Les fichiers dans `custom/` remplacent certains defaults ou fournissent des donnees propres a l'instance qui doivent survivre aux mises a jour upstream.

Gardez les changements produit dans `defaults/` seulement lorsque vous contribuez a vanityURLs. Gardez les changements d'instance dans `custom/` lorsque le changement appartient seulement a votre domaine court.

## Carte des fichiers custom

| Fichier ou chemin | Utilisation | Details |
| --- | --- | --- |
| `custom/v8s-links.txt` | Inventaire de redirection | [Format des liens](/fr/docs/reference/link-format/) et [LNK](/fr/docs/command-line-interface/lnk/) |
| `custom/v8s-schedules.json` | Changements d'etat planifies | [Liens planifies](/fr/docs/scheduled-links/) |
| `custom/v8s-policies.json` | Politique allow/block de l'instance | [Politique de blocklist](/fr/docs/blocklist-policy/) |
| `custom/v8s-site-config.json` | Reglages de site ecrits par setup | [Fichiers de configuration](/fr/docs/reference/configuration-files/) |
| `custom/v8s-local-config.json` | Chemins de helper propres au poste | [Helper local](/fr/docs/command-line-interface/local-helper/) |
| `custom/public/` | Surcharges de pages publiques et d'assets | Voir [Surcharges publiques](#surcharges-publiques) |

## Pages publiques gerees par l'installateur

`npm run setup` peut copier `defaults/public/` vers `custom/public/`, remplacer le wordmark `Vanity` + `URLs` par les portions noire et verte configurees, mettre a jour les libelles et liens de marque, puis retirer les langues non supportees.

L'installateur enregistre ces choix dans `custom/v8s-site-config.json` pour que les executions repetees restent previsibles. Si `custom/public/` contient deja des fichiers et n'est pas marque comme gere par l'installateur, setup refuse de le remplacer sauf avec `--force`.

Lorsque vous utilisez `custom/public/`, gardez `i18n.supported_languages` aligne avec les pages localisees que vous supportez vraiment. Voir [Internationalisation](/fr/docs/reference/i18n/) pour les regles de repertoires de langue.

## Surcharges publiques

| Surcharge | Chemin | Details |
| --- | --- | --- |
| Assets de marque | `custom/public/v8s-logo.svg`, `custom/public/favicon.svg`, `custom/public/site.webmanifest` | [Marque](/fr/docs/reference/brand/) |
| Pied de page et pages | `custom/public/privacy.html`, `custom/public/terms.html`, `custom/public/abuse.html`, `custom/public/security.html` | [Pied de page et pages](/fr/docs/customize/footer-pages/) |
| Pages publiques localisees | `custom/public/fr/index.html`, `custom/public/es/404.html`, et chemins de langue similaires | [Internationalisation](/fr/docs/reference/i18n/) |
| Badges rediriges | `custom/public/{language}/v8s-redirected.svg` et `v8s-redirected-dark.svg` | [Marque](/fr/docs/reference/brand/) |
| Page expand | `custom/public/expand/index.html` | [Format des liens](/fr/docs/reference/link-format/) |
| Shell du tableau admin | `custom/public/_stats/index.html` | [Tableau admin](/fr/docs/reference/admin-dashboard/) et [Controle d'acces](/fr/docs/customize/access-control/) |
| Headers | `custom/public/_headers` | [Approche securite du runtime](/fr/docs/reference/runtime-security/) |

## Pages de statut

Le Worker sert des fichiers precis pour les etats de lien et de routage. Pour creer des pages de statut custom, placez les fichiers a ces chemins exacts :

| Fichier | Utilise pour | Statut |
| --- | --- | --- |
| `custom/public/404.html` | Liens courts inconnus et pages manquantes | 404 |
| `custom/public/disabled.html` | Liens desactives | 403 |
| `custom/public/expired.html` | Liens expires | 410 |
| `custom/public/maintenance.html` | Liens temporairement indisponibles | 503 |

Les versions localisees utilisent le [code langue](/fr/docs/reference/i18n/#langues-supportees) comme premier segment de repertoire, par exemple `custom/public/fr/404.html`. Vous devez seulement ajouter les pages localisees que vous supportez vraiment. Si une page localisee manque, le Worker peut revenir a la page par defaut pour l'etat demande.

Si vous remplacez `404.html`, incluez ces placeholders ou vous voulez afficher le contexte runtime :

```html
<!-- {{SLUG_MESSAGE}} -->
<!-- {{REFERENCE_LINE}} -->
```

`{{SLUG_MESSAGE}}` est remplace par un message securitaire au sujet du slug demande. `{{REFERENCE_LINE}}` est remplace par une reference de correlation utile pour le support et la revue des logs.
