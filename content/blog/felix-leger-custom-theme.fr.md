---
title: "Faire en sorte que f-l.ca me ressemble"
date: 2026-06-16
author: "Félix Léger"
description: "Comment un thème vanityURLs entièrement personnalisé transforme une instance de liens courts en surface de marque personnelle."
tags: ["marque", "personnalisation", "cas-pratique"]
featured: false
---

L'apparence normale de vanityURLs est volontairement facile à publier. On configure le domaine, on ajoute les liens, on garde les pages publiques générées, et l'instance est déjà cohérente. La documentation décrit ce chemin comme le point de départ le plus sûr : utilisez [Démarrage rapide](/fr/docs/setup/quickstart/) pour mettre le redirecteur en ligne, puis [Marque](/fr/docs/reference/brand/) et [Surcharges custom](/fr/docs/reference/custom-overrides/) quand la surface publique doit vraiment devenir la vôtre.

Pour `f-l.ca`, je voulais autre chose. Je voulais que le domaine de liens courts ressemble à une petite surface personnelle, pas seulement à un outil de redirection. C'est plus difficile, parce qu'un thème personnalisé veut dire posséder le HTML public, le CSS, le JavaScript, les pages localisées, les icônes et tous les petits états que les gens remarquent seulement quand ils cassent. Mais cela rend aussi le domaine immédiatement reconnaissable.

Voici l'ensemble des pages web et d'état personnalisées que j'ai testées sur `a6z.link` avant d'envoyer le thème vers `f-l.ca`. Le domaine dans les captures est l'instance de test; les mêmes fichiers personnalisés lisent le domaine courant au runtime.

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

## L'URL Est L'Interface

Le thème tourne autour d'une idée simple : le lien lui-même devrait être l'objet principal de la page.

Au lieu d'une carte classique, d'un bloc logo et d'une pile de boutons, la page se lit comme une adresse modifiable :

```text
f-l.ca/
```

Le script de la page remplit le préfixe à partir du domaine courant, ce qui permet aux mêmes fichiers personnalisés de fonctionner sur mon domaine de production et sur une instance de test. Quand quelqu'un tape un slug, la flèche ronde devient l'action. Quand un chemin est invalide, la même surface peut montrer le chemin au visiteur sans changer de système visuel.

Cette petite interaction correspond à ma façon d'utiliser les liens. Beaucoup de mes redirections sont des raccourcis compacts pour des projets, des jeux, des diffusions, de la documentation et des routes Bonjour Arcade. Un lien comme `b`, `b/*`, `plinko/*` ou `setup-mister` n'est pas seulement plus court que la destination. C'est un petit objet nommé que je peux dire, retenir et réutiliser.

## Le Mode Entièrement Personnalisé A Un Coût

Ce n'est pas le chemin le plus rapide. Le mode entièrement personnalisé veut dire que l'instance fournit ses propres pages publiques dans `custom/public`, y compris les variantes anglaises et françaises, les pages de consultation, les pages d'état, les pages de confiance et sécurité, les icônes, `flstyle.css` et `script.js`. [Internationalisation](/fr/docs/reference/i18n/) devient alors une partie du travail de thème, parce que les pages localisées doivent rester équivalentes, pas seulement traduites une fois.

Cela veut aussi dire que le thème doit se comporter comme du code produit :

- les pages anglaises et françaises doivent rester alignées
- la page de consultation doit garder le même langage visuel que l'accueil
- les contacts publics doivent rester lisibles et crédibles
- le thème doit fonctionner sans dépendre de fournisseurs externes de polices ou de scripts
- les fichiers personnalisés doivent éviter les collisions avec les assets `v8s-*` gérés par vanityURLs

Les pages par défaut de vanityURLs absorbent la majorité de cette maintenance pour vous. Un thème personnalisé donne plus de contrôle, mais retire aussi quelques garde-fous.

![Page confiance et sécurité de f-l.ca avec le même fond crème, le même wordmark fort et la même typographie personnalisée que la surface de redirection](/blog/felix-flca-trust.png)

## Garder Les Noms Produit Hors Des Fichiers Custom

