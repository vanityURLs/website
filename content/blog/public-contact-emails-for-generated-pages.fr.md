---
title: "Courriels de contact publics pour les pages générées"
date: 2026-05-28
author: "Benoît H. Dicaire"
description: "Pourquoi setup demande de réviser les adresses de contact publiques, où vanityURLs les publie et quand les valeurs par défaut suffisent."
featured: false
---

La question de setup **Review public contact emails for generated pages?** determine si l'installateur s'arrete sur les adresses de contact que vanityURLs publie dans les pages publiques generees. Ces adresses ne sont pas des comptes visiteurs et elles ne servent pas au suivi des clics. Ce sont des contacts operationnels qui aident les gens a signaler un abus, divulguer une vulnerabilite de securite ou contacter l'operateur au sujet des pages legales publiees.

La regle est simple : ne publiez pas une boite que vous n'operez pas.

Pour une instance de phase 1, les valeurs par defaut par role suffisent seulement si l'operateur controle le courriel pour ce domaine ou a configure le transfert. Si vous laissez le domaine de contact operateur vide, setup derive les adresses du domaine court, par exemple `abuse@example.link` et `security@example.link`. Si vous entrez un domaine operateur, par exemple `example.com`, setup derive plutot les memes roles sur ce domaine.

## A quoi sert chaque adresse

Le contact Trust & Safety est le chemin public pour signaler des liens courts abusifs, dangereux, de phishing, de malware, d'usurpation ou autrement problematiques. vanityURLs le publie sur les pages de confiance et securite generees, avec la fenetre de reponse humaine attendue.

Le contact securite sert aux signalements de vulnerabilites qui touchent l'instance de liens courts elle-meme. Il est publie dans la page securite generee et dans [`/.well-known/security.txt`](https://www.rfc-editor.org/rfc/rfc9116), afin que les chercheurs en securite et les outils automatises trouvent le bon chemin de divulgation privee.

Lorsque les pages legales completes sont activees, setup utilise aussi un courriel de contact operateur et un contact confidentialite. Le contact operateur apparait dans les conditions generees. Le contact confidentialite apparait dans les pages de confidentialite generees et sert aux questions de confidentialite sur l'instance.

## Pourquoi les adresses par role fonctionnent mieux

Les adresses par role sont plus faciles a garder stables que les boites personnelles. `abuse@`, `security@`, `privacy@` et `hello@` peuvent etre routees vers la bonne personne aujourd'hui et transferees plus tard lorsque la propriete change.

Elles rendent aussi les pages generees plus faciles a comprendre. Un registraire, un hebergeur, une equipe d'abus, un chercheur en securite ou un proprietaire de destination peut reconnaitre l'objectif de la boite sans connaitre personnellement l'operateur.

## Quand reviser les valeurs par defaut

Repondez `Y` pendant setup lorsque les signalements publics doivent aller vers un domaine autre que le domaine court, lorsqu'une organisation possede deja des boites d'abus ou de securite etablies, ou lorsque les pages legales completes sont publiees immediatement.

Repondez `N` lorsque vous mettez l'instance en ligne et que les valeurs derivees suffisent pour le moment.

Vous pouvez relancer `npm run setup` plus tard; il lit les valeurs existantes et les propose comme defauts. Vous pouvez aussi modifier `custom/v8s-site-config.json` directement. Les cles pertinentes sont `operator.contact_email`, `operator.privacy_contact`, `operator.abuse_contact` et `operator.security_contact`.
