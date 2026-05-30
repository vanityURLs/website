---
title: "Produits Cloudflare que vanityURLs laisse de cote"
date: 2026-05-29
author: "Benoît H. Dicaire"
description: "Les produits Cloudflare documentes comme hors baseline, et pourquoi ils restent hors du setup vanityURLs par defaut."
tags: ["cloudflare", "operations", "baseline"]
featured: false
---

Cloudflare a plus de produits utiles qu'un redirecteur de liens courts devrait en utiliser.

Ce n'est pas une critique de Cloudflare. C'est une limite operationnelle. vanityURLs utilise [Cloudflare DNS](https://www.cloudflare.com/products/dns/), [Cloudflare Workers](https://www.cloudflare.com/products/workers/), [Cloudflare Access](https://www.cloudflare.com/products/access/), SSL/TLS et certaines protections edge. La liste baseline vit dans [Produits Cloudflare](/fr/docs/reference/cloudflare-products/). Le setup detaille vit dans [Protection reseau](/fr/docs/customize/network-protection/).

Cette page documente l'autre cote de la decision : des produits visibles, utiles dans le bon deploiement, mais hors du setup vanityURLs par defaut.

## Le Test D'Exclusion

Un produit Cloudflare appartient au baseline seulement s'il protege ou sert une de ces surfaces :

- DNS et TLS pour le domaine court
- le runtime Worker
- les pages operationnelles protegees comme `/_stats` et `/_tests`
- les controles edge qui rejettent le trafic avant le Worker

Le reste exige une raison locale precise.

## Produits Hors Baseline

| Produit | Pourquoi il reste hors baseline |
| --- | --- |
| [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) et [Real User Monitoring](https://developers.cloudflare.com/speed/observatory/rum/) | Ils ajoutent de la telemetrie navigateur. vanityURLs utilise des evenements cote serveur depuis le Worker lorsque les analytics sont activees. |
| [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) | Ils creent un deuxieme systeme de redirection a cote du registre de liens gere dans Git et du resolver Worker. |
| [Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/) et Cache Response Rules | Ils peuvent conserver des decisions de redirection, des etats de cycle de vie ou des trous analytics perimes. Les ressources statiques ont deja leurs propres en-tetes. |
| [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) | Il protege les formulaires et les flux interactifs. Le redirecteur standard n'a pas de formulaire public, login visiteur, checkout ou zone de commentaires. |
| [Workers Analytics](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/) | C'est une surface d'observabilite, pas une etape de setup. Utilisez-la apres deploiement pour la sante Worker, pas pour les evenements applicatifs. |

Dans la capture du tableau de bord du 2026-05-29, ces exclusions sont aussi suivies dans [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json). `Last verified: 2026-05-29`

## Le Compromis

Laisser un produit de cote peut sembler dommage. Le tableau de bord est la.

Mais chaque produit supplementaire peut ajouter une deuxieme source de verite, une dependance a un plan payant, du code navigateur ou un autre endroit ou diagnostiquer une redirection qui aurait du rester banale.

Utilisez les produits exclus quand le deploiement en a vraiment besoin. Ecrivez la raison. Sinon, gardez le redirecteur petit.
