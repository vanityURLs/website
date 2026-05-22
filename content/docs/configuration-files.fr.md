---
aside: false
title: "Fichiers de configuration"
description: "Référence des fichiers de configuration source, custom, locaux et générés de vanityURLs."
weight: 30
---

vanityURLs garde les valeurs par défaut du produit, les choix propres à l'instance, les réglages locaux du poste et les artefacts runtime générés dans des fichiers séparés.

| Fichier | Rôle |
| :--- | :--- |
| `defaults/v8s-site-config.json` | Base produit pour les langues et les champs opérateur |
| `custom/v8s-site-config.json` | Réglages de site propres à l'instance. Les détails sont dans [Configuration du site](#configuration-du-site) ci-dessous |
| `custom/v8s-links.txt` | [Source de vérité rédigée par un humain pour les liens](/fr/docs/link-format/) |
| `custom/v8s-policies.json` | Choix de blocklist et de politique propres à l'instance |
| `custom/v8s-local-config.json` | Chemins du helper propres au poste, écrits par `npm run local-install` |
| `build/v8s.json` | Registre runtime de redirection généré |
| `build/v8s-blocklist.json` | Politique runtime de blocklist générée |
| `build/v8s-site-config.json` | Configuration de site générée utilisée par le build Worker |

## Configuration du site

`custom/v8s-site-config.json` est le principal fichier de setup écrit par `npm run setup`. Il stocke les réglages de site propres à l'instance, dont les langues, la marque, les contacts opérateur et le mode des pages légales. Les sections principales importantes sont :

| Section | Rôle |
| :--- | :--- |
| `i18n` | Langue par défaut et langues supportées |
| `operator` | Identité opérateur, contacts, mode des pages légales, divulgation analytics et fenêtre de réponse |
| `branding` | Domaine court, drapeau des pages publiques gérées par l'installateur et wordmark en deux couleurs |

Ne modifiez pas les fichiers générés dans `build/`. Modifiez `custom/`, puis reconstruisez avec `npm run check`.
