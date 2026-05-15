---
title: "FAQ"
description: "Questions frequentes sur l'exploitation, la securisation, et la mise a jour d'une instance vanityURLs."
---

## La FAQ devrait-elle vivre dans la documentation ou ailleurs?

Elle devrait etre une section autonome du site. La documentation sert aux procedures et references; la FAQ sert aux decisions, compromis, et reponses rapides qui pointent vers la documentation.

## Faut-il encore modifier `v8s-schedules.json` a la main?

Habituellement non. Utilisez `./scripts/lnk schedule add`, `./scripts/lnk schedule default`, et `./scripts/lnk schedule list` pour le travail courant. Vous pouvez definir une cible fallback pendant l'ajout d'une regle avec `--default`. Les edits JSON restent utiles pour les changements de masse ou les changements qui se relisent mieux directement en code review.

## La CLI demande-t-elle Bash?

Non. La CLI principale, `./scripts/lnk`, est basee sur Node et fonctionne sur macOS, Linux, Windows, et les environnements CI avec Node et Git. Le helper optionnel `scripts/v8s.zsh` demande Zsh, mais c'est seulement une convenience pour ouvrir des redirections existantes.

## Pourquoi ne pas ecrire la CLI en Go?

Go pourra avoir du sens plus tard pour un binaire autonome package. Aujourd'hui Node est le meilleur choix parce que le depot depend deja de Node pour le build, la validation, les tests, et Wrangler. Une CLI Node evite de maintenir deux implementations pendant que le projet evolue encore vite.

## v8s est-il un raccourcisseur heberge?

Non. v8s est un logiciel pour operer votre propre moteur de liens courts sur votre propre domaine et compte Cloudflare. Votre depot Git, Worker Cloudflare, zone DNS, pages legales, et destinations restent votre responsabilite.

## Pourquoi utiliser un registre JSON genere plutot qu'une base de donnees?

Le runtime doit rester petit. Un registre genere est facile a valider, auditer, comparer, restaurer, et deployer. Une base de donnees pourra etre ajoutee plus tard seulement si l'edition deleguee justifie le cout operationnel.

## L'instance publique `v8s.link` est-elle prete?

Pas encore. Le travail actuel prepare le code, les defaults, le modele securite, la documentation, le processus de mise a jour, et les controles anti-abus pour lancer une instance publique avec une base responsable.

## Quels menus Cloudflare comptent?

Il y a trois endroits a connaitre :

- Zero Trust pour les applications Access, politiques, identity providers, et reglages Zero Trust
- Workers & Pages pour le Worker, binding assets, variables, observabilite, domaines, et reglages de build
- la zone de configuration du domaine pour DNS, SSL/TLS, WAF, Security, AI Crawl Control, Rules, Network, Caching, et analytics

## Pourquoi WAF et controles bot sont-ils necessaires pour une instance personnelle discrete?

Les domaines courts recoivent du trafic scanner et bot meme quand personne ne les a annonces. Bloquer l'abus evident avant le Worker protege CPU, quota analytics, reputation, et logs.

## v8s utilise-t-il des analytics cote client?

Non. Le modele recommande est l'analytics serveur depuis le Worker vers Umami ou Fathom. N'ajoutez pas de scripts de tracking navigateur sauf si votre propre posture legale/confidentialite le permet explicitement.

## Puis-je utiliser v8s pour des liens affilies ou du tracking de campagne?

Seulement si la destination et la divulgation sont honnetes. N'utilisez pas un redirecteur pour cacher des destinations malveillantes, blanchir une chaine de raccourcisseurs, dissimuler du tracking, ou envoyer les gens vers un endroit qu'ils ne pouvaient pas raisonnablement attendre.

## Qui est responsable des conditions et pages de confidentialite?

Le proprietaire de l'instance. Le depot peut fournir des brouillons et une structure, mais ce n'est pas un avis juridique. Les proprietaires doivent adapter conditions, confidentialite, abus, et contact securite a leur audience et juridiction.

## Comment garder une instance a jour?

Gardez les fichiers locaux dans `custom/`, lancez `npm run clean`, utilisez le workflow de mise a jour pour rafraichir `defaults/` et `scripts/`, puis lancez `npm run check` avant de deployer.

## Que faut-il commiter?

Commitez les sources et changements `custom/`. Ne commitez pas les sorties generees `build/`, `src/`, ou `functions/`. La commande clean retire ces repertoires generes.
