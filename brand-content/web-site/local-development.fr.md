---
aside: false
type: brand
title: "Développement local"
description: "Executer, construire, tester et déboguer le site Hugo vanityURLs localement."
weight: 10
aliases:
  - /fr/docs/web-site/local-development/
---

Utilisez cette page lorsque vous modifiez les layouts, le contenu, les styles, la recherche ou le petit Worker Cloudflare qui sert le site de documentation.

## Prérequis

| Outil         | Version         | Pourquoi                                                                                           |
| ------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| Hugo Extended | `0.158.0+`      | Le site utilise des fonctions du pipeline d'assets Hugo qui demandent une version extended moderne |
| Node.js       | `20+`           | Scripts npm, Tailwind, PostCSS, Pagefind, Wrangler et tests                                        |
| Git           | Version moderne | `enableGitInfo` utilise les métadonnées de commit pour les dates de dernière modification          |
| Go            | Optionnel       | Seulement nécessaire si vous construisez Hugo vous-même                                            |

{{< callout type="warning" title="Utilisez Hugo Extended" >}}
Le binaire Hugo non extended peut échouer ou produire du CSS différent de la production. Confirmez que `hugo version` contient `+extended`.
{{< /callout >}}

## Premier setup

```bash
git clone https://github.com/vanityURLs/website.git
cd website
npm install
```

`npm install` installe Tailwind, Pagefind, PostCSS, Wrangler et les outils de lint.

## Flux quotidien

Lancez le serveur local :

```bash
npm run dev
```

Cette commande lance `hugo server --buildDrafts`, surveille `content/`, `layouts/`, `assets/`, `data/` et `i18n/`, puis sert le site à `http://localhost:1313/`.

Le serveur par défaut ne construit pas l'index Pagefind. Lorsque vous devez tester la recherche :

```bash
npm run dev:search
```

Cette commande fait un build Hugo minifié, construit l'index Pagefind, puis démarre le serveur. Relancez-la lorsque les résultats de recherche doivent refléter de nouvelles modifications.

## Build et vérifications

```bash
npm run build
npm run lint
npm run lint:all
npm test
```

| Commande           | Utilisez-la quand                                                                       |
| ------------------ | --------------------------------------------------------------------------------------- |
| `npm run build`    | Vérifier Hugo, les assets générés et Pagefind                                           |
| `npm run lint`     | Lancer les vérifications format, Markdown, YAML et orthographe                          |
| `npm run lint:all` | Ajouter la vérification des liens du site généré avant une release ou un gros nettoyage |
| `npm test`         | Lancer les tests Worker dans `src/worker.test.mjs`                                      |

La vérification des liens externes peut être lente ou limitée par les sites distants. Gardez-la séparée du travail d'édition normal sauf pendant une passe de release.

## Développement Worker

Le Worker du site dans `src/worker.mjs` sert les assets statiques et envoie les événements analytics côté serveur pour les requêtes HTML.

Lancez-le localement avec Wrangler :

```bash
npx wrangler dev
```

Wrangler sert à `http://localhost:8787/` et recharge les changements Worker.

{{< callout type="note" title="Les secrets locaux sont optionnels la plupart du temps" >}}
Les appels analytics sont ignorés lorsque les valeurs d'environnement nécessaires manquent. C'est correct pour le travail de layout et de routage d'assets. Ajoutez des secrets locaux seulement lorsque vous déboguez précisément les analytics.
{{< /callout >}}

## Déploiement local pendant les tests

Utilisez-le seulement lorsque l'intégration GitHub est indisponible ou lorsque vous voulez tester volontairement un déploiement local :

```bash
npm install
npm run build
npx wrangler login
npx wrangler deploy
```

Les déploiements locaux utilisent le même `wrangler.toml` et les mêmes secrets runtime documentés dans [Hébergement et déploiement](/fr/web-site/hosting-deployment/). Cloudflare les marque comme déploiements manuels plutôt que liés à Git.

## Corrections courantes

| Symptôme                               | Vérifier                                                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Une nouvelle page n'apparait pas       | Le fichier n'est pas `draft: true`, utilise `name.en.md` ou `name.fr.md`, et possède un poids de section s'il appartient à la navigation docs |
| Les traductions ne se jumellent pas    | Le nom de base et le dossier doivent correspondre, par exemple `content/docs/foo.en.md` et `content/docs/foo.fr.md`                           |
| La recherche locale est vide           | Utilisez `npm run dev:search` ou vérifiez après un build de type production                                                                   |
| Les changements CSS n'apparaissent pas | Rechargez complètement, confirmez que Hugo a reconstruit, et vérifiez si Tailwind a purgé une classe seulement présente dynamiquement         |
| Hugo ne démarre pas                    | Confirmez Hugo Extended et essayez de supprimer `resources/_gen` avant de reconstruire                                                        |

## Style des commits

Utilisez les conventional commits afin que release-please puisse générer les notes de release correctement :

```text
docs: add website contributor guide
fix(layout): correct mobile docs navigation
style: tune callout spacing
test: cover website analytics payload
```

Les types courants sont `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci` et `chore`.
