---
title: "vanityURLs face aux raccourcisseurs hébergés et autohébergés"
date: 2026-05-27
author: "Benoît H. Dicaire"
description: "Comparaison preliminaire de vanityURLs, des raccourcisseurs d'URL hébergés et des alternatives autohébergées pour les opérateurs qui veulent des liens courts de marque comme code."
tags: ["comparison", "short-links", "cloudflare"]
featured: false
draft: true
---

vanityURLs s'adresse aux opérateurs qui veulent un domaine de liens courts de marque, exploite depuis Git sur Cloudflare Workers, sans compte hébergé partage, sans base de données de clics par défaut, et avec une configuration revue comme du code. Il ne tente pas de remplacer tous les tableaux de bord hébergés. Il tente de rendre un petit redirecteur auditable facile a possèder.

## Tableau Comparatif

| Dimension               | vanityURLs                                                      | Bitly                                             | Dub                                               | Short.io                                          | YOURLS                                  | Shlink                                  |
| ----------------------- | --------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | --------------------------------------- | --------------------------------------- |
| Domaine custom          | Domaine Cloudflare possède par l'opérateur                      | Fonction de plan hébergé                          | Fonction de plan hébergé                          | Fonction de plan hébergé                          | Domaine autohébergé                     | Domaine autohébergé                     |
| Modele analytics        | Desactive par défaut; Umami ou Fathom côté serveur optionnel    | Analytics hébergés                                | Analytics hébergés                                | Analytics hébergés                                | Stats autohébergées intégrées           | Visites intégrées                       |
| Compte requis           | Aucun compte visiteur; l'opérateur utilise Cloudflare et GitHub | Compte hébergé                                    | Compte hébergé                                    | Compte hébergé                                    | Compte admin sur l'installation         | Accès admin/API sur l'installation      |
| Residence des données   | Depend des choix Cloudflare, Git et analytics de l'opérateur    | Contrôlee par le fournisseur                      | Contrôlee par le fournisseur                      | Contrôlee par le fournisseur                      | Vos choix d'hébergément/base de données | Vos choix d'hébergément/base de données |
| Surface ToS             | Conditions de l'instance générées depuis la config              | Conditions fournisseur plus votre usage des liens | Conditions fournisseur plus votre usage des liens | Conditions fournisseur plus votre usage des liens | Vos conditions                          | Vos conditions                          |
| Modele de déploiement   | Cloudflare Worker plus Static Assets depuis Git                 | Logiciel-service hébergé                          | Logiciel-service hébergé, cœur open source        | Logiciel-service hébergé                          | Application PHP et base de données      | Service PHP et base de données          |
| Cout à l'échelle        | Usage Cloudflare plus fournisseur analytics optionnel           | Par plan                                          | Par plan                                          | Par plan                                          | Hebergement et maintenance              | Hebergement et maintenance              |
| Visibilite du code      | Code MIT open source et config d'instance dans Git              | Service hébergé ferme                             | Produit open source avec service hébergé          | Service hébergé ferme                             | Open source                             | Open source                             |
| Planification des liens | Configuree dans Git et évaluee par le Worker                    | Depend du plan/produit                            | Depend du produit                                 | Depend du produit                                 | Depend des plugins/code custom          | Depend des fonctions intégrées          |
| Operations bulk         | Fichier texte et workflow CLI `lnk`                             | Tableau de bord/API/import                        | Tableau de bord/API/import                        | Tableau de bord/API/import                        | Workflows admin/API/base de données     | Workflows CLI/API                       |

## Bitly

