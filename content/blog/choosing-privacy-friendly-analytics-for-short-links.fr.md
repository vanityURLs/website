---
title: "Choisir des analytics respectueux de la vie privee pour les liens courts"
date: 2026-05-21
author: "Benoît H. Dicaire"
description: "Comment decider si une instance vanityURLs a besoin d'analytics, et comment Fathom et Umami s'integrent dans un workflow de redirection respectueux de la vie privee."
tags: ["guide", "analytics", "confidentialite"]
featured: false
---

Les analytics sont optionnels dans vanityURLs. Un redirecteur peut fonctionner parfaitement sans eux. La premiere question n'est pas "quel outil d'analytics installer?", mais "quelle decision les analytics vont-ils m'aider a prendre?"

Pour les liens courts, les analytics sont habituellement utiles quand vous devez savoir :

- si un code QR imprime est scanne
- quel lien de campagne est le plus utilise
- si un ancien lien est encore assez actif pour etre conserve
- si un lien de lancement recoit du trafic inattendu
- si un lien public est abuse

Si vous avez seulement besoin de redirections fiables, laissez les analytics desactives pendant la premiere installation. Ajoutez-les quand l'instance fonctionne.

## Pourquoi des analytics tiers peuvent avoir du sens

Auto-heberger des analytics est possible, mais cela ajoute un autre systeme a patcher, sauvegarder, surveiller et securiser. Un service tiers peut mieux convenir a un petit redirecteur parce que le fournisseur gere la disponibilite et la maintenance.

Le compromis est que vous ajoutez un sous-traitant pour les metadonnees de trafic. Votre page de confidentialite devrait dire quel fournisseur vous utilisez, quels evenements vous envoyez et combien de temps les donnees sont conservees.

## Fathom

Fathom est un service d'analytics heberge oriente confidentialite. Il convient bien si vous voulez un produit gere, un tableau simple, et peu d'operations.

Avantages :

- service gere avec tres peu de configuration
- focus clair sur les analytics web respectueux de la vie privee
- bon choix pour les operateurs qui veulent du reporting simple

Limites :

- service heberge payant
- moins de controle que l'auto-hebergement
- le traitement des donnees depend des conditions, regions et options de retention de Fathom

## Umami

Umami est un projet analytics open source avec options hebergees et auto-hebergees. Il convient bien si vous voulez pouvoir exploiter les analytics vous-meme ou utiliser un service heberge avec une base open source.

Avantages :

- projet open source
- options hebergees et auto-hebergees
- bon choix pour les equipes qui pourraient vouloir plus de controle infrastructure plus tard

Limites :

- l'auto-hebergement ajoute une responsabilite operationnelle
- le service heberge demande quand meme de reviser les conditions de sous-traitance et la retention
- plus de flexibilite peut aussi vouloir dire plus de decisions

## Ce que vanityURLs envoie

vanityURLs peut envoyer des evenements serveur depuis le Worker. Aucun script de tracking navigateur n'est requis sur les pages de redirection. Les evenements peuvent couvrir les redirections, pageviews publiques, misses et activite de la page expand qui atteignent le Worker.

Le trafic arrete avant le Worker, par exemple par [Controle d'acces](/fr/docs/customize/access-control/), WAF, rate limiting ou controles bot, n'apparaitra pas dans les analytics parce que vanityURLs ne le recoit jamais.

## Operer les analytics comme une fonction sensible au quota

Les fournisseurs d'analytics ne sont pas l'endroit pour observer chaque requete hostile sur Internet. Bloquez les probes scanner, methodes inattendues et familles de crawlers indesirees avant les analytics pour eviter de consommer le quota fournisseur ou de rendre les tableaux plus difficiles a lire.

Ne comptez pas sur les dashboards analytics pour montrer le trafic bloque a l'edge. Consultez Cloudflare Security Events pour les decisions WAF, bot, crawler, Access et rate-limit, puis utilisez Umami ou Fathom pour les evenements applicatifs qui ont atteint le Worker.

Attendez-vous a recevoir des probes meme sur des domaines obscurs. Verifiez Workers Logs pour `umami tracking failed` et `fathom tracking failed`, surtout pendant la premiere journee apres l'activation des analytics. Si le quota fournisseur devient le risque immediat pendant un incident bot actif, mettez les analytics en pause jusqu'a ce que les controles edge soient ajustes.

## Recommandation pratique

Pour le premier deploiement, laissez les analytics desactives. Quand le redirecteur fonctionne, decidez si vous avez besoin de reporting.

Choisissez Fathom si vous voulez le produit gere le plus simple. Choisissez Umami si vous voulez une option open source ou pourriez vouloir auto-heberger plus tard. Ne choisissez ni l'un ni l'autre si vous n'avez pas une question concrete a laquelle les analytics doivent repondre.

Quel que soit votre choix, stockez l'identifiant du site, l'endpoint API, les secrets, les choix de retention et les informations de recuperation du compte dans votre gestionnaire de mots de passe.
