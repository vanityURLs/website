---
title: "Exploiter Cloudflare Access pour un domaine de liens courts"
date: 2026-05-26
description: "Quand revoir les réglages Cloudflare Access et où regarder lorsque les chemins privés vanityURLs sont bloqués"
tags: ["cloudflare", "access", "operations"]
---

Cloudflare Access est facile à traiter comme une case à cocher : protéger `/_stats`, protéger `/_tests`, passer à autre chose. Cela fonctionne le premier jour, mais le contrôle d'accès devient opérationnel dès qu'une autre personne peut se connecter, qu'un domaine change de compte, ou qu'une capture d'écran expose des valeurs sensibles.

Pour vanityURLs, Access a un rôle étroit. Les redirections publiques restent publiques. Les chemins opérationnels restent privés. Le travail important consiste à garder cette frontière évidente.

### Revoir Access quand quelque chose change

Révisez votre application Access quand :

- un mainteneur arrive ou quitte
- le domaine court passe à un nouveau compte Cloudflare
- le domaine d'équipe Access change
- vous passez du code à usage unique à GitHub, Google ou un autre fournisseur d'identité
- une capture d'écran, un journal, une issue ou un dépôt expose accidentellement des valeurs de configuration Access

Pour une instance personnelle, cela peut être une revue trimestrielle rapide. Pour une instance d'équipe, cela devrait suivre le même rythme que les autres outils opérationnels.

### Savoir où va le trafic bloqué

Le trafic bloqué par Cloudflare Access n'atteint jamais le Worker. Cela signifie que :

- Umami et Fathom ne montreront pas ces requêtes bloquées
- les logs Worker vanityURLs n'expliqueront pas les échecs de connexion Access
- les logs Cloudflare Access et les Security Events sont le bon endroit pour investiguer

C'est une protection, pas une métrique manquante. Le Worker ne devrait jamais avoir à décider si une personne non authentifiée peut lire votre inventaire de liens.

### Garder les secrets hors de Git

Le domaine d'équipe Access dans `wrangler.toml` n'est pas un secret. Le Application Audience (AUD) Tag est sensible opérationnellement et devrait être stocké comme secret Worker :

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

Ne commitez pas les audiences Access, secrets client OAuth, jetons de service ou captures d'écran qui contiennent ces valeurs. Gardez-les dans Cloudflare et dans votre gestionnaire de mots de passe.

### Commencer petit, puis resserrer

Le chemin pratique est simple :

1. Commencez avec le code à usage unique et des adresses courriel nommées
2. Confirmez que les utilisateurs déconnectés voient Cloudflare Access avant `/_stats` et `/_tests`
3. Passez à GitHub, Google ou un IdP corporatif lorsque l'équipe ou le workflow le justifie
4. Remplacez les longues listes individuelles par des groupes maintenus lorsque l'offboarding devient un vrai enjeu

Les étapes de configuration vivent dans [Contrôle d'accès](/fr/docs/customize/access-control/). Les compromis entre fournisseurs vivent dans [Choisir un fournisseur d'identité](/fr/blog/choosing-identity-provider/).
