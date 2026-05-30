---
title: "Choisir des analytics respectueux de la vie privée pour les liens courts"
date: 2026-05-21
author: "Benoît H. Dicaire"
description: "Comment decider si une instance vanityURLs a besoin d'analytics, et comment Fathom et Umami s'intégrént dans un workflow de redirection respectueux de la vie privée."
tags: ["guide", "analytics", "confidentialité"]
featured: false
---

Les analytics sont optionnels dans vanityURLs. Un redirecteur peut fonctionner parfaitement sans eux. La première question n'est pas "quel outil d'analytics installer?", mais "quelle décision les analytics vont-ils m'aider à prendre?"

Pour les liens courts, les analytics sont habituellement utiles quand vous devez savoir :

- si un code QR imprime est scanne
- quel lien de campagne est le plus utilise
- si un ancien lien est encore assez actif pour être conserve
- si un lien de lancement recoit du trafic inattendu
- si un lien public est abuse

Si vous avez seulement besoin de redirections fiables, laissez les analytics désactifs pendant la première installation. Ajoutez-les quand l'instance fonctionne.

## Pourquoi des analytics tiers peuvent avoir du sens

Auto-hébergér des analytics est possible, mais cela ajoute un autre système a patcher, sauvegarder, surveiller et securiser. Un service tiers peut mieux convenir à un petit redirecteur parce que le fournisseur gere la disponibilite et la maintenance.

Le compromis est que vous ajoutez un sous-traitant pour les metadonnées de trafic. Votre page de confidentialité devrait dire quel fournisseur vous utilisez, quels événements vous envoyéz et combien de temps les données sont conservees.

## Fathom

Fathom est un service d'analytics hébergé oriente confidentialité. Il convient bien si vous voulez un produit gere, un tableau simple, et peu d'opérations.

Avantages :

- service gere avec tres peu de configuration
- focus clair sur les analytics web respectueux de la vie privée
- bon choix pour les opérateurs qui veulent du reporting simple

Limites :

- service hébergé payant
- moins de contrôle que l'auto-hébergément
- le traitement des données depend des conditions, regions et options de réténtion de Fathom

## Umami

Umami est un projet analytics open source avec options hébergées et auto-hébergées. Il convient bien si vous voulez pouvoir exploiter les analytics vous-même ou utiliser un service hébergé avec une base open source.

Avantages :

- projet open source
- options hébergées et auto-hébergées
- bon choix pour les équipes qui pourraient vouloir plus de contrôle infrastructure plus tard

Limites :

- l'auto-hébergément ajoute une responsabilité opérationnelle
- le service hébergé demande quand même de réviser les conditions de sous-traitance et la réténtion
- plus de flexibilité peut aussi vouloir dire plus de décisions

## Ce que vanityURLs envoie

vanityURLs peut envoyér des événements serveur depuis le Worker. Aucun script de tracking navigateur n'est requis sur les pages de redirection. Les événements peuvent couvrir les redirections, pageviews publiques, misses et activité de la page expand qui atteignent le Worker.

Le trafic arrété avant le Worker, par exemple par [Contrôle d'accès](/fr/docs/customize/access-control/), WAF, rate limiting ou contrôles bot, n'apparaitra pas dans les analytics parce que vanityURLs ne le recoit jamais.

Cette séparation est volontaire. Cloudflare analytics et Security Events répondent aux questions d'infrastructure : DNS, TLS, WAF, Access, rate limits, contrôles crawler et trafic bloqué. Les analytics vanityURLs répondent aux questions applicatives : quel lien court a redirigé, quel slug a manqué, quelle recherche expand a été exécutée et quelle page publique a été vue après que la requête a atteint le Worker.

Pour les noms d'événements, payloads fournisseur et modes IP exacts, utilisez la [référence Analytics](/fr/docs/reference/analytics/). Pour les étapes de configuration, utilisez [Analytics](/fr/docs/customize/analytics/).

## Operer les analytics comme une fonction sensible au quota

Les fournisseurs d'analytics ne sont pas l'endroit pour observer chaque requête hostile sur Internet. Bloquez les probes scanner, methodes inattendues et familles de crawlers indésirées avant les analytics pour éviter de consommer le quota fournisseur ou de rendre les tableaux plus difficiles a lire.

Ne comptez pas sur les dashboards analytics pour montrer le trafic bloque à l'edge. Consultez Cloudflare Security Events pour les décisions WAF, bot, crawler, Access et rate-limit, puis utilisez Umami ou Fathom pour les événements applicatifs qui ont atteint le Worker.

Attendez-vous a recevoir des probes même sur des domaines obscurs. Verifiez Workers Logs pour `umami tracking failed` et `fathom tracking failed`, surtout pendant la première journee après l'activation des analytics. Si le quota fournisseur devient le risque immediat pendant un incident bot actif, mettez les analytics en pause jusqu'à ce que les contrôles edge soient ajustes.

## Recommandation pratique

Pour le premier déploiement, laissez les analytics désactifs. Quand le redirecteur fonctionne, decidez si vous avez besoin de reporting.

Choisissez Fathom si vous voulez le produit gere le plus simple. Choisissez Umami si vous voulez une option open source ou pourriez vouloir auto-hébergér plus tard. Ne choisissez ni l'un ni l'autre si vous n'avez pas une question concrété a laquelle les analytics doivent répondre.

Quel que soit votre choix, stockez l'identifiant du site, l'endpoint API, les secrets, les choix de réténtion et les informations de récupération du compte dans votre gestionnaire de mots de passe.
