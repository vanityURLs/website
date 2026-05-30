---
title: "Courriels de contact publics pour les pages générées"
date: 2026-05-28
author: "Benoît H. Dicaire"
description: "Pourquoi setup demande de réviser les adresses de contact publiques, où vanityURLs les publie et quand les valeurs par défaut suffisent."
featured: false
---

La question de setup **Review public contact emails for generated pages?** détérmine si l'installateur s'arrété sur les adresses de contact que vanityURLs publie dans les pages publiques générées. Ces adresses ne sont pas des comptes visiteurs et elles ne servent pas au suivi des clics. Ce sont des contacts opérationnels qui aident les gens a signaler un abus, divulguer une vulnérabilité de sécurité ou contacter l'opérateur au sujet des pages légales publiées.

La règle est simple : ne publiez pas une boîte que vous n'operez pas.

Pour une instance de phase 1, les valeurs par défaut par rôle suffisent seulement si l'opérateur contrôle le courriel pour ce domaine ou a configuré le transfert. Si vous laissez le domaine de contact opérateur vide, setup derive les adresses du domaine court, par exemple `abuse@example.link` et `security@example.link`. Si vous entrez un domaine opérateur, par exemple `example.com`, setup derive plutot les mêmes rôles sur ce domaine.

## A quoi sert chaque adresse

Le contact Trust & Safety est le chemin public pour signaler des liens courts abusifs, dangereux, de phishing, de malware, d'usurpation ou autrement problematiques. vanityURLs le publie sur les pages de confiance et sécurité générées, avec la fenêtre de réponse humaine attendue.

Le contact sécurité sert aux signalements de vulnérabilités qui touchent l'instance de liens courts elle-même. Il est publie dans la page sécurité générée et dans [`/.well-known/security.txt`](https://www.rfc-editor.org/rfc/rfc9116), afin que les chercheurs en sécurité et les outils automatises trouvent le bon chemin de divulgation privée.

Lorsque les pages légales complêtes sont activées, setup utilise aussi un courriel de contact opérateur et un contact confidentialité. Le contact opérateur apparait dans les conditions générées. Le contact confidentialité apparait dans les pages de confidentialité générées et sert aux questions de confidentialité sur l'instance.

## Pourquoi les adresses par rôle fonctionnent mieux

Les adresses par rôle sont plus faciles à garder stables que les boîtes personnelles. `abuse@`, `security@`, `privacy@` et `hello@` peuvent être routees vers la bonne personne aujourd'hui et transferees plus tard lorsque la propriété change.

Elles rendent aussi les pages générées plus faciles à comprendre. Un registraire, un hébergéur, une équipe d'abus, un chercheur en sécurité ou un propriétaire de destination peut reconnaitre l'objectif de la boîte sans connaitre personnellement l'opérateur.

## Quand réviser les valeurs par défaut

Repondez `Y` pendant setup lorsque les signalements publics doivent aller vers un domaine autre que le domaine court, lorsqu'une organisation possède dejà des boîtes d'abus ou de sécurité etablies, ou lorsque les pages légales complêtes sont publiées immediatement.

Repondez `N` lorsque vous mettez l'instance en ligne et que les valeurs derivees suffisent pour le moment.

Vous pouvez relancer `npm run setup` plus tard; il lit les valeurs existantes et les propose comme défauts. Vous pouvez aussi modifier `custom/v8s-site-config.json` directement. Les cles pertinentes sont `operator.contact_email`, `operator.privacy_contact`, `operator.abuse_contact` et `operator.security_contact`.
