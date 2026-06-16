---
title: "Faire en sorte que f-l.ca me ressemble"
date: 2026-06-16
author: "Félix Léger"
description: "Comment un thème vanityURLs entièrement personnalisé transforme une instance de liens courts en surface de marque personnelle."
tags: ["marque", "personnalisation", "cas-pratique"]
featured: false
---

L'apparence normale de vanityURLs est volontairement facile à publier. On configure le domaine, on ajoute les liens, on garde les pages publiques générées, et l'instance est déjà cohérente.

Pour `f-l.ca`, je voulais autre chose. Je voulais que le domaine de liens courts ressemble à une petite surface personnelle, pas seulement à un outil de redirection. C'est plus difficile, parce qu'un thème personnalisé veut dire posséder le HTML public, le CSS, le JavaScript, les pages localisées, les icônes et tous les petits états que les gens remarquent seulement quand ils cassent. Mais cela rend aussi le domaine immédiatement reconnaissable.

![Page d'accueil f-l.ca avec fond crème minimal, grand préfixe de domaine monospace et petite marque jaune en bas à gauche](/blog/felix-flca-home.png)

## L'URL Est L'Interface

Le thème tourne autour d'une idée simple : le lien lui-même devrait être l'objet principal de la page.

Au lieu d'une carte classique, d'un bloc logo et d'une pile de boutons, la page se lit comme une adresse modifiable :

```text
f-l.ca/
```

Le script de la page remplit le préfixe à partir du domaine courant, ce qui permet aux mêmes fichiers personnalisés de fonctionner sur mon domaine de production et sur une instance de test. Quand quelqu'un tape un slug, la flèche ronde devient l'action. Quand un chemin est invalide, la même surface peut montrer le chemin au visiteur sans changer de système visuel.

Cette petite interaction correspond à ma façon d'utiliser les liens. Beaucoup de mes redirections sont des raccourcis compacts pour des projets, des jeux, des diffusions, de la documentation et des routes Bonjour Arcade. Un lien comme `b`, `b/*`, `plinko/*` ou `setup-mister` n'est pas seulement plus court que la destination. C'est un petit objet nommé que je peux dire, retenir et réutiliser.

## Le Mode Entièrement Personnalisé A Un Coût

Ce n'est pas le chemin le plus rapide. Le mode entièrement personnalisé veut dire que l'instance fournit ses propres pages publiques dans `custom/public`, y compris les variantes anglaises et françaises, les pages de consultation, les pages d'état, les pages de confiance et sécurité, les icônes, `flstyle.css` et `script.js`.

Cela veut aussi dire que le thème doit se comporter comme du code produit :

- les pages anglaises et françaises doivent rester alignées
- la page de consultation doit garder le même langage visuel que l'accueil
- les contacts publics doivent rester lisibles et crédibles
- le thème doit fonctionner sans dépendre de fournisseurs externes de polices ou de scripts
- les fichiers personnalisés doivent éviter les collisions avec les assets `v8s-*` gérés par vanityURLs

Les pages par défaut de vanityURLs absorbent la majorité de cette maintenance pour vous. Un thème personnalisé donne plus de contrôle, mais retire aussi quelques garde-fous.

![Page confiance et sécurité de f-l.ca avec le même fond crème, le même wordmark fort et la même typographie personnalisée que la surface de redirection](/blog/felix-flca-trust.png)

## La Marque Vit Dans Les Petits Choix

Le thème est dépouillé volontairement. Un fond chaud, une URL en monospace, une petite marque jaune dans le coin, et presque pas de texte supplémentaire. La page d'accueil n'essaie pas d'expliquer toutes les fonctionnalités parce que le domaine dit déjà ce qui compte : c'est l'endroit où vivent mes liens.

La page de confiance et sécurité garde le même ton, mais devient plus explicite là où elle doit l'être. Les contacts d'abus et de sécurité sont lisibles. Le domaine reste visible. La page ressemble encore à `f-l.ca`, même si elle fait un travail plus opérationnel.

C'est cette cohérence qui donne le vrai gain de marque. Construire une instance avec l'apparence normale est facile, et pour beaucoup de domaines c'est la bonne réponse. Construire quelque chose de propriétaire est plus difficile, mais cela peut multiplier la valeur de marque personnelle quand les liens eux-mêmes font partie de la façon de travailler en public.

## Ce Que Je Garderais

Si je le refaisais, je garderais la même séparation :

- laisser vanityURLs posséder le moteur de redirection, la génération du registre, les défauts de sécurité et les assets `v8s-*` gérés
- laisser l'instance posséder seulement la surface publique personnalisée qui doit vraiment être personnelle
- tester les mises à jour contre les pages personnalisées au lieu de copier les assets gérés dans `custom/public`
- garder le thème assez petit pour que chaque état puisse encore être relu

C'est la frontière utile. Le moteur reste ennuyeux. La surface publique gagne de la personnalité. Les liens continuent de me ressembler.
