---
aside: false
type: brand
title: "Rédaction de contenu"
description: "Rédiger les docs, traductions, shortcodes et chaînes UI du site vanityURLs.link."
weight: 20
aliases:
  - /fr/docs/web-site/content-authoring/
---

Utilisez cette page lorsque vous ajoutez ou modifiez du contenu dans `content/`, `i18n/`, `data/` ou les `layouts/` Hugo.

## Zones du dépôt

| Chemin     | Rôle                                                                  |
| ---------- | --------------------------------------------------------------------- |
| `content/` | Pages, articles, entrées de vitrine et documentation                  |
| `layouts/` | Templates Hugo, partials et shortcodes                                |
| `assets/`  | CSS et JavaScript traités et fingerprintés par Hugo                   |
| `static/`  | Fichiers copiés tels quels avec des URLs publiques stables            |
| `data/`    | Données structurées pour accueil, FAQ, glossaire, confiance et audits |
| `i18n/`    | Chaînes UI utilisées par les templates et shortcodes                  |

## Fichiers de contenu

Utilisez des noms de fichiers propres à la langue :

```text
brand-content/web-site/content-authoring.en.md
brand-content/web-site/content-authoring.fr.md
```

Hugo associe les traductions lorsque le nom de base et le dossier correspondent. Le sélecteur de langue peut revenir à la racine de langue lorsqu'une traduction soeur manque.

## Ajouter une page de documentation

Créez une page dans la section correspondante :

```bash
hugo new web-site/example.fr.md --config hugo.brand.yml
```

Puis définissez le front matter :

```yaml
---
aside: false
title: "Exemple"
description: "Courte description pour SEO et cartes sociales."
weight: 30
---
```

La navigation de documentation est basée sur les sections. Le `_index` de section contrôle la position de la section, et le `weight` de chaque page contrôle l'ordre dans cette section.

## Ajouter un article

```bash
hugo new blog/my-new-post.en.md
```

Utilisez un front matter comme :

```yaml
---
title: "My new post"
description: "Short description for search and social cards."
date: 2026-06-03
tags: [hugo, cloudflare]
draft: true
---
```

Créez la traduction française comme `content/blog/my-new-post.fr.md` lorsque le contenu traduit est prêt.

Les articles sont triés par leur `date` initiale. Gardez cette date stable après publication. Utilisez `lastmod` seulement lorsqu'un signal visible de dernière modification est utile; la page article garde la date de publication près du titre et affiche `lastmod` dans le pied de page.

L'index du blog regroupe les articles dans des catégories éditoriales déduites des étiquettes existantes, sauf si un article fournit un `category` explicite. Préférez l'un de ces identifiants lorsque vous devez remplacer la catégorie déduite :

```yaml
category: customization
```

Les catégories actuelles sont `getting-started`, `releases`, `comparisons`, `operations`, `customization`, `security`, `cloudflare` et `architecture`. Les étiquettes peuvent rester plus précises; les catégories devraient rester assez larges pour la page d'archive. Les versions et comparaisons sont détectées avant les étiquettes opérationnelles ou Cloudflare plus larges, afin qu'un article puisse garder des étiquettes secondaires pratiques sans perdre sa catégorie d'archive.

Les auteurs devraient utiliser un nom d'affichage stable. Ajoutez les auteurs récurrents dans `data/authors.yml` afin que les templates et les données structurées puissent inclure des URLs de profil lorsqu'elles existent.

## Ajouter du texte UI

Ajoutez les libellés de template dans les deux fichiers i18n :

```yaml
# i18n/en.yml
my_new_string: "Continue"
```

```yaml
# i18n/fr.yml
my_new_string: "Continuer"
```

Utilisez-le dans un template avec :

```go-html-template
{{ i18n "my_new_string" }}
```

{{< callout type="warning" title="Ne codez pas les libellés UI réutilisables en dur" >}}
Boutons, badges, libellés de navigation, libellés de shortcode et texte répété de template devraient passer par `i18n/` afin que les pages anglaises et françaises restent alignées.
{{< /callout >}}

## Utiliser les shortcodes

