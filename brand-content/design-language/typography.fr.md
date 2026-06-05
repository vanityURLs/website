---
title: "Polices et typographie"
heading: "Polices, hierarchie et rythme"
type: brand
weight: 20
aliases:
  - /fr/design-language/fonts-and-typography/
---

Le site auto-heberge [Inter Variable](https://rsms.me/inter/) pour l'interface et le texte, puis [JetBrains Mono](https://www.jetbrains.com/lp/mono/) pour le code. Les fichiers vivent sous `static/fonts/` et sont declares dans `assets/css/main.css`.

Le modele typographique s'inspire de la [fondation famille de polices de Red Hat](https://ux.redhat.com/foundations/typography/font-family/) : utiliser une famille pour le texte expressif et lisible, puis une famille monospace pour le code et les identifiants techniques. vanityURLs utilise Inter plutot que Red Hat Display/Text, mais garde la meme separation entre prose lisible et contenu technique.

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
- Ne redimensionnez pas le texte selon la largeur du viewport. Utilisez les niveaux fluides definis et la mise en page responsive.
- Gardez l'espacement des lettres normal, sauf si un asset de logo existant exige autre chose.
- Preferez la casse phrase pour les titres de documentation, sauf lorsqu'un produit ou titre de page officiel utilise deja une autre casse.

## Roles des polices

| Police          | Role                                                                     | Recommandation                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inter Variable  | Interface, documentation, navigation, boutons, tableaux, prose           | Utilisez pour presque tout ce que le visiteur lit.                                                                                                                   |
| JetBrains Mono  | Code, commandes, chemins de fichiers, tokens, valeurs techniques courtes | Utilisez quand la chaine doit etre copiee, comparee ou lue comme syntaxe.                                                                                            |
| Artwork de logo | Marques produit et instance                                              | Utilisez les assets de logo exportes au lieu de recreer les marques en texte vivant, sauf si une page publique generee supporte explicitement les wordmarks separes. |

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

## Texte technique

Les pages vanityURLs melangent souvent prose, URLs, domaines, chemins de fichiers, cles JSON et commandes. Rendez ces chaines inspectables.

- Gardez domaines et URLs en style code lorsqu'ils sont des exemples ou des valeurs.
- Utilisez un texte de lien naturel lorsque l'URL n'est pas l'objet explique.
- Evitez le texte technique minuscule dans les cartes et tableaux; dense ne veut pas dire miniature.
- Laissez les longues URLs passer a la ligne sans deborder de leur conteneur.
