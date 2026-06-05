---
title: "Produits Cloudflare que vanityURLs laisse de cote"
date: 2026-05-29
author: "Benoît H. Dicaire"
description: "Les produits Cloudflare documentes comme hors baseline, et pourquoi ils restent hors du setup vanityURLs par défaut."
tags: ["cloudflare", "opérations", "baseline"]
featured: false
---

Cloudflare a plus de produits utiles qu'un redirecteur de liens courts devrait en utiliser.

Ce n'est pas une critique de Cloudflare. C'est une limite opérationnelle. vanityURLs utilise [Cloudflare DNS](https://www.cloudflare.com/products/dns/), [Cloudflare Workers](https://www.cloudflare.com/products/workers/), [Cloudflare Access](https://www.cloudflare.com/products/access/), [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) pour le lookup public, SSL/TLS et certaines protections edge. La liste baseline vit dans [Produits Cloudflare](/fr/docs/reference/cloudflare-products/). Le setup detaille vit dans [Protection réseau](/fr/docs/customize/network-protection/).

Cette page documente l'autre côté de la décision : des produits visibles, utiles dans le bon déploiement, mais hors du setup vanityURLs par défaut.

## Le Test D'Exclusion

Un produit Cloudflare appartient au baseline seulement s'il protège ou sert une de ces surfaces :

- DNS et TLS pour le domaine court
- le runtime Worker
- les pages opérationnelles protégées comme `/en/_stats/`, les autres chemins stats localisés et `/_tests`
- les contrôles edge qui rejettent le trafic avant le Worker
- la verification visiteur pour la résolution lookup publique

Le reste exige une raison locale précise.

## Produits Hors Baseline

| Produit                                                                                                                               | Pourquoi il reste hors baseline                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare Web Analytics](/fr/docs/reference/cloudflare-products/) et [Real User Monitoring](/fr/docs/customize/network-protection/) | Ils ajoutent de la telémetrie navigateur. vanityURLs utilise des événements côté serveur depuis le Worker lorsque les analytics sont activées.                          |
| [Bulk Redirects](https://developers.cloudflare.com/web-analytics/)                                                                    | Ils creent un deuxieme système de redirection a côté du registre de liens gere dans Git et du resolver Worker.                                                          |
| [Cache Rules](https://developers.cloudflare.com/speed/observatory/rum/) et Cache Response Rules                                       | Ils peuvent conserver des décisions de redirection, des états de cycle de vie ou des trous analytics perimes. Les ressources statiques ont déjà leurs propres en-têtes. |
| [Workers Analytics](https://developers.cloudflare.com/cache/how-to/cache-rules/)                                                      | C'est une surface d'observabilite, pas une etape de setup. Utilisez-la après déploiement pour la sante Worker, pas pour les événements applicatifs.                     |

Dans la capture du tableau de bord du 2026-05-29, ces exclusions sont aussi suivies dans [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json). `Last verified: 2026-05-29`

## Le Compromis

Laisser un produit de côté peut sembler dommage. Le tableau de bord est la.

Mais chaque produit supplémentaire peut ajouter une deuxieme source de vérité, une dependance à un plan payant, du code navigateur ou un autre endroit ou diagnostiquer une redirection qui aurait du rester banale.

Utilisez les produits exclus quand le déploiement en a vraiment besoin. Ecrivez la raison. Sinon, gardez le redirecteur petit.
