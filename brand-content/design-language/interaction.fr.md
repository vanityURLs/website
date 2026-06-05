---
title: "Interaction"
description: "Comportement interactif pour navigation, recherche, bascules, copie, liens et surfaces generees."
type: brand
weight: 70
---

Les interactions doivent etre previsibles, rapides a comprendre et visiblement reversibles quand l'action est locale.

Les recommandations d'interaction partent de la [fondation liens de Red Hat](https://ux.redhat.com/foundations/interactions/links/) : les liens connectent vers des pages, sections et ressources; les boutons executent des actions sur la surface actuelle. Cette distinction compte pour vanityURLs, car les pages generees demandent souvent au visiteur de continuer, inspecter ou signaler un lien.

## Navigation

La documentation utilise des etats actifs dans la barre laterale, une navigation mobile, des liens d'ancrage, des liens precedent et suivant, et parfois une table des matieres. Conservez ces motifs pour que l'utilisateur puisse parcourir le contenu sans reapprendre le site.

## Recherche

La recherche est un utilitaire, pas un element hero. Gardez le declencheur visible, nommez clairement la fenetre modale et laissez les resultats Pagefind suivre le meme rythme typographique que le reste du site.

## Actions de copie

Les boutons de copie appartiennent aux blocs de code et extraits generes. Ils doivent confirmer le succes brievement sans deplacer la mise en page.

## Liens et boutons

- Les liens menent vers une autre page, une ancre ou une ressource externe.
- Les boutons executent une action sur la surface actuelle.
- Utilisez un texte de lien specifique au lieu de `cliquez ici`.
- Conservez les etats hover et focus-visible en themes clair et sombre.
- Soulignez les liens inline dans la prose ou fournissez un indice aussi persistant.
- Utilisez des indicateurs de lien externe lorsque l'utilisateur quitte le contexte du site, surtout vers GitHub, Cloudflare ou des ressources tierces.
- Gardez les controles qui semblent desactives non interactifs, sauf si une explication claire se trouve a proximite.

## Etats de lien

Les liens inline doivent communiquer quatre etats clairement : defaut, hover, focus-visible et visite lorsque le contexte en beneficie. Le changement d'etat peut etre subtil, mais il doit etre perceptible sans deplacer la mise en page.

Pour les liens de documentation :

- Gardez un texte de lien assez descriptif pour etre compris au balayage.
- N'alignez pas plusieurs liens adjacents sans frontieres claires.
- Utilisez des liens d'ancrage pour les sections qu'un lecteur pourrait devoir partager precisement.

Pour les pages de redirection generees :

- Rendez l'URL de destination inspectable avant que le visiteur continue.
- Rendez les liens abus, confidentialite, securite et confiance disponibles sans concurrencer l'action principale de redirection.
- Gardez les liens de repli calmes et explicites; un lien qui contourne un avertissement ne doit jamais ressembler a une navigation routiniere.

## Pages de redirection generees

Les surfaces de redirection doivent rendre la destination et la prochaine action evidentes. Ne cachez pas un etat bloque, expire ou de repli derriere le style de marque.

## Mouvement et retour

Le retour doit confirmer ce qui a change sans attirer l'attention sur les actions courantes.

- Le succes d'une copie peut utiliser un court changement de texte ou une notification qui ne deplace pas les controles voisins.
- Les mises a jour de resultats de recherche devraient etre annoncees visuellement et, lorsque possible, semantiquement.
- Les bascules de theme devraient mettre a jour l'etat de l'icone immediatement.
- Evitez le mouvement qui retarde une redirection, cache de l'information de securite ou distrait d'un avertissement.
