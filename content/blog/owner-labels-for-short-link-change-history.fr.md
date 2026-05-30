---
title: "Etiquettes de proprietaire pour l'historique des liens courts"
date: 2026-05-22
description: "Pourquoi vanityURLs enregistre une petite etiquette de proprietaire avec les liens, et comment elle aide les equipes a comprendre qui a change quoi."
tags: ["operations", "governance", "links"]
---

L'etiquette de proprietaire vit dans `v8s-links.txt`, la source de verite redigee par les humains pour les liens. C'est une courte valeur interne qui identifie qui a cree ou maintient un lien. Pour une instance personnelle, ce peut etre simplement votre nom ou vos initiales. Pour une equipe, cela devient une partie utile de l'historique de changement. Consultez la [documentation du format de lien](/fr/docs/reference/link-format/) pour la structure complete d'une ligne.

Les liens courts semblent souvent simples de l'exterieur, mais ils peuvent representer des pages de campagne, portails de support, outils internes, destinations partenaires ou communications reglementees. Quand plusieurs personnes ou unites peuvent faire des changements, l'etiquette de proprietaire aide a repondre a des questions operationnelles de base :

- qui sait pourquoi ce lien existe
- quelle equipe devrait le revoir avant un changement de destination
- qui contacter si une destination expire ou devient dangereuse
- qui peut aider quand un lien long cesse de fonctionner et que la redirection a besoin d'une nouvelle destination
- si le lien appartient a une campagne, un produit, un processus de support ou un mainteneur individuel

L'etiquette de proprietaire n'est pas un systeme d'authentification et ne remplace pas l'historique Git. Git enregistre toujours l'auteur du commit et le processus de revue. L'etiquette ajoute le contexte metier dans le registre de liens lui-meme.

Dans les grandes organisations, l'etiquette peut s'aligner avec un processus de gestion de changement existant. Par exemple, un enregistrement de changement gere par l'IT peut identifier le demandeur, l'equipe approbatrice, le service touche, le plan de communication et le chemin de rollback. L'etiquette vanityURLs peut refleter l'equipe ou l'unite d'affaires de ce processus, ce qui rend l'inventaire des liens plus facile a auditer plus tard.

Les bonnes etiquettes sont courtes, stables et comprehensibles pour les personnes qui operent le redirecteur. Exemples : `marketing`, `support`, `platform`, `hr` ou un identifiant de mainteneur.
