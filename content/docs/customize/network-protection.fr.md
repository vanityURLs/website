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

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Security** > **Settings** pour le tableau de bord, les bots, Browser Integrity Check, Challenge Passage, le remplacement de bibliotheques et `security.txt`. La page Settings est longue et inclut des filtres ainsi qu'un champ de recherche. Ils sont utiles pour retrouver un reglage connu, mais cette checklist suit l'ordre de la page parce que les filtres cachent le contexte et rendent l'audit plus difficile. Les expressions custom sont couvertes dans **Ajouter les regles WAF** ci-dessous.

Les reglages de securite du plan gratuit doivent rester sobres et explicites. Activez les protections qui reduisent les abus courants, mais evitez les fonctionnalites qui modifient le contenu public ou exposent des donnees visiteur supplementaires sans besoin clair.

| Reglage, dans l'ordre du tableau de bord | Recommandation | Pourquoi |
| --- | --- | --- |
| AI Labyrinth | Off | Modifie volontairement les pages pour les bots; gardez les pages publiques de redirection et de politiques deterministes |
| Block AI bots | Block on all pages | Bloque les crawlers d'entrainement IA sur toute la zone sans maintenir une liste custom de user agents |
| Bot Fight Mode | On, configuration par defaut | Le controle du plan gratuit est on/off; il n'y a pas d'options par regle a ajuster |
| Browser Integrity Check | On, configuration par defaut | Bloque les requetes navigateur malformees ou suspectes avant l'execution du Worker |
| Challenge Passage | 30 minutes | Garde les challenges manages utiles sans rendre les visites legitimes repetees trop bruyantes |
| Cloudflare Managed Free Ruleset | On | Cloudflare maintient et met a jour ce ruleset gratuit; c'est une couverture generique, pas une posture propre a vanityURLs |
| Continuous script monitoring | Off pour l'instance par defaut | Les pages generees chargent un seul script local pour le confort de l'interface; activez seulement apres l'ajout de scripts tiers ou si vous voulez des alertes d'inventaire |
| Custom fallthrough rules | Aucune regle par defaut | Necessaire seulement si vous voulez deliberement une regle fallback pour le trafic non matche |
| Email Address Obfuscation | On | Sans regle correspondante, c'est inoffensif; utile si les pages publiques generees affichent des adresses de role |
| HTTP DDoS attack protection | On, toujours actif | La protection HTTP DDoS geree par Cloudflare s'execute independamment du Worker |
| Manage your robots.txt | Desactiver la configuration `robots.txt` geree par Cloudflare | Le depot fournit `defaults/public/robots.txt`; gardez le depot comme source de verite au lieu de laisser Cloudflare le remplacer par la sortie Content Signals Policy |
| Network-layer DDoS attack protection | On, toujours actif | La mitigation DDoS reseau de base est geree a l'edge Cloudflare |
| Replace insecure JavaScript libraries | On | Surtout utile pour les bibliotheques tierces connues comme `polyfill`; le risque est faible et cela peut attraper de futurs ajouts |
| Security level | Laisser **I'm Under Attack Mode** desactive | A utiliser seulement pendant un incident actif; trop disruptif comme base normale de redirecteur |
| Security.txt | Configurer avant release | Publie un chemin de contact pour les rapports de vulnerabilite |
| SSL/TLS DDoS attack protection | On, toujours actif | La mitigation DDoS de couche TLS est geree par Cloudflare |

{{< details title="Reglages de securite sans action pour un redirecteur par defaut" >}}

| Reglage | Decision de base |
| --- | --- |
| Client certificates | Ne pas configurer pour le redirecteur public sauf si une future origine/API exige mTLS |
| Endpoint Labels | Aucune action; cela appartient a l'organisation des endpoints API Shield, et le redirecteur n'expose pas d'API operateur |
| Hotlink Protection | Off; les assets du raccourcisseur sont petits, et la reutilisation d'images hors site n'est pas un comportement produit |
| IP access rules | Aucune action; preferez des custom rules precises ou Cloudflare Access plutot que de larges regles IP |
| IP lists | Aucune action sauf si des regles WAF custom ont besoin d'ensembles IP reutilisables |
| Leaked Credentials Detection | Off sauf si l'application ajoute un login par mot de passe; vanityURLs n'authentifie pas les visiteurs avec des mots de passe |
| mTLS rules | Aucune action pour un redirecteur public Worker-only |
| Rate limit authentication requests | Aucune regle par defaut; les chemins prives sont proteges par Cloudflare Access SSO, pas par un endpoint de mot de passe dans le redirecteur |
| Schema Validation | Aucune action sauf si des schemas API explicites sont ajoutes |
| User agent blocking | Aucune regle par defaut; utilisez-le seulement pour un client agressif precis, et preferez d'abord les controles bot manages ou les regles WAF |
| Web asset discovery | Aucune action; laisser la decouverte visible est correct, mais cela ne change pas le comportement de redirection |
| Zone lockdown | Aucune action pour la base du plan gratuit; Cloudflare documente Zone Lockdown comme reserve aux plans payants et recommande les custom rules pour un comportement de type allowlist |

