---
title: "Du fichier de redirections au runtime Worker"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "Historique brouillon de l'evolution de vanityURLs, d'une simple liste de redirections vers un runtime Cloudflare Worker."
tags: ["historique", "architecture"]
draft: true
---

vanityURLs a commence avec une idee volontairement petite : un domaine court, un fichier texte, et des redirections relues dans Git.

Cette premiere version etait importante parce qu'elle prouvait le principe central. Un raccourcisseur de liens n'a pas besoin d'etre une plateforme louee a quelqu'un d'autre. Il peut etre une infrastructure que vous possedez.

## La premiere forme

La premiere implementation s'appuyait sur Cloudflare Pages et un comportement de redirection statique. C'etait suffisant pour des alias simples, mais les limites sont vite apparues :

- visibilite operationnelle limitee
- pas de representation propre des etats de cycle de vie
- pas d'analytics serveur sans ajouter du runtime
- pas de validation structuree au-dela de la syntaxe du fichier
- pas de bon endroit pour les pages operationnelles protegees

Le projet est passe par des essais avec fichiers generes, pages HTML, idees cote client, et Pages Functions. Chaque etape resolvait un probleme tout en rendant un autre compromis plus visible.

## Pourquoi le Worker est devenu le centre

La release majeure actuelle deplace le runtime dans un Cloudflare Worker, soutenu par des assets statiques et un registre genere schema `2.2`.

Ce changement ne vise pas a grossir le systeme. Il rend la version simple plus solide :

- le registre de liens est genere et valide avant deploiement
- le Worker accepte seulement la surface de requete necessaire
- les pages operationnelles comme `/_stats` et `/_tests` peuvent etre protegees par Cloudflare Access
- les analytics serveur peuvent etre emis sans JavaScript navigateur
- la blocklist, les etats de cycle de vie, et les planifications tournent de facon coherente a l'edge
- le meme code peut soutenir une instance privee aujourd'hui et une instance publique plus tard

La decision importante est que le Worker reste sobre. Il lit un registre statique, retourne des redirections ou des pages, et refuse les assets d'implementation prives. Il n'y a pas de base de donnees publique a modifier pendant une requete.

## Ce qui n'a pas change

Le projet traite toujours Git comme source de verite. Les liens restent du texte revise. Une instance possede toujours son domaine, son repertoire `custom/`, son compte Cloudflare, et ses obligations legales.

L'architecture a change parce que du vrai trafic est arrive, incluant du trafic scanner sur une instance personnelle que personne n'avait annoncee. La lecon etait claire : meme un redirecteur discret a besoin de regles WAF, controles bot, blocklist runtime, et checklist de release.

La future instance publique, `v8s.link`, devrait garder cette lecon visible. Un moteur de redirection doit etre facile a operer, mais jamais leger sur l'abus.
