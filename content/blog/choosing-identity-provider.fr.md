---
title: "Choisir un fournisseur d'identité"
date: 2026-05-22
description: "Comment choisir entre code à usage unique, GitHub, Google et d'autres fournisseurs d'identité pour sécuriser les pages opérationnelles vanityURLs"
tags: ["cloudflare", "access", "identity"]
---

Choisir un fournisseur d'identité (IdP) pour un raccourcisseur d'URL peut sembler trop lourd au départ. Cela devient plus naturel lorsqu'on réalise que certaines URL peuvent révéler tout l'inventaire de liens et des détails runtime importants. Un domaine de liens courts devient de l'infrastructure publique dès qu'il apparaît dans une signature courriel.

Pour éviter une exposition non autorisée, même pendant le premier déploiement, vanityURLs utilise [Cloudflare Access](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/secure-with-access/) pour protéger le tableau de bord.

### L'option Quickstart : code à usage unique

Pour une configuration rapide, le chemin le plus simple est le [code à usage unique](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) de Cloudflare. Cloudflare envoie un code de connexion directement aux adresses courriel approuvées, sans devoir configurer un fournisseur externe comme Google ou Okta.

Ce modèle est très efficace pour les applications peu fréquentes. Pour un outil utilisé tous les jours, je préfère habituellement configurer un IdP dédié afin d'éviter la fatigue des courriels. Le premier fournisseur prend plus de temps; les suivants deviennent beaucoup plus rapides.

### Sélectionner le bon IdP

Avant de choisir, posez-vous trois questions : *Qui doit accéder aujourd'hui ? Qui devra accéder lorsque l'instance grandira ? Est-ce facile de retirer l'accès plus tard ?*

- **[GitHub](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/github/)** convient bien lorsque toute l'équipe utilise déjà GitHub. Les politiques Access peuvent viser des utilisateurs précis, des adresses courriel ou l'appartenance à une organisation GitHub
- **[Google](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google/)** est naturel si les mainteneurs utilisent Gmail ou Google Workspace
- **IdP corporatif, comme [Microsoft Entra ID](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/entra-id/)** convient lorsque l'organisation gère déjà les identités et l'offboarding

Le sélecteur de politique compte autant que le fournisseur. Une instance personnelle peut commencer avec des adresses courriel nommées. Une instance d'équipe devrait éventuellement utiliser un groupe maintenu, une organisation GitHub ou un sélecteur IdP afin que la revue d'accès suive le même processus d'arrivée et de départ que le reste de l'équipe.

### Flexible par design

Vous pouvez commencer avec le code à usage unique et ajouter des fournisseurs d'identité plus tard pour la même application. Le premier choix ne doit pas figer l'architecture.

Si une personne utilise la même adresse courriel dans plusieurs fournisseurs, il n'y a pas de conflit technique :

1. La personne choisit son fournisseur sur la page de connexion
2. Cloudflare valide l'identité retournée par ce fournisseur
3. Si une politique autorise `user@example.com`, la connexion réussit tant que le fournisseur choisi vérifie cette adresse

### Sécuriser aujourd'hui, grandir demain

Ne laissez pas la décision bloquer le déploiement. Si vous démarrez vanityURLs, commencez avec le **code à usage unique** pour protéger le tableau de bord immédiatement. Lorsque l'équipe ou le workflow évolue, ajoutez GitHub, Google ou un IdP corporatif.

Pour configurer l'application, suivez [Contrôle d'accès](/fr/docs/customize/access-control/). Une fois en production, utilisez [Exploiter Cloudflare Access pour un domaine de liens courts](/fr/blog/operating-cloudflare-access-for-a-short-link-domain/) comme checklist de revue.
