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

Ajoutez des regles WAF pour probes et methodes inattendues quand la zone demande plus que la blocklist Worker. Gardez les rate limits concentres sur les misses repetes et chemins de scanner; ne limitez pas trop agressivement les redirections normales.

## Operations protegees

Protegez ces chemins avec une application Cloudflare Zero Trust self-hosted :

```text
v8s.link/_stats
v8s.link/_stats/*
v8s.link/_tests
v8s.link/_tests/*
```

Definissez le team domain comme variable Worker et l'audience Access comme secret :

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

Le Worker valide l'en-tete `Cf-Access-Jwt-Assertion`. Si Access n'est pas configure, les chemins proteges restent fermes.

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
