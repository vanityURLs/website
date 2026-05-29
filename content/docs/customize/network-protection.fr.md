---
aside: false
title: "Protection reseau"
description: "Configurer les controles de domaine Cloudflare qui protegent une zone vanityURLs avant que le trafic atteigne le Worker."
weight: 70
aliases:
  - /docs/network-protection/
  - /docs/reference/network-protection/
  - /docs/reference/cloudflare-network-protection/

---

Utilisez cette page lorsque vous etes pret a configurer les controles Cloudflare devant le Worker. La protection reseau garde les abus courants, les methodes inattendues, les probes de scanners, les crawlers non desires et le bruit d'infrastructure loin du code applicatif.

Pour le raisonnement de securite par couches, lisez [Ajouter des couches de protection Cloudflare autour d'un domaine court](/fr/blog/layering-cloudflare-protection-around-a-short-link-domain/). La capture brute du tableau de bord Cloudflare se trouve dans [data/cloudflare-protection-defaults.json](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json); utilisez-la pour suivre les changements de menus Cloudflare, pas comme checklist operateur.

Pour les fonctionnalites volontairement exclues du setup par defaut, lisez [Fonctionnalités Cloudflare à ne pas activer par défaut](/fr/blog/cloudflare-features-not-to-enable-by-default/).

{{% steps %}}

### Confirmer le domaine custom du Worker

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **DNS** > **Records**. Utilisez le record Worker Custom Domain que Cloudflare cree pour le domaine court. Il devrait apparaitre comme un record Worker proxifie pour le hostname, par exemple `v8s.link -> v8s-link`.

Supprimez les anciens records synthetiques `AAAA 100::` pour le meme hostname une fois le Custom Domain actif. Gardez les records mail, DKIM, DMARC, MTA-STS et verification de propriete en DNS-only sauf si le fournisseur exige explicitement le proxy.

Utilisez des records proxifies separes seulement pour de vrais sous-domaines web, comme `mta-sts`, `www` ou un site de documentation.

### Etablir la base HTTPS

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **SSL/TLS** > **Overview**. Dans **Configure encryption mode**, selectionnez **Custom SSL/TLS**, choisissez **Full (Strict)**, puis sauvegardez. Cloudflare peut afficher **Automatic SSL/TLS (default)** avec un mode courant comme **Flexible** avant ce changement; c'est l'etat a remplacer pour un domaine custom Worker en production.

Ensuite, ouvrez **SSL/TLS** > **Edge Certificates** et parcourez les options dans l'ordre du tableau de bord :

| Option du tableau de bord | Recommandation |
| --- | --- |
| Manage Edge Certificates | Confirmer qu'un certificat Universal actif couvre le domaine apex et le wildcard, comme `v8s.link` et `*.v8s.link` |
| Advanced Certificate Manager | Aucune action sauf si l'instance a besoin des controles de certificats custom payants |
| Total TLS | Aucune action pour la base du plan gratuit; requiert Advanced Certificate Manager |
| Cipher suites | Aucune action pour la base du plan gratuit; requiert Advanced Certificate Manager |
| Always Use HTTPS | On |
| HTTP Strict Transport Security (HSTS) | Commencer sans HSTS enforce par les navigateurs tant que chaque hostname et sous-domaine de production n'est pas pret pour HTTPS |
| Minimum TLS Version | TLS 1.2 ou plus strict |
| Opportunistic Encryption | On convient; aucune action specifique a vanityURLs |
| TLS 1.3 | On |
| Automatic HTTPS Rewrites | On |
| Certificate Transparency Monitoring | Optionnel, utile pour les alertes de certificats inattendus |
| Disable Universal SSL | Ne cliquez pas dessus; voir cette action signifie que Universal SSL est actuellement active |

HSTS est l'endroit le plus facile a mal lire dans l'interface. **Enable HSTS** avec **Max Age Header (max-age)** a **0 (Disable)** ne donne pas aux navigateurs une politique HSTS durable; c'est un etat non enforce ou de remise a zero. Utilisez-le pendant la validation de la zone. Pour l'enforcement en production, choisissez un max age non nul apres que chaque hostname public soit pret pour HTTPS. Un max age d'un mois est un bon premier reglage; activez **includeSubDomains** et **Preload** seulement quand toute la zone est volontairement HTTPS-only.

### Activer les controles de securite de base

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Security** > **Settings** pour le tableau de bord, les bots, Browser Integrity Check, Challenge Passage, le remplacement de bibliotheques et `security.txt`. Utilisez **Security** > **Security rules** lorsqu'un controle necessite une regle plutot qu'un interrupteur.

Les reglages de securite du plan gratuit doivent rester sobres et explicites. Activez les protections qui reduisent les abus courants, mais evitez les fonctionnalites qui modifient le contenu public ou exposent des donnees visiteur supplementaires sans besoin clair.

| Reglage | Recommandation | Pourquoi |
| --- | --- | --- |
| New application security dashboard | On | Utiliser la vue actuelle du tableau de bord pour les evenements de securite et actions |
| Bot Fight Mode | On | Ajoute des challenges bot de base sur le plan gratuit |
| Browser Integrity Check | On | Bloque les requetes navigateur malformees ou suspectes avant l'execution du Worker |
| Challenge Passage | 30 minutes | Garde les challenges manages utiles sans rendre les visites legitimes repetees trop bruyantes |
| Cloudflare managed ruleset | On | Fournit une protection applicative de base maintenue par Cloudflare |
| Email Address Obfuscation | On si des pages publiques affichent des adresses courriel | Protege les adresses visibles sans modifier le contenu lisible par humain |
| Hotlink Protection | Off par defaut | Les assets du raccourcisseur sont petits; activez seulement si la reutilisation d'images hors site devient un vrai cout |
| Leaked Credentials Detection | Off sauf si l'application a un login par mot de passe | vanityURLs n'authentifie pas les visiteurs avec des mots de passe |
| Security.txt | Configurer avant release | Publie un chemin de contact pour les rapports de vulnerabilite |
| Replace insecure JavaScript libraries | On | Permet a Cloudflare de remplacer les bibliotheques vulnerables lorsque supporte |
| Schema Validation | Off sauf si des schemas API sont definis | Necessite des endpoints et schemas actifs pour etre utile |
| Zone IP allowlist rules | Off sauf si les chemins admin ont besoin d'une allowlist IP | Cloudflare Access est le controle principal pour les chemins prives |

N'activez pas les certificats client, regles mTLS, en-tetes de localisation visiteur ou en-tetes True-Client-IP pour le raccourcisseur public sauf si un service en aval en a explicitement besoin. Le Worker recoit deja les metadonnees pays et colo Cloudflare pour les analytics agreges.

### Ajouter les regles WAF

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Security** > **Security rules** > **Security rules**, puis creez des regles custom avec l'editeur d'expression.

Les regles de securite Cloudflare s'executent avant le Worker. Utilisez-les pour le trafic qui ne devrait jamais atteindre le code applicatif.

| Regle | Action | Notes |
| --- | --- | --- |
| Bloquer les probes scanner | Block | Cible les chemins d'exploit courants comme `.php`, `/wp-`, `/.env` et probes admin |
| Bloquer les methodes inattendues | Block | Autorise seulement `GET`, `HEAD` et `OPTIONS` pour le hostname public de redirection |
| Challenger les clients suspects | Managed Challenge | Exclut les bots verifies, `/_stats`, `/_tests`, les assets statiques et `robots.txt` |
| Bloquer les crawlers IA non desires | Block | Exclut `/robots.txt`; cible les user agents de crawlers que vous ne voulez pas servir |
| Rate limiter les candidats de liens courts | Block ou challenge | Compte les misses repetes et candidats de type scanner, pas les redirections reussies |

Exemples d'expressions pour une zone `v8s.link` :

```text
http.host in {"v8s.link" "www.v8s.link"} and (
  ends_with(lower(http.request.uri.path), ".php") or
  contains(lower(http.request.uri.path), "/wp-") or
  contains(lower(http.request.uri.path), "/.env")
)
```

```text
http.host eq "v8s.link" and
not http.request.method in {"GET" "HEAD" "OPTIONS"}
```

```text
http.host eq "v8s.link" and
not cf.client.bot and
not starts_with(http.request.uri.path, "/_stats") and
not starts_with(http.request.uri.path, "/_tests") and
http.request.uri.path ne "/robots.txt"
```

Utilisez l'editeur d'expression pour les regles imbriquees, collez et validez une expression complete a la fois, sauvegardez les regles desactivees pendant le calibrage, puis activez-les apres verification dans Security Events.

### Decider des controles de crawlers

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **AI Crawl Control** > **Signals** pour Managed `robots.txt`, puis **AI Crawl Control** > **Security** pour bloquer ou autoriser des crawlers precis.

Si le depot fournit `robots.txt`, gardez Cloudflare Managed robots.txt desactive. Cela fait du depot la source de verite et evite que Cloudflare ecrase des directives intentionnelles.

Reglages utiles :

- Autoriser `/robots.txt`
- Autoriser `/llms.txt` et `/llms-full.txt` seulement si vous publiez volontairement du contexte lisible par machine
- Bloquer les crawlers et assistants IA non desires dans Cloudflare
- Garder les crawlers de moteurs de recherche verifies autorises sauf si votre instance est volontairement privee
- Revoir Cloudflare Security Events apres activation, car le trafic bloque n'apparait pas dans les analytics Worker

Au minimum, laissez `/robots.txt` autorise pour que les crawlers puissent lire la politique publiee.

### Configurer Rules et URL normalization

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Rules** > **Settings** > **Managed Transforms** pour les transformations d'en-tetes, puis **Rules** > **Settings** > **URL Normalization** pour la normalisation des URL.

Reglages Rules recommandes :

| Reglage | Recommandation |
| --- | --- |
| Remove `X-Powered-By` response headers | On |
| Add visitor location headers | Off |
| Remove visitor IP headers | Off sauf si une origine derriere le Worker les recoit |
| Add security headers transform | Off si le Worker emet deja les en-tetes voulus |
| URL normalization type | Cloudflare |
| Normalize incoming URLs | On |
| Normalize URLs to origin | Off |

La normalisation des URLs entrantes est particulierement importante parce que WAF, Access et Workers evaluent l'URL normalisee. Gardez la normalisation vers l'origine inactive sauf si une autre origine derriere Cloudflare attend des chemins deja normalises.

### Configurer Network

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Network**.

Reglages Network recommandes :

| Reglage | Recommandation |
| --- | --- |
| IPv6 Compatibility | On |
| gRPC | Off |
| WebSockets | Off sauf si une page custom en a besoin |
| Pseudo IPv4 | Off |
| IP Geolocation | On |
| Maximum Upload Size | Plus bas defaut pratique du plan |
| Network Error Logging | On |
| Onion Routing | On |

### Garder le caching conservateur

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Caching** > **Configuration** pour les reglages generaux de cache, et **Caching** > **Cache Rules** si vous avez besoin d'une regle precise.

Gardez le caching sobre pour un redirecteur :

- Laissez les decisions de redirection dynamiques au Worker
- Laissez les assets statiques sous `build/` utiliser le Worker et les en-tetes d'assets
- Gardez Development Mode desactive sauf pendant un debogage actif
- N'ajoutez pas de regles de cache qui mettent les reponses de redirection en cache sans tester les etats de cycle de vie, les horaires, les analytics et les misses

### Consulter la bonne surface analytics

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Security** > **Analytics** pour les evenements WAF, bot et rate-limit, **Analytics** > **Workers** pour les metriques d'infrastructure Worker, et **DNS** > **Analytics** pour les diagnostics DNS.

Utilisez les analytics Cloudflare et Security Events pour les decisions d'infrastructure :

- Statut DNS, certificat et TLS
- Requetes Worker, erreurs, temps CPU, wall time et duree des requetes
- Evenements WAF, rate limiting, bot et crawler IA
- Decisions de connexion Access pour les chemins proteges

Utilisez les [Analytics](/fr/docs/customize/analytics/) serveur vanityURLs pour les evenements applicatifs comme pageviews, redirections, misses de liens courts, recherches expand et evenements bot normalises qui atteignent le Worker.

Le trafic bloque par WAF, AI Crawl Control, Access ou rate limiting n'atteint pas le Worker et doit etre consulte dans Cloudflare Security Events.

{{% /steps %}}
