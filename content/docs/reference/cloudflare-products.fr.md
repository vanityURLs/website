---
aside: false
title: "Produits Cloudflare"
description: "Produits et surfaces Cloudflare que vanityURLs utilise, recommande ou exclut deliberement du baseline."
weight: 12
---

vanityURLs fonctionne sur Cloudflare, mais tous les produits visibles dans le tableau de bord Cloudflare ne font pas partie de la solution.

Utilisez cette page comme inventaire produit pour une instance vanityURLs. Les pages de setup expliquent le flux operateur; cette page de reference nomme les produits et surfaces Cloudflare impliques.

## Baseline requis

| Produit Cloudflare | Role dans vanityURLs |
| --- | --- |
| [Cloudflare DNS](https://www.cloudflare.com/products/dns/) | DNS autoritatif du domaine court, incluant le record Worker custom domain proxifie et les records mail/securite en DNS-only |
| [Cloudflare Workers](https://www.cloudflare.com/products/workers/) | Runtime pour les redirections, les pages operationnelles protegees, les assets statiques generes et l'envoi analytics serveur lorsque les analytics sont actives |
| [Cloudflare Access](https://www.cloudflare.com/products/access/) | Protection Zero Trust Network Access (ZTNA) pour le Stats dashboard sur `/_stats` et la Runtime test matrix sur `/_tests` |
| [Cloudflare SSL/TLS](https://www.cloudflare.com/products/ssl/) | Certificats edge, Universal SSL, mode Full strict, enforcement HTTPS, version TLS minimale et HSTS lorsque l'operateur est pret |

## Surfaces de protection baseline

Ces produits ou surfaces Cloudflare protegent le domaine court avant que le trafic atteigne le Worker.

| Produit ou surface Cloudflare | Role dans vanityURLs |
| --- | --- |
| [Cloudflare WAF](https://www.cloudflare.com/products/waf/) | Regles de securite custom pour probes scanner, methodes inattendues, clients suspects, crawlers IA non desires et autre trafic bloque a l'edge |
| [Cloudflare Rate Limiting](https://www.cloudflare.com/products/rate-limiting/) | Limitation de debit pour candidats de liens courts repetes et autres abus qui ne devraient pas consommer les ressources Worker |
| [Cloudflare DDoS Protection](https://www.cloudflare.com/ddos/) | Mitigation DDoS toujours active pour le reseau, SSL/TLS et HTTP autour du domaine court proxifie |
| [Cloudflare Bot Management](https://www.cloudflare.com/products/bot-management) | Famille produit derriere les controles bot; le guide vanityURLs Free-plan utilise les controles disponibles comme Bot Fight Mode et Browser Integrity Check |
| [Cloudflare AI Crawl Control](https://developers.cloudflare.com/bots/concepts/bot/#ai-crawlers) | Controles et signaux specifiques aux crawlers IA; a utiliser seulement lorsque l'operateur veut deliberement bloquer certaines familles de crawlers dans Cloudflare |
| [Cloudflare Rules](https://developers.cloudflare.com/rules/) | Managed Transforms, URL Normalization et autres regles de zone; vanityURLs recommande URL normalization et evite les regles de redirection comme source de verite des liens |
| [Cloudflare Security Events](https://developers.cloudflare.com/waf/analytics/security-events/) | Surface de revue pour les decisions WAF, bot, crawler, Access et rate-limit qui arretent les requetes avant l'execution du Worker |

## Reference seulement ou hors baseline

Ces surfaces sont visibles pendant le setup ou l'evaluation, mais elles ne sont pas requises pour le baseline vanityURLs.

| Produit ou surface Cloudflare | Decision baseline |
| --- | --- |
| [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) et RUM | Garder desactive sauf si l'operateur veut explicitement de la telemetrie navigateur; vanityURLs utilise les analytics serveur lorsque les analytics sont actives |
| [Cloudflare Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) | Utile pour de grandes listes de redirections statiques, mais pas la source de verite vanityURLs basee sur Worker |
| [Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/) | Ne creez pas de Cache Rules ni de Cache Response Rules pour le baseline; les decisions de redirection appartiennent au Worker |
| [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) | Non utilise par le baseline parce que vanityURLs n'expose pas de formulaire public ou d'API de creation de liens |
| [Cloudflare Workers Analytics](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/) | Surface de revue utile pour volume de requetes Worker, erreurs, temps CPU, wall time et duree; pas un produit a configurer pendant le Quickstart |

## Maintenance

Les noms de produits et la navigation du tableau de bord Cloudflare changent dans le temps. Lorsqu'une page de setup change a cause d'un produit Cloudflare ou d'un changement UI, mettez a jour la capture structuree dans [`data/cloudflare-protection-defaults.json`](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) lorsque le changement est pertinent.

Pour le raisonnement de maintenance, consultez [The JSON audit ledger behind the Cloudflare setup docs](/blog/json-audit-ledger-for-cloudflare-docs/) et [ADR 0012](https://github.com/vanityURLs/code/blob/main/docs/adr/0012-maintain-cloudflare-dashboard-capture.md).