[Bitly](https://bitly.com/) gagne quand une équipe veut un produit hébergé mature, un workflow centre tableau de bord, des fonctions marque/campagne et un fournisseur responsable des opérations produit. C'est le choix le plus sur quand des utilisateurs non techniques doivent créer et inspecter des liens sans toucher Git ou Cloudflare.

Face a vanityURLs, le compromis est la surface de propriété. Bitly est un compte hébergé avec conditions fournisseur, limites de plan et analytics fournisseur; vanityURLs garde le redirecteur dans le compte Cloudflare de l'opérateur et la configuration dans Git.

Choisissez Bitly quand le raccourcisseur est un outil marketing ou collaboratif. Choisissez vanityURLs quand le raccourcisseur est une infrastructure que vous voulez versionner, auditer et déployer vous-même.

## Dub

[Dub](https://dub.co/) est solide pour la gestion hébergée de liens orientee développeurs : API soignees, analytics productisees, équipes et tableau de bord moderne. Il a aussi du code open source, ce qui le rend plus inspectable qu'un raccourcisseur hébergé complètement ferme.

Face a vanityURLs, Dub est plus large et plus produit. vanityURLs est volontairement plus etroit : un Worker Cloudflare stateless, une configuration dans Git, des analytics optionnelles et des pages opérateur générées.

Choisissez Dub quand vous voulez une plateforme développeur pour les liens avec l'ergonomie hébergée. Choisissez vanityURLs quand l'exigence principale est un petit redirecteur possède par l'opérateur plutot qu'un compte de logiciel-service de gestion de liens.

## Short.io

[Short.io](https://short.io/) est un raccourcisseur hébergé a domaine custom avec tableaux de bord, accès API, analytics et workflows multi-domaines. Il convient aux équipes qui veulent un plan de contrôle gere et ne veulent pas batir un modèle opérationnel autour de Git.

Face a vanityURLs, Short.io déplace la responsabilité opérationnelle vers le fournisseur, mais y déplace aussi les données, la facturation et la surface de politique. vanityURLs demande plus de discipline de setup, mais l'instance reste liee aux choix Cloudflare, GitHub et analytics optionnelles de l'opérateur.

Choisissez Short.io quand la vitesse d'adoption et la gestion par tableau de bord comptent le plus. Choisissez vanityURLs quand l'opérateur veut que les règles de redirection et la posture de confiance publique vivent dans un dépôt.

## YOURLS

[YOURLS](https://yourls.org/) est un raccourcisseur autohébergé etabli avec UI admin, plugins, support API et statistiques intégrées. Il convient quand vous voulez une application web autohébergée classique avec base de données et extensibilite par plugins.

Face a vanityURLs, YOURLS donne une UI et du stockage dynamique, tandis que vanityURLs donne un Worker sans base de données génère depuis des fichiers. YOURLS peut être plus flexible au runtime; vanityURLs est plus facile a raisonner comme artefact statique déployable.

Choisissez YOURLS quand vous voulez une application admin autohébergée conventionnelle. Choisissez vanityURLs quand Cloudflare Workers, la revue Git et le comportement runtime stateless sont le point.

## Shlink

[Shlink](https://shlink.io/) est une plateforme de liens courts autohébergée avec modèle service/API, suivi des visites, outils CLI et backend plus riche qu'un registre de redirections statique. Il convient aux opérateurs qui veulent une application open source mais ont besoin d'un service dynamique.

Face a vanityURLs, Shlink à une surface applicative plus large et un modèle avec base de données. vanityURLs abandonne cette flexibilité runtime en echange d'un runtime edge plus petit et d'une configuration basee sur des fichiers.

Choisissez Shlink quand vous avez besoin d'un raccourcisseur d'URL open source avec backend API-first et données de visites persistantes. Choisissez vanityURLs quand votre source de vérité préfèree est Git et que la cible de déploiement est un Cloudflare Worker.

## Kutt

[Kutt](https://github.com/thedevs-network/kutt) est un raccourcisseur open source avec comptes, domaines custom, API et statistiques. Il est plus proche d'une application style logiciel-service autohébergée que d'un redirecteur statique.

Face a vanityURLs, Kutt convient mieux à la gestion multi-utilisateur de liens. vanityURLs convient mieux à un opérateur seul ou une petite équipe qui préfère les pull requests, commandes locales et fichiers runtime génères.

Choisissez Kutt quand les utilisateurs ont besoin de comptes et d'une application web. Choisissez vanityURLs quand les comptes sont inutiles et que retirer la base de données est une fonction.

## Quand Ne Pas Choisir vanityURLs

Ne choisissez pas vanityURLs si vous avez besoin de gestion de comptes hébergée, tableaux de bord par utilisateur, facturation intégrée, API publique de création de liens, édition de liens sans Git ou analytics sans configuration d'un fournisseur. Ne le choisissez pas si votre équipe ne peut pas opérer Cloudflare DNS, Workers, GitHub et un petit workflow de build Node.

Évitez aussi vanityURLs si vous avez besoin d'état runtime mutable. Le projet est volontairement modèle autour d'une configuration déployable, donc chaque changement de lien devrait être revu, construit et déployé comme du code.

## Sources

- [Bitly](https://bitly.com/)
- [Dub](https://dub.co/)
- [Short.io](https://short.io/)
- [YOURLS](https://yourls.org/)
- [Shlink](https://shlink.io/)
- [Kutt](https://github.com/thedevs-network/kutt)
