---
aside: false
title: "Protection reseau"
description: "Reglages Cloudflare DNS, TLS, WAF, crawlers, caching et analytics qui protegent une zone vanityURLs avant que le trafic atteigne le Worker."
weight: 100
aliases:
  - /docs/reference/cloudflare-network-protection/

---

La protection reseau couvre les reglages de domaine Cloudflare places devant le Worker vanityURLs.

Utilisez cette reference pour les reglages sous la configuration de domaine Cloudflare : **AI Crawl Control**, **Analytics**, **Caching**, **DNS**, **Network**, **Rules**, **Security**, **SSL/TLS** et **WAF**. Utilisez [Protection reseau](/fr/docs/customize/network-protection/) pour le flux de configuration et [Ajouter des couches de protection Cloudflare autour d'un domaine court](/fr/blog/layering-cloudflare-protection-around-a-short-link-domain/) pour le raisonnement.

## Capture par defaut

La capture brute du tableau de bord Cloudflare se trouve dans [data/cloudflare-protection-defaults.json](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json). Elle a ete prise depuis une nouvelle zone `a6z.link` sur le plan Free, puis documentee comme `v8s.link` afin de garder les exemples alignes avec l'instance de demo.

Utilisez la capture pour suivre les changements de menus Cloudflare, mais documentez seulement les reglages qui affectent un operateur vanityURLs :

| Surface Cloudflare | A documenter sur le site |
| --- | --- |
| AI Crawl Control > Overview et Signals | Garder Managed robots.txt desactive quand le depot fournit `robots.txt`; confirmer que `/robots.txt` retourne `200 OK`; garder le depot comme source de verite. |
| AI Crawl Control > Security | Traiter les interrupteurs de blocage des crawlers comme controles edge optionnels, pas comme exigences de configuration par defaut. |
| Analytics > Workers | Utiliser pour le volume de requetes d'infrastructure cote Cloudflare, les erreurs, le temps CPU, le wall time et la duree. |
| Analytics > Dashboards, Web analytics et Performance | Mentionner seulement comme surfaces de revue optionnelles; vanityURLs ne requiert pas Cloudflare RUM ni Argo Smart Routing. |
| DNS > Records et Settings | Documenter le record Worker apex, les records de politique courriel en DNS-only et DNSSEC quand la delegation registrar est prete. |
| Email | Ne pas documenter Cloudflare Email Routing, DMARC Management ou Email Security comme exigences du redirecteur. |
| SSL/TLS > Overview et Edge Certificates | Documenter les reglages de production vises, pas l'etat capture : Full strict, Universal SSL, TLS 1.3, Automatic HTTPS Rewrites, TLS minimum 1.2 ou plus strict, et HSTS apres que les hostnames soient prets pour HTTPS. |
| Valeurs de metriques capturees | Ne pas documenter les zeros d'une zone inactive ni les comptes par crawler comme des valeurs par defaut. |

## DNS

Pour le domaine court racine, preferez la ligne Worker Custom Domain creee par Cloudflare pour le Worker. Elle devrait apparaitre comme un record Worker proxifie pour le hostname, comme `v8s.link -> v8s-link`.

Evitez de garder les anciens records synthetiques `AAAA 100::` pour le meme hostname une fois le Custom Domain actif. Gardez les records mail, DKIM, DMARC, MTA-STS et verification de propriete en DNS-only sauf exigence contraire du service.

Utilisez des records proxifies separes seulement pour de vrais sous-domaines web, comme `mta-sts`, `www` ou un site de documentation.

## SSL/TLS

Commencez avec ces reglages :

| Reglage | Recommandation |
| --- | --- |
| SSL/TLS mode | Full strict |
| Universal SSL | On |
| Always Use HTTPS | On |
| TLS 1.3 | On |
| Minimum TLS | 1.2 ou plus strict |
| Automatic HTTPS Rewrites | On |
| HSTS | On apres que chaque hostname et sous-domaine de production soit pret pour HTTPS |
| Certificate Transparency Monitoring | Optionnel, utile pour les alertes de certificats inattendus |

Activez HSTS seulement apres que chaque hostname et sous-domaine de production soit pret pour HTTPS. Un max age d'un mois est un bon premier reglage; incluez les sous-domaines et preload seulement quand toute la zone est volontairement HTTPS-only.

## Security

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

## WAF

Les regles de securite Cloudflare s'executent avant le Worker. Utilisez-les pour le trafic qui ne devrait jamais atteindre le code applicatif.

Jeu de regles recommande :

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

## AI Crawl Control

Si le depot fournit `robots.txt`, gardez Cloudflare Managed robots.txt desactive. Cela fait du depot la source de verite et evite que Cloudflare ecrase des directives intentionnelles.

Reglages utiles :

- Autoriser `/robots.txt`
- Autoriser `/llms.txt` et `/llms-full.txt` seulement si vous publiez volontairement du contexte lisible par machine
- Bloquer les crawlers et assistants IA non desires dans Cloudflare
- Garder les crawlers de moteurs de recherche verifies autorises sauf si votre instance est volontairement privee
- Revoir Cloudflare Security Events apres activation, car le trafic bloque n'apparait pas dans les analytics Worker

Au minimum, laissez `/robots.txt` autorise pour que les crawlers puissent lire la politique publiee.

## Rules

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

## Network

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

## Caching

Gardez le caching sobre pour un redirecteur :

- Laissez les decisions de redirection dynamiques au Worker
- Laissez les assets statiques sous `build/` utiliser le Worker et les en-tetes d'assets
- Gardez Development Mode desactive sauf pendant un debogage actif
- N'ajoutez pas de regles de cache qui mettent les reponses de redirection en cache sans tester les etats de cycle de vie, les horaires, les analytics et les misses

## Analytics

Utilisez les analytics Cloudflare et Security Events pour les decisions d'infrastructure :

- Statut DNS, certificat et TLS
- Requetes Worker, erreurs, temps CPU, wall time et duree des requetes
- Evenements WAF, rate limiting, bot et crawler IA
- Decisions de connexion Access pour les chemins proteges

Utilisez les [Analytics](/fr/docs/customize/analytics/) serveur vanityURLs pour les evenements applicatifs comme pageviews, redirections, misses de liens courts, recherches expand et evenements bot normalises qui atteignent le Worker.

Le trafic bloque par WAF, AI Crawl Control, Access ou rate limiting n'atteint pas le Worker et doit etre consulte dans Cloudflare Security Events.
