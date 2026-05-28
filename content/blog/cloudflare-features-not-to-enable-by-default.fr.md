---
title: "Fonctionnalités Cloudflare à ne pas activer par défaut"
date: 2026-05-28
author: "Benoît H. Dicaire"
description: "Quelles fonctionnalités du tableau de bord Cloudflare une instance vanityURLs devrait laisser de côté sans raison opérationnelle précise."
tags: ["cloudflare", "securite", "operations"]
featured: false
---

Cloudflare donne à l'opérateur d'un domaine court un très grand tableau de bord. Cela ne veut pas dire que chaque fonctionnalité appartient à la configuration par défaut de vanityURLs.

Une instance vanityURLs a déjà une forme étroite : un Worker Cloudflare, des Worker Static Assets, un registre de liens géré dans Git, des analytics serveur optionnelles, et quelques contrôles Cloudflare devant le Worker. Le meilleur défaut est de configurer les contrôles qui protègent cette forme, puis de laisser les produits non liés de côté jusqu'à ce qu'un vrai besoin apparaisse.

## Commencer par la couche qui existe

Utilisez Cloudflare pour DNS, TLS, les règles WAF, les contrôles bot, les contrôles de crawlers IA, Access, la normalisation des URL, un cache conservateur, les analytics Worker et Security Events. Ces fonctionnalités protègent le vrai chemin de redirection avant que le trafic atteigne le code applicatif.

N'ajoutez pas une fonctionnalité seulement parce qu'elle est visible dans le tableau de bord. Chaque produit supplémentaire peut modifier le trafic, injecter des scripts, créer une autre source de vérité, ajouter une dépendance à un plan payant ou compliquer le diagnostic.

## Laisser les surfaces non liées au produit de côté

Argo Smart Routing, Email Routing, DMARC Management, Email Security, Cache Reserve, Smart Shield, Web3 Gateways et la plupart des Error Pages résolvent des problèmes hors du runtime vanityURLs normal.

Pour une instance de liens courts par défaut :

- il n'y a pas de serveur d'origine à optimiser avec Argo, Cache Reserve ou Smart Shield
- les produits de sécurité courriel ne protègent pas les redirections
- Web3 Gateways peut devenir intéressant si les opérateurs demandent un jour des flux de contenu décentralisé
- les pages d'erreur Cloudflare personnalisées sont une finition optionnelle, pas une condition de validité des redirections

Ces produits ne sont pas mauvais. Ils ne devraient simplement pas devenir des étapes de setup pour chaque opérateur.

## Éviter les systèmes de redirection concurrents

Ne configurez pas les Page Rules legacy, Bulk Redirects ou les modèles de redirection Cloudflare comme méthode par défaut pour gérer les liens. vanityURLs traite déjà les liens comme des données versionnées dans Git, construit un registre runtime, et laisse le Worker résoudre les liens exacts, dynamiques, planifiés et contrôlés par état.

Ajouter un autre système de redirection crée deux sources de vérité. La prochaine personne qui diagnostique une mauvaise destination devra se demander si la redirection vient de `custom/v8s-links.txt`, d'une règle Worker, d'une Page Rule, d'une liste Bulk Redirect ou d'un modèle du tableau de bord. Ce n'est pas une fonctionnalité; c'est du brouillard.

Les Workers Routes au niveau de la zone posent un problème similaire. Une instance vanityURLs normale devrait utiliser le domaine custom du Worker pour le domaine court apex. Ajoutez des routes de zone seulement si vous avez un modèle de routage volontaire, documenté, et impossible à exprimer avec le domaine custom.

## Ne pas injecter d'analytics navigateur par défaut

Cloudflare Web Analytics et RUM s'appuient sur un beacon JavaScript exécuté dans le navigateur du visiteur. Cloudflare documente les snippets manuels et l'injection automatique pour les sites proxifiés et les projets Pages.

Ce n'est pas la posture de confidentialité par défaut de vanityURLs. Le redirecteur peut envoyer des événements serveur depuis le Worker vers Umami ou Fathom sans ajouter de JavaScript de suivi côté client, d'identifiant navigateur ou de script supplémentaire dans les pages publiques. Ces événements correspondent aussi mieux aux questions produit de vanityURLs : redirections, misses, recherches expand, pageviews et événements bot normalisés qui atteignent le Worker.

Utilisez les analytics Cloudflare pour les questions d'infrastructure. Utilisez Umami ou Fathom pour les événements applicatifs. Évitez de faire participer le navigateur sauf si l'opérateur choisit explicitement ce compromis.

## Traiter l'inventaire API et applicatif comme optionnel

Cloudflare Web Assets, API Discovery, Endpoint Management et Schema Validation sont conçus pour les inventaires d'API et d'applications. Ils peuvent découvrir des endpoints, gérer des chemins API et valider des requêtes avec des schémas OpenAPI.

C'est utile pour une API JSON. Ce n'est pas le modèle par défaut d'un redirecteur de liens courts dont l'interface publique est surtout composée de requêtes `GET` et `HEAD` vers des slugs. vanityURLs ne publie pas d'API publique contrôlée par OpenAPI pour les visiteurs, et bloquer le trafic de redirection avec un schéma API ajouterait plus de complexité que de protection.

Considérez ces outils seulement si votre instance ajoute une vraie API ou une surface applicative custom au-delà des redirections et pages publiques vanityURLs.

## Garder le code edge au même endroit

Cloudflare Snippets exécute de petits morceaux de JavaScript depuis Rules. Cloud Connector peut router le trafic vers des fournisseurs de stockage comme R2, Amazon S3, Google Cloud Storage ou Azure Storage.

Pour vanityURLs, le Worker est déjà la frontière de code edge, et Worker Static Assets sert déjà les fichiers publics livrés. Snippets dupliquerait de la logique qui appartient au Worker ou au dépôt. Cloud Connector introduirait un autre chemin de routage pour des fichiers que le binding d'assets du Worker sait déjà servir.

Utilisez-les seulement pour une extension volontaire que vous pouvez expliquer en une phrase et tester séparément.

## Certificats : commencer par le chemin simple

Universal SSL, le mode Full strict, TLS 1.3, l'application HTTPS et HSTS après validation suffisent pour la configuration normale. Advanced Certificate Manager est utile lorsqu'un opérateur a besoin d'un comportement de certificat personnalisé, de contrôles additionnels ou d'une exigence que Universal SSL ne couvre pas.

Ne transformez pas la gestion des certificats en projet avancé avant que le domaine court redirige correctement.

## La règle pratique

Si une fonctionnalité Cloudflare ne protège pas le chemin Worker, le domaine court, la couche DNS/TLS ou les pages opérationnelles privées, elle ne fait probablement pas partie du setup par défaut.

Écrivez la raison avant d'activer autre chose. Votre futur vous remerciera plus sûrement que le tableau de bord Cloudflare.

Utilisez [Protection réseau](/fr/docs/customize/network-protection/) pour les réglages de base à configurer par défaut.
