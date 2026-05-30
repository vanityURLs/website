---
title: "vanityURLs face aux raccourcisseurs heberges et autoheberges"
date: 2026-05-27
author: "Benoît H. Dicaire"
description: "Comparaison preliminaire de vanityURLs, des raccourcisseurs d'URL heberges et des alternatives autohebergees pour les operateurs qui veulent des liens courts de marque comme code."
tags: ["comparison", "short-links", "cloudflare"]
featured: false
draft: true
---

vanityURLs s'adresse aux operateurs qui veulent un domaine de liens courts de marque, exploite depuis Git sur Cloudflare Workers, sans compte heberge partage, sans base de donnees de clics par defaut, et avec une configuration revue comme du code. Il ne tente pas de remplacer tous les tableaux de bord heberges. Il tente de rendre un petit redirecteur auditable facile a posseder.

## Tableau Comparatif

| Dimension | vanityURLs | Bitly | Dub | Short.io | YOURLS | Shlink |
| --- | --- | --- | --- | --- | --- | --- |
| Domaine custom | Domaine Cloudflare possede par l'operateur | Fonction de plan heberge | Fonction de plan heberge | Fonction de plan heberge | Domaine autoheberge | Domaine autoheberge |
| Modele analytics | Desactive par defaut; Umami ou Fathom cote serveur optionnel | Analytics heberges | Analytics heberges | Analytics heberges | Stats autohebergees integrees | Visites integrees |
| Compte requis | Aucun compte visiteur; l'operateur utilise Cloudflare et GitHub | Compte heberge | Compte heberge | Compte heberge | Compte admin sur l'installation | Acces admin/API sur l'installation |
| Residence des donnees | Depend des choix Cloudflare, Git et analytics de l'operateur | Controlee par le fournisseur | Controlee par le fournisseur | Controlee par le fournisseur | Vos choix d'hebergement/base de donnees | Vos choix d'hebergement/base de donnees |
| Surface ToS | Conditions de l'instance generees depuis la config | Conditions fournisseur plus votre usage des liens | Conditions fournisseur plus votre usage des liens | Conditions fournisseur plus votre usage des liens | Vos conditions | Vos conditions |
| Modele de deploiement | Cloudflare Worker plus Static Assets depuis Git | SaaS heberge | SaaS heberge, coeur open source | SaaS heberge | Application PHP et base de donnees | Service PHP et base de donnees |
| Cout a l'echelle | Usage Cloudflare plus fournisseur analytics optionnel | Par plan | Par plan | Par plan | Hebergement et maintenance | Hebergement et maintenance |
| Visibilite du code | Code MIT open source et config d'instance dans Git | Service heberge ferme | Produit open source avec service heberge | Service heberge ferme | Open source | Open source |
| Planification des liens | Configuree dans Git et evaluee par le Worker | Depend du plan/produit | Depend du produit | Depend du produit | Depend des plugins/code custom | Depend des fonctions integrees |
| Operations bulk | Fichier texte et workflow CLI `lnk` | Tableau de bord/API/import | Tableau de bord/API/import | Tableau de bord/API/import | Workflows admin/API/base de donnees | Workflows CLI/API |

## Bitly

