---
title: "Protéger le lookup public sans challenger les redirections"
date: 2026-06-05
author: "Benoît H. Dicaire"
description: "Comment vanityURLs utilise Cloudflare Turnstile pour la résolution lookup tout en gardant les redirections de liens courts rapides et sans challenge."
tags: ["cloudflare", "turnstile", "lookup", "sécurité"]
featured: false
---

La page lookup répond à une question utile : où mène ce lien court exact avant que je l'ouvre?

C'est bon pour la confiance et la sécurité. C'est aussi une surface de visibilité. Un script qui répète des lookups exact-slug peut apprendre des destinations sans suivre les redirections.

vanityURLs protège cette surface avec [Cloudflare Turnstile](/fr/docs/customize/network-protection/#configurer-turnstile-pour-lookup), mais ne met pas Turnstile devant les redirections ordinaires.

## Séparer Les Chemins

Gardez le chemin de redirection public simple :

- `/{slug}` reste sans challenge
- `/lookup` affiche la page lookup visiteur
- `POST /lookup/resolve` exige un token Turnstile
- `POST /_analytics/lookup` enregistre l'activité lookup après son arrivée dans le Worker

Les liens publiés, QR codes, aperçus, clients ligne de commande et contrôles uptime ne devraient pas exiger un challenge navigateur. La résolution lookup est différente parce qu'elle révèle la destination sans exécuter la redirection.

## Échouer Fermé

Le Worker traite Turnstile comme Cloudflare Access traite les pages opérationnelles privées : une configuration de protection manquante bloque la surface protégée.

Si le secret Turnstile manque, `POST /lookup/resolve` retourne `503`. Si une requête omet le token, utilise un token invalide, ou reçoit de Cloudflare `siteverify` des métadonnées hostname/action qui ne correspondent pas, elle retourne `403`.

Le widget navigateur améliore l'expérience utilisateur, mais l'appel `siteverify` côté Worker est la décision d'accès.

## Ne Pas Exposer Le Registre

Lookup est exact-match seulement. Il retourne une destination résolue, un miss, ou un état qui ne redirige pas.

Il ne liste pas les liens. Les fichiers runtime bruts comme `/v8s.json`, `/v8s-blocklist.json`, et `/v8s-site-config.json` restent bloqués en accès public direct. Le téléchargement du registre reste un chemin opérateur dans l'API stats protégée.

## Garder Les Rate Limits

Turnstile prouve une interaction navigateur. Il ne prouve pas une bonne intention.

Un vrai navigateur peut quand même demander des tokens valides et répéter des lookups exact-slug coûteux, donc gardez la règle **Rate limit short-link candidates** en place. Sur les plans qui permettent plus d'une règle de rate limiting, ajoutez des limites plus strictes pour `/lookup/resolve` et `/_analytics/lookup`.

Utilisez [Protection réseau](/fr/docs/customize/network-protection/) pour les étapes de configuration et [Sécurité runtime](/fr/docs/reference/runtime-security/) pour le comportement côté Worker.
