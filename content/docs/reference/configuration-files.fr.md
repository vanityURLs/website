---
aside: false
title: "Fichiers de configuration"
description: "Référence des fichiers de configuration source, custom, locaux et générés de vanityURLs."
weight: 30
aliases:
  - /docs/configuration-files/

---

vanityURLs garde les valeurs par défaut du produit, les choix propres à l'instance, les réglages locaux du poste et les artefacts runtime générés dans des fichiers séparés.

Utilisez cette page pour identifier les fichiers de configuration actuels et la forme de schéma que chacun suit. Le contrat exact reste les fichiers Git et les scripts dans le dépôt de code.

## Configuration source

| Fichier | Format | Forme de schéma | Proprietaire |
| --- | --- | --- | --- |
| [`wrangler.toml`](https://github.com/vanityURLs/code/blob/main/wrangler.toml) | TOML, selon la [configuration Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/) | `name`, `main`, `compatibility_date`, `workers_dev`, `preview_urls`, `[build]`, `[assets]`, `[vars]`, `[[routes]]`, `[observability]` | Instance |
| [`package.json`](https://github.com/vanityURLs/code/blob/main/package.json) | Manifeste npm JSON | `scripts`, `devDependencies`, metadonnées du paquet | Produit |
| `package-lock.json` | Lockfile npm JSON | Graphe de dependances verrouille génère par npm | Produit |
| [`defaults/v8s-site-config.json`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-site-config.json) | Configuration de site vanityURLs JSON, `schema_version: "1.0"` | Base produit pour `i18n`, `links`, et `operator` | Produit |
| `custom/v8s-site-config.json` | Configuration de site vanityURLs JSON, `schema_version: "1.0"` | Surcharges d'instance pour `i18n`, `links`, `operator`, et `branding`; `operator.operator_domain` peut piloter le domaine par défaut des contacts | Instance |
| [`defaults/v8s-links.txt`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-links.txt) | Texte delimite par pipes | `slug\|target\|state\|title\|description\|tags\|owner\|expires_at\|notes` | Liens de départ produit |
| `custom/v8s-links.txt` | Texte delimite par pipes | Meme format que `defaults/v8s-links.txt`; c'est la [source de vérité rédigée par un humain pour les liens](/fr/docs/reference/link-format/) | Instance |
| [`defaults/v8s-schedules.json`](/fr/docs/reference/link-format/) | Horaire vanityURLs JSON | Objet indexe par slug; chaque valeur supporte `timezone`, `default`, des raccourcis comme `9to5`, et `rules[]` avec `label`, `timezone`, `days`, `from`, `to`, `target` | Horaires de départ produit |
| `custom/v8s-schedules.json` | Horaire vanityURLs JSON | Meme format que `defaults/v8s-schedules.json`; les entrées custom remplacent les slugs par défaut correspondants | Instance |
| [`defaults/v8s-policies.json`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-schedules.json) | Politique vanityURLs JSON, `schema_version: "1.0"` | `defaults`, `allow_domains`, `blocked_keywords`, `block_domains`, `generated_sources` optionnel | Produit |
| `custom/v8s-policies.json` | Politique vanityURLs JSON, `schema_version: "1.0"` | Meme format que `defaults/v8s-policies.json`; la politique custom remplace la politique source par défaut avant la fusion des feeds génères | Instance |
| [`defaults/v8s-blocklist-categories.json`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-policies.json) | Taxonomie de politique vanityURLs JSON, `schema_version: "1.0"` | `categories`, `severities`, `sources` | Produit |
| `custom/v8s-blocklist-categories.json` | Taxonomie de politique vanityURLs JSON, `schema_version: "1.0"` | Extension ou surcharge optionnelle des categories, sevérités et sources de blocklist générée | Instance |
| [`defaults/v8s-local-config.json`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-blocklist-categories.json) | Configuration locale vanityURLs JSON, `schema_version: "1.0"` | `shell_helper`, `lnk_cli`, `local_publish`, `registry`, `repository` | Produit |
| `custom/v8s-local-config.json` | Configuration locale vanityURLs JSON, `schema_version: "1.0"` | Chemins du helper propres au poste et réglages de publication locale écrits par `npm run local-install` | Poste |
| [`defaults/public/_headers`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-local-config.json) | Regles d'en-têtes pour assets statiques Cloudflare | Motif de chemin suivi de lignes d'en-têtes indentees | Produit ou surcharge d'instance |

Les anciens `custom/v8s-blocklist.json` et `defaults/v8s-blocklist.json` peuvent encore être reconnus pour compatibilite de migration, mais les nouvelles instances devraient utiliser `v8s-policies.json`.

## Configuration du site

`custom/v8s-site-config.json` est le principal fichier de setup écrit par `npm run setup`. Il stocke les réglages de site propres à l'instance, dont les langues, la marque, les contacts opérateur, le mode des pages légales et les valeurs par défaut de la CLI de liens. La liste exacte des champs est définie par [`defaults/v8s-site-config.json`](https://github.com/vanityURLs/code/blob/main/defaults/public/_headers) et l'installateur. Les sections principales importantes sont :

| Section | Rôle |
| --- | --- |
| `schema_version` | Version du contrat de configuration stocké. Elle change seulement lorsqu'un fichier custom existant doit migrer |
| `i18n` | Langue par défaut et langues supportées |
| `links` | Longueur par défaut des slugs générés, alphabet lisible et longueurs par tag pour `lnk` |
| `operator` | Identité opérateur, contacts, mode des pages légales, divulgation analytics et fenêtre de réponse |
| `branding` | Domaine court, slogan public, drapeau des pages publiques gérées par l'installateur et wordmark en deux couleurs |

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
    "operator_domain": "example.com",
    "abuse_contact": "abuse@example.com",
    "security_contact": "security@example.com",
    "abuse_response_window": "5 business days",
    "legal_pages_enabled": false
  },
  "branding": {
    "domain": "example.link",
    "slogan": {
      "en": "A short-link service for Example Inc.'s projects",
      "fr": "Un service de liens courts pour les projets de Example Inc."
    },
    "custom_public": true,
    "wordmark": {
      "black": "example.",
      "green": "link"
    }
  }
}
```

Des champs additifs peuvent apparaitre sans changer `schema_version`. Les changements de version de schéma sont réserves aux changements incompatibles de configuration stockee qui demandent une migration; la décision est consignée dans les ADR du dépôt de code. Les champs additifs sont suivis dans [`docs/schema-changelog.md`](https://github.com/vanityURLs/code/blob/main/defaults/v8s-site-config.json) du dépôt de code.

Ne modifiez pas les fichiers générés dans `build/`. Modifiez `custom/`, puis reconstruisez avec `npm run check`.

## Configuration générée

| Fichier | Format | Forme de schéma | Genere par |
| --- | --- | --- | --- |
| `build/v8s.json` | Registre runtime JSON, `schema_version: "2.2"` | `generated_at`, `default_state`, `routing`, `links[]`; chaque lien contient `slug`, `match`, `target`, `state`, les metadonnées et un `schedule` optionnel | `scripts/build-redirect-targets.mjs` |
| `build/v8s-blocklist.json` | Politique runtime JSON, `schema_version: "1.0"` | `defaults` normalises, `allow_domains`, `blocked_keywords`, `block_domains` fusionnes | `scripts/build.mjs` |
| `build/v8s-site-config.json` | Configuration de site runtime JSON, `schema_version: "1.0"` | Configuration de site effective après fusion des valeurs par défaut et custom | `scripts/build.mjs` |
| `build/blocklist.generated.json` | Feed de politique génère JSON, `schema_version: "1.0"` | `generated_at`, `sources[]`, `block_domains[]` génères | `npm run generate:blocklist` |
| `src/worker.mjs` | Module Worker génère | Source Worker copiee depuis `scripts/workers/worker.mjs` avec constantes de langues générées | `scripts/build.mjs` |

Les fichiers génères sont des sorties de build. Ne les modifiez pas directement.

## Ordre de surcharge publique

Le build des assets publics est détérministe :

1. copier `defaults/public/` dans `build/`
2. appliquer `custom/public/` lorsqu'il existe
3. copier le `defaults/public/_stats/index.html` par défaut
4. appliquer `custom/public/_stats/index.html` lorsqu'il existe
5. retirer les répertoires de langues non supportées selon `v8s-site-config.json`
6. construire `v8s.json`, `v8s-blocklist.json`, et `v8s-site-config.json`
7. génèrer `src/` depuis `scripts/workers/` pour Wrangler

## Artefacts runtime

Le Worker ne lit pas `v8s-links.txt` à chaque requête. Le build crée les artefacts runtime depuis les fichiers source, les valide, puis les deploie avec les assets Worker.

Les entrées de build incluent :

- `defaults/v8s-links.txt`, remplace par `custom/v8s-links.txt` quand present
- `defaults/v8s-schedules.json`, avec `custom/v8s-schedules.json` fusionne par-dessus
- `defaults/v8s-policies.json`, remplace par `custom/v8s-policies.json` quand present
- `defaults/v8s-site-config.json`, avec `custom/v8s-site-config.json` fusionne pour les choix de site
- les assets statiques de `defaults/public/`, surcharges par `custom/public/`
- les données de feeds générées par `npm run generate:blocklist`

Le build écrit :

| Artefact | Role |
| --- | --- |
| `build/v8s.json` | Registre de redirection consomme par le Worker |
| `build/v8s-blocklist.json` | Artefact de politique runtime consomme par le Worker |
| `build/v8s-site-config.json` | Configuration de site utilisee par le build |
| `src/worker.mjs` | Entree Worker générée depuis `scripts/workers/` pour Wrangler |

`scripts/workers/` est la source de vérité du Worker. `src/` est une sortie générée. Les requêtes publiques directes vers les fichiers runtime bruts comme `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json` devraient retourner 404.