Une frontière que je ne franchirais pas concerne les noms de fichiers. Mes pages personnalisées utilisent des noms comme `flstyle.css` et `script.js`, parce qu'ils m'appartiennent. Je ne créerais pas de fichiers custom portant les mêmes noms que les assets produit dans `defaults/public`, surtout les fichiers CSS et JavaScript `v8s-*` comme `v8s-style.css`, `v8s-script.js`, `v8s-status.css`, `v8s-lookup.js` ou `v8s-theme.js`.

Cette frontière compte au build. Le build copie `defaults/public` d'abord, puis superpose `custom/public`. Si un fichier custom masque un fichier `v8s-*` géré, il peut figer accidentellement un vieil asset runtime pendant que les pages qui restent vanilla continuent d'attendre le CSS et le JavaScript par défaut courants. La bonne séparation est simple : donner leurs propres noms d'assets aux pages web et d'état personnalisées, et laisser les pages qui restent vanilla utiliser les fichiers `v8s-*` gérés.

## La Marque Vit Dans Les Petits Choix

Le thème est dépouillé volontairement. Un fond chaud, une URL en monospace, une petite marque jaune dans le coin, et presque pas de texte supplémentaire. La page d'accueil n'essaie pas d'expliquer toutes les fonctionnalités parce que le domaine dit déjà ce qui compte : c'est l'endroit où vivent mes liens.

La page de confiance et sécurité garde le même ton, mais devient plus explicite là où elle doit l'être. Les contacts d'abus et de sécurité sont lisibles. Le domaine reste visible. La page ressemble encore à `f-l.ca`, même si elle fait un travail plus opérationnel.

C'est cette cohérence qui donne le vrai gain de marque. Construire une instance avec l'apparence normale est facile, et pour beaucoup de domaines c'est la bonne réponse. Construire quelque chose de propriétaire est plus difficile, mais cela peut multiplier la valeur de marque personnelle quand les liens eux-mêmes font partie de la façon de travailler en public.

Le thème supporte aussi les modes clair et sombre, mais il le fait différemment des pages vanityURLs par défaut. Les pages par défaut utilisent le helper produit `v8s-theme.js` pour que les liens QA puissent forcer les aperçus avec `?theme=light` et `?theme=dark`; consultez [Surcharges custom](/fr/docs/reference/custom-overrides/) et [Contrôle d'accès](/fr/docs/customize/access-control/) quand vous testez les aperçus protégés dans `_tests`. Le thème de Félix utilise directement des variables CSS avec `prefers-color-scheme` dans `flstyle.css`. C'est moins complet pour la QA produit, mais c'est exactement ce qu'il faut pour une petite interface personnelle qui doit suivre la préférence système du visiteur sans contrôles de thème supplémentaires.

## Dire A La Maintenance Ce Qui Est Intentionnel

L'autre fichier important est `custom/v8s-custom-overrides.json`. vanityURLs utilise ce JSON pour que `npm run doctor` et `v8s-fix` sachent quelles différences custom ne doivent pas être "réparées" vers les valeurs par défaut.

Pour ce thème, le fichier indique que les pages custom en écran unique, les assets d'identité thématiques et le fallback 404 de style accueil sont volontaires. C'est important parce que l'expérience 404 n'est pas un document d'erreur séparé qui ressemble aux pages par défaut. C'est la même surface de redirection : quand un chemin est introuvable, la page peut afficher le chemin saisi et secouer l'écran. Sans ce registre d'override, les outils de maintenance dérangeraient continuellement le mainteneur pour rafraîchir des fichiers qui sont intentionnellement différents.

C'est la ligne fine du mode entièrement personnalisé : documenter les différences que vous voulez posséder, pointer vers la documentation produit pour les défauts sur lesquels vous comptez encore, et laisser l'outillage aider partout ailleurs.

## Ce Que Je Garderais

Si je le refaisais, je garderais la même séparation :

- laisser vanityURLs posséder le moteur de redirection, la génération du registre, les défauts de sécurité et les assets `v8s-*` gérés
- laisser l'instance posséder seulement la surface publique personnalisée qui doit vraiment être personnelle
- tester les mises à jour contre les pages personnalisées au lieu de copier les assets gérés dans `custom/public`
- garder le thème assez petit pour que chaque état puisse encore être relu

C'est la frontière utile. Le moteur reste ennuyeux. La surface publique gagne de la personnalité. Les liens continuent de me ressembler.
