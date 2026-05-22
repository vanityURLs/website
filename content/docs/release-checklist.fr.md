---
aside: false
title: "Checklist de release"
description: "Checklist production pour deployer ou mettre a jour une instance v8s sur Cloudflare."
---

Utilisez cette checklist avant de lancer une nouvelle instance ou de promouvoir une mise a jour majeure. Une instance vanityURLs est robuste, mais tout ce qui brille sur internet attire scanners, bots, et tentatives d'abus.

## Depot

- Lancez `npm run clean`
- Rafraichissez `defaults/` et `scripts/` upstream avec le workflow de mise a jour
- Gardez tous les fichiers propres a l'instance dans `custom/`
- Gardez les changements runtime Worker dans `scripts/workers/`; traitez `src/` comme genere
- Lancez `npm run check`
- Relisez les changements de registre genere, politique runtime, et configuration de site
- Commitez et deployez depuis un working tree propre

## Worker et assets

- Confirmez que le Worker a un binding `ASSETS`
- Confirmez que le domaine custom pointe vers le Worker
- Desactivez les URL publiques `workers.dev` et preview si elles ne font pas partie du service
- Protegez `/_stats` et `/_tests` avec Cloudflare Access
- Gardez les politiques `/_stats/*` et `/_tests/*` etroites
- Confirmez que le Worker accepte seulement `GET`, `HEAD`, et `OPTIONS`
- Confirmez que les fichiers runtime bruts retournent 404 : `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json`
- Confirmez que les headers incluent `X-Generated-By: vanityURLs.link` sauf surcharge intentionnelle

## Configuration domaine Cloudflare

Dans Cloudflare, les reglages pertinents sont repartis dans trois endroits :

- **Zero Trust** : {{< arrow left >}} documentation [Controle d'acces](/docs/access-control/)
  - Applications et politiques Access
  - Fournisseurs d'identite
  - Reglages
- **Workers & Pages** : {{< arrow left >}} documentation [Workers](/docs/quickstart/#connect-the-repository-to-workers--pages) et [wrangler.toml](/blog/wrangler/#keep-wranglertoml-close-to-the-deployment-boundary)
  - deploiement
  - binding assets
  - variables
  - observabilite
  - domaines custom
  - reglages de build
- **Configuration du domaine** : {{< arrow left >}} documentation [Protection reseau](/fr/docs/network-protection/)
  - AI Crawl Control
  - Analytics
  - Caching
  - DNS
  - Network
  - Rules
  - Security
  - SSL/TLS
  - WAF

Utilisez [Protection reseau](/fr/docs/network-protection/) pour les reglages recommandes de DNS, SSL/TLS, Security, WAF, AI Crawl Control, Rules, Network, Caching, et analytics Cloudflare.

## Controles anti-abus

- Gardez la blocklist runtime activee comme fallback applicatif apres les controles reseau Cloudflare
- Relisez `defaults/v8s-blocklist-categories.json` quand les feeds generes changent
- Gardez la politique source editable dans `custom/v8s-policies.json`; traitez `build/v8s-blocklist.json` comme sortie generee

N'utilisez pas un redirecteur pour du phishing, malware, tracking dissimule, routage affilié non divulgue, chaines de raccourcisseurs, ou toute destination qui contredit les attentes raisonnables des visiteurs.

## Analytics

- Utilisez seulement des analytics serveur; n'ajoutez pas de scripts de tracking navigateur
- Configurez Umami ou Fathom avec les variables et secrets Worker
- Confirmez que le trafic bloque par [Protection reseau](/fr/docs/network-protection/) n'est pas envoye aux analytics
- Confirmez la collecte avec une redirection test
- Relisez les limites de debit et quotas du fournisseur avant lancement
- Surveillez les premieres 24 heures pour le bruit scanner qui pourrait consommer du quota

## Legal et fichiers publics

- Publiez `robots.txt`, `llms.txt`, et `llms-full.txt` depuis `defaults/public/`, ou surchargez-les dans `custom/public/`
- Rendez l'instance volontairement peu interessante pour les bots : c'est un moteur de redirection, pas un site public de contenu
- Confirmez que `v8s-site-config.json` liste les bonnes `supported_languages`
- Ajoutez ou personnalisez les pages conditions, confidentialite, abus, et contact securite adaptees au proprietaire et a la juridiction
- Traitez le texte legal inclus comme un brouillon, pas comme un avis juridique

## Branding et outillage local

- Utilisez `npm run setup` pour des pages `custom/public` gerees par l'installateur et un wordmark en deux couleurs
- Confirmez que les badges de redirection localises existent pour les langues supportees
- Lancez `npm run optimize:badges` apres modification des SVG de badge par defaut
- Lancez `npm run local-install` si le proprietaire veut le helper shell, le registre local et `lnk` installe
- Utilisez `npm run local-publish` seulement depuis un poste proprietaire qui doit valider, commit et pousser les chemins locaux configures

La meilleure posture de release est sobre : petit Worker, registre statique revise, exposition Cloudflare etroite, pages operationnelles protegees, et propriete claire de chaque destination.
