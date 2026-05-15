---
title: "Cloudflare Workers"
description: "Configuration Cloudflare recommandee pour Workers vanityURLs, domaines custom, DNS, Access, observability et protection de zone."
nav_order: 10
---

Le runtime vanityURLs actuel se deploie comme Worker Cloudflare avec assets statiques. Le Worker est l'origine du domaine court, donc utilisez un Custom Domain Worker plutot que l'ancien modele Pages `_redirects` ou DNS `AAAA 100::`.

## Forme Worker recommandee

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-05"
workers_dev = false
preview_urls = false

[build]
command = "npm run build"

[assets]
directory = "./build"
binding = "ASSETS"
not_found_handling = "404-page"
run_worker_first = [
  "/*",
  "!/*.css",
  "!/*.js",
  "!/*.png",
  "!/*.svg",
  "!/*.ico",
  "!/*.webmanifest",
  "!/*.txt",
  "!/*.xml",
  "!/fonts/*",
]

[[routes]]
pattern = "v8s.link"
custom_domain = true

[observability]
[observability.logs]
enabled = true
invocation_logs = true
```

Les points importants :

- `custom_domain = true`, car le Worker est l'origine de tout le hostname.
- `workers_dev = false` et `preview_urls = false`, car les hostnames publics de preview ne sont pas necessaires en production.
- Binding `ASSETS`, car le Worker sert les pages statiques depuis `build/`.
- `run_worker_first`, car lookup, chemins proteges, blocage de probes et analytics doivent passer avant le fallback asset.
- Workers Logs active, car les metriques Cloudflare sont utiles pour performance et erreurs, mais les evenements applicatifs vont dans les analytics serveur.

## DNS et domaines

Pour le domaine court racine, preferez la ligne Worker Custom Domain creee par Cloudflare. Elle doit apparaitre comme record Worker proxifie pour le hostname, par exemple `v8s.link -> v8s-link`.

Evitez de garder les anciens records synthetiques `AAAA 100::` pour le meme hostname une fois le Custom Domain actif. Gardez les records mail, DKIM, DMARC, MTA-STS et verification en DNS-only sauf exigence contraire du service.

Utilisez des records proxifies separes seulement pour de vrais sous-domaines web comme `mta-sts`, `www`, ou un site de docs.

## Securite de zone

Posture recommandee sur le plan gratuit :

| Reglage | Recommandation |
|---|---|
| DNS setup | Full |
| SSL/TLS mode | Full strict |
| Always Use HTTPS | On |
| TLS 1.3 | On |
| TLS minimum | 1.2 ou plus strict |
| Bot Fight Mode | On |
| Block AI crawlers | Toutes les pages, sauf choix explicite |
| Development Mode | Off |
| Under Attack Mode | Off sauf incident actif |
| Manage robots.txt | Disabled si le depot fournit deja `robots.txt` |
| Browser Integrity Check | On |
| URL Normalization | Normaliser les URLs entrantes |

Pour SSL/TLS, partez avec `Full (strict)`, Universal SSL actif, Always Use HTTPS active, TLS 1.3 active, et TLS minimum 1.2. Activez HSTS seulement quand tous les hostnames et sous-domaines de production sont prets pour HTTPS. Un max age d'un mois est un bon premier reglage; incluez les sous-domaines et preload seulement quand toute la zone est volontairement HTTPS-only.

Gardez Automatic HTTPS Rewrites actif. Certificate Transparency Monitoring est optionnel, mais utile si le proprietaire du compte veut recevoir des alertes email pour les certificats inattendus.

## WAF et rate limiting

Les regles de securite Cloudflare s'executent avant le Worker. Utilisez-les pour le trafic qui ne devrait jamais consommer de CPU Worker, puis gardez la blocklist Worker comme fallback applicatif.

Jeu de regles recommande :

| Regle | Action | Notes |
|---|---|---|
| Block scanner probes | Block | Cible les chemins d'exploit comme `.php`, `/wp-`, `/.env`, et les probes admin. |
| Block unexpected methods | Block | Autorise seulement `GET`, `HEAD`, et `OPTIONS` pour le hostname public. |
| Challenge suspicious clients | Managed Challenge | Exclut les bots verifies, `/_stats`, `/_tests`, les assets statiques, et `robots.txt`. |
| Block unwanted AI crawlers | Block | Exclut `/robots.txt`; cible les user agents que vous ne voulez pas servir. |
| Rate limit short-link candidates | Block ou challenge | Compte les misses repetes et candidats suspects, pas les redirections reussies. |

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

Gardez la liste exacte de crawlers IA dans Cloudflare, pas dans la documentation publique, parce que les noms de crawlers et les choix de politique changent. Au minimum, laissez `/robots.txt` autorise pour que les crawlers lisent la politique publiee.

## Politique crawlers IA

Si le depot fournit `robots.txt`, gardez Cloudflare Managed robots.txt desactive. Le depot reste ainsi la source de verite et Cloudflare ne remplace pas des directives intentionnelles.

Utilisez AI Crawl Control ou une regle WAF sur user-agent si vous voulez que Cloudflare bloque certains crawlers IA avant le Worker. Reproduisez la meme politique dans `robots.txt` pour la transparence, mais traitez `robots.txt` comme advisory et la regle WAF comme enforcement.

Defaults utiles :

- Autoriser `/robots.txt`.
- Bloquer les crawlers IA et assistants IA non desires dans Cloudflare.
- Garder les crawlers de moteurs de recherche verifies autorises sauf instance volontairement privee.
- Revoir Cloudflare Security Events apres activation, car le trafic bloque n'apparait pas dans les analytics Worker.

## Operations protegees

Protegez ces chemins avec une application Cloudflare Zero Trust self-hosted :

```text
v8s.link/_stats
v8s.link/_stats/*
v8s.link/_tests
v8s.link/_tests/*
```

Utilisez une seule application Access self-hosted pour ces operations privees. Configurez les destinations exactement, puis attachez un modele default-deny avec une seule policy allow pour les mainteneurs.

Reglages Access recommandes :

| Reglage | Recommandation |
|---|---|
| Type d'application | Self-hosted |
| Public hostnames | `v8s.link/_stats`, `v8s.link/_stats/*`, `v8s.link/_tests`, `v8s.link/_tests/*` |
| Policy | Autoriser les emails mainteneurs nommes ou un groupe d'identite maintenu |
| Session duration | 24 heures |
| MFA | Respecter l'enforcement global ou l'exiger dans la policy |
| Browser rendering | Off |
| Identity providers | Utiliser les IdP du compte comme GitHub, Google Workspace, ou Okta |

Ne commitez pas les app IDs de fournisseurs d'identite, client secrets, Access audiences, ou service tokens. Gardez-les dans Cloudflare Zero Trust et les secrets Worker. Faites une rotation des secrets fournisseur s'ils apparaissent dans une capture d'ecran, un log, ou un depot.

Definissez le team domain comme variable Worker et l'audience Access comme secret :

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

Le Worker valide l'en-tete `Cf-Access-Jwt-Assertion`. Si Access n'est pas configure, les chemins proteges restent fermes.

Testez la policy depuis Cloudflare Zero Trust avant release, puis visitez `/_stats` et `/_tests` depuis un profil de navigateur deconnecte pour confirmer que les deux chemins sont refuses.

## Partage observability

Utilisez les dashboards Cloudflare pour les signaux infrastructure :

- DNS, certificat, et statut TLS
- Worker requests, errors, CPU time, wall time, et request duration
- Evenements WAF, rate limiting, bot, et crawler IA
- Decisions de login Access pour les chemins proteges

Utilisez les analytics serveur vanityURLs pour les evenements applicatifs :

- pageviews
- redirects
- short-link misses
- expand lookups
- evenements bot normalises qui atteignent le Worker

Le trafic bloque par WAF, AI Crawl Control, Access, ou rate limiting n'atteint pas le Worker et doit etre consulte dans Cloudflare Security Events, pas dans Umami, Fathom, ou Analytics Engine.

## Build et deploiement

L'integration Git Cloudflare peut executer :

```text
npx wrangler@latest deploy --config wrangler.toml
```

Le build du depot s'execute avant deploy, copie `defaults/`, applique `custom/`, valide `v8s.json`, et copie le Worker runtime dans `src/worker.mjs`.

Lancez la meme validation localement avant de pousser :

```bash
npm run check
```

## References

- [Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Configuration Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
