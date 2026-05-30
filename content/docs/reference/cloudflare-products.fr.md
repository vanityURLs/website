---
aside: false
title: "Produits Cloudflare"
description: "Produits et surfaces du tableau de bord Cloudflare que vanityURLs utilise dans son baseline operationnel."
weight: 20
---

vanityURLs est un raccourcisseur d'URL qui fonctionne sur le reseau edge de Cloudflare avec votre _propre_ domaine.

Cloudflare est une plateforme SaaS en evolution continue : fonctionnalites, API, libelles du tableau de bord et navigation peuvent changer sans numero de version majeur. Pour garder la documentation alignee avec cette surface mouvante, vanityURLs maintient une [capture structuree du tableau de bord Cloudflare](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) en JSON. Cette capture aide les mainteneurs a comparer les changements d'interface dans le temps et a mettre la documentation a jour de facon deliberee. Pour le raisonnement de maintenance, consultez [ADR 0012](https://github.com/vanityURLs/code/blob/main/docs/adr/0012-maintain-cloudflare-dashboard-capture.md) et [The JSON audit ledger behind the Cloudflare setup docs](/blog/json-audit-ledger-for-cloudflare-docs/).

| Produit | Role dans vanityURLs |
| --- | --- |
| [Cloudflare DNS](https://www.cloudflare.com/products/dns/) | DNS autoritatif du domaine court, incluant l'enregistrement proxifie du domaine personnalise du Worker |
| [Cloudflare Workers](https://www.cloudflare.com/products/workers/) | Runtime pour les redirections, les pages operationnelles protegees, les ressources statiques generees et l'envoi d'analytics cote serveur |
| [Cloudflare Access](https://www.cloudflare.com/products/access/) | Protection Zero Trust Network Access (ZTNA) pour les surfaces operationnelles protegees, comme le tableau de bord Stats et la matrice de tests runtime |
| [Cloudflare SSL/TLS](https://www.cloudflare.com/products/ssl/) | Certificats edge, Universal SSL, enforcement HTTPS et configuration TLS minimale |

## Protection reseau avant que le trafic atteigne l'instance vanityURLs

| Produit ou surface | Role dans vanityURLs |
| --- | --- |
| [Web Application Firewall](https://www.cloudflare.com/products/waf/) | Regles de securite personnalisees pour les sondes de scanner, les methodes inattendues, les clients suspects, les crawlers IA non desires et les autres trafics bloques a l'edge |
| [Cloudflare Rate Limiting](https://www.cloudflare.com/products/rate-limiting/) | Limitation de debit pour les comportements abusifs qui ne devraient pas consommer de ressources Worker |
| [Distributed Denial-of-Service (DDoS) Protection](https://www.cloudflare.com/ddos/) | Protection reseau toujours active |
| [Cloudflare Bot Management](https://www.cloudflare.com/products/bot-management) | Controles bot utilises pour reduire l'abus automatise avant que les requetes atteignent le Worker |
| [Cloudflare AI Crawl Control](https://developers.cloudflare.com/bots/concepts/bot/#ai-crawlers) | Controles propres a certaines familles de crawlers IA |
| [Cloudflare Rules](https://developers.cloudflare.com/rules/) | Managed Transforms et normalisation des URL avant que le trafic atteigne l'instance vanityURLs |
| [Cloudflare Security Events](https://developers.cloudflare.com/waf/analytics/security-events/) | Surface de revue pour les mitigations appliquees avant l'execution du Worker |

Pour les produits Cloudflare utiles a connaitre mais hors du baseline par defaut, consultez [Produits Cloudflare hors du baseline vanityURLs](/fr/blog/cloudflare-products-outside-the-vanityurls-baseline/).