{{< /details >}}

N'activez pas les certificats client, regles mTLS, en-tetes de localisation visiteur ou en-tetes True-Client-IP pour le raccourcisseur public sauf si un service en aval en a explicitement besoin. Le Worker recoit deja les metadonnees pays et colo Cloudflare pour les analytics agreges.

Cloudflare deplace regulierement les libelles du tableau de bord. Consultez le [changelog Cloudflare Docs](https://developers.cloudflare.com/changelog/) et les changelogs produit, surtout [Rules](https://developers.cloudflare.com/rules/changelog/) et les controles bot, lors de la mise a jour de cette page. Utilisez la capture brute dans [data/cloudflare-protection-defaults.json](https://github.com/vanityURLs/website/blob/main/data/cloudflare-protection-defaults.json) pour comparer les libelles de menus dans le temps.

### Ajouter les regles WAF

Dans Cloudflare, ouvrez **Domains** > **votre domaine court** > **Security** > **Security rules** > **Security rules**. Pour ajouter une custom rule, utilisez **Create rule** ou le menu **Show all rule types**, choisissez **Custom rules**, entrez le nom de la regle, cliquez **Edit expression**, collez une expression, choisissez l'action, puis deployez. Pour le rate limiting, utilisez plutot la rangee **Rate limiting rules**.

Les regles de securite Cloudflare s'executent avant le Worker. Utilisez-les pour le trafic qui ne devrait jamais atteindre le code applicatif.

Les expressions ci-dessous utilisent `dicai.re`; remplacez les deux hostnames par votre domaine court et son hostname `www` avant de deployer.

<table>
  <thead>
    <tr>
      <th>Regle</th>
      <th>Type de regle</th>
      <th>Action</th>
      <th>Expression</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Bloquer les probes scanner</td>
      <td>Custom rule</td>
      <td>Block</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and (
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
      <td>Bloquer les methodes inattendues</td>
      <td>Custom rule</td>
      <td>Block</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and
not http.request.method in {"GET" "HEAD" "OPTIONS"}</code></pre>
      </td>
      <td>Autorise seulement les methodes attendues par le hostname public de redirection.</td>
    </tr>
    <tr>
      <td>Challenger les clients suspects</td>
      <td>Custom rule</td>
      <td>Managed Challenge</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and
not cf.client.bot and
not starts_with(http.request.uri.path, "/_stats") and
not starts_with(http.request.uri.path, "/_tests") and
http.request.uri.path ne "/robots.txt"</code></pre>
      </td>
      <td>Exclut les bots verifies, les chemins operateur proteges et `robots.txt`.</td>
    </tr>
    <tr>
      <td>Bloquer les crawlers IA non desires</td>
      <td>Custom rule</td>
      <td>Block</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and
http.request.uri.path ne "/robots.txt" and (
  lower(http.user_agent) contains "applebot" or
  lower(http.user_agent) contains "chatgpt-user" or
  lower(http.user_agent) contains "claudebot" or
  lower(http.user_agent) contains "gptbot" or
  lower(http.user_agent) contains "perplexitybot"
)</code></pre>
      </td>
      <td>Utilisez seulement pour les crawlers non couverts par **Block AI bots**; gardez `/robots.txt` accessible.</td>
    </tr>
    <tr>
      <td>Rate limiter les candidats de liens courts</td>
      <td>Rate limiting rule</td>
      <td>Block ou challenge</td>
      <td>
        <pre><code>http.host in {"dicai.re" "www.dicai.re"} and
not cf.client.bot and
http.request.method in {"GET" "HEAD"} and
not starts_with(http.request.uri.path, "/_") and
http.request.uri.path ne "/robots.txt"</code></pre>
      </td>
      <td>Compte les misses repetes et les candidats de type scanner, pas les redirections reussies.</td>
    </tr>
  </tbody>
</table>

Collez et validez une expression complete a la fois. Deployer les regles desactivees pendant le calibrage si du trafic circule deja, puis activez-les apres verification dans Security Events.

### Decider des controles de crawlers

Dans Cloudflare, utilisez **Security** > **Settings** > **Block AI bots** pour le blocage a l'edge, et **Security** > **Settings** > **Manage your robots.txt** ou **AI Crawl Control** pour les signaux `robots.txt`.

Block AI bots est un controle d'enforcement : Cloudflare bloque les crawlers d'entrainement IA avant qu'ils atteignent le Worker. Managed `robots.txt` est un signal aux crawlers : Cloudflare peut publier une Content Signals Policy ou des directives de refus pour l'entrainement IA, mais cela change le fichier visible a `/robots.txt`.

Si le depot fournit `robots.txt`, gardez Cloudflare Managed robots.txt desactive. Cela fait du depot la source de verite et evite que Cloudflare remplace des directives intentionnelles.

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
