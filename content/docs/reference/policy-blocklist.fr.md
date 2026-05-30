---
aside: false
title: "Politique et blocklist"
description: "Fichiers de politique source, artefacts de blocklist runtime, catégories, feeds générés et validation dans vanityURLs."
weight: 80
aliases:
  - /docs/blocklist-policy/
  - /fr/docs/blocklist-policy/
  - /docs/référence/blocklist/
  - /fr/docs/référence/blocklist/

---

vanityURLs édite la politique source comme `v8s-policies.json` et déploie la politique runtime comme `build/v8s-blocklist.json`.

Les noms sont décrits comme politique source et artefact runtime de blocklist dans la documentation parce que les noms de fichiers actuels sont faciles à confondre. Un futur nettoyage avec rupture devrait utiliser des noms appariés plus clairs pour le fichier source et le fichier généré.

Les protections runtime intégrées sont documentées dans [Sécurité runtime](/fr/docs/reference/runtime-security/). Utilisez [Politique et blocklist](/fr/docs/customize/blocklist/) lorsque vous avez besoin du workflow opérateur pour changer la politique de l'instance.

## Sélection de source

La politique source est choisie avant le build :[^legacy-policy]

| Fichier | Rôle |
|---|---|
| `defaults/v8s-policies.json` | Politique source upstream de confiance et sécurité |
| `custom/v8s-policies.json` | Politique source de remplacement propre à l'instance |

`custom/v8s-policies.json` ne fusionne pas par-dessus la politique source par défaut. Quand une instance possède sa politique, elle possède le remplacement. Cela évite que des décisions de politique retirées localement réapparaissent par une fusion upstream.

## Catégories et sources

`defaults/v8s-blocklist-categories.json` définit les catégories et sévérités utilisées par la politique source et les données générées. Les catégories expliquent pourquoi un élément est bloqué; les sévérités décrivent le risque pour la sécurité des visiteurs et la réputation du domaine court.

Les valeurs par défaut actuelles incluent :

| Catégorie | Utilisation |
|---|---|
| `phishing` | Vol d'identifiants, fausses pages de connexion, pièges de portefeuille et usurpation de marque |
| `malware` | Distribution de malware, livraison d'exploit, hébergement de payload et infrastructure de commande et contrôle |
| `shortener-loop` | Raccourcisseurs publics qui peuvent cacher la destination finale ou créer des chaînes de redirection |
| `scanner-probe` | Chemins de scanners automatisés qui ne devraient jamais résoudre comme liens courts |
| `temporary-file-host`, `disposable`, `adult`, `gambling`, `social`, `custom` | Catégories propres à l'instance pour risques élevés ou blocages choisis par l'opérateur |

Les feeds générés réduisent les risques évidents, mais peuvent avoir des faux positifs. Relisez les changements source avant de les promouvoir dans une release.

Chaque source générée active devrait avoir une catégorie, une sévérité, une URL et une raison claire de faire confiance à l'amont.

## Comportement des champs

| Champ | Comportement |
|---|---|
| `allow_domains` | Autorise des domaines de confiance contrôlés par l'opérateur et peut surcharger des blocages de domaines générés ou locaux |
| `block_domains` | Bloque les hostnames de destination qui correspondent au domaine configuré ou à un sous-domaine |
| `block_keywords` | Bloque les correspondances dans le hostname, le chemin et la query après mise en minuscules |
| `block_extensions` | Bloque les extensions de fichiers de destination risquées |

`allow_domains` ne surcharge pas les URLs mal formées, protocoles refusés ou URLs avec identifiants.

Gardez les règles de mots-clés spécifiques pour éviter les faux positifs.

## Artefact runtime

Le build écrit l'artefact runtime ici :

```text
build/v8s-blocklist.json
```

Ce fichier est consommé par le Worker et bloqué en accès public direct sous `/v8s-blocklist.json`. C'est un artefact runtime généré, pas le fichier qu'un propriétaire d'instance devrait éditer à la main.

[^legacy-policy]: Les anciens fichiers source `v8s-blocklist.json` peuvent encore être reconnus pour compatibilité de migration, mais les nouvelles docs et nouvelles instances devraient utiliser `v8s-policies.json`.
