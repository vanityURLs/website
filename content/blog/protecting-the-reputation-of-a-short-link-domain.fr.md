---
title: "Proteger la reputation d'un domaine court"
date: 2026-05-22
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs traite la politique de blocklist comme une partie de l'exploitation d'un domaine court fiable."
tags: ["securite", "confiance", "blocklist"]
featured: false
---

Un domaine court est utile seulement tant que les gens lui font confiance. Le domaine peut etre petit, personnel, interne ou discret, mais les navigateurs, fournisseurs de courriel, scanners, outils de securite et destinataires le jugent quand meme selon les destinations qu'il sert.

C'est pourquoi vanityURLs traite la politique comme une partie du runtime, pas comme une tache de nettoyage optionnelle. Un redirecteur peut rendre de bons liens plus faciles a retenir, mais il peut aussi cacher des pages de phishing, telechargements malveillants, chaines de redirection, trackers non declares, et destinations que les gens n'attendaient pas raisonnablement.

L'objectif est simple : proteger les visiteurs et proteger la reputation du domaine court.

## Les liens courts heritent du risque de destination

Quand quelqu'un clique sur un lien court, il voit souvent le domaine court avant la destination finale. Si la destination finale est malveillante, trompeuse ou simplement bruyante, le domaine court peut quand meme recevoir le dommage de reputation.

C'est vrai pour les domaines publics comme pour les domaines prives. Un redirecteur familial, d'equipe ou d'organisation peut recevoir du trafic scanner. Un ancien lien de campagne peut pointer vers quelque chose de surprenant des mois plus tard. Une chaine de shorteners copiee peut cacher une destination que personne n'a relue.

La couche de politique donne au proprietaire de l'instance un endroit pour dire : “ces motifs de destination ne sont pas acceptables pour ce domaine.”

## Pourquoi les chaines de shorteners publics sont risquees

Rediriger d'un shortener vers un autre shortener affaiblit la raison meme de posseder votre domaine. Cela cache la cible finale, rend la revue plus difficile, et peut creer des chaines qui changent apres l'approbation de votre lien.

Il existe des exceptions legitimes, mais elles devraient etre intentionnelles. Si vous controlez l'hote de destination, preferez un lien direct. Si vous devez autoriser un domaine bloque, gardez la regle d'autorisation etroite et sous votre controle.

## Pourquoi les telechargements executables sont bloques par defaut

Les telechargements executables ne sont pas toujours malveillants, mais ils portent plus de risque pour l'utilisateur et pour la reputation du domaine. Un redirecteur qui pointe facilement vers des fichiers `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, ou `.jar` peut ressembler a de l'infrastructure malware vue de l'exterieur.

Si votre instance a vraiment besoin de liens de distribution logicielle, documentez le proprietaire, la destination et le processus de revue. Gardez l'exception precise, et validez avant de deployer.

## Les feeds generes demandent du jugement humain

Les feeds de blocklist generes aident a attraper les abus evidents plus rapidement qu'une politique locale ecrite a la main. Ils sont utiles, mais pas magiques. Des sources bruyantes peuvent casser des liens legitimes; des sources incompletes peuvent manquer des destinations risquees.

C'est pourquoi vanityURLs separe la politique source de la sortie runtime generee. Les proprietaires d'instance relisent les entrees de politique dans Git, puis le build produit la blocklist runtime consommee par le Worker.

## La politique est un fallback, pas toute la defense

Les controles reseau Cloudflare devraient bloquer les abus evidents avant que le Worker s'execute. Les regles WAF, controles bot, controles crawler IA, rate limiting, DNS, SSL/TLS, et politiques Access protegent tous l'edge.

La blocklist Worker est le fallback applicatif. Elle attrape les destinations de redirection dangereuses et les probes scanner qui atteignent le runtime, et garde ces probes hors des analytics normaux de liens manques.

Utilisez [Politique et blocklist](/fr/docs/blocklist/) pour le format exact de `custom/v8s-policies.json`, et [Protection reseau](/fr/docs/network-protection/) pour les controles Cloudflare autour du Worker.
