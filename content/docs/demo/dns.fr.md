---
title: "Configuration DNS"
description: "La configuration DNS complète de v8s.link et vanityurls.link, avec chaque enregistrement expliqué."
nav_order: 34
---

La configuration DNS est gérée en tant que code via [DNSControl](https://dnscontrol.org/). La source est dans [vanityURLs/dnsConfiguration](https://github.com/vanityURLs/dnsConfiguration/blob/main/domains/vanityURLs.js).

Vous n'avez **pas** besoin de DNSControl pour utiliser vanityURLs. Cette page explique ce que fait chaque enregistrement pour que vous puissiez le reproduire.

## vanityurls.link — le site de documentation

### Enregistrement principal : le site web

```js
ALIAS('@', 'website-2ax.pages.dev.', cfProxy)
```

L'ALIAS sur `@` pointe vers le projet Cloudflare Pages de la documentation. `cfProxy` (orange) active le CDN et la terminaison SSL de Cloudflare.

{{< callout type="tip" title="ALIAS vs CNAME sur la racine" >}}
Le standard DNS interdit les CNAME sur l'apex de zone (`@`). Le CNAME Flattening de Cloudflare contourne cette limitation. Utilisez toujours ALIAS pour les domaines racines.
{{< /callout >}}

### Sous-domaines : redirections pratiques

```js
AAAA("git", '2001:DB8::1', cfProxy),
CF_TEMP_REDIRECT("git.vanityurls.link/*", "https://github.com/vanityURLs/$1"),
```

Pattern en deux étapes :
1. Un enregistrement `AAAA` vers `2001:DB8::1` — une IP réservée par Cloudflare qui ne route vers aucun serveur réel
2. Une règle de redirection Cloudflare qui intercepte les requêtes

### Enregistrements de sécurité email

| Enregistrement | Objectif |
|----------------|---------|
| `DKIM *.domainkey` | Clé publique vide → bloque les emails usurpés avec DKIM |
| `DMARC _dmarc` | `p=reject` → les récepteurs rejettent tout email prétendant venir de ce domaine |
| `MTA-STS _mta-sts` | Signale que les serveurs de messagerie doivent utiliser TLS |

{{< callout type="note" title="Pourquoi des enregistrements email sur un domaine sans email ?" >}}
Sans DMARC `p=reject`, n'importe qui peut envoyer des emails d'hameçonnage semblant venir de `vanityurls.link`.
{{< /callout >}}

## v8s.link — le domaine court

### Décision architecturale clé

```js
AAAA("@", '2001:DB8::1', cfProxy),
CF_TEMP_REDIRECT("v8s.link/*", "https://vanityURLs.link/$1"),
```

**L'intégralité du domaine v8s.link redirige vers vanityURLs.link.** Tout chemin sur `v8s.link` est transmis à `vanityURLs.link` avec le même chemin.

Le projet Cloudflare Pages (`v8s-link.pages.dev`) traite les règles `_redirects` (définies par `static.lnk` et `dynamic.lnk`) en premier. La redirection DNS agit comme fallback pour les chemins non définis.

## Configuration DNS minimale pour un nouveau déploiement

{{% steps %}}

### Ajouter un CNAME (ou ALIAS) pour la racine

| Type | Nom | Cible | Proxy |
|------|-----|-------|-------|
| CNAME | `@` | `VOTRE-PROJET.pages.dev` | ✅ Proxifié |

### Ajouter le domaine personnalisé dans Cloudflare Pages

Pages → Domaines personnalisés → Configurer un domaine personnalisé.

### Ajouter DMARC (recommandé)

| Type | Nom | Contenu |
|------|-----|---------|
| TXT | `_dmarc` | `v=DMARC1;p=reject;sp=reject;adkim=s;aspf=s;` |

### Vérifier avec lnk check

```bash
lnk check /github
# 301 → https://github.com/votrenom  (43ms) ✓
```

{{% /steps %}}
