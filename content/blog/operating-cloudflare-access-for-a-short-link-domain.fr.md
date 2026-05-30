---
title: "Cloudflare Access n'est pas une case a cocher"
date: 2026-05-26
description: "Quand revoir les réglages Cloudflare Access et ou regarder lorsque les chemins privés vanityURLs sont bloques"
tags: ["cloudflare", "access", "opérations"]
---

Le mode d'echec est ordinaire. Quelqu'un ouvre `/_stats` dans une fenêtre de navigation privée et voit le tableau de bord au lieu de la page de connexion Cloudflare Access.

C'est tout le probleme. Les redirections publiques doivent rester publiques. Les pages opérationnelles ne devraient pas l'être.

Pour vanityURLs, [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/) à un travail etroit : garder `/_stats`, `/_tests` et les surfaces opérateur similaires privées avant que le Worker les serve. Traitez-le comme une frontiere d'accès, pas comme un souvenir de setup.

## Revoir Quand La Propriété Change

Révisez l'application Access quand :

- un mainteneur arrive ou quitte
- le domaine court passe à un nouveau compte Cloudflare
- le domaine d'équipe Access change
- le fournisseur d'identité passe du code à usage unique a GitHub, Google ou un IdP corporatif
- une capture d'ecran, un journal, une issue ou un dépôt expose des valeurs de configuration Access

Pour une instance personnelle, ce peut être une revue trimestrielle. Pour une instance d'équipe, mettez-la au même rythme que les autres revues d'accès des outils opérationnels.

## Diagnostiquer A La Bonne Couche

Le trafic bloque par Access n'atteint jamais le Worker.

Cela signifie qu'Umami et Fathom ne montreront pas ces requêtes bloquées. Les logs Worker n'expliqueront pas les echecs de connexion Access. Les bonnes preuves vivent dans les logs Cloudflare Access et les [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/).

Ce n'est pas une métrique manquante. C'est le contrôle qui fonctionne à la bonne couche. Le Worker ne devrait pas decider si une personne non authentifiee peut lire l'inventaire de liens.

## Garder Les Valeurs Sensibles Hors De Git

Le domaine d'équipe Access dans `wrangler.toml` n'est pas un secret.

Le tag Application Audience (AUD) est sensible opérationnellement. Stockez-le comme secret Worker :

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

Ne commitez pas les audiences Access, secrets client OAuth, jetons de service ou captures d'ecran qui contiennent ces valeurs. Gardez-les dans Cloudflare et dans un gestionnaire de mots de passe.

## Le Petit Depart Est Correct

Commencez avec le code à usage unique et des adresses courriel nommees.

Ensuite, testez ce qui compte :

1. Ouvrez un profil de navigateur deconnecte ou privé.
2. Visitez `https://<short-domain>/_stats`.
3. Confirmez que Cloudflare Access apparait avant le tableau de bord.
4. Repétéz pour `/_tests`.

Passez a GitHub, Google ou un IdP corporatif lorsque l'équipe ou le workflow le justifie. Remplacez les longues listes individuelles par des groupes maintenus lorsque l'offboarding devient un vrai enjeu.

Les etapes de configuration vivent dans [Contrôle d'accès](/fr/docs/customize/access-control/). Les compromis entre fournisseurs vivent dans [Choisir un fournisseur d'identité](/fr/blog/choosing-identity-provider/).
