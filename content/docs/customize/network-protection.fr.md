---
aside: false
title: "Protection reseau"
description: "Configurer les controles de domaine Cloudflare qui protegent une zone vanityURLs avant que le trafic atteigne le Worker."
weight: 70
aliases:
  - /docs/network-protection/

---

Utilisez cette page lorsque vous etes pret a configurer les controles Cloudflare devant le Worker. La protection reseau garde les abus courants, les methodes inattendues, les probes de scanners, les crawlers non desires et le bruit d'infrastructure loin du code applicatif.

Pour les reglages Cloudflare exacts et les expressions WAF, lisez [Protection reseau](/fr/docs/reference/network-protection/). Pour le raisonnement de securite par couches, lisez [Ajouter des couches de protection Cloudflare autour d'un domaine court](/fr/blog/layering-cloudflare-protection-around-a-short-link-domain/).

{{% steps %}}

### Confirmer le domaine custom du Worker

Dans **DNS**, utilisez le record Worker Custom Domain que Cloudflare cree pour le domaine court. Il devrait apparaitre comme un record Worker proxifie pour le hostname, par exemple `v8s.link -> v8s-link`.

Supprimez les anciens records synthetiques `AAAA 100::` pour le meme hostname une fois le Custom Domain actif. Gardez les records mail, DKIM, DMARC, MTA-STS et verification de propriete en DNS-only sauf si le fournisseur exige explicitement le proxy.

### Etablir la base HTTPS

Dans **SSL/TLS**, commencez avec Full strict, Universal SSL, Always Use HTTPS, TLS 1.3 et Automatic HTTPS Rewrites.

Activez HSTS seulement apres que chaque hostname et sous-domaine de production soit pret pour HTTPS. Commencez avec un max age conservateur; incluez les sous-domaines et preload seulement quand toute la zone est volontairement HTTPS-only.

### Activer les controles de securite de base

Dans **Security**, activez d'abord les controles peu surprenants : Bot Fight Mode, Browser Integrity Check, le Cloudflare managed ruleset et une valeur pratique de Challenge Passage.

Evitez les controles qui exposent des donnees visiteur supplementaires ou changent le contenu public sauf si votre instance en a besoin. `security.txt` devrait etre configure avant la release pour fournir un contact clair aux rapports de vulnerabilite.

### Ajouter les regles WAF

Dans **WAF**, ajoutez des regles pour le trafic qui ne devrait jamais atteindre le Worker :

- bloquer les probes de scanners comme `.php`, `/wp-`, `/.env` et les probes admin
- bloquer les methodes inattendues pour que les redirections publiques acceptent seulement `GET`, `HEAD` et `OPTIONS`
- challenger les clients suspects en excluant les bots verifies, les chemins operationnels proteges, les assets statiques et `robots.txt`
- bloquer les crawlers IA non desires tout en gardant `/robots.txt` lisible
- limiter les misses repetes et les candidats de type scanner plutot que les redirections reussies

Collez et validez une expression complete a la fois. Sauvegardez les regles desactivees pendant le calibrage, puis activez-les apres verification dans Security Events.

### Decider des controles de crawlers

Si votre depot fournit `robots.txt`, gardez Cloudflare Managed robots.txt desactive pour que le depot reste la source de verite.

Autorisez `/robots.txt` au minimum. Autorisez `/llms.txt` et `/llms-full.txt` seulement si vous publiez volontairement du contexte lisible par machine.

### Garder le caching conservateur

Laissez le Worker prendre les decisions de redirection. N'ajoutez pas de regles de cache pour les reponses de redirection sans avoir teste les etats de cycle de vie, les horaires, les analytics, les misses et les pages de statut.

Gardez Development Mode desactive sauf pendant un debogage actif.

### Consulter la bonne surface analytics

Utilisez les analytics Cloudflare et Security Events pour DNS, TLS, les metriques d'infrastructure Worker, WAF, rate limiting, bot, crawlers IA et decisions Access.

Utilisez les [Analytics](/fr/docs/customize/analytics/) serveur vanityURLs pour les evenements applicatifs qui atteignent le Worker, comme les pageviews, redirections, misses de liens courts, recherches expand et evenements bot normalises.

{{% /steps %}}
