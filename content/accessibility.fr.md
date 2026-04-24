---
title: "Déclaration d'accessibilité"
description: "Notre engagement à rendre vanityURLs.link utilisable par tous, le statut de conformité WCAG 2.1, et comment signaler des problèmes d'accessibilité."
aliases:
  - accessibilite
  - a11y
---

*Dernière révision : avril 2026*

vanityURLs.link s'engage à rendre ce site utilisable par le plus grand nombre de personnes possible, quelle que soit leur capacité ou leur technologie d'assistance. Cette déclaration explique ce que nous avons mis en œuvre, ce que nous savons être imparfait, et comment tester ou signaler des problèmes d'accessibilité.

## Statut de conformité

Nous ciblons le **WCAG 2.1 Niveau AA** comme standard. Le site est **partiellement conforme** — la majorité des critères sont satisfaits, et nous travaillons activement sur les lacunes restantes décrites ci-dessous.

| Principe | Statut |
|----------|--------|
| **Perceptible** — l'information est présentable à tous les utilisateurs | Principalement satisfait — voir les problèmes connus |
| **Utilisable** — toute l'interface est navigable au clavier | Principalement satisfait — voir les problèmes connus |
| **Compréhensible** — le contenu est lisible et prévisible | Satisfait |
| **Robuste** — compatible avec les technologies d'assistance | Satisfait |

## Ce que nous avons mis en œuvre

### Navigation au clavier

- Chaque élément interactif — liens de navigation, boutons, barre latérale, modal de recherche — est accessible et utilisable au clavier seul.
- Un **lien d'accès direct au contenu** apparaît à la mise au point, permettant aux utilisateurs du clavier de contourner la navigation.
- Les **touches fléchées** naviguent dans la barre latérale de documentation. **Entrée** et **Espace** activent les sections extensibles.
- Le **menu déroulant Code source** est utilisable au clavier : `Entrée` ou `Espace` l'ouvre, `Bas`/`Haut` déplace la mise au point, `Échap` le ferme et remet la mise au point sur le déclencheur.
- Le **modal de recherche** confine correctement la mise au point quand il est ouvert et la libère sur `Échap`.
- Tous les états de mise au point sont visibles avec un anneau de 2px de la couleur de la marque via `:focus-visible`.

### Structure sémantique

- Éléments HTML de référence corrects : `<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`, `<article>`.
- La hiérarchie des titres est maintenue (`h1` → `h2` → `h3`) sur toutes les pages sans sauter de niveaux.
- L'attribut `lang` de la page est correctement défini pour l'anglais (`en-US`) et le français (`fr-FR`).
- Toutes les pages ont un `<title>` unique et descriptif.

### Images et icônes

- Les icônes SVG décoratives portent `aria-hidden="true"`.
- L'image du logo utilise `alt=""` (correctement vide pour les images décoratives) avec l'étiquette textuelle « vanityURLs » visible à côté.

### Couleur et contraste

- Le texte du corps (`gray-800` sur blanc) dépasse AA WCAG à **12,6:1**.
- Les liens texte dans la documentation utilisent `brand-700` (#0f766e) qui atteint **5,47:1** sur blanc — satisfaisant AA.
- Le mode sombre utilise `brand-400` (#2dd4bf) pour les liens sur `gray-900`, atteignant **9,53:1** — dépassant AAA.

### Technologies d'assistance

- Testé avec **VoiceOver** (macOS Safari) et **NVDA** (Windows Firefox).
- Les rôles, propriétés et états ARIA sont utilisés : `role="dialog"`, `aria-modal`, `aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-label`.

## Problèmes connus

| Problème | Impact | Priorité |
|----------|--------|----------|
| `brand-500` (#14b8a6, 2,49:1) utilisé dans le dégradé de fond du badge héros | Faible — décoratif uniquement | Moyenne |
| Les résultats de recherche Pagefind peuvent ne pas annoncer le nombre de résultats aux lecteurs d'écran | Certains utilisateurs ne savent pas combien de résultats ont été retournés | Moyenne |
| Le menu de navigation mobile nécessite JavaScript | Les utilisateurs sans JS ne peuvent pas ouvrir le menu mobile | Faible |
| Les tableaux dans la documentation n'ont pas d'éléments `<caption>` | Les lecteurs d'écran annoncent le tableau sans résumé | Faible |

## Comment tester ce site

### Outils automatisés (commencer ici)

| Outil | Accès | Ce qu'il vérifie |
|-------|-------|-----------------|
| **axe DevTools** | [Extension Chrome](https://chromewebstore.google.com/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd) | WCAG 2.1 A et AA complet |
| **WAVE** | [wave.webaim.org](https://wave.webaim.org) | Structure, contraste, ARIA |
| **Lighthouse** | Chrome DevTools → onglet Lighthouse | Score rapide + liste des problèmes |
| **IBM Equal Access Checker** | [Extension Chrome](https://chromewebstore.google.com/detail/ibm-equal-access-accessib/lkcagbfjnkomcinoddgooolagloogehp) | WCAG 2.1 + directives IBM |

### Test au clavier

Fermez votre souris et naviguez dans la page en utilisant uniquement :

| Touche | Action |
|--------|--------|
| `Tab` | Avancer dans les éléments focalisables |
| `Maj+Tab` | Reculer |
| `Entrée` / `Espace` | Activer les boutons et liens |
| `Échap` | Fermer les modaux et menus déroulants |
| `Touches fléchées` | Naviguer dans les menus et la barre latérale |

### Test du contraste des couleurs

| Outil | URL |
|-------|-----|
| WebAIM Contrast Checker | [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) |
| Colour Contrast Analyser | [tpgi.com](https://www.tpgi.com/color-contrast-checker/) |

Cible : **4,5:1** pour le texte normal, **3:1** pour le grand texte et les composants d'interface.

### Test avec lecteur d'écran

| Lecteur d'écran | OS | Navigateur |
|-----------------|----|----|
| **VoiceOver** | macOS (`Cmd+F5`) | Safari |
| **NVDA** | Windows (gratuit) | Firefox |
| **TalkBack** | Android | Chrome |

## Open source — auditer l'implémentation

Ce site étant entièrement open source, vous pouvez inspecter chaque décision d'accessibilité directement sur [github.com/vanityURLs/website](https://github.com/vanityURLs/website).

## Signalement des problèmes d'accessibilité

Si vous rencontrez une barrière d'accessibilité sur ce site :

- **GitHub Issues** : [github.com/vanityURLs/website/issues](https://github.com/vanityURLs/website/issues) — préféré
- **GitHub Discussions** : [github.com/orgs/vanityURLs/discussions](https://github.com/orgs/vanityURLs/discussions)

Veuillez inclure : l'URL de la page, une description de la barrière, la technologie d'assistance et le navigateur utilisés, et les étapes pour reproduire.

Nous visons à répondre dans les **7 jours** et à résoudre les problèmes confirmés dans les **30 jours**.

---

*Cette déclaration a été révisée pour la dernière fois en avril 2026. Elle s'applique uniquement à vanityURLs.link.*
