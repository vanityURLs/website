---
title: "Confidentialité"
description: "Politique de confidentialité de vanityURLs.link — aucun cookie, aucun traqueur côté client, analyses agrégées minimales traitées à la périphérie."
---

## Notre engagement

vanityURLs.link est un site de documentation pour un projet open source. Nous prenons votre confidentialité au sérieux.

### Aucun cookie, aucun traqueur côté client

Ce site ne dépose aucun cookie. Il n'utilise ni pixels de suivi, ni empreintes de navigateur, ni aucune analytique JavaScript. Votre navigateur ne communique qu'avec `vanityurls.link` — jamais avec un serveur d'analytique tiers.

### Analyses agrégées traitées à la périphérie

Nous comptons les visites de pages pour savoir quelles pages de documentation sont utiles. Cela se fait côté serveur, à la périphérie Cloudflare, avec [Umami](https://umami.is/) (logiciel libre, hébergé en UE). Pour chaque page HTML que vous ouvrez, notre Worker de périphérie envoie un seul événement à Umami contenant :

- l'URL de la page (chemin uniquement),
- l'URL référente, si votre navigateur l'envoie,
- la première valeur de votre en-tête `Accept-Language` (par ex. `fr-CA`),
- un pays déduit de votre adresse IP, qui est tronquée avant d'être transmise (dernier octet mis à zéro pour IPv4, cinq derniers groupes mis à zéro pour IPv6) afin qu'Umami puisse déterminer le pays sans voir votre adresse IP complète. Votre adresse IP complète n'est jamais transmise à notre fournisseur d'analytique.

Aucun identifiant unique, cookie ou session ne vous est assigné. Aucun événement n'est envoyé pour les ressources (CSS, polices, images, index de recherche).

### Pas de scripts tiers

Nous ne chargeons pas de scripts d'analytique, publicité ou tracking social tiers dans votre navigateur. Les polices sont servies directement depuis `vanityurls.link` — aucune requête externe pour la typographie.

### Cloudflare

Le site est hébergé sur Cloudflare Workers Static Assets. Cloudflare peut collecter des journaux d'accès standard dans le cadre de l'opération de leur infrastructure. Ces données sont régies par la [politique de confidentialité de Cloudflare](https://www.cloudflare.com/fr-fr/privacypolicy/).

### Recherche

La fonction de recherche du site utilise [Pagefind](https://pagefind.app/), une bibliothèque de recherche côté client. Toutes les recherches sont traitées localement dans votre navigateur — elles ne sont jamais envoyées à un serveur.

---

*Dernière mise à jour : avril 2026. Cette politique s'applique uniquement à vanityURLs.link.*
