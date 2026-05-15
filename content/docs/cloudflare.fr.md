---
title: "Cloudflare Workers"
description: "Deployer vanityURLs comme Worker Cloudflare avec assets statiques, registre genere, pages protegees et configuration analytics."
nav_order: 10
---

Le runtime vanityURLs actuel se deploie comme Worker Cloudflare, pas comme fichier Pages `_redirects`. Wrangler construit le site, publie `build/` comme assets statiques, et execute `src/worker.mjs` pour les redirections.

## wrangler.toml

```toml
name = "v8s-link"
main = "src/worker.mjs"
compatibility_date = "2026-05-05"
workers_dev = false
preview_urls = false

[assets]
directory = "build"
binding = "ASSETS"

[build]
command = "npm run build"
```

Utilisez votre propre nom de Worker. Gardez `main = "src/worker.mjs"`, car la source editable est copiee pendant le build.

## Pipeline de build

Le build effectue quatre taches importantes :

1. Copie `defaults/public/` dans `build/`
2. Applique `custom/public/` s'il existe
3. Genere `build/v8s.json` depuis `custom/v8s-links.txt` ou `defaults/v8s-links.txt`
4. Copie le runtime Worker vers `src/worker.mjs`

Lancez la validation complete avant de deployer :

```bash
npm run check
```

## Variables runtime

Configurez les analytics et les vues protegees avec les variables Worker :

```toml
[vars]
ANALYTICS_PROVIDER = "umami"
UMAMI_ENDPOINT = "https://cloud.umami.is/api/send"
UMAMI_WEBSITE_ID = "<umami website id>"
UMAMI_GEO_IP_MODE = "full"
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

Stockez l'audience Cloudflare Access comme secret :

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

## Chemins proteges

Creez une application Cloudflare Zero Trust self-hosted pour :

```text
v8s.link/_stats
v8s.link/_stats/*
v8s.link/_tests
v8s.link/_tests/*
```

Le Worker valide l'en-tete `Cf-Access-Jwt-Assertion`. Si Access n'est pas configure, les chemins proteges restent fermes.

## Checklist de zone

- Mode SSL/TLS : Full strict
- Always Use HTTPS : active
- TLS 1.3 : actif
- TLS minimum : 1.2 ou plus strict
- URL Normalization : active pour les URLs entrantes
- Bot Fight Mode et Browser Integrity Check : actifs
- Regles WAF : bloquer les probes et methodes inattendues
- Rate limits : proteger les liens manquants contre les rafales
