---
title: "Du fichier de redirections au runtime Worker"
date: 2026-05-15
author: "Benoit H. Dicaire"
description: "Comment vanityURLs a évolué d'une simple liste de redirections vers un runtime Cloudflare Worker."
tags: ["historique", "architecture"]
---

vanityURLs a commence avec une idee volontairement petite : un domaine court, un fichier texte, et des redirections relues dans Git.

Cette première version était importante parce qu'elle prouvait le principe central. Un raccourcisseur de liens n'a pas besoin d'être une plateforme louee a quelqu'un d'autre. Il peut être une infrastructure que vous possèdez.

## La première forme

La première implementation s'appuyait sur Cloudflare Pages et un comportement de redirection statique. C'était suffisant pour des alias simples, mais les limites sont vite apparues :

- visibilité opérationnelle limitee
- pas de representation propre des états de cycle de vie
- pas d'analytics serveur sans ajouter du runtime
- pas de validation structuree au-delà de la syntaxe du fichier
- pas de bon endroit pour les pages opérationnelles protégées

Le projet est passe par des essais avec fichiers génères, pages HTML, idees côté client, et Pages Functions. Chaque etape resolvait un probleme tout en rendant un autre compromis plus visible.

## Pourquoi le Worker est devenu le centre

La release majeure actuelle déplace le runtime dans un Cloudflare Worker, soutenu par des assets statiques et un registre génère schéma `3.0`.

Ce changement ne vise pas a grossir le système. Il rend la version simple plus solide :

- le registre de liens est génère et valide avant déploiement
- le Worker accepte seulement la surface de requête nécessaire
- les pages opérationnelles comme `/_stats` et `/_tests` peuvent être protégées par Cloudflare Access
- les analytics serveur peuvent être émis sans JavaScript navigateur
- la blocklist, les états de cycle de vie, et les planifications tournent de facon coherente à l'edge
- le même code peut soutenir une instance privée aujourd'hui et une instance publique plus tard

La décision importante est que le Worker reste sobre. Il lit un registre statique, retourne des redirections ou des pages, et refuse les assets d'implementation privés. Il n'y a pas de base de données publique à modifier pendant une requête.

## Ce qui n'a pas change

Le projet traite toujours Git comme source de vérité. Les liens restent du texte revise. Une instance possède toujours son domaine, son répertoire `custom/`, son compte Cloudflare, et ses obligations légales.

L'architecture a changé parce que du vrai trafic est arrivé, incluant du trafic scanner sur une instance personnelle que personne n'avait annoncée. La leçon était claire : même un redirecteur discret a besoin de règles WAF, contrôles bot, blocklist runtime, et checklist de release.

La future instance publique, `v8s.link`, devrait garder cette leçon visible. Un moteur de redirection doit être facile a opérer, mais jamais leger sur l'abus.
