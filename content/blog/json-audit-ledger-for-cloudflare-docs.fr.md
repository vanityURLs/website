---
title: "La sauce secrété de vanityURLs est un registre JSON"
date: 2026-05-29
author: "Benoît H. Dicaire"
description: "Pourquoi vanityURLs garde une capture structuree du tableau de bord Cloudflare a côté de la documentation, et ou surveiller les changements Workers, protection de domaine et Zero Trust."
tags: ["documentation", "cloudflare", "opérations", "maintenance"]
featured: false
---

Le probleme est arrivé de la petite facon habituelle : un libellé du tableau de bord Cloudflare a bouge, une page de setup nommait encore l'ancien chemin, et le prochain mainteneur devait decider si la documentation était perimee ou si la guidance produit avait change.

vanityURLs se tient sur les epaules de Cloudflare. C'est le point. Un redirecteur de liens courts ne devrait pas avoir besoin d'une flotte de serveurs, d'une base de données ou d'un plan de contrôle privé. Il peut tourner sur [Cloudflare Workers](https://developers.cloudflare.com/workers/), publier des pages opérationnelles statiques avec [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) et laisser Cloudflare arrétér le bruit avant que le Worker s'execute.

La these est simple : quand une plateforme externe fait partie du modèle opérationnel, la prose ne suffit pas. vanityURLs a besoin d'un petit registre d'audit structure a côté de ses docs pour distinguer la derive de plateforme, les décisions produit et les vieilles instructions.

Au 2026-05-29, ce registre est [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json). `Last verified: 2026-05-29`

## Ce Qu'Est Le Registre

Le registre n'est pas de la configuration produit.

Il ne deploie rien.

C'est une capture structuree des surfaces du tableau de bord Cloudflare observees pendant la configuration d'une zone fraiche. La capture conserve les chemins de menu, états par défaut, surfaces de référence et décisions baseline en JSON, afin qu'un futur mainteneur puisse les comparer sans se fier à une capture d'ecran ou a sa memoire.

La distinction compte. La documentation publique dit à l'opérateur quoi faire. Le registre aide les mainteneurs a se rappeler pourquoi les docs le disent, a quoi ressemblait le tableau de bord lorsque la guidance a été écrite, et quels réglages tentants ont été exclus volontairement.

Par exemple, le guide de protection réseau dit aux opérateurs de ne pas créer de Cache Rules ou Cache Response Rules pour le baseline. Le registre note que la zone fraiche capturee n'avait pas de règles de cache, et que c'est intentionnel.

La référence analytics dit que [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) et [Real User Monitoring](https://developers.cloudflare.com/speed/observatory/rum/) ne font pas partie du baseline. Le registre note que RUM est désactive et seulement référence, afin qu'un futur mainteneur ne transforme pas accidentellement une carte visible du tableau de bord en etape obligatoire.

La forme souhaitee :

- les réglages baseline restent documentes comme baseline
- les surfaces de référence restent visibles pour reevaluation
- les libellés du tableau de bord sont conserves par chemin de menu
- les captures d'ecran sont des preuves d'appoint, pas la source de vérité

## Pourquoi La Prose Seule Echoue

La documentation Cloudflare et la documentation d'instance ont des travaux différents.

Cloudflare doit documenter ce que chaque produit peut faire. vanityURLs doit documenter la posture etroite qui convient à un redirecteur : Workers, DNS, SSL/TLS, [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/), [WAF](https://developers.cloudflare.com/waf/), contrôles de crawlers IA, cache, normalisation d'URL et les endroits ou réviser le trafic bloque.

Ce ne sont pas les mêmes choses.

[Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) est un produit Cloudflare utile. C'est aussi une alternative plausible pour de grandes listes de redirections statiques. Ce n'est pas le baseline vanityURLs parce qu'il contourne le registre gere dans le dépôt, les états de cycle de vie, horaires, pages de consultation, splats et analytics côté Worker.

RUM est similaire. Il peut aider les sites qui ont besoin de telémetrie de performance côté navigateur. vanityURLs ne l'utilise pas dans le baseline. Le redirecteur a dejà un modèle d'événements côté serveur, et le trafic bloque par Access, WAF, rate limiting ou contrôles bot n'atteint souvent jamais le Worker.

Sans le registre, ces distinctions deviennent floues. Un mainteneur voit une carte dans le tableau de bord, l'ajoute à une checklist, et transforme un diagnostic optionnel en setup obligatoire.

## La Liste De Surveillance

Le registre est une memoire locale. Il ne remplace pas les changelogs Cloudflare.

Le motif utile est ennuyeux :

```yaml
cloudflare_surface:
  source_of_truth: Cloudflare docs and changelogs
  local_memory: data/cloudflare-protection-defaults.json
  operator_docs: content/docs
  decision_record: ADR when the product contract changes
```

Au 2026-05-29, voici les sources Cloudflare a surveiller pour vanityURLs :

| Surface                                                                              | Changelog produit                                                                                                                                                                  |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Changements larges de produit et de tableau de bord                                  | - [Cloudflare](https://developers.cloudflare.com/changelog/)                                                                                                                       |
| Runtime Worker, Wrangler, Workers Builds et comportement du tableau de bord Workers  | - [Workers platform](https://developers.cloudflare.com/workers/platform/changelog/)<br>- [Workers product](https://developers.cloudflare.com/changelog/product/workers/)           |
| Regles WAF gerees et posture de sécurité applicative                                 | - [WAF](https://developers.cloudflare.com/waf/change-log/)<br>- [Application Security](https://developers.cloudflare.com/changelog/product-group/application-security/)            |
| Rules, transforms, redirects et normalisation d'URL                                  | - [Rules](https://developers.cloudflare.com/rules/changelog/)<br>- [Rules product](https://developers.cloudflare.com/changelog/product/rules/)                                     |
| UI DNS, DNSSEC, enregistrements proxifies et routage de domaine                      | - [DNS](https://developers.cloudflare.com/dns/changelog/)                                                                                                                          |
| SSL/TLS, certificats, contrôles proches de HSTS et comportement des certificats edge | - [SSL/TLS](https://developers.cloudflare.com/ssl/changelog/)                                                                                                                      |
| Access, navigation Zero Trust et comportement des politiques                         | - [Cloudflare One](https://developers.cloudflare.com/cloudflare-one/changelog/)<br>- [Cloudflare One product](https://developers.cloudflare.com/changelog/product/cloudflare-one/) |

Ces flux ne répondent pas aux mêmes questions.

Le changelog Workers peut affecter le comportement runtime. Le changelog WAF peut expliquer de nouvelles détéctions gerees qui augmentent les [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/). Le changelog Cloudflare One est l'endroit ou Access et la navigation Zero Trust peuvent bouger. Le changelog DNS peut changer les captures quickstart et les chemins de menu.

Pour vanityURLs, la question de maintenance est plus etroite : est-ce que le changement Cloudflare modifie le setup recommande, les mots dans les docs ou seulement le matériel de référence?

## La Boucle De Maintenance

Quand Cloudflare change quelque chose de pertinent, ne commencez pas par reécrire le quickstart.

Capturez d'abord l'observation :

1. Mettez à jour le registre JSON si un libellé, état par défaut, quota, chemin de menu ou décision baseline a changé.
2. Decidez si les docs publiques ont besoin d'un changement opérateur.
3. Deplacez le detail hors baseline vers une page de référence au lieu de gonfler le quickstart.
4. Ajoutez ou mettez à jour un [architecture décision record](https://adr.github.io/) seulement lorsque la décision affecte le contrat produit.[^adr]

ADR 0012 enregistre la règle actuelle : garder la capture du tableau de bord Cloudflare à jour lorsqu'elle est pertinente, et l'utiliser pour faciliter l'evaluation future.[^adr0012]

Il ne dit pas que chaque tressaillement de l'UI Cloudflare merite une ceremonie.

Il dit que la plateforme externe fait partie du modèle opérationnel, donc le projet a besoin d'une trace d'audit durable pour les parties de cette plateforme dont il depend.

## La Limite

Le registre peut quand même pourrir.

JSON ne rend pas une donnée perimee vraie. Une capture prise depuis un compte Cloudflare, un plan et une zone fraiche peut manquer des contrôles qui apparaissent seulement après du trafic, un changement de facturation, un accès beta ou un changement de plan. Le registre est une preuve. Ce n'est pas l'autorite.

C'est pourquoi chaque affirmation d'implementation ci-dessus est datee, et pourquoi les changelogs Cloudflare restent la source primaire.

Le compromis accepte est petit mais reel : vanityURLs porte un fichier de plus pour que les docs n'absorbent pas silencieusement chaque nouveaute du tableau de bord. C'est une assurance bon marche pour un projet dont le biais opérationnel est de rester petit tout en dependant d'une grande plateforme.

[^adr]: Le format ADR a plusieurs lignees plutot qu'un standard canonique unique. L'organisation publique [ADR GitHub](https://adr.github.io/) est un bon point d'entree; utilisez le template ADR du dépôt comme autorite locale.

[^adr0012]: ADR 0012 vit dans le dépôt code de vanityURLs : [Maintain Cloudflare dashboard capture](https://github.com/vanityURLs/code/blob/main/docs/adr/0012-maintain-cloudflare-dashboard-capture.md).
