---
aside: false
title: "Documentation"
description: "Documentation v8s.link pour le Worker vanityURLs actuel, les defaults, le registre de liens, la protection et le deploiement."
---

v8s.link est l'instance publique de reference du runtime vanityURLs actuel. L'application construit maintenant un Worker Cloudflare avec assets statiques, registre `v8s.json` genere, pages par defaut, surcharges `custom/`, vues operationnelles protegees, et politique anti-abus.

Commencez par le demarrage rapide pour creer un nouveau domaine court. Utilisez les pages de reference pour personnaliser l'instance par defaut, migrer depuis l'ancien modele `.lnk`/Pages, ou verifier comment v8s.link est configure.

Pour durcir une production, lisez l'approche securite du runtime avec le guide Cloudflare. Le design repose sur un petit Worker, un registre genere, la validation au build, Cloudflare Access pour les vues privees, des regles WAF pour les abus courants, et des analytics serveur seulement pour le trafic qui atteint le Worker.

Pour les instances durables, utilisez le guide de mise a jour afin de rafraichir `defaults/` et `scripts/` tout en preservant `custom/`, `wrangler.toml`, les secrets, et la sortie generee.
