---
aside: false
title: "Protection réseau"
description: "Configurer les réglages de domaine Cloudflare qui protègent une zone vanityURLs avant que le trafic atteigne le Worker."
---

La protection réseau couvre les réglages de domaine Cloudflare placés devant le Worker vanityURLs. Ces contrôles décident comment DNS, TLS, caching, trafic bot, trafic crawler, règles WAF et sécurité de zone se comportent avant qu'une requête consomme du CPU Worker ou du quota analytics.

Utilisez cette page pour les réglages sous la configuration de domaine Cloudflare : **AI Crawl Control**, **Analytics**, **Caching**, **DNS**, **Network**, **Rules**, **Security**, **SSL/TLS** et **WAF**.

## DNS

Pour le domaine court racine, préférez la ligne Worker Custom Domain créée par Cloudflare pour le Worker. Elle devrait apparaître comme un record Worker proxifié pour le hostname, comme `v8s.link -> v8s-link`.

Évitez de garder les anciens records synthétiques `AAAA 100::` pour le même hostname une fois le Custom Domain actif. Gardez les records mail, DKIM, DMARC, MTA-STS et vérification de propriété en DNS-only sauf exigence contraire du service.

Utilisez des records proxifiés séparés seulement pour de vrais sous-domaines web, comme `mta-sts`, `www` ou un site de documentation.

## SSL/TLS

Commencez avec ces réglages :

| Réglage | Recommandation |
| :--- | :--- |
| SSL/TLS mode | Full strict |
| Universal SSL | On |
| Always Use HTTPS | On |
| TLS 1.3 | On |
| Minimum TLS | 1.2 ou plus strict |
| Automatic HTTPS Rewrites | On |
| HSTS | On après que chaque hostname et sous-domaine de production soit prêt pour HTTPS |
| Certificate Transparency Monitoring | Optionnel, utile pour les alertes de certificats inattendus |

Activez HSTS seulement après que chaque hostname et sous-domaine de production soit prêt pour HTTPS. Un max age d'un mois est un bon premier réglage; incluez les sous-domaines et preload seulement quand toute la zone est volontairement HTTPS-only.

## Security

Les réglages de sécurité du plan gratuit doivent rester sobres et explicites. Activez les protections qui réduisent les abus courants, mais évitez les fonctionnalités qui modifient le contenu public ou exposent des données visiteur supplémentaires sans besoin clair.

| Réglage | Recommandation | Pourquoi |
| :--- | :--- | :--- |
| New application security dashboard | On | Utiliser la vue actuelle du tableau de bord pour les événements de sécurité et actions |
| Bot Fight Mode | On | Ajoute des challenges bot de base sur le plan gratuit |
| Browser Integrity Check | On | Bloque les requêtes navigateur malformées ou suspectes avant l'exécution du Worker |
| Challenge Passage | 30 minutes | Garde les challenges managés utiles sans rendre les visites légitimes répétées trop bruyantes |
| Cloudflare managed ruleset | On | Fournit une protection applicative de base maintenue par Cloudflare |
| Email Address Obfuscation | On si des pages publiques affichent des adresses courriel | Protège les adresses visibles sans modifier le contenu lisible par humain |
| Hotlink Protection | Off par défaut | Les assets du raccourcisseur sont petits; activez seulement si la réutilisation d'images hors site devient un vrai coût |
| Leaked Credentials Detection | Off sauf si l'application a un login par mot de passe | vanityURLs n'authentifie pas les visiteurs avec des mots de passe |
| Security.txt | Configurer avant release | Publie un chemin de contact pour les rapports de vulnérabilité |
| Replace insecure JavaScript libraries | On | Permet à Cloudflare de remplacer les bibliothèques vulnérables lorsque supporté |
| Schema Validation | Off sauf si des schémas API sont définis | Nécessite des endpoints et schémas actifs pour être utile |
| Zone IP allowlist rules | Off sauf si les chemins admin ont besoin d'une allowlist IP | Cloudflare Access est le contrôle principal pour les chemins privés |

N'activez pas les certificats client, règles mTLS, en-têtes de localisation visiteur ou en-têtes True-Client-IP pour le raccourcisseur public sauf si un service en aval en a explicitement besoin. Le Worker reçoit déjà les métadonnées pays et colo Cloudflare pour les analytics agrégés.

## WAF

Les règles de sécurité Cloudflare s'exécutent avant le Worker. Utilisez-les pour le trafic qui ne devrait jamais consommer du CPU Worker, puis gardez la blocklist Worker comme fallback applicatif.

Jeu de règles recommandé :

