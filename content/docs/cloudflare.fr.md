---
aside: false
title: "Cloudflare Workers"
description: "Configuration Cloudflare recommandee pour Workers vanityURLs, domaines custom, DNS, Access, observability et protection de zone."
nav_order: 10
---

Le runtime vanityURLs actuel se deploie comme Worker Cloudflare avec assets statiques. Le Worker est l'origine du domaine court, donc utilisez un Custom Domain Worker plutot que l'ancien modele Pages `_redirects` ou DNS `AAAA 100::`.

## Carte de navigation Cloudflare

Cloudflare repartit les reglages necessaires a vanityURLs dans trois zones differentes du dashboard. Verifiez le scope du dashboard avant de modifier un reglage; etre dans le bon produit Cloudflare ne suffit pas toujours.

| Zone du dashboard | Comment y aller | Reglages vanityURLs |
|---|---|---|
| Zero Trust | Menu principal, puis Zero Trust | Applications Access, policies Access, fournisseurs d'identite, reglages Zero Trust |
| Workers & Pages | Menu principal, Build, Compute, Workers & Pages | Deploiements Worker, metriques, logs, bindings, domaines custom, reglages Worker |
| Configuration du domaine | Menu principal, Account home, puis cliquer le domaine dans le contenu principal | DNS, SSL/TLS, Security, regles WAF, AI Crawl Control, reglages Rules, Network, Caching |

Dans l'interface Cloudflare, la zone de configuration du domaine n'a pas toujours un nom de produit evident. Le meilleur repere est le nom du domaine dans la ligne du haut et un menu lateral avec DNS, SSL/TLS, Security, Rules, Network, et Caching.

Utilisez Zero Trust pour definir qui peut acceder aux chemins prives. Utilisez Workers & Pages pour le Worker lui-meme. Utilisez la configuration du domaine pour trafic, DNS, TLS, et securite de zone.

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

- `custom_domain = true`, car le Worker est l'origine de tout le hostname
- `workers_dev = false` et `preview_urls = false`, car les hostnames publics de preview ne sont pas necessaires en production
- Binding `ASSETS`, car le Worker sert les pages statiques depuis `build/`
- `run_worker_first`, car lookup, chemins proteges, blocage de probes et analytics doivent passer avant le fallback asset
- Workers Logs active, car les metriques Cloudflare sont utiles pour performance et erreurs, mais les evenements applicatifs vont dans les analytics serveur

## Configuration du domaine et protection reseau

Utilisez [Protection reseau](/fr/docs/network-protection/) pour DNS, SSL/TLS, Security, WAF, AI Crawl Control, Rules, Network, Caching, analytics de zone et le workflow Cloudflare Security Events. Gardez cette page de configuration Cloudflare concentree sur Workers & Pages, les pointeurs Access, les variables Worker, la separation observabilite, et le comportement de deploiement.

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

Le trafic bloque par WAF, AI Crawl Control, Access, ou rate limiting n'atteint pas le Worker et doit etre consulte dans Cloudflare Security Events, pas dans Umami ou Fathom.

## Build et deploiement

L'integration Git Cloudflare peut executer :

```text
npx wrangler@latest deploy --config wrangler.toml
```

Le build du depot s'execute avant deploy, copie `defaults/`, applique `custom/`, valide `v8s.json`, construit `v8s-blocklist.json` et `v8s-site-config.json`, puis copie `scripts/workers/` dans `src/` genere pour Wrangler.

Lancez la meme validation localement avant de pousser :

```bash
npm run check
```

## References

- [Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Configuration Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
