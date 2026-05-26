---
aside: false
title: "Fichiers de configuration"
description: "Référence des fichiers de configuration source, custom, locaux et générés de vanityURLs."
weight: 30
aliases:
  - /docs/configuration-files/

---

vanityURLs garde les valeurs par défaut du produit, les choix propres à l'instance, les réglages locaux du poste et les artefacts runtime générés dans des fichiers séparés.

| Fichier | Rôle |
| --- | --- |
| [`defaults/v8s-site-config.json`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-site-config.json) | Base produit pour les langues, les champs opérateur et les valeurs par défaut de la CLI de liens |
| `custom/v8s-site-config.json` | Réglages de site propres à l'instance. Les détails sont dans [Configuration du site](#configuration-du-site) ci-dessous |
| `custom/v8s-links.txt` | [Source de vérité rédigée par un humain pour les liens](/fr/docs/reference/link-format/) |
| [`custom/v8s-policies.json`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-policies.json) | Choix de blocklist et de politique propres à l'instance, bases sur le default produit |
| `custom/v8s-local-config.json` | Chemins du helper propres au poste, écrits par `npm run local-install` |
| `build/v8s.json` | Registre runtime de redirection généré |
| `build/v8s-blocklist.json` | Politique runtime de blocklist générée |
| `build/v8s-site-config.json` | Configuration de site générée utilisée par le build Worker |

## Configuration du site

`custom/v8s-site-config.json` est le principal fichier de setup écrit par `npm run setup`. Il stocke les réglages de site propres à l'instance, dont les langues, la marque, les contacts opérateur, le mode des pages légales et les valeurs par défaut de la CLI de liens. La liste exacte des champs est définie par [`defaults/v8s-site-config.json`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-site-config.json) et l'installateur. Les sections principales importantes sont :

| Section | Rôle |
| --- | --- |
| `schema_version` | Version du contrat de configuration stocké. Elle change seulement lorsqu'un fichier custom existant doit migrer |
| `i18n` | Langue par défaut et langues supportées |
| `links` | Longueur par défaut des slugs générés, alphabet lisible et longueurs par tag pour `lnk` |
| `operator` | Identité opérateur, contacts, mode des pages légales, divulgation analytics et fenêtre de réponse |
| `branding` | Domaine court, drapeau des pages publiques gérées par l'installateur et wordmark en deux couleurs |

Exemple :

```json
{
  "schema_version": "1.0",
  "i18n": {
    "default_language": "en",
    "supported_languages": ["en", "fr"]
  },
  "links": {
    "random_slug_length": 3,
    "random_slug_alphabet": "34789abcdefghjkmnpqrstvwxy",
    "tag_random_slug_lengths": {
      "training": 4,
      "debug": 2
    }
  },
  "operator": {
    "legal_name": "Example Inc.",
    "short_domain": "example.link",
    "abuse_contact": "abuse@example.link",
    "security_contact": "security@example.link",
    "abuse_response_window": "5 business days",
    "legal_pages_enabled": false
  },
  "branding": {
    "domain": "example.link",
    "custom_public": true,
    "wordmark": {
      "black": "example.",
      "green": "link"
    }
  }
}
```

Des champs additifs peuvent apparaitre sans changer `schema_version`. Les changements de version de schema sont reserves aux changements incompatibles de configuration stockee qui demandent une migration; la decision est consignée dans les ADR du depot de code.

Ne modifiez pas les fichiers générés dans `build/`. Modifiez `custom/`, puis reconstruisez avec `npm run check`.

## Ordre de surcharge publique

Le build des assets publics est deterministe :

1. copier `defaults/public/` dans `build/`
2. appliquer `custom/public/` lorsqu'il existe
3. copier le `defaults/public/_stats/index.html` par defaut
4. appliquer `custom/public/_stats/index.html` lorsqu'il existe
5. retirer les repertoires de langues non supportees selon `v8s-site-config.json`
6. construire `v8s.json`, `v8s-blocklist.json`, et `v8s-site-config.json`
7. generer `src/` depuis `scripts/workers/` pour Wrangler

## Artefacts runtime

Le Worker ne lit pas `v8s-links.txt` a chaque requete. Le build cree les artefacts runtime depuis les fichiers source, les valide, puis les deploie avec les assets Worker.

Les entrees de build incluent :

- `defaults/v8s-links.txt`, remplace par `custom/v8s-links.txt` quand present
- `defaults/v8s-schedules.json`, avec `custom/v8s-schedules.json` fusionne par-dessus
- `defaults/v8s-policies.json`, remplace par `custom/v8s-policies.json` quand present
- `defaults/v8s-site-config.json`, avec `custom/v8s-site-config.json` fusionne pour les choix de site
- les assets statiques de `defaults/public/`, surcharges par `custom/public/`
- les donnees de feeds generees par `npm run generate:blocklist`

Le build ecrit :

| Artefact | Role |
| --- | --- |
| `build/v8s.json` | Registre de redirection consomme par le Worker |
| `build/v8s-blocklist.json` | Artefact de politique runtime consomme par le Worker |
| `build/v8s-site-config.json` | Configuration de site utilisee par le build |
| `src/worker.mjs` | Entree Worker generee depuis `scripts/workers/` pour Wrangler |

`scripts/workers/` est la source de verite du Worker. `src/` est une sortie generee. Les requetes publiques directes vers les fichiers runtime bruts comme `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json` devraient retourner 404.