| Règle | Action | Notes |
| :--- | :--- | :--- |
| Bloquer les probes scanner | Block | Cible les chemins d'exploit courants comme `.php`, `/wp-`, `/.env` et probes admin |
| Bloquer les méthodes inattendues | Block | Autorise seulement `GET`, `HEAD` et `OPTIONS` pour le hostname public de redirection |
| Challenger les clients suspects | Managed Challenge | Exclut les bots vérifiés, `/_stats`, `/_tests`, les assets statiques et `robots.txt` |
| Bloquer les crawlers IA non désirés | Block | Exclut `/robots.txt`; cible les user agents de crawlers que vous ne voulez pas servir |
| Rate limiter les candidats de liens courts | Block ou challenge | Compte les misses répétés et candidats de type scanner, pas les redirections réussies |

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

Le rule builder visuel de Cloudflare peut rendre les expressions imbriquées difficiles à reproduire. Pour ces règles, utilisez l'éditeur d'expression pour l'expression finale, collez et validez une expression complète à la fois, sauvegardez les règles désactivées pendant le calibrage, puis activez-les après vérification dans Security Events.

## AI Crawl Control

Si le dépôt fournit `robots.txt`, gardez Cloudflare Managed robots.txt désactivé. Cela fait du dépôt la source de vérité et évite que Cloudflare écrase des directives intentionnelles.

Le fichier par défaut `defaults/public/robots.txt` interdit le crawling par défaut et autorise seulement les fichiers de politique/contexte comme `/robots.txt`, `/llms.txt` et `/llms-full.txt`. Ces fichiers existent pour décrire le logiciel et la surface déployée, pas pour annoncer l'inventaire des liens.

Utilisez AI Crawl Control ou une règle WAF sur user-agent lorsque vous voulez que Cloudflare bloque certains crawlers IA avant qu'ils atteignent le Worker. Reproduisez la même politique dans `robots.txt` pour la transparence, mais traitez `robots.txt` comme indicatif et la règle WAF comme enforcement.

Réglages utiles :

- Autoriser `/robots.txt`
- Autoriser `/llms.txt` et `/llms-full.txt` seulement si vous publiez volontairement du contexte lisible par machine
- Bloquer les crawlers et assistants IA non désirés dans Cloudflare
- Garder les crawlers de moteurs de recherche vérifiés autorisés sauf si votre instance est volontairement privée
- Revoir Cloudflare Security Events après activation, car le trafic bloqué n'apparaît pas dans les analytics Worker

Pour un domaine court privé, familial, d'équipe ou interne, il est raisonnable de bloquer toutes les familles de crawlers sauf celles que vous voulez explicitement. Ne comptez pas seulement sur `robots.txt`; utilisez ensemble Cloudflare AI Crawl Control, les règles WAF et la blocklist runtime.

Gardez la liste exacte de crawlers IA dans Cloudflare, pas dans la documentation publique, parce que les noms de crawlers et les choix de politique changent. Au minimum, laissez `/robots.txt` autorisé pour que les crawlers puissent lire la politique publiée.

## Rules

Réglages Rules recommandés :

| Réglage | Recommandation |
| :--- | :--- |
| Remove `X-Powered-By` response headers | On |
| Add visitor location headers | Off |
| Remove visitor IP headers | Off sauf si une origine derrière le Worker les reçoit |
| Add security headers transform | Off si le Worker émet déjà les en-têtes voulus |
| URL normalization type | Cloudflare |
| Normalize incoming URLs | On |
| Normalize URLs to origin | Off |

La normalisation des URLs entrantes est particulièrement importante parce que WAF, Access et Workers évaluent l'URL normalisée. Gardez la normalisation vers l'origine inactive sauf si une autre origine derrière Cloudflare attend des chemins déjà normalisés.

## Network

Réglages Network recommandés :

| Réglage | Recommandation |
| :--- | :--- |
| IPv6 Compatibility | On |
| gRPC | Off |
| WebSockets | Off sauf si une page custom en a besoin |
| Pseudo IPv4 | Off |
| IP Geolocation | On |
| Maximum Upload Size | Plus bas défaut pratique du plan |
| Network Error Logging | On |
| Onion Routing | On |

## Caching

Gardez le caching sobre pour un redirecteur :

- Laissez les décisions de redirection dynamiques au Worker
- Laissez les assets statiques sous `build/` utiliser le Worker et les en-têtes d'assets
- Gardez Development Mode désactivé sauf pendant un débogage actif
- N'ajoutez pas de règles de cache qui mettent les réponses de redirection en cache sans tester les états de cycle de vie, les horaires, les analytics et les misses

## Analytics

Utilisez les analytics Cloudflare et Security Events pour les décisions d'infrastructure :

- Statut DNS, certificat et TLS
- Requêtes Worker, erreurs, temps CPU, wall time et durée des requêtes
- Événements WAF, rate limiting, bot et crawler IA
- Décisions de connexion Access pour les chemins protégés

Utilisez les [Analytics](/fr/docs/analytics/) serveur vanityURLs pour les événements applicatifs comme pageviews, redirections, misses de liens courts, recherches expand et événements bot normalisés qui atteignent le Worker.

Le trafic bloqué par WAF, AI Crawl Control, Access ou rate limiting n'atteint pas le Worker et doit être consulté dans Cloudflare Security Events, pas dans Umami ou Fathom.