[Bitly](https://bitly.com/) gagne quand une equipe veut un produit heberge mature, un workflow centre tableau de bord, des fonctions marque/campagne et un fournisseur responsable des operations produit. C'est le choix le plus sur quand des utilisateurs non techniques doivent creer et inspecter des liens sans toucher Git ou Cloudflare.

Face a vanityURLs, le compromis est la surface de propriete. Bitly est un compte heberge avec conditions fournisseur, limites de plan et analytics fournisseur; vanityURLs garde le redirecteur dans le compte Cloudflare de l'operateur et la configuration dans Git.

Choisissez Bitly quand le raccourcisseur est un outil marketing ou collaboratif. Choisissez vanityURLs quand le raccourcisseur est une infrastructure que vous voulez versionner, auditer et deployer vous-meme.

## Dub

[Dub](https://dub.co/) est solide pour la gestion hebergee de liens orientee developpeurs : API soignees, analytics productisees, equipes et tableau de bord moderne. Il a aussi du code open source, ce qui le rend plus inspectable qu'un raccourcisseur heberge completement ferme.

Face a vanityURLs, Dub est plus large et plus produit. vanityURLs est volontairement plus etroit : un Worker Cloudflare stateless, une configuration dans Git, des analytics optionnelles et des pages operateur generees.

Choisissez Dub quand vous voulez une plateforme developpeur pour les liens avec l'ergonomie hebergee. Choisissez vanityURLs quand l'exigence principale est un petit redirecteur possede par l'operateur plutot qu'un compte SaaS de gestion de liens.

## Short.io

[Short.io](https://short.io/) est un raccourcisseur heberge a domaine custom avec tableaux de bord, acces API, analytics et workflows multi-domaines. Il convient aux equipes qui veulent un plan de controle gere et ne veulent pas batir un modele operationnel autour de Git.

Face a vanityURLs, Short.io deplace la responsabilite operationnelle vers le fournisseur, mais y deplace aussi les donnees, la facturation et la surface de politique. vanityURLs demande plus de discipline de setup, mais l'instance reste liee aux choix Cloudflare, GitHub et analytics optionnelles de l'operateur.

Choisissez Short.io quand la vitesse d'adoption et la gestion par tableau de bord comptent le plus. Choisissez vanityURLs quand l'operateur veut que les regles de redirection et la posture de confiance publique vivent dans un depot.

## YOURLS

[YOURLS](https://yourls.org/) est un raccourcisseur autoheberge etabli avec UI admin, plugins, support API et statistiques integrees. Il convient quand vous voulez une application web autohebergee classique avec base de donnees et extensibilite par plugins.

Face a vanityURLs, YOURLS donne une UI et du stockage dynamique, tandis que vanityURLs donne un Worker sans base de donnees genere depuis des fichiers. YOURLS peut etre plus flexible au runtime; vanityURLs est plus facile a raisonner comme artefact statique deployable.

Choisissez YOURLS quand vous voulez une application admin autohebergee conventionnelle. Choisissez vanityURLs quand Cloudflare Workers, la revue Git et le comportement runtime stateless sont le point.

## Shlink

[Shlink](https://shlink.io/) est une plateforme de liens courts autohebergee avec modele service/API, suivi des visites, outils CLI et backend plus riche qu'un registre de redirections statique. Il convient aux operateurs qui veulent une application open source mais ont besoin d'un service dynamique.

Face a vanityURLs, Shlink a une surface applicative plus large et un modele avec base de donnees. vanityURLs abandonne cette flexibilite runtime en echange d'un runtime edge plus petit et d'une configuration basee sur des fichiers.

Choisissez Shlink quand vous avez besoin d'un raccourcisseur d'URL open source avec backend API-first et donnees de visites persistantes. Choisissez vanityURLs quand votre source de verite preferee est Git et que la cible de deploiement est un Cloudflare Worker.

## Kutt

[Kutt](https://github.com/thedevs-network/kutt) est un raccourcisseur open source avec comptes, domaines custom, API et statistiques. Il est plus proche d'une application style SaaS autohebergee que d'un redirecteur statique.

Face a vanityURLs, Kutt convient mieux a la gestion multi-utilisateur de liens. vanityURLs convient mieux a un operateur seul ou une petite equipe qui prefere les pull requests, commandes locales et fichiers runtime generes.

Choisissez Kutt quand les utilisateurs ont besoin de comptes et d'une application web. Choisissez vanityURLs quand les comptes sont inutiles et que retirer la base de donnees est une fonction.

## Quand Ne Pas Choisir vanityURLs

Ne choisissez pas vanityURLs si vous avez besoin de gestion de comptes hebergee, tableaux de bord par utilisateur, facturation integree, API publique de creation de liens, edition de liens sans Git ou analytics sans configuration d'un fournisseur. Ne le choisissez pas si votre equipe ne peut pas operer Cloudflare DNS, Workers, GitHub et un petit workflow de build Node.

Evitez aussi vanityURLs si vous avez besoin d'etat runtime mutable. Le projet est volontairement modele autour d'une configuration deployable, donc chaque changement de lien devrait etre revu, construit et deploye comme du code.

## Sources

- [Bitly](https://bitly.com/)
- [Dub](https://dub.co/)
- [Short.io](https://short.io/)
- [YOURLS](https://yourls.org/)
- [Shlink](https://shlink.io/)
- [Kutt](https://github.com/thedevs-network/kutt)
