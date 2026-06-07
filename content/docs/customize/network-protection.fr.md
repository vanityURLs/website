---
aside: false
title: "Protection réseau"
description: "Configurer les contrôles de domaine Cloudflare qui protegent une zone vanityURLs avant que le trafic atteigne le Worker."
weight: 70
aliases:
  - /docs/network-protection/
  - /docs/référence/network-protection/
  - /docs/référence/cloudflare-network-protection/
---

Utilisez cette page lorsque vous êtes prêt a configurér les contrôles Cloudflare devant le Worker. La protection réseau garde les abus courants, les methodes inattendues, les probes de scanners, les crawlers non désirés et le bruit d'infrastructure loin du code applicatif.

Préférez le starter Terraform dans [`terraform/cloudflare-baseline`](https://github.com/vanityURLs/website/tree/main/terraform/cloudflare-baseline) pour une configuration répétable. Il couvre la base Access, la règle de redirection `Redirect www to apex`, la limite `Rate limit short-link candidates`, ainsi que les règles WAF `Block scanner probes`, `Block unexpected methods`, `Challenge suspicious clients` et `Block unwanted AI crawlers`. Utilisez les étapes du tableau de bord ci-dessous comme checklist lisible et fallback pour les réglages qui demandent encore une revue visuelle.

Pour le raisonnement de sécurité par couches, lisez [Ajouter des couches de protection Cloudflare autour d'un domaine court](/fr/blog/layering-cloudflare-protection-around-a-short-link-domain/). La capture brute du tableau de bord Cloudflare se trouve dans [data/cloudflare-protection-defaults.json](/fr/blog/layering-cloudflare-protection-around-a-short-link-domain/); utilisez-la pour suivre les changements de menus Cloudflare, pas comme checklist opérateur.

Pour les fonctionnalites volontairement exclues du setup par défaut, lisez [Fonctionnalités Cloudflare à ne pas activer par défaut](/fr/blog/cloudflare-features-not-to-enable-by-default/).

{{< mermaid >}}
flowchart LR
A["Requête visiteur"] --> B["Edge Cloudflare"]
B --> C["TLS, DDoS,<br/>règles managées"]
C --> D["WAF, rate limit,<br/>contrôles bot"]
D --> E{"Autorisé à<br/>atteindre le Worker ?"}
E -->|"non"| F["Réponse bloquée,<br/>challenge ou rate limit"]
E -->|"oui"| G["Worker vanityURLs"]
G --> H["Rediriger un lien court"]
G --> I["Page locale publique"]
G --> J["Chemin protégé<br/>vers le tableau"]
{{< /mermaid >}}

{{% steps %}}

### Confirmer le domaine custom du Worker

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **DNS** > **Records**. Utilisez le record Worker Custom Domain que Cloudflare crée pour le domaine court. Il devrait apparaitre comme un record Worker proxifie pour le hostname, par exemple `v8s.link -> v8s-link`.

Supprimez les anciens records synthetiques `AAAA 100::` pour le même hostname une fois le Custom Domain actif. Gardez les records mail, DKIM, DMARC, MTA-STS et verification de propriété en DNS-only sauf si le fournisseur exige explicitement le proxy.

Utilisez le hostname apex comme seul hostname Worker vanityURLs. Si vous publiez `www`, créez un record DNS proxifie pour `www` et redirigez-le vers l'apex dans Cloudflare avant le Worker. Utilisez des records proxifies séparés seulement pour de vrais sous-domaines web, comme `mta-sts` ou un site de documentation.

### Rediriger www vers l'apex

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Rules**. Préférez **Redirect Rules** lorsque disponible. Si votre zone utilise déjà les **Page Rules** legacy, une seule règle forwarding URL convient aussi pour cette canonicalisation de hostname parce qu'elle s'exécute avant le Worker et reste hors du registre de liens vanityURLs.

Configurez la redirection avec ces valeurs :

| Champ       | Valeur                      |
| ----------- | --------------------------- |
| Nom         | `Redirect www to apex`      |
| Source      | `www.v8s.link/*`            |
| Destination | `https://v8s.link/$1`       |
| Statut      | `301 - Permanent Redirect`  |
| Ordre       | Avant Worker/WAF evaluation |

Gardez le record DNS `www` proxifie pour que Cloudflare recoive la requête et applique la redirection. N'ajoutez pas `www` au domaine custom du Worker ni aux expressions WAF/rate-limit ci-dessous sauf si vous servez volontairement le Worker sur les deux hostnames.

### Etablir la base HTTPS

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **SSL/TLS** > **Overview**. Dans **Configure encryption mode**, selectionnez **Custom SSL/TLS**, choisissez **Full (Strict)**, puis sauvegardez. Cloudflare peut afficher **Automatic SSL/TLS (default)** avec un mode courant comme **Flexible** avant ce changement; c'est l'état a remplacer pour un domaine custom Worker en production.

Ensuite, ouvrez **SSL/TLS** > **Edge Certificates** et parcourez les options dans l'ordre du tableau de bord :

| Option du tableau de bord             | Recommandation                                                                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Manage Edge Certificates              | Confirmer qu'un certificat Universal actif couvre le domaine apex et le wildcard, comme `v8s.link` et `*.v8s.link`               |
| Advanced Certificate Manager          | Aucune action sauf si l'instance a besoin des contrôles de certificats custom payants                                            |
| Total TLS                             | Aucune action pour la base du plan gratuit; requiert Advanced Certificate Manager                                                |
| Cipher suites                         | Aucune action pour la base du plan gratuit; requiert Advanced Certificate Manager                                                |
| Always Use HTTPS                      | On                                                                                                                               |
| HTTP Strict Transport Security (HSTS) | Laisser le HSTS du tableau de bord Cloudflare désactivé sauf besoin volontaire d'une politique de zone au-delà du header du repo |
| Minimum TLS Version                   | TLS 1.2 ou plus strict                                                                                                           |
| Opportunistic Encryption              | On convient; aucune action spécifique a vanityURLs                                                                               |
| TLS 1.3                               | On                                                                                                                               |
| Automatic HTTPS Rewrites              | On                                                                                                                               |
| Certificate Transparency Monitoring   | Optionnel, utile pour les alertes de certificats inattendus                                                                      |
| Disable Universal SSL                 | Ne cliquez pas dessus; voir cette action signifie que Universal SSL est actuellement active                                      |

{{< callout type="warning" title="HSTS peut sembler actif sans l'être" >}}
HSTS est l'endroit le plus facile a mal lire dans l'interface. Le dépôt fournit un header `Strict-Transport-Security: max-age=31536000` limité à l'hôte pour les réponses Worker et assets statiques. Préférez ce header géré par le repo comme source de vérité. Activez le HSTS du tableau de bord Cloudflare seulement si vous voulez délibérément que Cloudflare possède ou renforce la politique sur toute la zone. Utilisez `includeSubDomains` et **Preload** seulement quand toute la zone est volontairement HTTPS-only.
{{< /callout >}}

{{< callout type="warning" title="Éviter les sources d'en-têtes concurrentes" >}}
Gardez CSP, HSTS, framing, referrer policy et permissions policy dans le dépôt sauf raison explicite de gérer l'une de ces politiques au niveau de la zone Cloudflare. Si Cloudflare Transform Rules, Snippets, Zaraz, Rocket Loader, HSTS géré ou d'autres fonctions du tableau de bord ajoutent ou réécrivent les mêmes en-têtes, ou injectent des scripts, elles peuvent entrer en conflit avec la politique du Worker et de `_headers`.

Cela suit [ADR 0014 : Prefer repository-owned configuration](https://github.com/vanityURLs/code/blob/main/docs/adr/0014-prefer-repository-owned-configuration.md) : utilisez le tableau de bord Cloudflare pour les contrôles qui ne peuvent pas raisonnablement vivre dans Git, et laissez les doublons du tableau de bord désactivés lorsque le dépôt possède déjà le comportement.
{{< /callout >}}

### Activer les contrôles de sécurité de base

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Security** > **Settings** pour le tableau de bord, les bots, Browser Integrity Check, Challenge Passage, les réécritures de contenu et `security.txt`. La page Settings est longue et inclut des filtres ainsi qu'un champ de recherche. Ils sont utiles pour retrouver un réglage connu, mais cette checklist suit l'ordre de la page parce que les filtres cachent le contexte et rendent l'audit plus difficile. Les expressions custom sont couvertes dans **Ajouter les règles WAF** ci-dessous.

Les réglages de sécurité du plan gratuit doivent rester sobres et explicites. Activez les protections qui réduisent les abus courants, mais évitez les fonctionnalites qui modifient le contenu public ou exposent des données visiteur supplémentaires sans besoin clair.

| Reglage, dans l'ordre du tableau de bord | Recommandation                                                | Pourquoi                                                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AI Labyrinth                             | Off                                                           | Modifie volontairement les pages pour les bots; gardez les pages publiques de redirection et de politiques détérministes                                                       |
| Block AI bots                            | Block on all pages                                            | Bloque les crawlers d'entrainement IA sur toute la zone sans maintenir une liste custom de user agents                                                                         |
| Bot Fight Mode                           | On, configuration par défaut                                  | Le contrôle du plan gratuit est on/off; il n'y a pas d'options par règle a ajuster                                                                                             |
| Browser Integrity Check                  | On, configuration par défaut                                  | Bloque les requêtes navigateur malformees ou suspectes avant l'execution du Worker                                                                                             |
| Challenge Passage                        | 30 minutes                                                    | Garde les challenges manages utiles sans rendre les visites legitimes repétées trop bruyantes                                                                                  |
| Cloudflare Managed Free Ruleset          | On                                                            | Cloudflare maintient et met à jour ce ruleset gratuit; c'est une couverture générique, pas une posture propre a vanityURLs                                                     |
| Continuous script monitoring             | Off pour l'instance par défaut                                | La base utilise des scripts même origine, fingerprintés, avec CSP et SRI. Activez l'inventaire seulement après ajout volontaire de scripts tiers                               |
| Custom fallthrough rules                 | Aucune règle par défaut                                       | Necessaire seulement si vous voulez délibérément une règle fallback pour le trafic non matche                                                                                  |
| Email Address Obfuscation                | Off                                                           | Cloudflare réécrit les adresses courriel correspondantes et peut injecter du code helper; gardez les pages générées, la CSP et les hashes SRI déterministes                    |
| HTTP DDoS attack protection              | On, toujours actif                                            | La protection HTTP DDoS geree par Cloudflare s'execute independamment du Worker                                                                                                |
| Manage your robots.txt                   | Désactiver la configuration `robots.txt` geree par Cloudflare | Le dépôt fournit `defaults/public/robots.txt`; gardez le dépôt comme source de vérité au lieu de laisser Cloudflare le remplacer par la sortie Content Signals Policy          |
| Network-layer DDoS attack protection     | On, toujours actif                                            | La mitigation DDoS réseau de base est geree à l'edge Cloudflare                                                                                                                |
| Replace insecure JavaScript libraries    | Off                                                           | La base utilise du JavaScript auto-hébergé et fingerprinté avec SRI; ne laissez pas Cloudflare réécrire les URLs ou octets des scripts sauf si vous abandonnez ces hashes repo |
| Security level                           | Laisser **I'm Under Attack Mode** désactive                   | A utiliser seulement pendant un incident actif; trop disruptif comme base normale de redirecteur                                                                               |
| Security.txt                             | Laisser le Security.txt du tableau de bord Cloudflare off     | Le dépôt génère et déploie `/.well-known/security.txt`; gardez ce fichier et les pages footer/sécurité dans une seule source de vérité                                         |
| SSL/TLS DDoS attack protection           | On, toujours actif                                            | La mitigation DDoS de couche TLS est geree par Cloudflare                                                                                                                      |

{{< details title="Reglages de sécurité sans action pour un redirecteur par défaut" >}}

| Reglage                            | Decision de base                                                                                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Client certificates                | Ne pas configurer pour le redirecteur public sauf si une future origine/API exige mTLS                                                                                               |
| Endpoint Labels                    | Aucune action; cela appartient à l'organisation des endpoints API Shield, et le redirecteur n'expose pas d'API opérateur                                                             |
| Hotlink Protection                 | Off; les assets du raccourcisseur sont petits, et la réutilisation d'images hors site n'est pas un comportement produit                                                              |
| IP access rules                    | Aucune action; préférez des custom rules précises ou Cloudflare Access plutôt que de larges règles IP                                                                                |
| IP lists                           | Aucune action sauf si des règles WAF custom ont besoin d'ensembles IP réutilisables                                                                                                  |
| Leaked Credentials Détéction       | Off sauf si l'application ajoute un login par mot de passe; vanityURLs n'authentifie pas les visiteurs avec des mots de passe                                                        |
| mTLS rules                         | Aucune action pour un redirecteur public Worker-only                                                                                                                                 |
| Rate limit authentication requests | Aucune règle par défaut; les chemins privés sont protégés par Cloudflare Access SSO, pas par un endpoint de mot de passe dans le redirecteur                                         |
| Schema Validation                  | Aucune action sauf si des schémas API explicites sont ajoutes                                                                                                                        |
| User agent blocking                | Aucune règle par défaut; utilisez-le seulement pour un client agressif précis, et préférez d'abord les contrôles bot manages ou les règles WAF                                       |
| Web asset discovery                | Aucune action; laisser la decouverte visible est correct, mais cela ne change pas le comportement de redirection                                                                     |
| Zone lockdown                      | Aucune action pour la base du plan gratuit; Cloudflare documente Zone Lockdown comme réserve aux plans payants et recommande les custom rules pour un comportement de type allowlist |

{{< /details >}}

{{< callout type="warning" title="Éviter les données visiteur et la complexité mTLS inutiles" >}}
N'activez pas les certificats client, règles mTLS, en-têtes de localisation visiteur ou en-têtes True-Client-IP pour le raccourcisseur public sauf si un service en aval en a explicitement besoin. Le Worker recoit déjà les metadonnées pays et colo Cloudflare pour les analytics agreges.
{{< /callout >}}

Cloudflare déplace regulierement les libellés du tableau de bord. Consultez le [changelog Cloudflare Docs](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) et les changelogs produit, surtout [Rules](/fr/blog/cloudflare-features-not-to-enable-by-default/) et les contrôles bot, lors de la mise à jour de cette page. Utilisez la capture brute dans [data/cloudflare-protection-defaults.json](https://developers.cloudflare.com/changelog/) pour comparer les libellés de menus dans le temps.

### Ajouter les règles WAF

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Security** > **Security rules** > **Security rules**. Pour ajouter une custom rule, utilisez **Create rule** ou le menu **Show all rule types**, choisissez **Custom rules**, entrez le nom de la règle, cliquez **Edit expression**, collez une expression, choisissez l'action, puis déployéz. Pour le rate limiting, utilisez plutôt la rangee **Rate limiting rules**.

Les règles de sécurité Cloudflare s'executent avant le Worker. Utilisez-les pour le trafic qui ne devrait jamais atteindre le code applicatif.

Les expressions ci-dessous utilisent `v8s.link` et ciblent volontairement seulement le hostname apex. Redirigez `www.v8s.link` vers l'apex avant le Worker au lieu d'ajouter `www` à chaque règle Worker, WAF et rate-limit. Un CNAME DNS alias un hostname; il ne crée pas une redirection HTTP par lui-même.

Pour la règle de rate limiting du plan gratuit, utilisez **Rate limit short-link candidates** comme nom de règle, **IP** comme caractéristique, **20 requêtes** par **10 secondes**, **Block** comme action, **10 secondes** comme durée, et **First** comme ordre. L'expression exclut la page `/lookup` mais pas `/lookup/resolve`, donc la résolution lookup reste couverte par l'unique règle de rate limiting disponible.

<table class="waf-rules-table">
  <thead>
    <tr>
      <th>Regle</th>
      <th>Action</th>
      <th>Expression</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Rate limiter les candidats de liens courts<br><small>Rate limiting rule</small></td>
      <td>Caractéristique : IP<br>Seuil : 20 requêtes par 10 secondes<br>Action : Block<br>Durée : 10 secondes<br>Ordre : First</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
not cf.client.bot and
not starts_with(http.request.uri.path, "/_stats") and
not starts_with(http.request.uri.path, "/_tests") and
not starts_with(http.request.uri.path, "/_analytics") and
not http.request.uri.path in {"/" "/index" "/lookup" "/privacy" "/terms" "/abuse" "/security" "/404" "/expired" "/disabled" "/maintenance" "/security.txt" "/.well-known/security.txt" "/robots.txt" "/favicon.svg"} and
not lower(http.request.uri.path) contains ".css" and
not lower(http.request.uri.path) contains ".js" and
not lower(http.request.uri.path) contains ".png" and
not lower(http.request.uri.path) contains ".svg" and
not lower(http.request.uri.path) contains ".ico" and
not lower(http.request.uri.path) contains ".txt" and
not lower(http.request.uri.path) contains ".webmanifest" and
not lower(http.request.uri.path) contains ".woff"</code></pre>
      </td>
      <td>Créez cette règle en premier. Elle compte les candidats probables de liens courts et les requêtes de résolution lookup tout en excluant les chemins opérateur, pages de politiques, fichiers well-known, la page lookup, les beacons analytics et les assets statiques. Sur les plans avec une seule règle de rate limiting, utilisez cette règle comme base.</td>
    </tr>
    <tr>
      <td>Rate limiter la résolution lookup<br><small>Rate limiting rule</small></td>
      <td>Block pendant 60 secondes quand le taux depasse 30 requêtes par minute</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
http.request.method eq "POST" and
http.request.uri.path eq "/lookup/resolve" and
not cf.client.bot</code></pre>
      </td>
      <td>`/lookup/resolve` est exact-match seulement et ne retourne aucune liste, mais il peut révéler des destinations pour des slugs devinés. Ajoutez cette règle plus stricte seulement lorsque votre plan Cloudflare permet plusieurs règles de rate limiting.</td>
    </tr>
    <tr>
      <td>Rate limiter les analytics lookup<br><small>Rate limiting rule</small></td>
      <td>Block pendant 60 secondes quand le taux depasse 60 requêtes par minute</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
http.request.method eq "POST" and
http.request.uri.path eq "/_analytics/lookup" and
not cf.client.bot</code></pre>
      </td>
      <td>Protège le quota Umami/Fathom contre l'abus direct du beacon. Cet endpoint ne résout pas les liens; il enregistre seulement l'activité lookup qui atteint le Worker.</td>
    </tr>
    <tr>
      <td>Bloquer les probes scanner<br><small>Custom rule</small></td>
      <td>Block</td>
      <td>
        <pre><code>http.host eq "v8s.link" and (
  ends_with(lower(http.request.uri.path), ".php") or
  lower(http.request.uri.path) contains "/wp-content/" or
  lower(http.request.uri.path) contains "/wp-includes/" or
  lower(http.request.uri.path) contains "/wp-admin/" or
  lower(http.request.uri.path) contains "/wp-" or
  lower(http.request.uri.path) contains "wp-login.php" or
  lower(http.request.uri.path) contains "xmlrpc.php" or
  lower(http.request.uri.path) contains ".env" or
  lower(http.request.uri.path) contains "phpinfo" or
  lower(http.request.uri.path) contains "/vendor/" or
  lower(http.request.uri.path) contains "/.git" or
  lower(http.request.uri.path) contains "/cgi-bin/"
)</code></pre>
      </td>
      <td>Bloque les probes courantes PHP, WordPress, fichiers d'environnement, dependances, Git et CGI.</td>
    </tr>
    <tr>
      <td>Bloquer les methodes inattendues<br><small>Custom rule</small></td>
      <td>Block</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
not http.request.method in {"GET" "HEAD" "OPTIONS"} and
not (
  http.request.method eq "POST" and
  http.request.uri.path in {"/lookup/resolve" "/_analytics/lookup"}
)</code></pre>
      </td>
      <td>Autorise seulement les methodes attendues par le hostname public de redirection, plus les deux endpoints POST publics de lookup.</td>
    </tr>
    <tr>
      <td>Challenger les clients suspects<br><small>Custom rule</small></td>
      <td>Managed Challenge</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
not cf.client.bot and
not starts_with(http.request.uri.path, "/_stats") and
not starts_with(http.request.uri.path, "/_tests") and
(
  lower(http.user_agent) contains "curl" or
  lower(http.user_agent) contains "wget" or
  lower(http.user_agent) contains "python-requests" or
  lower(http.user_agent) contains "go-http-client" or
  lower(http.user_agent) contains "httpclient"
)</code></pre>
      </td>
      <td>Challenge les user agents de scripts et clients HTTP courants sans challenger tous les navigateurs ordinaires non verifies.</td>
    </tr>
    <tr>
      <td>Bloquer les crawlers IA non désirés<br><small>Custom rule</small></td>
      <td>Block</td>
      <td>
        <pre><code>http.host eq "v8s.link" and
http.request.uri.path ne "/robots.txt" and (
  lower(http.user_agent) contains "applebot" or
  lower(http.user_agent) contains "archive.org_bot" or
  lower(http.user_agent) contains "arquivo-web-crawler" or
  lower(http.user_agent) contains "bingbot" or
  lower(http.user_agent) contains "chatgpt-user" or
  lower(http.user_agent) contains "duckassistbot" or
  lower(http.user_agent) contains "googlebot" or
  lower(http.user_agent) contains "manus-user" or
  lower(http.user_agent) contains "meta-externalfetcher" or
  lower(http.user_agent) contains "mistralai-user" or
  lower(http.user_agent) contains "oai-searchbot" or
  lower(http.user_agent) contains "perplexity-user" or
  lower(http.user_agent) contains "perplexitybot" or
  lower(http.user_agent) contains "proratainc" or
  lower(http.user_agent) contains "terracotta"
)</code></pre>
      </td>
      <td>Blocklist de crawlers agressive. Retirez les crawlers de moteurs de recherche comme `googlebot` et `bingbot` si l'indexation publique est importante.</td>
    </tr>
  </tbody>
</table>

Collez et validez une expression complété à la fois. Deployer les règles désactivées pendant le calibrage si du trafic circule déjà, puis activez-les après verification dans Security Events.

{{< callout type="note" title="Lookup est public, pas un inventaire" >}}
La page lookup et l'endpoint `/lookup/resolve` permettent volontairement à un visiteur d'inspecter un slug exact avant de cliquer. Ils ne listent pas les liens et n'autocomplètent pas les slugs, et les headers livrés `X-Frame-Options: DENY` plus `frame-ancestors 'none'` empêchent le clickjacking. Le risque restant est le guessing en volume depuis des scripts; protégez donc `/lookup/resolve` et `/_analytics/lookup` avec des rate limits explicites.
{{< /callout >}}

### Decider des contrôles de crawlers

Dans Cloudflare, utilisez **Domains** > **votre domaine court** > **AI Crawl Control** pour les contrôles spécifiques aux crawlers. C'est séparé du contrôle large **Security** > **Settings** > **Block AI bots** couvert plus haut.

Utilisez **AI Crawl Control** > **Security** pour bloquer des crawlers nommes et configurer la réponse aux crawlers bloques. Si vous utilisez cette page, règlez les chemins autorises de la réponse de blocage sur :

- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`
- `/.well-known/*`

Laissez `/mcp` et `/ads.txt` désactifs sauf si l'instance publie volontairement ces fichiers. Garder `/.well-known/*` autorise est important parce que vanityURLs publie le contact de divulgation sécurité a `/.well-known/security.txt`.

{{< callout type="warning" title="Gardez le robots.txt du dépôt comme autorité" >}}
Utilisez **AI Crawl Control** > **Signals** pour surveiller la conformité des crawlers. Gardez **Managed robots.txt** désactive lorsque le dépôt fournit `robots.txt`; sinon Cloudflare peut remplacer le fichier visible a `/robots.txt`. Le fichier vanityURLs par défaut est :
{{< /callout >}}

```text
User-agent: *
Disallow: /

Allow: /robots.txt
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /en/_stats/
Disallow: /*/_stats/
Disallow: /lookup/
```

La page Signals devrait afficher `/robots.txt` comme accessible avec `200 OK`. Utilisez **Agent Readiness** et **Robots.txt violations** comme surfaces de suivi, pas comme source de vérité du contenu du fichier.

### Configurer Rules et URL normalization

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Rules** > **Settings**. Revoyez **Managed Transforms**, **Bulk Redirects** et **URL Normalization**.

Reglages Rules recommandes :

| Categorie          | Reglage                                | Recommandation                                                                                                                                                                                                                             |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Managed Transforms | Remove `X-Powered-By` response headers | On comme defense en profondeur; Cloudflare ne semble pas l'activer par défaut, et vanityURLs n'émet pas intentionnellement `X-Powered-By`                                                                                                  |
| Managed Transforms | Add visitor location headers           | Off; Umami et Fathom n'ont pas besoin des en-têtes ville/latitude/longitude de Cloudflare, et les ajouter augmente l'exposition des données de localisation                                                                                |
| Managed Transforms | Remove visitor IP headers              | Off sauf si une origine derrière le Worker les recoit                                                                                                                                                                                      |
| Managed Transforms | Add security headers transform         | Off par défaut; vanityURLs contrôle ses en-têtes dans le Worker et les fichiers `_headers` du dépôt, et le transform Cloudflare ajoute un ensemble fixe qui peut ne pas correspondre à la politique applicative                            |
| Bulk Redirects     | Bulk Redirect Lists                    | Aucune action pour vanityURLs base sur Worker; utile pour de grandes listes statiques, mais contourne le cycle de vie du registre, les analytics, les pages de consultation, les horaires, les splats et le workflow de publication locale |
| URL Normalization  | URL normalization type                 | Cloudflare                                                                                                                                                                                                                                 |
| URL Normalization  | Normalize incoming URLs                | On, utilisé par Access, les règles WAF et Workers                                                                                                                                                                                          |
| URL Normalization  | Normalize URLs to origin               | Off                                                                                                                                                                                                                                        |

### Configurer Network

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Network**.

Reglages Network recommandes :

| Reglage               | Recommandation                          |
| --------------------- | --------------------------------------- |
| IPv6 Compatibility    | On                                      |
| gRPC                  | Off                                     |
| WebSockets            | Off sauf si une page custom en a besoin |
| Pseudo IPv4           | Off                                     |
| IP Geolocation        | On                                      |
| Maximum Upload Size   | Plus bas défaut pratique du plan        |
| Network Error Logging | On                                      |
| Onion Routing         | On                                      |

### Garder le caching conservateur

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Caching** > **Configuration** pour les réglages generaux de cache, puis **Caching** > **Cache Rules** pour confirmer qu'aucune règle de cache n'existe.

Gardez le caching sobre pour un redirecteur :

- Laissez les décisions de redirection dynamiques au Worker
- Laissez les assets statiques sous `build/` utiliser le Worker et les en-têtes d'assets
- Gardez Development Mode désactive sauf pendant un debogage actif
- Ne creez pas de Cache Rules ni de Cache Response Rules pour le baseline
- Si des Cache Rules ou Cache Response Rules existent, désactivez-les ou supprimez-les avant la mise en production

{{% /steps %}}
