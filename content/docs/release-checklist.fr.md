---
title: "Checklist de release"
description: "Checklist production pour deployer ou mettre a jour une instance v8s sur Cloudflare."
---

Utilisez cette checklist avant de lancer une nouvelle instance ou de promouvoir une mise a jour majeure. Une instance v8s est simple, mais un domaine court attire quand meme scanners, bots, et tentatives d'abus.

## Depot

- Lancez `npm run clean`.
- Rafraichissez `defaults/` et `scripts/` upstream avec le workflow de mise a jour.
- Gardez tous les fichiers propres a l'instance dans `custom/`.
- Lancez `npm run check`.
- Relisez les changements de registre genere et de blocklist.
- Commitez et deployez depuis un working tree propre.

## Worker et assets

- Confirmez que le Worker a un binding `ASSETS`.
- Confirmez que le domaine custom pointe vers le Worker.
- Desactivez les URL publiques `workers.dev` et preview si elles ne font pas partie du service.
- Protegez `/_stats` et `/_tests` avec Cloudflare Access.
- Gardez les politiques `/_stats/*` et `/_tests/*` etroites.
- Confirmez que le Worker accepte seulement `GET`, `HEAD`, et `OPTIONS`.
- Confirmez que les assets d'implementation prives retournent 404.

## Configuration domaine Cloudflare

Dans Cloudflare, les reglages pertinents sont repartis dans trois endroits :

- **Zero Trust** : applications Access, politiques Access, identity providers, et reglages Zero Trust
- **Workers & Pages** : deploiement Worker, binding assets, variables, observabilite, domaines custom, et reglages de build
- **Configuration du domaine** : DNS, SSL/TLS, WAF, Security, AI Crawl Control, Rules, Network, Caching, et analytics

Base recommandee :

- Mode SSL/TLS : Full (strict)
- Always Use HTTPS : active
- HSTS : active apres confirmation des certificats et redirections
- TLS minimum : TLS 1.2 ou plus recent
- Bot Fight Mode ou controles bot equivalents : active quand disponible
- Controles crawler IA : bloquer les bots IA non voulus tout en permettant `/robots.txt`
- `robots.txt` gere par Cloudflare : desactive quand vous publiez vos propres fichiers depuis `defaults/public/`
- Normalisation URL : activee
- Retrait des headers `X-Powered-By` : active

## WAF et controles anti-abus

- Bloquez les probes scanner evidents avant qu'ils atteignent le Worker.
- Bloquez les methodes HTTP inattendues a l'edge.
- Challengez le trafic non-bot suspect qui vise des candidats de liens courts.
- Rate-limitez les candidats de liens courts pour proteger le CPU Worker et les quotas analytics.
- Gardez la blocklist runtime activee comme fallback applicatif.
- Relisez `defaults/v8s-blocklist-categories.json` quand les feeds generes changent.

N'utilisez pas un redirecteur pour du phishing, malware, tracking dissimule, routage affilié non divulgue, chaines de raccourcisseurs, ou toute destination qui contredit les attentes raisonnables des visiteurs.

## Analytics

- Utilisez seulement des analytics serveur; n'ajoutez pas de scripts de tracking navigateur.
- Configurez Umami ou Fathom avec les variables et secrets Worker.
- Confirmez que le trafic bloque par WAF n'est pas envoye aux analytics.
- Confirmez la collecte avec une redirection test.
- Relisez les limites de debit et quotas du fournisseur avant lancement.
- Surveillez les premieres 24 heures pour le bruit scanner qui pourrait consommer du quota.

## Legal et fichiers publics

- Publiez `robots.txt`, `llms.txt`, et `llms-full.txt` depuis `defaults/public/`, ou surchargez-les dans `custom/public/`.
- Rendez l'instance volontairement peu interessante pour les bots : c'est un moteur de redirection, pas un site public de contenu.
- Ajoutez des pages conditions, confidentialite, et contact securite adaptees au proprietaire et a la juridiction.
- Traitez le texte legal inclus comme un brouillon, pas comme un avis juridique.

La meilleure posture de release est sobre : petit Worker, registre statique revise, exposition Cloudflare etroite, pages operationnelles protegees, et propriete claire de chaque destination.
