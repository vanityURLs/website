---
title: "Faire en sorte que f-l.ca me ressemble"
date: 2026-06-16
author: "Félix Léger"
description: "Ce qu'un thème vanityURLs entièrement personnalisé apporte, ce qu'il coûte, et comment garder l'instance maintenable."
tags: ["marque", "personnalisation", "cas-pratique"]
draft: true
featured: false
---
J'utilise [vanityURLs depuis 2024](/fr/showcase/f-l-ca/). C'est la frontière utile. Le moteur reste ennuyeux et la surface publique gagne de la personnalité.

Pour [f-l.ca](https://f-l.ca/), je voulais autre chose : un moteur ennuyeux, mais une surface publique qui me ressemble immédiatement.

{{< carousel label="Captures des pages personnalisées de Félix" >}}
/blog/felix-en-home.png|Page d'accueil anglaise avec la surface de redirection personnalisée|Accueil anglais
/blog/felix-en-lookup.png|Page de consultation anglaise avec la même surface personnalisée|Consultation anglaise
/blog/felix-en-not-found.png|Page 404 anglaise avec le fallback de style accueil|Fallback 404 anglais
/blog/felix-en-expired.png|Page anglaise de lien expiré avec la surface personnalisée|État expiré anglais
/blog/felix-en-disabled.png|Page anglaise de lien désactivé avec la surface personnalisée|État désactivé anglais
/blog/felix-en-maintenance.png|Page anglaise de maintenance avec la surface personnalisée|État maintenance anglais
/blog/felix-fr-home.png|Page d'accueil française avec la surface de redirection personnalisée|Accueil français
/blog/felix-fr-lookup.png|Page de consultation française avec la même surface personnalisée|Consultation française
/blog/felix-fr-not-found.png|Page 404 française avec le fallback de style accueil|Fallback 404 français
/blog/felix-fr-expired.png|Page française de lien expiré avec la surface personnalisée|État expiré français
/blog/felix-fr-disabled.png|Page française de lien désactivé avec la surface personnalisée|État désactivé français
/blog/felix-fr-maintenance.png|Page française de maintenance avec la surface personnalisée|État maintenance français
{{< /carousel >}}

Pour le chemin mécanique, consultez [Marque](/fr/docs/reference/brand/) et [Surcharges custom](/fr/docs/reference/custom-overrides/).

## L'URL Est L'Interface

Mon thème tourne autour d'une idée simple : le lien lui-même devrait être l'objet principal de la page.

Quand quelqu'un tape un slug, la flèche ronde devient l'action.

Quand un chemin est invalide, l'écran _shake_ et montre le chemin au visiteur au lieu de changer de système visuel.

## Le Mode Custom Complet A Un Coût

Ce n'est pas le chemin le plus rapide, vous pouvez demander à mon co-mainteneur {{< emoji name="smiling" decorative="true" >}}. Le mode custom complet veut dire que l'instance fournit ses propres pages publiques dans `custom/public`, y compris les variantes anglaises et françaises, les pages de consultation et les pages d'état.

Cela fait de [l'internationalisation](/fr/docs/reference/i18n/) une partie du travail de thème. Les pages localisées doivent rester équivalentes, pas seulement traduites une fois.

Cela veut aussi dire que le thème doit se comporter comme du code produit :

- les pages anglaises et françaises doivent rester alignées
- toutes les pages doivent garder le même langage visuel que l'accueil
- le HTML custom doit avoir une posture [Content Security Policy](https://www.w3.org/TR/CSP3/) délibérée
- les fichiers custom doivent éviter les collisions avec les assets livrés par vanityURLs
- les pages opérateur protégées[^operator-pages] comme `_stats` et `_tests` demandent une décision explicite : les personnaliser, ou les laisser au produit

Les pages par défaut de vanityURLs absorbent la majorité de cette maintenance. Un thème custom donne plus de contrôle. Il retire aussi quelques garde-fous.

## Garder Les Noms Produit Hors Des Fichiers Custom

Une frontière que je ne franchirais pas concerne les noms de fichiers. Cette frontière compte au build.

Les pages custom utilisent des noms comme `flstyle.css` et `flscript.js`, parce qu'ils appartiennent à l'instance. Je ne créerais pas de fichiers custom portant les mêmes noms que les assets gérés par le produit dans `defaults/public`, surtout `v8s-style.css`, `v8s-script.js`, `v8s-status.css`, `v8s-lookup.js` ou `v8s-theme.js`.

Le build copie `defaults/public` d'abord, puis superpose `custom/public`.[^overlay] Si un fichier custom masque un fichier `v8s-*` géré, les choses deviennent bizarres pendant que les pages qui restent vanilla continuent d'attendre le CSS et le JavaScript par défaut courants.

La séparation est simple : donner leurs propres noms d'assets aux pages web et d'état custom, et laisser les pages qui restent vanilla utiliser les fichiers `v8s-*` gérés.

## C'est Une Autre Frontière De Confiance

Au 16 juin 2026, la documentation des pages publiques de vanityURLs indique que le HTML custom reçoit un profil CSP compatible et sandboxé, tandis que le CSS, le JavaScript, les images, les polices et les manifests référencés sont servis comme assets normaux.[^csp]

C'est le bon défaut pour des pages copiées ou écrites à la main. Il permet du CSS et du JavaScript même hôte sans accorder la confiance des pages produit.

Il y a un coût. Le JavaScript custom ne devrait pas dépendre des cookies de l'hôte, de `localStorage` côté hôte, ou d'API same-origin protégées quand le sandbox omet `allow-same-origin`. Heureusement, vanityURLs n'utilise pas ces capacités.

## La Marque Vit Dans Les Petits Choix

Le travail de marque n'est pas le formulaire de slug. Ça, c'est l'interface.

Le travail de marque, c'est la retenue autour : un fond chaud, une URL monospace, une petite marque jaune dans le coin, et presque pas de texte explicatif. La page devrait sembler possédée sans demander à être admirée.

Mon thème supporte les modes clair et sombre, mais il le fait différemment des pages vanityURLs par défaut. J'utilise directement des variables CSS avec [`prefers-color-scheme`](https://www.w3.org/TR/mediaqueries-5/#prefers-color-scheme) dans `flstyle.css`. C'est suffisant.

Les pages par défaut utilisent le helper produit `v8s-theme.js` pour que les liens QA puissent forcer les aperçus avec `?theme=light` et `?theme=dark`; consultez [Surcharges custom](/fr/docs/reference/custom-overrides/) et [Contrôle d'accès](/fr/docs/customize/access-control/) quand vous testez les aperçus protégés dans `_tests`. Vous pouvez voir ci-dessous les liens QA par défaut.

![Matrice de tests vanityURLs protégée montrant les vérifications de pages et d'états pour une instance de liens courts](/blog/v8s-link-tests.png)

Je n'ai pas personnalisé les pages opérateur : `_stats` et `_tests`. Ce ne sont pas des surfaces de marque publiques.

## Dire A La Maintenance Ce Qui Est Intentionnel

Le fichier de maintenance est `custom/v8s-custom-overrides.json`. vanityURLs utilise ce JSON pour que [npm run doctor](/fr/docs/reference/public-pages/#ignorer-doctor-volontairement)[^doctor] et [v8s-fix](/fr/docs/command-line-interface/v8s-fix/) sachent quelles différences custom ne doivent pas être réparées vers `/defaults`.

Ce registre compte parce que l'expérience 404 n'est pas un document d'erreur séparé qui ressemble aux pages par défaut. C'est la même surface de redirection. Quand un chemin est introuvable, la page peut afficher le chemin saisi et secouer le formulaire.

Sans ce registre d'override, l'outillage de maintenance doit traiter ces différences comme une dérive possible. Le manifest courant est explicite :

```json
{
  "schema_version": "1.0",
  "doctor": {
    "ignore": [
      {
        "paths": [
          "custom/public/en/404.html",
          "custom/public/en/abuse.html",
          "custom/public/en/disabled.html",
          "custom/public/en/expired.html",
          "custom/public/en/index.html",
          "custom/public/en/lookup/index.html",
          "custom/public/en/maintenance.html",
          "custom/public/fr/404.html",
          "custom/public/fr/abuse.html",
          "custom/public/fr/disabled.html",
          "custom/public/fr/expired.html",
          "custom/public/fr/index.html",
          "custom/public/fr/lookup/index.html",
          "custom/public/fr/maintenance.html"
        ],
        "codes": ["html-head-assets-stale", "branding-stale"],
        "reason": "Felix intentionally uses a custom single-screen theme, including the home-style 404 fallback."
      },
      {
        "paths": [
          "custom/public/android-chrome-192x192.png",
          "custom/public/android-chrome-512x512.png",
          "custom/public/apple-touch-icon.png",
          "custom/public/favicon-16x16.png",
          "custom/public/favicon-32x32.png",
          "custom/public/favicon.ico",
          "custom/public/en/android-chrome-192x192.png",
          "custom/public/en/android-chrome-512x512.png",
          "custom/public/en/apple-touch-icon.png",
          "custom/public/en/favicon-16x16.png",
          "custom/public/en/favicon-32x32.png",
          "custom/public/en/favicon-48x48.png",
          "custom/public/en/favicon.svg",
          "custom/public/en/site.webmanifest",
          "custom/public/en/v8s-redirected-dark.svg",
          "custom/public/en/v8s-redirected.svg",
          "custom/public/fonts/intervariable.woff2",
          "custom/public/fonts/jetbrainsmono.woff2",
          "custom/public/flstyle.css",
          "custom/public/fr/v8s-redirected-dark.svg",
          "custom/public/fr/v8s-redirected.svg",
          "custom/public/_tests/index.html",
          "custom/public/icon.png",
          "custom/public/logo.png",
          "custom/public/logo.svg",
          "custom/public/lookup.css",
          "custom/public/lookup.js",
          "custom/public/flscript.js",
          "custom/public/site.webmanifest"
        ],
        "codes": ["shared-asset-stale"],
        "reason": "Felix intentionally owns these theme and identity assets."
      },
      {
        "paths": ["custom/public/_tests/index.html"],
        "codes": ["product-page-stale"],
        "reason": "Felix intentionally uses a themed QA page for the full custom mode test instance."
      }
    ]
  }
}
```

C'est la ligne fine du mode custom complet : documenter les différences que vous voulez posséder, pointer vers la documentation produit pour les défauts sur lesquels vous comptez encore, et laisser l'outillage aider partout ailleurs.


[^overlay]: Consultez la documentation vanityURLs sur [l'internationalisation](/fr/docs/reference/i18n/) pour le comportement de build : les assets publics par défaut sont copiés, `custom/public` est superposé, puis les répertoires de langue non supportés sont retirés de `build/`.

[^csp]: [Content Security Policy Level 3](https://www.w3.org/TR/CSP3/) était un Working Draft du W3C daté du 5 mai 2026 au moment de préparer cet article. Pour l'implémentation vanityURLs, consultez [Approche de sécurité runtime](/fr/docs/reference/runtime-security/) et [Pages publiques et pages de statut](/fr/docs/reference/public-pages/#sécurité-des-pages-custom). Le comportement des pages custom est un détail d'implémentation, pas une exigence CSP.

[^doctor]: Consultez [Pages publiques et pages de statut](/fr/docs/reference/public-pages/#ignorer-doctor-volontairement) pour la forme de `doctor.ignore`. Pour l'intégrité des assets, consultez [W3C Subresource Integrity](https://www.w3.org/TR/SRI/).

[^operator-pages]: `_stats` est le tableau de bord protégé en lecture seule; `_tests` est la matrice de tests runtime protégée. Consultez [Lire le tableau admin vanityURLs](/fr/blog/reading-your-admin-dashboard/) et [Contrôle d'accès](/fr/docs/customize/access-control/).
