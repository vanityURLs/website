---
title: "Déclaration d'accessibilité"
description: "Notre engagement à rendre vanityURLs.link utilisable par tous, le statut de conformité WCAG 2.1, et comment signaler des problèmes d'accessibilité."
aliases:
  - accessibilite
  - a11y
---

*Dernière révision : avril 2026. Cette déclaration s'applique uniquement à vanityURLs.link, et non aux déploiements auto-hébergés de vanityURLs.*

Nous nous engageons à rendre ce site utilisable par le plus grand nombre, quelle que soit la capacité ou la technologie d'assistance. Cette déclaration explique ce que nous avons mis en œuvre, ce que nous savons être imparfait, et comment tester ou signaler des problèmes d'accessibilité.

## Statut de conformité

Nous visons le **WCAG 2.1 niveau AA**. Le site est **partiellement conforme** : la majorité des critères sont satisfaits, et un petit nombre de lacunes connues sont documentées ci-dessous.

Les quatre principes WCAG ([POUR](https://www.w3.org/WAI/WCAG22/Understanding/intro#understanding-the-four-principles-of-accessibility)) et leur statut ici :

- **Perceptible** — le contenu peut être présenté de manière perceptible quel que soit le sens utilisé. Principalement satisfait. Voir les lacunes connues ci-dessous.
- **Utilisable** — chaque élément interactif est accessible et opérable. Principalement satisfait. Voir les lacunes connues ci-dessous.
- **Compréhensible** — le contenu est lisible et l'interface se comporte de façon prévisible. Satisfait.
- **Robuste** — le contenu fonctionne avec les technologies d'assistance actuelles et futures. Satisfait.

L'audit automatisé le plus récent (avril 2026) a retourné un score Lighthouse Accessibility de **100/100** pour la page d'accueil, sur mobile comme sur ordinateur. Les outils automatisés détectent environ 30 à 40 % des problèmes WCAG ; ce score n'est donc pas une preuve de conformité totale, mais un signal utile à combiner avec les vérifications manuelles décrites ci-dessous.

## Ce que nous avons mis en œuvre

### Navigation au clavier

Chaque élément interactif — liens de navigation, boutons, barre latérale de documentation, modal de recherche, sélecteur de langue — est accessible et utilisable au clavier seul.

Un **lien d'accès direct au contenu** apparaît à la mise au point, permettant aux utilisateurs au clavier de contourner la navigation. Le **menu déroulant Code source** est entièrement utilisable au clavier : `Entrée` ou `Espace` l'ouvre, `Bas`/`Haut` déplacent la mise au point entre les éléments, `Échap` le ferme et restitue la mise au point au déclencheur. Le **modal de recherche** s'ouvre avec `Cmd+K` (macOS) / `Ctrl+K` (Windows, Linux), confine la mise au point lorsqu'il est ouvert, et la libère avec `Échap`.

Tous les états de mise au point sont visibles via `:focus-visible` avec un anneau de 2px aux couleurs de la marque. Les anneaux apparaissent à la navigation au clavier mais pas aux clics de souris, ce qui évite le bruit visuel sans nuire à l'utilisabilité au clavier.

### Structure sémantique

Le site utilise les éléments HTML de référence (`<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`, `<article>`) et maintient une hiérarchie de titres correcte (`h1` → `h2` → `h3`) sans sauter de niveaux.

L'attribut `lang` de la page est correctement défini : `en-US` pour les pages en anglais, `fr-FR` pour les pages en français. La langue active dans le sélecteur de langue est marquée avec `aria-current="true"` pour que les lecteurs d'écran l'annoncent comme la sélection actuelle.

### Utilisation d'ARIA

Les rôles, propriétés et états ARIA sont utilisés là où la sémantique HTML seule ne suffit pas :

- Le menu déroulant Code source utilise `aria-haspopup`, `aria-expanded`, `aria-controls` et `role="menu"`.
- Le modal de recherche utilise `role="dialog"`, `aria-modal="true"` et `aria-label`.
- Le bouton mode sombre, le déclencheur de recherche et le bouton du menu mobile utilisent tous `aria-label` pour fournir un contexte non textuel.
- Les icônes SVG décoratives portent `aria-hidden="true"`.
- Le logo utilise `alt=""` (correctement vide pour une image décorative affichée à côté du logotype textuel « vanityURLs » visible).

### Couleur et contraste

Le texte du corps (`text-gray-900` sur blanc) atteint **17,74:1** en mode clair — bien au-delà de WCAG AAA. Inversé sur fond sombre (`text-gray-100` sur `bg-gray-900`), il atteint des ratios similaires.

Les liens texte de la documentation utilisent `brand-700` (#0f766e) sur blanc, soit **5,47:1** — satisfaisant WCAG AA pour le texte normal. En mode sombre, les liens utilisent `brand-400` (#2dd4bf) sur `bg-gray-900`, soit **9,53:1** — dépassant AAA.

Le sous-titre de la section héros utilise `text-gray-300` sur un dégradé sombre. Le contraste le plus défavorable (sur `bg-brand-900`) est de **6,43:1**, dépassant AAA. Sur `bg-gray-900` il atteint **12,04:1**.

Les composants d'interface tels que les badges et le bouton d'appel à l'action de la section héros ont été vérifiés lors de l'audit d'avril 2026 pour satisfaire le seuil AA de 3:1 pour les éléments non textuels.

### Prise en charge des technologies d'assistance

Nous n'avons pas encore effectué de test formel avec lecteur d'écran sur ce site. Les retours des personnes utilisant VoiceOver, NVDA, JAWS, TalkBack, Narrator ou toute autre technologie d'assistance sont très bienvenus — voir [Signaler des problèmes d'accessibilité](#signaler-des-probl%C3%A8mes-daccessibilit%C3%A9) ci-dessous. Des étapes de reproduction concrètes sont particulièrement utiles.

## Lacunes connues

Voici les véritables lacunes que nous avons identifiées et n'avons pas encore corrigées. Nous les listons honnêtement plutôt que de revendiquer une conformité que nous n'avons pas.

- **Pas de prise en charge de `prefers-reduced-motion`.** Le site utilise des transitions CSS sur les propriétés couleur, transformation et opacité. Les personnes qui ont activé « réduire les animations » dans leur système d'exploitation ne reçoivent pas actuellement de version réduite. Impact : faible — les animations sont subtiles (transitions de 150 ms sur la couleur et l'opacité, pas de parallaxe, pas de lecture automatique). Priorité : moyenne.
- **Les résultats de recherche n'annoncent pas leur nombre aux lecteurs d'écran.** Le modal de recherche basé sur Pagefind met à jour les résultats au fur et à mesure de la frappe mais n'inclut pas de région `aria-live`, ce qui empêche les utilisateurs de lecteur d'écran d'entendre « 5 résultats » annoncé. Impact : moyen pour les utilisateurs de lecteur d'écran. Priorité : moyenne.
- **Les tableaux de la documentation n'ont pas d'élément `<caption>`.** Les tableaux Markdown sont rendus sans légende, donc les lecteurs d'écran annoncent la structure du tableau sans résumé. Impact : faible — la prose environnante décrit généralement le tableau. Priorité : faible.
- **Le menu de navigation mobile nécessite JavaScript.** Le bouton du menu mobile utilise JS pour le comportement d'ouverture/fermeture. WCAG 2.1 n'exige pas que les sites fonctionnent sans JavaScript, mais si vous avez désactivé JS, le menu mobile ne s'ouvrira pas. La navigation desktop fonctionne sans JS. Priorité : faible.

## Comment tester ce site

### Vérifications automatisées (commencer ici)

Les outils automatisés détectent une partie significative des problèmes WCAG et sont le point de départ le plus rapide. Aucun ne détecte tout — combinez-les avec les vérifications manuelles ci-dessous.

| Outil | Accès | Ce qu'il vérifie |
|-------|-------|------------------|
| axe DevTools | [Extension Chrome](https://chromewebstore.google.com/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd) → DevTools → onglet axe | WCAG 2.1 A et AA |
| WAVE | [wave.webaim.org](https://wave.webaim.org) ou [extension navigateur](https://wave.webaim.org/extension/) | Structure, contraste, ARIA |
| Lighthouse | Chrome DevTools → onglet Lighthouse → Accessibility | Score et liste de problèmes |
| PageSpeed Insights | [pagespeed.web.dev](https://pagespeed.web.dev) | Audit Lighthouse + Core Web Vitals |
| IBM Equal Access Checker | [Extension Chrome](https://chromewebstore.google.com/detail/ibm-equal-access-accessib/lkcagbfjnkomcinoddgooolagloogehp) | WCAG 2.1 et directives IBM |

### Test au clavier

Mettez votre souris de côté et naviguez en utilisant uniquement :

- `Tab` — avancer dans les éléments focalisables
- `Maj+Tab` — reculer
- `Entrée` / `Espace` — activer les boutons et liens
- `Échap` — fermer les modaux et menus déroulants
- `Touches fléchées` — naviguer dans le menu déroulant de la barre latérale de documentation
- `Cmd+K` / `Ctrl+K` — ouvrir le modal de recherche

Chaque élément interactif doit être atteignable, avoir un indicateur de mise au point visible, et être activable sans souris.

### Contraste des couleurs

Outils utiles pour vérifier le contraste manuellement :

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [TPGi Color Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) (application bureau)
- Chrome DevTools → panneau Elements → Computed → indicateur de contraste

Cibles : **4,5:1** pour le texte normal, **3:1** pour le grand texte (18pt ou 14pt gras) et les composants d'interface.

### Test avec lecteur d'écran

| Lecteur d'écran | OS | Navigateur |
|-----------------|-----|------------|
| VoiceOver | macOS (`Cmd+F5`) | Safari |
| NVDA | Windows (gratuit) | Firefox |
| TalkBack | Android | Chrome |
| Narrator | Windows | Edge |

À vérifier : le titre de la page est annoncé, les titres sont navigables avec la touche `H`, le texte des liens est descriptif (éviter « cliquez ici »), le sélecteur de langue annonce la langue active, et le modal de recherche s'annonce à l'ouverture.

### Vérifications au niveau du navigateur

- Zoom à 200 % — le contenu doit se réagencer sans défilement horizontal.
- Mode contraste forcé (Windows High Contrast) — le contenu doit rester lisible, les anneaux de mise au point doivent rester visibles.
- Désactiver le CSS — la structure de la page et l'ordre de lecture doivent rester logiques.

## Open source — auditer l'implémentation

Le site est open source. Vous pouvez inspecter chaque décision d'accessibilité directement :

- Modèles et ARIA : [github.com/vanityURLs/website/tree/main/layouts](https://github.com/vanityURLs/website/tree/main/layouts)
- CSS, y compris les styles de mise au point : [github.com/vanityURLs/website/blob/main/assets/css/main.css](https://github.com/vanityURLs/website/blob/main/assets/css/main.css)
- JavaScript, y compris les gestionnaires de clavier : [github.com/vanityURLs/website/blob/main/assets/js/app.js](https://github.com/vanityURLs/website/blob/main/assets/js/app.js)

## Signaler des problèmes d'accessibilité

Si vous rencontrez une barrière sur ce site, dites-le-nous :

- [GitHub Issues](https://github.com/vanityURLs/website/issues) — préféré, car cela permet un suivi public
- [GitHub Discussions](https://github.com/orgs/vanityURLs/discussions)

Veuillez inclure : l'URL de la page, une description de la barrière, la technologie d'assistance et le navigateur que vous utilisiez, et les étapes pour reproduire.

Nous visons à accuser réception des signalements dans les **7 jours** et à résoudre les problèmes confirmés dans les **30 jours**.
