---
title: "Proteger la réputation d'un domaine court"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs traite la politique de blocklist comme une partie de l'exploitation d'un domaine court fiable."
tags: ["sécurité", "confiance", "blocklist"]
featured: false
---

Un domaine court est utile seulement tant que les gens lui font confiance. Le domaine peut être petit, personnel, interne ou discret, mais les navigateurs, fournisseurs de courriel, scanners, outils de sécurité et destinataires le jugent quand même selon les destinations qu'il sert.

C'est pourquoi vanityURLs traite la politique comme une partie du runtime, pas comme une tache de nettoyage optionnelle. Un redirecteur peut rendre de bons liens plus faciles a réténir, mais il peut aussi cacher des pages de phishing, téléchargements malveillants, chaines de redirection, trackers non declares, et destinations que les gens n'attendaient pas raisonnablement.

L'objectif est simple : protéger les visiteurs et protéger la réputation du domaine court.

## Les liens courts heritent du risque de destination

Quand quelqu'un clique sur un lien court, il voit souvent le domaine court avant la destination finale. Si la destination finale est malveillante, trompeuse ou simplement bruyante, le domaine court peut quand même recevoir le dommage de réputation.

C'est vrai pour les domaines publics comme pour les domaines privés. Un redirecteur familial, d'équipe ou d'organisation peut recevoir du trafic scanner. Un ancien lien de campagne peut pointer vers quelque chose de surprenant des mois plus tard. Une chaine de shorteners copiee peut cacher une destination que personne n'a relue.

La couche de politique donne au propriétaire de l'instance un endroit pour dire : “ces motifs de destination ne sont pas acceptables pour ce domaine.”

## Pourquoi les chaines de shorteners publics sont risquées

Rediriger d'un shortener vers un autre shortener affaiblit la raison même de possèder votre domaine. Cela cache la cible finale, rend la revue plus difficile, et peut créer des chaines qui changent après l'approbation de votre lien.

Il existe des exceptions legitimes, mais elles devraient être intentionnelles. Si vous contrôlez l'hote de destination, préfèrez un lien direct. Si vous devez autoriser un domaine bloque, gardez la règle d'autorisation etroite et sous votre contrôle.

## Pourquoi les téléchargements exécutables sont bloques par défaut

Les téléchargements exécutables ne sont pas toujours malveillants, mais ils portent plus de risque pour l'utilisateur et pour la réputation du domaine. Un redirecteur qui pointe facilement vers des fichiers `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, ou `.jar` peut ressembler à de l'infrastructure malware vue de l'extérieur.

Si votre instance a vraiment besoin de liens de distribution logicielle, documentez le propriétaire, la destination et le processus de revue. Gardez l'exception précise, et validez avant de déployer.

## Les feeds génères demandent du jugement humain

Les feeds de blocklist génères aident a attraper les abus évidents plus rapidement qu'une politique locale écrite à la main. Ils sont utiles, mais pas magiques. Des sources bruyantes peuvent casser des liens legitimes; des sources incomplêtes peuvent manquer des destinations risquées.

C'est pourquoi vanityURLs sépare la politique source de la sortie runtime générée. Les propriétaires d'instance relisent les entrées de politique dans Git, puis le build produit la blocklist runtime consommée par le Worker.

## La politique est un fallback, pas toute la defense

Les contrôles réseau Cloudflare devraient bloquer les abus évidents avant que le Worker s'execute. Les règles WAF, contrôles bot, contrôles crawler IA, rate limiting, DNS, SSL/TLS, et politiques Access protegent tous l'edge.

La blocklist Worker est le fallback applicatif. Elle attrape les destinations de redirection dangereuses et les probes scanner qui atteignent le runtime, et garde ces probes hors des analytics normaux de liens manques.

Utilisez [Politique et blocklist](/fr/docs/customize/blocklist/) pour le format exact de `custom/v8s-policies.json`, et [Protection réseau](/fr/docs/customize/network-protection/) pour les contrôles Cloudflare autour du Worker.
