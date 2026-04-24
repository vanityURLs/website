---
title: "Déclaration de sécurité"
description: "Comment vanityURLs.link est sécurisé — chiffrement, hébergement, en-têtes HTTP, protection des emails et auditabilité open source."
---

vanityURLs.link est un site de documentation statique pour un projet open source. Il n'y a pas d'authentification, de base de données, de traitement côté serveur, ni de collecte de données personnelles. Cette page explique les contrôles de sécurité en place.

## Hébergement : Cloudflare Pages

Ce site est servi exclusivement par [Cloudflare Pages](https://pages.cloudflare.com/), une plateforme serverless distribuée à l'échelle mondiale. Cloudflare fournit :

- **TLS 1.3** — toutes les connexions sont chiffrées avec TLS 1.3 (TLS 1.2 minimum). Les versions de protocole plus anciennes sont rejetées.
- **HSTS** — HTTP Strict Transport Security est appliqué, empêchant les attaques de rétrogradation de protocole.
- **HTTP/2 et HTTP/3** — les protocoles de transport modernes sont activés automatiquement.
- **Protection DDoS** — le réseau Cloudflare absorbe les attaques volumétriques à la périphérie avant qu'elles n'atteignent l'origine.
- **Zéro serveur d'origine** — il n'y a pas de serveur d'origine à attaquer. Le site est entièrement servi depuis le cache de périphérie de Cloudflare.

Les pratiques de sécurité de l'infrastructure Cloudflare sont documentées sur [cloudflare.com/trust-hub](https://www.cloudflare.com/trust-hub/).

## En-têtes de sécurité HTTP

Chaque réponse de vanityURLs.link inclut les en-têtes suivants, définis dans `build/_headers` et appliqués par Cloudflare Pages :

| En-tête | Valeur | Objectif |
|---------|--------|----------|
| `X-Frame-Options` | `DENY` | Empêche le site d'être intégré dans des iframes — bloque le clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prévient les attaques de reniflage de type MIME |
| `X-XSS-Protection` | `1; mode=block` | Filtre XSS hérité pour les navigateurs anciens |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limite les informations de référent envoyées aux tiers |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Désactive explicitement l'accès aux API du périphérique |
| `Content-Security-Policy` | (voir ci-dessous) | Restreint les ressources que le navigateur peut charger |
| `frame-ancestors` | `none` | Remplacement moderne de X-Frame-Options |

### Politique de sécurité du contenu

```
default-src 'self';
script-src  'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net;
style-src   'self';
font-src    'self';
img-src     'self' data:;
connect-src 'self';
frame-ancestors 'none'
```

Les ressources externes se limitent à : le CDN jsDelivr pour la bibliothèque de diagrammes Mermaid, utilisée uniquement sur les pages de documentation qui contiennent des diagrammes. `'wasm-unsafe-eval'` dans `script-src` est requis par le moteur de recherche client Pagefind, qui utilise WebAssembly.

## Protection du domaine email

vanityURLs.link n'envoie pas d'email. Le domaine est verrouillé contre l'usurpation avec :

| Enregistrement | Valeur | Effet |
|----------------|--------|-------|
| `DMARC _dmarc` | `p=reject; sp=reject; adkim=s; aspf=s` | Les serveurs de messagerie destinataires doivent rejeter tout email prétendant provenir de ce domaine |
| `DKIM *.domainkey` | `v=DKIM1; p=` | Clé publique vide — aucune signature DKIM ne peut être valide pour ce domaine |
| `MTA-STS _mta-sts` | `v=STSv1` | Les serveurs de messagerie contactant ce domaine doivent utiliser TLS |

Cette configuration rend techniquement impossible la création d'un email valide prétendant provenir de `@vanityurls.link`.

## Open source et auditable

Le code source de ce site est public. Vous pouvez auditer chaque ligne sur :

**[github.com/vanityURLs/website](https://github.com/vanityURLs/website)**

Cela inclut :
- Les templates et mises en page Hugo
- La configuration de sécurité `_headers`
- Le flux de travail CI/CD GitHub Actions
- La configuration Tailwind CSS et tout le JavaScript

Il n'y a pas de scripts minifiés ou obscurcis, pas d'analytique tierce, et pas de pixels de suivi. Si vous trouvez quelque chose d'inattendu, veuillez ouvrir un ticket ou [signaler via les GitHub Security Advisories](https://github.com/vanityURLs/vanityURLs/security/advisories/new).

## Ce que vanityURLs ne fait PAS

- **Aucun cookie** — le site ne définit aucun cookie
- **Aucune analytique** — pas de suivi, d'enregistrement de session ni de script analytique
- **Aucune collecte de données personnelles** — pas de formulaires, pas de comptes, pas de journaux de données visiteurs
- **Aucune publicité tierce** — pas de réseaux publicitaires
- **Aucun script injecté par CDN** — Zaraz et Rocket Loader de Cloudflare ne sont pas activés

La seule requête réseau externe que le navigateur du visiteur peut effectuer est vers jsDelivr, et uniquement sur les pages de documentation qui contiennent des diagrammes Mermaid. Les polices sont servies directement depuis vanityurls.link. La recherche est gérée côté client par [Pagefind](https://pagefind.app/) — les requêtes ne quittent jamais votre navigateur.

## Signalement de vulnérabilités

Si vous découvrez un problème de sécurité dans ce site ou le logiciel vanityURLs, veuillez le signaler en privé :

- **GitHub Security Advisories** : [Signaler une vulnérabilité](https://github.com/vanityURLs/vanityURLs/security/advisories/new)
- Ne pas ouvrir un ticket public pour les vulnérabilités de sécurité

Nous visons à accuser réception des signalements dans les **72 heures** et à les résoudre dans les **7 jours**.

---

*Cette déclaration s'applique à vanityURLs.link. Elle ne s'applique pas aux instances auto-hébergées de vanityURLs, qui relèvent de la seule responsabilité de leurs opérateurs.*