Les shortcodes de documentation courants incluent :

```markdown
{{</* callout type="warning" title="Breaking change" */>}}
Cette option a été supprimée en v3.
{{</* /callout */>}}

{{</* details title="Pourquoi c'est important" */>}}
Explication plus longue qui doit rester disponible sans prendre toute la page.
{{</* /details */>}}

{{</* cards cols="3" */>}}
{{</* card title="Setup" icon="download" href="/fr/docs/setup/" */>}}
Commencer ici.
{{</* /card */>}}
{{</* /cards */>}}
```

Utilisez les callouts pour les avertissements opérationnels, limites de sécurité, notes de premier setup et changements de comportement versionnés. Gardez les explications ordinaires en prose.

Les articles peuvent utiliser le même shortcode de callout, mais plus sobrement que la documentation de référence. Les bons callouts dans un article signalent une précaution pratique, une décision pour le lecteur ou une note du type "faites ceci avant de copier le pattern". Évitez les callouts pour de la simple emphase; un article devrait encore se lire comme un essai.

Le dossier source reste nommé `content/` parce que c'est la racine de contenu conventionnelle de Hugo et qu'elle est déjà distinguée du site de marque par `brand-content/`. Ne le renommez pas en `website-content/` sans migrer en même temps le build, les liens, les docs de contribution et le déploiement Cloudflare.

## Images de page

Gardez les images à côté de la page ou de l'article qu'elles accompagnent lorsque possible. Cela garde le Markdown et ses médias ensemble lorsque le contenu bouge, et rend les assets propres à une page plus faciles à réviser.

Pour un article avec des images locales, créez un page bundle en déplaçant le fichier Markdown dans un dossier et en le renommant `_index.md` :

```text
content/blog/my-new-post/
├── _index.en.md
├── _index.fr.md
└── hero.png
```

Référencez ensuite l'image avec un chemin Markdown relatif :

```markdown
![Texte alternatif](hero.png)
```

Utilisez `static/` lorsqu'une image a besoin d'une URL publique stable, est partagée par plusieurs pages, ou doit être référencée hors du bundle de contenu :

```text
static/images/docs/cloudflare-dashboard.png
```

Référencez les images statiques depuis la racine du site :

```markdown
![Texte alternatif](/images/docs/cloudflare-dashboard.png)
```

## Assets

Utilisez `assets/` lorsque Hugo doit traiter, fingerprintér ou grouper un fichier. Utilisez `static/` pour les fichiers qui doivent garder une URL stable.

{{< mermaid >}}
flowchart LR
A[Nouveau fichier<br/>ou ancienne URL]
B{Hugo doit-il traiter<br/>ou fingerprintér?}
C[Utiliser assets]
D{Chemin public<br/>stable requis?}
E[Utiliser static]
F{Page de<br/>contenu<br/>déplacée?}
G[Utiliser front<br/>matter aliases]
H[Garder avec<br/>le page bundle]

A --> B
B -->|Oui| C
B -->|Non| D
D -->|Oui| E
D -->|Non| F
F -->|Oui| G
F -->|Non| H
{{< /mermaid >}}

| Placez-le ici | Quand                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `assets/`     | CSS, JavaScript ou média référencé par les templates via les ressources Hugo                                               |
| `static/`     | `favicon.ico`, `social.png`, `humans.txt`, `_headers`, `_redirects`, ou fichiers publics qui doivent garder un chemin fixe |

Utilisez `static/_redirects` pour les règles de redirection qui appartiennent à un fichier statique fixe. Ce n'est pas le seul mécanisme de redirection : les pages de contenu peuvent aussi définir des `aliases` dans le front matter lorsqu'une ancienne URL doit rediriger vers une page déplacée.

## Avant publication

Lancez :

```bash
npm run build
npm run lint
```

Utilisez `npm run lint:all` lorsque le changement touche beaucoup de liens, la navigation ou le HTML généré.

Lorsque le changement de contenu est prêt à être commité, utilisez les conseils de [style des commits](/fr/web-site/local-development/#style-des-commits) afin que release-please puisse classer le travail correctement.
