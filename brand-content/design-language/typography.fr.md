---
title: "Polices et typographie"
heading: "Polices, hierarchie et rythme"
type: brand
weight: 20
aliases:
  - /fr/design-language/fonts-and-typography/
---

Le site auto-heberge [Inter Variable](https://rsms.me/inter/) pour l'interface et le texte, puis [JetBrains Mono](https://www.jetbrains.com/lp/mono/) pour le code. Les fichiers vivent sous `static/fonts/` et sont declares dans `assets/css/main.css`.

## Exemples de polices

<div class="brand-type-samples not-prose">
  <section class="brand-type-sample">
    <h3>Inter Variable</h3>
    <p class="brand-type-specimen brand-type-inter">Aa vanityURLs</p>
    <p class="brand-type-line brand-type-inter">Texte d'interface, prose de documentation, navigation, boutons, tableaux et surfaces produit.</p>
  </section>
  <section class="brand-type-sample">
    <h3>JetBrains Mono</h3>
    <p class="brand-type-specimen brand-type-mono">Aa v8s.link</p>
    <p class="brand-type-line brand-type-mono">Code, chemins de fichiers, commandes, tokens, exemples generes et identifiants techniques.</p>
  </section>
</div>

## Hierarchie

- Utilisez les grands titres seulement pour les ouvertures de page et les moments de marque majeurs.
- Utilisez des titres plus petits et plus serres dans les cartes, panneaux, tableaux et surfaces d'outils.
- Gardez le texte courant direct et lisible.
- Utilisez [JetBrains Mono](https://www.jetbrains.com/lp/mono/) pour le code, les chemins de fichiers, les commandes, les tokens et les exemples generes.

## Rythme

Utilisez un espacement coherent entre les titres, descriptions, cartes et tableaux. Favorisez les regroupements clairs plutot que la densite decorative.

Le CSS de documentation definit des niveaux de prose fluides, des tokens de hauteur de ligne et des tokens d'espacement :

| Token               | Usage                                 | Metrique                        |
| ------------------- | ------------------------------------- | ------------------------------- |
| `--docs-step--1`    | Petit texte de soutien                | `0.9375rem` a `1rem`            |
| `--docs-step-0`     | Texte courant                         | `1rem` a `1.125rem`             |
| `--docs-step-1`     | Titres compacts et texte d'intro      | `1.125rem` a `1.25rem`          |
| `--docs-space-2xs`  | Rythme des elements de liste          | `0.5rem` a `0.625rem`           |
| `--docs-space-xs`   | Petit ecart sous un titre             | `0.75rem` a `0.875rem`          |
| `--docs-space-s`    | Espacement des paragraphes et blocs   | `1rem` a `1.125rem`             |
| `--docs-space-m`    | Espacement moyen entre sections       | `1.5rem` a `1.75rem`            |
| `--docs-space-l`    | Espacement majeur entre sections      | `2rem` a `2.5rem`               |
| `--docs-line-body`  | Rythme de lecture longue              | Multiplicateur de hauteur `1.7` |
| `--docs-line-tight` | Titres et libelles d'interface denses | Multiplicateur de hauteur `1.3` |

Utilisez une hauteur de ligne genereuse pour la prose explicative et une hauteur plus serree pour la navigation, les cartes, les badges et les controles.
